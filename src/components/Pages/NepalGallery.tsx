import React, { useState } from 'react';
import { Mountain, X } from 'lucide-react';

const nepalScenery = [
  {
    id: 1,
    title: "Mount Everest",
    description: "The world's highest peak, standing at 8,848.86 meters above sea level",
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop",
    category: "Mountains"
  },
  {
    id: 2,
    title: "Annapurna Range",
    description: "Majestic Himalayan peaks reflecting in pristine mountain lakes",
    image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&auto=format&fit=crop",
    category: "Mountains"
  },
  {
    id: 3,
    title: "Phewa Lake, Pokhara",
    description: "Serene lake with stunning mountain reflections and traditional boats",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop",
    category: "Lakes"
  },
  {
    id: 4,
    title: "Kathmandu Valley",
    description: "Ancient temples and traditional architecture nestled in green valleys",
    image: "https://images.unsplash.com/photo-1584196603779-7b8b7c8c8b0c?w=800&auto=format&fit=crop",
    category: "Valleys"
  },
  {
    id: 5,
    title: "Himalayan Sunrise",
    description: "Golden rays illuminating the snow-capped peaks at dawn",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop",
    category: "Mountains"
  },
  {
    id: 6,
    title: "Rice Terraces",
    description: "Traditional terraced farming on hillsides showcasing Nepal's agricultural heritage",
    image: "https://images.unsplash.com/photo-1504870712357-65ea720d6078?w=800&auto=format&fit=crop",
    category: "Landscapes"
  },
  {
    id: 7,
    title: "Swayambhunath Stupa",
    description: "The iconic Monkey Temple overlooking Kathmandu Valley",
    image: "https://images.unsplash.com/photo-1571408782488-65b2c0e0a2f3?w=800&auto=format&fit=crop",
    category: "Heritage"
  },
  {
    id: 8,
    title: "Langtang Valley",
    description: "Pristine valley surrounded by towering Himalayan peaks",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    category: "Valleys"
  },
  {
    id: 9,
    title: "Mountain Monasteries",
    description: "Ancient Buddhist monasteries perched on mountain cliffs",
    image: "https://images.unsplash.com/photo-1552055564-8a0b0e8f9e3e?w=800&auto=format&fit=crop",
    category: "Heritage"
  },
  {
    id: 10,
    title: "Himalayan Wildlife",
    description: "Diverse flora and fauna in the world's highest mountains",
    image: "https://images.unsplash.com/photo-1516825513084-7a3397fcd108?w=800&auto=format&fit=crop",
    category: "Nature"
  },
  {
    id: 11,
    title: "Chitwan National Park",
    description: "Lush subtropical forests home to rhinos, tigers, and elephants",
    image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&auto=format&fit=crop",
    category: "Nature"
  },
  {
    id: 12,
    title: "Prayer Flags",
    description: "Colorful prayer flags fluttering in the mountain breeze",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&auto=format&fit=crop",
    category: "Culture"
  }
];

const categories = ["All", "Mountains", "Lakes", "Valleys", "Heritage", "Nature", "Landscapes", "Culture"];

export default function NepalGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<typeof nepalScenery[0] | null>(null);

  const filteredScenery = selectedCategory === "All" 
    ? nepalScenery 
    : nepalScenery.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-rice py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-16 bg-terracotta"></div>
            <Mountain className="w-6 h-6 text-terracotta" />
            <div className="h-1 w-16 bg-terracotta"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-display text-ink mb-4">
            Nepal's Natural Beauty
          </h1>
          <p className="text-lg text-charcoal max-w-3xl mx-auto leading-relaxed italic">
            Discover the breathtaking landscapes of Nepal, from the majestic Himalayas 
            to serene valleys and ancient cultural heritage sites.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 border-3 border-ink font-mono font-bold text-sm uppercase tracking-wider transition-all ${
                selectedCategory === category
                  ? 'bg-terracotta text-white shadow-brutal-sm translate-x-1 translate-y-1'
                  : 'bg-white text-ink hover:bg-saffron hover:translate-x-0.5 hover:translate-y-0.5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredScenery.map((scenery) => (
            <div
              key={scenery.id}
              onClick={() => setSelectedImage(scenery)}
              className="group cursor-pointer bg-white border-4 border-ink shadow-brutal hover:shadow-brutal-lg transition-all hover:translate-x-1 hover:translate-y-1 overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={scenery.image}
                  alt={scenery.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop';
                  }}
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-saffron text-ink px-3 py-1 border-2 border-ink font-mono font-bold text-xs uppercase">
                    {scenery.category}
                  </span>
                </div>
              </div>
              <div className="p-5 border-t-4 border-ink">
                <h3 className="text-xl font-display font-bold text-ink mb-2 group-hover:text-terracotta transition-colors">
                  {scenery.title}
                </h3>
                <p className="text-charcoal text-sm leading-relaxed">
                  {scenery.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredScenery.length === 0 && (
          <div className="text-center py-16">
            <Mountain className="w-16 h-16 text-charcoal/30 mx-auto mb-4" />
            <p className="text-charcoal text-lg font-display">No scenery found in this category</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-saffron transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="bg-white border-4 border-ink shadow-brutal-lg overflow-hidden">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full max-h-[70vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="p-6 border-t-4 border-ink">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-3xl font-display font-bold text-ink">
                    {selectedImage.title}
                  </h2>
                  <span className="bg-saffron text-ink px-4 py-2 border-2 border-ink font-mono font-bold text-xs uppercase">
                    {selectedImage.category}
                  </span>
                </div>
                <p className="text-charcoal text-lg leading-relaxed">
                  {selectedImage.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
