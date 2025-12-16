'use client';

import { Icon } from '@/components/ui/Icon';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { optimizeNavigationItems } from '@/lib/navigation-optimization/optimizer';
import { useAdaptiveNavSettings } from '@/lib/navigation-optimization/store';
import { useTranslation } from '@/lib/useTranslation';
import {
  BarChart3,
  BookOpen,
  Bot,
  Calendar,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  ListChecks,
  Package2,
  Settings,
  Settings2,
  Sparkles,
  Thermometer,
  Truck,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type WorkflowType = 'daily-operations' | 'setup-planning-operations' | 'menu-first';

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
      '/webapp': 'service',
      '/webapp/recipes': 'service',
      '/webapp/performance': 'service',
      '/webapp/cleaning': 'end-of-day',
      '/webapp/temperature': 'morning-prep',
      '/webapp/compliance': 'end-of-day',
      '/webapp/employees': 'tools',
      '/webapp/roster': 'operations',
      '/webapp/suppliers': 'planning',
      '/webapp/par-levels': 'planning',
      '/webapp/order-lists': 'end-of-day',
      '/webapp/sections': 'service',
      '/webapp/menu-builder': 'service',
      '/webapp/prep-lists': 'morning-prep',
      '/webapp/ai-specials': 'tools',
      '/webapp/guide': 'tools',
      '/webapp/setup': 'tools',
      '/webapp/settings': 'tools',
    },
    'setup-planning-operations': {
      '/webapp': 'analysis',
      '/webapp/recipes': 'planning',
      '/webapp/performance': 'analysis',
      '/webapp/cleaning': 'operations',
      '/webapp/temperature': 'operations',
      '/webapp/compliance': 'operations',
      '/webapp/employees': 'tools',
      '/webapp/roster': 'operations',
      '/webapp/suppliers': 'planning',
      '/webapp/par-levels': 'planning',
      '/webapp/order-lists': 'operations',
      '/webapp/sections': 'planning',
      '/webapp/menu-builder': 'planning',
      '/webapp/prep-lists': 'operations',
      '/webapp/ai-specials': 'tools',
      '/webapp/guide': 'tools',
      '/webapp/setup': 'setup',
      '/webapp/settings': 'setup',
    },
    'menu-first': {
      '/webapp': 'overview',
      '/webapp/recipes': 'menu',
      '/webapp/performance': 'menu',
      '/webapp/cleaning': 'operations',
      '/webapp/temperature': 'operations',
      '/webapp/compliance': 'operations',
      '/webapp/employees': 'tools',
      '/webapp/roster': 'operations',
      '/webapp/suppliers': 'inventory',
      '/webapp/par-levels': 'inventory',
      '/webapp/order-lists': 'inventory',
      '/webapp/sections': 'menu',
      '/webapp/menu-builder': 'menu',
      '/webapp/prep-lists': 'operations',
      '/webapp/ai-specials': 'tools',
      '/webapp/guide': 'tools',
      '/webapp/setup': 'tools',
      '/webapp/settings': 'tools',
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

  // Check feature flags
  const kitchenStaffEnabled = useFeatureFlag('kitchen-staff');
  const rosterEnabled = useFeatureFlag('roster');

  const baseItems: Omit<NavigationItemConfig, 'category'>[] = useMemo(() => {
    const allItems = [
      {
        href: '/webapp',
        label: t('nav.dashboard', 'Dashboard') as string,
        icon: <Icon icon={LayoutDashboard} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--primary)]',
      },
      {
        href: '/webapp/recipes',
        label: t('nav.dishesAndRecipes', 'Dishes & Recipes') as string,
        icon: <Icon icon={UtensilsCrossed} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--primary)]',
      },
      {
        href: '/webapp/performance',
        label: t('nav.performance', 'Performance') as string,
        icon: <Icon icon={BarChart3} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--primary)]',
      },
      {
        href: '/webapp/cleaning',
        label: t('nav.cleaning', 'Cleaning') as string,
        icon: <Icon icon={Sparkles} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--primary)]',
      },
      {
        href: '/webapp/temperature',
        label: t('nav.temperature', 'Temperature') as string,
        icon: <Icon icon={Thermometer} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--color-info)]',
      },
      {
        href: '/webapp/compliance',
        label: t('nav.compliance', 'Compliance') as string,
        icon: <Icon icon={ClipboardCheck} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--accent)]',
      },
      {
        href: '/webapp/employees',
        label: t('nav.employees', 'Kitchen Staff') as string,
        icon: <Icon icon={Users} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--primary)]',
      },
      {
        href: '/webapp/roster',
        label: t('nav.roster', 'Roster') as string,
        icon: <Icon icon={Calendar} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--color-info)]',
      },
      {
        href: '/webapp/suppliers',
        label: t('nav.suppliers', 'Suppliers') as string,
        icon: <Icon icon={Truck} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--primary)]',
      },
      {
        href: '/webapp/par-levels',
        label: t('nav.parLevels', 'Par Levels') as string,
        icon: <Icon icon={Package2} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--color-info)]',
      },
      {
        href: '/webapp/order-lists',
        label: t('nav.orderLists', 'Order Lists') as string,
        icon: <Icon icon={ClipboardCheck} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--accent)]',
      },
      {
        href: '/webapp/sections',
        label: t('nav.dishSections', 'Sections') as string,
        icon: <Icon icon={UtensilsCrossed} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--primary)]',
      },
      {
        href: '/webapp/menu-builder',
        label: t('nav.menuBuilder', 'Menu Builder') as string,
        icon: <Icon icon={FileText} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--accent)]',
      },
      {
        href: '/webapp/prep-lists',
        label: t('nav.prepLists', 'Prep Lists') as string,
        icon: <Icon icon={ListChecks} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--color-info)]',
      },
      {
        href: '/webapp/ai-specials',
        label: t('nav.aiSpecials', 'AI Specials') as string,
        icon: <Icon icon={Bot} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--primary)]',
      },
      {
        href: '/webapp/guide',
        label: t('nav.guide', 'Guide') as string,
        icon: <Icon icon={BookOpen} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--accent)]',
      },
      {
        href: '/webapp/setup',
        label: t('nav.setup', 'Setup') as string,
        icon: <Icon icon={Settings} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--primary)]',
      },
      {
        href: '/webapp/settings',
        label: t('nav.settings', 'Settings') as string,
        icon: <Icon icon={Settings2} size="sm" className="text-current" aria-hidden={true} />,
        color: 'text-[var(--color-info)]',
      },
    ];

    // Filter items based on feature flags
    return allItems.filter(item => {
      if (item.href === '/webapp/employees' && !kitchenStaffEnabled) {
        return false;
      }
      if (item.href === '/webapp/roster' && !rosterEnabled) {
        return false;
      }
      return true;
    });
  }, [t, kitchenStaffEnabled, rosterEnabled]);

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
