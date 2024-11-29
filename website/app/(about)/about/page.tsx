// Import the Link component from Next.js for client-side navigation
import Link from "next/link";
// Import React to use JSX and create a functional component
import React from "react";
// Import the Metadata type from Next.js for typing metadata properties
import { Metadata } from "next";
// Import custom components used in the About page
import AboutCoverSection from "../../../components/About/AboutCoverSection";
import Skills from "../../../components/About/Skills";

// Define and export metadata for the About page
export const metadata: Metadata = {
  title: "About The Official GreenThumb", // The title of the page
  description: `Learn more about the team working behind The GreenThumb`, // The description of the page
};

// Define the About functional component using React
const About: React.FC = () => {
  return (
    <>
      {/* Render the AboutCoverSection component */}
      <AboutCoverSection />
      {/* Render the Skills component */}
      <Skills />
      {/* Render a heading with some styling and a link to the contact page */}
      <h2
        className="mt-8 self-start  // Add margin top and align self to start
        mx-5 xs:mx-10 sm:mx-12 md:mx-16  lg:mx-20  // Add responsive horizontal margins
        text-lg md:text-2xl  // Set text size for different screen sizes
        text-dark dark:text-light  // Set text color for light and dark modes
        font-semibold dark:font-normal" // Set font weight for light and dark modes
      >
        Want to get in contact with us? Reach out 📞 from{" "}
        <Link href="/contact" className="!underline underline-offset-2">
          {/* Link to the contact page with an underline style */}
          here
        </Link>
      </h2>
    </>
  );
};

// Export the About component as the default export
export default About;
