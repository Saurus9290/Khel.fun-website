import gsap from "gsap";
import { useEffect, useRef } from "react";

const AnimatedTitle = ({title, containerClass}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial state - subtle and professional
            gsap.set('.animated-word', {
                opacity: 0,
                y: 30,
                willChange: 'opacity, transform'
            });

            const titleAnimation = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Simple, elegant animation
            titleAnimation.to('.animated-word', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.1
            });
        }, containerRef)

        return () => ctx.revert();
    }, []);

  return (
    <div ref={containerRef} className={`animated-title ${containerClass}`}>
      {title.split('<br />').map((line, index) => (
        <div key={index} className="flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3">
            {line.split(' ').map((word, i) => (
                <span key={i} className="animated-word" dangerouslySetInnerHTML={{__html:word}}/>
            ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;
