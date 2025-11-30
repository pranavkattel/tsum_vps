export const mockProducts = [
  {
    id: '1',
    name: 'Golden Buddha Meditation Statue',
    price: 15000,
    originalPrice: 18000,
    images: [
      '/images/IMG-20250704-WA0083.jpg',
      '/images/IMG-20250704-WA0082.jpg'
    ],
    description: 'Handcrafted Buddha statue made from sacred Himalayan wood with gold finishing. Perfect for meditation and spiritual practice.',
    category: 'Statues',
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
      '/images/IMG-20250704-WA0081.jpg',
      '/images/IMG-20250704-WA0046.jpg',
      '/images/IMG-20250704-WA0045.jpg',
      '/images/IMG-20250704-WA0044.jpg'
    ],
    description: 'Intricately detailed brass statue of Lord Ganesha. Handcrafted with traditional lost-wax casting technique.',
    category: 'Statues',
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
    images: [
      '/images/IMG-20250704-WA0080.jpg',
      '/images/IMG-20250704-WA0043.jpg',
      '/images/IMG-20250704-WA0042.jpg',
      '/images/IMG-20250704-WA0041.jpg',
      '/images/IMG-20250704-WA0040.jpg'
    ],
    description: 'Exquisite white marble statue of Lord Shiva in meditation pose. Carved from premium quality Rajasthani marble.',
    category: 'Statues',
    artisan: 'Mahesh Kumar',
    materials: ['Makrana Marble'],
    dimensions: { length: 20, width: 15, height: 35 },
    weight: 8.5,
    stock: 3,
    featured: true,
    rating: 4.9,
    reviews: 67,
    tags: ['Marble', 'Shiva', 'Religious', 'Hindu'],
    culturalSignificance: 'Shiva represents the destroyer and transformer within the Hindu trinity.',
    craftingTechnique: 'Hand-carved by master sculptors using traditional Rajasthani marble carving techniques.'
  },
  {
    id: '4',
    name: 'Tibetan Prayer Bells Set',
    price: 8500,
    images: [
      '/images/IMG-20250704-WA0079.jpg',
      '/images/IMG-20250704-WA0039.jpg',
      '/images/IMG-20250704-WA0038.jpg',
      '/images/IMG-20250704-WA0037.jpg'
    ],
    description: 'Authentic Tibetan prayer bells with sacred mantras inscribed. Used for meditation and spiritual ceremonies.',
    category: 'Bells',
    artisan: 'Lobsang Tenzin',
    materials: ['Bronze', 'Silver Inlay'],
    dimensions: { length: 8, width: 8, height: 12 },
    weight: 0.8,
    stock: 15,
    featured: false,
    rating: 4.7,
    reviews: 134,
    tags: ['Bronze', 'Prayer Bells', 'Tibetan', 'Spiritual'],
    culturalSignificance: 'Prayer bells are used in Tibetan Buddhist rituals to clear negative energy.',
    craftingTechnique: 'Forged using traditional Tibetan metalworking techniques with sacred inscriptions.'
  },
  {
    id: '5',
    name: 'Rudraksha Mala Beads',
    price: 3500,
    images: [
      '/images/IMG-20250704-WA0078.jpg',
      '/images/IMG-20250704-WA0036.jpg',
      '/images/IMG-20250704-WA0035.jpg',
      '/images/IMG-20250704-WA0029.jpg'
    ],
    description: 'Authentic 108-bead Rudraksha mala for meditation and prayer. Each bead is carefully selected and blessed.',
    category: 'Mala',
    artisan: 'Guru Prasad',
    materials: ['Rudraksha Seeds', 'Silk Thread'],
    dimensions: { length: 100, width: 1, height: 1 },
    weight: 0.2,
    stock: 25,
    featured: false,
    rating: 4.6,
    reviews: 89,
    tags: ['Rudraksha', 'Mala', 'Prayer Beads', 'Meditation'],
    culturalSignificance: 'Rudraksha beads are considered sacred in Hinduism and Buddhism for spiritual practice.',
    craftingTechnique: 'Hand-strung using traditional methods with genuine Rudraksha seeds.'
  }
];

export const mockCategories = [
  {
    id: '1',
    name: 'Statues',
    image: '/images/category-statues.jpg',
    description: 'Handcrafted religious and decorative statues',
    productCount: 45
  },
  {
    id: '2',
    name: 'Bells',
    image: '/images/category-bells.jpg',
    description: 'Traditional prayer and ceremonial bells',
    productCount: 12
  },
  {
    id: '3',
    name: 'Mala',
    image: '/images/category-mala.jpg',
    description: 'Prayer beads and spiritual jewelry',
    productCount: 18
  },
  {
    id: '4',
    name: 'Singing Bowl',
    image: '/images/category-singing-bowls.jpg',
    description: 'Tibetan singing bowls for meditation',
    productCount: 25
  }
];