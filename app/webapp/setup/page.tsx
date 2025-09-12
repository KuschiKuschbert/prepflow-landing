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

export default function SetupPageRefactored() {
  // Setup completion tracking
  const [setupProgress, setSetupProgress] = useState<SetupProgress>({
    ingredients: false,
    recipes: false,
    equipment: false,
    country: false
  });

  // Mark country setup as complete (since CountrySetup component is always rendered)
  useEffect(() => {
    setSetupProgress(prev => ({ ...prev, country: true }));
  }, []);

  const handleProgressUpdate = (progress: SetupProgress) => {
    setSetupProgress(progress);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Image
              src="/images/prepflow-logo.png"
              alt="PrepFlow Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <div className="h-8 w-px bg-[#2a2a2a]"></div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🚀 PrepFlow Setup
              </h1>
              <p className="text-gray-400">Get your restaurant management system up and running in minutes</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <SetupProgressComponent setupProgress={setupProgress} />
        </div>

        {/* Setup Steps */}
        <div className="space-y-12">
          {/* Step 1: Country & Tax Setup */}
          <div>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-lg">🌍</span>
                <span className="text-white font-semibold text-sm">1. Country</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">🌍 Country & Tax Configuration</h2>
              <p className="text-gray-400 text-lg">Set up your country settings and tax rates for accurate calculations</p>
            </div>
            <CountrySetup />
          </div>

          {/* Step 2: Equipment Setup */}
          <div>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-lg">🌡️</span>
                <span className="text-white font-semibold text-sm">2. Equipment</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">🌡️ Temperature Equipment Setup</h2>
              <p className="text-gray-400 text-lg">Configure your fridges, freezers, and bain maries for temperature monitoring</p>
            </div>
            <EquipmentSetup 
              setupProgress={setupProgress}
              onProgressUpdate={handleProgressUpdate}
            />
          </div>

          {/* Step 3: Ingredients Setup */}
          <div>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-lg">🥕</span>
                <span className="text-white font-semibold text-sm">3. Ingredients</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">🥕 Ingredients Database</h2>
              <p className="text-gray-400 text-lg">Populate your database with common kitchen ingredients and cost data</p>
            </div>
            <IngredientsSetup 
              setupProgress={setupProgress}
              onProgressUpdate={handleProgressUpdate}
            />
          </div>

          {/* Step 4: Recipes Setup */}
          <div>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-lg">🍲</span>
                <span className="text-white font-semibold text-sm">4. Recipes</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">🍲 Sample Recipes</h2>
              <p className="text-gray-400 text-lg">Add sample recipes to get started with recipe management</p>
            </div>
            <RecipesSetup 
              setupProgress={setupProgress}
              onProgressUpdate={handleProgressUpdate}
            />
          </div>

          {/* Test Data Generator (Optional) */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">📊 Optional: Test Data</h2>
              <p className="text-gray-400 text-lg">Generate sample temperature data for testing and demonstration</p>
            </div>
            <TestDataGenerator />
          </div>
        </div>

        {/* Completion Message */}
        {setupProgress.ingredients && setupProgress.recipes && setupProgress.equipment && setupProgress.country && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#29E7CD]/20 to-[#3B82F6]/20 p-8 rounded-3xl border border-[#29E7CD]/30">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-4">Setup Complete!</h2>
              <p className="text-gray-300 text-lg mb-6">
                Your PrepFlow system is ready to use. You can now start managing your recipes, 
                calculating COGS, and monitoring temperature equipment.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="/webapp"
                  className="bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-8 py-4 rounded-2xl hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
                >
                  🚀 Go to Dashboard
                </a>
                <a
                  href="/webapp/recipes"
                  className="bg-[#2a2a2a] text-white px-8 py-4 rounded-2xl hover:bg-[#3a3a3a] transition-all duration-200 font-medium text-lg"
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
