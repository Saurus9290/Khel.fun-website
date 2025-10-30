'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Add particle animation
const style = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-30px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }
`;

const gameCards = [
  {
    title: "PLAY",
    description: "Engage in thrilling experiences and discover endless fun. Dive into a world designed for ultimate enjoyment.",
    image: "/kingdoms/1.png",
    icon: "🎮"
  },
  {
    title: "WIN",
    description: "Compete for exclusive rewards, climb global leaderboards, and achieve victory in challenging environments.",
    image: "/kingdoms/2.png",
    icon: "🏆"
  },
  {
    title: "EARN",
    description: "Convert your achievements and in-game success into real-world value and future profits effortlessly.",
    image: "/kingdoms/4.png",
    icon: "💰"
  }
];

const PrizeKingdomsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Simple entrance animations
      gsap.fromTo(titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );

      // Setup floating animations for cards with proper event listener cleanup
      const cards = gsap.utils.toArray<HTMLElement>('.kingdom-card');
      const handlers: Array<{
        card: HTMLElement;
        enterHandler: () => void;
        leaveHandler: () => void;
      }> = [];

      cards.forEach((card, index) => {
        // Initial fade in
        gsap.fromTo(card,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: "power3.out"
          }
        );

        // Continuous floating animation
        gsap.to(card, {
          y: gsap.utils.random(-15, 15),
          rotateZ: gsap.utils.random(-2, 2),
          duration: gsap.utils.random(2, 3),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.3
        });

        // Hover animation with proper cleanup
        const enterHandler = () => {
          gsap.to(card, {
            scale: 1.05,
            y: -10,
            duration: 0.3,
            ease: "power2.out"
          });
        };

        const leaveHandler = () => {
          gsap.to(card, {
            scale: 1,
            y: gsap.utils.random(-15, 15),
            duration: 0.5,
            ease: "power2.inOut"
          });
        };

        card.addEventListener("mouseenter", enterHandler);
        card.addEventListener("mouseleave", leaveHandler);

        handlers.push({ card, enterHandler, leaveHandler });
      });

      // Return cleanup function
      return () => {
        handlers.forEach(({ card, enterHandler, leaveHandler }) => {
          card.removeEventListener("mouseenter", enterHandler);
          card.removeEventListener("mouseleave", leaveHandler);
        });
      };
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={sectionRef} className="prize-section h-screen bg-black overflow-hidden relative opacity-0">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/20 via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.05)_0%,rgba(0,0,0,1)_100%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-20 flex flex-col min-h-screen justify-center">
        {/* Main Title */}
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold text-center mb-24 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600 uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-knight-warrior), sans-serif' }}
        >
          PLAY. WIN. EARN.
        </h1>

        {/* Cards Grid */}
        <div ref={cardsRef} className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {gameCards.map((card, index) => (
              <div
                key={index}
                className="kingdom-card group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-900/40 to-black/80 border border-yellow-500/30 p-1"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Glowing border effect */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500"></div>

                {/* Main content container */}
                <div className="relative bg-gradient-to-br from-black/90 to-yellow-950/30 rounded-xl p-8 h-full transform-gpu transition-transform duration-500 group-hover:translate-y-[-8px]">
                  {/* Background image */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover object-center rounded-xl"
                    />
                  </div>

                  {/* Content overlay */}
                  <div className="relative z-10 flex flex-col h-full min-h-[400px]">
                    {/* Icon */}
                    <div className="mb-6 flex items-center justify-center">
                      <div className="text-7xl transform-gpu transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                        {card.icon}
                      </div>
                    </div>

                    {/* Header */}
                    <h3
                      className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-6 text-center transform-gpu transition-all duration-500 group-hover:scale-110 group-hover:from-yellow-200 group-hover:to-yellow-400"
                      style={{ fontFamily: 'var(--font-knight-warrior), sans-serif' }}
                    >
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-yellow-100/70 text-lg text-center flex-grow transform-gpu transition-all duration-500 group-hover:text-yellow-100">
                      {card.description}
                    </p>

                    {/* Hover indicator */}
                    <div className="mt-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full"></div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent transform-gpu scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent transform-gpu scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeKingdomsSection;