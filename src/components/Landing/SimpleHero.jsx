// Simple Hero Component
// Add your simple hero code here

import React from 'react';
import { ChevronRight } from 'lucide-react';

const SimpleHero = () => {
  return (
    <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          // Generic poultry farm background
          backgroundImage: `url('https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed' // Optional: Creates a parallax effect
        }}
      />

      {/* Brand Color Overlay */}
      {/* Using the brand green #4E745A with opacity */}
      <div className="absolute inset-0 bg-[#4E745A]/70 mix-blend-multiply z-10" />
      <div className="absolute inset-0 bg-black/30 z-10" /> {/* Extra darkness for text pop */}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        
        {/* Small Tag */}
        <span className="inline-block py-1 px-3 rounded-full bg-yellow-400 text-[#4E745A] text-xs font-bold tracking-widest uppercase mb-4 shadow-lg">
          Trusted Since 2013
        </span>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg max-w-4xl mx-auto">
          Healthy Birds, <span className="text-yellow-300">Happy Families</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          We provide the highest quality poultry products, raised in a clean and ethical environment right here in Ota.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-3 bg-[#4ea752] hover:bg-[#439146] text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/50 flex items-center gap-2 transform hover:-translate-y-1">
            Shop Products
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-[#4E745A] text-white font-bold rounded-full transition-all duration-300 backdrop-blur-sm">
            Contact Us
          </button>
        </div>

      </div>

      {/* Bottom Curve (Optional - adds a nice transition to the next section) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] fill-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="opacity-20"></path>
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="opacity-40"></path>
        </svg>
      </div>
    </div>
  );
};

export default SimpleHero;