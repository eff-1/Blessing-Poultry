import { useState, useEffect } from 'react';
import { Sparkles, Gift, Tag, ArrowRight, ShoppingBag } from 'lucide-react';

export const ChristmasHero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [snowflakes, setSnowflakes] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 16,
    hours: 12,
    minutes: 34,
    seconds: 45
  });

  useEffect(() => {
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 3 + Math.random() * 7,
      animationDelay: Math.random() * 5,
      size: 2 + Math.random() * 4
    }));
    setSnowflakes(flakes);

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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 15,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 15
    });
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="christmas-hero-wrapper" onMouseMove={handleMouseMove}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero/christmas-banner.jpg" 
          alt="Christmas feast background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-green-900/70 to-red-950/80"></div>
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 christmas-grid" />
      </div>

      {/* Snowflakes */}
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute text-white opacity-70 animate-fall pointer-events-none"
          style={{
            left: `${flake.left}%`,
            top: '-10px',
            fontSize: `${flake.size}px`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`
          }}
        >
          ❄
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20 flex items-center min-h-screen">
        <div className="w-full max-w-7xl mx-auto">
          {/* Sale Badge */}
          <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 animate-bounce-slow">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-yellow-400 to-red-500 text-white px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-2xl flex items-center gap-2 transform hover:scale-110 transition-transform">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span className="whitespace-nowrap">CHRISTMAS SALE - UP TO 40% OFF!</span>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-spin-slow" />
              </div>
            </div>
          </div>

          {/* Main Title */}
          <div 
            className="text-center mb-4 sm:mb-6 md:mb-8"
            style={{
              transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-black text-white mb-2 sm:mb-3 md:mb-4 leading-tight">
              <span className="inline-block animate-shimmer bg-gradient-to-r from-white via-red-200 to-green-200 bg-clip-text text-transparent bg-300">
                Festive Feast
              </span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold text-red-100 mb-3 sm:mb-4 md:mb-6">
              Premium Poultry for Your
              <span className="text-yellow-300 block mt-2 animate-pulse-glow">Christmas Table</span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Fresh, healthy, and naturally raised poultry products. 
            <span className="text-yellow-300 font-bold"> Premium quality</span> delivered 
            <span className="text-green-300 font-bold"> straight to your door</span> this holiday season! 🎄
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 px-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-white/20 shadow-2xl w-full max-w-lg">
              <p className="text-yellow-300 font-bold text-center mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
                🎅 SALE ENDS IN:
              </p>
              <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center">
                {[
                  { label: 'DAYS', value: timeLeft.days },
                  { label: 'HRS', value: timeLeft.hours },
                  { label: 'MIN', value: timeLeft.minutes },
                  { label: 'SEC', value: timeLeft.seconds }
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="bg-gradient-to-br from-red-600 to-green-700 rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 min-w-[50px] sm:min-w-[60px] md:min-w-[80px] shadow-xl transform hover:scale-110 transition-transform">
                      <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white">
                        {String(item.value).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="text-white/80 text-[10px] sm:text-xs md:text-sm font-semibold mt-1 md:mt-2">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center mb-8 sm:mb-10 md:mb-12 px-4">
            <button 
              onClick={scrollToProducts}
              className="w-full sm:w-auto group relative bg-gradient-to-r from-green-600 to-green-700 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-bold text-base sm:text-lg md:text-xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all hover:shadow-green-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span>Shop Christmas Deals</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
            <button className="w-full sm:w-auto group relative bg-white/10 backdrop-blur-md text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-bold text-base sm:text-lg md:text-xl border-2 border-white/30 shadow-xl hover:bg-white/20 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span>Gift Packages</span>
              </div>
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-4">
            {[
              { icon: '🎁', title: 'Free Gift Wrapping', desc: 'Beautiful festive packaging' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Order today, delivered tomorrow' },
              { icon: '⭐', title: 'Premium Quality', desc: 'Farm-fresh guarantee' }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 md:p-6 border border-white/20 text-center transform hover:scale-105 hover:bg-white/20 transition-all shadow-xl"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 md:mb-3">{feature.icon}</div>
                <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-white/80 text-xs sm:text-sm md:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-white/70 rounded-full animate-scroll"></div>
        </div>
      </div>
    </div>
  );
};
