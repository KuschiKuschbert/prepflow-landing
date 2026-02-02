/**
 * Menu Item Description AI API Endpoint
 *
 * Generates AI-powered menu descriptions for dishes and recipes
 */

import type { MenuItem } from '@/lib/types/menu-builder';
import { generateAIResponse } from '@/lib/ai/ai-service';
import { buildMenuItemDescriptionPrompt } from '@/lib/ai/prompts/menu-item-description';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const menuItemDescriptionSchema = z
  .object({
    menuItem: z.unknown(), // MenuItem is complex, type check in logic
    ingredients: z.array(z.unknown()).optional(),
    countryCode: z.string().optional(),
  })
  .refine(data => data.menuItem !== undefined && data.menuItem !== null, {
    message: 'menuItem is required',
    path: ['menuItem'],
  });

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
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[AI Menu Item Description] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = menuItemDescriptionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { menuItem, ingredients, countryCode } = validationResult.data as {
      menuItem: MenuItem;
      ingredients?: unknown[];
      countryCode?: string;
    };

    // Try AI first
    try {
      const prompt = buildMenuItemDescriptionPrompt(
        menuItem,
        ingredients as Record<string, unknown>[],
      );
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
