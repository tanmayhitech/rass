import React from 'react';

interface MinimalToranProps {
  className?: string;
}

/**
 * Handcrafted Haute-Couture Indian Toran
 * Designed specifically for Rass by Ridhima in signature Regal Mauve & Champagne Gold.
 * Features:
 * - 6 catenary draped swags with rich line contrast (1.5px) and delicate dotted under-strand.
 * - True carved Indian Jhumka bell domes (no hollow ovals) with vertical ribs and connected moti pearls.
 * - Sculptural, upright Royal Lotus center blossom with a gold spine and hanging chandelier.
 * - Dedicated edge-to-edge mobile vector ensuring zero cutoffs on smartphones.
 */
export const MinimalToran: React.FC<MinimalToranProps> = ({ className = '' }) => {
  return (
    <div
      className={`w-full overflow-visible select-none pointer-events-none relative transition-all ${className}`}
      aria-hidden="true"
    >
      {/* 1. Desktop Toran (Full 1440px graceful sweep) */}
      <svg
        viewBox="0 -10 1440 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto hidden sm:block max-h-[96px] md:max-h-[108px] overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <ToranDesktopArt />
      </svg>

      {/* 2. Mobile Toran (Dedicated 390px edge-to-edge span tailored specifically for phones) */}
      <svg
        viewBox="0 -8 390 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block sm:hidden max-h-[64px] overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <ToranMobileArt />
      </svg>
    </div>
  );
};

