
interface SpecialsFiltersProps {
  readyToCook: boolean;
  setReadyToCook: (val: boolean) => void;
  selectedCuisines: string[];
  toggleCuisine: (cuisine: string) => void;
  filterTags: string[];
  toggleFilterTag: (tag: string) => void;
}

const CUISINES = [
    'Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean',
    'American', 'French', 'Middle Eastern', 'Latin American',
    'Korean', 'Japanese', 'Thai', 'Chinese', 'Vegetarian'
];

const TAGS = ['Chicken', 'Beef', 'Pork', 'Fish', 'Healthy', 'Quick', 'Breakfast'];

export function SpecialsFilters({
  readyToCook,
  setReadyToCook,
  selectedCuisines,
  toggleCuisine,
  filterTags,
  toggleFilterTag
}: SpecialsFiltersProps) {
  return (
        <div className="mb-8 px-4 flex flex-col gap-4 items-center">

            {/* Inventory Controls */}
            <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-[#1f1f1f] border border-[#2a2a2a] shadow-lg shadow-black/20">
                <label className="flex items-center cursor-pointer gap-3 select-none">
                    <span className={`text-sm font-medium ${readyToCook ? 'text-landing-primary' : 'text-white/60'}`}>Strict Match (100%)</span>
                    <div className="relative">
                        <input
                        type="checkbox"
                        className="sr-only"
                        checked={readyToCook}
                        onChange={() => setReadyToCook(!readyToCook)}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${readyToCook ? 'bg-landing-primary' : 'bg-[#3a3a3a]'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${readyToCook ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                </label>
            </div>

            {/* Cuisine Filters */}
            <div className="w-full max-w-5xl overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex flex-nowrap gap-2 px-2">
                    {CUISINES.map(c => {
                        const isSelected = selectedCuisines.includes(c);
                        return (
                            <button
                                key={c}
                                onClick={() => toggleCuisine(c)}
                                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    isSelected
                                    ? 'bg-landing-primary text-white shadow-lg shadow-landing-primary/20 border-landing-primary scale-105'
                                    : 'bg-[#1f1f1f] text-white/70 hover:bg-[#2a2a2a] hover:text-white border border-[#2a2a2a]'
                                }`}
                            >
                                {c}
                            </button>
                        );
                    })}
                </div>
            </div>


            {/* Quick Filters (Proteins/Tags) */}
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
                {TAGS.map(tag => {
                    const isActive = filterTags.includes(tag);
                    return (
                        <button
                            key={tag}
                            onClick={() => toggleFilterTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                isActive
                                ? 'bg-white/10 text-white border-white/20'
                                : 'bg-transparent text-white/40 hover:text-white border border-transparent hover:border-white/10'
                            }`}
                        >
                            {tag}
                        </button>
                    )
                })}
            </div>

        </div>
  );
}
