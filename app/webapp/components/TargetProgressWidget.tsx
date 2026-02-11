'use client';


interface CircularProgressProps {
  value: number; // 0-100
  label: string;
  subtitle?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  value,
  label,
  subtitle,
  size = 120,
  strokeWidth = 10,
  color = 'var(--primary)',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 glass-surface rounded-3xl premium-card-hover group">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-20"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
            strokeLinecap="round"
            className="glow-primary"
          />
        </svg>

        {/* Value Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[var(--foreground)]">{value}%</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h4 className="text-sm font-semibold text-[var(--foreground)]">{label}</h4>
        {subtitle && <p className="text-xs text-[var(--foreground-muted)]">{subtitle}</p>}
      </div>
    </div>
  );
}

export function TargetProgressWidget() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <CircularProgress
        value={25}
        label="Weekly Target"
        subtitle="25% achieved"
        color="var(--primary)"
      />
      <CircularProgress
        value={50}
        label="Monthly Target"
        subtitle="50% achieved"
        color="var(--accent)"
      />
    </div>
  );
}
