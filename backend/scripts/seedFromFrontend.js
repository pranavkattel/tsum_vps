import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const FRONTEND_MOCK_PATH = path.resolve('..', 'src', 'data', 'mockData.ts');

function findMatchingBracketIndex(text, startIndex) {
  let depth = 0;
  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

async function extractMockProducts(tsText) {
  // Try to extract both originalProducts and phase2Products (frontend file composes mockProducts from them)
  const origMarker = 'const originalProducts';
  const phaseMarker = 'const phase2Products';

  const origIdx = tsText.indexOf(origMarker);
  const phaseIdx = tsText.indexOf(phaseMarker);

  // If neither individual array is present, fall back to extracting the exported mockProducts array
  if (origIdx === -1 && phaseIdx === -1) {
    const marker = 'export const mockProducts';
    const idx = tsText.indexOf(marker);
    if (idx === -1) throw new Error('mockProducts export not found in frontend file');

    const assignIdx = tsText.indexOf('=', idx);
    if (assignIdx === -1) throw new Error('Could not find assignment for mockProducts');

    const arrayStart = tsText.indexOf('[', assignIdx);
    if (arrayStart === -1) throw new Error('Could not find start of product array');

    const arrayEnd = findMatchingBracketIndex(tsText, arrayStart);
    if (arrayEnd === -1) throw new Error('Could not find end of product array');

    const rawArray = tsText.slice(arrayStart, arrayEnd + 1);
    let jsArray = rawArray.replace(/\b(as|as any|as Product)\b/g, '');
    jsArray = jsArray.replace(/:\s*Product\[\]|:\s*Product\[]/g, '');
    jsArray = jsArray.replace(/\/\*[\s\S]*?\*\//g, '');
    jsArray = jsArray.replace(/\/\/.*$/gm, '');

    // Remove TypeScript local variable type annotations that may appear inside mapped helpers
    jsArray = jsArray.replace(/(const|let)\s+([A-Za-z0-9_$]+)\s*:\s*[^=;]+/g, '$1 $2');
    // Remove "as Type" casting patterns like "} as Product;" or "value as string[]"
    jsArray = jsArray.replace(/\s+as\s+[A-Za-z0-9_<>,\[\]]+;?/g, '');

    const script = `const mockProducts = ${jsArray}; mockProducts;`;
    // Final cleanup for fallback script: remove leftover 'Product' tokens from cast stripping
    const cleanedScript = script.replace(/}\s*Product\s*;/g, '};').replace(/\s+Product\s*;/g, ';');
    // cleanedScript prepared
    const context = { Math, Date };
    const result = vm.runInNewContext(cleanedScript, context);
    if (!Array.isArray(result)) throw new Error('Parsed mockProducts is not an array');
    return result;
  }

  // Extract originalProducts
  let origArrayText = '[]';
  if (origIdx !== -1) {
    const assignIdx = tsText.indexOf('=', origIdx);
    const arrayStart = tsText.indexOf('[', assignIdx);
    if (arrayStart !== -1) {
      const arrayEnd = findMatchingBracketIndex(tsText, arrayStart);
      if (arrayEnd !== -1) origArrayText = tsText.slice(arrayStart, arrayEnd + 1);
    }
  }

  // Extract phase2Products
  let phaseArrayText = '[]';
  if (phaseIdx !== -1) {
    const assignIdx = tsText.indexOf('=', phaseIdx);
    const arrayStart = tsText.indexOf('[', assignIdx);
    if (arrayStart !== -1) {
      const arrayEnd = findMatchingBracketIndex(tsText, arrayStart);
      if (arrayEnd !== -1) phaseArrayText = tsText.slice(arrayStart, arrayEnd + 1);
    }
  }

  // Clean TypeScript-only tokens/comments
  let cleanOrig = origArrayText.replace(/\b(as|as any|as Product)\b/g, '');
  let cleanPhase = phaseArrayText.replace(/\b(as|as any|as Product)\b/g, '');
  cleanOrig = cleanOrig.replace(/:\s*Product\[\]|:\s*Product\[]/g, '');
  cleanPhase = cleanPhase.replace(/:\s*Product\[\]|:\s*Product\[]/g, '');
  cleanOrig = cleanOrig.replace(/\/\*[\s\S]*?\*\//g, '');
  cleanPhase = cleanPhase.replace(/\/\*[\s\S]*?\*\//g, '');
  cleanOrig = cleanOrig.replace(/\/\/.*$/gm, '');
  cleanPhase = cleanPhase.replace(/\/\/.*$/gm, '');

  // Remove TypeScript variable type annotations inside the extracted snippets (e.g. "const angles: string[] = [];")
  cleanOrig = cleanOrig.replace(/(const|let)\s+([A-Za-z0-9_$]+)\s*:\s*[^=;]+/g, '$1 $2');
  cleanPhase = cleanPhase.replace(/(const|let)\s+([A-Za-z0-9_$]+)\s*:\s*[^=;]+/g, '$1 $2');
  // Remove 'as Type' casts left over
  cleanOrig = cleanOrig.replace(/\s+as\s+[A-Za-z0-9_<>,\[\]]+;?/g, '');
  cleanPhase = cleanPhase.replace(/\s+as\s+[A-Za-z0-9_<>,\[\]]+;?/g, '');

  const script = `const originalProducts = ${cleanOrig};\nconst phase2Products = ${cleanPhase};\nconst mockProducts = [...originalProducts, ...phase2Products];\nmockProducts;`;
  // Final cleanup for combined script
  let cleanedScript = script.replace(/}\s*Product\s*;/g, '};');
  cleanedScript = cleanedScript.replace(/\s+Product\s*;/g, ';');
  // cleanedScript prepared
  const context = { Math, Date };
  const result = vm.runInNewContext(cleanedScript, context);
  if (!Array.isArray(result)) throw new Error('Parsed mockProducts is not an array after combining parts');
  return result;
}

function normalizeImagePaths(product) {
  const p = { ...product };
  if (Array.isArray(p.images)) {
    p.images = p.images.map(img => {
      if (typeof img !== 'string') return img;
      // Images are already in correct format from mockData.ts: /IMG-*.jpg
      return img;
    });
  }
  return p;
}

async function seed() {
  try {
    await connectDB();
    console.log('Connected to DB — extracting frontend mock data...');

    const tsText = await fs.readFile(FRONTEND_MOCK_PATH, 'utf8');
    const products = await extractMockProducts(tsText);
    console.log(`Parsed ${products.length} products from frontend mock file`);

    let upserted = 0;
    let errors = 0;
    for (const prodRaw of products) {
      const prod = normalizeImagePaths(prodRaw);
      // Ensure required fields
      if (!prod.id) {
        prod.id = prod._id || `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      }
      // Only set fallback if images is truly missing - don't override existing arrays
      if (!prod.images || !Array.isArray(prod.images) || prod.images.length === 0) {
        prod.images = ['/IMG-20250704-WA0001.jpg'];
      }
      // Default stock if missing
      prod.stock = typeof prod.stock === 'number' ? prod.stock : 5;

      try {
        // Use upsert so we guarantee the product exists in DB and to avoid silent skips
        const res = await Product.updateOne({ id: prod.id }, { $set: prod }, { upsert: true });
        // res may contain upsertedId when inserted, or matchedCount/modifiedCount when updated
        if (res.upsertedCount && res.upsertedCount > 0) {
          upserted++;
          console.log(`Upserted new product: ${prod.id} — ${prod.name || '(no-name)'}`);
        } else if (res.modifiedCount && res.modifiedCount > 0) {
          console.log(`Updated existing product: ${prod.id} — ${prod.name || '(no-name)'} (modified)`);
        } else if (res.matchedCount && res.matchedCount > 0) {
          console.log(`Existing product left unchanged: ${prod.id} — ${prod.name || '(no-name)'} (matched)`);
        } else {
          // Some drivers return different shapes; attempt to detect upsert via upsertedId
          if (res.upsertedId) {
            upserted++;
            console.log(`Upserted (id) product: ${prod.id} — ${prod.name || '(no-name)'} (upsertedId)`);
          } else {
            console.log(`No-op for product: ${prod.id} — ${prod.name || '(no-name)'}; raw result:`, res);
          }
        }
      } catch (err) {
        errors++;
        console.error('Error upserting product', prod.id, prod.name || '', err && err.stack ? err.stack : err);
      }
    }

    console.log(`Products upserted/created: ${upserted}; errors: ${errors}`);

    // Create sample users
    const adminEmail = 'admin@example.com';
    const demoEmail = 'demo@example.com';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const adminUser = new User({ firstName: 'Admin', lastName: 'User', email: adminEmail, password: 'test@123', role: 'admin' });
      await adminUser.save();
      console.log('Created admin user:', adminEmail);
    } else {
      console.log('Admin user already exists:', adminEmail);
    }

    const existingDemo = await User.findOne({ email: demoEmail });
    if (!existingDemo) {
      const demoUser = new User({ firstName: 'Demo', lastName: 'Buyer', email: demoEmail, password: 'test@123', role: 'customer' });
      await demoUser.save();
      console.log('Created demo user:', demoEmail);
    } else {
      console.log('Demo user already exists:', demoEmail);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  seed();
}

export default seed;
