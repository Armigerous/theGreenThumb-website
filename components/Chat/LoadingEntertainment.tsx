"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Trees,
  Shovel,
  Bird,
  Salad,
  Carrot,
  Sprout as Seedling,
  CalendarDays,
  Droplets,
  Mountain,
  History,
  Bug,
  HeartHandshake,
  MapPin as Locate,
  Lightbulb,
  Sparkles,
  AlertCircle,
  Flower,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

// Types for our facts
type FactCategory =
  | "plants"
  | "seasons"
  | "water"
  | "soil"
  | "pests"
  | "tools"
  | "history"
  | "wildlife"
  | "sustainability"
  | "zones"
  | "flowers"
  | "vegetables"
  | "trees"
  | "herbs";

// Pattern types for structuring fact presentation
type FactPatternType =
  | "didYouKnow"
  | "quickTip"
  | "seasonalAlert"
  | "funFact"
  | "experimentIdea"
  | "historyBite"
  | "natureNotes"
  | "gardenerHack"
  | "plantTrivia";

// The data structure for a gardening fact
type GardeningFact = {
  text: string;
  category: FactCategory;
  source?: string;
  patternType: FactPatternType; // Making this required for better consistency
  difficulty?: "beginner" | "intermediate" | "advanced";
  seasonal?: "spring" | "summer" | "fall" | "winter" | "year-round";
  region?: "mountains" | "piedmont" | "coastal" | "statewide";
};

type StatusMessage = {
  processing: string[];
  reasoning: string[];
};

type LoadingEntertainmentProps = {
  processingState: "processing" | "reasoning";
};

// Visual display modes (separate from content pattern types)
type DisplayMode =
  | "standardCard"
  | "tipCard"
  | "alertCard"
  | "historyNote"
  | "factSpotlight"
  | "plantProfile";

// Icon mapping for categories
const categoryIcons = {
  plants: Seedling,
  seasons: CalendarDays,
  water: Droplets,
  soil: Mountain,
  pests: Bug,
  tools: Shovel,
  history: History,
  wildlife: Bird,
  sustainability: HeartHandshake,
  zones: Locate,
  flowers: Flower,
  vegetables: Carrot,
  trees: Trees,
  herbs: Salad,
};

const getIconForCategory = (category: FactCategory) => {
  return categoryIcons[category] || Leaf;
};

// Colors for different categories (for icons and accents only, not backgrounds)
const categoryColors = {
  plants: "text-green-600 border-green-200",
  seasons: "text-blue-600 border-blue-200",
  water: "text-cyan-600 border-cyan-200",
  soil: "text-amber-600 border-amber-200",
  pests: "text-red-600 border-red-200",
  tools: "text-gray-600 border-gray-200",
  history: "text-purple-600 border-purple-200",
  wildlife: "text-lime-600 border-lime-200",
  sustainability: "text-teal-600 border-teal-200",
  zones: "text-orange-600 border-orange-200",
  flowers: "text-pink-600 border-pink-200",
  vegetables: "text-emerald-600 border-emerald-200",
  trees: "text-indigo-600 border-indigo-200",
  herbs: "text-yellow-600 border-yellow-200",
};

// Background colors for icons
const categoryIconBg = {
  plants: "bg-green-100",
  seasons: "bg-blue-100",
  water: "bg-cyan-100",
  soil: "bg-amber-100",
  pests: "bg-red-100",
  tools: "bg-gray-100",
  history: "bg-purple-100",
  wildlife: "bg-lime-100",
  sustainability: "bg-teal-100",
  zones: "bg-orange-100",
  flowers: "bg-pink-100",
  vegetables: "bg-emerald-100",
  trees: "bg-indigo-100",
  herbs: "bg-yellow-100",
};

// Display mode styling - with more consistent naming
const displayModeStyles = {
  standardCard: "bg-card border-2 rounded-2xl shadow-sm",
  tipCard:
    "bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-300 dark:border-emerald-800 rounded-r-xl shadow-[0_4px_12px_rgba(167,243,208,0.1)]",
  alertCard:
    "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl shadow-[0_4px_12px_rgba(191,219,254,0.15)]",
  historyNote:
    "bg-[#fffdf0] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-none shadow-md relative overflow-hidden",
  factSpotlight:
    "bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl shadow-[0_4px_12px_rgba(253,230,138,0.15)]",
  plantProfile:
    "bg-gradient-to-br from-green-50 to-background border-none rounded-3xl shadow-[0_8px_24px_rgba(16,185,129,0.1)]",
};

