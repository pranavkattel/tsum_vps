import fs from 'fs/promises';
import path from 'path';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';

const PUBLIC_DIR = path.resolve('..', 'public');

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
    // prefer /<filename> as URL (public root)
    const url = '/' + encodeURI(f);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(url);
  }
  return map;
}

async function run() {
  try {
    await connectDB();
    console.log('Connected to DB — building public image map...');
    const map = await buildPublicMap();
    console.log(`Found ${map.size} distinct public image base names`);

    const products = await Product.find({}).lean();
    let updated = 0;
    let skipped = 0;
    const noMatch = [];

    for (const p of products) {
      const cur = Array.isArray(p.images) ? p.images : [];

      // If the first image refers to an existing file in public, skip updating
      let first = cur && cur.length ? String(cur[0]) : null;
      let firstFileExists = false;
      if (first) {
        // normalize path to a filename within public
        let candidate = first.replace(/^\//, '');
        if (candidate.startsWith('images/')) candidate = candidate.replace(/^images\//, '');
        // decode any URI encoding
        candidate = decodeURI(candidate);
        try {
          // check existence in public dir
          await fs.access(path.join(PUBLIC_DIR, candidate));
          firstFileExists = true;
        } catch (e) {
          firstFileExists = false;
        }
      }

      if (firstFileExists) {
        skipped++;
        continue;
      }

      // try by id first, then name
      const candidates = [];
      if (p.id) candidates.push(normalizeKey(p.id));
      if (p._id) candidates.push(normalizeKey(String(p._id)));
      if (p.name) candidates.push(normalizeKey(p.name));

      let found = null;
      for (const c of candidates) {
        if (!c) continue;
        if (map.has(c)) { found = map.get(c); break; }
      }

      // fallback: try words from name (exact key)
      if (!found && p.name) {
        const words = String(p.name).split(/\s+/).map(w => normalizeKey(w)).filter(Boolean);
        for (const w of words) {
          if (map.has(w)) { found = map.get(w); break; }
        }
        // if still not found, try substring matches against map keys
        if (!found) {
          const mapKeys = Array.from(map.keys());
          for (const w of words) {
            const match = mapKeys.find(k => k.includes(w));
            if (match) { found = map.get(match); break; }
          }
        }
      }

      if (!found) {
        noMatch.push({ _id: p._id, id: p.id, name: p.name });
        continue;
      }

      // prefer first candidate
      const newImgs = found.slice(0, 3);
      await Product.updateOne({ _id: p._id }, { $set: { images: newImgs } });
      console.log(`Updated ${p.id || p._id} -> ${JSON.stringify(newImgs)}`);
      updated++;
    }

    console.log(`Done. Updated: ${updated}, Skipped (had images): ${skipped}, No match: ${noMatch.length}`);
    if (noMatch.length) console.log('Sample no-match:', noMatch.slice(0,10));
    process.exit(0);
  } catch (err) {
    console.error('mapPublicImagesToDB failed', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) run();

export default run;
