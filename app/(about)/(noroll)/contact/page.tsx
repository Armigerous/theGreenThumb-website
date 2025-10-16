// Import the Metadata type from Next.js for typing metadata properties
import { Metadata } from "next";
// Import custom components used in the Contact page
import LottieAnimation from "@/components/Contact/LottieAnimation";
import ContactForm from "@/components/Contact/ContactForm";
// Import site metadata utility for accessing global site information
import siteMetaData from "@/lib/siteMetaData";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";

// Reason: Enable static generation for faster contact page loading
export const revalidate = false; // Static generation
export const dynamic = "force-static";

// Define and export metadata for the Contact page
export const metadata: Metadata = {
	title: "Contact The Official GreenThumb", // The title of the page
	description: `Contact us through the form available on this page, or email us at ${siteMetaData.email}`, // The description of the page, including email from site metadata
};

// Define the Contact functional component using React
const Contact: React.FC = () => {
	return (
		<MaxWidthWrapper>
			<section
				className="w-full flex items-center justify-center 
      flex-col md:flex-row h-auto md:h-[75vh] text-cream-800"
				// Styling the main container to be responsive and adaptable to light/dark modes
			>
				<div
					className="inline-block h-full  
        w-full md:w-2/5"
					// Styling the animation container to be responsive and adaptable to light/dark modes
				>
					{/* Render the LottieAnimation component */}
					<LottieAnimation />
				</div>
				<div
					className="flex flex-col justify-center
        py-8 md:py-0
        w-full md:w-3/5
        px-5 xs:px-10 md:px-16
        items-center md:items-start"
					// Styling the form container to be responsive and adaptable to light/dark modes
				>
					<h2
						className="font-title-bold capitalize 
          text-2xl xs:text-3xl sm:text-4xl"
						// Styling the heading to be responsive
					>
						Contact Us!
					</h2>
					{/* Render the ContactForm component */}
					<ContactForm />
				</div>
			</section>
		</MaxWidthWrapper>
	);
};

// Export the Contact component as the default export
export default Contact;