// Set of fact patterns to create variety
const factPatterns = {
  didYouKnow: [
    "Did you know that {fact}?",
    "Here's a surprising fact: {fact}",
    "Gardeners are often surprised to learn that {fact}",
    "It might surprise you that {fact}",
    "A little-known gardening fact: {fact}",
  ],
  quickTip: [
    "Quick Tip: {fact}",
    "Garden Hack: {fact}",
    "Try this in your garden: {fact}",
    "Gardener's Tip: {fact}",
    "Smart Gardening: {fact}",
  ],
  seasonalAlert: [
    "This season: {fact}",
    "Seasonal Note: {fact}",
    "Timely Reminder: {fact}",
    "Gardener's Calendar: {fact}",
    "Season-Smart: {fact}",
  ],
  funFact: [
    "Fun Fact: {fact}",
    "Garden Trivia: {fact}",
    "Fascinating: {fact}",
    "Garden Curiosity: {fact}",
    "Bet you didn't know: {fact}",
  ],
  experimentIdea: [
    "Try this experiment: {fact}",
    "Curious gardener? {fact}",
    "Experiment in your garden: {fact}",
    "Garden Science: {fact}",
    "Discovery opportunity: {fact}",
  ],
  historyBite: [
    "From the garden history books: {fact}",
    "Heritage Note: {fact}",
    "Historical Gardening: {fact}",
    "Garden History: {fact}",
    "From our roots: {fact}",
  ],
  natureNotes: [
    "In NC Gardens: {fact}",
    "Nature's Way: {fact}",
    "Ecological Note: {fact}",
    "Garden Ecosystem: {fact}",
    "Nature's Design: {fact}",
  ],
  gardenerHack: [
    "Expert Gardeners: {fact}",
    "Pro Tip: {fact}",
    "Gardener's Secret: {fact}",
    "Master Gardener Tip: {fact}",
    "Green Thumb Trick: {fact}",
  ],
  plantTrivia: [
    "Plant Trivia: {fact}",
    "Botanical Facts: {fact}",
    "Plant Science: {fact}",
    "Plant Nerd Alert: {fact}",
    "Botanical Wonder: {fact}",
  ],
};

// Mapping from FactPatternType to the most appropriate DisplayMode
const patternToDisplayMode: Record<FactPatternType, DisplayMode> = {
  didYouKnow: "factSpotlight",
  quickTip: "tipCard",
  seasonalAlert: "alertCard",
  funFact: "standardCard",
  experimentIdea: "tipCard",
  historyBite: "historyNote",
  natureNotes: "standardCard",
  gardenerHack: "tipCard",
  plantTrivia: "plantProfile",
};

