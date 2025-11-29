'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import {
  BarChart3,
  Bot,
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  ListChecks,
  Package2,
  Sparkles,
  Thermometer,
  Truck,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import type { WorkflowType } from '@/lib/workflow/preferences';
import { useEffect, useState, useMemo } from 'react';
import { useAdaptiveNavSettings } from '@/lib/navigation-optimization/store';
import { optimizeNavigationItems } from '@/lib/navigation-optimization/optimizer';

export interface NavigationItemConfig {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  category?: string;
}

/**
 * Get category for a navigation item based on workflow type.
 *
 * @param {string} href - Navigation item href
 * @param {WorkflowType} workflow - Current workflow type
 * @returns {string} Category name for the item
 */
function getCategoryForWorkflow(href: string, workflow: WorkflowType): string {
  const categoryMap: Record<WorkflowType, Record<string, string>> = {
    'daily-operations': {
      '/webapp': 'primary',
      '/webapp/recipes': 'primary',
      '/webapp/performance': 'primary',
      '/webapp/prep-lists': 'primary',
      '/webapp/temperature': 'primary',
      '/webapp/cleaning': 'kitchen',
      '/webapp/compliance': 'kitchen',
      '/webapp/suppliers': 'inventory',
      '/webapp/par-levels': 'inventory',
      '/webapp/order-lists': 'inventory',
      '/webapp/sections': 'more',
      '/webapp/employees': 'more',
      '/webapp/ai-specials': 'more',
      '/webapp/guide': 'more',
    },
    'setup-planning-operations': {
      '/webapp': 'primary',
      '/webapp/recipes': 'primary',
      '/webapp/performance': 'primary',
      '/webapp/prep-lists': 'primary',
      '/webapp/temperature': 'primary',
      '/webapp/cleaning': 'kitchen',
      '/webapp/compliance': 'kitchen',
      '/webapp/suppliers': 'inventory',
      '/webapp/par-levels': 'inventory',
      '/webapp/order-lists': 'inventory',
      '/webapp/sections': 'more',
      '/webapp/employees': 'more',
      '/webapp/ai-specials': 'more',
      '/webapp/guide': 'more',
    },
    'menu-first': {
      '/webapp': 'primary',
      '/webapp/recipes': 'primary',
      '/webapp/performance': 'primary',
      '/webapp/prep-lists': 'primary',
      '/webapp/temperature': 'primary',
      '/webapp/cleaning': 'kitchen',
      '/webapp/compliance': 'kitchen',
      '/webapp/suppliers': 'inventory',
      '/webapp/par-levels': 'inventory',
      '/webapp/order-lists': 'inventory',
      '/webapp/sections': 'more',
      '/webapp/employees': 'more',
      '/webapp/ai-specials': 'more',
      '/webapp/guide': 'more',
    },
  };

  return categoryMap[workflow][href] || 'other';
}

/**
 * Hook to get navigation items organized by workflow.
 * Applies adaptive optimization when enabled.
 *
 * @param {WorkflowType} workflow - Current workflow type
 * @returns {NavigationItemConfig[]} Array of navigation items with categories
 */
export function useNavigationItems(
  workflow: WorkflowType = 'daily-operations',
): NavigationItemConfig[] {
  const { t } = useTranslation();
  const { settings } = useAdaptiveNavSettings();
  const [optimizedItems, setOptimizedItems] = useState<NavigationItemConfig[] | null>(null);

  const baseItems: Omit<NavigationItemConfig, 'category'>[] = useMemo(
    () => [
      {
        href: '/webapp',
        label: t('nav.dashboard', 'Dashboard') as string,
        icon: <Icon icon={LayoutDashboard} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#29E7CD]',
      },
      {
        href: '/webapp/recipes',
        label: t('nav.dishesAndRecipes', 'Dishes & Recipes') as string,
        icon: <Icon icon={UtensilsCrossed} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#29E7CD]',
      },
      {
        href: '/webapp/performance',
        label: t('nav.performance', 'Performance') as string,
        icon: <Icon icon={BarChart3} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#29E7CD]',
      },
      {
        href: '/webapp/temperature',
        label: t('nav.temperature', 'Temperature') as string,
        icon: <Icon icon={Thermometer} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#3B82F6]',
      },
      {
        href: '/webapp/prep-lists',
        label: t('nav.prepLists', 'Prep Lists') as string,
        icon: <Icon icon={ListChecks} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#3B82F6]',
      },
      {
        href: '/webapp/cleaning',
        label: t('nav.cleaning', 'Cleaning') as string,
        icon: <Icon icon={Sparkles} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#29E7CD]',
      },
      {
        href: '/webapp/compliance',
        label: t('nav.compliance', 'Compliance') as string,
        icon: <Icon icon={ClipboardCheck} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#D925C7]',
      },
      {
        href: '/webapp/suppliers',
        label: t('nav.suppliers', 'Suppliers') as string,
        icon: <Icon icon={Truck} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#29E7CD]',
      },
      {
        href: '/webapp/par-levels',
        label: t('nav.parLevels', 'Par Levels') as string,
        icon: <Icon icon={Package2} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#3B82F6]',
      },
      {
        href: '/webapp/order-lists',
        label: t('nav.orderLists', 'Order Lists') as string,
        icon: <Icon icon={ClipboardCheck} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#D925C7]',
      },
      {
        href: '/webapp/sections',
        label: t('nav.dishSections', 'Sections') as string,
        icon: <Icon icon={UtensilsCrossed} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#29E7CD]',
      },
      {
        href: '/webapp/employees',
        label: t('nav.employees', 'Kitchen Staff') as string,
        icon: <Icon icon={Users} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#29E7CD]',
      },
      {
        href: '/webapp/ai-specials',
        label: t('nav.aiSpecials', 'AI Specials') as string,
        icon: <Icon icon={Bot} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#29E7CD]',
      },
      {
        href: '/webapp/guide',
        label: t('nav.guide', 'Guide') as string,
        icon: <Icon icon={BookOpen} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[#D925C7]',
      },
    ],
    [t],
  );

  // Assign categories based on workflow
  const itemsWithCategories = useMemo(
    () =>
      baseItems.map(item => ({
        ...item,
        category: getCategoryForWorkflow(item.href, workflow),
      })),
    [workflow, baseItems],
  );

  // Apply optimization if enabled (with debouncing)
  useEffect(() => {
    if (settings.enabled && settings.selectedSections && settings.selectedSections.length > 0) {
      // Debounce optimization to avoid too frequent recalculations
      const timeoutId = setTimeout(() => {
        optimizeNavigationItems(itemsWithCategories, settings.selectedSections)
          .then(optimized => {
            setOptimizedItems(optimized);
          })
          .catch(() => {
            // Fallback to original ordering on error
            setOptimizedItems(null);
          });
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    } else {
      setOptimizedItems(null);
    }
  }, [settings.enabled, settings.selectedSections, itemsWithCategories]);

  // Return optimized items if available, otherwise return original
  return optimizedItems || itemsWithCategories;
}
