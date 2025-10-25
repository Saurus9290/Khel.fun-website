import { useEffect } from "react";
import gsap from "gsap";

export default function useMouseParallax(ref) {
  useEffect(() => {
  // We'll wait until the ref's DOM node exists (it may mount after this hook runs).
  let rafPoll = null;
    let attached = false;
    let container = null;

    // respect user preference for reduced motion
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // closure variables for listeners so cleanup can access them
    let rafId = null;
    let lastPos = { x: 0, y: 0 };

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const updateParallax = (clientX, clientY) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const relX = clientX - rect.left; // position relative to container
      const relY = clientY - rect.top;

      // normalized -0.5 .. 0.5
      const nx = clamp(relX / rect.width - 0.5, -1, 1);
      const ny = clamp(relY / rect.height - 0.5, -1, 1);

  // multipliers for depth layers (px)
  const textX = nx * 18; // subtle for text
  const textY = ny * 10;
  const skyX = nx * 28; // background moves subtly
  const skyY = ny * 14;
  const bgX = nx * 48; // midground moves more
  const bgY = ny * 24;

  // small 3D tilt on main container for parallax feeling
  const rotateY = nx * 3; // degrees
  const rotateX = -ny * 2;

  // smooth zoom: slightly scale the background images based on cursor distance from center
  const bgScale = 1 + Math.min(0.08, Math.abs(nx) * 0.06 + Math.abs(ny) * 0.02); // up to ~1.08
  const skyScale = 1 + Math.min(0.04, Math.abs(nx) * 0.03 + Math.abs(ny) * 0.01);

  // compute transform-origin so the zoom pans toward cursor (percentage)
  const originX = 50 + nx * 20; // bias origin up to +-20%
  const originY = 50 + ny * 10;

  // animate using translate3d and scale for a cinematic zoom + pan
  gsap.to(".main .text", { x: `${textX}px`, y: `${textY}px`, duration: 0.9, overwrite: true, ease: "power3.out" });
  gsap.to(".sky", { x: `${skyX}px`, y: `${skyY}px`, scale: skyScale, transformOrigin: `${originX}% ${originY}%`, duration: 0.9, overwrite: true, ease: "power3.out" });
  gsap.to(".bg", { x: `${bgX}px`, y: `${bgY}px`, scale: bgScale, transformOrigin: `${originX}% ${originY}%`, duration: 0.9, overwrite: true, ease: "power3.out" });
  gsap.to(".main", { rotationY: rotateY, rotationX: rotateX, transformPerspective: 900, transformOrigin: "50% 50%", duration: 0.9, overwrite: true, ease: "power3.out" });
    };

    const onPointerMove = (e) => {
      if (reduceMotion) return;
      // support touch and pointer events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      lastPos.x = clientX;
      lastPos.y = clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateParallax(lastPos.x, lastPos.y);
        rafId = null;
      });
    };

    const attach = () => {
      container = ref.current;
      if (!container) {
        rafPoll = requestAnimationFrame(attach);
        return;
      }

      // respect user preference for reduced motion
      const reduceMotionNow = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotionNow) return;

      // Attach listeners
      container.addEventListener("pointermove", onPointerMove, { passive: true });
      container.addEventListener("mousemove", onPointerMove, { passive: true });
      // touch support
      container.addEventListener("touchmove", onPointerMove, { passive: true });

      // Reset on leave / touchend
      const onLeave = () => {
        gsap.to([".main .text", ".sky", ".bg"], { x: 0, y: 0, duration: 0.6, overwrite: true, ease: "power3.out" });
        gsap.to(".main", { rotationY: 0, rotationX: 0, duration: 0.6, overwrite: true, ease: "power3.out" });
        // kill any lingering tweens to avoid buildup
        gsap.killTweensOf([".main .text", ".sky", ".bg", ".main"]);
      };
      container.addEventListener("pointerleave", onLeave);
      container.addEventListener("mouseleave", onLeave);
      container.addEventListener("touchend", onLeave);

      attached = true;
    };

    // start trying to attach
    attach();

    return () => {
      if (rafPoll) cancelAnimationFrame(rafPoll);
      if (attached && container) {
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("mousemove", onPointerMove);
        container.removeEventListener("touchmove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerMove);
        container.removeEventListener("mouseleave", onPointerMove);
        container.removeEventListener("touchend", onPointerMove);
      }
      // reset transforms
      gsap.set([".main .text", ".sky", ".bg", ".main"], { x: 0, y: 0, rotationX: 0, rotationY: 0 });
      gsap.killTweensOf([".main .text", ".sky", ".bg", ".main"]);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ref]);
}