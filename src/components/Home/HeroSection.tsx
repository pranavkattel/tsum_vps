import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Mountain, Hand } from 'lucide-react';

interface HeroSectionProps {
  onPageChange: (page: string) => void;
}

export default function HeroSection({ onPageChange }: HeroSectionProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-indigo-gradient">
      {/* Geometric Mandala Pattern */}
      <div className="absolute inset-0 opacity-10 pattern-mandala"></div>
      
      {/* Accent Elements - Neo-Brutalist Blocks */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-20 left-10 w-32 h-32 bg-saffron border-4 border-ink"
        style={{ transform: 'rotate(12deg)' }}
      ></motion.div>
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="absolute bottom-32 right-16 w-24 h-24 bg-terracotta border-4 border-ink"
        style={{ transform: 'rotate(-15deg)' }}
      ></motion.div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-rice rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-saffron-light rounded-full"></div>
      
      {/* Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-7xl mx-auto px-6 py-20"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-saffron text-ink border-3 border-ink font-mono font-bold text-xs uppercase tracking-wider">
            <Mountain className="h-4 w-4" />
            Authentic Himalayan Craft
          </span>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="hero-headline text-rice mb-8 leading-none"
        >
          Sculptures That
          <span className="block text-saffron mt-2">Tell Stories</span>
        </motion.h1>
        
        <motion.div 
          variants={itemVariants}
          className="w-20 h-1 bg-terracotta mx-auto mb-8"
        ></motion.div>
        
        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-stone font-display italic"
        >
          Each piece embodies centuries of Nepali artistry—handcrafted by master sculptors 
          who learned their craft from generations past. This is heritage you can hold.
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-5 justify-center mb-20"
        >
          <button
            onClick={() => onPageChange('shop')}
            className="btn-primary flex items-center justify-center gap-3 group"
          >
            View Collection 
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onPageChange('artisans')}
            className="btn-secondary"
          >
            Explore Nepal
          </button>
        </motion.div>
        
        {/* Trust Indicators - Brutalist Cards */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            { icon: Sparkles, title: 'Hand-Carved', desc: 'No two pieces identical' },
            { icon: Mountain, title: 'From Kathmandu', desc: 'Direct from artisan studios' },
            { icon: Hand, title: 'Fair Trade', desc: 'Ethical sourcing guaranteed' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-rice border-4 border-ink p-6 shadow-brutal hover:shadow-brutal-hover transition-all hover:translate-x-1 hover:translate-y-1 cursor-default"
            >
              <div className="mb-4 inline-block p-3 bg-saffron border-3 border-ink">
                <item.icon className="h-6 w-6 text-ink" />
              </div>
              <h3 className="font-mono font-bold text-ink text-sm uppercase tracking-wider mb-2">{item.title}</h3>
              <p className="text-sm text-charcoal font-display">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}