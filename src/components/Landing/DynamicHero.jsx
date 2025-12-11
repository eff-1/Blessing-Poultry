import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, ShoppingBag, Zap, Star, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export const DynamicHero = () => {
  const [heroData, setHeroData] = useState(null)
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveHero()
    initializeParticles()
  }, [])

  useEffect(() => {
    if (heroData) {
      setTimeLeft({
        days: heroData.countdown_days || 0,
        hours: heroData.countdown_hours || 0,
        minutes: heroData.countdown_minutes || 0,
        seconds: heroData.countdown_seconds || 0
      })
    }
  }, [heroData])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchActiveHero = async () => {
    try {
      const { data, error } = await supabase
        .from('heroes')
        .select('*')
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching hero:', error)
        // Fallback to default hero data
        setHeroData(getDefaultHero())
      } else {
        setHeroData(data)
      }
    } catch (error) {
      console.error('Error:', error)
      setHeroData(getDefaultHero())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultHero = () => ({
    name: 'Christmas Sale 2024',
    theme: 'christmas',
    title: 'CHRISTMAS',
    subtitle: 'MEGA SALE',
    description: 'Up to 70% OFF on Everything!',
    discount_text: '70% OFF',
    countdown_days: 23,
    countdown_hours: 45,
    countdown_minutes: 12,
    countdown_seconds: 38,
    cta_primary: 'Shop Now',
    cta_secondary: 'View Deals',
    background_image: '/images/hero/christmas-banner.jpg',
    features: [
      { icon: 'Gift', text: 'Free Gift Wrap' },
      { icon: 'Sparkles', text: 'Flash Deals' },
      { icon: 'Heart', text: 'Loved by 100K+' }
    ]
  })

  const initializeParticles = () => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }));
    setParticles(newParticles);
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const scrollToProducts = () => {
    const productsGrid = document.querySelector('.products-grid')
    if (productsGrid) {
      productsGrid.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      Gift,
      Sparkles,
      ShoppingBag,
      Zap,
      Star,
      Heart
    }
    return icons[iconName] || Gift
  }

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-red-900 via-green-900 to-red-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!heroData) {
    return null
  }

  return (
    <div 
      className="relative w-full h-screen bg-gradient-to-br from-red-900 via-green-900 to-red-950 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroData.background_image || '/images/hero/christmas-banner.jpg'} 
          alt="Hero background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-green-900/70 to-red-950/80"></div>
      </div>

      {/* Animated Background Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-2 h-2 bg-white rounded-full opacity-60 animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}

      {/* Gradient Orbs */}
      <div 
        className="absolute w-72 h-72 md:w-96 md:h-96 bg-gradient-radial from-red-500/30 to-transparent rounded-full blur-3xl transition-all duration-300"
        style={{
          left: `${mousePos.x - 10}%`,
          top: `${mousePos.y - 10}%`
        }}
      />
      <div className="absolute top-1/4 right-1/4 w-60 h-60 md:w-80 md:h-80 bg-gradient-radial from-green-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-52 h-52 md:w-72 md:h-72 bg-gradient-radial from-yellow-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center h-full text-center">
        
        {/* Floating Badge */}
        <div className="mb-4 sm:mb-6 animate-bounce">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse" />
            <span className="font-bold text-xs sm:text-sm tracking-wider">LIMITED TIME OFFER</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse" />
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-3 sm:mb-4 md:mb-6 leading-none">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 animate-gradient">
            {heroData.title}
          </span>
          <span className="block text-white drop-shadow-2xl mt-1 sm:mt-2">
            {heroData.subtitle}
          </span>
        </h1>

        {/* Subheadline with Animation */}
        <div className="mb-4 sm:mb-6 md:mb-8 overflow-hidden">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-yellow-200 font-semibold animate-slideUp tracking-wide">
            {heroData.description} <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-yellow-400 inline-block animate-pulse">{heroData.discount_text}</span>
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12">
          {(heroData.features || []).map((feature, i) => {
            const IconComponent = getIcon(feature.icon)
            return (
              <div 
                key={i}
                className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-full text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span className="font-semibold text-xs sm:text-sm md:text-base">{feature.text}</span>
              </div>
            )
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12 w-full max-w-md sm:max-w-none">
          <button 
            onClick={scrollToProducts}
            className="group relative px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold rounded-full shadow-2xl hover:shadow-red-500/50 transform hover:scale-110 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:animate-bounce" />
              {heroData.cta_primary}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button className="px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-white/10 backdrop-blur-md border-2 border-white text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold rounded-full hover:bg-white hover:text-red-900 transform hover:scale-110 transition-all duration-300 shadow-2xl">
            {heroData.cta_secondary}
          </button>
        </div>

        {/* Countdown Timer */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
          <p className="text-yellow-300 font-semibold mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">🎄 Sale Ends In:</p>
          <div className="flex gap-2 sm:gap-3 md:gap-4">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HRS', value: timeLeft.hours },
              { label: 'MIN', value: timeLeft.minutes },
              { label: 'SEC', value: timeLeft.seconds }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg md:rounded-xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                  {String(item.value).padStart(2, '0')}
                </div>
                <span className="text-white/70 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2 font-semibold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-16 sm:top-20 left-4 sm:left-10 animate-float">
        <Gift className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400 opacity-70" style={{ animationDelay: '0s' }} />
      </div>
      <div className="absolute top-32 sm:top-40 right-8 sm:right-20 animate-float">
        <Star className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-yellow-400 opacity-70" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-32 sm:bottom-40 left-8 sm:left-20 animate-float">
        <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-green-400 opacity-70" style={{ animationDelay: '2s' }} />
      </div>
      <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-10 animate-float">
        <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-pink-400 opacity-70" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Bottom Snow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 md:h-40 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
    </div>
  );
};