// Import React to use JSX and create a functional component
import React from "react";
// Import the Metadata type from Next.js for typing metadata properties
import { Metadata } from "next";
// Import custom components used in the About page
import CoverSection from "@/components/About/CoverSection";
import Conclusion from "@/components/About/Conclusion";
import MeetTeam from "@/components/About/MeetTeam";
import TechOverview from "@/components/About/TechOverview";
import JourneyTimeline from "@/components/About/JourneyTimeline";
import FutureVision from "@/components/About/FutureVision";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";

// Define and export metadata for the About page
export const metadata: Metadata = {
  title: "About The Official GreenThumb", // The title of the page
  description: `Learn more about the team working behind The GreenThumb`, // The description of the page
};

// Define the About functional component using React
const About: React.FC = () => {
  return (
    <MaxWidthWrapper className="flex flex-col gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-8 lg:px-16 xl:px-24">
      <CoverSection />
      <MeetTeam />
      <TechOverview />
      <JourneyTimeline />
      <FutureVision />
      <Conclusion />
    </MaxWidthWrapper>
  );
};

// Export the About component as the default export
export default About;
