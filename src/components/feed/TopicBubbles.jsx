const topics = [
  { label: 'For You', key: null },
  { label: 'Placements', key: 'Placements' },
  { label: 'Confessions', key: 'Confessions' },
  { label: 'Mess Food', key: 'Mess Food' },
  { label: 'Fest Updates', key: 'Fest Updates' },
  { label: 'Lost & Found', key: 'Lost & Found' },
  { label: 'Hostel Life', key: 'Hostel Life' },
  { label: 'Academics', key: 'Academics' },
  { label: 'Rants', key: 'Rants' },
];

export default function TopicBubbles({ activeTopic, onTopicChange }) {
  return (
    <div className="px-4 mb-5">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {topics.map(topic => {
          const selected = activeTopic === topic.key || (!activeTopic && topic.key === null);
          return (
            <button
              key={topic.label}
              onClick={() => onTopicChange(topic.key)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-display font-bold whitespace-nowrap transition-all ${
                selected
                  ? 'bg-accent/10 border border-accent text-accent shadow-[0_0_15px_rgba(200,245,96,0.15)]'
                  : 'bg-transparent border border-border text-text-secondary hover:border-accent/40'
              }`}
            >
              {topic.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
