import React from 'react';
import { MinimalToran } from './MinimalToran';

interface ToranDecorationProps {
  className?: string;
}

export const ToranDecoration: React.FC<ToranDecorationProps> = ({ className = '' }) => {
  return (
    <div 
      className={`w-full overflow-visible select-none pointer-events-none relative z-10 ${className}`}
      aria-hidden="true"
    >
      <div className="animate-toran-sway overflow-visible">
        <MinimalToran />
      </div>
    </div>
  );
};

export default ToranDecoration;
