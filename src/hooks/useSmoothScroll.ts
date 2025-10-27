import { useEffect } from 'react';

const useSmoothScroll = (): void => {
  useEffect(() => {
    // Enhanced smooth scrolling for the entire page
    const smoothScrollTo = (target: Element | string | null, duration = 1000) => {
      const targetElement = typeof target === 'string' ? document.querySelector(target) : target as Element | null;
      if (!targetElement) return;

      const targetPosition = (targetElement as HTMLElement).offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime: number | null = null;

      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    };

    // Handle all anchor links with smooth scrolling
    const handleAnchorClick = (e: Event) => {
      const el = e.currentTarget as HTMLAnchorElement;
      const href = el.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          smoothScrollTo(targetElement, 800);
        }
      }
    };

    // Add smooth scroll to all anchor links
    const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]')) as HTMLAnchorElement[];
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });

    // Optimize scroll performance
    let ticking = false;
    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Add any scroll-based optimizations here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizeScroll, { passive: true });

    // Cleanup
    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick);
      });
      window.removeEventListener('scroll', optimizeScroll);
    };
  }, []);

  return;
};

export default useSmoothScroll;
