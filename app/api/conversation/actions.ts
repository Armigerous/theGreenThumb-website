"use server";

import { streamText, smoothStream } from "ai";
import { deepseek } from "@/lib/ai/deepseek";
import { ParsedIntent } from "@/types/chat";
import { PlantCardData } from "@/types/plant";
import { Tip } from "@/types/Tip";
import { UserGardens } from "@/types/garden";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

type ConversationParams = {
  question: string;
  parsedIntents: Array<{
    intent: string;
    entities: Record<string, unknown>;
  }>;
  plantResults: PlantCardData[];
  relatedTips: Tip[];
  userGarden?: UserGardens | null;
  gardenRecommendations?: PlantCardData[];
};

// Generate prompt function from the API route
function generatePrompt(
  question: string,
  parsedIntents: ParsedIntent[],
  plantResults: PlantCardData[],
  relatedTips: Tip[],
  userGarden?: UserGardens | null
): string {
  // Format plants data more concisely
  const formattedPlants = plantResults.map(plant => ({
    scientificName: plant.scientific_name,
    commonName: plant.common_name,
    image: plant.first_image,
    imageAltText: plant.first_image_alt_text,
    tags: plant.first_tag,
    description:
      plant.description && plant.description.length > 300
        ? plant.description.substring(0, 300) + "..."
        : plant.description,
    ...Object.entries(plant)
      .filter(
        ([key]) =>
          !["scientific_name", "common_name", "description"].includes(key) &&
          plant[key as keyof PlantCardData] !== null &&
          plant[key as keyof PlantCardData] !== undefined
      )
      .reduce((obj, [key, value]) => {
        obj[key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())] =
          typeof value === "string" && value.length > 100
            ? value.substring(0, 100) + "..."
            : value;
        return obj;
      }, {} as Record<string, unknown>),
  }));

  const formattedrelatedTips = relatedTips.map((post) => ({
    title: post.title,
    slug: post.slug,
  }));

  // Format user garden data if available
  let userGardenSection = "";
  if (userGarden) {
    // Extract the most relevant garden information
    const gardenInfo = {
      // Location and climate
      zones: userGarden.usda_zones_ids || [],
      regions: userGarden.ncRegionsIds || [],
      
      // Growing conditions
      sunlight: userGarden.sunlightIds || [],
      soilTexture: userGarden.soilTextureIds || [],
      soilPh: userGarden.soilPhIds || [],
      soilDrainage: userGarden.soilDrainageIds || [],
      
      // Garden characteristics
      gardenLocations: userGarden.locationIds || [],
      gardenThemes: userGarden.gardenThemeIds || [],
      spaceAvailable: userGarden.spaceAvailableIds || [],
      
      // Wildlife and challenges
      wildlifeAttraction: userGarden.wildlifeAttractionIds || [],
      resistanceChallenges: userGarden.resistanceChallengeIds || [],
      problemsToExclude: userGarden.problemsToExcludeIds || [],
      
      // Plant preferences
      plantTypes: userGarden.plantTypeIds || [],
      flowerColors: userGarden.flowerColorIds || [],
      flowerBloomTimes: userGarden.flowerBloomTimeIds || [],
      leafColors: userGarden.leafColorIds || [],
      yearRoundInterest: userGarden.yearRoundInterest,
    };

    userGardenSection = `
IMPORTANT - USER'S GARDEN INFORMATION:
${JSON.stringify(gardenInfo, null, 2)}

PERSONALIZATION REQUIREMENTS:
1. You MUST personalize your response based on the user's garden information
2. Begin your response with a brief personalization statement that references their garden conditions
3. Explain how your recommendations are specifically tailored to their garden

Key Garden Considerations:
- USDA Zones: ${gardenInfo.zones.join(', ') || 'Not specified'}
- Region: ${gardenInfo.regions.join(', ') || 'Not specified'}
- Sunlight: ${gardenInfo.sunlight.join(', ') || 'Not specified'}
- Soil Type: ${gardenInfo.soilTexture.join(', ') || 'Not specified'}
- Soil pH: ${gardenInfo.soilPh.join(', ') || 'Not specified'}
- Drainage: ${gardenInfo.soilDrainage.join(', ') || 'Not specified'}
- Garden Themes: ${gardenInfo.gardenThemes.join(', ') || 'Not specified'}
- Wildlife Interests: ${gardenInfo.wildlifeAttraction.join(', ') || 'Not specified'}
- Challenges to Address: ${gardenInfo.resistanceChallenges.join(', ') || 'Not specified'}
- Preferred Plant Types: ${gardenInfo.plantTypes.join(', ') || 'Not specified'}

Examples of good personalization:
- "Based on your garden's sandy soil and full sun conditions, here are some low-light plants that could work in shadier areas of your garden..."
- "Since you're in USDA zone 7b with clay soil, the following indoor plants would not only thrive inside but could potentially be moved outdoors during summer months..."
- "I notice you're interested in butterfly gardens. For your low-light indoor conditions, while most butterfly-attracting plants need sun, here are some indoor options that align with your interests..."
`;
  }

  return `Question: ${question}

Parsed Intents:
${JSON.stringify(parsedIntents, null, 2)}

Plant Database Results (${plantResults.length} results):
${JSON.stringify(formattedPlants, null, 2)}

Related Blog Posts:
${JSON.stringify(formattedrelatedTips, null, 2)}
${userGardenSection}

Please provide a comprehensive, practical response to the question based on the available information.
Focus on giving specific, actionable advice that a gardener can immediately use.

${userGarden ? "IMPORTANT: Personalize your response based on the user's garden information when relevant to the question. Tailor your advice to their specific growing conditions, preferences, and challenges." : ""}

If you're discussing fertilizers, include:
- Specific NPK ratios recommended
- Brand names or types of products that work well (organic options, slow-release, etc.)
- Exact application rates when possible
- Seasonal timing (not just "growing season" but "early April" or "after first bloom")
- Visual cues from the plant that indicate fertilizer needs

If you're discussing plant care, include:
- Step-by-step instructions
- Common problems and solutions
- Regional considerations if available

${userGarden ? "When recommending plants, prioritize those that match the user's garden conditions (soil type, sunlight, zone) and preferences (flower colors, themes, wildlife attraction)." : ""}

If information is missing, provide the best practical advice based on general gardening knowledge.
Write in a friendly but direct style, as if you're an experienced gardener sharing knowledge.`;
}