/* ========================================================================= */
/* DESKTOP MASTERPIECE (viewBox="0 0 1440 92")                               */
/* ========================================================================= */
const ToranDesktopArt: React.FC = () => {
  const mauve = '#8B5E86';
  const gold = '#C8A97E';
  const ivory = '#FAF8F5';

  return (
    <>
      <defs>
        {/* Soft shadow giving physical floating depth */}
        <filter id="d-toran-shadow" x="-10%" y="-20%" width="120%" height="150%">
          <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" floodColor="#292624" floodOpacity="0.09" />
        </filter>

        {/* Regal Mauve Gradient */}
        <linearGradient id="d-mauve-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A4759F" />
          <stop offset="50%" stopColor="#8B5E86" />
          <stop offset="100%" stopColor="#71456D" />
        </linearGradient>

        {/* Champagne Gold Metallic */}
        <linearGradient id="d-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E8D2" />
          <stop offset="50%" stopColor="#C8A97E" />
          <stop offset="100%" stopColor="#A8875A" />
        </linearGradient>
      </defs>

      <g filter="url(#d-toran-shadow)" strokeLinecap="round" strokeLinejoin="round">
        
        {/* ========================================================= */}
        {/* 1. SCALLOPED DRAPED SWAGS (6 Graceful Catenary Curves)    */}
        {/* ========================================================= */}
        
        {/* Subtle Dotted Secondary Wire floating 3px below */}
        <g stroke={mauve} strokeWidth="0.7" strokeDasharray="2.5 3.5" strokeOpacity="0.38" fill="none">
          <path d="M 16 16 Q 128 36 240 22" />
          <path d="M 240 22 Q 360 44 480 26" />
          <path d="M 480 26 Q 600 50 720 28" />
          <path d="M 720 28 Q 840 50 960 26" />
          <path d="M 960 26 Q 1080 44 1200 22" />
          <path d="M 1200 22 Q 1312 36 1424 16" />
        </g>

        {/* Main Continuous Regal Mauve Garland Vine */}
        <g stroke="url(#d-mauve-grad)" strokeWidth="1.4" fill="none">
          <path d="M 16 12 Q 128 32 240 18" />
          <path d="M 240 18 Q 360 40 480 22" />
          <path d="M 480 22 Q 600 46 720 24" strokeWidth="1.6" />
          <path d="M 720 24 Q 840 46 960 22" strokeWidth="1.6" />
          <path d="M 960 22 Q 1080 40 1200 18" />
          <path d="M 1200 18 Q 1312 32 1424 12" />
        </g>

        {/* Seed Pearl Nodes Along Main Swags */}
        <g fill={ivory} stroke={mauve} strokeWidth="0.6">
          <circle cx="128" cy="32" r="1.6" />
          <circle cx="360" cy="40" r="1.8" />
          <circle cx="600" cy="46" r="2.0" />
          <circle cx="840" cy="46" r="2.0" />
          <circle cx="1080" cy="40" r="1.8" />
          <circle cx="1312" cy="32" r="1.6" />
        </g>

        {/* ========================================================= */}
        {/* 2. SWAG VALLEY PEARL DROPS (Connected by vertical links)  */}
        {/* ========================================================= */}
        {[
          { x: 128, y: 32 },
          { x: 360, y: 40 },
          { x: 600, y: 46 },
          { x: 840, y: 46 },
          { x: 1080, y: 40 },
          { x: 1312, y: 32 }
        ].map((pt, i) => (
          <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
            {/* Connected Vertical Wire Link */}
            <line x1="0" y1="2" x2="0" y2="10" stroke={mauve} strokeWidth="0.8" />
            <circle cx="0" cy="11.5" r="1.5" fill={ivory} stroke={mauve} strokeWidth="0.6" />
            <path d="M 0 13.5 L 1.8 16.5 L 0 19 L -1.8 16.5 Z" fill={gold} />
          </g>
        ))}

        {/* ========================================================= */}
        {/* 3. FLANKING FILIGREE JHUMKAS (True Bell Dome Silhouettes) */}
        {/* ========================================================= */}

        {/* Outer End Terminals (x=16 and x=1424) */}
        <g transform="translate(16, 12)">
          <circle cx="0" cy="0" r="1.8" fill={ivory} stroke={mauve} strokeWidth="0.7" />
          <line x1="0" y1="2" x2="0" y2="12" stroke={mauve} strokeWidth="0.8" />
          <path d="M 0 12 C -3 15 -3.5 19 -1.5 22 C 0 23.5 0 23.5 0 23.5 C 0 23.5 0 23.5 1.5 22 C 3.5 19 3 15 0 12 Z" fill={ivory} stroke={mauve} strokeWidth="0.9" />
          <circle cx="0" cy="25" r="1.1" fill={gold} />
        </g>
        <g transform="translate(1424, 12)">
          <circle cx="0" cy="0" r="1.8" fill={ivory} stroke={mauve} strokeWidth="0.7" />
          <line x1="0" y1="2" x2="0" y2="12" stroke={mauve} strokeWidth="0.8" />
          <path d="M 0 12 C -3 15 -3.5 19 -1.5 22 C 0 23.5 0 23.5 0 23.5 C 0 23.5 0 23.5 1.5 22 C 3.5 19 3 15 0 12 Z" fill={ivory} stroke={mauve} strokeWidth="0.9" />
          <circle cx="0" cy="25" r="1.1" fill={gold} />
        </g>

        {/* Node 1: x=240, y=18 (Compact Jhumka Dome) */}
        <DesktopJhumka x={240} y={18} size="compact" />

        {/* Node 2: x=480, y=22 (Grand Statement Filigree Jhumka) */}
        <DesktopJhumka x={480} y={22} size="grand" />

        {/* Node 3: x=960, y=22 (Grand Statement Filigree Jhumka - Symmetrical Right) */}
        <DesktopJhumka x={960} y={22} size="grand" />

        {/* Node 4: x=1200, y=18 (Compact Jhumka Dome) */}
        <DesktopJhumka x={1200} y={18} size="compact" />

        {/* ========================================================= */}
        {/* 4. GRAND CENTRAL ROYAL LOTUS & CHANDELIER (x=720, y=24)   */}
        {/* ========================================================= */}
        <g transform="translate(720, 24)">
          
          {/* Symmetrical Arch Brackets */}
          <path d="M -42 -2 C -28 -7 -18 -5 -12 0" stroke={mauve} strokeWidth="1.1" fill="none" />
          <circle cx="-26" cy="-3" r="1.5" fill={ivory} stroke={gold} strokeWidth="0.6" />
          <path d="M -26 -6 L -24 -3 L -26 0 L -28 -3 Z" fill={gold} />

          <path d="M 42 -2 C 28 -7 18 -5 12 0" stroke={mauve} strokeWidth="1.1" fill="none" />
          <circle cx="26" cy="-3" r="1.5" fill={ivory} stroke={gold} strokeWidth="0.6" />
          <path d="M 26 -6 L 28 -3 L 26 0 L 24 -3 Z" fill={gold} />

          {/* --- BLOOMING ROYAL LOTUS PETALS --- */}
          {/* Outermost Petals */}
          <path
            d="M -3 1 C -16 -3 -21 -10 -16 -16 C -10.5 -14 -4 -6 -3 1 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.2"
          />
          <path
            d="M 3 1 C 16 -3 21 -10 16 -16 C 10.5 -14 4 -6 3 1 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.2"
          />

          {/* Inner Paired Petals */}
          <path
            d="M -2 2 C -9 -4 -12 -14 -6 -20 C -2 -18 -0.5 -8 -2 2 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.3"
          />
          <path
            d="M 2 2 C 9 -4 12 -14 6 -20 C 2 -18 0.5 -8 2 2 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.3"
          />

          {/* Central Upright Lotus Crown Petal */}
          <path
            d="M 0 3 C -4.5 -5 -5 -18 0 -26 C 5 -18 4.5 -5 0 3 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.5"
          />
          {/* Gold Filigree Spine inside Crown Petal */}
          <line x1="0" y1="-2" x2="0" y2="-21" stroke={gold} strokeWidth="0.8" />
          <circle cx="0" cy="-12" r="1.3" fill={gold} />

          {/* Calyx Cradle Base */}
          <path d="M -13 -4 C -9 6 9 6 13 -4" stroke={gold} strokeWidth="1.2" fill="none" />
          <circle cx="0" cy="5" r="2.0" fill={ivory} stroke={mauve} strokeWidth="0.8" />

          {/* --- SUSPENDED ROYAL JHUMKA CHANDELIER --- */}
          <g transform="translate(0, 7)">
            {/* Connected Vertical Suspension Link */}
            <line x1="0" y1="0" x2="0" y2="7" stroke={gold} strokeWidth="0.9" />
            <circle cx="0" cy="8.5" r="1.6" fill={ivory} stroke={mauve} strokeWidth="0.6" />

            {/* True Filigree Jhumka Bell Dome (Arched Bell Silhouette) */}
            <path
              d="M -11 12 C -8 5 8 5 11 12 C 12.5 16 9 18 0 18 C -9 18 -12.5 16 -11 12 Z"
              fill={ivory}
              stroke={mauve}
              strokeWidth="1.3"
            />
            {/* Vertical Filigree Ribs */}
            <path d="M -6 8 C -4.5 12 -3 16 0 17.5" stroke={gold} strokeWidth="0.7" fill="none" />
            <path d="M 6 8 C 4.5 12 3 16 0 17.5" stroke={gold} strokeWidth="0.7" fill="none" />
            <line x1="0" y1="5.5" x2="0" y2="18" stroke={gold} strokeWidth="0.9" />

            {/* Rawa Micro-Beads along Bell Rim */}
            <circle cx="-8" cy="15" r="0.6" fill={gold} />
            <circle cx="-4" cy="17" r="0.7" fill={gold} />
            <circle cx="0" cy="17.8" r="0.8" fill={gold} />
            <circle cx="4" cy="17" r="0.7" fill={gold} />
            <circle cx="8" cy="15" r="0.6" fill={gold} />

            {/* 5 Cascading Hanging Moti Pearls (Physically Connected) */}
            {/* Outer Left */}
            <line x1="-8" y1="18" x2="-8" y2="23" stroke={mauve} strokeWidth="0.7" />
            <circle cx="-8" cy="24.5" r="1.3" fill={ivory} stroke={mauve} strokeWidth="0.5" />

            {/* Mid Left */}
            <line x1="-4" y1="18" x2="-4" y2="26" stroke={gold} strokeWidth="0.8" />
            <circle cx="-4" cy="27.5" r="1.5" fill={ivory} stroke={gold} strokeWidth="0.5" />

            {/* Center Royal Teardrop Drop */}
            <line x1="0" y1="18" x2="0" y2="29" stroke={gold} strokeWidth="1" />
            <circle cx="0" cy="30.5" r="1.8" fill={mauve} />
            <path d="M 0 32.5 L 2 36 L 0 39 L -2 36 Z" fill={gold} />

            {/* Mid Right */}
            <line x1="4" y1="18" x2="4" y2="26" stroke={gold} strokeWidth="0.8" />
            <circle cx="4" cy="27.5" r="1.5" fill={ivory} stroke={gold} strokeWidth="0.5" />

            {/* Outer Right */}
            <line x1="8" y1="18" x2="8" y2="23" stroke={mauve} strokeWidth="0.7" />
            <circle cx="8" cy="24.5" r="1.3" fill={ivory} stroke={mauve} strokeWidth="0.5" />
          </g>
        </g>

      </g>
    </>
  );
};

