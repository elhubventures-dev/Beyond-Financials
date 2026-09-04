import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  id: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  id,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label htmlFor={id} className="text-sm font-semibold text-slate-800 flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-amber-600 ml-1 font-bold">*</span>}
        </span>
      </label>
      <select
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={`w-full px-4 py-2.5 text-sm bg-white text-slate-900 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          error
            ? 'border-rose-500 focus:ring-rose-500'
            : 'border-slate-300 focus:border-blue-700 focus:ring-blue-600'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-xs text-rose-600 font-medium">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-helper`} className="text-xs text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
};
