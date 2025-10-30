import React from "react";
import type { FC } from "react";

const HeroText: FC = () => (
  <>
    {/* KHEL - Top Left Corner */}
    <h1
      className="khel-text text-white absolute top-24 left-8 md:left-16"
      style={{
        fontFamily: 'var(--font-knight-warrior), sans-serif',
        fontSize: 'clamp(4rem, 12vw, 10rem)',
        lineHeight: 1,
      }}
    >
      KHEL
    </h1>

    {/* FUN - Bottom Right Corner */}
    <h1
      className="fun-text text-white absolute bottom-24 right-8 md:right-16"
      style={{
        fontFamily: 'var(--font-knight-warrior), sans-serif',
        fontSize: 'clamp(4rem, 12vw, 10rem)',
        lineHeight: 1,
        
      }}
    >
      FUN
    </h1>
  </>
);

export default HeroText;