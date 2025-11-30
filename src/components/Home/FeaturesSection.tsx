import { useEffect, useRef, useState } from 'react';
import { Shield, Truck, CreditCard, HeadphonesIcon, Award, RefreshCw } from 'lucide-react';

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Authenticity Guaranteed",
      description: "Every piece verified authentic with certificate from master artisans.",
      color: "terracotta"
    },
    {
      icon: Truck,
      title: "Worldwide Shipping",
      description: "Complimentary shipping on orders over $150. Secure packaging guaranteed.",
      color: "indigo"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Bank-level security with multiple payment options for your safety.",
      color: "saffron"
    },
    {
      icon: HeadphonesIcon,
      title: "Expert Support",
      description: "Cultural experts available 24/7 to guide your selection.",
      color: "terracotta"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Handpicked pieces meeting our highest craftsmanship standards.",
      color: "indigo"
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30-day hassle-free returns. Not satisfied? We'll make it right.",
      color: "saffron"
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-rice relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, #1a1a1a 35px, #1a1a1a 36px)`
        }}></div>
      </div>

      <div className="max-w-content mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-block mb-6">
            <span className="inline-block px-5 py-2 bg-saffron border-3 border-ink font-mono text-sm font-bold uppercase tracking-wider text-ink shadow-brutal-sm">
              Why Choose Us
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ink mb-6 leading-tight">
            Crafted With
            <span className="block text-terracotta mt-2">Care & Tradition</span>
          </h2>
          
          <p className="text-lg md:text-xl text-charcoal max-w-2xl mx-auto font-body leading-relaxed">
            Decades of Himalayan expertise ensuring exceptional quality from browsing to your doorstep.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const delay = index * 100;
            
            return (
              <div 
                key={index}
                className={`group bg-white border-3 border-ink shadow-brutal p-8 transition-all duration-500 hover:shadow-brutal-hover hover:translate-x-[3px] hover:translate-y-[3px] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: isVisible ? `${delay}ms` : '0ms'
                }}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 border-3 border-ink mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                  feature.color === 'terracotta' ? 'bg-terracotta' :
                  feature.color === 'indigo' ? 'bg-indigo' :
                  'bg-saffron'
                }`}>
                  <Icon className="h-8 w-8 text-rice" strokeWidth={2.5} />
                </div>
                
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-display font-bold text-ink mb-4 leading-tight group-hover:text-terracotta transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-charcoal font-body leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-ink border-r-transparent opacity-10 group-hover:opacity-20 transition-opacity"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom Accent */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-block border-t-3 border-ink pt-6">
            <p className="font-mono text-sm uppercase tracking-wider text-charcoal">
              Trusted by collectors worldwide since 1995
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
