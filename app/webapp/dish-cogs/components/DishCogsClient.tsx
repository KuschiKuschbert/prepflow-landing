'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { DishCogsHeader } from './DishCogsHeader';
import { DishSelector } from './DishSelector';
import { DishCogsTable } from './DishCogsTable';
import { PricingTool } from '../../cogs/components/PricingTool';
import { useDishCogsCalculations } from '../hooks/useDishCogsCalculations';
import { usePricing } from '../../cogs/hooks/usePricing';

export default function DishCogsClient() {
  const {
    selectedDish,
    setSelectedDish,
    calculations,
    loading,
    editingIngredient,
    editQuantity,
    setEditQuantity,
    handleEditIngredient,
    handleSaveEdit,
    handleCancelEdit,
    totalCOGS,
  } = useDishCogsCalculations();

  const costPerDish = totalCOGS;

  const {
    targetGrossProfit,
    pricingStrategy,
    pricingCalculation,
    allStrategyPrices,
    setTargetGrossProfit,
    setPricingStrategy,
  } = usePricing(costPerDish);

  if (loading && !selectedDish) {
    return <PageSkeleton />;
  }

  return (
    <>
      <DishCogsHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Dish Selection */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-[#1f1f1f] p-4 shadow sm:p-6">
            <h2 className="mb-4 text-lg font-semibold sm:text-xl">Dish Selection</h2>
            <DishSelector selectedDish={selectedDish} onDishSelect={setSelectedDish} />

            {selectedDish && (
              <div className="mt-4 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
                <h3 className="mb-2 text-sm font-semibold text-white">{selectedDish.dish_name}</h3>
                {selectedDish.description && (
                  <p className="text-xs text-gray-400">{selectedDish.description}</p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Current Price:</span>
                  <span className="text-sm font-bold text-[#29E7CD]">
                    ${selectedDish.selling_price.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - COGS Calculation */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-[#1f1f1f] p-4 shadow sm:p-6">
            <h2 className="mb-4 text-lg font-semibold sm:text-xl">Cost Analysis</h2>

            {selectedDish ? (
              <>
                {loading ? (
                  <div className="py-12 text-center text-gray-400">Loading cost breakdown...</div>
                ) : (
                  <>
                    <DishCogsTable
                      calculations={calculations}
                      editingIngredient={editingIngredient}
                      editQuantity={editQuantity}
                      onEditIngredient={handleEditIngredient}
                      onSaveEdit={handleSaveEdit}
                      onCancelEdit={handleCancelEdit}
                      onRemoveIngredient={() => {}}
                      onEditQuantityChange={setEditQuantity}
                      totalCOGS={totalCOGS}
                    />

                    {totalCOGS > 0 && (
                      <PricingTool
                        costPerPortion={costPerDish}
                        targetGrossProfit={targetGrossProfit}
                        pricingStrategy={pricingStrategy}
                        pricingCalculation={pricingCalculation}
                        allStrategyPrices={allStrategyPrices}
                        onTargetGrossProfitChange={setTargetGrossProfit}
                        onPricingStrategyChange={setPricingStrategy}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <div className="mb-4 text-6xl text-gray-400">🍽️</div>
                <h3 className="mb-2 text-lg font-medium text-white">Select a Dish</h3>
                <p className="text-gray-500">
                  Choose a dish to see its complete cost breakdown including all recipes and
                  standalone ingredients.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
