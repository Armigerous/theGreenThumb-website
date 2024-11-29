// Import the necessary modules
import Image from "next/image";
import React from "react";
// Import the profile image

// Define the AboutCoverSection functional component
const AboutCoverSection: React.FC = () => {
  return (
    <section
      className="w-full border-b-2 border-solid flex 
      flex-col md:flex-row 
      md:h-[75vh]
      items-center justify-center 
      border-dark dark:border-light
      text-dark dark:text-light"
    >
      {/* Container for the image */}
      <div
        className="h-full border-solid flex justify-center
        w-full md:w-1/2
        border-b-2 md:border-b-0 md:border-r-2 
        border-dark dark:border-light"
      >
        {/* Profile image with responsive sizing and priority loading */}
        <Image
          src="/logo.png"
          width={500}
          height={500}
          alt="The GreenThumb"
          className="h-full object-contain object-center
          w-4/5 xs:w-3/4 md:w-full"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1180px) 50vw, 50vw"
        />
      </div>

      {/* Container for the text content */}
      <div
        className="flex flex-col text-left items-start justify-center 
        py-6 md:py-0
        w-full md:w-1/2
        xs:p-10 pb-10 
        px-5 lg:px-16"
      >
        {/* Section heading */}
        <h2
          className="font-bold capitalize 
          text-center lg:text-left 
          text-4xl xs:text-5xl sxl:text-6xl"
        >
          For Those Who Don&apos;t Have One
        </h2>
        {/* Section paragraph */}
        <p className="font-medium mt-4 text-base">
          We want to help you North Carolina
        </p>
      </div>
    </section>
  );
};

// Export the AboutCoverSection component as the default export
export default AboutCoverSection;
