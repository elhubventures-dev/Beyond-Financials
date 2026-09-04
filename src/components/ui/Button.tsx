import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Padding rule: Horizontal padding must be exactly 2x vertical padding
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'py-2 px-4 text-xs font-semibold rounded-lg gap-1.5',
    md: 'py-2.5 px-5 text-sm font-bold rounded-lg gap-2',
    lg: 'py-3.5 px-7 text-base font-bold rounded-xl gap-2.5',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#0046AD] text-white hover:bg-[#00388A] active:bg-[#002B6B] shadow-sm border border-[#0046AD] focus-visible:ring-2 focus-visible:ring-[#0046AD] focus-visible:ring-offset-2',
    accent:
      'bg-[#FBBF24] text-[#001B40] hover:bg-[#F59E0B] active:bg-[#D97706] shadow-sm font-bold rounded-full border border-[#FBBF24] focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2',
    secondary:
      'bg-[#001B40] text-white hover:bg-[#06285A] active:bg-[#00122B] shadow-sm border border-[#001B40] focus-visible:ring-2 focus-visible:ring-[#001B40] focus-visible:ring-offset-2',
    outline:
      'bg-white text-[#001B40] hover:bg-slate-50 active:bg-slate-100 border border-slate-200 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
    ghost:
      'bg-transparent text-slate-600 hover:bg-blue-50/60 hover:text-[#0046AD] active:bg-blue-100/60 focus-visible:ring-2 focus-visible:ring-[#0046AD] focus-visible:ring-offset-2',
  };

  const selectedSize = sizeStyles[size] || sizeStyles.md;
  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center whitespace-nowrap transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${selectedSize} ${selectedVariant} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};

