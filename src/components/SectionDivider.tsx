import React from 'react';

interface SectionDividerProps {
  className?: string;
  variant?: 'top' | 'middle' | 'footer' | 'lotus';
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ 
  className = '', 
}) => {
  return (
    <div className={`flex items-center justify-center px-4 select-none ${className}`} aria-hidden="true">
      <img 
        src="/elements/Elegant Mauve Lotus Ornamental Divider.png" 
        alt="" 
        className="w-[160px] sm:w-[210px] md:w-[260px] lg:w-[290px] h-auto object-contain pointer-events-none"
      />
    </div>
  );
};
