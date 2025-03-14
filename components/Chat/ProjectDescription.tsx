import React from "react";
import { Leaf, Sun, Droplets, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { UserGardens } from "@/types/garden";
import useSWR from "swr";

interface ProjectDescriptionProps {
  userGarden?: UserGardens | null;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch garden settings");
  }
  const data = await response.json();
  return data.settings;
};

const ProjectDescription = ({
  userGarden: propUserGarden,
}: ProjectDescriptionProps) => {
  // Use SWR to fetch garden data if not provided via props
  const { data: swrUserGarden } = useSWR<UserGardens | null>(
    // Only fetch if we don't have prop data
    !propUserGarden ? "/api/user-gardens" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
    }
  );

  // Use prop data if available, otherwise use SWR data
  const userGarden = propUserGarden || swrUserGarden;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-brand-200 dark:border-brand-700 rounded-lg p-6 shadow-lg"
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl font-bold text-green-800 dark:text-green-100 mb-4"
      >
        Your Personal Plant Guide
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-cream-700 dark:text-cream-200 mb-6"
      >
        Welcome to your intelligent gardening companion! I&apos;m here to help
        you grow healthy, thriving plants by providing expert advice drawn from
        our extensive plant care database. Whether you&apos;re a beginner or
        experienced gardener, I can assist with all your plant-related
        questions.
      </motion.p>

      {userGarden && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm"
        >
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-1">
            <Leaf className="h-4 w-4" />
            Personalized Garden Assistant
          </div>
          <p className="text-green-600 dark:text-green-300">
            Your responses are personalized based on your garden: &ldquo;
            {userGarden.name}&rdquo;.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-bold text-cream-800 dark:text-cream-100">
          How I Can Help:
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <Leaf className="w-5 h-5 text-primary" />,
              text: "Find the perfect care routine for your specific plants",
            },
            {
              icon: <Sun className="w-5 h-5 text-primary" />,
              text: "Get detailed guidance on watering, light, and growing conditions",
            },
            {
              icon: <Droplets className="w-5 h-5 text-primary" />,
              text: "Identify common plant names and their care requirements",
            },
            {
              icon: <HelpCircle className="w-5 h-5 text-primary" />,
              text: "Receive personalized recommendations for your garden",
            },
          ].map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 w-6 h-6 text-cream-600 dark:text-cream-400">
                {item.icon}
              </div>
              <span className="text-cream-700 dark:text-cream-200">
                {item.text}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-6 text-cream-700 dark:text-cream-200 italic"
      >
        Ask me anything like &quot;How do I care for my Monstera?&quot; or
        &quot;Which plants will grow well in my garden?&quot;
      </motion.p>
    </motion.div>
  );
};

export default ProjectDescription;
