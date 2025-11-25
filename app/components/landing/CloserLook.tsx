'use client';

import AppleStyleFeatures from './AppleStyleFeatures';
import {
  Leaf,
  DollarSign,
  BarChart3,
  Sparkles,
  Thermometer,
  Settings,
  BookOpen,
  LucideIcon,
} from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon; // Use Lucide icon component instead of emoji string
  screenshot: string;
  screenshotAlt: string;
  details: string[];
  color: string;
  cta?: {
    text: string;
    href: string;
    action?: () => void; // Optional analytics tracking
  };
}

const features: Feature[] = [
  {
    title: 'Ingredients & Stock',
    description: 'Track costs, suppliers, stock. Automatic unit conversion.',
    icon: Leaf, // Lucide icon instead of emoji
    screenshot: '/images/ingredients-management-screenshot.webp',
    screenshotAlt:
      'PrepFlow Ingredients Management showing inventory tracking with costs, suppliers, and stock levels',
    details: [
      'Real-time inventory tracking with cost calculations',
      'Supplier management with price lists',
      'Par level management for optimal stock levels',
      'CSV import/export for easy data management',
      'Automatic unit conversion and normalization',
    ],
    color: '#29E7CD',
    cta: {
      text: 'Manage Ingredients',
      href: '/webapp/ingredients',
    },
  },
  {
    title: 'COGS Calculator',
    description: 'See costs live as you build. Get pricing recommendations instantly.',
    icon: DollarSign, // Lucide icon instead of emoji
    screenshot: '/images/cogs-calculator-screenshot.webp',
    screenshotAlt: 'PrepFlow COGS Calculator showing Create Dish and Cost Analysis sections',
    details: [
      'Live cost calculations as you build recipes',
      'Automatic COGS calculation per portion',
      'Labor and overhead cost allocation',
      'Optimal pricing recommendations',
      'Gross profit margin analysis',
    ],
    color: '#D925C7',
    cta: {
      text: 'Calculate COGS',
      href: '/webapp/cogs',
    },
  },
  {
    title: 'Recipe Book',
    description: 'Your complete recipe library. Pricing, margins, profitability—all in one place.',
    icon: BookOpen, // Lucide icon instead of emoji
    screenshot: '/images/recipe-book-screenshot.webp',
    screenshotAlt:
      'PrepFlow Recipe Book Ingredients tab showing standardized buttons, sidebar navigation, and ingredients management interface',
    details: [
      'Complete recipe library with all your dishes',
      'Recommended pricing with food cost percentages',
      'Profit margin analysis per portion',
      'Contributing margin calculations',
      'Easy recipe editing and management',
    ],
    color: '#29E7CD',
    cta: {
      text: 'View Recipes',
      href: '/webapp/recipes',
    },
  },
  {
    title: 'Performance Analysis',
    description: "Chef's Kiss, Hidden Gems, Bargain Buckets—know what makes money.",
    icon: BarChart3, // Lucide icon instead of emoji
    screenshot: '/images/performance-analysis-screenshot.webp',
    screenshotAlt:
      "PrepFlow Performance Analysis Dashboard showing KPIs, Chef's Kiss and Bargain Bucket categorization tables, popularity donut chart, scatter plot analysis, and contributing profit margin bar chart",
    details: [
      'Dynamic profit thresholds that adapt to your menu data',
      'Real-time KPIs and menu item classification',
      "Chef's Kiss: High profit + High popularity—keep and feature these",
      'Hidden Gem: High profit + Low popularity—market these better',
      'Bargain Bucket: Low profit + High popularity—adjust pricing or portions',
      'Burnt Toast: Low profit + Low popularity—consider removing',
      'Visual analytics with charts and scatter plots',
    ],
    color: '#3B82F6',
    cta: {
      text: 'Analyze Performance',
      href: '/webapp/performance',
    },
  },
  {
    title: 'Cleaning & Compliance',
    description: 'Track tasks, keep records, maintain audit trails. Health inspections covered.',
    icon: Sparkles, // Lucide icon instead of emoji
    screenshot: '/images/cleaning-roster-screenshot.webp',
    screenshotAlt: 'PrepFlow Cleaning Roster showing cleaning areas and task management',
    details: [
      'Cleaning area management with customizable schedules',
      'Task tracking with photo verification',
      'Compliance record keeping with types and categories',
      'Complete audit trail for health inspections',
      'Standard task templates for quick setup',
    ],
    color: '#29E7CD',
    cta: {
      text: 'Manage Cleaning',
      href: '/webapp/cleaning',
    },
  },
  {
    title: 'Temperature Monitoring',
    description: 'QLD-compliant monitoring with smart thresholds and alerts.',
    icon: Thermometer, // Lucide icon instead of emoji
    screenshot: '/images/temperature-monitoring-screenshot.webp',
    screenshotAlt:
      'PrepFlow Temperature Monitoring showing equipment status dashboard with color-coded cards for In Range, Out of Range, Setup Required, and No Data status',
    details: [
      'Queensland-compliant temperature thresholds',
      'Manual temperature logging with equipment tracking',
      'Temperature log tracking and analytics',
      'Dashboard alerts calculated on load for violations',
      'Compliance reporting and audit trails',
      'Equipment status dashboard with visual indicators',
    ],
    color: '#D925C7',
    cta: {
      text: 'Monitor Temperature',
      href: '/webapp/temperature',
    },
  },
  {
    title: 'Settings & Configuration',
    description: 'Region, units, billing, account—configure everything your way.',
    icon: Settings, // Lucide icon instead of emoji
    screenshot: '/images/settings-screenshot.webp',
    screenshotAlt: 'PrepFlow Settings showing region & units configuration and privacy controls',
    details: [
      'Region and unit system configuration (metric/imperial)',
      'GST calculation settings for Australian businesses',
      'Billing and subscription management',
      'Account settings and preferences',
      'Data export and account deletion options',
    ],
    color: '#3B82F6',
    cta: {
      text: 'Open Settings',
      href: '/webapp/settings',
    },
  },
];

export default function CloserLook() {
  return <AppleStyleFeatures features={features} sectionTitle="Take a closer look." />;
}
