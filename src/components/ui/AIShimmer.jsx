import React from 'react';

export default function AIShimmer({
  text = 'AI is thinking...',
  className = '',
}) {
  return (
    <div
      className={`
        ai-shimmer rounded-xl p-4
        flex items-center gap-2
        text-text-secondary text-sm font-body
        ${className}
      `}
    >
      <span className="shrink-0">&#10024;</span>
      <span>{text}</span>
      <span className="flex gap-0.5 ml-1">
        <span className="typing-dot w-1 h-1 rounded-full bg-text-tertiary inline-block" />
        <span className="typing-dot w-1 h-1 rounded-full bg-text-tertiary inline-block" />
        <span className="typing-dot w-1 h-1 rounded-full bg-text-tertiary inline-block" />
      </span>
    </div>
  );
}
