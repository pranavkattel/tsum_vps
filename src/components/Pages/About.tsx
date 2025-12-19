import React from 'react';
import { Award, Heart, Users, Globe, Mountain, Hammer, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rice via-stone/20 to-rice py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-ink mb-6 border-b-4 border-ink inline-block pb-2">
            About Tsum
          </h1>
          <p className="text-xl md:text-2xl text-charcoal max-w-4xl mx-auto font-body leading-relaxed mt-8">
            Bridging the sacred valleys of Tsum with the world, preserving ancient Himalayan 
            craftsmanship through authentic handmade treasures.
          </p>
        </div>

        {/* Story Section with Video/Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-4xl font-display font-bold text-ink border-l-8 border-terracotta pl-4">
              Our Story
            </h2>
            <p className="text-charcoal leading-relaxed text-lg font-body">
              Born from the mystical Tsum Valley in northern Nepal, our journey began with a 
              simple yet profound mission: to share the extraordinary artistry of Himalayan 
              craftspeople with the world.
            </p>
            <p className="text-charcoal leading-relaxed text-lg font-body">
              The Tsum Valley, a sacred pilgrimage destination nestled in the Himalayas, 
              is home to generations of master artisans who have perfected their craft over 
              centuries. Each singing bowl resonates with prayers, every statue embodies 
              devotion, and all textiles carry the soul of mountain tradition.
            </p>
            <p className="text-charcoal leading-relaxed text-lg font-body">
              We work directly with artisan families, ensuring their ancient techniques 
              survive and thrive in the modern world. Every piece tells a story of tradition, 
              spirituality, and the timeless beauty of Himalayan culture.
            </p>
            <div className="bg-indigo text-rice border-3 border-ink shadow-brutal p-6 mt-8">
              <p className="font-mono text-lg italic">
                "From the sacred mountains of Tsum to your home, we carry tradition 
                with every carefully crafted piece."
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="border-4 border-ink shadow-brutal-lg overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/DJI_20251111064408_0174_D_MASTER.MP4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-saffron border-3 border-ink px-6 py-3 shadow-brutal">
              <p className="font-mono font-bold text-ink">Since 2015</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-display font-bold text-ink text-center mb-4">Our Values</h2>
          <p className="text-center text-charcoal font-body text-lg mb-12 max-w-3xl mx-auto">
            Guided by principles that honor tradition, support communities, and celebrate authentic craftsmanship
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border-3 border-ink shadow-brutal p-8 hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="w-16 h-16 bg-terracotta border-3 border-ink flex items-center justify-center mb-4">
                <Mountain className="h-8 w-8 text-rice" />
              </div>
              <h3 className="text-2xl font-display font-bold text-ink mb-3">Himalayan Heritage</h3>
              <p className="text-charcoal font-body leading-relaxed">
                Every piece carries the essence of the Himalayas, handcrafted using 
                centuries-old techniques passed through generations.
              </p>
            </div>
            
            <div className="bg-white border-3 border-ink shadow-brutal p-8 hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="w-16 h-16 bg-indigo border-3 border-ink flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-rice" />
              </div>
              <h3 className="text-2xl font-display font-bold text-ink mb-3">Fair Partnership</h3>
              <p className="text-charcoal font-body leading-relaxed">
                Direct collaboration with artisan families, ensuring fair compensation 
                and sustainable livelihoods for mountain communities.
              </p>
            </div>
            
            <div className="bg-white border-3 border-ink shadow-brutal p-8 hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="w-16 h-16 bg-saffron border-3 border-ink flex items-center justify-center mb-4">
                <Hammer className="h-8 w-8 text-ink" />
              </div>
              <h3 className="text-2xl font-display font-bold text-ink mb-3">Authentic Craft</h3>
              <p className="text-charcoal font-body leading-relaxed">
                No mass production, no shortcuts. Only genuine handcrafted art 
                made with devotion and traditional mastery.
              </p>
            </div>
            
            <div className="bg-white border-3 border-ink shadow-brutal p-8 hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="w-16 h-16 bg-terracotta border-3 border-ink flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-rice" />
              </div>
              <h3 className="text-2xl font-display font-bold text-ink mb-3">Community Roots</h3>
              <p className="text-charcoal font-body leading-relaxed">
                Supporting Tsum Valley families and preserving their cultural identity 
                for future generations to inherit and honor.
              </p>
            </div>
            
            <div className="bg-white border-3 border-ink shadow-brutal p-8 hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="w-16 h-16 bg-indigo border-3 border-ink flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-rice" />
              </div>
              <h3 className="text-2xl font-display font-bold text-ink mb-3">Spiritual Connection</h3>
              <p className="text-charcoal font-body leading-relaxed">
                Each creation is blessed with prayers and positive intentions, 
                carrying spiritual energy from sacred Himalayan monasteries.
              </p>
            </div>
            
            <div className="bg-white border-3 border-ink shadow-brutal p-8 hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="w-16 h-16 bg-saffron border-3 border-ink flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-ink" />
              </div>
              <h3 className="text-2xl font-display font-bold text-ink mb-3">Global Bridge</h3>
              <p className="text-charcoal font-body leading-relaxed">
                Connecting the remote Tsum Valley with conscious collectors worldwide, 
                sharing culture and tradition across continents.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-indigo to-indigo-deep border-4 border-ink shadow-brutal-lg p-12 mb-20">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-display font-bold text-rice mb-6">Our Mission</h2>
            <p className="text-xl text-rice/90 mb-8 font-body leading-relaxed">
              To preserve the sacred artisan traditions of the Tsum Valley by creating 
              sustainable pathways for master craftspeople to share their spiritual 
              creations with the world, ensuring ancient Himalayan wisdom and artistry 
              flourish for generations to come.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center bg-rice/10 border-2 border-rice/30 rounded-lg p-6">
                <div className="text-4xl font-bold text-saffron mb-2 font-mono">100+</div>
                <div className="text-rice font-body">Artisan Families</div>
              </div>
              <div className="text-center bg-rice/10 border-2 border-rice/30 rounded-lg p-6">
                <div className="text-4xl font-bold text-saffron mb-2 font-mono">8+</div>
                <div className="text-rice font-body">Himalayan Villages</div>
              </div>
              <div className="text-center bg-rice/10 border-2 border-rice/30 rounded-lg p-6">
                <div className="text-4xl font-bold text-saffron mb-2 font-mono">1000+</div>
                <div className="text-rice font-body">Treasures Shared</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white border-4 border-ink shadow-brutal-lg p-12 text-center">
          <h2 className="text-4xl font-display font-bold text-ink mb-6">Why We Exist</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-charcoal font-body leading-relaxed">
            <p>
              In the hidden valleys of the Himalayas, master artisans practice crafts that have 
              remained unchanged for over a thousand years. Their work is not just art—it's 
              prayer, meditation, and cultural preservation woven into every stroke and chisel.
            </p>
            <p>
              As the modern world reaches even the most remote corners, these ancient traditions 
              face the risk of disappearing. Young generations move to cities, traditional 
              techniques are forgotten, and priceless cultural heritage fades into history.
            </p>
            <p className="text-xl font-bold text-indigo border-t-4 border-b-4 border-indigo py-6 my-8">
              Tsum exists to change this narrative. We believe authentic Himalayan craftsmanship 
              deserves to thrive, not just survive.
            </p>
            <p>
              Every purchase supports an artisan family, preserves traditional knowledge, and 
              keeps the cultural flame of the Tsum Valley burning bright. You're not just 
              acquiring beautiful art—you're becoming part of a movement to protect 
              irreplaceable human heritage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}