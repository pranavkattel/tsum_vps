import fs from 'fs/promises';
import path from 'path';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';

const PUBLIC_DIR = path.resolve('..', 'public');

function normalize(s){return String(s || '').toLowerCase();}

async function run(){
  await connectDB();
  const files = await fs.readdir(PUBLIC_DIR);
  const lower = files.map(f=>({f, l: f.toLowerCase()}));
  const products = await Product.find({}).lean();
  const toCheck = products.filter(p=>[ '2','8','ACC-PRAY'].includes(p.id));
  for(const p of toCheck){
    console.log('\nProduct:', p.id, p.name);
    const words = String(p.name||'').toLowerCase().split(/\s+/).filter(Boolean);
    for(const w of words){
      const matches = lower.filter(x=>x.l.includes(w)).map(x=>x.f);
      if(matches.length) console.log(`  Word '${w}' matches:`, matches.slice(0,10));
    }
    // also show any file containing any char sequence from name
    const bigMatches = lower.filter(x=> normalize(p.name).split(/[^a-z0-9]+/).some(tok=> tok && x.l.includes(tok))).map(x=>x.f);
    console.log('  Any-token matches (sample):', Array.from(new Set(bigMatches)).slice(0,20));
  }
  process.exit(0);
}

run();
