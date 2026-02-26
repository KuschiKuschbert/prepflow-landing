'use client';

interface SpecialsFiltersProps {
  readyToCook: boolean;
  setReadyToCook: (val: boolean) => void;
  selectedCuisines: string[];
  toggleCuisine: (cuisine: string) => void;
  filterTags: string[];
  toggleFilterTag: (tag: string) => void;
}

const CUISINES = [
  'Italian',
  'Mexican',
  'Asian',
  'Indian',
  'Mediterranean',
  'American',
  'French',
  'Middle Eastern',
  'Latin American',
  'Korean',
  'Japanese',
  'Thai',
  'Chinese',
  'Vegetarian',
];

const TAGS = ['Chicken', 'Beef', 'Pork', 'Fish', 'Healthy', 'Quick', 'Breakfast'];

export function SpecialsFilters({
  readyToCook,
  setReadyToCook,
  selectedCuisines,
  toggleCuisine,
  filterTags,
  toggleFilterTag,
}: SpecialsFiltersProps) {
  return (
    <div className="mb-8 flex flex-col items-center gap-4 px-4">
      {/* Inventory Controls */}
      <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg shadow-black/20">
        <label className="flex cursor-pointer items-center gap-3 select-none">
          <span
            className={`text-sm font-medium ${readyToCook ? 'text-landing-primary' : 'text-white/60'}`}
          >
            Strict Match (100%)
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={readyToCook}
              onChange={() => setReadyToCook(!readyToCook)}
            />
            <div
              className={`block h-6 w-10 rounded-full transition-colors ${readyToCook ? 'bg-landing-primary' : 'bg-[#3a3a3a]'}`}
            ></div>
            <div
              className={`dot bg-foreground absolute top-1 left-1 h-4 w-4 rounded-full transition-transform ${readyToCook ? 'translate-x-4 transform' : ''}`}
            ></div>
          </div>
        </label>
      </div>

      {/* Cuisine Filters */}
      <div className="scrollbar-hide w-full max-w-5xl overflow-x-auto pb-4">
        <div className="flex flex-nowrap gap-2 px-2">
          {CUISINES.map(c => {
            const isSelected = selectedCuisines.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCuisine(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-landing-primary shadow-landing-primary/20 border-landing-primary scale-105 text-white shadow-lg'
                    : 'border border-[#2a2a2a] bg-[#1f1f1f] text-white/70 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Filters (Proteins/Tags) */}
      <div className="flex max-w-4xl flex-wrap justify-center gap-2">
        {TAGS.map(tag => {
          const isActive = filterTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleFilterTag(tag)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? 'border-white/20 bg-white/10 text-white'
                  : 'border border-transparent bg-transparent text-white/40 hover:border-white/10 hover:text-white'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
