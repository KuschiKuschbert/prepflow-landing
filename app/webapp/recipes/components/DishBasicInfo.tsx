'use client';

interface DishBasicInfoProps {
  dishName: string;
  description: string;
  setDishName: (name: string) => void;
  setDescription: (desc: string) => void;
}

export function DishBasicInfo({
  dishName,
  description,
  setDishName,
  setDescription,
}: DishBasicInfoProps) {
  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Dish Name *
        </label>
        <input
          type="text"
          value={dishName}
          onChange={e => setDishName(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Description
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
        />
      </div>
    </>
  );
}
