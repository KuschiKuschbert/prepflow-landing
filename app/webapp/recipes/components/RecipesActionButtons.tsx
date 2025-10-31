interface RecipesActionButtonsProps {
  showAddForm: boolean;
  onToggleAddForm: () => void;
  onRefresh: () => void;
}

export function RecipesActionButtons({
  showAddForm,
  onToggleAddForm,
  onRefresh,
}: RecipesActionButtonsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <button
        onClick={onToggleAddForm}
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
      >
        {showAddForm ? 'Cancel' : '+ Add Manual Recipe'}
      </button>
      <a
        href="/webapp/cogs"
        className="rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 hover:shadow-xl"
      >
        Create Recipe from COGS
      </a>
      <button
        onClick={onRefresh}
        className="rounded-2xl bg-gradient-to-r from-[#D925C7] to-[#3B82F6] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 hover:shadow-xl"
      >
        🔄 Refresh Recipes
      </button>
    </div>
  );
}
