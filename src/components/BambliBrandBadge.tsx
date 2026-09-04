interface BambliBrandBadgeProps {
  size?: number;
  className?: string;
  showTagline?: boolean;
}

export function BambliBrandBadge({
  size = 48,
  className = '',
}: BambliBrandBadgeProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/assets/bambli-badge.svg"
        alt="Bambli - Big Learning for Little Minds"
        className="w-full h-full object-contain select-none filter drop-shadow-[2px_3px_0px_rgba(0,0,0,0.9)]"
        referrerPolicy="no-referrer"
        draggable={false}
      />
    </div>
  );
}

