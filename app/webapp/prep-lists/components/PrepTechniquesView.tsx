'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChevronDown, ChevronUp, Scissors, Droplets, Clock, Flame, Sparkles } from 'lucide-react';
import type { PrepTechniquesSection } from '../types';

interface PrepTechniquesViewProps {
  prepTechniques: PrepTechniquesSection;
}

export function PrepTechniquesView({ prepTechniques }: PrepTechniquesViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['cutShapes']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const hasContent =
    prepTechniques.cutShapes.length > 0 ||
    prepTechniques.sauces.length > 0 ||
    prepTechniques.marinations.length > 0 ||
    prepTechniques.preCookingSteps.length > 0 ||
    prepTechniques.specialTechniques.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
        <Icon icon={Sparkles} size="md" className="text-[#29E7CD]" aria-hidden={true} />
        Prep Techniques
      </h3>

      {/* Cut Shapes */}
      {prepTechniques.cutShapes.length > 0 && (
        <PrepTechniqueSection
          title="Cut Shapes"
          icon={Scissors}
          isExpanded={expandedSections.has('cutShapes')}
          onToggle={() => toggleSection('cutShapes')}
        >
          <div className="space-y-2">
            {prepTechniques.cutShapes.map((cs, index) => (
              <div key={index} className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white">{cs.ingredient}</span>
                    <span className="ml-2 text-sm text-[#29E7CD]">{cs.shape}</span>
                  </div>
                  {cs.recipes.length > 0 && (
                    <span className="text-xs text-gray-400">
                      {cs.recipes.length} {cs.recipes.length === 1 ? 'recipe' : 'recipes'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </PrepTechniqueSection>
      )}

      {/* Sauces */}
      {prepTechniques.sauces.length > 0 && (
        <PrepTechniqueSection
          title="Sauces & Dressings"
          icon={Droplets}
          isExpanded={expandedSections.has('sauces')}
          onToggle={() => toggleSection('sauces')}
        >
          <div className="space-y-3">
            {prepTechniques.sauces.map((sauce, index) => (
              <div key={index} className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
                <h4 className="font-semibold text-white">{sauce.name}</h4>
                {sauce.ingredients.length > 0 && (
                  <p className="mt-1 text-sm text-gray-400">
                    Ingredients: {sauce.ingredients.join(', ')}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-300">{sauce.instructions}</p>
              </div>
            ))}
          </div>
        </PrepTechniqueSection>
      )}

      {/* Marinations */}
      {prepTechniques.marinations.length > 0 && (
        <PrepTechniqueSection
          title="Marinations"
          icon={Clock}
          isExpanded={expandedSections.has('marinations')}
          onToggle={() => toggleSection('marinations')}
        >
          <div className="space-y-2">
            {prepTechniques.marinations.map((marination, index) => (
              <div key={index} className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="font-medium text-white">{marination.ingredient}</span>
                    <p className="mt-1 text-sm text-gray-300">{marination.method}</p>
                    {marination.duration && (
                      <p className="mt-1 text-xs text-gray-400">Duration: {marination.duration}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PrepTechniqueSection>
      )}

      {/* Pre-Cooking Steps */}
      {prepTechniques.preCookingSteps.length > 0 && (
        <PrepTechniqueSection
          title="Pre-Cooking Steps"
          icon={Flame}
          isExpanded={expandedSections.has('preCookingSteps')}
          onToggle={() => toggleSection('preCookingSteps')}
        >
          <div className="space-y-2">
            {prepTechniques.preCookingSteps.map((step, index) => (
              <div key={index} className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white">{step.ingredient}</span>
                    <p className="mt-1 text-sm text-gray-300">{step.step}</p>
                  </div>
                  {step.recipes.length > 0 && (
                    <span className="text-xs text-gray-400">
                      {step.recipes.length} {step.recipes.length === 1 ? 'recipe' : 'recipes'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </PrepTechniqueSection>
      )}

      {/* Special Techniques */}
      {prepTechniques.specialTechniques.length > 0 && (
        <PrepTechniqueSection
          title="Special Techniques"
          icon={Sparkles}
          isExpanded={expandedSections.has('specialTechniques')}
          onToggle={() => toggleSection('specialTechniques')}
        >
          <div className="space-y-2">
            {prepTechniques.specialTechniques.map((technique, index) => (
              <div key={index} className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
                <p className="font-medium text-white">{technique.description}</p>
                {technique.details && (
                  <p className="mt-1 text-sm text-gray-300">{technique.details}</p>
                )}
                {technique.recipes.length > 0 && (
                  <p className="mt-2 text-xs text-gray-400">
                    Used in: {technique.recipes.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </PrepTechniqueSection>
      )}
    </div>
  );
}

interface PrepTechniqueSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function PrepTechniqueSection({
  title,
  icon: IconComponent,
  isExpanded,
  onToggle,
  children,
}: PrepTechniqueSectionProps) {
  return (
    <div className="rounded-xl border border-[#29E7CD]/20 bg-[#29E7CD]/5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#29E7CD]/10"
      >
        <div className="flex items-center gap-3">
          <IconComponent className="h-5 w-5 text-[#29E7CD]" />
          <span className="font-semibold text-white">{title}</span>
        </div>
        <Icon
          icon={isExpanded ? ChevronUp : ChevronDown}
          size="sm"
          className="text-[#29E7CD]"
          aria-hidden={true}
        />
      </button>
      {isExpanded && <div className="border-t border-[#29E7CD]/20 p-4">{children}</div>}
    </div>
  );
}

