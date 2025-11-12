import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import {
  BarChart3,
  BookOpen,
  Bot,
  Calculator,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  ListChecks,
  Package,
  Package2,
  Settings,
  Settings2,
  Sparkles,
  Thermometer,
  Truck,
  UtensilsCrossed,
  Wrench,
} from 'lucide-react';

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
      icon: <Icon icon={LayoutDashboard} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#29E7CD]',
      category: 'core',
    },
    {
      href: '/webapp/ingredients',
      label: t('nav.ingredients', 'Ingredients') as string,
      icon: <Icon icon={Package} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#29E7CD]',
      category: 'core',
    },
    {
      href: '/webapp/recipes',
      label: t('nav.recipes', 'Recipes') as string,
      icon: <Icon icon={BookOpen} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#3B82F6]',
      category: 'core',
    },
    {
      href: '/webapp/cogs',
      label: t('nav.cogs', 'COGS') as string,
      icon: <Icon icon={Calculator} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#D925C7]',
      category: 'core',
    },
    {
      href: '/webapp/performance',
      label: t('nav.performance', 'Performance') as string,
      icon: <Icon icon={BarChart3} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#29E7CD]',
      category: 'core',
    },
    {
      href: '/webapp/cleaning',
      label: t('nav.cleaning', 'Cleaning') as string,
      icon: <Icon icon={Sparkles} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#29E7CD]',
      category: 'operations',
    },
    {
      href: '/webapp/temperature',
      label: t('nav.temperature', 'Temperature') as string,
      icon: <Icon icon={Thermometer} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#3B82F6]',
      category: 'operations',
    },
    {
      href: '/webapp/compliance',
      label: t('nav.compliance', 'Compliance') as string,
      icon: <Icon icon={ClipboardCheck} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#D925C7]',
      category: 'operations',
    },
    {
      href: '/webapp/suppliers',
      label: t('nav.suppliers', 'Suppliers') as string,
      icon: <Icon icon={Truck} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#29E7CD]',
      category: 'operations',
    },
    {
      href: '/webapp/par-levels',
      label: t('nav.parLevels', 'Par Levels') as string,
      icon: <Icon icon={Package2} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#3B82F6]',
      category: 'inventory',
    },
    {
      href: '/webapp/order-lists',
      label: t('nav.orderLists', 'Order Lists') as string,
      icon: <Icon icon={ClipboardCheck} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#D925C7]',
      category: 'inventory',
    },
    {
      href: '/webapp/dish-sections',
      label: t('nav.dishSections', 'Dish Sections') as string,
      icon: <Icon icon={UtensilsCrossed} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#29E7CD]',
      category: 'kitchen',
    },
    {
      href: '/webapp/menu-builder',
      label: t('nav.menuBuilder', 'Menu Builder') as string,
      icon: <Icon icon={FileText} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#D925C7]',
      category: 'kitchen',
    },
    {
      href: '/webapp/prep-lists',
      label: t('nav.prepLists', 'Prep Lists') as string,
      icon: <Icon icon={ListChecks} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#3B82F6]',
      category: 'kitchen',
    },
    {
      href: '/webapp/ai-specials',
      label: t('nav.aiSpecials', 'AI Specials') as string,
      icon: <Icon icon={Bot} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#29E7CD]',
      category: 'tools',
    },
    {
      href: '/webapp/gadgets',
      label: t('nav.gadgets', 'Kitchen Gadgets') as string,
      icon: <Icon icon={Wrench} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#D925C7]',
      category: 'kitchen',
    },
    {
      href: '/webapp/setup',
      label: t('nav.setup', 'Setup') as string,
      icon: <Icon icon={Settings} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#29E7CD]',
      category: 'tools',
    },
    {
      href: '/webapp/settings',
      label: t('nav.settings', 'Settings') as string,
      icon: <Icon icon={Settings2} size="sm" className="text-current" aria-hidden={true} />,
      color: 'text-[#3B82F6]',
      category: 'tools',
    },
  ];
}
