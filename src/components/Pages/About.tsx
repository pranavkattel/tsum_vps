import React from 'react';
import { Award, Heart, Users, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            About Himali Crafts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Preserving Nepal's rich cultural heritage through authentic handicrafts, 
            connecting skilled artisans with art lovers worldwide.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2015, Himali Crafts began as a small initiative to support 
              traditional artisans in the remote villages of Nepal. What started as 
              a passion project has grown into a platform that celebrates and preserves 
              centuries-old crafting techniques.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We work directly with skilled artisans from various ethnic communities 
              across Nepal, ensuring they receive fair compensation for their 
              extraordinary work. Each piece in our collection tells a story of 
              tradition, skill, and cultural pride.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we're proud to be the bridge between these talented craftspeople 
              and customers worldwide who appreciate authentic, handmade art.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Artisan at work"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Authenticity</h3>
              <p className="text-gray-600">
                Every piece is handcrafted using traditional methods passed down through generations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fair Trade</h3>
              <p className="text-gray-600">
                We ensure artisans receive fair compensation and work in safe conditions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600">
                Supporting local communities and preserving traditional crafts for future generations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Global Impact</h3>
              <p className="text-gray-600">
                Connecting Nepali artisans with art lovers worldwide, sharing culture across borders.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              To preserve and promote Nepal's rich cultural heritage by providing a 
              sustainable platform for traditional artisans, while offering customers 
              authentic, handcrafted pieces that carry the soul of Himalayan craftsmanship.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">500+</div>
                <div className="text-gray-600">Artisans Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">50+</div>
                <div className="text-gray-600">Villages Reached</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">10,000+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Meet Our Team</h2>
          <p className="text-lg text-gray-600 mb-12">
            Passionate individuals dedicated to preserving Nepal's artistic heritage
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Founder"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Priya Sharma</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/1462636/pexels-photo-1462636.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Artisan Relations"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Rajesh Gurung</h3>
              <p className="text-gray-600">Artisan Relations</p>
            </div>
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/3768263/pexels-photo-3768263.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Quality Control"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Kamala Thapa</h3>
              <p className="text-gray-600">Quality Control</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}