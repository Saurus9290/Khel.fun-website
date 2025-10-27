import React from "react";

const CharacterSection = () => {
  return (
    <div className="character-to-prize-trigger relative min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black flex items-center justify-center">
      <div className="container mx-auto px-8">
        <div className="text-center">
          <h2 className="text-6xl md:text-8xl font-black font-zentry text-white mb-8">
            ENTER THE
            <span className="block text-yellow-400">GAME WORLD</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Experience the ultimate gaming adventure with stunning visuals and immersive gameplay
          </p>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`animate-float absolute w-2 h-2 bg-yellow-400/60 rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSection;