/*
  # Seed Initial Data

  1. Insert sample categories
  2. Insert sample artisans
  3. Insert sample products
*/

-- Insert categories
INSERT INTO categories (id, name, description, image, product_count) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Religious Statues', 'Sacred statues and religious artifacts', 'https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg?auto=compress&cs=tinysrgb&w=400', 0),
  ('550e8400-e29b-41d4-a716-446655440002', 'Traditional Weapons', 'Authentic Nepali weapons and tools', 'https://images.pexels.com/photos/4101137/pexels-photo-4101137.jpeg?auto=compress&cs=tinysrgb&w=400', 0),
  ('550e8400-e29b-41d4-a716-446655440003', 'Traditional Clothing', 'Handwoven traditional garments', 'https://images.pexels.com/photos/8190804/pexels-photo-8190804.jpeg?auto=compress&cs=tinysrgb&w=400', 0),
  ('550e8400-e29b-41d4-a716-446655440004', 'Meditation Items', 'Items for meditation and spiritual practice', 'https://images.pexels.com/photos/6755122/pexels-photo-6755122.jpeg?auto=compress&cs=tinysrgb&w=400', 0),
  ('550e8400-e29b-41d4-a716-446655440005', 'Paper Crafts', 'Handmade paper products and crafts', 'https://images.pexels.com/photos/4207707/pexels-photo-4207707.jpeg?auto=compress&cs=tinysrgb&w=400', 0),
  ('550e8400-e29b-41d4-a716-446655440006', 'Wood Carvings', 'Intricate wood carved artifacts', 'https://images.pexels.com/photos/7251606/pexels-photo-7251606.jpeg?auto=compress&cs=tinysrgb&w=400', 0);

-- Insert artisans
INSERT INTO artisans (id, name, photo, bio, specialties, location, experience) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Tenzin Norbu', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300', 'Master wood carver specializing in Buddhist religious art. Born in Mustang, Nepal, Tenzin has been crafting sacred sculptures for over 25 years.', ARRAY['Wood Carving', 'Buddhist Art', 'Sacred Sculptures'], 'Mustang, Nepal', 25),
  ('660e8400-e29b-41d4-a716-446655440002', 'Bir Bahadur Kami', 'https://images.pexels.com/photos/1462636/pexels-photo-1462636.jpeg?auto=compress&cs=tinysrgb&w=300', 'Traditional blacksmith from the Kami community, known for crafting authentic Khukuris and traditional weapons with ancestral techniques.', ARRAY['Blacksmithing', 'Traditional Weapons', 'Metal Work'], 'Pokhara, Nepal', 18),
  ('660e8400-e29b-41d4-a716-446655440003', 'Kamala Shrestha', 'https://images.pexels.com/photos/3768263/pexels-photo-3768263.jpeg?auto=compress&cs=tinysrgb&w=300', 'Expert weaver specializing in traditional Dhaka fabric. Kamala learned the craft from her grandmother and continues the family tradition.', ARRAY['Weaving', 'Traditional Textiles', 'Dhaka Fabric'], 'Palpa, Nepal', 15);

