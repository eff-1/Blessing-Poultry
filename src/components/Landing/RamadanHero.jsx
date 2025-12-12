


import React, { useState, useEffect } from 'react';
import { Moon, Star, Sparkles } from 'lucide-react';

const RamadanHero = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 pt-16 md:pt-28 pb-3 md:pb-6 px-4 md:px-8">
      {/* Main Hero Card Container - Compact */}
      <div 
        className="relative max-w-full mx-auto overflow-hidden rounded-2xl md:rounded-3xl shadow-xl bg-[#4E745A]"
        style={{
           backgroundImage: `url('/images/decorative/ramadan-bannerbg.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4E745A]/60 via-[#4E745A]/50 to-[#4E745A]/60" />

        {/* Animated Stars */}
        {stars.map(s => (
          <div
            key={s.id}
            className="absolute bg-yellow-200 rounded-full opacity-60"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animation: `twinkle ${s.duration}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`
            }}
          />
        ))}

        {/* Main Content - Compact Layout */}
        <div className="relative z-10 px-4 md:px-8 py-5 md:py-8">
          
          {/* Blessing Poultries Greeting */}
          <div className="text-center mb-2 md:mb-3">
            <p className="text-white/90 text-xs md:text-sm font-semibold">
              From <span className="text-yellow-300 font-bold">Blessing Poultries</span>, wishing you
            </p>
          </div>

          {/* Top Badge */}
          <div className="flex justify-center mb-2 md:mb-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-[#4E745A] px-4 py-1.5 md:px-6 md:py-2 rounded-full shadow-xl">
              <Moon className="w-3 h-3 md:w-5 md:h-5" />
              <span className="font-black text-xs md:text-sm tracking-wider">RAMADAN KAREEM</span>
              <Star className="w-3 h-3 md:w-5 md:h-5 animate-pulse" />
            </div>
          </div>

          {/* Decorative Crescent */}
          <div className="flex justify-center mb-2 md:mb-3">
            <div className="relative">
              <Moon className="w-10 h-10 md:w-14 md:h-14 text-yellow-400 drop-shadow-xl animate-float" style={{ filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.5))' }} />
              <Star className="absolute -top-1 -right-1 w-3 h-3 md:w-5 md:h-5 text-yellow-300 animate-pulse" />
            </div>
          </div>

          {/* Main Headline - Compact */}
          <div className="text-center mb-2 md:mb-3">
            <h1 className="text-2xl md:text-4xl font-black leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 animate-shimmer" style={{ backgroundSize: '200% 100%' }}>
                Blessed Ramadan
              </span>
              <span className="block text-white drop-shadow-xl mt-1 text-xl md:text-3xl">
                Fresh Halal Poultry
              </span>
            </h1>
          </div>

          {/* Arabic Calligraphy */}
          <div className="text-center mb-3 md:mb-4">
            <p className="text-base md:text-xl text-yellow-200 font-bold mb-0.5">
              ﷽
            </p>
            <p className="text-xs md:text-sm text-white/90 font-medium px-4">
              Premium quality for your blessed family
            </p>
          </div>

          {/* Discount Badge */}
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-[#4E745A] px-4 py-1.5 md:px-6 md:py-2.5 rounded-xl shadow-xl">
              <p className="text-lg md:text-2xl font-black">
                UP TO 40% OFF
              </p>
              <p className="text-[9px] md:text-xs font-bold opacity-80">Fresh Chickens & Turkeys</p>
            </div>
          </div>

          {/* CTA Button - Single */}
          <div className="flex justify-center">
            <button 
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative px-6 md:px-10 py-2.5 md:py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-[#4E745A] text-xs md:text-sm font-black rounded-full shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 group-hover:animate-pulse" />
                View Blessed Deals
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Decorative Stars */}
          <div className="hidden md:block absolute top-8 left-8 animate-float">
            <Star className="w-8 h-8 text-yellow-400 opacity-50" />
          </div>
          <div className="hidden md:block absolute top-8 right-8 animate-float" style={{ animationDelay: '1s' }}>
            <Star className="w-6 h-6 text-yellow-300 opacity-50" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export { RamadanHero };