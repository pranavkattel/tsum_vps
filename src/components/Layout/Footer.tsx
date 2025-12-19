import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-indigo-deep text-rice border-t-4 border-ink relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta opacity-10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-saffron opacity-10 rounded-full -ml-24 -mb-24"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-5">
            <div className="inline-block">
              <h3 className="text-4xl font-display font-bold text-saffron bg-terracotta px-3 py-1 border-3 border-rice">
                T
              </h3>
            </div>
            <p className="text-stone leading-relaxed text-sm font-display italic">
              Authentic handcrafted treasures from the sacred Tsum Valley, 
              preserving ancient Himalayan traditions through master artisanship.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 border-3 border-rice hover:bg-saffron hover:border-saffron transition-colors group">
                <Facebook className="h-5 w-5 text-rice group-hover:text-ink" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 border-3 border-rice hover:bg-saffron hover:border-saffron transition-colors group">
                <Instagram className="h-5 w-5 text-rice group-hover:text-ink" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 border-3 border-rice hover:bg-saffron hover:border-saffron transition-colors group">
                <Twitter className="h-5 w-5 text-rice group-hover:text-ink" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-saffron mb-6">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-stone hover:text-saffron transition-colors text-sm font-display hover:translate-x-1 inline-block">
                  → Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-stone hover:text-saffron transition-colors text-sm font-display hover:translate-x-1 inline-block">
                  → Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone hover:text-saffron transition-colors text-sm font-display hover:translate-x-1 inline-block">
                  → About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-stone hover:text-saffron transition-colors text-sm font-display hover:translate-x-1 inline-block">
                  → Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-saffron mb-6">Collections</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?category=Buddha Statues" className="text-stone hover:text-saffron transition-colors text-sm font-display hover:translate-x-1 inline-block">
                  → Buddha Statues
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Singing Bowls" className="text-stone hover:text-saffron transition-colors text-sm font-display hover:translate-x-1 inline-block">
                  → Singing Bowls
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Thangka Paintings" className="text-stone hover:text-saffron transition-colors text-sm font-display hover:translate-x-1 inline-block">
                  → Thangka Paintings
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Prayer Flags" className="text-stone hover:text-saffron transition-colors text-sm font-display hover:translate-x-1 inline-block">
                  → Prayer Flags
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-stone hover:text-saffron transition-colors text-sm font-display hover:translate-x-1 inline-block">
                  → View All
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-saffron mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-saffron flex-shrink-0 mt-0.5" />
                <span className="text-stone text-sm font-display">Tsum Valley, Gorkha<br />Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-saffron flex-shrink-0" />
                <a href="tel:+977-1-4701234" className="text-stone text-sm font-mono hover:text-saffron transition-colors">
                  +977-1-4701234
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-saffron flex-shrink-0" />
                <a href="mailto:info@tsum.com" className="text-stone text-sm font-mono hover:text-saffron transition-colors">
                  info@tsum.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-3 border-rice/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone text-xs font-mono">
              © 2025 T HIMALAYAN INTL. ARTS & HANDICRAFT PVT. LTD.
            </p>
            <p className="text-stone text-xs font-display italic">
              From the Sacred Tsum Valley to the World
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}