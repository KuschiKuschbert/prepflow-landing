export function RecipeBookDescription() {
  return (
    <div className="mb-6 rounded-xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-4 sm:p-6">
      <h2 className="mb-2 text-lg font-semibold text-white">How Recipe Book Works</h2>
      <div className="grid gap-4 text-sm text-gray-300 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-medium text-[#3B82F6]">✍️ Manual Recipes</h3>
          <p>
            Add recipes manually with instructions and portion counts. Perfect for documenting
            cooking methods and procedures.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-medium text-[#29E7CD]">📊 From COGS Calculations</h3>
          <p>
            Create cost calculations in the COGS screen, then save them as recipes. These recipes
            include all ingredient costs and portion calculations.
          </p>
        </div>
      </div>
    </div>
  );
}
