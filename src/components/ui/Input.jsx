import React from 'react';

export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  ...rest
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-text-secondary text-sm mb-1 font-body">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
          />
        )}
        <input
          className={`
            w-full bg-input border border-border rounded-xl
            ${Icon ? 'pl-10 pr-4' : 'px-4'} py-3
            text-text-primary placeholder:text-text-tertiary
            focus:border-accent focus:ring-1 focus:ring-accent/30
            outline-none transition-all font-body
            ${error ? 'border-accent-danger focus:border-accent-danger focus:ring-accent-danger/30' : ''}
          `}
          {...rest}
        />
      </div>
      {error && (
        <p className="text-accent-danger text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
