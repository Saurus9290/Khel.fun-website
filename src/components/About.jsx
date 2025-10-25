import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const cubesContainerRef = useRef(null);
  const titleRef = useRef(null);

  useGSAP(() => {
    // Animate "THE GAME" title entrance
    gsap.set(titleRef.current, {
      opacity: 0,
      y: 80,
      scale: 0.8,
      rotationX: 20
    });

    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1.8,
      ease: "expo.out",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      }
    });

    const GRID_SIZE = 4; // 4x4 grid = 16 cubes
    const cubes = [];

    // Video sources for the cubes
    const videoSources = [
      '/videos/hero-1.mp4',
      '/videos/hero-2.mp4',
      '/videos/hero-3.mp4',
      '/videos/hero-4.mp4',
      '/videos/feature-1.mp4',
      '/videos/feature-2.mp4',
      '/videos/feature-3.mp4',
      '/videos/feature-4.mp4',
      '/videos/feature-5.mp4',
      '/videos/hero-1.mp4', // Repeat for 16 cubes
      '/videos/hero-2.mp4',
      '/videos/hero-3.mp4',
      '/videos/hero-4.mp4',
      '/videos/feature-1.mp4',
      '/videos/feature-2.mp4',
      '/videos/feature-3.mp4',
    ];

    // Create cube grid with videos
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const cubeIndex = row * GRID_SIZE + col;
        const cube = document.createElement('div');
        cube.className = 'cube-piece';

        // Create video element
        const video = document.createElement('video');
        video.src = videoSources[cubeIndex];
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.borderRadius = '8px';
        video.style.display = 'block';
        video.style.transition = 'all 0.3s ease';

        // Set initial background for visibility
        cube.style.background = `linear-gradient(135deg, hsl(${cubeIndex * 25}, 70%, 60%), hsl(${cubeIndex * 25 + 60}, 70%, 70%))`;
        cube.style.opacity = '1';
        cube.style.visibility = 'visible';

        // Stagger video playback for visual effect
        setTimeout(() => {
          video.play().catch(() => {
            // Keep the gradient fallback
            console.log(`Video failed to load for cube ${cubeIndex}`);
          });
        }, cubeIndex * 100); // Stagger by 100ms per cube

        cube.appendChild(video);
        cube.style.gridColumn = col + 1;
        cube.style.gridRow = row + 1;
        cube.style.setProperty('--row', row);
        cube.style.setProperty('--col', col);
        cube.style.borderRadius = '8px';
        cube.style.overflow = 'hidden';
        cube.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        cube.style.transition = 'all 0.3s ease';
        cube.style.cursor = 'pointer';

        // Add hover effect
        cube.addEventListener('mouseenter', () => {
          cube.style.transform = 'scale(1.05)';
          cube.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
        });

        cube.addEventListener('mouseleave', () => {
          cube.style.transform = 'scale(1)';
          cube.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });

        // Add data attributes for animation
        cube.dataset.row = row;
        cube.dataset.col = col;

        if (cubesContainerRef.current) {
          cubesContainerRef.current.appendChild(cube);
          cubes.push(cube);
        }
      }
    }

    // Check if mobile
    const isMobile = window.innerWidth < 768;



    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: isMobile ? "top center" : "center center",
        end: isMobile ? "+=600 center" : "+=1200 center", // Reduced scroll distance
        scrub: isMobile ? 0.8 : 0.5,
        pin: true,
        pinSpacing: true, // Remove extra spacing to prevent layout shifts
        anticipatePin: 1,
      },
    });

    // Animate cubes splitting and moving
    cubes.forEach((cube) => {
      const row = parseInt(cube.dataset.row);
      const col = parseInt(cube.dataset.col);

      // Checkerboard pattern for alternating movement
      const isEven = (row + col) % 2 === 0;

      // Calculate distance from center for varied movement
      const centerRow = (GRID_SIZE - 1) / 2;
      const centerCol = (GRID_SIZE - 1) / 2;
      const distanceFromCenter = Math.sqrt(
        Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
      );

      // Calculate movement direction with more variation
      const angle = Math.atan2(row - centerRow, col - centerCol);
      const movementMultiplier = isEven ? 1 : -0.8;
      const xMove = Math.cos(angle) * distanceFromCenter * 40 * movementMultiplier;
      const yMove = Math.sin(angle) * distanceFromCenter * 40 * movementMultiplier;

      const rotation = isEven ? 360 : -360;
      const scale = 1 + (distanceFromCenter * 0.1);
      const zMove = isEven ? 100 : -100;

      // Stagger the initial explosion based on distance for more organic feel
      const explosionDelay = distanceFromCenter * 0.02;

      tl.to(cube, {
        x: xMove,
        y: yMove,
        z: zMove,
        rotationX: isEven ? 180 : 0,
        rotationY: rotation,
        rotationZ: isEven ? 90 : -90,
        scale: Math.min(scale, 1.4), // Slightly more dramatic scale
        ease: "expo.out", // More dramatic easing for wow factor
        opacity: 1,
        boxShadow: isEven
          ? "0 0 40px rgba(87, 36, 255, 1), 0 0 80px rgba(87, 36, 255, 0.6), 0 0 120px rgba(87, 36, 255, 0.3)"
          : "0 0 40px rgba(79, 183, 221, 1), 0 0 80px rgba(79, 183, 221, 0.6), 0 0 120px rgba(79, 183, 221, 0.3)",
      }, explosionDelay); // Staggered explosion start
    });

    // Expand container with smooth easing
    tl.to(".cube-grid-container", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      ease: "power2.inOut",
    }, 0.1); // Slight delay for better sequencing

    // Create a dramatic pause before the disappearance
    tl.to({}, { duration: 0.5 }, 0.6); // Pause for dramatic effect

    // Enhanced fade-out sequence with multiple phases
    cubes.forEach((cube) => {
      const row = parseInt(cube.dataset.row);
      const col = parseInt(cube.dataset.col);

      // Calculate distance from center for staggered fade-out
      const centerRow = (GRID_SIZE - 1) / 2;
      const centerCol = (GRID_SIZE - 1) / 2;
      const distanceFromCenter = Math.sqrt(
        Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
      );

      // More dramatic staggering with exponential delay
      const delay = Math.pow(distanceFromCenter, 1.5) * 0.04;

      // Phase 1: Dramatic scale and rotation before fade
      tl.to(cube, {
        scale: 0.2,
        rotationY: "+=180",
        rotationZ: "+=90",
        ease: "back.in(2)",
        duration: 0.4,
      }, 0.75 + delay);

      // Phase 2: Final disappearance with particle effect
      tl.to(cube, {
        opacity: 0,
        scale: 0,
        y: "-=50", // Float up as they disappear
        ease: "power3.in",
        duration: 0.9,
      }, 0.85 + delay);
    });

    // Enhanced background effects sequence
    // First intensify the glow as cubes disappear
    tl.to("#clip .bg-violet-300\\/20", {
      scale: 0.5,
      opacity: 0.4,
      ease: "power2.out",
    }, 0.8);

    tl.to("#clip .bg-blue-300\\/10", {
      scale: 1.8,
      opacity: 0.3,
      ease: "power2.out",
    }, 0.82);

    // Then fade everything out smoothly
    tl.to("#clip .absolute.inset-0", {
      opacity: 0,
      scale: 2,
      ease: "expo.in",
      duration: 0.9,
    }, 0.9);

    // Final container fade with elegant exit
    tl.to(".cube-grid-container", {
      opacity: 0,
      scale: 0.5,
      rotationZ: 5,
      ease: "expo.in",
      duration: 1.5,
    }, 0.95);

    // Set initial state for next section
    gsap.set("#features", {
      y: 100,
      opacity: 0.3
    });

    // Smooth transition: bring in the next section as cubes disappear
    tl.to("#features", {
      y: 0,
      opacity: 1,
      ease: "expo.out",
      duration: 1.2,
    }, 0.8); // Start bringing in the next section as cubes begin to fade

    // Create a separate ScrollTrigger for seamless section transition
    ScrollTrigger.create({
      trigger: "#clip",
      start: "bottom 60%",
      end: "bottom top",
      onEnter: () => {
        gsap.to("#features", {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        });
      },
      onLeave: () => {
        gsap.set("#features", { y: 0, opacity: 1 });
      }
    });

    return () => {
      cubes.forEach(cube => {
        const video = cube.querySelector('video');
        if (video) {
          video.pause();
          video.src = '';
        }
        cube.remove();
      });
    };
  });

  return (
    <div id="about" className="w-screen relative z-10">
      <div className="relative mb-8 mt-16 flex flex-col items-center gap-5">
        <div className="flex items-center gap-6">
          <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
          <span ref={titleRef} className="font-mono text-lg md:text-xl uppercase tracking-[0.4em] text-violet-300 px-6">
            The Game
          </span>
          <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
        </div>

        <AnimatedTitle
          title="LIFE IS A KHEL"
          containerClass="mt-5 !text-black text-center"
        />

        <p className="max-w-2xl text-center font-circular-web text-lg text-black/70">
          Where blockchain meets arcade nostalgia. Prove your skills, earn rewards, dominate the leaderboard.
        </p>
      </div>

      <div className="h-screen w-screen" id="clip">
        <div
          ref={cubesContainerRef}
          className="cube-grid-container about-image"
        />

        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-300/20 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>


    </div>
  );
};

export default About;