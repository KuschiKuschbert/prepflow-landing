'use client';

import AppleStyleFeatures from './AppleStyleFeatures';
import { Leaf, DollarSign, BarChart3, Sparkles, Thermometer, Settings } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: string; // Keep as string for AppleStyleFeatures compatibility
  screenshot: string;
  screenshotAlt: string;
  details: string[];
  color: string;
}

const features: Feature[] = [
  {
    title: 'Ingredients & Stock',
    description: 'Track costs, suppliers, and inventory.',
    icon: '🥬', // Keep emoji for now - AppleStyleFeatures expects string
    screenshot: '/images/ingredients-management-screenshot.png',
    screenshotAlt: 'PrepFlow Ingredients Management showing inventory tracking with costs, suppliers, and stock levels',
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
    icon: '💰',
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
    title: 'Performance Analysis',
    description: "Dynamic menu analysis with Chef's Kiss, Hidden Gem, and more.",
    icon: '📊',
    screenshot: '/images/dashboard-screenshot.png',
    screenshotAlt: 'PrepFlow Performance Analysis showing menu item classifications and profitability metrics',
    details: [
      'Dynamic profit threshold analysis',
      'Popularity-based menu item classification',
      "Chef's Kiss: High profit + High popularity",
      'Hidden Gem: High profit + Low popularity',
      'Bargain Bucket: Low profit + High popularity',
      'Burnt Toast: Low profit + Low popularity',
    ],
    color: '#3B82F6',
  },
  {
    title: 'Cleaning & Compliance',
    description: 'Track cleaning tasks and compliance records with audit trails.',
    icon: '🧹',
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
    icon: '🌡️',
    screenshot: '/images/dashboard-screenshot.png',
    screenshotAlt: 'PrepFlow Temperature Monitoring showing equipment tracking and compliance',
    details: [
      'Queensland-compliant temperature thresholds',
      'Real-time equipment monitoring',
      'Temperature log tracking and analytics',
      'Automatic alert system for violations',
      'Compliance reporting and audit trails',
    ],
    color: '#D925C7',
  },
  {
    title: 'Settings & Configuration',
    description: 'Customize region, currency, units, and privacy settings.',
    icon: '⚙️',
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
