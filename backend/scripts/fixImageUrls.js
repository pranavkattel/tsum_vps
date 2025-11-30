import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';

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

function findMatchingParenIndex(text, startIndex) {
  let depth = 0;
  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

async function extractMockProducts(tsText) {
  const origMarker = 'const originalProducts';
  const phaseMarker = 'const phase2Products';

  const origIdx = tsText.indexOf(origMarker);
  const phaseIdx = tsText.indexOf(phaseMarker);

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

    let rawArray = tsText.slice(arrayStart, arrayEnd + 1);
    rawArray = rawArray.replace(/\b(as|as any|as Product)\b/g, '');
    rawArray = rawArray.replace(/:\s*Product\[\]|:\s*Product\[]/g, '');
    rawArray = rawArray.replace(/\/\*[\s\S]*?\*\//g, '');
    rawArray = rawArray.replace(/\/\/.*$/gm, '');
    rawArray = rawArray.replace(/(const|let)\s+([A-Za-z0-9_$]+)\s*:\s*[^=;]+/g, '$1 $2');
    rawArray = rawArray.replace(/\s+as\s+[A-Za-z0-9_<>,\[\]]+;?/g, '');

    const script = `const mockProducts = ${rawArray}; mockProducts;`;
    // extra cleanup to remove stray TypeScript tokens that survived earlier replacements
    let cleanedScript = script.replace(/}\s*Product\s*;/g, '};').replace(/\bProduct\b\s*;/g, ';');
    cleanedScript = cleanedScript.replace(/\s+as\s+[A-Za-z0-9_<>,\[\]]+;?/g, '');
    cleanedScript = cleanedScript.replace(/\bProduct\b/g, '');
    const context = { Math, Date };
    const result = vm.runInNewContext(cleanedScript, context);
    if (!Array.isArray(result)) throw new Error('Parsed mockProducts is not an array');
    return result;
  }

  let origArrayText = '[]';
  if (origIdx !== -1) {
    const assignIdx = tsText.indexOf('=', origIdx);
    const arrayStart = tsText.indexOf('[', assignIdx);
    if (arrayStart !== -1) {
      const arrayEnd = findMatchingBracketIndex(tsText, arrayStart);
      if (arrayEnd !== -1) {
        let endIdx = arrayEnd + 1;
        // include trailing .map(...) calls if present
        const after = tsText.slice(endIdx, endIdx + 20);
        const mapMatch = after.match(/\s*\.map\s*\(/);
        if (mapMatch) {
          const parenStart = tsText.indexOf('(', endIdx);
          const parenEnd = findMatchingParenIndex(tsText, parenStart);
          if (parenEnd !== -1) endIdx = parenEnd + 1;
        }
        origArrayText = tsText.slice(arrayStart, endIdx);
      }
    }
  }

  let phaseArrayText = '[]';
  if (phaseIdx !== -1) {
    const assignIdx = tsText.indexOf('=', phaseIdx);
    const arrayStart = tsText.indexOf('[', assignIdx);
    if (arrayStart !== -1) {
      const arrayEnd = findMatchingBracketIndex(tsText, arrayStart);
      if (arrayEnd !== -1) {
        let endIdx = arrayEnd + 1;
        const after = tsText.slice(endIdx, endIdx + 40);
        const mapMatch = after.match(/\s*\.map\s*\(/);
        if (mapMatch) {
          const parenStart = tsText.indexOf('(', endIdx);
          const parenEnd = findMatchingParenIndex(tsText, parenStart);
          if (parenEnd !== -1) endIdx = parenEnd + 1;
        }
        phaseArrayText = tsText.slice(arrayStart, endIdx);
      }
    }
  }

  let cleanOrig = origArrayText.replace(/\b(as|as any|as Product)\b/g, '');
  let cleanPhase = phaseArrayText.replace(/\b(as|as any|as Product)\b/g, '');
  cleanOrig = cleanOrig.replace(/:\s*Product\[\]|:\s*Product\[]/g, '');
  cleanPhase = cleanPhase.replace(/:\s*Product\[\]|:\s*Product\[]/g, '');
  cleanOrig = cleanOrig.replace(/\/\*[\s\S]*?\*\//g, '');
  cleanPhase = cleanPhase.replace(/\/\*[\s\S]*?\*\//g, '');
  cleanOrig = cleanOrig.replace(/\/\/.*$/gm, '');
  cleanPhase = cleanPhase.replace(/\/\/.*$/gm, '');
  cleanOrig = cleanOrig.replace(/(const|let)\s+([A-Za-z0-9_$]+)\s*:\s*[^=;]+/g, '$1 $2');
  cleanPhase = cleanPhase.replace(/(const|let)\s+([A-Za-z0-9_$]+)\s*:\s*[^=;]+/g, '$1 $2');
  cleanOrig = cleanOrig.replace(/\s+as\s+[A-Za-z0-9_<>,\[\]]+;?/g, '');
  cleanPhase = cleanPhase.replace(/\s+as\s+[A-Za-z0-9_<>,\[\]]+;?/g, '');

  const script = `const originalProducts = ${cleanOrig};\nconst phase2Products = ${cleanPhase};\nconst mockProducts = [...originalProducts, ...phase2Products];\nmockProducts;`;
  // Final cleanup for combined script: remove stray 'Product' tokens and casts
  let cleanedScript = script.replace(/}\s*Product\s*;/g, '};').replace(/\bProduct\b\s*;/g, ';');
  cleanedScript = cleanedScript.replace(/\s+as\s+[A-Za-z0-9_<>,\[\]]+;?/g, '');
  cleanedScript = cleanedScript.replace(/\bProduct\b/g, '');
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
      let s = img.trim();
      s = s.replace(/\\\\/g, '/');
      if (s.startsWith('/src/images/')) return s.replace('/src/images/', '/images/');
      if (s.startsWith('src/images/')) return s.replace('src/images/', '/images/');
      if (s.startsWith('./src/images/')) return s.replace('./src/images/', '/images/');
      if (s.startsWith('./images/')) return s.replace('./images/', '/images/');
      if (s.startsWith('/images/')) return s;
      const idx = s.indexOf('images/');
      if (idx !== -1) return '/' + s.slice(idx);
      return s;
    });
  }
  return p;
}

