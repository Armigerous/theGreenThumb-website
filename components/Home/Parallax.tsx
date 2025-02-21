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
      <motion.h2
        style={{ y: yText }}
        className="text-[10vw] sm:text-[8vh] md:text-[12vh] lg:text-[15vh] text-center font-black text-brand-500 z-10"
      >
        {type === "product" ? "Product Features" : "App Features"}
      </motion.h2>

      {/* Background Layers */}
      <motion.div className="absolute z-30 w-full h-full bg-cover bg-bottom bg-[url('/Parallax/grass.svg')]" />

      <motion.div
        className="absolute z-30 w-full h-full bg-cover bg-bottom bg-[url('/Parallax/vines.svg')]"
        style={{ y: yBg }}
      />

      <motion.div
        className="absolute z-30 w-full h-full bg-cover bg-bottom bg-[url('/Parallax/butterflies.svg')]"
        style={{ x: yBg }}
      />
    </div>
  );
};

export default Parallax;
