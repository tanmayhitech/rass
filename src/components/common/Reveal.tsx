import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number; // milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  duration?: number; // milliseconds
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  duration = 750,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Immediate viewport check
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.01,
        rootMargin: '100px 0px 0px 0px',
      }
    );

    observer.observe(el);

    // Robust safety fallback: ensure content is always visible
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 600);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimer);
    };
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate-x-0 translate-y-0 opacity-100 scale-100';
    switch (direction) {
      case 'up':
        return 'translate-y-6 opacity-0';
      case 'down':
        return '-translate-y-6 opacity-0';
      case 'left':
        return 'translate-x-6 opacity-0';
      case 'right':
        return '-translate-x-6 opacity-0';
      case 'none':
        return 'opacity-0 scale-[0.98]';
      default:
        return 'translate-y-6 opacity-0';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity] ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
};
