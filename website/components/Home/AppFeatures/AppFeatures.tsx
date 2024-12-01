"use client";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { useRef } from "react";
import Link from "next/link";

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
    description:
      "Your AI Chat assistant for garden updates and daily summaries.",
    content:
      "The GreenThumb app includes an AI Chat feature that enhances user interaction and garden management. Each day, the AI Chat provides a summary of your garden's status, detailing the health of your plants and any immediate actions required. This feature ensures that you are always informed about the state of your garden, making it easier to manage and maintain.",
  },
  {
    title: "Garden Schedule in Calendar View",
    description: "Plan and track your gardening tasks with ease.",
    content:
      "The GreenThumb app's calendar view is an essential tool for organizing and managing your garden maintenance tasks. This feature allows you to schedule and track upcoming activities, ensuring that you stay on top of important gardening tasks. Whether it's watering, fertilizing, or pruning, the calendar view helps you plan your gardening activities efficiently.",
  },
  {
    title: "Detailed Sensor Data and Graphical Views",
    description: "Visualize trends and optimize plant health.",
    content:
      "The GreenThumb app provides detailed presentations of sensor data collected throughout the day, offering a comprehensive view of your garden's environmental conditions. Graphical views help users visualize changes in their garden environment, making it easier to identify patterns and respond proactively.",
  },
];

const AppFeatures: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-10px" });

  return (
    <motion.div
      className="h-auto lg:h-screen flex flex-col justify-center items-center overflow-hidden"
      variants={variants}
      initial="initial"
      ref={ref}
      animate={isInView && "animate"}
    >
      <motion.div
        className="mt-[8vh] flex flex-col sm:flex-row sm:self-end items-center pr-1 sm:pr-0 text-center sm:text-right text-cream-600 text-md sm:text-2xl font-light"
        variants={variants}
      >
        <p>
          We are helping your garden grow
          <br /> and be more beautiful
        </p>
        <hr className="hidden sm:block w-80 border-t border-cream-400" />
      </motion.div>

      {/* Main Content */}
      <MaxWidthWrapper className="flex flex-col items-center text-center flex-grow justify-center pt-5">
        <motion.div className="mb-10 sm:mb-16" variants={variants}>
          <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
            <Image
              width={72}
              height={24}
              src="/planting.png"
              alt="Planting"
              className="w-48 sm:w-72 h-14 sm:h-24 rounded-full object-cover"
            />
            <h1 className="text-4xl sm:text-8xl font-thin text-cream-800">
              <motion.b className="hover:text-green-700 font-black">
                A New
              </motion.b>{" "}
              Assistant
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-5 mt-5 text-cream-800">
            <h1 className="text-4xl sm:text-8xl font-thin">
              <motion.b className="hover:text-green-700 font-black">
                For Your
              </motion.b>{" "}
              Garden.
            </h1>
            <Button className="w-48 sm:w-72 h-16 sm:h-20 rounded-full text-lg sm:text-2xl font-bold text-cream-50 bg-brand-700">
              <Link href="/contact">ASK US DIRECTLY</Link>
            </Button>
          </div>
        </motion.div>
      </MaxWidthWrapper>

      {/* Feature Cards */}
      <MaxWidthWrapper className="mt-auto pb-2">
        <motion.div
          variants={variants}
          initial="initial"
          ref={ref}
          animate={isInView && "animate"}
          className="flex flex-wrap justify-center sm:justify-between gap-5 sm:gap-8"
        >
          {featureDetails.map((feature, index) => (
            <Card key={index} className="w-full sm:w-[30%] h-full">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="line-clamp-3 my-2">
                <p>{feature.content} </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant={"ghost"}
                  className="w-full bg-green-700 text-cream-50 text-base sm:text-xl"
                >
                  Read more
                </Button>
              </CardFooter>
            </Card>
          ))}
        </motion.div>
      </MaxWidthWrapper>
    </motion.div>
  );
};

export default AppFeatures;
