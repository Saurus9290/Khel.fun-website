'use client';

import React, { useRef, useLayoutEffect } from "react";
import type { FC } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useMouseParallax from "@/hooks/useMouseParallax";

gsap.registerPlugin(ScrollTrigger);
import BottomBar from "./BottomBar";
import CharacterSection from "./CharacterSection";
import HeroText from "./HeroText";
import CardSection from "./CardSection";
import Navbar from "@/components/Navbar";
import Features from "./FeaturesSection";
import PrizeKingdomsSection from "./PrizeKingdomsSection";
import About from "./About";
import Story from "./Story";
import Contact from "./Contact";
import Footer from "./Footer";
import ScrollIndicator from "./ScrollIndicator";
import StatsSection from "./StatsSection";


const LandingPage: FC = () => {
  const mainRef = useRef<HTMLDivElement>(null!);

  useMouseParallax(mainRef);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state setup - set BEFORE any animations
      gsap.set([".sky", ".bg"], {
        opacity: 0,
        scale: 1.3
      });

      gsap.set(".character", {
        opacity: 0,
        scale: 2.2,
        rotation: -20
      });

      gsap.set(".khel-text", {
        opacity: 0,
        x: -100,
        y: -50,
        rotation: -15
      });

      gsap.set(".fun-text", {
        opacity: 0,
        x: 100,
        y: 50,
        rotation: 15
      });

      // Create a dynamic entry sequence using .to() instead of .from()
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.to(".main", {
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: "expo.out",
      })
      .to(".sky", {
        opacity: 1,
        scale: 1.1,
        rotation: 0,
        duration: 1.2,
      }, "-=1.2")
      .to(".bg", {
        opacity: 1,
        scale: 1.1,
        rotation: 0,
        duration: 1.2,
      }, "-=1")
      .to(".character", {
        opacity: 1,
        scale: 1.0,
        rotation: 0,
        duration: 1.8,
        ease: "power3.out",
      }, "-=0.8")
      .to(".khel-text", {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1.4,
        ease: "back.out(1.7)",
      }, "-=1.2")
      .to(".fun-text", {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1.4,
        ease: "back.out(1.7)",
      }, "-=1.1");

      // Add parallax effect on scroll
      gsap.to([".sky", ".bg"], {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".landing",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      // Parallax text movement on scroll
      gsap.to(".khel-text", {
        y: 100,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: ".landing",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(".fun-text", {
        y: -100,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: ".landing",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Subtle floating animation for character - very smooth and small
      gsap.to(".character", {
        y: 12,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

      // Floating particles effect
      gsap.to(".animate-float", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 1.5,
          from: "random"
        }
      });

      // Section transition with proper ScrollTrigger
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
        onLeaveBack: () => {
          gsap.to(".prize-section", {
            opacity: 0,
            duration: 0.5
          });
        }
      });

      // Refresh ScrollTrigger after everything is set up
      ScrollTrigger.refresh();
    }, mainRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen w-screen overflow-x-hidden">
      <ScrollIndicator />
      <div className="landing overflow-hidden relative w-full h-screen bg-black">
        <Navbar />

        <div className="imagesdiv relative overflow-hidden w-full h-screen">
          <img
            className="absolute sky scale-[1.3] rotate-[-15deg] top-0 left-0 w-full h-full object-cover"
            src="./sky.png"
            alt="Sky background"
          />
          <img
            className="absolute scale-[1.8] rotate-[-3deg] bg top-0 left-0 w-full h-full object-cover"
            src="./bg.png"
            alt="Main background"
          />
          <HeroText />
          <img
            className="absolute character"
            style={{
              bottom: "-30%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "auto",
              height: "160vh",
              maxHeight: "1000px",
              objectFit: "contain"
            }}
            src="./girl.png"
            alt="Main character"
          />
        </div>
        <BottomBar />
      </div>
      {/* Smooth section transitions */}
      <div className="relative bg-black z-10">
        {/* Character Section with 3D Card */}
        <CharacterSection />

        {/* PLAY. WIN. EARN Cards */}
        <PrizeKingdomsSection />


        {/* Game Features */}
        <Features />

        {/* Stats Section */}
        <StatsSection />

        {/* Story Section */}
        <Story />

        {/* Contact Section */}
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
