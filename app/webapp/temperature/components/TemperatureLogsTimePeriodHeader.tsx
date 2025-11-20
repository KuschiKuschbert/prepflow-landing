'use client';

interface TemperatureLogsTimePeriodHeaderProps {
  period: string;
  icon: string;
  label: string;
  logCount: number;
}

export function TemperatureLogsTimePeriodHeader({
  period,
  icon,
  label,
  logCount,
}: TemperatureLogsTimePeriodHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 shadow-lg">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white">{label}</h3>
        <p className="text-sm text-gray-400">
          {logCount} temperature reading{logCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
