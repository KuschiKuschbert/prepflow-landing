import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageData, prompt } = body;

    if (!userId || !imageData) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'User ID and image data are required',
        },
        { status: 400 },
      );
    }

    // For now, we'll simulate AI processing
    // In a real implementation, you would integrate with OpenAI Vision API or similar
    const aiResponse = await processImageWithAI(imageData, prompt);

    // Save the AI analysis to database
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    const { data: aiRecord, error: aiError } = await supabaseAdmin
      .from('ai_specials_ingredients')
      .insert({
        user_id: userId,
        image_data: imageData,
        prompt: prompt,
        ai_response: aiResponse,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (aiError) {
      console.error('Error saving AI analysis:', aiError);
      return NextResponse.json(
        {
          error: 'Failed to save AI analysis',
          message: 'Could not save AI processing results',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'AI specials generated successfully',
      data: {
        aiRecord,
        suggestions: aiResponse.suggestions,
        ingredients: aiResponse.ingredients,
      },
    });
  } catch (error) {
    console.error('AI specials API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}

async function processImageWithAI(imageData: string, prompt?: string) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock AI response - in real implementation, this would call OpenAI Vision API
  const mockIngredients = [
    'Fresh tomatoes',
    'Basil leaves',
    'Mozzarella cheese',
    'Olive oil',
    'Garlic',
    'Red onions',
    'Bell peppers',
    'Fresh herbs',
  ];

  const mockSuggestions = [
    'Caprese Salad - Perfect for showcasing fresh tomatoes and mozzarella',
    'Mediterranean Bruschetta - Great use of tomatoes, basil, and garlic',
    'Grilled Vegetable Platter - Highlight the bell peppers and onions',
    'Herb-Infused Oil - Feature the fresh herbs and olive oil',
  ];

  return {
    ingredients: mockIngredients,
    suggestions: mockSuggestions,
    confidence: 0.85,
    processing_time: 2.1,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          error: 'User ID is required',
          message: 'Please provide a valid user ID',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('ai_specials_ingredients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI specials:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch AI specials',
          message: 'Could not retrieve AI analysis data',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('AI specials API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}
