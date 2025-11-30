import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Product } from "../../types";

const IMG_PADDING = 12;

interface TextParallaxContentProps {
  imgUrl: string;
  subheading: string;
  heading: string;
  children: React.ReactNode;
}

const TextParallaxContent: React.FC<TextParallaxContentProps> = ({
  imgUrl,
  subheading,
  heading,
  children,
}) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage: React.FC<{ imgUrl: string }> = ({ imgUrl }) => {
  const targetRef = useRef(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // All available videos
  const videos = [
    '/videos/DJI_20251108131417_0106_D_MASTER.MP4',
    '/videos/DJI_20251108135342_0134_D_MASTER.MP4',
    '/videos/DJI_20251111064408_0174_D_MASTER.MP4',
    '/videos/DJI_20251111064536_0180_D_MASTER.MP4',
    '/videos/DJI_20251111064547_0181_D_MASTER.MP4',
    '/videos/DJI_20251111064715_0183_D_MASTER.MP4',
    '/videos/DJI_20251111064743_0185_D_MASTER.MP4',
    '/videos/DJI_20251111064754_0186_D_MASTER.MP4',
    '/videos/DJI_20251111064810_0187_D_MASTER.MP4',
    '/videos/DJI_20251111064823_0188_D_MASTER.MP4',
    '/videos/DJI_20251111064834_0189_D_MASTER.MP4',
  ];
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);

  React.useEffect(() => {
    const currentRef = activeVideo === 1 ? video1Ref : video2Ref;
    const nextRef = activeVideo === 1 ? video2Ref : video1Ref;
    const video = currentRef.current;
    const nextVideo = nextRef.current;
    
    if (!video || !nextVideo) return;

    // Set playback speed to 2x for both videos
    video.playbackRate = 1.5;
    nextVideo.playbackRate = 1.5;

    // Preload next video
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    nextVideo.src = videos[nextIndex];
    nextVideo.load();

    // Handle video end with smooth crossfade
    const handleVideoEnd = () => {
      // Start playing next video immediately
      nextVideo.play().then(() => {
        // Switch active video
        setActiveVideo(activeVideo === 1 ? 2 : 1);
        setCurrentVideoIndex(nextIndex);
      });
    };

    video.addEventListener('ended', handleVideoEnd);
    
    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [currentVideoIndex, activeVideo, videos]);

  return (
    <motion.div
      style={{
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden border-4 border-ink bg-black"
    >
      <video
        ref={video1Ref}
        autoPlay
        muted
        playsInline
        src={videos[0]}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          activeVideo === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      />
      
      <video
        ref={video2Ref}
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          activeVideo === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      />

      <motion.div
        className="absolute inset-0 bg-indigo-deep/70 z-20"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy: React.FC<{ subheading: string; heading: string }> = ({
  subheading,
  heading,
}) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-rice"
    >
      <p className="mb-4 text-center font-mono text-xl font-bold uppercase tracking-widest md:text-2xl">
        {subheading}
      </p>
      <p className="text-center font-display text-5xl font-bold md:text-7xl mb-6">{heading}</p>
      <p className="mb-8 max-w-2xl text-center font-mono text-lg md:text-xl text-rice/90 drop-shadow-brutal">
        Discover the spirit of Himalayan craftsmanship. Each piece is a story, hand-carved with devotion and tradition.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="font-mono uppercase tracking-widest text-lg px-8 py-4 shadow-brutal" variant="default" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>
          Shop Now
        </Button>
        <Button size="lg" className="font-mono uppercase tracking-widest text-lg px-8 py-4 shadow-brutal" variant="secondary" onClick={() => window.location.href = '/about'}>
          Learn More
        </Button>
      </div>
    </motion.div>
  );
};

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };


  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Card 
      className="w-full max-w-sm overflow-hidden group cursor-pointer hover:shadow-brutal-lg transition-all hover:translate-x-1 hover:translate-y-1"
      onClick={() => onProductClick(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden border-b-4 border-ink">
        <motion.img
          key={currentImageIndex}
          src={product.images[currentImageIndex]}
          alt={`${product.name} - View ${currentImageIndex + 1}`}
          className={`object-cover w-full h-full ${product.stock === 0 ? 'opacity-60' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 border-3 border-ink font-bold text-lg shadow-brutal-sm">
              OUT OF STOCK
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10"
            onClick={prevImage}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10"
            onClick={nextImage}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {product.images.map((_, index) => (
            <button
              key={index}
              className={`h-2 border-2 border-ink transition-all ${
                index === currentImageIndex
                  ? "bg-saffron w-6"
                  : "bg-white w-2"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
            />
          ))}
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <Badge variant="warning">
              Featured
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive">
              -{discount}%
            </Badge>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className={`absolute top-3 right-3 h-10 w-10 ${
            isWishlisted ? "bg-terracotta text-rice" : "bg-white"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
        >
          <Heart
            className={`h-5 w-5 ${isWishlisted ? "fill-rice" : ""}`}
          />
        </Button>
      </div>

      <CardContent className="p-5 space-y-3">
        <div>
          <h3 className="font-display font-bold text-lg line-clamp-1 text-ink mb-1">{product.name}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-saffron text-saffron" />
              <span className="ml-1 font-mono text-sm font-bold">
                {product.rating}
              </span>
            </div>
            <span className="font-mono text-xs text-charcoal">
              ({product.reviews || 0} reviews)
            </span>
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3 mb-3">
          <p className="text-sm font-semibold text-amber-800 text-center font-mono">
            Price depends on size & quality
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="font-mono text-xs px-2 py-1 bg-stone border-2 border-ink">
            {product.category}
          </span>
          {product.material && (
            <span className="font-mono text-xs px-2 py-1 bg-stone border-2 border-ink">
              {product.material}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onProductClick(product);
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

interface ParallaxProductShowcaseProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ParallaxProductShowcase({ products, onProductClick }: ParallaxProductShowcaseProps) {
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);

  return (
    <div className="bg-rice">
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=2000&auto=format&fit=crop"
        subheading="Authentic"
        heading="Nepali Treasures"
      >
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-12">
          {/* HERO CONTENT: Heading, subtitle, description, buttons */}
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-ink mb-2">
              Handcrafted with
              <span className="block text-terracotta">Tradition</span>
            </h2>
            <div className="mb-6">
              <span className="font-mono font-bold text-base md:text-lg uppercase tracking-widest text-indigo-deep drop-shadow-brutal">
                Cherished by Artisan Enthusiasts
              </span>
            </div>
            <p className="text-lg text-charcoal max-w-3xl mx-auto leading-relaxed font-display italic mb-8">
              Each sculpture is meticulously handcrafted by skilled Nepali artisans
              using traditional techniques passed down through generations. These
              pieces embody centuries of spiritual heritage and artistic excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="font-mono uppercase tracking-widest text-lg px-8 py-4 shadow-brutal" variant="default" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>
                Shop Now
              </Button>
              <Button size="lg" className="font-mono uppercase tracking-widest text-lg px-8 py-4 shadow-brutal" variant="secondary" onClick={() => window.location.href = '/about'}>
                Learn More
              </Button>
            </div>
          </div>

          {/* PRODUCT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
            ))}
          </div>
        </div>
      </TextParallaxContent>
    </div>
  );
}
