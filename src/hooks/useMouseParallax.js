import { useEffect } from "react";
import gsap from "gsap";

export default function useMouseParallax(ref) {
  useEffect(() => {
    if (!ref || !ref.current) return;

    const container = ref.current;

    // respect user preference for reduced motion
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

  let rafId = null;
  let lastX = 0;

  const updateParallax = (clientX) => {
      const rect = container.getBoundingClientRect();
  const relX = clientX - rect.left; // position relative to container

  const nx = (relX / rect.width - 0.5); // -0.5 .. 0.5

      // multipliers for depth layers
      const textX = nx * 6; // subtle for text
      const skyX = nx * 12; // background moves subtly
      const bgX = nx * 20; // midground moves more

  // Use gsap.to with overwrite to keep motion smooth
  gsap.to(".main .text", { x: `${textX}%`, duration: 0.9, overwrite: true });
  gsap.to(".sky", { x: `${skyX}px`, duration: 0.9, overwrite: true });
  gsap.to(".bg", { x: `${bgX}px`, duration: 0.9, overwrite: true });
    };

    const onPointerMove = (e) => {
      lastX = e.clientX;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateParallax(lastX);
        rafId = null;
      });
    };

    // Fallback to mousemove for older browsers
    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("mousemove", onPointerMove, { passive: true });

    // Reset on leave
    const onLeave = () => {
      gsap.to([".main .text", ".sky", ".bg"], { x: 0, duration: 0.8, overwrite: true });
    };
    container.addEventListener("pointerleave", onLeave);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("pointerleave", onLeave);
      container.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ref]);
}