-- Insert products
INSERT INTO products (
  id, name, price, original_price, images, description, category_id, artisan_id, 
  materials, dimensions, weight, stock, featured, rating, reviews_count, tags, 
  cultural_significance, crafting_technique
) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440001',
    'Himalayan Wood Carving Buddha',
    299.00,
    399.00,
    ARRAY[
      'https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/7251606/pexels-photo-7251606.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    'Handcrafted Buddha statue made from sacred Himalayan wood. Each piece is meticulously carved by master artisans, capturing the serene expression and spiritual essence of Buddhist art.',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    ARRAY['Himalayan Cedar Wood', 'Natural Lacquer'],
    '{"length": 15, "width": 10, "height": 20}',
    2.5,
    8,
    true,
    4.9,
    156,
    ARRAY['Buddha', 'Wood Carving', 'Religious', 'Meditation'],
    'Buddha statues are revered symbols of enlightenment and inner peace in Buddhist culture.',
    'Traditional hand-carving techniques passed down through generations of Tibetan artisans.'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440002',
    'Traditional Nepali Khukuri',
    199.00,
    NULL,
    ARRAY['https://images.pexels.com/photos/4101137/pexels-photo-4101137.jpeg?auto=compress&cs=tinysrgb&w=500'],
    'Authentic Nepali Khukuri with ornate handle and traditional blade design. A symbol of Nepali heritage and craftsmanship.',
    '550e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440002',
    ARRAY['Carbon Steel', 'Rhino Horn Handle', 'Leather Sheath'],
    '{"length": 35, "width": 8, "height": 3}',
    0.8,
    12,
    true,
    4.8,
    89,
    ARRAY['Khukuri', 'Traditional', 'Weapon', 'Cultural'],
    'The Khukuri is a traditional Nepali knife and symbol of bravery and honor.',
    'Forged using traditional methods with carbon steel and hand-finished details.'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440003',
    'Handwoven Dhaka Topi',
    45.00,
    NULL,
    ARRAY['https://images.pexels.com/photos/8190804/pexels-photo-8190804.jpeg?auto=compress&cs=tinysrgb&w=500'],
    'Traditional Nepali cap made from handwoven Dhaka fabric. Perfect for cultural ceremonies and traditional dress.',
    '550e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440003',
    ARRAY['Dhaka Fabric', 'Cotton Lining'],
    '{"length": 25, "width": 25, "height": 15}',
    0.2,
    25,
    false,
    4.7,
    43,
    ARRAY['Dhaka', 'Traditional', 'Clothing', 'Cultural'],
    'The Dhaka Topi is a traditional Nepali cap worn during festivals and ceremonies.',
    'Handwoven on traditional looms using time-honored techniques.'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440004',
    'Singing Bowl Set',
    149.00,
    NULL,
    ARRAY['https://images.pexels.com/photos/6755122/pexels-photo-6755122.jpeg?auto=compress&cs=tinysrgb&w=500'],
    'Authentic Tibetan singing bowl set with wooden striker and cushion. Perfect for meditation and sound healing.',
    '550e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440001',
    ARRAY['Seven Sacred Metals', 'Wooden Striker', 'Silk Cushion'],
    '{"length": 20, "width": 20, "height": 8}',
    1.2,
    15,
    true,
    4.9,
    234,
    ARRAY['Singing Bowl', 'Meditation', 'Healing', 'Tibetan'],
    'Used in Buddhist and Hindu meditation practices for centuries.',
    'Hand-hammered using traditional methods with seven sacred metals.'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440005',
    'Lokta Paper Journal',
    28.00,
    NULL,
    ARRAY['https://images.pexels.com/photos/4207707/pexels-photo-4207707.jpeg?auto=compress&cs=tinysrgb&w=500'],
    'Handmade journal crafted from traditional Lokta paper. Eco-friendly and durable with beautiful natural texture.',
    '550e8400-e29b-41d4-a716-446655440005',
    '660e8400-e29b-41d4-a716-446655440003',
    ARRAY['Lokta Paper', 'Natural Dyes', 'Hemp Binding'],
    '{"length": 21, "width": 15, "height": 2}',
    0.4,
    30,
    false,
    4.6,
    67,
    ARRAY['Journal', 'Paper', 'Eco-friendly', 'Handmade'],
    'Lokta paper has been used in Nepal for centuries for religious texts and documents.',
    'Made from the inner bark of the Lokta bush using traditional papermaking methods.'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440006',
    'Brass Deity Statue',
    389.00,
    NULL,
    ARRAY['https://images.pexels.com/photos/8190837/pexels-photo-8190837.jpeg?auto=compress&cs=tinysrgb&w=500'],
    'Intricately detailed brass statue of Hindu deity. Handcrafted with traditional lost-wax casting technique.',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440002',
    ARRAY['Pure Brass', 'Gold Plating'],
    '{"length": 12, "width": 8, "height": 25}',
    3.2,
    6,
    true,
    4.8,
    91,
    ARRAY['Brass', 'Deity', 'Religious', 'Hindu'],
    'Brass deities are central to Hindu worship and are considered sacred objects.',
    'Created using the ancient lost-wax casting method with intricate detailing.'
  );