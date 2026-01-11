import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public');
const distDir = path.resolve(__dirname, '../dist');

console.log('📦 Copying dynamically uploaded images to dist...');

// Patterns for dynamically uploaded files
const patterns = [
  /^gallery-\d+-.+\.(jpg|jpeg|png|gif|webp)$/i,
  /^uploaded-\d+-.+\.(jpg|jpeg|png|gif|webp)$/i,
  /^product-P-.+\.(jpg|jpeg|png|gif|webp)$/i
];

try {
  const files = fs.readdirSync(publicDir);
  let copied = 0;

  files.forEach(file => {
    const matches = patterns.some(pattern => pattern.test(file));
    if (matches) {
      const src = path.join(publicDir, file);
      const dest = path.join(distDir, file);
      
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied: ${file}`);
      copied++;
    }
  });

  console.log(`\n✅ Done! Copied ${copied} dynamic image(s) to dist/`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
