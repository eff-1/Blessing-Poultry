import { useState, useEffect } from 'react';
import { Gift, Sparkles, ShoppingBag } from 'lucide-react';
import { GiChicken } from 'react-icons/gi';
import { supabase } from '../../lib/supabaseClient';

const ChristmasHero = () => {
  const [particles, setParticles] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [heroData, setHeroData] = useState({
    title: 'CHRISTMAS',
    subtitle: 'MEGA SALE',
    discount_text: '50% OFF',
    cta_primary: 'Shop Now',
    background_image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200'
  });

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }));
    setParticles(newParticles);

    // Countdown to December 26, 2025 (10 days more)
    const targetDate = new Date('2025-12-26T00:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    fetchActiveHero();

    return () => clearInterval(timer);
  }, []);

  const fetchActiveHero = async () => {
    try {
      const { data: heroData } = await supabase
        .from('heroes')
        .select('*')
        .eq('is_active', true)
        .single();

      if (heroData) {
        setHeroData(heroData);
      }
    } catch (error) {
      console.log('No active hero found, using defaults');
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-20 md:pt-24 pb-4 md:pb-8 px-4">
      {/* Main Hero Card Container - Smaller on Desktop */}
      <div
        className="relative max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-2xl"
        style={{
          backgroundImage: `url('${heroData.background_image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-green-900/85 to-red-950/90" />

        {/* Animated Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full opacity-60"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}

        {/* Main Content */}
        <div className="relative z-10 px-4 md:px-8 py-8 md:py-12">

          {/* Top Section - Badge & Timer */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 md:mb-8 gap-4">
            {/* Limited Time Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 w-fit">
              <GiChicken className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
              <span className="font-bold text-xs md:text-sm tracking-wider">LIMITED TIME</span>
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
            </div>

            {/* Countdown Timer */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-3 md:p-4 shadow-xl w-full md:w-auto">
              <p className="text-yellow-300 font-semibold mb-2 text-xs md:text-sm text-center">🎄 Christmas 2025:</p>
              <div className="flex gap-2 md:gap-3 justify-center">
                {[
                  { value: timeLeft.days, label: 'DAY' },
                  { value: timeLeft.hours, label: 'HRS' },
                  { value: timeLeft.minutes, label: 'MIN' },
                  { value: timeLeft.seconds, label: 'SEC' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white text-lg md:text-2xl font-black w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center shadow-lg">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <span className="text-white/70 text-[9px] md:text-xs mt-1 font-semibold">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-none">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 animate-gradient">
                {heroData.title}
              </span>
              <span className="block text-white drop-shadow-2xl mt-1 md:mt-2">
                {heroData.subtitle}
              </span>
            </h1>
          </div>

          {/* Discount Text */}
          <div className="text-center mb-6 md:mb-8">
            <p className="text-3xl md:text-5xl font-black text-yellow-400 animate-pulse">
              {heroData.discount_text}
            </p>
          </div>

          {/* Two Feature Badges Only */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-semibold text-sm md:text-base">Flash Deals</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <Gift className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-semibold text-sm md:text-base">Free Gift</span>
            </div>
          </div>

          {/* Single Main CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={() => scrollToSection('products')}
              className="group relative px-10 md:px-16 py-4 md:py-5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg md:text-xl font-bold rounded-full shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-bounce" />
                {heroData.cta_primary}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 md:h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export { ChristmasHero };