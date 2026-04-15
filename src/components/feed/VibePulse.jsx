import { Sparkles } from 'lucide-react';

export default function VibePulse({ collegeName }) {
  return (
    <div className="mx-4 mb-4 p-4 rounded-xl glass border border-border">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-sm font-semibold text-text-primary">Campus Vibe Right Now</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">😊</span>
        <span className="text-sm text-text-primary font-medium">Mostly Positive (73%)</span>
      </div>
      <div className="w-full h-2 bg-card-alt rounded-full overflow-hidden mb-3">
        <div className="h-full bg-gradient-to-r from-accent to-success rounded-full" style={{ width: '73%' }} />
      </div>
      <p className="text-xs text-text-secondary">
        Trending: "Fest prep is insane this week" · "New cafe opened near Gate 4"
      </p>
      <p className="text-[10px] text-text-tertiary mt-2">Powered by AI · Updated 5 min ago</p>
    </div>
  );
}
