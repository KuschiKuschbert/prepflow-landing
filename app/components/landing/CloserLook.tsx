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
}

const features: Feature[] = [
  {
    title: 'Ingredients & Stock',
    description: 'Track costs, suppliers, and inventory.',
    icon: Leaf, // Lucide icon instead of emoji
    screenshot: '/images/ingredients-management-screenshot.png',
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
  },
  {
    title: 'COGS Calculator',
    description: 'Build recipes with live cost calculations and pricing recommendations.',
    icon: DollarSign, // Lucide icon instead of emoji
    screenshot: '/images/cogs-calculator-screenshot.png',
    screenshotAlt: 'PrepFlow COGS Calculator showing Create Dish and Cost Analysis sections',
    details: [
      'Live cost calculations as you build recipes',
      'Automatic COGS calculation per portion',
      'Labor and overhead cost allocation',
      'Optimal pricing recommendations',
      'Gross profit margin analysis',
    ],
    color: '#D925C7',
  },
  {
    title: 'Recipe Book',
    description: 'Manage your recipe collection with pricing, margins, and profitability insights.',
    icon: BookOpen, // Lucide icon instead of emoji
    screenshot: '/images/recipe-book-screenshot.png',
    screenshotAlt:
      'PrepFlow Recipe Book showing recipes list with pricing, profit margins, and contributing margins',
    details: [
      'Complete recipe library with all your dishes',
      'Recommended pricing with food cost percentages',
      'Profit margin analysis per portion',
      'Contributing margin calculations',
      'Easy recipe editing and management',
    ],
    color: '#29E7CD',
  },
  {
    title: 'Performance Analysis',
    description: "Dynamic menu analysis with Chef's Kiss, Hidden Gem, and more.",
    icon: BarChart3, // Lucide icon instead of emoji
    screenshot: '/images/performance-analysis-screenshot.png',
    screenshotAlt:
      "PrepFlow Performance Analysis Dashboard showing KPIs, Chef's Kiss and Bargain Bucket categorization tables, popularity donut chart, scatter plot analysis, and contributing profit margin bar chart",
    details: [
      'Dynamic profit threshold analysis with real-time KPIs',
      'Popularity-based menu item classification with visual charts',
      "Chef's Kiss: High profit + High popularity (categorized in table)",
      'Hidden Gem: High profit + Low popularity (scatter plot analysis)',
      'Bargain Bucket: Low profit + High popularity (categorized in table)',
      'Burnt Toast: Low profit + Low popularity (scatter plot analysis)',
      'Comprehensive analytics with donut charts, scatter plots, and bar charts',
    ],
    color: '#3B82F6',
  },
  {
    title: 'Cleaning & Compliance',
    description: 'Track cleaning tasks and compliance records with audit trails.',
    icon: Sparkles, // Lucide icon instead of emoji
    screenshot: '/images/cleaning-roster-screenshot.png',
    screenshotAlt: 'PrepFlow Cleaning Roster showing cleaning areas and task management',
    details: [
      'Cleaning area management with schedules',
      'Task tracking with photo verification',
      'Compliance record keeping',
      'Audit trail for health inspections',
      'Automated reminders and notifications',
    ],
    color: '#29E7CD',
  },
  {
    title: 'Temperature Monitoring',
    description: 'QLD-compliant monitoring with smart thresholds and alerts.',
    icon: Thermometer, // Lucide icon instead of emoji
    screenshot: '/images/temperature-monitoring-screenshot.png',
    screenshotAlt:
      'PrepFlow Temperature Monitoring showing equipment status dashboard with color-coded cards for In Range, Out of Range, Setup Required, and No Data status',
    details: [
      'Queensland-compliant temperature thresholds',
      'Real-time equipment monitoring with status indicators',
      'Temperature log tracking and analytics',
      'Automatic alert system for violations',
      'Compliance reporting and audit trails',
      'Equipment status dashboard with visual indicators',
    ],
    color: '#D925C7',
  },
  {
    title: 'Settings & Configuration',
    description: 'Customize region, currency, units, and privacy settings.',
    icon: Settings, // Lucide icon instead of emoji
    screenshot: '/images/settings-screenshot.png',
    screenshotAlt: 'PrepFlow Settings showing region & units configuration and privacy controls',
    details: [
      'Region and unit system configuration',
      'Currency and tax settings (GST support)',
      'Privacy controls and data management',
      'User preferences and notifications',
      'Integration settings and API keys',
    ],
    color: '#3B82F6',
  },
];

export default function CloserLook() {
  return <AppleStyleFeatures features={features} sectionTitle="Take a closer look." />;
}
