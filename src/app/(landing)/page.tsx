'use client';

import React, { useState, Suspense, lazy } from "react";
import type { FC } from "react";
import IntroMask from "./_components/IntroMask";
import useIntroAnimation from "@/hooks/useIntroAnimation";

// Lazy load the LandingPage component for better performance
const LandingPage = lazy(() => import("./_components/LandingPage"));

// Loading fallback component
const PageLoader: FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
    <div className="three-body">
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
    </div>
  </div>
);

const Home: FC = () => {
    const [showContent, setShowContent] = useState(false);
    useIntroAnimation(setShowContent);

    return (
        <>
            {!showContent && <IntroMask />}
            {showContent && (
                <Suspense fallback={<PageLoader />}>
                    <LandingPage />
                </Suspense>
            )}
        </>
    );
};

export default Home;