interface DishesActionButtonsProps {
  onAddDish: () => void;
}

export function DishesActionButtons({ onAddDish }: DishesActionButtonsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <button
        onClick={onAddDish}
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
      >
        Add Dish
      </button>
    </div>
  );
}
