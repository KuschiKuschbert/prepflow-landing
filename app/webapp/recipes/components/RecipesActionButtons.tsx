interface RecipesActionButtonsProps {
  onRefresh: () => void;
}

export function RecipesActionButtons({ onRefresh }: RecipesActionButtonsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <a
        href="/webapp/cogs"
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
      >
        Add Recipe
      </a>
      <button
        onClick={onRefresh}
        className="rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 hover:shadow-xl"
      >
        🔄 Refresh Recipes
      </button>
    </div>
  );
}
