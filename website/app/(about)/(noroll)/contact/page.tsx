// Import the Metadata type from Next.js for typing metadata properties
import { Metadata } from "next";
// Import custom components used in the Contact page
import LottieAnimation from "@/components/Contact/LottieAnimation";
import ContactForm from "@/components/Contact/ContactForm";
// Import site metadata utility for accessing global site information
import siteMetaData from "@/lib/siteMetaData";

// Define and export metadata for the Contact page
export const metadata: Metadata = {
  title: "Contact The Official GreenThumb", // The title of the page
  description: `Contact us through the form available on this page, or email us at ${siteMetaData.email}`, // The description of the page, including email from site metadata
};

// Define the Contact functional component using React
const Contact: React.FC = () => {
  return (
    <section
      className="w-full border-b-2 border-solid flex items-center justify-center 
      flex-col md:flex-row
      h-auto md:h-[75vh]
      text-dark dark:text-light
      border-dark dark:border-light"
      // Styling the main container to be responsive and adaptable to light/dark modes
    >
      <div
        className="inline-block h-full border-solid 
        w-full md:w-2/5
        border-dark dark:border-light
        border-b-2 md:border-b-0 md:border-r-2"
        // Styling the animation container to be responsive and adaptable to light/dark modes
      >
        {/* Render the LottieAnimation component */}
        <LottieAnimation />
      </div>
      <div
        className="flex flex-col justify-center pb-8
        py-6 md:py-0
        w-full md:w-3/5
        px-5 xs:px-10 md:px-16
        items-center md:items-start"
        // Styling the form container to be responsive and adaptable to light/dark modes
      >
        <h2
          className="font-bold capitalize 
          text-2xl xs:text-3xl sm:text-4xl"
          // Styling the heading to be responsive
        >
          Contact Us!
        </h2>
        {/* Render the ContactForm component */}
        <ContactForm />
      </div>
    </section>
  );
};

// Export the Contact component as the default export
export default Contact;
