'use client';

import {
  BarChart3,
  BookOpen,
  CalendarDays,
  DollarSign,
  Leaf,
  LucideIcon,
  Settings,
  Sparkles,
  Thermometer,
} from 'lucide-react';
import AppleStyleFeatures from './AppleStyleFeatures';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon; // Use Lucide icon component instead of emoji string
  screenshot: string;
  screenshotAlt: string;
  details: string[];
  colorClass: string;
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
    colorClass: 'text-landing-primary',
    cta: {
      text: 'Manage Ingredients',
      href: '/webapp/ingredients',
    },
  },
  {
    title: 'COGS Calculator',
    description: 'See costs live as you build. Get pricing recommendations instantly.',
    icon: DollarSign, // Lucide icon instead of emoji
    screenshot: '/images/cogs-calculator-screenshot.png',
    screenshotAlt: 'PrepFlow COGS Calculator showing Create Dish and Cost Analysis sections',
    details: [
      'Live cost calculations as you build recipes',
      'Automatic COGS calculation per portion',
      'Recommended pricing with food cost percentages',
      'Gross profit margin analysis',
    ],
    colorClass: 'text-landing-accent',
    cta: {
      text: 'Calculate COGS',
      href: '/webapp/cogs',
    },
  },
  {
    title: 'Recipe Builder',
    description: 'Your complete recipe library. Pricing, margins, profitability—all in one place.',
    icon: BookOpen, // Lucide icon instead of emoji
    screenshot: '/images/recipe-book-screenshot.png',
    screenshotAlt:
      'PrepFlow Recipe Builder Ingredients tab showing standardized buttons, sidebar navigation, and ingredients management interface',
    details: [
      'Complete recipe library with all your dishes',
      'Recommended pricing with food cost percentages',
      'Profit margin analysis per portion',
      'Contributing margin calculations',
      'Easy recipe editing and management',
    ],
    colorClass: 'text-landing-primary',
    cta: {
      text: 'View Recipes',
      href: '/webapp/recipes',
    },
  },
  {
    title: 'Performance Analysis',
    description: "Chef's Kiss, Hidden Gems, Bargain Buckets—know what makes money.",
    icon: BarChart3, // Lucide icon instead of emoji
    screenshot: '/images/performance-analysis-screenshot.png',
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
    colorClass: 'text-landing-secondary',
    cta: {
      text: 'Analyze Performance',
      href: '/webapp/performance',
    },
  },
  {
    title: 'Functions & Events',
    description:
      'Plan catering functions, weddings, and special events. Calendar, runsheets, and client management.',
    icon: CalendarDays,
    screenshot: '/images/functions-events-screenshot.png',
    screenshotAlt: 'PrepFlow Functions & Events showing calendar view and event planning',
    details: [
      'Calendar view for scheduling functions and events',
      'Runsheet builder with linked dishes and recipes',
      'Client and customer management',
      'Multi-day event support with day-by-day runsheets',
      'Export and print runsheets for kitchen and staff',
    ],
    colorClass: 'text-landing-accent',
    cta: {
      text: 'Plan Functions',
      href: '/webapp/functions',
    },
  },
  {
    title: 'Cleaning & Compliance',
    description:
      'Track tasks, keep records, maintain audit trails. Compliance records for health inspections.',
    icon: Sparkles, // Lucide icon instead of emoji
    screenshot: '/images/cleaning-roster-screenshot.png',
    screenshotAlt: 'PrepFlow Cleaning Roster showing cleaning areas and task management',
    details: [
      'Cleaning area management with customizable schedules',
      'Task tracking with photo verification',
      'Compliance record keeping with types and categories',
      'Audit trail for compliance records',
      'Standard task templates for quick setup',
    ],
    colorClass: 'text-landing-primary',
    cta: {
      text: 'Manage Cleaning',
      href: '/webapp/cleaning',
    },
  },
  {
    title: 'Temperature Monitoring',
    description: 'QLD-compliant monitoring with configurable thresholds and alerts.',
    icon: Thermometer, // Lucide icon instead of emoji
    screenshot: '/images/temperature-monitoring-screenshot.png',
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
    colorClass: 'text-landing-accent',
    cta: {
      text: 'Monitor Temperature',
      href: '/webapp/temperature',
    },
  },
  {
    title: 'AI Specials',
    description: 'AI-powered specials suggestions. Scrape recipes, get ideas, build your menu.',
    icon: Sparkles,
    screenshot: '/images/performance-analysis-screenshot.png',
    screenshotAlt: 'PrepFlow AI Specials showing recipe scraping and specials suggestions',
    details: [
      'AI-powered specials ideas and suggestions',
      'Recipe scraper to import from URLs',
      'Build seasonal and daily specials with ease',
      'Integrates with your recipe and menu data',
    ],
    colorClass: 'text-landing-accent',
    cta: {
      text: 'Try AI Specials',
      href: '/webapp/specials',
    },
  },
  {
    title: 'Settings & Configuration',
    description: 'Region, units, billing, account—configure everything your way.',
    icon: Settings, // Lucide icon instead of emoji
    screenshot: '/images/settings-screenshot.png',
    screenshotAlt: 'PrepFlow Settings showing region & units configuration and privacy controls',
    details: [
      'Region and unit system configuration (metric/imperial)',
      'GST calculation settings for Australian businesses',
      'Billing and subscription management',
      'Account settings and preferences',
      'Data export and account deletion options',
    ],
    colorClass: 'text-landing-secondary',
    cta: {
      text: 'Open Settings',
      href: '/webapp/settings',
    },
  },
];

export default function CloserLook() {
  return <AppleStyleFeatures features={features} sectionTitle="Take a closer look." />;
}
