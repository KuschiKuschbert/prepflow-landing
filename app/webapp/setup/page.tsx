'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CountrySetup from '../../../components/CountrySetup';
import { SetupProgress } from './types';
import SetupProgressComponent from './components/SetupProgress';
import EquipmentSetup from './components/EquipmentSetup';
import IngredientsSetup from './components/IngredientsSetup';
import RecipesSetup from './components/RecipesSetup';
import TestDataGenerator from './components/TestDataGenerator';
import PopulateAllCleanData from './components/PopulateAllCleanData';

export default function SetupPageRefactored() {
  // Setup completion tracking
  const [setupProgress, setSetupProgress] = useState<SetupProgress>({
    ingredients: false,
    recipes: false,
    equipment: false,
    country: false,
  });

  // Mark country setup as complete (since CountrySetup component is always rendered)
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setSetupProgress(prev => ({ ...prev, country: true }));
    }, 0);
  }, []);

  const handleProgressUpdate = (progress: SetupProgress) => {
    setSetupProgress(progress);
  };

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header with Logo */}
        <div className="mb-8">
          <div className="mb-6 flex items-center space-x-4">
            <Image
              src="/images/prepflow-logo.png"
              alt="PrepFlow Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <div className="h-8 w-px bg-[#2a2a2a]"></div>
            <div>
              <h1 className="mb-2 text-4xl font-bold text-white">🚀 PrepFlow Setup</h1>
              <p className="text-gray-400">
                Get your restaurant management system up and running in minutes
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <SetupProgressComponent setupProgress={setupProgress} />
        </div>

        {/* Setup Steps */}
        <div className="space-y-12">
          {/* Step 1: Country & Tax Setup */}
          <div>
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-center justify-center space-x-3">
                <span className="text-lg">🌍</span>
                <span className="text-sm font-semibold text-white">1. Country</span>
              </div>
              <h2 className="mb-2 text-3xl font-bold text-white">🌍 Country & Tax Configuration</h2>
              <p className="text-lg text-gray-400">
                Set up your country settings and tax rates for accurate calculations
              </p>
            </div>
            <CountrySetup />
          </div>

          {/* Step 2: Equipment Setup */}
          <div>
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-center justify-center space-x-3">
                <span className="text-lg">🌡️</span>
                <span className="text-sm font-semibold text-white">2. Equipment</span>
              </div>
              <h2 className="mb-2 text-3xl font-bold text-white">🌡️ Temperature Equipment Setup</h2>
              <p className="text-lg text-gray-400">
                Configure your fridges, freezers, and bain maries for temperature monitoring
              </p>
            </div>
            <EquipmentSetup setupProgress={setupProgress} onProgressUpdate={handleProgressUpdate} />
          </div>

          {/* Step 3: Ingredients Setup */}
          <div>
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-center justify-center space-x-3">
                <span className="text-lg">🥕</span>
                <span className="text-sm font-semibold text-white">3. Ingredients</span>
              </div>
              <h2 className="mb-2 text-3xl font-bold text-white">🥕 Ingredients Database</h2>
              <p className="text-lg text-gray-400">
                Populate your database with common kitchen ingredients and cost data
              </p>
            </div>
            <IngredientsSetup
              setupProgress={setupProgress}
              onProgressUpdate={handleProgressUpdate}
            />
          </div>

          {/* Step 4: Recipes Setup */}
          <div>
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-center justify-center space-x-3">
                <span className="text-lg">🍲</span>
                <span className="text-sm font-semibold text-white">4. Recipes</span>
              </div>
              <h2 className="mb-2 text-3xl font-bold text-white">🍲 Sample Recipes</h2>
              <p className="text-lg text-gray-400">
                Add sample recipes to get started with recipe management
              </p>
            </div>
            <RecipesSetup setupProgress={setupProgress} onProgressUpdate={handleProgressUpdate} />
          </div>

          {/* Populate All Clean Test Data */}
          <div>
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-white">
                ✨ Populate All Clean Test Data
              </h2>
              <p className="text-lg text-gray-400">
                Replace all existing data with a moderate, clear set of test data (~40 ingredients,
                ~10 recipes, suppliers, equipment, etc.)
              </p>
            </div>
            <PopulateAllCleanData />
          </div>

          {/* Test Data Generator (Optional) */}
          <div>
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-white">📊 Optional: Test Data</h2>
              <p className="text-lg text-gray-400">
                Generate sample temperature data for testing and demonstration
              </p>
            </div>
            <TestDataGenerator />
          </div>
        </div>

        {/* Completion Message */}
        {setupProgress.ingredients &&
          setupProgress.recipes &&
          setupProgress.equipment &&
          setupProgress.country && (
            <div className="mt-12 text-center">
              <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-r from-[#29E7CD]/20 to-[#3B82F6]/20 p-8">
                <div className="mb-4 text-6xl">🎉</div>
                <h2 className="mb-4 text-3xl font-bold text-white">Setup Complete!</h2>
                <p className="mb-6 text-lg text-gray-300">
                  Your PrepFlow system is ready to use. You can now start managing your recipes,
                  calculating COGS, and monitoring temperature equipment.
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="/webapp"
                    className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 hover:shadow-xl"
                  >
                    🚀 Go to Dashboard
                  </a>
                  <a
                    href="/webapp/recipes"
                    className="rounded-2xl bg-[#2a2a2a] px-8 py-4 text-lg font-medium text-white transition-all duration-200 hover:bg-[#3a3a3a]"
                  >
                    🍲 Manage Recipes
                  </a>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
