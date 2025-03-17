"use client";

import { UserGardens, getFilterOptions } from "@/types/garden";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Leaf,
  Info,
  MapPin,
  Sun,
  Droplet,
  Layers,
  Palette,
  Bug,
  Plane,
  Flower2,
  Calendar,
  Edit,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface GardenInfoDisplayProps {
  userGarden: UserGardens;
  isCollapsed?: boolean;
  className?: string;
  isMobile?: boolean;
}

export default function GardenInfoDisplay({
  userGarden,
  isCollapsed: initialCollapsed = false,
  className = "",
  isMobile = false,
}: GardenInfoDisplayProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [activeSection, setActiveSection] = useState<string | null>("basic");
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Check scroll position to show/hide fades
  const checkScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowLeftFade(scrollLeft > 0);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1); // -1 for potential rounding
    }
  };

  // Initialize scroll check and add scroll listener
  useEffect(() => {
    checkScroll();
    const tabsContainer = tabsContainerRef.current;
    if (tabsContainer) {
      tabsContainer.addEventListener("scroll", checkScroll);
      // Also check on window resize
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (tabsContainer) {
        tabsContainer.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Helper function to format array data for display
  const formatArrayData = (data: string[] | undefined) => {
    if (!data || data.length === 0) return [];
    return data;
  };

  // Helper to resolve numeric IDs to their text values (for growth rate, maintenance level, etc.)
  const getTextValueForId = (categoryId: string, id: number | undefined) => {
    if (id === undefined) return "Not specified";

    const options = getFilterOptions(categoryId);
    return options[id] || "Unknown";
  };

  // Badge styling helper
  const getBadgeStyles = () => {
    return cn("bg-cream-50/50 text-xs mb-1", isMobile && "text-sm py-1 px-2.5");
  };

  const sections = [
    {
      id: "basic",
      title: "Basic Info",
      icon: <Info className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-brand-500" />
              <h4 className="font-medium">Location</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.ncRegionsIds).map((region) => (
                <Badge
                  key={region}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  {region}
                </Badge>
              ))}
              {formatArrayData(userGarden.usda_zones_ids).map((zone) => (
                <Badge
                  key={zone}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  Zone {zone}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-4 w-4 text-amber-500" />
              <h4 className="font-medium">Sunlight</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.sunlightIds).map((light) => (
                <Badge
                  key={light}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  {light}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "soil",
      title: "Soil",
      icon: <Layers className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="h-4 w-4 text-blue-500" />
              <h4 className="font-medium">Soil Type & Drainage</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.soilTextureIds).map((soilTexture) => (
                <Badge
                  key={soilTexture}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  {soilTexture}
                </Badge>
              ))}
              {formatArrayData(userGarden.soilDrainageIds).map((drainage) => (
                <Badge
                  key={drainage}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  {drainage}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Soil pH</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.soilPhIds).map((ph) => (
                <Badge key={ph} variant="outline" className={getBadgeStyles()}>
                  {ph}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "features",
      title: "Garden Features",
      icon: <Palette className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Garden Themes</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.gardenThemeIds).map((theme) => (
                <Badge
                  key={theme}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  {theme}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Design Features</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.designFeatureIds).map((feature) => (
                <Badge
                  key={feature}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Location Types</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.locationIds).map((location) => (
                <Badge
                  key={location}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "wildlife",
      title: "Wildlife & Challenges",
      icon: <Bug className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Attract Wildlife</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.wildlifeAttractionIds).map(
                (wildlife) => (
                  <Badge
                    key={wildlife}
                    variant="outline"
                    className={getBadgeStyles()}
                  >
                    {wildlife}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Resistance Needs</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.resistanceChallengeIds).map(
                (challenge) => (
                  <Badge
                    key={challenge}
                    variant="outline"
                    className={getBadgeStyles()}
                  >
                    {challenge}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Problems to Avoid</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.problemsToExcludeIds).map(
                (problem) => (
                  <Badge
                    key={problem}
                    variant="outline"
                    className={getBadgeStyles()}
                  >
                    {problem}
                  </Badge>
                )
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "plants",
      title: "Plant Preferences",
      icon: <Plane className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Plant Types</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.plantTypeIds).map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Growth & Maintenance</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="outline" className={getBadgeStyles()}>
                Growth:{" "}
                {getTextValueForId("growthRate", userGarden.growthRateId)}
              </Badge>
              <Badge variant="outline" className={getBadgeStyles()}>
                Maintenance:{" "}
                {getTextValueForId(
                  "maintenanceLevel",
                  userGarden.maintenanceLevelId
                )}
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "flowers",
      title: "Flowers & Seasons",
      icon: <Flower2 className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Flower Colors</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.flowerColorIds).map((color) => (
                <Badge
                  key={color}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  {color}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-brand-500" />
              <h4 className="font-medium">Bloom Times</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.flowerBloomTimeIds).map((season) => (
                <Badge
                  key={season}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  {season}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Fall Colors</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formatArrayData(userGarden.fallColorIds).map((color) => (
                <Badge
                  key={color}
                  variant="outline"
                  className={getBadgeStyles()}
                >
                  {color}
                </Badge>
              ))}
              {userGarden.yearRoundInterest && (
                <Badge variant="outline" className={getBadgeStyles()}>
                  Year-round interest
                </Badge>
              )}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className={cn(
        "flex flex-col border border-cream-200 dark:border-cream-700 bg-cream-50 dark:bg-cream-900 rounded-md overflow-hidden",
        isMobile ? "h-full rounded-none border-0" : "",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!isMobile ? (
        // Desktop header with collapse controls
        <div className="p-4 bg-brand-50 dark:bg-brand-900/30 border-b border-cream-200 dark:border-cream-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-brand-500" />
              <div>
                <h3 className="text-lg font-medium">Garden Profile</h3>
                <p className="text-sm mt-1 text-brand-700 dark:text-brand-300">
                  {userGarden.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/my-garden">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit garden profile</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Edit garden profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
              {!isMobile && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="h-8 w-8 p-0"
                      >
                        {isCollapsed ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isCollapsed ? "Expand" : "Collapse"} garden information
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Mobile header
        <div className="px-3 py-2.5 border-b border-cream-200 dark:border-cream-700 bg-brand-50 dark:bg-brand-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-brand-500" />
              <div>
                <h3 className="text-base font-medium">Garden Profile</h3>
                <p className="text-sm text-brand-700 dark:text-brand-300">
                  {userGarden.name}
                </p>
              </div>
            </div>
            <Link href="/my-garden">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 gap-1 text-brand-600 hover:text-brand-800 mr-8"
              >
                <Edit className="h-3.5 w-3.5" />
                <span className="text-xs">Edit</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      {(!isCollapsed || isMobile) && (
        <div
          className={cn(
            "flex flex-col",
            isMobile ? "h-full" : "overflow-hidden"
          )}
        >
          {/* Section tabs */}
          <div className="relative">
            <div
              ref={tabsContainerRef}
              className={cn(
                "flex overflow-x-auto bg-cream-100/50 dark:bg-cream-800/50 border-b border-cream-200 dark:border-cream-700 scrollbar-none",
                isMobile ? "p-3 gap-2" : "p-2 gap-1"
              )}
            >
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  size={isMobile ? "default" : "sm"}
                  className={cn(
                    "flex items-center gap-1 rounded-md whitespace-nowrap",
                    isMobile ? "text-sm py-2" : "h-8 text-xs font-medium",
                    activeSection === section.id
                      ? "bg-brand-100 text-brand-900 hover:bg-brand-200 dark:bg-brand-900/20 dark:text-brand-200"
                      : "text-cream-700 dark:text-cream-300"
                  )}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.icon}
                  <span>{section.title}</span>
                </Button>
              ))}
            </div>
            {/* Left fade */}
            <div
              className={cn(
                "absolute left-0 top-0 bottom-0 w-12 pointer-events-none",
                "bg-gradient-to-r from-cream-100/90 to-transparent dark:from-cream-800/90",
                "transition-opacity duration-200",
                showLeftFade ? "opacity-100" : "opacity-0"
              )}
            />
            {/* Right fade */}
            <div
              className={cn(
                "absolute right-0 top-0 bottom-0 w-12 pointer-events-none",
                "bg-gradient-to-l from-cream-100/90 to-transparent dark:from-cream-800/90",
                "transition-opacity duration-200",
                showRightFade ? "opacity-100" : "opacity-0"
              )}
            />
          </div>

          {/* Content area */}
          <div
            className={cn(
              isMobile
                ? "p-4 flex-1 overflow-y-auto space-y-4"
                : "p-4 max-h-[calc(100vh-400px)] overflow-y-auto space-y-4"
            )}
          >
            {sections.find((s) => s.id === activeSection)?.content}
          </div>
        </div>
      )}

      {isCollapsed && !isMobile && (
        <div className="text-sm text-cream-700 dark:text-cream-300 p-3">
          <p className="text-center">Click to expand garden information</p>
        </div>
      )}
    </motion.div>
  );
}
