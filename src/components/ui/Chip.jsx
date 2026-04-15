import React from 'react';

export default function Chip({
  label,
  selected = false,
  onClick,
  icon,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-full text-sm font-medium
        cursor-pointer transition-all inline-flex items-center gap-1.5
        ${
          selected
            ? 'bg-accent/15 text-accent border border-accent/40'
            : 'bg-card text-text-secondary border border-border hover:border-accent/30'
        }
        ${className}
      `}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}