async function fixImages() {
  try {
    await connectDB();
    console.log('Connected to DB — reading frontend mock data...');

    const tsText = await fs.readFile(FRONTEND_MOCK_PATH, 'utf8');
    const products = await extractMockProducts(tsText);
    console.log(`Parsed ${products.length} frontend mock products`);

    const imgMap = new Map();
    const imgMapByNormalized = new Map();
    function normalizeKey(s) {
      if (!s) return null;
      return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    for (const pRaw of products) {
      const p = normalizeImagePaths(pRaw);
      const id = p.id || p._id || (pRaw && pRaw.name ? pRaw.name.replace(/\s+/g, '-').toUpperCase() : null);
      if (!id) continue;
      const images = Array.isArray(p.images) ? p.images.filter(Boolean).map(s => (typeof s === 'string' ? s : '')).filter(Boolean) : [];
      const useful = images.filter(x => !/placeholder/i.test(x));
        const chosen = useful.length ? useful : images;
        imgMap.set(id, chosen);
        // also index by normalized id and normalized name (if present)
        const nId = normalizeKey(id);
        if (nId) imgMapByNormalized.set(nId, chosen);
        if (p.name) {
          const nName = normalizeKey(p.name);
          if (nName) imgMapByNormalized.set(nName, chosen);
        }
    }

    console.log(`Mapped ${imgMap.size} frontend products to image lists`);

    const allDb = await Product.find({}).lean();
    let updated = 0;
    let skipped = 0;
    let noMatch = 0;
    const unmatchedExamples = [];
    for (const dbp of allDb) {
      const curImgs = Array.isArray(dbp.images) ? dbp.images : [];
      const onlyPlaceholder = curImgs.length === 0 || (curImgs.length === 1 && /placeholder/i.test(String(curImgs[0] || '')));
      if (!onlyPlaceholder) {
        skipped++;
        continue;
      }

      const key = dbp.id || dbp._id || dbp.name;
      let newImgs = imgMap.get(key);
      if (!newImgs) {
        // try normalized id/name match
        const nk = normalizeKey(dbp.id || dbp._id || '');
        if (nk && imgMapByNormalized.has(nk)) newImgs = imgMapByNormalized.get(nk);
        if (!newImgs && dbp.name) {
          const nn = normalizeKey(dbp.name);
          if (nn && imgMapByNormalized.has(nn)) newImgs = imgMapByNormalized.get(nn);
        }
      }
      if (!newImgs || newImgs.length === 0) {
        noMatch++;
        if (unmatchedExamples.length < 20) {
          const nkCheck = normalizeKey(dbp.id || dbp._id || '');
          const nameNorm = dbp.name ? normalizeKey(dbp.name) : null;
          unmatchedExamples.push({
            _id: dbp._id,
            id: dbp.id,
            name: dbp.name,
            currentImages: curImgs,
            imgMapHasKey: imgMap.has(dbp.id),
            normKey: nkCheck,
            imgMapByNormalizedHasKey: nkCheck ? imgMapByNormalized.has(nkCheck) : false,
            nameNorm,
            imgMapByNormalizedHasName: nameNorm ? imgMapByNormalized.has(nameNorm) : false,
          });
        }
        continue;
      }

      try {
        await Product.updateOne({ _id: dbp._id }, { $set: { images: newImgs } });
        console.log(`Updated images for ${dbp.id || dbp._id} — set ${newImgs.length} images`);
        updated++;
      } catch (err) {
        console.error('Failed to update', dbp._id, err && err.stack ? err.stack : err);
      }
    }

    console.log(`Fix complete. Updated: ${updated}; Skipped (already had images): ${skipped}; No match in frontend: ${noMatch}`);
    if (unmatchedExamples.length) {
      console.log('Sample unmatched products (up to 20):');
      for (const u of unmatchedExamples) {
        console.log(` - _id:${u._id} id:${u.id} name:${u.name} currentImages:${JSON.stringify(u.currentImages)} imgMapHasKey:${u.imgMapHasKey} normKey:${u.normKey} imgMapByNormalizedHasKey:${u.imgMapByNormalizedHasKey} nameNorm:${u.nameNorm} imgMapByNormalizedHasName:${u.imgMapByNormalizedHasName}`);
      }
    }
    process.exit(0);
  } catch (err) {
    console.error('fixImages failed', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) fixImages();

export default fixImages;
