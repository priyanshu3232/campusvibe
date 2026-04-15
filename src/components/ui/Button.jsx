import React from 'react';

const variants = {
  primary: 'bg-accent text-primary font-semibold hover:brightness-110',
  secondary: 'bg-card text-text-primary hover:bg-card-alt',
  outline: 'border border-border text-text-primary hover:bg-card',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-card/50',
  danger: 'bg-accent-danger text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  fullWidth = false,
  disabled = false,
  ...rest
}) {
  return (
    <button
      disabled={disabled}
      className={`
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl transition-all duration-200 active:scale-95
        disabled:opacity-50 disabled:pointer-events-none
        font-body inline-flex items-center justify-center gap-2
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}
