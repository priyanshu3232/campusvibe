import { useRef } from 'react';

const topics = [
  { label: 'Mess Food', emoji: '🍛' },
  { label: 'Placements', emoji: '💼' },
  { label: 'Fest Updates', emoji: '🎪' },
  { label: 'Lost & Found', emoji: '🔍' },
  { label: 'Hostel Life', emoji: '🏠' },
  { label: 'Academics', emoji: '📚' },
  { label: 'Rants', emoji: '😤' },
  { label: 'Confessions', emoji: '🎭' },
];

export default function TopicBubbles({ activeTopic, onTopicChange }) {
  const scrollRef = useRef(null);

  return (
    <div className="px-4 mb-4">
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => onTopicChange(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !activeTopic ? 'bg-accent text-primary' : 'bg-card text-text-secondary border border-border'
          }`}
        >
          All
        </button>
        {topics.map(topic => (
          <button
            key={topic.label}
            onClick={() => onTopicChange(topic.label)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeTopic === topic.label
                ? 'bg-accent text-primary'
                : 'bg-card text-text-secondary border border-border hover:border-accent/30'
            }`}
          >
            {topic.emoji} {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
}
