/**
 * Dynamic Sitemap Generator for The Himalayan Handicraft
 * 
 * This script generates an XML sitemap dynamically from your product database
 * Run this script periodically or as part of your build process
 * 
 * Usage: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';

// Configure your domain
const DOMAIN = 'https://thehimalayanhandicraft.com';
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');

// Static pages with their priority and change frequency
const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/shop', priority: 0.9, changefreq: 'daily' },
  { url: '/about', priority: 0.7, changefreq: 'monthly' },
  { url: '/contact', priority: 0.7, changefreq: 'monthly' },
  { url: '/gallery', priority: 0.6, changefreq: 'weekly' },
];

// Product categories
const categories = [
  'singing-bowls',
  'prayer-wheels',
  'thangka-paintings',
  'buddha-statues',
  'mala-beads',
  'ritual-items',
  'incense',
  'home-decor',
];

// Blog posts
const blogPosts = [
  { slug: 'tibetan-singing-bowl-guide', date: '2026-01-05' },
  { slug: 'buddhist-prayer-wheel-meaning', date: '2026-01-04' },
  { slug: 'tsum-valley-sacred-crafts', date: '2026-01-03' },
];

function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function generateSitemapXML() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  
  const currentDate = getCurrentDate();
  
  // Add static pages
  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${page.url}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n\n';
  });
  
  // Add category pages
  categories.forEach(category => {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}/shop/${category}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += '  </url>\n\n';
  });
  
  // Add blog posts
  blogPosts.forEach(post => {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${post.date}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += '  </url>\n\n';
  });
  
  // TODO: Add dynamic product pages from database
  // Example:
  // products.forEach(product => {
  //   xml += '  <url>\n';
  //   xml += `    <loc>${DOMAIN}/product/${product.slug}</loc>\n`;
  //   xml += `    <lastmod>${product.updatedAt}</lastmod>\n`;
  //   xml += `    <changefreq>weekly</changefreq>\n`;
  //   xml += `    <priority>0.7</priority>\n`;
  //   
  //   // Add product images
  //   if (product.images && product.images.length > 0) {
  //     product.images.forEach(image => {
  //       xml += '    <image:image>\n';
  //       xml += `      <image:loc>${DOMAIN}${image.url}</image:loc>\n`;
  //       xml += `      <image:title>${image.alt || product.name}</image:title>\n`;
  //       xml += '    </image:image>\n';
  //     });
  //   }
  //   
  //   xml += '  </url>\n\n';
  // });
  
  xml += '</urlset>';
  
  return xml;
}

function saveSitemap(xml) {
  try {
    fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
    console.log(`✅ Sitemap generated successfully at ${SITEMAP_PATH}`);
    console.log(`📊 Total URLs: ${(xml.match(/<url>/g) || []).length}`);
  } catch (error) {
    console.error('❌ Error saving sitemap:', error);
    process.exit(1);
  }
}

// Generate robots.txt if it doesn't exist
function generateRobotsTxt() {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  
  if (!fs.existsSync(robotsPath)) {
    const robotsContent = `# robots.txt for The Himalayan Handicraft
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /cart
Disallow: /checkout

Sitemap: ${DOMAIN}/sitemap.xml
`;
    
    fs.writeFileSync(robotsPath, robotsContent, 'utf8');
    console.log(`✅ robots.txt generated at ${robotsPath}`);
  }
}

// Main execution
console.log('🚀 Generating sitemap for The Himalayan Handicraft...\n');

const sitemapXML = generateSitemapXML();
saveSitemap(sitemapXML);
generateRobotsTxt();

console.log('\n✨ SEO files generated successfully!');
console.log(`🌐 Submit your sitemap to Google Search Console: ${DOMAIN}/sitemap.xml`);
