import React from "react";

const BottomBar = () => {
  return (
    <div className="absolute bottom-8 left-8 z-30">
      <div className="flex items-center gap-3 text-white/80">
        <span className="text-sm font-circular-web uppercase tracking-wider">
          Scroll Down
        </span>
        <div className="flex flex-col gap-1">
          <div className="w-px h-4 bg-white/40"></div>
          <div className="w-px h-2 bg-white/60 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;