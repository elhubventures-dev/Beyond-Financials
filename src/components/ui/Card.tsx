import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'muted' | 'brand' | 'royal';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-gray-200/90 shadow-2xs text-[#1E293B]',
    elevated: 'bg-white border border-gray-200 shadow-md text-[#1E293B]',
    muted: 'bg-[#F8FAFC] border border-gray-200/80 text-[#334155]',
    brand: 'bg-[#001B40] border border-[#001B40] text-white shadow-xl',
    royal: 'bg-[#0046AD] border border-[#0046AD] text-white shadow-xl',
  };

  const selectedStyle = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 transition-shadow duration-200 ${selectedStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

