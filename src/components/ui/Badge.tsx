import React from 'react';

export type BadgeVariant =
  | 'blue'
  | 'amber'
  | 'emerald'
  | 'slate'
  | 'purple'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'primary'
  | 'default'
  | 'rose';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    blue: {
      container: 'bg-blue-50 text-[#0046AD] border-blue-100',
      dot: 'bg-[#0046AD]',
    },
    primary: {
      container: 'bg-blue-50 text-[#0046AD] border-blue-100',
      dot: 'bg-[#0046AD]',
    },
    info: {
      container: 'bg-blue-50 text-[#0046AD] border-blue-100',
      dot: 'bg-[#0046AD]',
    },
    amber: {
      container: 'bg-amber-50 text-[#92400E] border-[#FDE68A]',
      dot: 'bg-[#F59E0B]',
    },
    warning: {
      container: 'bg-amber-50 text-[#92400E] border-[#FDE68A]',
      dot: 'bg-[#F59E0B]',
    },
    emerald: {
      container: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
    },
    success: {
      container: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
    },
    slate: {
      container: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-500',
    },
    default: {
      container: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-500',
    },
    purple: {
      container: 'bg-purple-50 text-purple-800 border-purple-200',
      dot: 'bg-purple-600',
    },
    danger: {
      container: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-600',
    },
    rose: {
      container: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-600',
    },
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs tracking-wide',
    md: 'px-2.5 py-1 text-xs font-semibold tracking-wide',
  };

  const selected = variantStyles[variant] || variantStyles.blue;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap select-none transition-colors ${selected.container} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${selected.dot}`} aria-hidden="true" />}
      {children}
    </span>
  );
};
