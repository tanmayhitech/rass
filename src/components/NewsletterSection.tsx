import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { emailService } from '../services/emailService';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    const subscriberEmail = email.trim();
    try {
      await emailService.sendNewsletterWelcomeEmail(subscriberEmail);
    } catch (err) {
      console.warn('[Newsletter] Failed to dispatch welcome email via Resend:', err);
    }

    setStatus('success');
    setEmail('');
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#A783A2', '#C8D4C1', '#B49A6C', '#E2D5E5']
    });
  };

  return (
    <section className="relative w-full mt-0 lg:-mt-24 z-20 select-none">
      {/* 1. Organic Landscape Top Wave (Seamlessly Overlapping the Earrings Photo Baseline) */}
      <div className="w-full overflow-hidden leading-none pointer-events-none" aria-hidden="true">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-20 sm:h-24 lg:h-28 block"
        >
          {/* Wave crests smoothly over photo plinth on left (y=30), dips into valley under button (y=100), rises gently on right (y=56) */}
          <path 
            d="M 0,62 C 80,44 150,30 240,30 C 380,30 490,100 640,100 C 780,100 890,56 1000,56 C 1070,56 1140,62 1200,66 L 1200,120 L 0,120 Z" 
            fill="#CAD2C5" 
          />
        </svg>
      </div>

      {/* 2. Main Newsletter Section Body */}
      <div className="bg-[#CAD2C5] text-[#292624] pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20 relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Eyebrow and Headline */}
            <div className="lg:col-span-5">
              <div className="flex items-center space-x-2.5 sm:space-x-3 mb-2.5 sm:mb-3">
                <span className="font-sans font-medium text-[10.5px] sm:text-[12px] tracking-[0.22em] sm:tracking-[0.25em] text-[#292624]/75 uppercase">
                  STAY IN TOUCH
                </span>
                <div className="w-8 sm:w-10 h-[1px] bg-[#292624]/20" />
              </div>
              <h2 className="font-editorial text-[28px] sm:text-[42px] lg:text-[48px] leading-tight text-[#292624] font-normal">
                Be the first to know.
              </h2>
            </div>

            {/* Center Column: Translucent Email Input Pill with Mauve Circular Button */}
            <div className="lg:col-span-4">
              {status === 'success' ? (
                <div className="bg-[#FAF8F5]/95 rounded-full px-5 sm:px-6 py-3 sm:py-3.5 flex items-center space-x-2.5 sm:space-x-3 text-[#292624] shadow-sm animate-fadeIn">
                  <CheckCircle2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#A783A2]" />
                  <span className="text-[13px] sm:text-sm font-medium">Thank you for joining our inner circle!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email address"
                    className="w-full h-11 sm:h-12 lg:h-[50px] pl-5 sm:pl-6 pr-12 sm:pr-14 rounded-full bg-[#DDE6D9]/80 focus:bg-white text-[#292624] text-[13px] sm:text-[14px] placeholder-[#77716F]/75 border border-white/60 focus:border-[#A783A2] focus:outline-none shadow-xs transition-all"
                    aria-label="Email address for newsletter"
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="absolute right-1 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#A783A2] hover:bg-[#936E8F] text-white flex items-center justify-center transition-all duration-300 shadow hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FAF8F5] cursor-pointer"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                  </button>
                </form>
              )}
              {status === 'error' && (
                <p className="mt-2 text-xs text-red-800 font-medium pl-4">{errorMessage}</p>
              )}
            </div>

            {/* Right Column: Explanatory Copy */}
            <div className="lg:col-span-3 lg:pl-4 flex items-center">
              <div className="border-l border-[#292624]/20 pl-4 sm:pl-5">
                <p className="font-sans text-[12.5px] sm:text-[13.5px] leading-relaxed text-[#292624]/80">
                  Exclusive drops,<br />
                  early access and<br />
                  special offers.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Upright Mauve Lotus Branch Watermark on Far Right (matching reference) */}
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-65 z-0" aria-hidden="true">
          <img
            src="/elements/Delicate Mauve Lotus Branch.png"
            alt=""
            className="w-24 sm:w-32 lg:w-40 xl:w-44 h-auto object-contain object-right"
          />
        </div>
      </div>

      {/* 3. Organic Landscape Bottom Wave (Flowing into Warm Ivory Footer) */}
      <div className="w-full overflow-hidden leading-none pointer-events-none -mt-px" aria-hidden="true">
        <svg 
          viewBox="0 0 1200 45" 
          preserveAspectRatio="none" 
          className="w-full h-6 sm:h-10 lg:h-12 block"
        >
          <path 
            d="M 0,0 L 1200,0 L 1200,18 C 960,42 680,8 380,32 C 180,48 80,22 0,26 Z" 
            fill="#CAD2C5" 
          />
        </svg>
      </div>
    </section>
  );
};
