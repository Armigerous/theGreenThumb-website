"use client";

import React from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Text = () => {
  return (
    <motion.div
      className="text-left md:w-1/2 mb-6 md:mb-0 pt-20 lg:pt-0 px-4"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.p
        className="text-medium sm:text-base lg:text-lg mb-4 italic"
        variants={fadeInUp}
      >
        For North Carolina Gardeners
      </motion.p>
      <motion.h1
        className="text-3xl md:text-5xl font-bold mb-4 leading-normal md:leading-relaxed lg:leading-normal"
        variants={fadeInUp}
      >
        Your Garden&apos;s{" "}
        <span className="bg-primary text-cream-50 p-2 rounded-xl relative">
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              delay: 1,
            }}
          />
          Smartest
        </span>{" "}
        Tool is Here!
      </motion.h1>
      <motion.p
        className="mb-4 text-sm md:text-xl max-w-full"
        variants={fadeInUp}
      >
        Effortlessly monitor and optimize your
        <strong> plants&apos; </strong>health with real-time insights in order
        to keep them
        <strong> healthy and thriving.</strong>
      </motion.p>
      <motion.ul
        className="list-none space-y-2 text-sm md:text-lg"
        aria-label="Key features"
        variants={staggerContainer}
      >
        {[
          { text: "Simple recommendations", underline: "Simple" },
          { text: "24/7 monitoring", underline: "24/7" },
          { text: "Simple and beautiful design", underline: "beautiful" },
          { text: "Perfect for any level of gardener", underline: "any" },
        ].map((item, index) => (
          <motion.li
            key={index}
            className="flex items-center font-bold"
            variants={fadeInUp}
          >
            <CheckIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>
              {item.text.split(item.underline).map((part, i) =>
                i === 0 ? (
                  part
                ) : (
                  <React.Fragment key={i}>
                    <u>{item.underline}</u>
                    {part}
                  </React.Fragment>
                )
              )}
            </span>
          </motion.li>
        ))}
      </motion.ul>
      <motion.div variants={fadeInUp}>
        <Link href="/tips" passHref>
          <Button
            variant={"default"}
            className="flex justify-center items-center mt-6 w-full text-cream-50 text-lg md:text-xl 
          lg:text-2xl py-6 bg-primary transition-all transform hover:scale-105 
          focus:ring focus:ring-brand-600 shadow-lg"
            aria-label="Start Growing Smarter - Navigate to gardening tips"
          >
            <span className="mr-2">Start Growing Smarter</span>
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Text;
