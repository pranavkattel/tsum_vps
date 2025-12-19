import React, { useState } from 'react';
import { Mountain, X } from 'lucide-react';

const nepalScenery = [
  {
    id: 1,
    title: "Mount Everest",
    description: "The world's highest peak, standing at 8,848.86 meters above sea level",
    image: "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Mountains"
  },
  {
    id: 2,
    title: "Boudhanath Stupa",
    description: "One of the largest Buddhist stupas in the world, a UNESCO World Heritage Site in Kathmandu",
    image: "https://images.pexels.com/photos/17536928/pexels-photo-17536928.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Heritage"
  },
  {
    id: 3,
    title: "Phewa Lake, Pokhara",
    description: "Serene lake with stunning Annapurna mountain reflections",
    image: "https://images.pexels.com/photos/19694988/pexels-photo-19694988.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Lakes"
  },
  {
    id: 4,
    title: "Pashupatinath Temple",
    description: "Sacred Hindu temple complex on the banks of Bagmati River, UNESCO World Heritage Site",
    image: "https://images.pexels.com/photos/12211593/pexels-photo-12211593.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Heritage"
  },
  {
    id: 5,
    title: "Annapurna Range",
    description: "Majestic Himalayan peaks including Annapurna I (8,091m), the 10th highest mountain",
    image: "https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Mountains"
  },
  {
    id: 6,
    title: "Swayambhunath (Monkey Temple)",
    description: "Ancient Buddhist stupa overlooking Kathmandu Valley, over 2,500 years old",
    image: "https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Heritage"
  },
  {
    id: 7,
    title: "Durbar Square, Kathmandu",
    description: "Historic square showcasing Newar architecture and ancient royal palaces",
    image: "https://images.pexels.com/photos/13523395/pexels-photo-13523395.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Heritage"
  },
  {
    id: 8,
    title: "Machapuchare (Fishtail Mountain)",
    description: "Sacred mountain with distinctive double peak, never been climbed",
    image: "https://images.pexels.com/photos/11599532/pexels-photo-11599532.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Mountains"
  },
  {
    id: 9,
    title: "Patan Durbar Square",
    description: "Ancient city square with exquisite temples and traditional Newari architecture",
    image: "https://images.pexels.com/photos/17536927/pexels-photo-17536927.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Heritage"
  },
  {
    id: 10,
    title: "Chitwan National Park",
    description: "UNESCO World Heritage Site, home to Bengal tigers, one-horned rhinos, and diverse wildlife",
    image: "https://images.pexels.com/photos/4577793/pexels-photo-4577793.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Nature"
  },
  {
    id: 11,
    title: "Bhaktapur Durbar Square",
    description: "Medieval city square with 55-window palace and ancient temples",
    image: "https://images.pexels.com/photos/4967119/pexels-photo-4967119.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Heritage"
  },
  {
    id: 12,
    title: "Lumbini - Birthplace of Buddha",
    description: "Sacred pilgrimage site and UNESCO World Heritage Site where Buddha was born",
    image: "https://images.pexels.com/photos/6207876/pexels-photo-6207876.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Heritage"
  },
  {
    id: 13,
    title: "Himalayan Prayer Flags",
    description: "Colorful prayer flags in the Himalayas carrying blessings on mountain winds",
    image: "https://images.pexels.com/photos/1619310/pexels-photo-1619310.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Culture"
  },
  {
    id: 14,
    title: "Langtang Valley",
    description: "Beautiful valley known as the 'Valley of Glaciers' in Langtang National Park",
    image: "https://images.pexels.com/photos/4474536/pexels-photo-4474536.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Valleys"
  },
  {
    id: 15,
    title: "Rara Lake",
    description: "Nepal's largest and deepest lake, surrounded by pristine alpine forests",
    image: "https://images.pexels.com/photos/8828523/pexels-photo-8828523.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Lakes"
  },
  {
    id: 16,
    title: "Tengboche Monastery",
    description: "Famous Buddhist monastery on the trail to Everest Base Camp",
    image: "https://images.pexels.com/photos/8533496/pexels-photo-8533496.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Heritage"
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
