import React from "react";

// Define the props interface for the InsightRoll component
interface InsightRollProps {
  insights: string[]; // Array of strings representing insights
}

// Define the InsightRoll functional component
const InsightRoll: React.FC<InsightRollProps> = ({ insights }) => {
  return (
    // Main container for the insight roll, with styling for background and text colors
    <div
      className="w-full whitespace-nowrap overflow-hidden
    bg-accent dark:bg-accentDark 
    text-light dark:text-dark"
    >
      {/* Inner container with animation and text styling */}
      <div
        className="animate-roll w-full flex items-center justify-center capitalize font-semibold tracking-wider 
      text-sm sm:text-base
      py-2 sm:py-3"
      >
        {/* Map over the insights array and render each insight with a separator */}
        {insights.map((text, index) => (
          <div key={index}>
            {text} <span className="px-4">|</span>{" "}
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the InsightRoll component as the default export
export default InsightRoll;
