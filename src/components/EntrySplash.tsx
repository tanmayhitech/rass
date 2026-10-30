import React, { useState, useEffect } from 'react';

interface EntrySplashProps {
  onComplete?: () => void;
}

export const EntrySplash: React.FC<EntrySplashProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1. Automatically begin smooth transition into the site after 1.8s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1800);

    // 2. Completely unmount at 2.4s so the site is fully active and clean
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2400);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FAF8F5] select-none transition-opacity duration-600 ease-out ${
        isExiting 
          ? 'opacity-0 pointer-events-none' 
          : 'opacity-100 pointer-events-auto'
      }`}
      aria-label="Rass by Ridhima"
      role="status"
    >
      {/* 3D Perspective Stage for Rass Logo */}
      <div 
        className={`relative flex items-center justify-center p-8 [perspective:1200px] transition-transform duration-600 ease-out ${
          isExiting ? 'scale-[1.04]' : 'scale-100'
        }`}
      >
        {/* 360-degree rotating logo container */}
        <div className="relative group animate-spin-360 [transform-style:preserve-3d]">
          
          {/* Authentic Rass Wordmark Logo */}
          <img
            src="/images/Rass by Ridhima Wordmark.png"
            alt="Rass by Ridhima"
            className="h-14 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[85vw] object-contain drop-shadow-[0_6px_20px_rgba(41,38,36,0.1)]"
          />

          {/* Radiant Metallic Shine Gleam Passing Across Logo */}
          <div 
            className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg"
            aria-hidden="true"
          >
            <div className="w-[45%] h-[200%] -top-1/2 absolute bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shine-gleam pointer-events-none" />
          </div>

          {/* Star Glint Sparkle at top corner */}
          <div 
            className="absolute -top-2 -right-3 text-[#B49A6C] text-lg sm:text-2xl animate-glint-star pointer-events-none select-none drop-shadow-sm"
            aria-hidden="true"
          >
            ✦
          </div>

        </div>
      </div>
    </div>
  );
};
