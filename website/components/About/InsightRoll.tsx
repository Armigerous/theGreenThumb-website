"use client";

import React from "react";
import { motion } from "framer-motion";

// Define the props interface for the InsightRoll component
interface InsightRollProps {
  insights: string[]; // Array of strings representing insights
}

// Define the InsightRoll functional component
const InsightRoll: React.FC<InsightRollProps> = ({ insights }) => {
  // Concatenate the insights with themselves to create a seamless loop
  const seamlessInsights = [...insights, ...insights];

  return (
    // Main container for the insight roll, with styling for background and text colors
    <div className="relative w-full overflow-hidden bg-primary text-cream-50 whitespace-nowrap">
      {/* Inner container with Framer Motion animation */}
      <motion.div
        className="flex items-center justify-start capitalize font-semibold tracking-wider text-sm sm:text-base py-2 sm:py-3"
        initial={{ x: 0 }}
        animate={{ x: `-${100 / insights.length}%` }} // Adjust movement based on the length
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: insights.length * 4, // Adjust duration for slower/smoother scrolling
          ease: "linear",
        }}
      >
        {/* Map over the seamless insights array and render each insight with no gap */}
        {seamlessInsights.map((text, index) => (
          <div key={index} className="inline-flex items-center">
            {text} <span className="px-2">|</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Export the InsightRoll component as the default export
export default InsightRoll;