/**
 * Reusable Desktop Jhumka Bell Component (True Dome Shape)
 */
const DesktopJhumka: React.FC<{
  x: number;
  y: number;
  size: 'grand' | 'compact';
}> = ({ x, y, size }) => {
  const mauve = '#8B5E86';
  const gold = '#C8A97E';
  const ivory = '#FAF8F5';
  const isGrand = size === 'grand';

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Sparkle Rosette at Node */}
      <path d="M 0 -4 L 4 0 L 0 4 L -4 0 Z" fill={isGrand ? mauve : gold} />
      <circle cx="0" cy="0" r="1.3" fill={ivory} />

      {/* Connected Vertical Wire Link */}
      <line x1="0" y1="4" x2="0" y2="12" stroke={mauve} strokeWidth="0.8" />
      <circle cx="0" cy="13.5" r={isGrand ? 1.6 : 1.4} fill={ivory} stroke={mauve} strokeWidth="0.5" />

      {/* JHUMKA BELL DOME (Authentic curved bell dome) */}
      {isGrand ? (
        <g transform="translate(0, 2)">
          <path
            d="M -9 14 C -7 8 7 8 9 14 C 10 17.5 7 19.5 0 19.5 C -7 19.5 -10 17.5 -9 14 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.2"
          />
          {/* Filigree ribs */}
          <path d="M -5 10 C -3.5 13 -2 16.5 0 18.5" stroke={gold} strokeWidth="0.6" fill="none" />
          <path d="M 5 10 C 3.5 13 2 16.5 0 18.5" stroke={gold} strokeWidth="0.6" fill="none" />
          <line x1="0" y1="8" x2="0" y2="19.5" stroke={gold} strokeWidth="0.8" />

          {/* Rawa Rim Beads */}
          <circle cx="-6" cy="16.5" r="0.6" fill={gold} />
          <circle cx="0" cy="18.8" r="0.7" fill={gold} />
          <circle cx="6" cy="16.5" r="0.6" fill={gold} />

          {/* 3 Connected Dangling Moti Pearls */}
          <line x1="-5" y1="19.5" x2="-5" y2="24.5" stroke={mauve} strokeWidth="0.7" />
          <circle cx="-5" cy="26" r="1.3" fill={ivory} stroke={mauve} strokeWidth="0.4" />

          <line x1="0" y1="19.5" x2="0" y2="27" stroke={gold} strokeWidth="0.8" />
          <circle cx="0" cy="28.5" r="1.6" fill={mauve} />
          <path d="M 0 30.2 L 1.5 32.5 L 0 34.5 L -1.5 32.5 Z" fill={gold} />

          <line x1="5" y1="19.5" x2="5" y2="24.5" stroke={mauve} strokeWidth="0.7" />
          <circle cx="5" cy="26" r="1.3" fill={ivory} stroke={mauve} strokeWidth="0.4" />
        </g>
      ) : (
        <g transform="translate(0, 2)">
          <path
            d="M -7 13 C -5 8 5 8 7 13 C 8 16 5.5 17.5 0 17.5 C -5.5 17.5 -8 16 -7 13 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.1"
          />
          <line x1="0" y1="8" x2="0" y2="17.5" stroke={gold} strokeWidth="0.7" />
          
          <line x1="0" y1="17.5" x2="0" y2="23" stroke={mauve} strokeWidth="0.7" />
          <circle cx="0" cy="24.5" r="1.4" fill={ivory} stroke={mauve} strokeWidth="0.5" />
        </g>
      )}
    </g>
  );
};

