'use client';

import { useState } from 'react';
import { RecipeBookTabs } from './RecipeBookTabs';
import RecipesClient from './RecipesClient';
import DishesClient from './DishesClient';

export function RecipeBookContent() {
  const [activeTab, setActiveTab] = useState<'recipes' | 'dishes'>('recipes');

  return (
    <div>
      <RecipeBookTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'recipes' ? <RecipesClient /> : <DishesClient />}
    </div>
  );
}
