"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxProps {
  type: "product" | "app";
}

const Parallax: React.FC<ParallaxProps> = ({ type }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "500%"]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      className="w-screen h-screen relative flex items-center justify-center overflow-hidden"
      ref={ref}
    >
      {/* Responsive Text */}
      <motion.h1
        style={{ y: yText }}
        className="text-[10vw] sm:text-[8vh] md:text-[12vh] lg:text-[15vh] text-center font-black text-brand-500 z-10"
      >
        {type === "product" ? "Product Features" : "App Features"}
      </motion.h1>

      {/* Background Layers */}
      <motion.div
        className="absolute z-30 w-full h-full bg-cover bg-bottom"
        style={{ y: yBg }}
      >
        <div
          className="w-full h-full"
          style={{ backgroundImage: `url('/Parallax/grass.svg')` }}
        />
      </motion.div>

      <motion.div
        className="absolute z-30 w-full h-full bg-cover bg-bottom"
        style={{ y: yBg }}
      >
        <div
          className="w-full h-full"
          style={{ backgroundImage: `url('/Parallax/vines.svg')` }}
        />
      </motion.div>

      <motion.div
        className="absolute z-30 w-full h-full bg-cover bg-bottom"
        style={{ y: yBg }}
      >
        <div
          className="w-full h-full"
          style={{ backgroundImage: `url('/Parallax/butterflies.svg')` }}
        />
      </motion.div>
    </div>
  );
};

export default Parallax;
