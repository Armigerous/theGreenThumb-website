"use client";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { useRef } from "react";
import Link from "next/link";
import { AppFeature, FeaturesApp } from "@/types/features";

const variants = {
  initial: {
    x: -300,
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

const AppFeatures: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-50px" });

  return (
    <motion.div
      className="h-auto lg:h-screen flex flex-col justify-center items-center overflow-hidden"
      variants={variants}
      initial="initial"
      ref={ref}
      animate={isInView && "animate"}
    >
      <motion.div
        className="mt-[8vh] flex flex-col sm:flex-row sm:self-end items-center pr-1 
        sm:pr-0 text-center sm:text-right text-cream-600 text-md sm:text-2xl font-light"
        variants={variants}
      >
        <p>
          We are helping your garden grow
          <br /> and be more beautiful
        </p>
        <hr className="hidden sm:block w-80 border-t border-cream-400" />
      </motion.div>

      {/* Main Content */}
      <MaxWidthWrapper className="flex flex-col items-center text-left flex-grow justify-center">
        <motion.div className="mb-16 sm:mb-28" variants={variants}>
          <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
            <Image
              width={72}
              height={24}
              src="/planting.png"
              alt="Planting"
              className="w-48 sm:w-72 h-14 sm:h-24 rounded-xl object-cover pointer-events-none"
            />
            <h1 className="text-4xl sm:text-8xl font-thin text-cream-800">
              <motion.b className="hover:text-primary font-black">
                A New
              </motion.b>{" "}
              Assistant
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-5 mt-5 text-cream-800">
            <h1 className="text-4xl sm:text-8xl font-thin">
              <motion.b className="hover:text-primary font-black">
                For Your
              </motion.b>{" "}
              Garden.
            </h1>
            <Button className="w-48 sm:w-72 h-16 sm:h-20 rounded-xl text-lg sm:text-2xl font-bold text-cream-50 bg-primary">
              <Link href="/contact">ASK US DIRECTLY</Link>
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={variants}
          initial="initial"
          ref={ref}
          animate={isInView && "animate"}
          className="flex flex-wrap justify-center sm:justify-between gap-5 sm:gap-8 my-4"
        >
          {FeaturesApp.map((feature: AppFeature, index) => (
            <Card key={index} className="w-full sm:w-[30%] h-full shadow-lg">
              <CardHeader>
                <CardTitle className="line-clamp-1">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="line-clamp-2 md:line-clamp-3">
                <p>{feature.content} </p>
              </CardContent>
              <CardFooter className="mt-1">
                <Button
                  className="w-full bg-primary text-cream-50 text-base sm:text-xl 
                   transition-all ease-in"
                >
                  <Link href={feature.url}>Read More</Link>
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
