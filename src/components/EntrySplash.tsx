import React, { useState, useEffect } from 'react';

interface EntrySplashProps {
  onComplete?: () => void;
}

export const EntrySplash: React.FC<EntrySplashProps> = ({ onComplete }) => {
  // If the user already experienced the entry flourish in this session, skip on subsequent reloads
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return sessionStorage.getItem('rass_intro_shown') !== 'true';
    } catch {
      return true;
    }
  });
  const [isExiting, setIsExiting] = useState(false);

  const dismissSplash = () => {
    setIsExiting(true);
    try {
      sessionStorage.setItem('rass_intro_shown', 'true');
    } catch { /* ignore */ }
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 300);
  };

  useEffect(() => {
    if (!isVisible) {
      if (onComplete) onComplete();
      return;
    }

    // 1. Automatically begin smooth transition into the site after 750ms
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      try {
        sessionStorage.setItem('rass_intro_shown', 'true');
      } catch { /* ignore */ }
    }, 750);

    // 2. Completely unmount at 1100ms so the site is fully interactive and snappy
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 1100);

    // Allow user to press Esc or Space to skip immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        dismissSplash();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      onClick={dismissSplash}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FAF8F5] select-none cursor-pointer transition-opacity duration-300 ease-out ${
        isExiting 
          ? 'opacity-0 pointer-events-none' 
          : 'opacity-100 pointer-events-auto'
      }`}
      aria-label="Rass by Ridhima (Click anywhere to skip)"
      title="Click anywhere to enter"
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
