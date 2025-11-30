import connectDB from '../config/database.js';
import Product from '../models/Product.js';

// Correct mapping based on TIF conversion to JPG (spaces replaced with hyphens)
const productImageMap = {
  // Phase 1 - Artisan Pieces with 3 angles
  'P1-01': ['/01-front.jpg', '/01-Back.jpg', '/01-Mid.jpg'],
  'P1-02': ['/02-Wide.jpg', '/02-Back.jpg', '/02-Mid.jpg'],
  'P1-03': ['/03-Wide.jpg', '/03-Back.jpg', '/03-Mid.jpg'],
  'P1-04': ['/04-Wide.jpg', '/04-Back.jpg', '/04-Mid.jpg'],
  'P1-05': ['/05-Wide.jpg', '/05-Back.jpg', '/05-Mid.jpg'],
  'P1-06': ['/06-Wide.jpg', '/06-Back.jpg', '/06-Mid.jpg'],
  'P1-07': ['/07-Wide.jpg', '/07-Back.jpg', '/07-Mid.jpg'],
  'P1-08': ['/08-Wide.jpg', '/08-Back.jpg', '/08-Mid.jpg'],
  'P1-09': ['/09-Wide.jpg', '/09-Back.jpg', '/09-Mid.jpg'],
  'P1-10': ['/10-Wide.jpg', '/10-Back.jpg', '/10-Mid.jpg'],
  'P1-11': ['/11-Wide.jpg', '/11-Back.jpg', '/11-Mid.jpg'],
  'P1-12': ['/12-Wide.jpg', '/12-Back.jpg', '/12-Mid.jpg'],
  'P1-13': ['/13-Wide.jpg', '/13-Back.jpg', '/13-Mid.jpg'],
  'P1-14': ['/14-Wide.jpg', '/14-Back.jpg', '/14-Mid.jpg'],
  
  // Accessories - Phase 1
  'ACC-BELL-1': ['/Bell-1.jpg'],
  'ACC-BELL-2': ['/Bell-2.jpg'],
  'ACC-BELL-3': ['/Bell-3.jpg'],
  'ACC-BELL-COVER': ['/Bell-Cover.jpg'],
  'ACC-BELL-COVER-2': ['/Bell-cover-2.jpg'],
  'ACC-BELL-MID': ['/Bell-Mid.jpg'],
  'ACC-BOWLS': ['/Bowls.jpg'],
  'ACC-BOULS': ['/Bouls.jpg'],
  'ACC-BOWL2': ['/Bowl2.jpg'],
  'ACC-COVER': ['/Cover.jpg'],
  'ACC-DAMARU': ['/Damaru.jpg'],
  'ACC-DAMARU-COVER': ['/Damaru-Cover.jpg'],
  'ACC-KARUWA': ['/Karuwa.jpg'],
  'ACC-KARUWA-1': ['/Karuwa-1.jpg'],
  'ACC-KARUWA-2': ['/Karuwa-2.jpg'],
  'ACC-LIGHT-BOWLS': ['/Light-bouls.jpg'],
  'ACC-LIGHT-BOWLS-05': ['/Light-bouls-.5.jpg'],
  'ACC-LOCKET': ['/Locket.jpg'],
  'ACC-LOCKET-2': ['/Locket-2.jpg'],
  'ACC-MALA-1': ['/Mala-1.jpg'],
  'ACC-MALA-2': ['/Mala-2.jpg'],
  'ACC-MALA-25': ['/Mala-2.5.jpg'],
  'ACC-MALA-3': ['/Mala-3.jpg'],
  'ACC-MALA-4': ['/Mala-4.jpg'],
  'ACC-MALA-5': ['/Mala-5.jpg'],
  'ACC-MALA-55': ['/Mala-5.5.jpg'],
  'ACC-MALA-6': ['/Mala-6.jpg'],
  'ACC-MALA-66': ['/Mala6.6.jpg'],
  'ACC-MALA-7': ['/Mala-7.jpg'],
  'ACC-MALA-77': ['/Mala7.7.jpg'],
  'ACC-MALA-75': ['/Mala-7.5.jpg'],
  'ACC-MALA-8': ['/Mala-8.jpg'],
  'ACC-MALA-88': ['/Mala-8.8.jpg'],
  'ACC-MALA-9': ['/Mala-9.jpg'],
  'ACC-MALA-99': ['/Mala9.9.jpg'],
  'ACC-MALAS': ['/Malas.jpg'],
  'ACC-MALAS-05': ['/Malas.5.jpg'],
  'ACC-PRAY': ['/Pray.jpg'],
  'ACC-PRAY-BOWL': ['/Pray-boul.jpg'],
  'ACC-PRAY-BOWLS-05': ['/Pray-bouls-.5.jpg'],
  
  // Phase 2 - Big items
  'P2-BIG-BUDDHA-01': ['/Big-Buddha.jpg'],
  'P2-BIG-BUDDHA-02': ['/Big-Buddha-Back.jpg'],
  'P2-BIG-STATUE-01': ['/Big-Statue.jpg'],
  'P2-BIG-STATUE-02': ['/Big-Statue-Mid.jpg'],
  
  // Phase 2 - Singing Bowls
  'P2-BOWL-01': ['/Singing-Bowl-1.jpg'],
  'P2-BOWL-01-5': ['/Singing-Bowl-1.5.jpg'],
  'P2-BOWL-02': ['/Singing-Bowl-2.jpg'],
  'P2-BOWL-02-5': ['/Singing-Bowl-2.5.jpg'],
  'P2-BOWL-03': ['/Singing-Bowl-3.jpg'],
  'P2-BOWL-03-5': ['/Singing-Bowl-3.5.jpg'],
  'P2-BOWL-04': ['/Singing-Bowl-4.jpg'],
  'P2-BOWL-04-5': ['/Singing-Bowl-4.5.jpg'],
  'P2-BOWL-05': ['/Singing-Bowl-5.jpg'],
  'P2-BOWL-05-5': ['/Singing-Bowl-5.5.jpg'],
  'P2-BOWL-06': ['/Singing-Bowl-6.jpg'],
  'P2-BOWL-06-5': ['/Singing-Bowl-6.5.jpg'],
  'P2-BOWL-07': ['/Singing-Bowl-7.jpg'],
  'P2-BOWL-07-5': ['/Singing-Bowl-7.5.jpg'],
  'P2-BOWL-08': ['/Singing-Bowl-8.jpg'],
  'P2-BOWL-08-5': ['/Singing-Bowl-8.5.jpg'],
  'P2-BOWL-09': ['/Singing-Bowl-9.jpg'],
  'P2-BOWL-09-5': ['/Singing-Bowl-9.5.jpg'],
  'P2-BOWL-10': ['/Singing-Bowl-10.jpg'],
  'P2-BOWL-10-5': ['/Singing-Bowl-10.5.jpg'],
  'P2-BOWL-11': ['/Singing-Bowl-11.jpg'],
  'P2-BOWL-11-5': ['/Singing-Bowl-11.5.jpg'],
  'P2-BOWL-12': ['/Singing-Bowl-12.jpg'],
  'P2-BOWL-12-5': ['/Singing-Bowl-12.5.jpg'],
  'P2-BOWL-13': ['/Singing-Bowl-13.jpg'],
  'P2-BOWL-13-5': ['/Singing-Bowl-13.5.jpg'],
  'P2-BOWL-13-55': ['/Singing-Bowl-13.55.jpg'],
  'P2-BOWL-14': ['/Singing-Bowl-14.jpg'],
  'P2-BOWL-14-5': ['/Singing-Bowl-14.5.jpg'],
  
  // Phase 2 - Covers and others
  'P2-COVER-01': ['/Singing-Bowl-cover.jpg'],
  'P2-COVER-02': ['/Singing-Bowl-cover-2.jpg'],
  'P2-COVER-03': ['/Singing-Bowl-cover-3.jpg'],
  'P2-BOWL-REG': ['/Bowl.jpg'],
  'P2-PUJA-BOWL': ['/Puja-bowl.jpg'],
  'P2-ARROW': ['/Arrow.jpg'],
  'P2-STONE-01': ['/Stone.jpg'],
  'P2-STONE-02': ['/Stone-2.jpg'],
  'P2-STONE-03': ['/Stone-3.jpg'],
};

async function setCorrectImages() {
  try {
    await connectDB();
    console.log('Setting correct images for all products...\n');
    
    let updated = 0;
    let notFound = 0;
    
    for (const [productId, images] of Object.entries(productImageMap)) {
      const result = await Product.updateOne(
        { id: productId },
        { $set: { images } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✓ ${productId}: ${images.length} image(s) - ${images[0]}`);
        updated++;
      } else {
        console.log(`✗ ${productId}: Product not found in database`);
        notFound++;
      }
    }
    
    console.log(`\nDone! Updated: ${updated}, Not found: ${notFound}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setCorrectImages();
