import { Users, ShoppingBag, Star, Globe } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Happy Customers",
      description: "Worldwide"
    },
    {
      icon: ShoppingBag,
      value: "50,000+",
      label: "Products Sold",
      description: "Since 2015"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Customer Rating",
      description: "Verified Reviews"
    },
    {
      icon: Globe,
      value: "85+",
      label: "Countries Served",
      description: "Global Reach"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our commitment to authentic craftsmanship and exceptional service has earned the trust of customers across the globe.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
