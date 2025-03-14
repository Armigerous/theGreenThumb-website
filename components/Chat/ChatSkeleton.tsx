import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Leaf, Info, MapPin, Sun, Calendar } from "lucide-react";

export function ChatSkeleton() {
  return (
    <div className="container mx-auto p-4 my-12">
      <div className="flex flex-col lg:flex-row justify-center gap-6 max-w-7xl mx-auto">
        {/* Main chat area */}
        <div className="w-full lg:w-2/3 max-w-3xl mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Project Description Skeleton */}
            <motion.div className="w-full mx-auto border border-brand-200 dark:border-brand-700 rounded-lg p-6 shadow-lg">
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" /> {/* Title */}
                <Skeleton className="h-20 w-full" /> {/* Description */}
                {/* Garden Info Section */}
                <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-1">
                    <Leaf className="h-4 w-4" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" /> {/* Section Title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Skeleton className="h-5 w-5" /> {/* Icon */}
                          <Skeleton className="h-5 flex-1" /> {/* Text */}
                        </div>
                      ))}
                  </div>
                </div>
                <Skeleton className="h-16 w-full mt-4" />{" "}
                {/* Example questions */}
              </div>
            </motion.div>

            {/* Chat Input and Response Area */}
            <motion.div className="rounded-lg w-full shadow-sm bg-cream-100 dark:bg-cream-800">
              <div className="flex flex-col w-full justify-between gap-4 p-4">
                {/* Input Form */}
                <div className="flex space-x-2">
                  <Skeleton className="h-10 flex-1" /> {/* Input field */}
                  <Skeleton className="h-10 w-10" /> {/* Send button */}
                </div>

                {/* Loading Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <Skeleton className="h-4 w-64 mx-auto" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Garden info side panel - skeleton */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block w-full lg:w-1/3 max-w-xs lg:sticky top-20 self-start h-fit"
        >
          <div className="flex flex-col border border-cream-200 dark:border-cream-700 bg-cream-50 dark:bg-cream-900 rounded-md overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-brand-50 dark:bg-brand-900/30 border-b border-cream-200 dark:border-cream-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-brand-500" />
                  <div>
                    <Skeleton className="h-6 w-32" />{" "}
                    {/* Garden Profile title */}
                    <Skeleton className="h-4 w-24 mt-1" /> {/* Garden name */}
                  </div>
                </div>
                <Skeleton className="h-8 w-8" /> {/* Edit button */}
              </div>
            </div>

            {/* Section tabs */}
            <div className="flex overflow-x-auto bg-cream-100/50 dark:bg-cream-800/50 border-b border-cream-200 dark:border-cream-700 p-2 gap-1">
              {[
                { icon: <Info className="h-4 w-4" />, width: "w-24" },
                { icon: <MapPin className="h-4 w-4" />, width: "w-20" },
                { icon: <Sun className="h-4 w-4" />, width: "w-28" },
                { icon: <Calendar className="h-4 w-4" />, width: "w-24" },
              ].map((section, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded-md whitespace-nowrap"
                >
                  {section.icon}
                  <Skeleton className={`h-4 ${section.width}`} />
                </div>
              ))}
            </div>

            {/* Content area */}
            <div className="p-4 max-h-[calc(100vh-400px)] overflow-y-auto space-y-4">
              {/* Basic info section */}
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-4 w-4" /> {/* Icon */}
                        <Skeleton className="h-4 w-24" /> {/* Section title */}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array(3)
                          .fill(0)
                          .map((_, j) => (
                            <Skeleton
                              key={j}
                              className="h-6 w-20"
                            /> /* Badges */
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile garden info button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}
