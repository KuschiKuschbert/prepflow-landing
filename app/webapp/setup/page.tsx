'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Rocket,
  Thermometer,
  Globe,
  Sparkles,
  AlertTriangle,
  PartyPopper,
  ChefHat,
} from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import CountrySetup from '../../../components/CountrySetup';
import { SetupProgress } from './types';
import SetupProgressComponent from './components/SetupProgress';
import EquipmentSetup from './components/EquipmentSetup';
import PopulateAllCleanData from './components/PopulateAllCleanData';
import ResetSelfDataCard from './components/ResetSelfDataCard';

export default function SetupPageRefactored() {
  // Setup completion tracking
  const [setupProgress, setSetupProgress] = useState<SetupProgress>({
    ingredients: false,
    recipes: false,
    equipment: false,
    country: false,
  });

  // Track if clean data has been populated
  const [dataPopulated, setDataPopulated] = useState(false);

  // Mark country setup as complete (since CountrySetup component is always rendered)
  useEffect(() => {
    setTimeout(() => {
      setSetupProgress(prev => ({ ...prev, country: true }));
    }, 0);
  }, []);

  // When clean data is populated, mark ingredients and recipes as complete
  useEffect(() => {
    if (dataPopulated) {
      setSetupProgress(prev => ({
        ...prev,
        ingredients: true,
        recipes: true,
      }));
    }
  }, [dataPopulated]);

  const handleProgressUpdate = (progress: SetupProgress) => {
    setSetupProgress(progress);
  };

  const handleDataPopulated = () => {
    setDataPopulated(true);
  };

  return (
    <div className="min-h-screen bg-transparent p-4 tablet:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header with Logo */}
        <div className="mb-8">
          <div className="mb-6 flex items-center space-x-4">
            <Image
              src="/images/prepflow-logo.svg"
              alt="PrepFlow Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <div className="h-8 w-px bg-[#2a2a2a]"></div>
            <div>
              <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold text-white">
                <Rocket className="h-8 w-8" />
                PrepFlow Setup
              </h1>
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
                <Icon icon={Globe} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                <span className="text-sm font-semibold text-white">1. Country</span>
              </div>
              <h2 className="mb-2 flex items-center gap-2 text-3xl font-bold text-white">
                <Icon icon={Globe} size="lg" className="text-[#29E7CD]" aria-hidden={true} />
                Country & Tax Configuration
              </h2>
              <p className="text-lg text-gray-400">
                Set up your country settings and tax rates for accurate calculations
              </p>
            </div>
            <CountrySetup />
          </div>

          {/* Step 2: Populate All Clean Test Data (Main Method) */}
          <div>
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-center justify-center space-x-3">
                <Icon icon={Sparkles} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                <span className="text-sm font-semibold text-white">2. Test Data</span>
              </div>
              <h2 className="mb-2 flex items-center gap-2 text-3xl font-bold text-white">
                <Icon icon={Sparkles} size="lg" className="text-[#29E7CD]" aria-hidden={true} />
                Populate Clean Test Data
              </h2>
              <p className="text-lg text-gray-400">
                This is the one and only way we auto-create data in the app. It will replace any
                existing data with a tidy, linked demo set (ingredients, recipes, suppliers,
                equipment, cleaning, compliance).
              </p>
            </div>
            <PopulateAllCleanData onDataPopulated={handleDataPopulated} />
          </div>

          {/* Step 3: Equipment Setup (Optional - for adding more equipment manually) */}
          <div>
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-center justify-center space-x-3">
                <Icon icon={Thermometer} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                <span className="text-sm font-semibold text-gray-500">3. Equipment (Optional)</span>
              </div>
              <h2 className="mb-2 flex items-center gap-2 text-3xl font-bold text-white">
                <Icon icon={Thermometer} size="lg" className="text-[#29E7CD]" aria-hidden={true} />
                Temperature Equipment Setup
              </h2>
              <p className="text-lg text-gray-400">
                Add your temperature monitoring equipment or configure existing equipment
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Tip: Basic equipment (~18 pieces) is created when you populate test data above
              </p>
            </div>
            <EquipmentSetup setupProgress={setupProgress} onProgressUpdate={handleProgressUpdate} />
          </div>

          {/* Danger Zone: Self reset */}
          <div>
            <div className="mb-6 text-center">
              <div className="mb-3 flex items-center justify-center space-x-3">
                <Icon
                  icon={AlertTriangle}
                  size="md"
                  className="text-yellow-400"
                  aria-hidden={true}
                />
                <span className="text-sm font-semibold text-white">Danger zone</span>
              </div>
              <h2 className="mb-2 text-3xl font-bold text-white">Reset your data</h2>
              <p className="text-lg text-gray-400">
                Delete your lists and shares. Does not affect global recipes/ingredients.
              </p>
            </div>
            <ResetSelfDataCard defaultReseed={true} />
          </div>
        </div>

        {/* Completion Message */}
        {setupProgress.ingredients &&
          setupProgress.recipes &&
          setupProgress.equipment &&
          setupProgress.country && (
            <div className="mt-12 text-center">
              <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-r from-[#29E7CD]/20 to-[#3B82F6]/20 p-8">
                <div className="mb-4 flex justify-center">
                  <Icon
                    icon={PartyPopper}
                    size="xl"
                    className="text-[#29E7CD]"
                    aria-hidden={true}
                  />
                </div>
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
                    <Icon
                      icon={Rocket}
                      size="sm"
                      className="mr-1 inline text-white"
                      aria-hidden={true}
                    />{' '}
                    Go to Dashboard
                  </a>
                  <a
                    href="/webapp/recipes"
                    className="rounded-2xl bg-[#2a2a2a] px-8 py-4 text-lg font-medium text-white transition-all duration-200 hover:bg-[#3a3a3a]"
                  >
                    <Icon
                      icon={ChefHat}
                      size="sm"
                      className="mr-1 inline text-[#29E7CD]"
                      aria-hidden={true}
                    />{' '}
                    Manage Recipes
                  </a>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
