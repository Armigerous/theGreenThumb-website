import React from "react";

// List of skills to be displayed
const SkillList = [
  "next.js",
  "tailwind css",
  "figma",
  "javaScript",
  "web design",
  "Gatsby.js",
  "strapi",
  "firebase",
  "generative AI",
  "wireframing",
  "SEO",
  "framer motion",
  "sanity",
];

// Define the Skills functional component
const Skills: React.FC = () => {
  return (
    // Main container for the skills section
    <section
      className="w-full flex flex-col border-b-2 border-solid
    p-5 xs:p-10 sm:p-12 md:p-16 lg:p-20
    border-dark dark:border-light
    text-dark dark:text-light"
    >
      {/* Section title */}
      <span
        className="font-semibold
      text-2xl sm:text-3xl md:text-4xl
      text-center lg:text-left
      text-accent dark:text-accentDark"
      >
        Skills
      </span>
      {/* List of skills */}
      <ul
        className="flex flex-wrap mt-8
      justify-center xs:justify-start"
      >
        {/* Map over the SkillList array and render each skill */}
        {SkillList.map((item, index) => {
          return (
            <li
              key={index}
              className="inline-block capitalize border-2 border-solid rounded-lg
              hover:scale-105 transition-all ease duration-200 cursor-pointer
              text-base xs:text-lg sm:text-xl md:text-2xl
              py-2 xs:py-3 sm:py-4 lg:py-5
              px-4 xs:px-6 sm:px-8 lg:px-12
              mr-3 xs:mr-4 md:mr-6
              mb-3 xs:mb-4 md:mb-6
              border-dark dark:border-light
              font-semibold dark:font-normal"
            >
              {item}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

// Export the Skills component as the default export
export default Skills;