// North Carolina gardening facts - keeping ALL original facts
const gardeningFacts: GardeningFact[] = [
  {
    text: "North Carolina spans 3 distinct growing zones (7a-8a), offering diverse planting options.",
    category: "zones",
    patternType: "didYouKnow",
    region: "statewide",
  },
  {
    text: "The state flower of North Carolina is the dogwood (Cornus florida).",
    category: "flowers",
    patternType: "funFact",
    region: "statewide",
  },
  {
    text: "Fall is often the best time to plant trees and shrubs in North Carolina.",
    category: "seasons",
    patternType: "seasonalAlert",
    seasonal: "fall",
    region: "statewide",
  },
  {
    text: "Native plants like Black-eyed Susans require less water and maintenance.",
    category: "plants",
    patternType: "quickTip",
    region: "statewide",
  },
  {
    text: "Clay soil, common in NC Piedmont, can be improved with compost and organic matter.",
    category: "soil",
    patternType: "gardenerHack",
    region: "piedmont",
  },
  {
    text: "North Carolina's growing season ranges from 180-290 days depending on location.",
    category: "seasons",
    patternType: "didYouKnow",
    region: "statewide",
  },
  {
    text: "Mulching with pine straw helps acid-loving plants like azaleas thrive.",
    category: "soil",
    patternType: "quickTip",
    region: "statewide",
  },
  {
    text: "Crop rotation helps prevent disease and improves soil fertility naturally.",
    category: "sustainability",
    patternType: "gardenerHack",
    difficulty: "intermediate",
  },
  {
    text: "The Carolina mantis is a beneficial predator that helps control garden pests.",
    category: "pests",
    patternType: "natureNotes",
    region: "statewide",
  },
  {
    text: "Rain barrels can save up to 1,300 gallons of water during peak summer months.",
    category: "water",
    patternType: "quickTip",
    seasonal: "summer",
  },
  {
    text: "Blueberries thrive in North Carolina's acidic soils with proper care.",
    category: "plants",
    patternType: "plantTrivia",
    region: "statewide",
  },
  {
    text: "A soil test through NC State Extension can dramatically improve your garden's health.",
    category: "soil",
    patternType: "quickTip",
    difficulty: "beginner",
    region: "statewide",
  },
  {
    text: "Companion planting marigolds with tomatoes can help deter harmful nematodes.",
    category: "plants",
    patternType: "gardenerHack",
    difficulty: "beginner",
  },
  {
    text: "Seeds from the NC State Seed Library help preserve heirloom varieties.",
    category: "history",
    patternType: "historyBite",
    region: "statewide",
  },
  {
    text: "The NC Botanical Garden in Chapel Hill showcases native plant communities.",
    category: "plants",
    patternType: "funFact",
    region: "piedmont",
  },
  {
    text: "Winter is the best time to prune most deciduous trees and shrubs.",
    category: "seasons",
    patternType: "seasonalAlert",
    seasonal: "winter",
    region: "statewide",
  },
  {
    text: "Butterflies like the Eastern Tiger Swallowtail need specific host plants to reproduce.",
    category: "wildlife",
    patternType: "natureNotes",
    region: "statewide",
  },
  {
    text: "North Carolina's red clay can be challenging but is rich in iron and minerals.",
    category: "soil",
    patternType: "didYouKnow",
    region: "piedmont",
  },
  {
    text: "Cover crops like crimson clover improve soil and prevent erosion during winter.",
    category: "sustainability",
    patternType: "seasonalAlert",
    seasonal: "fall",
    difficulty: "intermediate",
  },
  {
    text: "The earliest gardens in NC were cultivated by Native American tribes centuries ago.",
    category: "history",
    patternType: "historyBite",
    region: "statewide",
  },
  {
    text: "Planting in raised beds can help manage NC's clay soil drainage issues.",
    category: "soil",
    patternType: "gardenerHack",
    difficulty: "beginner",
    region: "piedmont",
  },
  {
    text: "The cardinal, NC's state bird, helps control insect populations in gardens.",
    category: "wildlife",
    patternType: "natureNotes",
    region: "statewide",
  },
  {
    text: "Muscadine grapes are native to NC and more disease-resistant than European varieties.",
    category: "plants",
    patternType: "plantTrivia",
    region: "statewide",
  },
  {
    text: "Solar garden lights can help extend the visual enjoyment of your garden.",
    category: "tools",
    patternType: "quickTip",
  },
  {
    text: "Many NC gardeners plant by the moon's phases, a tradition dating back generations.",
    category: "history",
    patternType: "historyBite",
    region: "statewide",
  },
  {
    text: "Most vegetable gardens need at least 6 hours of direct sunlight daily.",
    category: "vegetables",
    patternType: "didYouKnow",
    difficulty: "beginner",
  },
  {
    text: "Sweet potatoes were grown in NC before European settlement and remain a staple crop.",
    category: "history",
    patternType: "historyBite",
    region: "statewide",
  },
  {
    text: "Micro-irrigation systems can reduce water usage by up to 60% compared to sprinklers.",
    category: "water",
    patternType: "quickTip",
    difficulty: "intermediate",
  },
  {
    text: "Plants native to NC's coastal regions often tolerate salt spray and sandy soils.",
    category: "zones",
    patternType: "natureNotes",
    region: "coastal",
  },
  {
    text: "Lady beetles can consume up to 5,000 aphids in their lifetime.",
    category: "pests",
    patternType: "funFact",
  },
  {
    text: "The Venus flytrap is native only to a small region within 60 miles of Wilmington, NC.",
    category: "plants",
    patternType: "plantTrivia",
    region: "coastal",
  },
  {
    text: "Early settlers brought many popular garden herbs to NC including rosemary and thyme.",
    category: "herbs",
    patternType: "historyBite",
    region: "statewide",
  },
  {
    text: "Fall-planted garlic typically produces larger bulbs than spring-planted ones.",
    category: "vegetables",
    patternType: "seasonalAlert",
    seasonal: "fall",
    difficulty: "beginner",
  },
  {
    text: "Crepe myrtles, though not native, have been grown in NC gardens since the 1700s.",
    category: "trees",
    patternType: "historyBite",
    region: "statewide",
  },
  {
    text: "Vermicomposting (with worms) produces some of the richest natural fertilizer.",
    category: "sustainability",
    patternType: "gardenerHack",
    difficulty: "intermediate",
  },
  {
    text: "The oldest cultivated grapevine in America is the Scuppernong 'Mother Vine' in NC.",
    category: "history",
    patternType: "historyBite",
    region: "coastal",
  },
  {
    text: "Using a rain gauge helps track precipitation and avoid overwatering.",
    category: "tools",
    patternType: "quickTip",
    difficulty: "beginner",
  },
  {
    text: "The NC State Fair has featured agricultural exhibits since 1853.",
    category: "history",
    patternType: "funFact",
    region: "statewide",
  },
  {
    text: "Deadheading spent flowers encourages additional blooms on many plants.",
    category: "flowers",
    patternType: "gardenerHack",
    difficulty: "beginner",
  },
  {
    text: "Native bees are more efficient pollinators than honeybees for many NC crops.",
    category: "wildlife",
    patternType: "didYouKnow",
    region: "statewide",
  },
  {
    text: "Many historic NC homes featured formal knot gardens influenced by European design.",
    category: "history",
    patternType: "historyBite",
    region: "statewide",
  },
  {
    text: "The Uwharrie National Forest contains plant species dating back to the last ice age.",
    category: "plants",
    patternType: "natureNotes",
    region: "piedmont",
  },
  {
    text: "Soil temperature, not air temperature, determines when seeds will germinate.",
    category: "soil",
    patternType: "didYouKnow",
    difficulty: "intermediate",
  },
  {
    text: "Container gardening is effective when space is limited or soil conditions are poor.",
    category: "tools",
    patternType: "quickTip",
    difficulty: "beginner",
  },
  {
    text: "Cherokee Purple tomatoes were originally cultivated by the Cherokee in Tennessee and NC.",
    category: "vegetables",
    patternType: "historyBite",
    region: "mountains",
  },
  {
    text: "Heirloom varieties often have better flavor but may offer less disease resistance.",
    category: "plants",
    patternType: "didYouKnow",
    difficulty: "beginner",
  },
  {
    text: "The Fraser fir, native to NC mountains, is one of the most popular Christmas trees.",
    category: "trees",
    patternType: "plantTrivia",
    region: "mountains",
    seasonal: "winter",
  },
  {
    text: "NC was once home to the American chestnut, which dominated forests before blight.",
    category: "history",
    patternType: "historyBite",
    region: "mountains",
  },
  {
    text: "Lasagna gardening (sheet mulching) can transform poor soil without tilling.",
    category: "sustainability",
    patternType: "gardenerHack",
    difficulty: "intermediate",
  },
  {
    text: "The Monarch butterfly's migration passes through NC each fall heading to Mexico.",
    category: "wildlife",
    patternType: "natureNotes",
    region: "statewide",
    seasonal: "fall",
  },
  // Adding a few new facts to enhance variety
  {
    text: "Some NC gardeners plant by the 'Three Sisters' method - corn, beans, and squash together - a technique learned from Native Americans.",
    category: "history",
    patternType: "historyBite",
    difficulty: "beginner",
    region: "statewide",
  },
  {
    text: "In the NC mountains, spring arrives about 2-3 weeks later than in the coastal regions.",
    category: "seasons",
    patternType: "didYouKnow",
    region: "mountains",
    seasonal: "spring",
  },
  {
    text: "NC coastal gardeners can create wind breaks with salt-tolerant native shrubs like wax myrtle.",
    category: "tools",
    patternType: "gardenerHack",
    region: "coastal",
    difficulty: "intermediate",
  },
  {
    text: "The American persimmon, native to NC, produces fruit only after the first frost.",
    category: "trees",
    patternType: "plantTrivia",
    seasonal: "fall",
    region: "statewide",
  },
  {
    text: "Try placing crushed eggshells around plants to deter slugs and add calcium to soil.",
    category: "pests",
    patternType: "experimentIdea",
    difficulty: "beginner",
    region: "statewide",
  },
  {
    text: "Adding worm castings to potting soil can boost plants' immune systems and deter pests.",
    category: "soil",
    patternType: "quickTip",
    difficulty: "beginner",
    region: "statewide",
  },
];

