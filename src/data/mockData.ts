import { Product, Category, Artisan, BlogPost } from '../types';

const originalProducts: Product[] = [
  {
    id: '1',
    name: 'Golden Buddha Meditation Statue',
    price: 15000,
    originalPrice: 18000,
    images: [
      '/IMG-20250704-WA0083.jpg',
      '/IMG-20250704-WA0082.jpg'
    ],
    description: 'Handcrafted Buddha statue made from sacred Himalayan wood with gold finishing. Perfect for meditation and spiritual practice.',
    category: 'Buddha Statues',
    artisan: 'Tenzin Norbu',
    materials: ['Himalayan Cedar Wood', 'Gold Leaf', 'Natural Lacquer'],
    dimensions: { length: 15, width: 10, height: 20 },
    weight: 2.5,
    stock: 8,
  featured: false,
    rating: 4.9,
    reviews: 156,
    tags: ['Buddha', 'Wood Carving', 'Religious', 'Meditation'],
    culturalSignificance: 'Buddha statues are revered symbols of enlightenment and inner peace in Buddhist culture.',
    craftingTechnique: 'Traditional hand-carving techniques passed down through generations of Tibetan artisans.'
  },
  {
    id: '2',
    name: 'Brass Ganesha Divine Sculpture',
    price: 25000,
    images: [
      '/IMG-20250704-WA0081.jpg',
      '/IMG-20250704-WA0046.jpg',
      '/IMG-20250704-WA0045.jpg',
      '/IMG-20250704-WA0044.jpg'
    ],
    description: 'Intricately detailed brass statue of Lord Ganesha. Handcrafted with traditional lost-wax casting technique.',
    category: 'Hindu Deity Statues',
    artisan: 'Ram Bahadur Shakya',
    materials: ['Pure Brass', 'Gold Plating'],
    dimensions: { length: 12, width: 8, height: 25 },
    weight: 3.2,
    stock: 6,
  featured: false,
    rating: 4.8,
    reviews: 91,
    tags: ['Brass', 'Ganesha', 'Religious', 'Hindu'],
    culturalSignificance: 'Ganesha is revered as the remover of obstacles and patron of arts and sciences.',
    craftingTechnique: 'Created using the ancient lost-wax casting method with intricate detailing.'
  },
  {
    id: '3',
    name: 'White Marble Shiva Statue',
    price: 45000,
    originalPrice: 55000,
    images: [
      '/IMG-20250704-WA0080.jpg',
      '/IMG-20250704-WA0043.jpg',
      '/IMG-20250704-WA0042.jpg',
      '/IMG-20250704-WA0041.jpg',
      '/IMG-20250704-WA0040.jpg'
    ],
    description: 'Exquisite white marble Shiva statue in meditation pose. Hand-carved from premium Makrana marble.',
    category: 'Hindu Deity Statues',
    artisan: 'Suresh Kumar',
    materials: ['Makrana White Marble', 'Natural Polishing'],
    dimensions: { length: 18, width: 15, height: 35 },
    weight: 8.5,
    stock: 4,
  featured: false,
    rating: 4.9,
    reviews: 67,
    tags: ['Marble', 'Shiva', 'Religious', 'Meditation'],
    culturalSignificance: 'Shiva represents the cosmic consciousness and divine transformation.',
    craftingTechnique: 'Hand-carved using traditional marble sculpting techniques with fine chisels.'
  },
  {
    id: '4',
    name: 'Bronze Tara Goddess Statue',
    price: 32000,
    images: [
      '/IMG-20250704-WA0079.jpg',
      '/IMG-20250704-WA0039.jpg',
      '/IMG-20250704-WA0038.jpg',
      '/IMG-20250704-WA0037.jpg'
    ],
    description: 'Beautiful bronze statue of Green Tara, the compassionate goddess. Crafted with traditional Tibetan iconography.',
    category: 'Buddha Statues',
    artisan: 'Karma Lhamo',
    materials: ['Bronze Alloy', 'Antique Patina'],
    dimensions: { length: 14, width: 12, height: 28 },
    weight: 4.2,
    stock: 7,
  featured: false,
    rating: 4.7,
    reviews: 123,
    tags: ['Bronze', 'Tara', 'Tibetan', 'Buddhist'],
    culturalSignificance: 'Tara is known as the mother of liberation and compassionate protector.',
    craftingTechnique: 'Lost-wax bronze casting with traditional Tibetan finishing techniques.'
  },
  {
    id: '5',
    name: 'Stone Lakshmi Prosperity Statue',
    price: 22000,
    images: [
      '/IMG-20250704-WA0078.jpg',
      '/IMG-20250704-WA0036.jpg',
      '/IMG-20250704-WA0035.jpg',
      '/IMG-20250704-WA0029.jpg'
    ],
    description: 'Elegant sandstone statue of Goddess Lakshmi seated on lotus. Hand-carved with traditional iconographic elements.',
    category: 'Hindu Deity Statues',
    artisan: 'Maya Devi',
    materials: ['Red Sandstone', 'Natural Stone Finish'],
    dimensions: { length: 16, width: 14, height: 30 },
    weight: 6.8,
    stock: 5,
    featured: false,
    rating: 4.6,
    reviews: 89,
    tags: ['Stone', 'Lakshmi', 'Goddess', 'Prosperity'],
    culturalSignificance: 'Lakshmi is the goddess of wealth, fortune, and prosperity.',
    craftingTechnique: 'Traditional stone carving with hand tools and natural finishing.'
  },
  {
    id: '6',
    name: 'Sandalwood Hanuman Statue',
    price: 18000,
    images: [
      '/IMG-20250704-WA0077.jpg',
      '/IMG-20250704-WA0028.jpg',
      '/IMG-20250704-WA0027.jpg',
      '/IMG-20250704-WA0026.jpg',
      '/IMG-20250704-WA0025.jpg'
    ],
    description: 'Powerful wooden statue of Lord Hanuman in devotional pose. Carved from sacred sandalwood.',
    category: 'Hindu Deity Statues',
    artisan: 'Vishnu Maharjan',
    materials: ['Sandalwood', 'Natural Oil Finish'],
    dimensions: { length: 12, width: 10, height: 22 },
    weight: 2.8,
    stock: 12,
    featured: false,
    rating: 4.8,
    reviews: 156,
    tags: ['Wood', 'Hanuman', 'Devotional', 'Strength'],
    culturalSignificance: 'Hanuman symbolizes courage, strength, and devotion.',
    craftingTechnique: 'Hand-carved from single piece of sandalwood using traditional tools.'
  },
  {
    id: '7',
    name: 'Crystal Quan Yin Healing Statue',
    price: 12000,
    originalPrice: 15000,
    images: [
      '/IMG-20250704-WA0076.jpg',
      '/IMG-20250704-WA0024.jpg',
      '/IMG-20250704-WA0023.jpg',
      '/IMG-20250704-WA0022.jpg'
    ],
    description: 'Serene crystal statue of Quan Yin, goddess of mercy and compassion. Hand-polished clear quartz.',
    category: 'Buddha Statues',
    artisan: 'Chen Wei',
    materials: ['Clear Quartz Crystal', 'Hand Polish'],
    dimensions: { length: 10, width: 8, height: 18 },
    weight: 1.8,
    stock: 15,
    featured: false,
    rating: 4.9,
    reviews: 78,
    tags: ['Crystal', 'Quan Yin', 'Compassion', 'Healing'],
    culturalSignificance: 'Quan Yin represents infinite compassion and mercy.',
    craftingTechnique: 'Hand-carved and polished crystal using traditional lapidary techniques.'
  },
  {
    id: '8',
    name: 'Brass Krishna Divine Flute Player',
    price: 28000,
    images: [
      '/IMG-20250704-WA0075.jpg',
      '/IMG-20250704-WA0074.jpg',
      '/IMG-20250704-WA0073.jpg',
      '/IMG-20250704-WA0072.jpg'
    ],
    description: 'Divine brass statue of Lord Krishna playing the flute. Intricately crafted with traditional iconography.',
    category: 'Hindu Deity Statues',
    artisan: 'Gopal Shrestha',
    materials: ['Brass Alloy', 'Silver Inlay'],
    dimensions: { length: 13, width: 9, height: 26 },
    weight: 3.8,
    stock: 8,
    featured: false,
    rating: 4.7,
    reviews: 134,
    tags: ['Brass', 'Krishna', 'Divine', 'Music'],
    culturalSignificance: 'Krishna represents divine love, joy, and the supreme reality.',
    craftingTechnique: 'Lost-wax casting with detailed finishing and silver inlay work.'
  }
  ,
  // === Phase 1 Batch Products (Grouped 01 - 14) ===
  // Each product 01-14 combines its available angles (front/back/mid or mid/back/wide)
  // Placeholder price & description – replace later with real data
  ...[
    '01','02','03','04','05','06','07','08','09','10','11','12','13','14'
  ].map((code) => {
      const basePath = '/Export Phase 1 Pictures';
      const angles: string[] = [];
      if (code === '01') {
        angles.push(`${basePath}/01 front.tif`);
        angles.push(`${basePath}/01 Back.tif`);
        angles.push(`${basePath}/01 Mid.tif`);
      } else {
        ['Mid','Back','Wide'].forEach(p => angles.push(`${basePath}/${code} ${p}.tif`));
      }
    return {
      id: `P1-${code}`,
      name: `Artisan Piece ${code}`,
      price: 1000,
      images: angles,
      description: `Placeholder description for item ${code}. Replace with authentic details about materials, origin, and craftsmanship.`,
      category: 'Statues',
      artisan: '',
      materials: [],
      dimensions: { length: 0, width: 0, height: 0 },
      weight: 0,
      stock: 1,
      featured: true,
      rating: 0,
      reviews: 0,
      tags: ['phase1', code]
    } as Product;
  }),
  // === Individual Accessory / Misc Items ===
  // Helper factory
  ...[
    { id: 'ACC-BELL-1', name: 'Bell Variant 1', file: 'Bell 1.tif', cat: 'Accessories' },
    { id: 'ACC-BELL-2', name: 'Bell Variant 2', file: 'Bell 2.tif', cat: 'Accessories' },
    { id: 'ACC-BELL-3', name: 'Bell Variant 3', file: 'Bell 3.tif', cat: 'Accessories' },
    { id: 'ACC-BELL-COVER', name: 'Bell Cover', file: 'Bell Cover.tif', cat: 'Accessories' },
    { id: 'ACC-BELL-COVER-2', name: 'Bell Cover Variant', file: 'Bell cover 2.tif', cat: 'Accessories' },
    { id: 'ACC-BELL-MID', name: 'Bell Mid Angle', file: 'Bell Mid.tif', cat: 'Accessories' },
    { id: 'ACC-BOWLS', name: 'Bowls Set', file: 'Bowls.tif', cat: 'Accessories' },
    { id: 'ACC-BOULS', name: 'Bowls Set Alt', file: 'Bouls.tif', cat: 'Accessories' },
    { id: 'ACC-BOWL2', name: 'Single Bowl Variant', file: 'Bowl2.tif', cat: 'Accessories' },
    { id: 'ACC-COVER', name: 'Cloth Cover', file: 'Cover.tif', cat: 'Accessories' },
    { id: 'ACC-DAMARU', name: 'Damaru', file: 'Damaru.tif', cat: 'Instruments' },
    { id: 'ACC-DAMARU-COVER', name: 'Damaru Cover', file: 'Damaru Cover.tif', cat: 'Instruments' },
    { id: 'ACC-KARUWA', name: 'Karuwa', file: 'Karuwa.tif', cat: 'Vessels' },
    { id: 'ACC-KARUWA-1', name: 'Karuwa Variant 1', file: 'Karuwa 1.tif', cat: 'Vessels' },
    { id: 'ACC-KARUWA-2', name: 'Karuwa Variant 2', file: 'Karuwa 2.tif', cat: 'Vessels' },
    { id: 'ACC-LIGHT-BOWLS', name: 'Light Bowls Set', file: 'Light bouls.tif', cat: 'Accessories' },
    { id: 'ACC-LIGHT-BOWLS-05', name: 'Light Bowls Set (Alt)', file: 'Light bouls .5.tif', cat: 'Accessories' },
    { id: 'ACC-LOCKET', name: 'Locket', file: 'Locket.tif', cat: 'Jewelry' },
    { id: 'ACC-LOCKET-2', name: 'Locket Variant', file: 'Locket 2.tif', cat: 'Jewelry' },
    // Mala series (many variants)
    { id: 'ACC-MALA-1', name: 'Mala 1', file: 'Mala 1.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-2', name: 'Mala 2', file: 'Mala 2.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-25', name: 'Mala 2.5', file: 'Mala 2.5.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-3', name: 'Mala 3', file: 'Mala 3.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-4', name: 'Mala 4', file: 'Mala 4.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-5', name: 'Mala 5', file: 'Mala 5.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-55', name: 'Mala 5.5', file: 'Mala 5.5.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-6', name: 'Mala 6', file: 'Mala 6.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-66', name: 'Mala 6.6', file: 'Mala6.6.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-7', name: 'Mala 7', file: 'Mala 7.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-77', name: 'Mala 7.7', file: 'Mala7.7.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-75', name: 'Mala 7.5', file: 'Mala 7.5.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-8', name: 'Mala 8', file: 'Mala 8.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-88', name: 'Mala 8.8', file: 'Mala 8.8.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-9', name: 'Mala 9', file: 'Mala 9.tif', cat: 'Jewelry' },
    { id: 'ACC-MALA-99', name: 'Mala 9.9', file: 'Mala9.9.tif', cat: 'Jewelry' },
    { id: 'ACC-MALAS', name: 'Mala Set', file: 'Malas.tif', cat: 'Jewelry' },
    { id: 'ACC-MALAS-05', name: 'Mala Set (Alt)', file: 'Malas.5.tif', cat: 'Jewelry' },
    { id: 'ACC-PRAY', name: 'Prayer Instrument', file: 'Pray.tif', cat: 'Ritual' },
    { id: 'ACC-PRAY-BOWL', name: 'Prayer Bowl', file: 'Pray boul.tif', cat: 'Ritual' },
    { id: 'ACC-PRAY-BOWLS-05', name: 'Prayer Bowls (Alt)', file: 'Pray bouls .5.tif', cat: 'Ritual' },
  ].map(item => {
    const file = item.file;
    const lower = file.toLowerCase();
    let category = 'Statues';
    if (lower.includes('bell')) category = 'Bells';
    else if (lower.includes('mala')) category = 'Mala';
    else if (lower.includes('locket')) category = 'Locket';
    else if (lower.includes('bowl') || lower.includes('bouls') || lower.includes('karuwa')) category = 'Bowls & Karuwa';
    // default others (e.g., pray, damaru) can remain in 'Statues' or be adjusted later
    return {
      id: item.id,
      name: item.name,
      price: 500,
      images: [`/Export Phase 1 Pictures/${item.file}`],
      description: `Placeholder description for ${item.name}. Add details about materials and cultural significance.`,
      category,
      artisan: '',
      materials: [],
      dimensions: { length: 0, width: 0, height: 0 },
      weight: 0,
      stock: 1,
      featured: true,
      rating: 0,
      reviews: 0,
      tags: ['phase1', category.toLowerCase()]
    } as Product;
  })
];

