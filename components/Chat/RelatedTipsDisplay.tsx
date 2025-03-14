"use client";

import TipCard from "@/components/Tips/TipCard";
import { Button } from "@/components/ui/button";
import { Tip } from "@/types/Tip";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type RelatedTipsDisplayProps = {
  relatedTips: Tip[];
  title?: string;
};

export default function RelatedTipsDisplay({
  relatedTips,
  title = "Related Tips & Tricks",
}: RelatedTipsDisplayProps) {
  const [expanded, setExpanded] = useState(false);

  if (!relatedTips || relatedTips.length === 0) {
    return null;
  }

  // Always show first 2 tips, show more when expanded
  const visibleTips = expanded ? relatedTips : relatedTips.slice(0, 2);

  // Convert RelatedTip to Tip format for TipCard
  const convertToTipFormat = (relatedTip: Tip): Tip => {
    return {
      ...relatedTip,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        {relatedTips.length > 2 && (
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
                <span>Show all {relatedTips.length}</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>

      <motion.div
        className="grid grid-cols-1 gap-3"
        animate={{ height: "auto" }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {visibleTips.map((tip, index) => (
            <motion.div
              key={`${tip.slug}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TipCard tip={convertToTipFormat(tip)} variant="horizontal" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