// Function to generate dynamic variations of facts
const generateDynamicFacts = (coreFacts: GardeningFact[]): GardeningFact[] => {
  const dynamicFacts: GardeningFact[] = [...coreFacts];

  // Create variations of core facts with different patterns
  coreFacts.forEach((fact) => {
    if (!fact.patternType) return;

    // Select a different pattern than the original
    const patterns = Object.keys(factPatterns) as FactPatternType[];
    const availablePatterns = patterns.filter((p) => p !== fact.patternType);

    if (availablePatterns.length > 0) {
      const newPatternType =
        availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
      const patternTemplates = factPatterns[newPatternType];
      const template =
        patternTemplates[Math.floor(Math.random() * patternTemplates.length)];

      // Create a new fact with the pattern applied
      const newFactText = template.replace("{fact}", fact.text.toLowerCase());

      dynamicFacts.push({
        ...fact,
        text: newFactText,
        patternType: newPatternType,
      });
    }
  });

  return dynamicFacts;
};

// Status messages for different processing states
const statusMessages: StatusMessage = {
  processing: [
    "Analyzing your garden question...",
    "Digging into plant databases...",
    "Checking North Carolina growing conditions...",
    "Consulting gardening experts...",
    "Reviewing seasonal recommendations...",
    "Comparing plant varieties for your needs...",
    "Searching for relevant gardening tips...",
    "Identifying potential solutions...",
    "Cross-referencing NC State Extension guides...",
    "Examining local growing zone data...",
    "Assessing seasonal timing for your garden...",
    "Evaluating soil considerations...",
    "Looking up pest management strategies...",
    "Checking native plant compatibility...",
    "Determining best watering practices...",
  ],
  reasoning: [
    "Preparing personalized gardening guidance...",
    "Cultivating the perfect response...",
    "Tailoring advice to North Carolina conditions...",
    "Verifying best practices for your garden...",
    "Growing insights based on your question...",
    "Crafting expert gardening recommendations...",
    "Assembling helpful resources just for you...",
    "Putting the finishing touches on your answer...",
    "Pruning advice for clarity and relevance...",
    "Arranging information for easy understanding...",
    "Customizing guidance for your garden's needs...",
    "Germinating ideas to solve your challenge...",
    "Filtering advice for your specific situation...",
    "Transplanting expert knowledge to your context...",
    "Harvesting the most relevant information...",
  ],
};

