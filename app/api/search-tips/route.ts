import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// More flexible topic-based search system
// Define key topics and their related terms that might appear in questions
const topicKeywords: Record<
  string,
  {
    terms: string[];
    tip: { title: string; slug: string };
  }
> = {
  "rose fertilizer": {
    terms: [
      "rose",
      "roses",
      "fertilize",
      "fertilizer",
      "fertilizing",
      "feed",
      "feeding",
      "nutrients",
      "blooms",
    ],
    tip: {
      title:
        "Fertilizing Your Rose Bushes: The Ultimate Guide for Vibrant Blooms",
      slug: "fertilizing-rose-bushes-guide",
    },
  },
  "succulent watering": {
    terms: [
      "succulent",
      "succulents",
      "water",
      "watering",
      "drought",
      "overwater",
      "underwater",
    ],
    tip: {
      title: "Best Indoor Plants for Low-Light: Thrive in Dim Conditions",
      slug: "top-indoor-plants-low-light-conditions",
    },
  },
  "plant sunlight": {
    terms: [
      "sunlight",
      "light",
      "bright",
      "dim",
      "shade",
      "sun",
      "sunny",
      "lighting",
      "window",
    ],
    tip: {
      title: "Optimizing Plant Growth: Essential Sunlight Requirements",
      slug: "understanding-sunlight-needs-for-plants",
    },
  },
  "plant identification": {
    terms: [
      "identify",
      "identification",
      "recognize",
      "what plant",
      "which plant",
      "type of plant",
      "species",
      "variety",
    ],
    tip: {
      title:
        "Identifying Plants: A Comprehensive Guide to Recognizing Flora by Leaves and Flower Shapes",
      slug: "identifying-plants-leaves-flowers-guide",
    },
  },
  repotting: {
    terms: [
      "repot",
      "repotting",
      "pot",
      "root bound",
      "rootbound",
      "bigger pot",
      "larger pot",
      "transplant",
    ],
    tip: {
      title:
        "Mastering the Art of Repotting Root-Bound Houseplants for Thriving Indoor Gardens",
      slug: "repotting-root-bound-houseplants-guide",
    },
  },
  "monstera care": {
    terms: [
      "monstera",
      "swiss cheese plant",
      "deliciosa",
      "fenestration",
      "split leaf",
    ],
    tip: {
      title: "Ultimate Guide: How to Grow Big and Healthy Monstera Plants",
      slug: "growing-healthy-monstera-plants-guide",
    },
  },
  "companion herbs": {
    terms: [
      "herb",
      "herbs",
      "companion",
      "together",
      "container",
      "pot",
      "planter",
      "kitchen herbs",
    ],
    tip: {
      title: "Companion Herbs: Growing Herbs Together in the Same Container",
      slug: "companion-herbs-container-growing",
    },
  },
  "pothos propagation": {
    terms: [
      "pothos",
      "propagate",
      "propagation",
      "cutting",
      "cuttings",
      "water propagation",
      "root",
      "node",
    ],
    tip: {
      title: "Comprehensive Guide to Successfully Propagating Pothos Cuttings",
      slug: "propagating-pothos-cuttings-guide",
    },
  },
  "cactus soil": {
    terms: [
      "cactus",
      "cacti",
      "soil",
      "mix",
      "potting",
      "drain",
      "drainage",
      "gritty",
      "sandy",
    ],
    tip: {
      title:
        "Create the Perfect Soil Mix for Cactus Plants: A Comprehensive Guide",
      slug: "perfect-soil-mix-cactus-plants",
    },
  },
  "orchid problems": {
    terms: [
      "orchid",
      "orchids",
      "yellow",
      "yellowing",
      "leaves",
      "wilting",
      "dropping",
      "spots",
    ],
    tip: {
      title:
        "Addressing Yellowing Leaves on Orchids - Understanding the Causes and Solutions",
      slug: "orchid-yellowing-leaves-solutions",
    },
  },
  "drought tolerant": {
    terms: [
      "drought",
      "dry",
      "xeriscape",
      "low water",
      "water efficient",
      "arid",
      "heat",
      "sun",
      "hot climate",
    ],
    tip: {
      title:
        "Top Drought-Tolerant Plants for Your Outdoor Garden: Thriving in Dry Conditions",
      slug: "drought-tolerant-plants-outdoor-garden",
    },
  },
};

interface TipResult {
  title: string;
  slug: { current: string };
  description?: string;
  publishedAt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { question, entities, userGarden } = await request.json();
    console.log('Received search request:', { question, entities });
    const lowerQuestion = question.toLowerCase();

    // Topic detection approach - find the most relevant topic
    let bestMatchScore = 0;
    let bestMatchTopic = null;

