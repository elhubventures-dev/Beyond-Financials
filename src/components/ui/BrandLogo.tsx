import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'icon-only' | 'monochrome-white' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const HEIGHTS = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-11',
  xl: 'h-14',
} as const;

const ICON_HEIGHTS = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-11 w-11',
  xl: 'h-14 w-14',
} as const;

const TEXT_SIZES = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
} as const;

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const isDark = variant === 'monochrome-white' || variant === 'white';
  const isIconOnly = variant === 'icon-only';

  if (isIconOnly || isDark) {
    return (
      <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
        <img
          src="/logo-icon.png"
          alt={isIconOnly ? 'Beyond Financials' : ''}
          className={`${ICON_HEIGHTS[size]} object-contain flex-shrink-0`}
          width={56}
          height={56}
          decoding="async"
        />
        {!isIconOnly && (
          <div className="flex flex-col leading-tight text-left">
            <span
              className={`font-display font-extrabold tracking-tight uppercase ${TEXT_SIZES[size]} text-white`}
            >
              BEYOND{' '}
              <span className="font-light text-slate-300">FINANCIALS</span>
            </span>
            <span className="font-sans tracking-wider font-semibold uppercase text-[9px] sm:text-[10px] text-slate-400">
              beyondfinancials.ng
            </span>
          </div>
        )}
        {isIconOnly && <span className="sr-only">Beyond Financials</span>}
      </div>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="Beyond Financials"
      className={`inline-block ${HEIGHTS[size]} w-auto object-contain select-none ${className}`}
      width={296}
      height={82}
      decoding="async"
    />
  );
};