// Function to get current season based on date
const getCurrentSeason = (): "spring" | "summer" | "fall" | "winter" => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
};

// Map categories to badge variants and custom styles
const categoryBadgeConfig = {
  plants: {
    variant: "outline" as const,
    className:
      "bg-green-50 border-green-400 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300",
  },
  seasons: {
    variant: "outline" as const,
    className:
      "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300",
  },
  water: {
    variant: "outline" as const,
    className:
      "bg-cyan-50 border-cyan-400 text-cyan-700 dark:bg-cyan-900/30 dark:border-cyan-700 dark:text-cyan-300",
  },
  soil: {
    variant: "outline" as const,
    className:
      "bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300",
  },
  pests: {
    variant: "outline" as const,
    className:
      "bg-red-50 border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300",
  },
  tools: {
    variant: "outline" as const,
    className:
      "bg-slate-50 border-slate-400 text-slate-700 dark:bg-slate-900/30 dark:border-slate-700 dark:text-slate-300",
  },
  history: {
    variant: "outline" as const,
    className:
      "bg-purple-50 border-purple-400 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300",
  },
  wildlife: {
    variant: "outline" as const,
    className:
      "bg-lime-50 border-lime-400 text-lime-700 dark:bg-lime-900/30 dark:border-lime-700 dark:text-lime-300",
  },
  sustainability: {
    variant: "outline" as const,
    className:
      "bg-teal-50 border-teal-400 text-teal-700 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-300",
  },
  zones: {
    variant: "outline" as const,
    className:
      "bg-orange-50 border-orange-400 text-orange-700 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300",
  },
  flowers: {
    variant: "outline" as const,
    className:
      "bg-pink-50 border-pink-400 text-pink-700 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-300",
  },
  vegetables: {
    variant: "outline" as const,
    className:
      "bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300",
  },
  trees: {
    variant: "outline" as const,
    className:
      "bg-indigo-50 border-indigo-400 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300",
  },
  herbs: {
    variant: "outline" as const,
    className:
      "bg-yellow-50 border-yellow-400 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300",
  },
};

export default function LoadingEntertainment({
  processingState,
}: LoadingEntertainmentProps) {
  // Select a random mode to start with
  const initialMode = useMemo(() => {
    const modes: DisplayMode[] = [
      "standardCard",
      "tipCard",
      "alertCard",
      "historyNote",
      "factSpotlight",
      "plantProfile",
    ];
    return modes[Math.floor(Math.random() * modes.length)];
  }, []);

  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [pastFacts, setPastFacts] = useState<Set<number>>(new Set());
  const [colorAnimation, setColorAnimation] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialMode);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const displayCycleRef = useRef<NodeJS.Timeout | null>(null);
  const currentSeason = useMemo(() => getCurrentSeason(), []);

  // Generate an expanded set of facts
  const allGardeningFacts = useMemo(
    () => generateDynamicFacts(gardeningFacts),
    []
  );

  // Optional: Sometimes synchronize display mode with fact pattern type
  // This uses our patternToDisplayMode mapping
  useEffect(() => {
    // 30% chance to match the display mode to the fact pattern
    if (Math.random() < 0.3 && currentFactIndex < allGardeningFacts.length) {
      const currentFact = allGardeningFacts[currentFactIndex];
      if (currentFact.patternType) {
        const matchingDisplayMode =
          patternToDisplayMode[currentFact.patternType];
        setDisplayMode(matchingDisplayMode);
      }
    }
  }, [currentFactIndex, allGardeningFacts]);

  // Constants - adjust timing for smoother transitions and longer reading time
  const factDisplayTime = 15000; // 15 seconds per fact (increased from 8s)
  const displayModeChangeTime = 45000; // 45 seconds per display mode (increased from 32s)

  // Get a random fact that hasn't been shown recently with seasonal priority
  const getNextFactIndex = useCallback(() => {
    // Start fresh if we've shown almost all facts
    if (pastFacts.size >= allGardeningFacts.length - 10) {
      setPastFacts(new Set());
    }

    // Prioritize seasonal content sometimes
    const shouldShowSeasonal = Math.random() < 0.3; // 30% chance
    const seasonalFacts = allGardeningFacts.filter(
      (f, idx) => !pastFacts.has(idx) && f.seasonal === currentSeason
    );

    // If we have seasonal facts and should show them, use them for selection
    let nextIndex;
    if (shouldShowSeasonal && seasonalFacts.length > 0) {
      const randomSeasonalIndex = Math.floor(
        Math.random() * seasonalFacts.length
      );
      nextIndex = allGardeningFacts.findIndex(
        (f) => f === seasonalFacts[randomSeasonalIndex]
      );
    } else {
      // Otherwise select from all facts
      do {
        nextIndex = Math.floor(Math.random() * allGardeningFacts.length);
      } while (pastFacts.has(nextIndex));
    }

    setPastFacts((prev) => new Set([...prev, nextIndex]));
    return nextIndex;
  }, [pastFacts, allGardeningFacts, currentSeason]);

  // Cycle display modes for variety
  useEffect(() => {
    const modes: DisplayMode[] = [
      "standardCard",
      "tipCard",
      "alertCard",
      "historyNote",
      "factSpotlight",
      "plantProfile",
    ];

    displayCycleRef.current = setTimeout(() => {
      let randomMode: DisplayMode;
      // Choose a different mode than the current one
      do {
        randomMode = modes[Math.floor(Math.random() * modes.length)];
      } while (randomMode === displayMode);

      setDisplayMode(randomMode);
    }, displayModeChangeTime);

    return () => {
      if (displayCycleRef.current) clearTimeout(displayCycleRef.current);
    };
  }, [displayMode]);

  // Rotate through facts - improve timing
  useEffect(() => {
    // Set up fact rotation with a smoother transition
    timeoutRef.current = setTimeout(() => {
      // Use framer-motion's AnimatePresence for smoother transitions
      setCurrentFactIndex(getNextFactIndex());
      setColorAnimation(true);

      // Get next status message
      setCurrentStatusIndex(
        (prev) => (prev + 1) % statusMessages[processingState].length
      );
    }, factDisplayTime);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentFactIndex, processingState, getNextFactIndex]);

  // Reset animation state with a smoother transition
  useEffect(() => {
    if (colorAnimation) {
      const timer = setTimeout(() => setColorAnimation(false), 600); // Increased from 500ms
      return () => clearTimeout(timer);
    }
  }, [colorAnimation]);

  // Current fact and icons
  const currentFact = allGardeningFacts[currentFactIndex];
  const CategoryIcon = getIconForCategory(currentFact.category);
  const categoryColor = categoryColors[currentFact.category];
  const iconBgColor = categoryIconBg[currentFact.category];
  const badgeConfig = categoryBadgeConfig[currentFact.category];

  // Category badge component using Shadcn Badge
  const CategoryBadge = ({ className = "", showIcon = true }) => (
    <Badge
      variant={badgeConfig.variant}
      className={twMerge(
        `shadow-sm border-2 font-semibold ${badgeConfig.className}`,
        className
      )}
    >
      {showIcon && <CategoryIcon className="h-3.5 w-3.5 mr-1.5" />}
      {currentFact.category}
    </Badge>
  );

  // Render different display modes
  const renderFactContent = () => {
    // For visual variety, we use the current display mode for actual rendering
    const effectiveMode = displayMode;

    // We could use a mapping between FactPatternType and DisplayMode
    // to enforce consistency, but we're allowing mixed display styles for variety

    switch (effectiveMode) {
      case "tipCard":
        return (
          <div className="py-4 px-6">
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <h4 className="font-medium text-emerald-700 dark:text-emerald-400">
                {currentFact.patternType === "quickTip"
                  ? "Quick Gardening Tip"
                  : currentFact.patternType === "experimentIdea"
                    ? "Try This Experiment"
                    : currentFact.patternType === "gardenerHack"
                      ? "Gardener's Hack"
                      : "Helpful Tip"}
              </h4>
            </motion.div>
            <motion.p
              className="text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {currentFact.text}
            </motion.p>
            <motion.div
              className="mt-4 flex items-center gap-2 opacity-70"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CategoryIcon
                className={`h-4 w-4 ${categoryColor.split(" ")[0]}`}
              />
              <CategoryBadge />
              {currentFact.difficulty && (
                <span className="text-xs ml-3 capitalize">
                  • {currentFact.difficulty} level
                </span>
              )}
            </motion.div>
          </div>
        );

      case "alertCard":
        return (
          <div className="p-5">
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-blue-700 dark:text-blue-400">
                {currentFact.patternType === "seasonalAlert"
                  ? "Seasonal Gardening Alert"
                  : "Important Garden Note"}
              </h4>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50 mb-3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <p className="text-base">{currentFact.text}</p>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-2 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CategoryBadge />
              {currentFact.seasonal && (
                <motion.span
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    currentFact.seasonal === currentSeason
                      ? "bg-green-100 text-green-600 border border-green-200 dark:bg-green-900/50 dark:border-green-800 dark:text-green-400"
                      : "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                  }`}
                >
                  {currentFact.seasonal} season
                </motion.span>
              )}
              {currentFact.region && (
                <motion.span
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200 dark:bg-blue-900/50 dark:border-blue-800 dark:text-blue-400"
                >
                  {currentFact.region} region
                </motion.span>
              )}
            </motion.div>
          </div>
        );

      case "factSpotlight":
        return (
          <div className="p-6">
            <div className="flex items-start">
              <motion.div
                className="mr-4 mt-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 0.6,
                }}
              >
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                  <Lightbulb className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </motion.div>
              <div>
                <motion.h3
                  className="text-xl font-semibold mb-3 text-amber-800 dark:text-amber-300"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {currentFact.patternType === "didYouKnow"
                    ? "Did you know?"
                    : currentFact.patternType === "funFact"
                      ? "Fun Fact!"
                      : "Garden Spotlight"}
                </motion.h3>
                <motion.p
                  className="text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {currentFact.text}
                </motion.p>
                <motion.div
                  className="mt-4 flex items-center gap-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <CategoryIcon
                    className={`h-5 w-5 ${categoryColor.split(" ")[0]}`}
                  />
                  <CategoryBadge />
                </motion.div>
              </div>
            </div>
          </div>
        );

      case "historyNote":
        return (
          <div className="p-5 relative">
            {/* Notebook paper lines */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-400 ml-8"
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            ></motion.div>
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, width: "0%" }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05 * i,
                    ease: "easeInOut",
                  }}
                  className="absolute w-full h-px bg-stone-300/70 dark:bg-stone-700/70"
                  style={{ top: `${(i + 1) * 20}px` }}
                ></motion.div>
              ))}
            </div>

            <motion.div
              className="ml-12 mt-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.h4
                className="font-medium mb-1 text-stone-700 dark:text-stone-300 font-handwriting text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                Garden History:
              </motion.h4>
              <motion.p
                className="text-lg font-handwriting leading-relaxed text-stone-800 dark:text-stone-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {currentFact.text}
              </motion.p>

              <motion.div
                className="mt-4 flex items-center gap-2 opacity-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <History className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                <span className="text-xs">Historical gardening note</span>
                <CategoryBadge className="ml-2" />
              </motion.div>
            </motion.div>
          </div>
        );

      case "plantProfile":
        return (
          <div className="px-6 py-7 text-center flex flex-col items-center">
            <div className="mb-5 flex flex-col items-center">
              <motion.div
                className="p-3 mb-2 rounded-full bg-white dark:bg-gray-800 shadow-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <CategoryIcon
                  className={`h-7 w-7 ${categoryColor.split(" ")[0]}`}
                />
              </motion.div>
              <motion.h3
                className="text-lg font-medium text-green-800 dark:text-green-300"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Plant Knowledge
              </motion.h3>
            </div>

            <div className="max-w-md mx-auto">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: [0.19, 1.0, 0.22, 1.0],
                  delay: 0.3,
                }}
                className="text-lg font-light leading-relaxed"
              >
                {currentFact.text}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "8rem" }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }}
              className="mt-5 pt-3 border-t border-green-100 dark:border-green-900/30"
            >
              <CategoryBadge />
            </motion.div>
          </div>
        );

      case "standardCard":
      default:
        return renderGardeningFactCard();
    }
  };

  // Standard gardening fact card (default)
  const renderGardeningFactCard = () => (
    <div className="flex items-start gap-4 p-5">
      <motion.div
        className={`p-3 rounded-full ${iconBgColor} flex-shrink-0`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <CategoryIcon className={`h-6 w-6 ${categoryColor.split(" ")[0]}`} />
      </motion.div>

      <div>
        <motion.div
          className="flex items-center gap-2 mb-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className="font-medium">NC Gardening Fact</h4>
          <CategoryBadge />
        </motion.div>

        <motion.p
          className="text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {currentFact.text}
        </motion.p>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6 py-4 relative">
      {/* Status Message */}
      <div className="text-center mb-6 relative z-10">
        <motion.h3
          className="text-lg font-semibold text-brand-700 dark:text-brand-300"
          animate={{ opacity: [0.8, 1] }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {statusMessages[processingState][currentStatusIndex]}
        </motion.h3>
      </div>

      {/* Gardening Fact Display */}
      <div className="relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFactIndex + displayMode}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: colorAnimation ? 1.02 : 1,
              transition: {
                scale: {
                  duration: 0.5,
                  ease: "easeOut",
                },
              },
            }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.3 } }}
            transition={{
              duration: 0.5,
              ease: [0.19, 1.0, 0.22, 1.0], // Ease out expo for smoother motion
            }}
            className={twMerge(
              "mx-auto max-w-2xl transition-all min-h-[180px] flex flex-col justify-center",
              displayModeStyles[displayMode]
            )}
          >
            {renderFactContent()}
          </motion.div>
        </AnimatePresence>

        {/* Animated Decorative Pulse - Improved */}
        <div className="mt-6 flex justify-center space-x-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: i * 0.5,
                times: [0, 0.5, 1], // Control timing of keyframes for smoother animation
              }}
              className={`w-2 h-2 rounded-full bg-brand-400 dark:bg-brand-600`}
            />
          ))}
        </div>
      </div>

      {/* Ambient decoration elements - Enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-green-100 opacity-20 dark:opacity-10 blur-xl"
          animate={{
            x: [0, 15, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-blue-100 opacity-20 dark:opacity-10 blur-xl"
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 1,
            times: [0, 0.5, 1],
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-amber-100 opacity-10 dark:opacity-5 blur-lg"
          animate={{
            x: [0, -10, 0],
            y: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </div>
  );
}
