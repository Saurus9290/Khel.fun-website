import React from "react";

const PrizeKingdomsSection = () => {
  return (
    <div className="prize-section relative min-h-screen bg-gradient-to-b from-purple-900/20 to-black opacity-0">
      <div className="container mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-black font-zentry text-white mb-8">
            PRIZE
            <span className="block text-yellow-400">KINGDOMS</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover amazing rewards and unlock exclusive content in our gaming universe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Daily Rewards", desc: "Collect amazing prizes every day" },
            { title: "Tournament Wins", desc: "Compete and earn exclusive rewards" },
            { title: "Achievement Unlocks", desc: "Complete challenges for special items" }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-white/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrizeKingdomsSection;