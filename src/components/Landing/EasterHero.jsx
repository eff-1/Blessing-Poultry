// Easter Hero Component
// Add your Easter hero code 
import React, { useState, useEffect } from 'react';
import { Sun, Sparkles, Leaf, ShoppingBag } from 'lucide-react';
import { GiChicken } from 'react-icons/gi';

const EasterHero = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate floating "pollen" or "sparkles" for spring vibe
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2, // Slightly larger for petals/dots
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-emerald-50 pt-16 md:pt-28 pb-3 md:pb-6 px-4 md:px-8">
      {/* Main Hero Card Container - Matches Ramadan Dimensions */}
      <div 
        className="relative max-w-full mx-auto overflow-hidden rounded-2xl md:rounded-3xl shadow-xl bg-[#4E745A]"
        style={{
          backgroundImage: `url('/images/decorative/farm-spring.jpeg')`,

          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#4E745A'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/80 via-emerald-800/70 to-green-900/85" />
        
        {/* Animated Spring Particles (White/Yellow dots) */}
        {particles.map(p => (
          <div
            key={p.id}
            className={`absolute rounded-full opacity-40 ${p.id % 2 === 0 ? 'bg-yellow-200' : 'bg-white'}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `floatUp ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}

        {/* Main Content - Compact Layout */}
        <div className="relative z-10 px-4 md:px-8 py-5 md:py-8">
          
          {/* Blessing Poultries Greeting */}
          <div className="text-center mb-2 md:mb-3">
            <p className="text-white/90 text-xs md:text-sm font-semibold tracking-wide">
              Celebrate with <span className="text-yellow-300 font-bold">Blessing Poultries</span>
            </p>
          </div>

          {/* Top Badge */}
          <div className="flex justify-center mb-2 md:mb-3">
            <div className="inline-flex items-center gap-2 bg-white/90 text-[#4E745A] px-4 py-1.5 md:px-6 md:py-2 rounded-full shadow-lg backdrop-blur-sm">
              <GiChicken className="w-3 h-3 md:w-5 md:h-5 text-orange-400" />
              <span className="font-black text-xs md:text-sm tracking-wider uppercase">Happy Easter</span>
              <Leaf className="w-3 h-3 md:w-5 md:h-5 text-green-600 animate-pulse" />
            </div>
          </div>

          {/* Decorative Easter Egg Icon */}
          <div className="flex justify-center mb-2 md:mb-3">
            <div className="relative group cursor-pointer">
              {/* Custom CSS Egg Shape */}
              <div 
                className="w-10 h-14 md:w-14 md:h-20 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-[50%/60%_60%_40%_40%] shadow-lg animate-bounce-slow border-2 border-white/30"
                style={{ filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.4))' }}
              >
                {/* Egg Patterns */}
                <div className="absolute top-1/3 w-full h-1 bg-white/40"></div>
                <div className="absolute top-2/3 w-full h-1 bg-white/40"></div>
              </div>
              <Sparkles className="absolute -top-2 -right-4 w-4 h-4 md:w-6 md:h-6 text-yellow-200 animate-pulse" />
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-2 md:mb-3">
            <h1 className="text-2xl md:text-4xl font-black leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-yellow-200 animate-shimmer" style={{ backgroundSize: '200% 100%' }}>
                Egg-citing Deals
              </span>
              <span className="block text-white drop-shadow-md mt-1 text-xl md:text-3xl">
                On Fresh Chicken & Turkey
              </span>
            </h1>
          </div>

          {/* Subtext */}
          <div className="text-center mb-3 md:mb-4">
            <p className="text-base md:text-lg text-yellow-200 font-bold mb-0.5">
              Farm Fresh for the Feast
            </p>
            <p className="text-xs md:text-sm text-white/90 font-medium px-4">
              Make your Easter Sunday lunch unforgettable.
            </p>
          </div>

          {/* Discount Badge */}
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 text-[#4E745A] px-4 py-1.5 md:px-6 md:py-2.5 rounded-xl shadow-xl border border-white/20">
              <p className="text-lg md:text-2xl font-black text-white drop-shadow-md">
                GET 15% OFF
              </p>
              <p className="text-[9px] md:text-xs font-bold text-white/90 text-center">Use Code: EASTER15</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button 
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative px-6 md:px-10 py-2.5 md:py-3 bg-white text-[#4ea752] text-xs md:text-sm font-black rounded-full shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 group-hover:rotate-12 transition-transform" />
                Order Your Birds
              </span>
              <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Decorative Corner Elements */}
          <div className="hidden md:block absolute top-8 left-8 animate-sway">
            <Leaf className="w-8 h-8 text-green-300 opacity-30 rotate-45" />
          </div>
          <div className="hidden md:block absolute top-8 right-8 animate-spin-slow">
            <Sun className="w-8 h-8 text-yellow-300 opacity-30" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(45deg); }
          50% { transform: rotate(55deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .animate-sway {
          animation: sway 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default EasterHero;