"use client";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const variants = {
  initial: {
    x: -500,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
  },
};

const featureDetails = [
  {
    title: "Assistant and Daily Summary",
    content:
      "The GreenThumb app includes an AI Chat feature that enhances user interaction and garden management. Each day, the AI Chat provides a summary of your garden's status, detailing the health of your plants and any immediate actions required. This feature ensures that you are always informed about the state of your garden, making it easier to manage and maintain. The daily summaries are designed to be user-friendly, offering clear and concise information that helps you take timely and effective actions to support your garden's health and productivity.",
  },
  {
    title: "Garden Schedule in Calendar View",
    content:
      "The GreenThumb app's calendar view is an essential tool for organizing and managing your garden maintenance tasks. This feature allows you to schedule and track upcoming activities, ensuring that you stay on top of important gardening tasks. Whether it's watering, fertilizing, or pruning, the calendar view helps you plan your gardening activities efficiently. By providing a visual representation of your garden schedule, this feature ensures that you never miss an important task, making garden management more straightforward and stress-free.",
  },
  {
    title: "Detailed Sensor Data and Graphical Views",
    content:
      "The GreenThumb app provides detailed presentations of sensor data collected throughout the day, offering a comprehensive view of your garden's environmental conditions. In addition to raw data, the app features graphical views that display trends over different periods such as Today, Tomorrow, 1 Week, 1 Month, 1 Year, and Year-to-Date (YTD). These graphical views help users visualize changes in their garden environment, making it easier to identify patterns and respond proactively. By understanding these trends, gardeners can make informed decisions to optimize plant health and growth.",
  },
];

const AppFeatures: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, { margin: "-10px" });

  return (
    <motion.div
      className="h-screen flex flex-col justify-between w-screen p-20 pr-0 overflow-hidden "
      variants={variants}
      initial="initial"
      ref={ref}
      animate={isInView && "animate"}
    >
      <motion.div
        className="mt-[10vh] flex self-end items-center gap-5 text-right text-cream-600 text-2xl"
        variants={variants}
      >
        <p>
          We are planning on helping your garden grow
          <br /> and be more beautiful
        </p>
        <hr className="w-80 border-t border-cream-400" />
      </motion.div>
      <motion.div
        className="flex-2 flex flex-col items-center"
        variants={variants}
      >
        <div className="flex items-center gap-12">
          <Image
            width={72}
            height={24}
            src="/planting.png"
            alt="Planting"
            className="w-72 h-24 rounded-full object-cover"
          />
          <h1 className="text-8xl font-thin text-cream-800 ">
            <motion.b className="hover:text-green-700 font-black">
              A New
            </motion.b>{" "}
            Assistant
          </h1>
        </div>
        <div className="flex flex-row items-center text-center gap-5 mt-5 text-cream-800">
          <h1 className="text-8xl font-thin">
            <motion.b className="hover:text-green-700 font-black">
              For Your
            </motion.b>{" "}
            Garden.
          </h1>
          <Button className="w-72 h-20 rounded-full text-2xl font-bold text-cream-50 bg-brand-700">
            ASK US DIRECTLY
          </Button>
        </div>
      </motion.div>
      <motion.div
        variants={variants}
        initial="initial"
        ref={ref}
        animate={isInView && "animate"}
        className="flex flex-row mr-20 justify-between gap-5"
      >
        {featureDetails.map((feature, index) => (
          <motion.div
            key={index}
            className="p-12 border-2 border-dark flex flex-col justify-between rounded-2xl"
            variants={variants}
          >
            <h2 className="text-2xl font-semibold">{feature.title}</h2>
            <p className="hidden sm:block">
              {feature.content.substring(0, 100)}...
            </p>
            <Button
              variant={"ghost"}
              className="bg-green-700 text-cream-50 text-xl h-full"
            >
              Read more
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AppFeatures;
