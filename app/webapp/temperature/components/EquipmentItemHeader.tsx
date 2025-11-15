'use client';

interface EquipmentItemHeaderProps {
  name: string;
  equipmentType: string;
  location: string | null;
  typeIcon: string;
  typeLabel: string;
}

export function EquipmentItemHeader({
  name,
  equipmentType,
  location,
  typeIcon,
  typeLabel,
}: EquipmentItemHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 tablet:flex-row tablet:items-start tablet:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 shadow-lg">
          <span className="text-3xl">{typeIcon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate text-xl font-bold text-white">{name}</h3>
          <p className="mb-2 text-sm font-medium text-gray-400">{typeLabel}</p>
          {location && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span>📍</span>
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