// System prompt from the API route
const systemPrompt = `You are a knowledgeable gardener having a friendly conversation.

Your goal is to provide direct, practical answers to gardening questions - like a helpful neighbor would.

Guidelines:
1. Be conversational and natural - avoid sounding like you're writing a blog post
2. Get straight to the point - answer the question directly before adding details
3. Use active voice and definitive statements
4. Give specific, actionable advice in a casual, friendly tone
5. Include exact measurements when relevant (e.g. "water once a week" not "regular watering")
6. Use everyday language instead of technical terms when possible
7. Frame advice positively ("do this" rather than "avoid that")
8. If blog posts are provided, extract the key information without mentioning the posts
9. Use contractions (y'all, don't, it's) to sound more conversational
10. Keep responses concise - avoid unnecessary introductions or conclusions
11. Don't use concluding phrases like "Happy gardening!" or "Good luck!" as the conversation may continue
12. When user garden information is provided, personalize your advice to their specific conditions
13. For garden-specific advice, consider their USDA zone, soil type, sunlight conditions, and other relevant factors
14. If the user has specific plant preferences or garden themes, incorporate those into your recommendations
15. Tailor plant suggestions to match the user's garden conditions (soil, sunlight, zone, etc.)
16. When recommending plants, consider the user's preferences for flower colors, bloom times, and wildlife attraction
17. If the user has resistance challenges (like deer or drought), prioritize plants that address these challenges
18. For users with specific garden themes (butterfly garden, native garden, etc.), emphasize plants that fit those themes
19. If the user has favorite plants, suggest companion plants or similar varieties they might enjoy
20. ALWAYS PERSONALIZE YOUR RESPONSE when user garden data is available - mention specific aspects of their garden that are relevant to the question
21. Begin your response with a brief personalization statement when garden data is available (e.g., "Based on your garden's sandy soil and full sun conditions...")
22. Highlight how your recommendations specifically match their garden conditions
23. Explain why certain plants might work well in their specific garden environment
24. If their garden conditions present challenges for the plants they're asking about, provide honest guidance and alternatives

Remember: You're having a chat with a gardener who needs a straightforward answer, not reading them a blog post. Make your advice personal and relevant to their specific garden situation whenever possible.`;

/**
 * Handles the conversation streaming without repeating expensive operations
 * that were already done in the main flow
 */
export async function continueConversation(
  history: Message[],
  params: ConversationParams
) {
  // Last message is always the user's question
  const question = params.question;

  // Check if we have all the necessary data to proceed
  if (!params.parsedIntents || params.parsedIntents.length === 0) {
    throw new Error("Missing parsed intents data");
  }

  try {
    // Generate the prompt using the existing function
    const prompt = generatePrompt(
      question,
      params.parsedIntents,
      params.plantResults,
      params.relatedTips,
      params.userGarden
    );

    // Stream the response using the AI SDK
    const result = streamText({
      model: deepseek('deepseek-reasoner'),
      system: systemPrompt,
      prompt: prompt,
      temperature: 0.6,
      maxTokens: 1000,
      experimental_transform: smoothStream(),
      onError: ({ error }) => {
        console.error("Error in streaming response:", error);
        if (error instanceof Error && 
            (error.message.includes("402") || 
             error.message.includes("Insufficient Balance"))) {
          console.error("Insufficient balance error detected");
        }
      }
    });

    // Return only the text stream
    return {
      textStream: result.textStream,
      text: result.text,
      usage: result.usage
    };
  } catch (error) {
    console.error("Error in conversation:", error);
    throw error;
  }
}