// === Phase 2 Batch Products ===
const phase2Products = [
  // Large Buddha Statues
  { id: 'P2-BIG-BUDDHA-01', name: 'Big Buddha Statue', file: 'Big Buddha.tif', cat: 'Statues', price: 45000 },
  { id: 'P2-BIG-BUDDHA-02', name: 'Big Buddha Statue (Back View)', file: 'Big Buddha Back.tif', cat: 'Statues', price: 45000 },
  
  // Large General Statues  
  { id: 'P2-BIG-STATUE-01', name: 'Large Sacred Statue', file: 'Big Statue.tif', cat: 'Statues', price: 38000 },
  { id: 'P2-BIG-STATUE-02', name: 'Large Sacred Statue (Mid View)', file: 'Big Statue Mid.tif', cat: 'Statues', price: 38000 },
  
  // Singing Bowls Collection
  { id: 'P2-BOWL-01', name: 'Singing Bowl 1"', file: 'Singing Bowl 1.tif', cat: 'Singing Bowl', price: 1500 },
  { id: 'P2-BOWL-01-5', name: 'Singing Bowl 1.5"', file: 'Singing Bowl 1.5.tif', cat: 'Singing Bowl', price: 1800 },
  { id: 'P2-BOWL-02', name: 'Singing Bowl 2"', file: 'Singing Bowl 2.tif', cat: 'Singing Bowl', price: 2000 },
  { id: 'P2-BOWL-02-5', name: 'Singing Bowl 2.5"', file: 'Singing Bowl 2.5.tif', cat: 'Singing Bowl', price: 2300 },
  { id: 'P2-BOWL-03', name: 'Singing Bowl 3"', file: 'Singing Bowl 3.tif', cat: 'Singing Bowl', price: 2600 },
  { id: 'P2-BOWL-03-5', name: 'Singing Bowl 3.5"', file: 'Singing Bowl 3.5.tif', cat: 'Singing Bowl', price: 2900 },
  { id: 'P2-BOWL-04', name: 'Singing Bowl 4"', file: 'Singing Bowl 4.tif', cat: 'Singing Bowl', price: 3200 },
  { id: 'P2-BOWL-04-5', name: 'Singing Bowl 4.5"', file: 'Singing Bowl 4.5.tif', cat: 'Singing Bowl', price: 3500 },
  { id: 'P2-BOWL-05', name: 'Singing Bowl 5"', file: 'Singing Bowl 5.tif', cat: 'Singing Bowl', price: 3800 },
  { id: 'P2-BOWL-05-5', name: 'Singing Bowl 5.5"', file: 'Singing Bowl 5.5.tif', cat: 'Singing Bowl', price: 4100 },
  { id: 'P2-BOWL-06', name: 'Singing Bowl 6"', file: 'Singing Bowl 6.tif', cat: 'Singing Bowl', price: 4400 },
  { id: 'P2-BOWL-06-5', name: 'Singing Bowl 6.5"', file: 'Singing Bowl 6.5.tif', cat: 'Singing Bowl', price: 4700 },
  { id: 'P2-BOWL-07', name: 'Singing Bowl 7"', file: 'Singing Bowl 7.tif', cat: 'Singing Bowl', price: 5000 },
  { id: 'P2-BOWL-07-5', name: 'Singing Bowl 7.5"', file: 'Singing Bowl 7.5.tif', cat: 'Singing Bowl', price: 5300 },
  { id: 'P2-BOWL-08', name: 'Singing Bowl 8"', file: 'Singing Bowl 8.tif', cat: 'Singing Bowl', price: 5600 },
  { id: 'P2-BOWL-08-5', name: 'Singing Bowl 8.5"', file: 'Singing Bowl 8.5.tif', cat: 'Singing Bowl', price: 5900 },
  { id: 'P2-BOWL-09', name: 'Singing Bowl 9"', file: 'Singing Bowl 9.tif', cat: 'Singing Bowl', price: 6200 },
  { id: 'P2-BOWL-09-5', name: 'Singing Bowl 9.5"', file: 'Singing Bowl 9.5.tif', cat: 'Singing Bowl', price: 6500 },
  { id: 'P2-BOWL-10', name: 'Singing Bowl 10"', file: 'Singing Bowl 10.tif', cat: 'Singing Bowl', price: 6800 },
  { id: 'P2-BOWL-10-5', name: 'Singing Bowl 10.5"', file: 'Singing Bowl 10.5.tif', cat: 'Singing Bowl', price: 7100 },
  { id: 'P2-BOWL-11', name: 'Singing Bowl 11"', file: 'Singing Bowl 11.tif', cat: 'Singing Bowl', price: 7400 },
  { id: 'P2-BOWL-11-5', name: 'Singing Bowl 11.5"', file: 'Singing Bowl 11.5.tif', cat: 'Singing Bowl', price: 7700 },
  { id: 'P2-BOWL-12', name: 'Singing Bowl 12"', file: 'Singing Bowl 12.tif', cat: 'Singing Bowl', price: 8000 },
  { id: 'P2-BOWL-12-5', name: 'Singing Bowl 12.5"', file: 'Singing Bowl 12.5.tif', cat: 'Singing Bowl', price: 8300 },
  { id: 'P2-BOWL-13', name: 'Singing Bowl 13"', file: 'Singing Bowl 13.tif', cat: 'Singing Bowl', price: 8600 },
  { id: 'P2-BOWL-13-5', name: 'Singing Bowl 13.5"', file: 'Singing Bowl 13.5.tif', cat: 'Singing Bowl', price: 8900 },
  { id: 'P2-BOWL-13-55', name: 'Singing Bowl 13.55"', file: 'Singing Bowl 13.55.tif', cat: 'Singing Bowl', price: 9000 },
  { id: 'P2-BOWL-14', name: 'Singing Bowl 14"', file: 'Singing Bowl 14.tif', cat: 'Singing Bowl', price: 9200 },
  { id: 'P2-BOWL-14-5', name: 'Singing Bowl 14.5"', file: 'Singing Bowl 14.5.tif', cat: 'Singing Bowl', price: 9500 },
  
  // Bowl Covers
  { id: 'P2-COVER-01', name: 'Singing Bowl Cover', file: 'Singing Bowl cover.tif', cat: 'Singing Bowl', price: 800 },
  { id: 'P2-COVER-02', name: 'Singing Bowl Cover 2', file: 'Singing Bowl cover 2.tif', cat: 'Singing Bowl', price: 850 },
  { id: 'P2-COVER-03', name: 'Singing Bowl Cover 3', file: 'Singing Bowl cover 3.tif', cat: 'Singing Bowl', price: 900 },
  
  // Regular Bowls
  { id: 'P2-BOWL-REG', name: 'Traditional Bowl', file: 'Bowl.tif', cat: 'Bowls & Karuwa', price: 1200 },
  { id: 'P2-PUJA-BOWL', name: 'Puja Ritual Bowl', file: 'Puja bowl.tif', cat: 'Bowls & Karuwa', price: 1800 },
  
  // Decorative Items
  { id: 'P2-ARROW', name: 'Decorative Arrow', file: 'Arrow.tif', cat: 'Statues', price: 2500 },
  { id: 'P2-STONE-01', name: 'Sacred Stone', file: 'Stone.tif', cat: 'Statues', price: 3500 },
  { id: 'P2-STONE-02', name: 'Sacred Stone 2', file: 'Stone 2.tif', cat: 'Statues', price: 3700 },
  { id: 'P2-STONE-03', name: 'Sacred Stone 3', file: 'Stone 3.tif', cat: 'Statues', price: 3900 },
].map((item, index) => ({
  id: item.id,
  name: item.name,
  price: item.price,
  images: [`/IMG-20250704-WA00${String(22 + index).padStart(2, '0')}.jpg`],
  description: `Exquisite ${item.name.toLowerCase()} handcrafted by master artisans. This authentic piece represents traditional Nepali craftsmanship and spiritual significance.`,
  category: item.cat,
  artisan: 'Master Craftsman',
  materials: item.cat === 'Singing Bowl' ? ['Bronze', 'Brass', 'Sacred Metal'] : 
             item.cat === 'Bowls & Karuwa' ? ['Bronze', 'Brass'] : 
             ['Stone', 'Metal'],
  dimensions: { length: 10, width: 10, height: 15 },
  weight: item.cat === 'Bowls & Karuwa' ? 1.5 : 2.5,
  stock: 5,
  featured: true,
  rating: 4.5 + Math.random() * 0.4, // Random rating between 4.5-4.9
  reviews: Math.floor(Math.random() * 50) + 10, // Random reviews 10-60
  tags: ['phase2', item.cat.toLowerCase(), 'handcrafted'],
} as Product));

