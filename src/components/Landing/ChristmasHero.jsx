import { useState, useEffect } from 'react';
import { Gift, Sparkles, ShoppingBag, Zap, Star, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ChristmasHero = () => {
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroData, setHeroData] = useState({
    title: 'CHRISTMAS',
    subtitle: 'MEGA SALE',
    description: 'Up to 70% OFF',
    discount_text: '70% OFF',
    countdown_days: 23,
    countdown_hours: 45,
    countdown_minutes: 12,
    countdown_seconds: 38,
    cta_primary: 'Shop Now',
    cta_secondary: 'View Deals',
    background_image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200',
    features: [
      { icon: 'Gift', text: 'Free Gift' },
      { icon: 'Sparkles', text: 'Flash Deals' },
      { icon: 'Heart', text: '100K+ Fans' }
    ]
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

    fetchActiveHero();
  }, []);

  const fetchActiveHero = async () => {
    try {
      const { data } = await supabase
        .from('heroes')
        .select('*')
        .eq('is_active', true)
        .single();

      if (data) {
        setHeroData(data);
      }
    } catch (error) {
      console.log('No active hero found, using defaults');
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      Gift,
      Sparkles,
      ShoppingBag,
      Zap,
      Star,
      Heart
    };
    return icons[iconName] || Gift;
  };

  return (
    <div className="w-full bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-20 md:pt-24 pb-4 md:pb-8 px-4">
      {/* Main Hero Card Container */}
      <div
        className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl shadow-2xl"
        onMouseMove={handleMouseMove}
        style={{
          backgroundImage: `url('${heroData.background_image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-green-900/85 to-red-950/90" />

        {/* Animated Background Particles */}
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

        {/* Gradient Orbs - Hidden on mobile for performance */}
        <div
          className="hidden md:block absolute w-64 h-64 lg:w-96 lg:h-96 bg-gradient-radial from-red-500/30 to-transparent rounded-full blur-3xl transition-all duration-300"
          style={{
            left: `${mousePos.x - 10}%`,
            top: `${mousePos.y - 10}%`
          }}
        />
        <div className="hidden md:block absolute top-1/4 right-1/4 w-60 h-60 lg:w-80 lg:h-80 bg-gradient-radial from-green-500/20 to-transparent rounded-full blur-3xl animate-pulse" />

        {/* Main Content */}
        <div className="relative z-10 px-4 md:px-8 py-8 md:py-12">

          {/* Top Section - Left Aligned with Badge */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 md:mb-6">
            {/* Floating Badge - Left */}
            <div className="mb-4 md:mb-0">
              <div className="inline-flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 md:px-6 md:py-3 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
                <Zap className="w-3 h-3 md:w-5 md:h-5 animate-pulse" />
                <span className="font-bold text-xs md:text-sm tracking-wider">LIMITED TIME</span>
                <Sparkles className="w-3 h-3 md:w-5 md:h-5 animate-pulse" />
              </div>
            </div>

            {/* Countdown Timer - Right on desktop, below on mobile */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-3 md:p-4 shadow-xl w-full md:w-auto">
              <p className="text-yellow-300 font-semibold mb-2 text-xs md:text-sm text-center">🎄 Sale Ends In:</p>
              <div className="flex gap-2 md:gap-3 justify-center">
                {[
                  heroData.countdown_days.toString().padStart(2, '0'),
                  heroData.countdown_hours.toString().padStart(2, '0'),
                  heroData.countdown_minutes.toString().padStart(2, '0'),
                  heroData.countdown_seconds.toString().padStart(2, '0')
                ].map((num, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white text-lg md:text-2xl font-black w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center shadow-lg">
                      {num}
                    </div>
                    <span className="text-white/70 text-[9px] md:text-xs mt-1 font-semibold">
                      {['DAY', 'HRS', 'MIN', 'SEC'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Headline - Centered */}
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

          {/* Subheadline - Centered */}
          <div className="text-center mb-4 md:mb-6">
            <p className="text-lg md:text-2xl text-yellow-200 font-semibold tracking-wide">
              {heroData.description} <span className="text-3xl md:text-4xl font-black text-yellow-400 inline-block animate-pulse">{heroData.discount_text}</span>
            </p>
          </div>

          {/* Feature Pills - Centered */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4 md:mb-6">
            {heroData.features.map((item, i) => {
              const IconComponent = getIconComponent(item.icon);
              return (
                <div
                  key={i}
                  className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer text-xs md:text-sm"
                >
                  <IconComponent className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="font-semibold">{item.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons - Centered */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button
              onClick={() => scrollToSection('products')}
              className="group relative px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-base md:text-lg font-bold rounded-full shadow-xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 group-hover:animate-bounce" />
                {heroData.cta_primary}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button
              onClick={() => scrollToSection('products')}
              className="px-8 md:px-10 py-3 md:py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-full hover:bg-white hover:text-red-900 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {heroData.cta_secondary}
            </button>
          </div>

          {/* Floating Icons - Hidden on mobile */}
          <div className="hidden md:block absolute top-8 left-8 animate-float">
            <Gift className="w-10 h-10 lg:w-12 lg:h-12 text-red-400 opacity-70" />
          </div>
          <div className="hidden md:block absolute top-12 right-12 animate-float" style={{ animationDelay: '1s' }}>
            <Star className="w-8 h-8 lg:w-10 lg:h-10 text-yellow-400 opacity-70" />
          </div>
          <div className="hidden md:block absolute bottom-12 left-12 animate-float" style={{ animationDelay: '2s' }}>
            <Sparkles className="w-10 h-10 lg:w-14 lg:h-14 text-green-400 opacity-70" />
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 md:h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
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