import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import useMouseParallax from "../hooks/useMouseParallax";
import HeroText from "./HeroText";
import BottomBar from "./BottomBar";
import CharacterSection from "./CharacterSection";
import PrizeKingdomsSection from "./PrizeKingdomsSection";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [showContent, setShowContent] = useState(false);
  const mainRef = useRef(null);

  // Use the mouse parallax hook
  useMouseParallax(mainRef);

  // Intro animation based on your reference code
  useGSAP(() => {
    const tl = gsap.timeline();

    // Step 1: Rotate the mask group element
    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "Power4.easeInOut",
      transformOrigin: "50% 50%",
    })
    // Step 2: Scale up and fade out
    .to(".vi-mask-group", {
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onComplete: function () {
        setShowContent(true);
      },
    });
  }, []);

  // Enhanced main content animation
  useGSAP(() => {
    if (!showContent) return;

    gsap.registerPlugin(ScrollTrigger);

    // Initial state setup: start cinematic (zoomed + tilted) but only via GSAP
    // We avoid static rotate/scale classes in the DOM and animate from these
    gsap.set([".sky", ".bg", ".character", ".text"], {
      opacity: 0,
    });

    // Start the whole main container zoomed and slightly rotated (cinematic start)
    gsap.set(".main", {
      scale: 1.5,
      rotate: -8,
      transformOrigin: "50% 50%",
    });

    // Give sky/bg/character/text initial zoom/rotation values (will animate to identity)
    gsap.set(".sky", { scale: 1.3, rotate: -15, transformOrigin: "50% 50%" });
    gsap.set(".bg", { scale: 1.8, rotate: -3, transformOrigin: "50% 50%" });
    gsap.set(".character", {
      bottom: "-100%",
      left: "50%",
      x: "-50%",
      rotate: -20,
      scale: 1.3,
      transformOrigin: "50% 50%",
    });
    gsap.set(".text", { scale: 1.1, rotate: -10, transformOrigin: "50% 50%" });

    // Set up section transition
    ScrollTrigger.create({
      trigger: ".character-to-prize-trigger",
      start: "top top",
      end: "bottom center",
      onEnter: () => {
        gsap.to(".prize-section", {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut"
        });
      },
      onLeave: () => {
        gsap.to(".prize-section", {
          opacity: 1,
          duration: 0.5
        });
      },
      onEnterBack: () => {
        gsap.to(".prize-section", {
          opacity: 1,
          duration: 0.5
        });
      },
      onLeaveBack: () => {
        gsap.to(".prize-section", {
          opacity: 0,
          duration: 0.5
        });
      }
    });

    // Add floating particles effect during transition
    gsap.to(".animate-float", {
      y: -30,
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 2,
        from: "random"
      }
    });

    // Create a dynamic entry sequence
    const tl = gsap.timeline();

    // Animate from cinematic start into the final upright panorama
    tl.to(".main", {
      scale: 1,
      rotate: 0,
      duration: 1.5,
      ease: "expo.out",
    })
    .to(
      ".sky",
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1.2,
        ease: "power2.inOut",
      },
      "-=1.2"
    )
    .to(
      ".bg",
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1.2,
        ease: "power2.inOut",
      },
      "-=1"
    )
    .to(
      ".character",
      {
        opacity: 1,
        scale: 0.9, // final slightly smaller so the character isn't overwhelming
        x: "-50%",
        bottom: "-15%", // raise a bit to avoid cut-off and reduce top black gap
        rotate: 0,
        duration: 1.5,
        ease: "back.out(1.2)",
      },
      "-=0.8"
    )
    .to(
      ".text",
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1,
        ease: "back.out(1.4)",
      },
      "-=1"
    );

    // Add parallax effect on scroll
    gsap.to([".sky", ".bg"], {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".landing",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Add floating animation to character
    gsap.to(".character", {
      y: "20px",
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    // Panorama: gentle horizontal parallax pan for layered depth
    gsap.to(".sky", {
      xPercent: -8,
      duration: 20,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2.5,
    });

    gsap.to(".bg", {
      xPercent: -4,
      duration: 28,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2.5,
    });

    // Very slight main container motion to keep panorama feeling alive
    gsap.to(".main", {
      xPercent: -2,
      duration: 24,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2.5,
    });

  }, [showContent]);

  return (
    <div className="relative h-dvh w-screen overflow-hidden">
      {/* Intro Mask */}
      {!showContent && (
        <div className="vi-mask-group fixed inset-0 z-[200] flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-8">
            {/* Logo or Brand */}
            <div className="text-6xl font-black text-white" style={{ fontFamily: '"knight-warrior", "zentry", "General Sans", sans-serif' }}>
              KHEL<span className="text-yellow-400">.FUN</span>
            </div>
            
            {/* Spinner */}
            <div className="three-body">
              <div className="three-body__dot" />
              <div className="three-body__dot" />
              <div className="three-body__dot" />
            </div>
          </div>
        </div>
      )}



      {/* Main Content */}
      {showContent && (
        <>
          <div 
            className="main w-full" 
            ref={mainRef}
          >
            <div className="landing overflow-hidden relative w-full h-screen bg-black">
              
              {/* Images Container */}
              <div className="imagesdiv relative overflow-hidden w-full h-screen">
                {/* Sky Background */}
                <img
                  className="absolute sky top-0 left-0 w-full h-full object-cover"
                  src="/bg.png"
                  alt="Sky background"
                />
                
                {/* Main Background */}
                <img
                  className="absolute bg top-0 left-0 w-full h-full object-cover"
                  src="/bg.png"
                  alt="Main background"
                />

                {/* Hero Text */}
                <HeroText />

                {/* Character */}
                <img
                  className="absolute character -bottom-[100%] left-1/2 -translate-x-1/2"
                  src="/girl.png"
                  alt="Main character"
                />
              </div>

              <BottomBar />
            </div>
          </div>

          {/* Additional Sections */}
          <div className="relative">
            <CharacterSection />
            <PrizeKingdomsSection />
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;