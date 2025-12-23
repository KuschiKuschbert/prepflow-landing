/**
 * Guide content definitions.
 * Contains all available guides organized by category.
 */

import type { Guide } from './guide-types';

export const guides: Guide[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with PrepFlow',
    category: 'onboarding',
    description: 'Learn the basics of PrepFlow and get up and running quickly.',
    icon: '🚀',
    difficulty: 'beginner',
    estimatedTime: 300, // 5 minutes
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to PrepFlow',
        description:
          'PrepFlow helps you manage your restaurant operations, from ingredients to recipes to profitability analysis.',
        format: 'screenshot',
        content: {
          screenshot: {
            image: '/images/guides/dashboard-overview.png',
            annotations: [
              {
                x: 50,
                y: 20,
                text: 'Dashboard gives you an overview of your operations',
                arrow: 'down',
              },
              {
                x: 80,
                y: 30,
                text: 'Quick actions for common tasks',
                arrow: 'left',
              },
            ],
          },
        },
      },
      {
        id: 'ingredients',
        title: 'Managing Ingredients',
        description:
          'Start by adding your ingredients. This is the foundation of your recipe and cost calculations.',
        format: 'screenshot',
        content: {
          screenshot: {
            image: '/images/guides/ingredients-page.png',
            annotations: [
              {
                x: 50,
                y: 15,
                text: 'Click "Add Ingredient" to start',
                arrow: 'down',
              },
              {
                x: 70,
                y: 40,
                text: 'Import from CSV for bulk entry',
                arrow: 'left',
              },
            ],
          },
        },
      },
      {
        id: 'recipes',
        title: 'Creating Recipes',
        description:
          'Build recipes by combining ingredients. PrepFlow automatically calculates costs.',
        format: 'screenshot',
        content: {
          screenshot: {
            image: '/images/guides/recipe-builder.png',
            annotations: [
              {
                x: 50,
                y: 25,
                text: 'Add ingredients to your recipe',
                arrow: 'down',
              },
              {
                x: 75,
                y: 50,
                text: 'See real-time cost calculation',
                arrow: 'up',
              },
            ],
          },
        },
      },
      {
        id: 'cogs',
        title: 'Understanding COGS',
        description:
          'Learn how PrepFlow calculates Cost of Goods Sold and helps you optimize pricing.',
        format: 'screenshot',
        content: {
          screenshot: {
            image: '/images/guides/cogs-calculator.png',
            annotations: [
              {
                x: 50,
                y: 30,
                text: 'COGS includes ingredient costs, labor, and overhead',
                arrow: 'down',
              },
              {
                x: 70,
                y: 60,
                text: 'Adjust pricing to hit your target margin',
                arrow: 'up',
              },
            ],
          },
        },
      },
      {
        id: 'performance',
        title: 'Performance Analysis',
        description: 'Analyze your menu profitability and identify opportunities for improvement.',
        format: 'screenshot',
        content: {
          screenshot: {
            image: '/images/guides/performance-analysis.png',
            annotations: [
              {
                x: 50,
                y: 20,
                text: 'See which items are most profitable',
                arrow: 'down',
              },
              {
                x: 30,
                y: 50,
                text: 'Identify items that need attention',
                arrow: 'right',
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'create-recipe',
    title: 'How to Create Your First Recipe',
    category: 'workflow',
    description: 'Step-by-step guide to creating a recipe with ingredients and cost calculation.',
    icon: '📝',
    difficulty: 'beginner',
    estimatedTime: 180, // 3 minutes
    steps: [
      {
        id: 'recipe-basics',
        title: 'Recipe Basics',
        description: 'Every recipe needs a name, description, and serving size.',
        format: 'screenshot',
        content: {
          screenshot: {
            image: '/images/guides/recipe-form.png',
            annotations: [
              {
                x: 50,
                y: 15,
                text: 'Give your recipe a clear, descriptive name',
                arrow: 'down',
              },
              {
                x: 50,
                y: 35,
                text: 'Add cooking instructions here',
                arrow: 'down',
              },
            ],
          },
        },
      },
      {
        id: 'add-ingredients',
        title: 'Add Ingredients',
        description: 'Search and add ingredients to your recipe. Specify quantities and units.',
        format: 'screenshot',
        content: {
          screenshot: {
            image: '/images/guides/add-ingredients.png',
            annotations: [
              {
                x: 50,
                y: 25,
                text: 'Search for ingredients by name',
                arrow: 'down',
              },
              {
                x: 70,
                y: 50,
                text: 'Set quantity and unit for each ingredient',
                arrow: 'left',
              },
            ],
          },
        },
      },
      {
        id: 'cost-calculation',
        title: 'Cost Calculation',
        description: 'PrepFlow automatically calculates the total cost based on your ingredients.',
        format: 'screenshot',
        content: {
          screenshot: {
            image: '/images/guides/recipe-cost.png',
            annotations: [
              {
                x: 50,
                y: 40,
                text: 'Total ingredient cost per serving',
                arrow: 'down',
              },
              {
                x: 75,
                y: 60,
                text: 'Cost breakdown by ingredient',
                arrow: 'up',
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'understand-cogs',
    title: 'Understanding COGS Calculation',
    category: 'workflow',
    description: 'Learn how PrepFlow calculates Cost of Goods Sold and what factors affect it.',
    icon: '💰',
    difficulty: 'intermediate',
    estimatedTime: 240, // 4 minutes
    steps: [
      {
        id: 'cogs-components',
        title: 'COGS Components',
        description:
          'COGS includes ingredient costs, labor costs, and overhead. PrepFlow helps you account for all three.',
        format: 'screenshot',
        content: {
          screenshot: {
            image: '/images/guides/cogs-breakdown.png',
            annotations: [
              {
                x: 50,
                y: 20,
                text: 'Ingredient costs from your recipes',
                arrow: 'down',
              },
              {
                x: 30,
                y: 40,
                text: 'Labor cost per serving',
                arrow: 'right',
              },
              {
                x: 70,
                y: 40,
                text: 'Overhead allocation',
                arrow: 'left',
              },
            ],
          },
        },
      },
      {
        id: 'pricing',
        title: 'Setting Prices',
        description:
          'Use COGS to set profitable prices. PrepFlow shows you the margin at different price points.',
        format: 'screenshot',
        content: {
          screenshot: {
            image: '/images/guides/pricing-tool.png',
            annotations: [
              {
                x: 50,
                y: 30,
                text: 'Enter your target selling price',
                arrow: 'down',
              },
              {
                x: 50,
                y: 60,
                text: 'See gross profit margin percentage',
                arrow: 'up',
              },
            ],
          },
        },
      },
    ],
  },
];

/**
 * Get all guides.
 */
export function getAllGuides(): Guide[] {
  return guides;
}

/**
 * Get guide by ID.
 */
export function getGuideById(id: string): Guide | undefined {
  return guides.find(guide => guide.id === id);
}

/**
 * Get guides by category.
 */
export function getGuidesByCategory(category: Guide['category']): Guide[] {
  return guides.filter(guide => guide.category === category);
}

/**
 * Search guides by title or description.
 */
export function searchGuides(query: string): Guide[] {
  const lowerQuery = query.toLowerCase();
  return guides.filter(
    guide =>
      guide.title.toLowerCase().includes(lowerQuery) ||
      guide.description.toLowerCase().includes(lowerQuery),
  );
}




