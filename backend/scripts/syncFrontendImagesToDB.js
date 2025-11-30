import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';

const FRONTEND_MOCK_PATH = path.resolve('..', 'src', 'data', 'mockData.ts');
const PUBLIC_DIR = path.resolve('..', 'public');

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
  // reuse the previous robust extraction logic similar to fixImageUrls
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

function normalizeKey(s) {
  if (!s) return '';
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function buildPublicMap() {
  const files = await fs.readdir(PUBLIC_DIR);
  const map = new Map();
  for (const f of files) {
    const ext = (f.split('.').pop() || '').toLowerCase();
    if (!['jpg','jpeg','png','webp','gif','svg'].includes(ext)) continue;
    const key = normalizeKey(f.replace(/\.[^.]+$/, ''));
    const url = '/' + encodeURI(f);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(url);
  }
  return map;
}

function pickPublicForName(name, publicMap) {
  if (!name) return null;
  const k = normalizeKey(name);
  if (publicMap.has(k)) return publicMap.get(k);
  // try substring
  for (const mk of publicMap.keys()) {
    if (mk.includes(k) || k.includes(mk)) return publicMap.get(mk);
  }
  // try tokens
  const tokens = k.split(/[^a-z0-9]+/).filter(Boolean);
  for (const t of tokens) {
    for (const mk of publicMap.keys()) {
      if (mk.includes(t) || t.includes(mk)) return publicMap.get(mk);
    }
  }
  return null;
}

async function syncImages() {
  try {
    await connectDB();
    console.log('MongoDB connected');
    const tsText = await fs.readFile(FRONTEND_MOCK_PATH, 'utf8');
    const frontProducts = await extractMockProducts(tsText);
    console.log(`Parsed ${frontProducts.length} frontend products`);

    const publicMap = await buildPublicMap();
    console.log(`Public map entries: ${publicMap.size}`);

    // build frontend map by id or name
    const frontMap = new Map();
    for (const pRaw of frontProducts) {
      const p = normalizeImagePaths(pRaw);
      const id = p.id || p._id || (p.name ? p.name.replace(/\s+/g, '-').toUpperCase() : null);
      if (!id) continue;
      const imgs = Array.isArray(p.images) ? p.images.map(x=>String(x).trim()).filter(Boolean) : [];
      const resolved = [];
      for (const img of imgs) {
        // if it's already a public file name, prefer that
        const base = path.basename(img).replace(/^[\\/]+/, '');
        const baseNoExt = base.replace(/\.[^.]+$/, '');
        const pub = pickPublicForName(baseNoExt, publicMap) || pickPublicForName(p.name, publicMap);
        if (pub) {
          // push all candidates from pub
          for (const u of pub) if (!resolved.includes(u)) resolved.push(u);
          continue;
        }
        // normalize src/images -> /images/
        let candidate = img;
        if (!/^https?:\/\//i.test(candidate) && !candidate.startsWith('/')) candidate = '/' + candidate;
        candidate = candidate.replace('/src/images/', '/images/');
        candidate = candidate.replace(/\\/g, '/');
        candidate = encodeURI(candidate);
        if (!resolved.includes(candidate)) resolved.push(candidate);
      }
      frontMap.set(id, resolved);
    }

    console.log(`Frontend map built with ${frontMap.size} entries`);

    const allDb = await Product.find({}).lean();
    let updated = 0;
    const noMatch = [];
    for (const dbp of allDb) {
      const key1 = dbp.id || dbp._id || null;
      let newImgs = frontMap.get(key1);
      if (!newImgs) {
        const nk = normalizeKey(dbp.id || dbp._id || '');
        if (nk && frontMap.has(nk)) newImgs = frontMap.get(nk);
      }
      if (!newImgs && dbp.name) {
        const nName = normalizeKey(dbp.name);
        // try match by normalized name
        if (frontMap.has(nName)) newImgs = frontMap.get(nName);
        if (!newImgs) {
          // try substring against frontMap keys
          const keys = Array.from(frontMap.keys());
          for (const k of keys) {
            if (k.toLowerCase().includes(nName) || nName.includes(k.toLowerCase())) { newImgs = frontMap.get(k); break; }
          }
        }
      }

      if (!newImgs || newImgs.length === 0) {
        noMatch.push({ id: dbp.id, name: dbp.name });
        continue;
      }

      // set full array (dedup)
      const uniq = Array.from(new Set(newImgs));
      await Product.updateOne({ _id: dbp._id }, { $set: { images: uniq } });
      updated++;
    }

    console.log(`Sync complete. Updated: ${updated}; No match: ${noMatch.length}`);
    if (noMatch.length) console.log('Sample no-match:', noMatch.slice(0,20));
    process.exit(0);
  } catch (err) {
    console.error('syncImages failed', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) syncImages();

export default syncImages;
