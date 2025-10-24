import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const cubesContainerRef = useRef(null);

  useGSAP(() => {
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
        
        // Stagger video playback for visual effect
        setTimeout(() => {
          video.play().catch(() => {
            // Fallback to gradient if video fails
            cube.style.background = `linear-gradient(135deg, hsl(${cubeIndex * 25}, 70%, 60%), hsl(${cubeIndex * 25 + 60}, 70%, 70%))`;
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
        
        cubesContainerRef.current.appendChild(cube);
        cubes.push(cube);
      }
    }

    // Check if mobile
    const isMobile = window.innerWidth < 768;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: isMobile ? "top center" : "center center",
        end: isMobile ? "+=800 center" : "+=1200 center",
        scrub: isMobile ? 0.5 : 1,
        pin: true,
        pinSpacing: true,
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

      tl.to(cube, {
        x: xMove,
        y: yMove,
        z: zMove,
        rotationX: isEven ? 180 : 0,
        rotationY: rotation,
        rotationZ: isEven ? 90 : -90,
        scale: scale,
        ease: "power2.inOut",
        opacity: 0.95,
        boxShadow: isEven 
          ? "0 0 30px rgba(87, 36, 255, 0.8), 0 0 60px rgba(87, 36, 255, 0.4)"
          : "0 0 30px rgba(79, 183, 221, 0.8), 0 0 60px rgba(79, 183, 221, 0.4)",
      }, 0); // Start all animations at the same time
    });

    // Expand container
    tl.to(".cube-grid-container", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    }, 0);

    // Fade out cubes at the end
    tl.to(".cube-piece", {
      opacity: 0,
      scale: 0.5,
      stagger: {
        amount: 0.3,
        from: "center",
        grid: [GRID_SIZE, GRID_SIZE],
      },
      ease: "power2.in",
    }, 0.7);

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
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
          <span className="font-mono text-xs uppercase tracking-widest text-violet-300">
            The Game
          </span>
          <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
        </div>
        
        <AnimatedTitle
          title="LIFE IS A KHEL"
          containerClass="mt-5 !text-black text-center"
        />
        
        <p className="max-w-2xl text-center font-circular-web text-lg text-black/70">
          Where blockchain meets arcade nostalgia. Prove your skills, earn rewards, dominate the leaderboard.
        </p>
      </div>

      <div className="h-dvh w-screen" id="clip">
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