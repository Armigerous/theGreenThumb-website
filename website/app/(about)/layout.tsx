import InsightRoll from "@/components/InsightRoll";
import React from "react";

interface AboutLayoutProps {
  children: React.ReactNode;
}

const insights: string[] = [
  "Plants convert sunlight into energy through photosynthesis.",
  "Overwatering is one of the most common mistakes in plant care.",
  "Some plants, like succulents, thrive in arid conditions.",
  "Soil pH plays a critical role in nutrient availability for plants.",
  "Companion planting can improve yields and deter pests.",
  "Plants communicate through chemical signals in their roots.",
  "Mulching helps retain moisture and suppress weeds.",
  "Certain indoor plants can improve air quality.",
  "Rotating crops helps prevent soil nutrient depletion.",
  "Pollinators, like bees, are essential for many flowering plants.",
];

const AboutLayout: React.FC<AboutLayoutProps> = ({ children }) => {
  return (
    <main>
      {/* InsightRoll is now at a persistent level */}
      <InsightRoll insights={insights} />

      <div className="flex flex-col items-center justify-between">
        {children}
      </div>
    </main>
  );
};

export default AboutLayout;
