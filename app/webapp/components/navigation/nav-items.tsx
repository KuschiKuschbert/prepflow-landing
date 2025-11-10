import { useTranslation } from '@/lib/useTranslation';

export interface NavigationItemConfig {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  category?: string;
}

export function useNavigationItems(): NavigationItemConfig[] {
  const { t } = useTranslation();
  return [
    {
      href: '/webapp',
      label: t('nav.dashboard', 'Dashboard') as string,
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
          />
        </svg>
      ),
      color: 'text-[#29E7CD]',
      category: 'core',
    },
    {
      href: '/webapp/ingredients',
      label: t('nav.ingredients', 'Ingredients') as string,
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      color: 'text-[#29E7CD]',
      category: 'core',
    },
    {
      href: '/webapp/recipes',
      label: t('nav.recipes', 'Recipes') as string,
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      color: 'text-[#3B82F6]',
      category: 'core',
    },
    {
      href: '/webapp/cogs',
      label: t('nav.cogs', 'COGS') as string,
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'text-[#D925C7]',
      category: 'core',
    },
    {
      href: '/webapp/performance',
      label: t('nav.performance', 'Performance') as string,
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: 'text-[#29E7CD]',
      category: 'core',
    },
    {
      href: '/webapp/cleaning',
      label: t('nav.cleaning', 'Cleaning') as string,
      icon: <span className="text-sm">🧹</span>,
      color: 'text-[#29E7CD]',
      category: 'operations',
    },
    {
      href: '/webapp/temperature',
      label: t('nav.temperature', 'Temperature') as string,
      icon: <span className="text-sm">🌡️</span>,
      color: 'text-[#3B82F6]',
      category: 'operations',
    },
    {
      href: '/webapp/compliance',
      label: t('nav.compliance', 'Compliance') as string,
      icon: <span className="text-sm">📋</span>,
      color: 'text-[#D925C7]',
      category: 'operations',
    },
    {
      href: '/webapp/suppliers',
      label: t('nav.suppliers', 'Suppliers') as string,
      icon: <span className="text-sm">🚚</span>,
      color: 'text-[#29E7CD]',
      category: 'operations',
    },
    {
      href: '/webapp/par-levels',
      label: t('nav.parLevels', 'Par Levels') as string,
      icon: <span className="text-sm">📦</span>,
      color: 'text-[#3B82F6]',
      category: 'inventory',
    },
    {
      href: '/webapp/order-lists',
      label: t('nav.orderLists', 'Order Lists') as string,
      icon: <span className="text-sm">📋</span>,
      color: 'text-[#D925C7]',
      category: 'inventory',
    },
    {
      href: '/webapp/dish-sections',
      label: t('nav.dishSections', 'Dish Sections') as string,
      icon: <span className="text-sm">🍽️</span>,
      color: 'text-[#29E7CD]',
      category: 'kitchen',
    },
    {
      href: '/webapp/prep-lists',
      label: t('nav.prepLists', 'Prep Lists') as string,
      icon: <span className="text-sm">📝</span>,
      color: 'text-[#3B82F6]',
      category: 'kitchen',
    },
    {
      href: '/webapp/ai-specials',
      label: t('nav.aiSpecials', 'AI Specials') as string,
      icon: <span className="text-sm">🤖</span>,
      color: 'text-[#29E7CD]',
      category: 'tools',
    },
    {
      href: '/webapp/gadgets',
      label: t('nav.gadgets', 'Kitchen Gadgets') as string,
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      ),
      color: 'text-[#D925C7]',
      category: 'gadgets',
    },
    {
      href: '/webapp/setup',
      label: t('nav.setup', 'Setup') as string,
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      color: 'text-[#29E7CD]',
      category: 'tools',
    },
    {
      href: '/webapp/settings',
      label: t('nav.settings', 'Settings') as string,
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      color: 'text-[#3B82F6]',
      category: 'tools',
    },
  ];
}
