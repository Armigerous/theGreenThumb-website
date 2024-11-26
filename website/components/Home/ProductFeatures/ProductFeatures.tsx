/* eslint-disable @typescript-eslint/no-require-imports */

"use client";
// ProductFeatures.tsx
import React, { useRef } from "react";
import Single from "./Single"; // Ensure the path is correct
import { motion, useScroll, useSpring } from "framer-motion";

interface Item {
  id: number;
  title: string;
  animationData: string;
  desc: string;
  longDesc: string;
}

const items: Item[] = [
  {
    id: 1,
    title: "Advanced Sensor Technology",
    animationData: require("/public/ProductFeatures/sensor.json"),
    desc: "The GreenThumb utilizes cutting-edge sensor technology to gather crucial data on your garden's environment. This includes light, pH levels, conductivity, temperature, moisture, and connectivity, ensuring precise data collection for optimal plant health.",
    longDesc:
      "The GreenThumb's advanced sensor technology is designed to provide comprehensive monitoring of your garden's environment. By collecting real-time data on light, pH levels, conductivity, temperature, moisture, and connectivity, the system ensures that every aspect of your garden's conditions is meticulously tracked. This detailed data collection enables The GreenThumb to offer accurate and timely recommendations, helping gardeners maintain the ideal environment for their plants to thrive. Whether you are a novice or an experienced gardener, these sensors provide the essential insights needed to optimize plant health and growth.",
  },
  {
    id: 2,
    title: "Intelligent Data Analysis",
    animationData: require("/public/ProductFeatures/analysis.json"),
    desc: "The GreenThumb analyzes collected data using advanced AI algorithms, providing actionable insights and personalized gardening recommendations. This intelligent analysis helps prevent plant deaths and improves overall gardening efficiency.",
    longDesc:
      "The GreenThumb leverages advanced AI algorithms to analyze the vast amounts of data collected by its sensors. This intelligent data analysis transforms raw data into actionable insights, offering personalized recommendations tailored to the specific needs of your garden. By understanding the unique conditions of your gardening space, The GreenThumb helps prevent common issues that lead to plant deaths and enhances the overall efficiency of your gardening practices. This analysis not only promotes healthier plants but also ensures that gardeners, regardless of their experience level, can achieve optimal results with minimal effort.",
  },
  {
    id: 3,
    title: "Plant Ranking",
    animationData: require("/public/ProductFeatures/ranking.json"),
    desc: "The GreenThumb ranks plants based on their likelihood to thrive in current conditions, considering symbiotic relationships with nearby plants. This feature promotes the creation of food forests and enhances plant compatibility in your garden.",
    longDesc:
      "One of the standout features of The GreenThumb is its ability to rank plants based on their likelihood to thrive under current environmental conditions. This ranking system takes into account not just the individual needs of each plant, but also their symbiotic relationships with neighboring plants. By promoting the concept of food forests, where plants support each other’s growth, The GreenThumb helps gardeners create a more sustainable and productive garden ecosystem. This holistic approach ensures that every plant has the best chance to flourish, contributing to a healthier and more diverse garden.",
  },
  {
    id: 4,
    title: "Comprehensive Gardening Solution",
    animationData: require("/public/ProductFeatures/plant.json"),
    desc: "The GreenThumb combines a user-friendly sensor stick and an intuitive app to provide a complete gardening solution. From real-time data collection to intelligent recommendations, it simplifies and enhances the gardening experience.",
    longDesc:
      "The GreenThumb is designed as a comprehensive solution for all your gardening needs. It combines a user-friendly sensor stick with an intuitive app to deliver a seamless experience from data collection to actionable recommendations. The sensor stick gathers real-time data on various environmental factors, while the app analyzes this data and provides insights to help you maintain optimal plant health. This integrated approach simplifies gardening, making it accessible and effective for everyone, from urban gardeners and hobbyists to families looking to improve their gardening practices.",
  },
];

const ProductFeatures: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <div className="no-scrollbar relative m-5" ref={ref}>
      <div className="sticky top-[5vh] left-0 pt-24 lg:pt-16 text-dark dark:text-light">
        <div className="flex w-full flex-col items-center justify-center m-2 gap-5">
          <h1 className="font-black text-6xl w-fit">Product Features</h1>

          <motion.div
            style={{ scaleX }}
            className="w-full h-3 bg-secondary dark:bg-secondaryDark rounded-md"
          />
        </div>
      </div>

      {items.map((item) => (
        <Single item={item} key={item.id} />
      ))}
    </div>
  );
};

export default ProductFeatures;
