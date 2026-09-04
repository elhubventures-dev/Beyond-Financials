import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'icon-only' | 'monochrome-white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const innerSizes = {
    sm: 'w-3.5 h-3.5 border-1.5',
    md: 'w-5 h-5 border-2',
    lg: 'w-6 h-6 border-2',
    xl: 'w-8 h-8 border-2.5',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subtextSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Geometric Balance Brand Emblem (Royal Blue box + Rotated 45-deg Gold Diamond) */}
      <div
        className={`relative flex-shrink-0 ${iconSizes[size]} ${
          variant === 'monochrome-white'
            ? 'bg-white/10 border border-white/20'
            : 'bg-[#0046AD] shadow-sm'
        } flex items-center justify-center rounded-lg transition-transform hover:scale-105 duration-200`}
        aria-label="Beyond Financials Logo"
      >
        <div
          className={`${innerSizes[size]} border-[#FBBF24] rotate-45 transform transition-transform duration-300 group-hover:rotate-90`}
        />
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col leading-tight text-left">
          <span
            className={`font-display font-extrabold tracking-tight uppercase ${textSizes[size]} ${
              variant === 'monochrome-white' ? 'text-white' : 'text-[#0046AD]'
            }`}
          >
            BEYOND{' '}
            <span
              className={`font-light ${
                variant === 'monochrome-white' ? 'text-slate-400' : 'text-slate-400'
              }`}
            >
              FINANCIALS
            </span>
          </span>
          <span
            className={`font-sans tracking-wider font-semibold uppercase ${subtextSizes[size]} ${
              variant === 'monochrome-white' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            beyondfinancials.ng
          </span>
        </div>
      )}
    </div>
  );
};

