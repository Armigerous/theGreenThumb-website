"use client";

import { PlantCardData } from "@/types/plant";
import PlantCard from "@/components/Database/PlantCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type RelatedPlantsDisplayProps = {
  plantResults: PlantCardData[];
  title?: string;
};

export default function RelatedPlantsDisplay({
  plantResults,
  title = "Related Plants",
}: RelatedPlantsDisplayProps) {
  const [expanded, setExpanded] = useState(false);

  if (!plantResults || plantResults.length === 0) {
    return null;
  }

  // Always show first 2 plants, show more when expanded
  const visiblePlants = expanded ? plantResults : plantResults.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        {plantResults.length > 2 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1"
          >
            {expanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>Show all {plantResults.length}</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        animate={{ height: "auto" }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {visiblePlants.map((plant, index) => (
            <motion.div
              key={`${plant.slug}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PlantCard plant={plant} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