    // Check how many keywords from each topic appear in the question
    for (const [topic, data] of Object.entries(topicKeywords)) {
      let matchScore = 0;

      // Count how many terms from this topic appear in the question
      for (const term of data.terms) {
        if (lowerQuestion.includes(term)) {
          matchScore += 1;

          // Give extra weight to entity matches
          if (
            entities &&
            Object.values(entities).some(
              (entity) =>
                typeof entity === "string" &&
                entity.toLowerCase().includes(term)
            )
          ) {
            matchScore += 2;
          }
        }
      }

      // Boost score based on user garden preferences if available
      if (userGarden) {
        // Check if the topic is related to user's garden preferences
        if (
          (topic.includes("sunlight") && userGarden.sunlightIds?.length > 0) ||
          (topic.includes("soil") && 
            (userGarden.soilTextureIds?.length > 0 || 
             userGarden.soilPhIds?.length > 0 || 
             userGarden.soilDrainageIds?.length > 0)) ||
          (topic.includes("drought") && userGarden.resistanceChallengeIds?.some((id: string) => id.toLowerCase().includes("drought"))) ||
          (topic.includes("rose") && userGarden.specificPlantIds?.some((id: string) => id.toLowerCase().includes("rose"))) ||
          (topic.includes("herb") && userGarden.plantTypeIds?.some((id: string) => id.toLowerCase().includes("herb"))) ||
          (topic.includes("cactus") && userGarden.plantTypeIds?.some((id: string) => id.toLowerCase().includes("succulent")))
        ) {
          matchScore += 3; // Significant boost for garden-relevant topics
        }
      }

      // If this topic scored better than previous ones
      if (matchScore > bestMatchScore) {
        bestMatchScore = matchScore;
        bestMatchTopic = {
          ...data.tip,
          topicName: topic  // Store the topic name along with the tip
        };
      }
    }

    // If we found a strong topic match (at least 2 keyword matches)
    if (bestMatchScore >= 2 && bestMatchTopic) {
      console.log('Found topic match:', { 
        score: bestMatchScore, 
        topic: bestMatchTopic 
      });
      
      // Search Sanity for the exact post using the slug
      const topicPost = await client.fetch<TipResult>(groq`
        *[_type == "post" && slug.current == $slug][0] {
          title,
          "slug": slug.current,
          description,
          publishedAt
        }
      `, { slug: bestMatchTopic.slug });

      console.log('Sanity topic post result:', topicPost);

      const response = {
        tips: [{
          title: topicPost?.title || bestMatchTopic.title,
          slug: {
            current: topicPost?.slug || bestMatchTopic.slug
          },
          description: topicPost?.description,
          publishedAt: topicPost?.publishedAt
        }],
      };

      console.log('Sending topic-based response:', response);
      return NextResponse.json(response);
    }

    // If no clear topic match, fall back to Sanity search
    const searchTerms: string[] = [];

    // Add all entity values as search terms
    if (entities) {
      Object.values(entities).forEach((value) => {
        if (typeof value === "string" && value.trim().length > 0) {
          searchTerms.push(value.toLowerCase());
        }
      });
    }

    // Add keywords from the question (keeping existing filtering logic)
    const questionWords = question
      .toLowerCase()
      .split(/\s+/)
      .filter(
        (word: string) =>
          word.length > 3 &&
          ![
            "what",
            "when",
            "where",
            "which",
            "how",
            "does",
            "can",
            "will",
            "should",
            "would",
            "could",
            "about",
            "have",
            "need",
            "want",
            "like",
            "many",
            "much",
            "best",
            "good",
            "better",
            "well",
            "often",
            "frequency",
            "type",
            "kind",
            "sort",
            "tips",
            "ways",
            "methods",
            "techniques",
          ].includes(word)
      );

    searchTerms.push(...questionWords);

    // Remove duplicates
    const uniqueSearchTerms = [...new Set(searchTerms)];

    if (uniqueSearchTerms.length === 0) {
      return NextResponse.json({ tips: [] });
    }

    // Build GROQ query using the search terms
    console.log('Falling back to search with terms:', uniqueSearchTerms);

    const searchQuery = groq`
      *[_type == "post" && publishedAt < now() && (
        ${uniqueSearchTerms
          .map(
            (term) =>
              `title match "*${term}*" || description match "*${term}*" || pt::text(body) match "*${term}*"`
          )
          .join(" || ")}
      )] | order(publishedAt desc)[0...6] {
        title,
        "slug": slug.current,
        description,
        publishedAt
      }
    `;

    const tips = await client.fetch<TipResult[]>(searchQuery);
    console.log('Sanity search results:', tips);

    const response = {
      tips: tips.map((tip) => ({
        title: tip.title,
        slug: {
          current: tip.slug
        },
        description: tip.description,
        publishedAt: tip.publishedAt,
      })),
    };

    console.log('Sending search-based response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error searching blog tips:", error);
    return NextResponse.json(
      { error: "Failed to search for related blog tips" },
      { status: 500 }
    );
  }
}
