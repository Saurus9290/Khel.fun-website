import React, { useState, useEffect } from "react";

const BottomBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide the scroll indicator when user starts scrolling
      if (window.scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNextSection = () => {
    // Scroll to the About section (next section after Hero)
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: scroll by viewport height
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToNextSection}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 scroll-indicator-modern group cursor-pointer transition-all duration-500 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-4 focus:ring-offset-transparent rounded-2xl"
      aria-label="Scroll to next section"
    >
      <div className="flex flex-col items-center gap-2 px-4 py-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 group-hover:bg-black/30 group-hover:border-white/20 transition-all duration-300">
        {/* Compact SCROLL Text */}
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/80 font-circular-web group-hover:text-white transition-colors duration-300">
          SCROLL
        </span>
        
        {/* Modern Mouse Icon */}
        <div className="relative">
          <div className="w-4 h-7 border border-white/50 rounded-full relative group-hover:border-white/70 transition-colors duration-300">
            {/* Animated scroll dot */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white/70 rounded-full animate-bounce group-hover:bg-white transition-colors duration-300"></div>
          </div>
        </div>
        
        {/* Minimal chevron */}
        <svg 
          className="w-3 h-3 text-white/60 group-hover:text-white/80 transition-all duration-300 group-hover:translate-y-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </div>
    </button>
  );
};

export default BottomBar;