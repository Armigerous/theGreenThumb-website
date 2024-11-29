import React from "react";
import InsightRoll from "../../components/About/InsightRoll";

interface AboutLayoutProps {
  children: React.ReactNode;
}

// What's on the Insight Roll
const insights: string[] = [
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  "penis",
  // Add more insights as needed
];

const AboutLayout: React.FC<AboutLayoutProps> = ({ children }) => {
  return (
    <main>
      <div className="w-full flex flex-col items-center justify-between">
        <InsightRoll insights={insights} />
        {children}
      </div>
    </main>
  );
};

export default AboutLayout;
