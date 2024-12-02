"use client";

import React, { useEffect, useRef } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import useMeasure from "react-use-measure";
import { LeafIcon } from "lucide-react";

interface InsightRollProps {
  insights: string[];
}

const InsightRoll: React.FC<InsightRollProps> = ({ insights }) => {
  const [ref, bounds] = useMeasure();
  const xTranslation = useMotionValue(0);
  const contentRef = useRef<HTMLDivElement>(null);
  console.log("InsightRoll mounted");
  useEffect(() => {
    const contentWidth = contentRef.current?.offsetWidth || 0; // Get the full width of the content
    const finalPosition = -contentWidth / 2; // Calculate the translation target

    const controls = animate(xTranslation, [0, finalPosition], {
      ease: "linear",
      duration: 40,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
    });

    return () => controls.stop();
  }, [xTranslation, bounds.width]);

  return (
    <div className="w-full bg-primary text-cream-50 whitespace-nowrap overflow-hidden">
      <motion.div
        ref={ref}
        className="flex items-center justify-start capitalize font-semibold tracking-wider text-sm sm:text-base py-2 sm:py-3"
        style={{ x: xTranslation }}
      >
        <div ref={contentRef} className="flex">
          {[...insights, ...insights].map((text, index) => (
            <div key={index} className="inline-flex items-center">
              <LeafIcon size={24} className="mx-2" />
              {text}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InsightRoll;
