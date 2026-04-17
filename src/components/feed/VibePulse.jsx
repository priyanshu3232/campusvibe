import { Zap, TrendingUp } from 'lucide-react';

export default function VibePulse({ collegeName }) {
  return (
    <div className="mx-4 mb-5 relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-[#a8d84f] p-5 text-primary">
      <div
        aria-hidden="true"
        className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-20"
      >
        <TrendingUp className="w-32 h-32" strokeWidth={2.5} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 fill-primary" />
          <span className="font-display font-black text-sm italic uppercase tracking-wider">
            VibePulse
          </span>
        </div>
        <p className="font-medium text-sm leading-relaxed max-w-[80%]">
          Trending now: {collegeName ? `${collegeName}'s annual fest is live!` : 'Campus fests are heating up!'}{' '}
          Check out the heat.
        </p>
      </div>
    </div>
  );
}
