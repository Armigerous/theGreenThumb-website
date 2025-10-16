import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/ai/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { searchDatabaseForPlant, findSimilarPlants } from '@/lib/db/plant-identification';

// Reason: Define schema for basic AI plant identification results
const AIPlantIdentificationSchema = z.object({
  results: z.array(z.object({
    name: z.string(),
    scientific_name: z.string(),
    confidence: z.number().min(0).max(1),
    description: z.string(),
    careInstructions: z.string().optional(),
    common_names: z.array(z.string()).optional(),
  }))
});

type AIPlantResult = z.infer<typeof AIPlantIdentificationSchema>['results'][0];

// Reason: Handle both image and text-based plant identification requests with database integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, image, description } = body;

    if (!type || (type !== 'image' && type !== 'description')) {
      return NextResponse.json(
        { error: 'Invalid request type. Must be "image" or "description"' },
        { status: 400 }
      );
    }

    let aiResults: AIPlantResult[] = [];

    if (type === 'image' && image) {
      // Reason: Handle image-based plant identification using OpenAI Vision
      aiResults = await identifyPlantFromImage(image);
    } else if (type === 'description' && description) {
      // Reason: Handle text-based plant identification using AI
      aiResults = await identifyPlantFromDescription(description);
    } else {
      return NextResponse.json(
        { error: 'Missing required data for identification' },
        { status: 400 }
      );
    }

    // Reason: Enhance AI results with database information
    const enhancedResults = await enhanceResultsWithDatabase(aiResults);

    return NextResponse.json({ results: enhancedResults });
  } catch (error) {
    console.error('Plant identification error:', error);
    return NextResponse.json(
      { error: 'Failed to identify plant' },
      { status: 500 }
    );
  }
}

// Reason: Use OpenAI Vision API for image-based plant identification
async function identifyPlantFromImage(imageBase64: string): Promise<AIPlantResult[]> {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: AIPlantIdentificationSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this plant image and identify the plant species. Provide:
1. The most likely plant identification with high confidence (0.8-1.0)
2. Alternative possibilities with lower confidence (0.5-0.8)
3. Detailed descriptions of the plant's characteristics
4. Care instructions if it's a common houseplant or garden plant
5. Common names for the plant

Focus on plants that are commonly found in North Carolina gardens, houseplants, or native species. If the image is unclear, doesn't show a plant, or shows multiple plants, return an empty results array.

For each result, provide:
- name: Common name of the plant
- scientific_name: Scientific name (genus species)
- confidence: Confidence score between 0 and 1
- description: Detailed description of the plant's appearance
- careInstructions: Basic care tips if it's a common plant
- common_names: Array of alternative common names`
            },
            {
              type: 'image',
              image: imageBase64,
            },
          ],
        },
      ],
      maxRetries: 2,
    });

    return object.results;
  } catch (error) {
    console.error('Image identification error:', error);
    return [];
  }
}

// Reason: Use AI to identify plants from text descriptions
async function identifyPlantFromDescription(description: string): Promise<AIPlantResult[]> {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: AIPlantIdentificationSchema,
      messages: [
        {
          role: 'user',
          content: `Based on this plant description, identify the most likely plant species: "${description}"

Provide:
1. The most likely plant identification with high confidence (0.8-1.0)
2. Alternative possibilities with lower confidence (0.5-0.8)
3. Detailed descriptions of the plant's characteristics
4. Care instructions if it's a common houseplant or garden plant
5. Common names for the plant

Focus on plants that are commonly found in North Carolina gardens, houseplants, or native species. If the description is too vague or doesn't describe a plant, return an empty results array.

For each result, provide:
- name: Common name of the plant
- scientific_name: Scientific name (genus species)
- confidence: Confidence score between 0 and 1
- description: Detailed description of the plant's appearance
- careInstructions: Basic care tips if it's a common plant
- common_names: Array of alternative common names`,
        },
      ],
      maxRetries: 2,
    });

    return object.results;
  } catch (error) {
    console.error('Description identification error:', error);
    return [];
  }
}

// Reason: Enhance AI results with database information
async function enhanceResultsWithDatabase(aiResults: AIPlantResult[]): Promise<Record<string, unknown>[]> {
  const enhancedResults: Record<string, unknown>[] = [];

  // Reason: For each AI result, try to find a match in the database
  for (const aiResult of aiResults) {
    const databaseMatch = await searchDatabaseForPlant(
      aiResult.name,
      aiResult.scientific_name,
      aiResult.common_names
    );

    if (databaseMatch) {
      // Reason: Use database data if found, but keep AI confidence
      enhancedResults.push({
        ...databaseMatch,
        confidence: aiResult.confidence, // Reason: Keep AI confidence score
      });
    } else {
      // Reason: If no database match, use AI result as-is with generated ID
      enhancedResults.push({
        id: `ai-${aiResult.scientific_name.toLowerCase().replace(/\s+/g, '-')}`,
        ...aiResult,
        databaseMatch: false,
      });
    }
  }

  // Reason: If we have database matches, also find similar plants
  const databaseMatches = enhancedResults.filter(result => result.databaseMatch);
  if (databaseMatches.length > 0) {
    const topMatch = databaseMatches[0];
    const similarPlants = await findSimilarPlants(topMatch, 3);
    // Reason: Add similar plants with lower confidence and mark as similar, not direct matches
    enhancedResults.push(...similarPlants.map(plant => ({
      ...plant,
      confidence: Math.min(plant.confidence, 0.6), // Reason: Lower confidence for similar plants
      databaseMatch: false, // Reason: These are similar plants, not direct matches
      isSimilarPlant: true, // Reason: Mark as similar plant for UI distinction
    })));
  }

  return enhancedResults;
}