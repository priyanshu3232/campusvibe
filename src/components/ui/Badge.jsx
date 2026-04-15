import React from 'react';

const variants = {
  default: 'bg-card-alt text-text-secondary',
  accent: 'bg-accent text-primary',
  danger: 'bg-accent-danger text-white',
};

export default function Badge({
  count,
  variant = 'default',
  className = '',
}) {
  const display = count > 99 ? '99+' : count;

  return (
    <span
      className={`
        ${variants[variant] || variants.default}
        min-w-[20px] h-5 px-1.5
        flex items-center justify-center
        text-xs font-bold rounded-full
        ${className}
      `}
    >
      {display}
    </span>
  );
}
