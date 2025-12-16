import React from 'react';
import { ShoppingBag, Phone } from 'lucide-react';
import { GiChicken } from 'react-icons/gi';

const NormalSeasonHero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop Layout - Two Separate Cards with Gap */}
      <div className="hidden md:block w-full bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-32 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-12">
            {/* Left Card - Content */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-12 rounded-3xl shadow-xl">
              <p className="text-green-700 text-base font-semibold mb-4 tracking-wide uppercase">
                Blessing Poultries
              </p>
              
              <h1 className="text-4xl font-black mb-6 leading-tight text-green-800">
                Fresh, Healthy,<br/>
                <span className="text-green-600">Naturally Raised Poultry.</span>
              </h1>
              
              <p className="text-gray-700 text-base mb-8 leading-relaxed">
                Trusted poultry production and expert bird treatments for over 5 years in Ota.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => scrollToSection('products')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  View Poultry
                </button>
                
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="border border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold text-base hover:bg-green-600 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Get Quote
                </button>
              </div>
              
              <div className="mt-8 flex items-center gap-2 text-sm text-green-700">
                <GiChicken className="w-5 h-5" />
                <span>Located in Ota • 5+ Years Experience</span>
              </div>
            </div>
            
            {/* Right Card - Image */}
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <div 
                className="relative bg-cover bg-center h-full min-h-[450px]"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full Fluid Width */}
      <div className="md:hidden w-full">
        <div 
          className="relative w-full min-h-[500px] flex items-center pt-24 pb-8"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Mobile Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/50 to-green-700/30"></div>
          
          {/* Mobile Content */}
          <div className="relative z-10 text-center text-white px-6 py-12 w-full">
            <h1 className="text-3xl font-black mb-3 leading-tight">
              Fresh, Healthy,<br/>
              <span className="text-green-400">Naturally Raised Poultry</span>
            </h1>
            
            <p className="text-base mb-6 text-gray-200">
              Trusted poultry production • 5+ years in Ota
            </p>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => scrollToSection('products')}
                className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm"
              >
                View Poultry
              </button>
              
              <button 
                onClick={() => scrollToSection('contact')}
                className="border border-white text-white px-6 py-2.5 rounded-lg font-semibold text-sm"
              >
                Get Quote
              </button>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-yellow-400">
              <GiChicken className="w-4 h-4" />
              <span>Blessing Poultries, Ota</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NormalSeasonHero;