// Combine all products
export const mockProducts: Product[] = [
  ...originalProducts,
  ...phase2Products
];

// Build category list for Collection view
const categoryNames = ['Statues', 'Bells', 'Mala', 'Locket', 'Bowls & Karuwa', 'Singing Bowl'] as const;

function pickImageForCategory(cat: string): string {
  const p = mockProducts.find(p => p.category === cat && p.images && p.images.length > 0);
  return p ? p.images[0] : 'https://placehold.co/600x400?text='+encodeURIComponent(cat);
}

export const mockCategories: Category[] = categoryNames.map((name, idx) => ({
  id: String(idx + 1),
  name,
  image: pickImageForCategory(name),
  description: `${name} from our curated collection`,
  productCount: mockProducts.filter(p => p.category === name).length,
}));

export const mockArtisans: Artisan[] = [
  {
    id: '1',
    name: 'Tenzin Norbu',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Master wood carver specializing in Buddhist religious statues. Born in Mustang, Nepal, Tenzin has been crafting sacred sculptures for over 25 years.',
    specialties: ['Wood Carving', 'Buddha Statues', 'Sacred Sculptures'],
    location: 'Mustang, Nepal',
    experience: 25,
    products: ['1', '4', '7']
  },
  {
    id: '2',
    name: 'Ram Bahadur Shakya',
    photo: 'https://images.pexels.com/photos/1462636/pexels-photo-1462636.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Renowned brass sculptor from the traditional Shakya community, specializing in Hindu deity statues and bronze casting techniques.',
    specialties: ['Brass Casting', 'Hindu Deities', 'Lost-Wax Technique'],
    location: 'Patan, Nepal',
    experience: 22,
    products: ['2', '8']
  },
  {
    id: '3',
    name: 'Suresh Kumar',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Master marble sculptor from Rajasthan, India, known for creating exquisite religious statues with unparalleled detail and craftsmanship.',
    specialties: ['Marble Carving', 'Stone Sculpture', 'Religious Art'],
    location: 'Jaipur, India',
    experience: 30,
    products: ['3']
  },
  {
    id: '4',
    name: 'Karma Lhamo',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Tibetan bronze artist specializing in Buddhist statues and traditional Himalayan iconography. Preserves ancient casting methods.',
    specialties: ['Bronze Casting', 'Tibetan Art', 'Buddhist Iconography'],
    location: 'Dharamshala, India',
    experience: 18,
    products: ['4']
  },
  {
    id: '5',
    name: 'Maya Devi',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Female stone carver breaking traditional barriers, creating beautiful Hindu goddess statues with modern sensitivity and ancient techniques.',
    specialties: ['Stone Carving', 'Goddess Statues', 'Traditional Techniques'],
    location: 'Bhaktapur, Nepal',
    experience: 15,
    products: ['5']
  },
  {
    id: '6',
    name: 'Vishnu Maharjan',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Traditional Newar wood carver from Kathmandu valley, specializing in Hindu deity statues and temple sculptures.',
    specialties: ['Wood Carving', 'Hindu Statues', 'Temple Art'],
    location: 'Kathmandu, Nepal',
    experience: 20,
    products: ['6']
  },
  {
    id: '7',
    name: 'Chen Wei',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Crystal carver and gemstone artist creating Buddhist statues from precious stones and crystals with healing properties.',
    specialties: ['Crystal Carving', 'Gemstone Art', 'Healing Crystals'],
    location: 'Kathmandu, Nepal',
    experience: 12,
    products: ['7']
  },
  {
    id: '8',
    name: 'Gopal Shrestha',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Master metalworker specializing in brass Krishna statues and devotional sculptures with intricate silver inlay work.',
    specialties: ['Brass Work', 'Krishna Statues', 'Silver Inlay'],
    location: 'Bhaktapur, Nepal',
    experience: 28,
    products: ['8']
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Sacred Art of Buddha Statue Carving',
    excerpt: 'Discover the ancient techniques and spiritual significance behind traditional Buddha statue carving in the Himalayas.',
    content: 'Full blog content here...',
    author: 'Tenzin Norbu',
    publishDate: new Date('2024-12-15'),
    image: 'https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Buddha Statues', 'Traditional Art', 'Buddhist Culture']
  },
  {
    id: '2',
    title: 'The Lost-Wax Casting Technique for Brass Deities',
    excerpt: 'Learn about the intricate process of creating beautiful brass Hindu deity statues using ancient casting methods.',
    content: 'Full blog content here...',
    author: 'Ram Bahadur Shakya',
    publishDate: new Date('2024-12-10'),
    image: 'https://images.pexels.com/photos/8190837/pexels-photo-8190837.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Brass Statues', 'Hindu Deities', 'Casting Techniques']
  },
  {
    id: '3',
    title: 'Marble Sculpture: From Stone to Sacred Art',
    excerpt: 'Explore the journey of marble from raw stone to exquisite religious sculptures and the master craftsmen behind them.',
    content: 'Full blog content here...',
    author: 'Suresh Kumar',
    publishDate: new Date('2024-12-05'),
    image: 'https://images.pexels.com/photos/8190837/pexels-photo-8190837.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Marble Sculpture', 'Stone Carving', 'Religious Art']
  }
];