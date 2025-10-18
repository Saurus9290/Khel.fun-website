import { useState } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 40% 10%",
    });

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-gradient-to-b from-black via-violet-900 to-black">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full animate-grid-move bg-[linear-gradient(to_right,#5724FF_1px,transparent_1px),linear-gradient(to_bottom,#5724FF_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          </div>
          
          <div className="flex flex-col items-center gap-8">
            {/* Spinner */}
            <div className="three-body">
              <div className="three-body__dot" />
              <div className="three-body__dot" />
              <div className="three-body__dot" />
            </div>
            
            {/* Loading Text */}
            <div className="flex flex-col items-center gap-2">
              <p className="animate-pulse font-zentry text-2xl font-bold text-violet-300">
                LOADING GAME
              </p>
            </div>
          </div>
        </div>
      )}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        {/* Single video - with styled frame and zoom to fill */}
        <video
          src="/videos/hero-1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 size-full object-cover object-center"
          onLoadedData={handleVideoLoad}
          style={{ 
            transform: 'scale(1.3)',
            transformOrigin: 'center center'
          }}
        />
        
        {/* Gaming Corner Accents */}
        <div className="hero-corner-accents pointer-events-none">
          {/* Top Left Corner */}
          <div className="absolute left-5 top-5 z-50 flex items-center gap-3">
            <div className="h-[2px] w-12 animate-pulse-slow bg-violet-300" />
            <div className="h-2 w-2 rotate-45 border-2 border-violet-300" />
          </div>
          
          {/* Top Right Corner */}
          <div className="absolute right-5 top-5 z-50 flex items-center gap-3">
            <div className="h-2 w-2 rotate-45 border-2 border-violet-300" />
            <div className="h-[2px] w-12 animate-pulse-slow bg-violet-300" />
          </div>
          
          {/* Bottom Left Corner */}
          <div className="absolute bottom-20 left-5 z-50 flex flex-col gap-3">
            <div className="h-12 w-[2px] animate-pulse-slow bg-violet-300" />
            <div className="h-2 w-2 rotate-45 border-2 border-violet-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
