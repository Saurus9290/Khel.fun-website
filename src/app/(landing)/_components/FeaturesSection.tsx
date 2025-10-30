'use client';

import { useState, useRef, useLayoutEffect, ReactNode } from "react";
import { TiLocationArrow } from "react-icons/ti";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BentoTiltProps {
  children: ReactNode;
  className?: string;
}

const BentoTilt: React.FC<BentoTiltProps> = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState<string>("");
  const itemRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Detect mobile on mount and on resize
  useLayoutEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable tilt on mobile/touch devices
    if (isMobile || !itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();

    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;

    // Smoother, more subtle tilt with better easing
    const tiltX = (relativeY - 0.5) * 3; // Reduced from 5 to 3 for smoother effect
    const tiltY = (relativeX - 0.5) * -3;

    const newTransform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.99, 0.99, 0.99)`;
    setTransformStyle(newTransform);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setTransformStyle("");
      setIsHovering(false);
    }
  };

  return (
    <div
      ref={itemRef}
      className={`${className} ${isHovering ? 'smooth-hover' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isMobile ? 'none' : transformStyle,
        transition: isMobile ? 'none' : 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  src?: string;
  title: string;
  description?: string;
  players?: string;
  status?: "LIVE" | "WIP";
  link?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({
  src,
  title,
  description,
  players = "1-4",
  status = "LIVE",
  link
}) => {
  const isLive = status === "LIVE";
  const statusColor = isLive ? "border-green-400/50" : "border-yellow-400/50";
  const dotColor = isLive ? "bg-green-400" : "bg-yellow-400";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(m.matches);
    update();
    m.addEventListener?.('change', update);
    return () => m.removeEventListener?.('change', update);
  }, []);

  const handleClick = () => {
    if (isLive && link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  // Lazy load video when card is in viewport
  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVideoLoaded) {
            setIsVideoLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isVideoLoaded]);

  // Prevent video autoplay issues on mobile
  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay prevented - this is fine for mobile
      });
    }
  };

  return (
    <div ref={cardRef} className="group relative size-full smooth-hover overflow-hidden rounded-lg">
      {/* Outer glow ring */}
      <div className="absolute -inset-[2px] bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-60 -z-10" />

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
           style={{
             background: 'linear-gradient(45deg, #8b5cf6, #3b82f6, #8b5cf6)',
             backgroundSize: '200% 200%',
             animation: 'gradient-shift 3s ease infinite',
             filter: 'blur(20px)',
             transform: 'scale(1.05)'
           }} />

      {isVideoLoaded ? (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          autoPlay={!prefersReducedMotion}
          preload="metadata"
          onLoadedData={handleVideoLoad}
          className="absolute left-0 top-0 size-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105 group-hover:brightness-125"
        />
      ) : (
        <div className="absolute left-0 top-0 size-full bg-gradient-to-br from-violet-950/50 to-black flex items-center justify-center">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/80 opacity-50 transition-all duration-500 group-hover:opacity-20" />

      {/* Stronger glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/30 via-purple-400/20 to-blue-400/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-screen" />

      {/* Bottom mask to hide small watermarks */}
      <div className="absolute left-0 right-0 bottom-0 h-12 pointer-events-none bg-gradient-to-t from-black/100 to-transparent md:h-16" />

      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        {/* Top Status Badges */}
        <div className="flex items-start justify-between">
          <div className={`flex items-center gap-2 rounded-full border ${statusColor} bg-black/50 px-3 py-1 backdrop-blur-sm`}>
            <div className={`h-2 w-2 ${isLive ? 'animate-pulse' : ''} rounded-full ${dotColor}`} />
            <span className="font-mono text-xs">{status}</span>
          </div>

          <div className="rounded-full border border-violet-300/50 bg-black/50 px-3 py-1 backdrop-blur-sm">
            <span className="font-mono text-xs">{players} Players</span>
          </div>
        </div>

        {/* Bottom Title and Description */}
        <div>
          <h1 className="bento-title special-font drop-shadow-lg">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:text-base">
              {description}
            </p>
          )}

          {/* Enhanced Play Button with smooth animations */}
          <button
            onClick={handleClick}
            disabled={!isLive}
            className={`mt-4 rounded-full border-2 border-white bg-violet-300 px-6 py-2 font-bold uppercase opacity-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 ${
              isLive ? 'hover:bg-white hover:text-violet-300 cursor-pointer smooth-scale' : 'cursor-not-allowed opacity-70'
            }`}
          >
            <span className="relative inline-flex items-center gap-2">
              {isLive ? 'Play Now' : 'Coming Soon'}
              {isLive && <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Enhanced initial states with more dramatic positioning
      if (titleRef.current) {
        gsap.set(titleRef.current, {
          opacity: 0,
          y: 80,
          scale: 0.8,
          rotationX: 20
        });
      }

      if (mainCardRef.current) {
        gsap.set(mainCardRef.current, {
          opacity: 0,
          y: 150,
          scale: 0.7,
          rotationX: 25,
          rotationY: -10,
          z: -200
        });
      }

      gsap.set(".grid-card", {
        opacity: 0,
        y: 120,
        scale: 0.6,
        rotationX: 30,
        rotationY: 15,
        z: -300
      });

      // Enhanced entrance timeline with multiple triggers
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 15%",
          toggleActions: "play none none reverse",
        }
      });

      // Cinematic title sequence
      if (titleRef.current) {
        entranceTl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1.8,
          ease: "expo.out",
        });
      }

      // Hero card with dramatic 3D entrance
      if (mainCardRef.current) {
        entranceTl.to(mainCardRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          z: 0,
          duration: 2,
          ease: "expo.out",
        }, "-=0.8");
      }

      // Grid cards with sophisticated staggered entrance
      entranceTl.to(".grid-card", {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 1.6,
        ease: "expo.out",
        stagger: {
          amount: 1.2,
          from: "start",
          ease: "power3.out",
        }
      }, "-=1.4");

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-b from-black via-gray-900 to-black py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-400/5 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-3 md:px-10 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
            <span ref={titleRef} className="font-mono text-lg md:text-xl uppercase tracking-[0.4em] text-violet-400 px-6">
              Game Arsenal
            </span>
            <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
          </div>
        </div>

        {/* Main Featured Card */}
        <div ref={mainCardRef}>
          <BentoTilt className="border-hsla relative mb-12 h-96 w-full overflow-hidden rounded-md md:h-[65vh] zunno-glow-card">
            <BentoCard
              src="/videos/feature-1.mp4"
              title="Zunno"
              description="Experience the thrill of traditional Zunno game on blockchain"
              players="2-4"
              status="LIVE"
              link="https://zunno.xyz"
            />
          </BentoTilt>
        </div>

        {/* Enhanced Grid */}
        <div className="grid h-[135vh] grid-cols-2 grid-rows-3 gap-7">
          <BentoTilt className="grid-card bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
            <BentoCard
              src="/videos/poker.mp4"
              title="POKER"
              description="Classic Texas Hold'em with crypto stakes - Coming Soon"
              players="2-8"
              status="WIP"
            />
          </BentoTilt>

          <BentoTilt className="grid-card bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
            <BentoCard
              src="/videos/3-patti.mp4"
              title="3-PATTI"
              description="Indian card game favorite with blockchain rewards - Coming Soon"
              players="2-6"
              status="WIP"
            />
          </BentoTilt>

          <BentoTilt className="grid-card bento-tilt_1 me-14 md:col-span-1 md:me-0">
            <BentoCard
              src="/videos/ttt.mp4"
              title="TIC TAC TOE"
              description="Quick matches, instant payouts - Coming Soon"
              players="2"
              status="WIP"
            />
          </BentoTilt>

          <BentoTilt className="grid-card bento-tilt_2 group overflow-hidden rounded-lg">
            <div className="flex size-full flex-col justify-between bg-gradient-to-br from-violet-600 via-purple-700 to-black p-5 relative overflow-hidden">
              {/* Outer glow ring */}
              <div className="absolute -inset-[2px] bg-gradient-to-br from-yellow-500 via-violet-500 to-purple-500 opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-70 -z-10 group-hover:scale-110" />

              {/* Animated background grid */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.4) 2px, transparent 2px),
                                   linear-gradient(90deg, rgba(139, 92, 246, 0.4) 2px, transparent 2px)`,
                  backgroundSize: '30px 30px',
                  animation: 'grid-move 20s linear infinite'
                }} />
              </div>

              {/* Glowing orbs with stronger effect */}
              <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-yellow-400/40 rounded-full blur-[80px] animate-pulse-slow group-hover:bg-yellow-400/60 transition-all duration-700" />
              <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-violet-400/50 rounded-full blur-[70px] animate-pulse-slow group-hover:bg-violet-400/70 transition-all duration-700" style={{ animationDelay: '1s' }} />

              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                     style={{ animation: 'shine 2s ease-in-out infinite' }} />
              </div>

              {/* Pulsing border effect */}
              <div className="absolute inset-0 rounded-lg border-2 border-yellow-400/0 group-hover:border-yellow-400/50 transition-all duration-500"
                   style={{ animation: 'pulse-border 2s ease-in-out infinite' }} />

              <div className="relative z-10">
                <h1 className="bento-title special-font max-w-64 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_40px_rgba(250,204,21,0.8)] group-hover:text-yellow-100">
                  M<b>o</b>re co<b>m</b>ing s<b>o</b>on!
                </h1>
                <p className="text-white/60 text-sm mt-2 font-mono transition-all duration-500 group-hover:text-yellow-200/80 group-hover:translate-x-1">Stay tuned for epic releases</p>
              </div>

              <TiLocationArrow className="m-5 scale-[5] self-end text-white/80 relative z-10 drop-shadow-lg transition-all duration-700 group-hover:scale-[6] group-hover:rotate-[360deg] group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
            </div>
          </BentoTilt>

          <BentoTilt className="grid-card bento-tilt_2">
            <video
              src="/videos/portal.mp4"
              loop
              muted
              autoPlay
              playsInline
              className="size-full object-cover object-center"
            />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

export default Features;