/* ========================================================================= */
/* DEDICATED MOBILE MASTERPIECE (viewBox="0 0 390 60")                       */
/* ========================================================================= */
const ToranMobileArt: React.FC = () => {
  const mauve = '#8B5E86';
  const gold = '#C8A97E';
  const ivory = '#FAF8F5';

  return (
    <>
      <defs>
        <filter id="m-toran-shadow-pro" x="-10%" y="-20%" width="120%" height="150%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="#292624" floodOpacity="0.08" />
        </filter>

        <linearGradient id="m-mauve-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A4759F" />
          <stop offset="50%" stopColor="#8B5E86" />
          <stop offset="100%" stopColor="#71456D" />
        </linearGradient>
      </defs>

      <g filter="url(#m-toran-shadow-pro)" strokeLinecap="round" strokeLinejoin="round">
        
        {/* Subtle Dotted Secondary Strand */}
        <g stroke={mauve} strokeWidth="0.6" strokeDasharray="2 3" strokeOpacity="0.38" fill="none">
          <path d="M 0 13 Q 98 31 195 21" />
          <path d="M 195 21 Q 292 31 390 13" />
        </g>

        {/* Main Silky Garland Vine (Edge-to-Edge) */}
        <g stroke="url(#m-mauve-grad)" strokeWidth="1.3" fill="none">
          <path d="M 0 10 Q 98 28 195 18" />
          <path d="M 195 18 Q 292 28 390 10" />
        </g>

        {/* Outer Edge Terminals */}
        <circle cx="3" cy="10" r="1.4" fill={ivory} stroke={mauve} strokeWidth="0.6" />
        <circle cx="387" cy="10" r="1.4" fill={ivory} stroke={mauve} strokeWidth="0.6" />

        {/* --- LEFT FLANKING JHUMKA (x=98, y=28) --- */}
        <g transform="translate(98, 28)">
          <path d="M 0 -3 L 3 0 L 0 3 L -3 0 Z" fill={gold} />
          {/* Connected wire */}
          <line x1="0" y1="3" x2="0" y2="8" stroke={mauve} strokeWidth="0.8" />
          <circle cx="0" cy="9.5" r="1.4" fill={ivory} stroke={mauve} strokeWidth="0.5" />

          {/* Arched Jhumka Dome */}
          <path
            d="M -7 13 C -5 8 5 8 7 13 C 8 16 5.5 17.5 0 17.5 C -5.5 17.5 -8 16 -7 13 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.1"
          />
          <line x1="0" y1="8" x2="0" y2="17.5" stroke={gold} strokeWidth="0.7" />

          {/* Connected dangling moti */}
          <line x1="-3.5" y1="17.5" x2="-3.5" y2="21" stroke={mauve} strokeWidth="0.6" />
          <circle cx="-3.5" cy="22" r="1.1" fill={ivory} stroke={mauve} strokeWidth="0.4" />

          <line x1="0" y1="17.5" x2="0" y2="23" stroke={gold} strokeWidth="0.7" />
          <circle cx="0" cy="24.2" r="1.3" fill={mauve} />

          <line x1="3.5" y1="17.5" x2="3.5" y2="21" stroke={mauve} strokeWidth="0.6" />
          <circle cx="3.5" cy="22" r="1.1" fill={ivory} stroke={mauve} strokeWidth="0.4" />
        </g>

        {/* --- RIGHT FLANKING JHUMKA (x=292, y=28) --- */}
        <g transform="translate(292, 28)">
          <path d="M 0 -3 L 3 0 L 0 3 L -3 0 Z" fill={gold} />
          <line x1="0" y1="3" x2="0" y2="8" stroke={mauve} strokeWidth="0.8" />
          <circle cx="0" cy="9.5" r="1.4" fill={ivory} stroke={mauve} strokeWidth="0.5" />

          <path
            d="M -7 13 C -5 8 5 8 7 13 C 8 16 5.5 17.5 0 17.5 C -5.5 17.5 -8 16 -7 13 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.1"
          />
          <line x1="0" y1="8" x2="0" y2="17.5" stroke={gold} strokeWidth="0.7" />

          <line x1="-3.5" y1="17.5" x2="-3.5" y2="21" stroke={mauve} strokeWidth="0.6" />
          <circle cx="-3.5" cy="22" r="1.1" fill={ivory} stroke={mauve} strokeWidth="0.4" />

          <line x1="0" y1="17.5" x2="0" y2="23" stroke={gold} strokeWidth="0.7" />
          <circle cx="0" cy="24.2" r="1.3" fill={mauve} />

          <line x1="3.5" y1="17.5" x2="3.5" y2="21" stroke={mauve} strokeWidth="0.6" />
          <circle cx="3.5" cy="22" r="1.1" fill={ivory} stroke={mauve} strokeWidth="0.4" />
        </g>

        {/* --- CENTER GRAND ROYAL LOTUS & CHANDELIER (x=195, y=18) --- */}
        <g transform="translate(195, 18)">
          {/* Supporting Arch Lines */}
          <path d="M -24 -1 C -16 -4 -11 -3 -6 0" stroke={mauve} strokeWidth="0.9" fill="none" />
          <circle cx="-15" cy="-1.5" r="1.2" fill={ivory} stroke={gold} strokeWidth="0.5" />

          <path d="M 24 -1 C 16 -4 11 -3 6 0" stroke={mauve} strokeWidth="0.9" fill="none" />
          <circle cx="15" cy="-1.5" r="1.2" fill={ivory} stroke={gold} strokeWidth="0.5" />

          {/* Outermost Petals */}
          <path
            d="M -2 1 C -11 -2 -14 -6 -11 -10 C -7.5 -9 -2 -4 -2 1 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1"
          />
          <path
            d="M 2 1 C 11 -2 14 -6 11 -10 C 7.5 -9 2 -4 2 1 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1"
          />

          {/* Inner Petals */}
          <path
            d="M -1.5 2 C -6 -2 -8 -8 -4.5 -12.5 C -1.5 -11 -0.5 -5 -1.5 2 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.1"
          />
          <path
            d="M 1.5 2 C 6 -2 8 -8 4.5 -12.5 C 1.5 -11 0.5 -5 1.5 2 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.1"
          />

          {/* Upright Center Crown Petal */}
          <path
            d="M 0 2.5 C -3 -3 -3.5 -12 0 -16.5 C 3.5 -12 3 -3 0 2.5 Z"
            fill={ivory}
            stroke={mauve}
            strokeWidth="1.3"
          />
          <line x1="0" y1="-1" x2="0" y2="-13.5" stroke={gold} strokeWidth="0.7" />

          {/* Bottom Calyx Cradle */}
          <path d="M -9 -3 C -7 4 7 4 9 -3" stroke={gold} strokeWidth="1" fill="none" />
          <circle cx="0" cy="3.5" r="1.6" fill={ivory} stroke={mauve} strokeWidth="0.6" />

          {/* Suspended Royal Jhumka Drop */}
          <g transform="translate(0, 5)">
            <line x1="0" y1="0" x2="0" y2="5" stroke={gold} strokeWidth="0.7" />
            <circle cx="0" cy="6.2" r="1.3" fill={ivory} stroke={mauve} strokeWidth="0.5" />

            {/* Arched Bell Dome */}
            <path
              d="M -8 9.5 C -6 5 6 5 8 9.5 C 9 12 6.5 13.5 0 13.5 C -6.5 13.5 -9 12 -8 9.5 Z"
              fill={ivory}
              stroke={mauve}
              strokeWidth="1.1"
            />
            <line x1="0" y1="5.5" x2="0" y2="13.5" stroke={gold} strokeWidth="0.7" />

            {/* 3 Connected Hanging Moti Pearls */}
            <line x1="-4" y1="13.5" x2="-4" y2="17.5" stroke={mauve} strokeWidth="0.6" />
            <circle cx="-4" cy="18.5" r="1.1" fill={ivory} stroke={mauve} strokeWidth="0.4" />

            <line x1="0" y1="13.5" x2="0" y2="19.5" stroke={gold} strokeWidth="0.8" />
            <circle cx="0" cy="21" r="1.4" fill={mauve} />
            <path d="M 0 22.8 L 1.2 24.5 L 0 26 L -1.2 24.5 Z" fill={gold} />

            <line x1="4" y1="13.5" x2="4" y2="17.5" stroke={mauve} strokeWidth="0.6" />
            <circle cx="4" cy="18.5" r="1.1" fill={ivory} stroke={mauve} strokeWidth="0.4" />
          </g>
        </g>

      </g>
    </>
  );
};

export default MinimalToran;
