import { AnimatedTestimonials } from '../ui/animated-testimonials';

const testimonials = [
  {
    quote: "The craftsmanship is absolutely incredible! My statue arrived perfectly packaged and exceeded all expectations. Each detail reflects the master artisan's dedication—truly museum-quality work.",
    name: "Sarah Chen",
    designation: "Art Collector, New York",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3560&auto=format&fit=crop",
  },
  {
    quote: "I've sourced pieces from around the world, but these Himalayan sculptures are unmatched. My clients are always amazed by the intricate details and authentic cultural significance.",
    name: "Michael Rodriguez",
    designation: "Interior Designer, London",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote: "The traditional piece I ordered is museum-quality. The attention to historical accuracy and authentic craftsmanship is remarkable. It's preserving cultural heritage.",
    name: "Emma Watson",
    designation: "Museum Curator, Sydney",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote: "Exceptional service and world-class artistry. The team's expertise helped me choose perfect pieces for my collection. Each sculpture tells a story of generations of mastery.",
    name: "James Kim",
    designation: "Private Collector, Seoul",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3464&auto=format&fit=crop",
  },
  {
    quote: "These aren't just decorative pieces—they're investments in cultural preservation. The authenticity and quality are unparalleled. Highly recommend to serious collectors.",
    name: "Lisa Thompson",
    designation: "Gallery Owner, Toronto",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2592&auto=format&fit=crop",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-indigo-deep relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pattern-dots pointer-events-none"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-saffron opacity-10 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-terracotta opacity-10 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-16 bg-saffron"></div>
            <span className="font-mono font-bold text-xs uppercase tracking-widest text-saffron">
              What Our Clients Say
            </span>
            <div className="h-1 w-16 bg-saffron"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold font-display text-rice mb-6 leading-tight">
            Cherished by
            <span className="block text-saffron">Artisan Enthusiasts</span>
          </h2>
          <p className="text-lg text-stone max-w-3xl mx-auto leading-relaxed italic">
            Hear from those who've experienced the beauty and craftsmanship 
            of our handcrafted Nepali treasures.
          </p>
        </div>

        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
      </div>
    </section>
  );
}