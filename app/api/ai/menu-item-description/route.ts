/**
 * Menu Item Description AI API Endpoint
 *
 * Generates AI-powered menu descriptions for dishes and recipes
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/ai-service';
import { buildMenuItemDescriptionPrompt } from '@/lib/ai/prompts/menu-item-description';
import type { MenuItem } from '@/app/webapp/menu-builder/types';
import { logger } from '@/lib/logger';

/**
 * POST /api/ai/menu-item-description
 * Generate AI-powered menu item description
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {MenuItem} request.body.menuItem - Menu item (dish or recipe)
 * @param {any[]} [request.body.ingredients] - Optional ingredients list for recipes
 * @param {string} [request.body.countryCode] - Country code (default: 'AU')
 * @returns {Promise<NextResponse>} Menu item description response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { menuItem, ingredients, countryCode } = body as {
      menuItem: MenuItem;
      ingredients?: any[];
      countryCode?: string;
    };

    if (!menuItem) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Try AI first
    try {
      const prompt = buildMenuItemDescriptionPrompt(menuItem, ingredients);
      const aiResponse = await generateAIResponse(
        [
          {
            role: 'user',
            content: prompt,
          },
        ],
        countryCode || 'AU',
        {
          temperature: 0.8, // Creative but professional descriptions
          maxTokens: 150, // Short descriptions (1-2 sentences)
          useCache: true,
          cacheTTL: 24 * 60 * 60 * 1000, // 24 hour cache (menu items don't change often)
        },
      );

      if (aiResponse.content && !aiResponse.error) {
        // Clean up the response - remove any extra formatting or quotes
        let description = aiResponse.content.trim();
        // Remove surrounding quotes if present
        if (
          (description.startsWith('"') && description.endsWith('"')) ||
          (description.startsWith("'") && description.endsWith("'"))
        ) {
          description = description.slice(1, -1);
        }
        // Remove markdown formatting if present
        description = description.replace(/^\*\*|\*\*$/g, '').trim();

        return NextResponse.json({
          description,
          source: 'ai',
          cached: aiResponse.cached,
        });
      }
    } catch (aiError) {
      logger.warn('AI menu item description failed:', {
        error: aiError instanceof Error ? aiError.message : String(aiError),
        menuItemId: menuItem.id,
      });
    }

    // Fallback: Return empty string
    return NextResponse.json({
      description: '',
      source: 'fallback',
    });
  } catch (error) {
    logger.error('Menu item description error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate menu item description',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
