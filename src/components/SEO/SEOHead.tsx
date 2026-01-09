import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
}

const SEOHead: React.FC<SEOProps> = ({
  title = 'Himalayan Handicrafts | Authentic Tsum Valley Buddhist Ritual Items | Sacred Tibetan Art',
  description = 'Discover authentic Himalayan handicrafts from Tsum Valley - Tibetan singing bowls, Buddhist prayer wheels, thangka paintings, meditation statues, and sacred ritual items. Premium handcrafted spiritual artifacts from Nepal\'s master artisans.',
  keywords = 'himalayan handicrafts, tsum valley crafts, buddhist ritual items, tibetan handicrafts, nepal handicrafts, singing bowls, prayer wheels, thangka paintings',
  image = 'https://thehimalayanhandicraft.com/og-image.jpg',
  url,
  type = 'website',
  schema
}) => {
  const location = useLocation();
  const currentUrl = url || `https://thehimalayanhandicraft.com${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    
    // Open Graph tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:type', type);
    
    // Twitter tags
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);
    updateMetaTag('name', 'twitter:url', currentUrl);
    
    // Canonical URL
    updateCanonicalLink(currentUrl);
    
    // Schema.org structured data
    if (schema) {
      updateStructuredData(schema);
    }
  }, [title, description, keywords, image, currentUrl, type, schema]);

  return null;
};

// Helper function to update meta tags
const updateMetaTag = (attribute: string, key: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

// Helper function to update canonical link
const updateCanonicalLink = (url: string) => {
  let link = document.querySelector('link[rel="canonical"]');
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', url);
};

// Helper function to update structured data
const updateStructuredData = (schema: object) => {
  let script = document.querySelector('script[data-dynamic-schema]');
  
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-dynamic-schema', 'true');
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(schema);
};

export default SEOHead;

// Pre-defined SEO configurations for different pages
export const SEOConfig = {
  home: {
    title: 'Himalayan Handicrafts | Authentic Tsum Valley Buddhist Ritual Items | Sacred Tibetan Art',
    description: 'Discover authentic Himalayan handicrafts from Tsum Valley - Tibetan singing bowls, Buddhist prayer wheels, thangka paintings, meditation statues, and sacred ritual items. Premium handcrafted spiritual artifacts from Nepal\'s master artisans.',
    keywords: 'himalayan handicrafts, tsum valley crafts, buddhist ritual items, tibetan handicrafts, nepal handicrafts, buddhist artifacts, tibetan singing bowls, prayer wheels, thangka paintings, buddhist statues, meditation statues, tibetan buddhism items'
  },
  
  shop: {
    title: 'Shop Authentic Buddhist Handicrafts | Tibetan Ritual Items | Tsum Valley Crafts',
    description: 'Browse our collection of authentic Himalayan handicrafts - Tibetan singing bowls, Buddhist prayer wheels, handcrafted statues, thangka paintings, meditation accessories, and sacred ritual items from Tsum Valley artisans.',
    keywords: 'buy buddhist items, shop tibetan handicrafts, purchase singing bowls, buddhist ritual items shop, himalayan crafts store, nepal handicrafts online, authentic tibetan art, buy prayer wheels, meditation items shop, buddhist decor store'
  },
  
  singingBowls: {
    title: 'Tibetan Singing Bowls | Handcrafted Meditation Bowls | Himalayan Sound Healing',
    description: 'Authentic Tibetan singing bowls handcrafted in Nepal. Premium copper, bronze, and crystal singing bowls for meditation, sound healing, chakra balancing, and spiritual practice. Each bowl is unique and carefully crafted by master artisans.',
    keywords: 'tibetan singing bowls, meditation bowls, sound healing bowls, chakra bowls, copper singing bowls, bronze singing bowls, crystal singing bowls, handcrafted bowls nepal, authentic singing bowls, himalayan bowls, therapy bowls, healing bowls, singing bowl sets, antique singing bowls'
  },
  
  prayerWheels: {
    title: 'Buddhist Prayer Wheels | Hand-Carved Mani Wheels | Tibetan Prayer Cylinders',
    description: 'Authentic Buddhist prayer wheels (Mani wheels) handcrafted by Tsum Valley artisans. Traditional copper, brass, and silver prayer wheels with sacred mantras. Desktop, wall-mounted, and handheld prayer wheels for spiritual practice.',
    keywords: 'buddhist prayer wheels, tibetan prayer wheels, mani wheels, prayer cylinders, hand prayer wheels, wall prayer wheels, copper prayer wheels, brass prayer wheels, om mani padme hum wheels, tibetan buddhist wheels, spinning prayer wheels, dharma wheels'
  },
  
  thangka: {
    title: 'Tibetan Thangka Paintings | Sacred Buddhist Art | Hand-Painted Thangkas Nepal',
    description: 'Authentic Tibetan thangka paintings hand-painted by master artists in Nepal. Sacred Buddhist scroll paintings featuring Buddha, Tara, Mandala, and deity representations. Traditional mineral pigments on cotton canvas. Perfect for meditation spaces and Buddhist altars.',
    keywords: 'tibetan thangka, thangka paintings, buddhist scroll paintings, hand painted thangka, sacred buddhist art, mandala thangka, buddha thangka, tara thangka, tibetan art, nepali thangka, traditional thangka, meditation paintings, spiritual art, buddhist wall art'
  },
  
  statues: {
    title: 'Buddhist Statues | Tibetan Buddha Figurines | Meditation Statues Nepal',
    description: 'Handcrafted Buddhist statues and figurines from Nepal. Authentic Buddha statues, Tara statues, meditation figures in brass, copper, bronze, and silver. Each statue is carefully crafted by skilled artisans following traditional techniques.',
    keywords: 'buddhist statues, buddha statues, tibetan statues, meditation statues, brass buddha, copper statues, bronze buddha, tara statues, avalokiteshvara statue, manjushri statue, shakyamuni buddha, green tara, white tara, meditation figurines, buddhist sculptures'
  },
  
  malaBeads: {
    title: 'Buddhist Mala Beads | Prayer Beads | Meditation Malas 108 Beads',
    description: 'Authentic Buddhist mala beads for meditation and prayer. Handcrafted 108-bead malas in sandalwood, rudraksha, crystal, gemstone, and bodhi seed. Traditional Tibetan and Nepali prayer beads for spiritual practice.',
    keywords: 'mala beads, buddhist prayer beads, meditation beads, 108 beads, rudraksha mala, sandalwood mala, crystal mala, gemstone mala, bodhi seed mala, tibetan mala, nepali mala, prayer necklace, meditation necklace, japa mala'
  },
  
  ritualItems: {
    title: 'Buddhist Ritual Items | Tibetan Ceremonial Tools | Puja Supplies',
    description: 'Complete collection of Buddhist ritual items and ceremonial tools. Vajra dorje, tingsha cymbals, offering bowls, butter lamps, incense burners, bells, and puja supplies. Authentic items used in Tibetan Buddhist ceremonies.',
    keywords: 'buddhist ritual items, tibetan ritual tools, dorje vajra, tingsha cymbals, offering bowls, butter lamps, buddhist bells, incense burners, puja items, ceremonial items, altar supplies, monastery items, lama tools, tantric items, vajrayana supplies'
  },
  
  incense: {
    title: 'Tibetan Incense | Himalayan Incense Sticks | Buddhist Meditation Incense',
    description: 'Authentic Tibetan and Himalayan incense handmade from natural herbs, resins, and essential oils. Traditional Buddhist meditation incense, temple incense, and sacred incense blends from Nepal monasteries.',
    keywords: 'tibetan incense, himalayan incense, buddhist incense, meditation incense, temple incense, natural incense, herbal incense, nepal incense, monastery incense, sandalwood incense, juniper incense, sacred incense, prayer incense'
  },
  
  homeDecor: {
    title: 'Buddhist Home Decor | Tibetan Wall Art | Himalayan Spiritual Decor',
    description: 'Transform your space with authentic Buddhist home decor from the Himalayas. Prayer flags, mandala tapestries, wall hangings, Tibetan rugs, meditation room decor, and spiritual artifacts for mindful living.',
    keywords: 'buddhist home decor, tibetan wall art, prayer flags, mandala tapestries, himalayan decor, meditation room decor, spiritual home decor, buddhist wall hangings, tibetan rugs, altar decorations, zen decor, mindful living decor'
  },
  
  about: {
    title: 'About Us | Tsum Valley Artisans | Himalayan Handicraft Heritage',
    description: 'Learn about our mission to preserve Tsum Valley\'s rich handicraft heritage. We work directly with master artisans in Nepal to bring authentic Buddhist ritual items and Himalayan crafts to the world. Fair trade, sustainable, and ethically sourced.',
    keywords: 'tsum valley artisans, himalayan craftsmen, nepal artisans, buddhist artisan collective, fair trade handicrafts, ethical crafts, sustainable handicrafts, traditional techniques, master craftsmen, cultural preservation'
  },
  
  contact: {
    title: 'Contact Us | Order Custom Buddhist Items | Himalayan Handicraft Inquiries',
    description: 'Contact The Himalayan Handicraft for custom orders, wholesale inquiries, or questions about our Buddhist ritual items and Tibetan handicrafts. We ship worldwide from Tsum Valley, Nepal.',
    keywords: 'contact himalayan handicraft, custom buddhist items, wholesale buddhist items, bulk orders, international shipping, nepal handicraft inquiry, custom thangka, custom statues, bespoke ritual items'
  }
};
