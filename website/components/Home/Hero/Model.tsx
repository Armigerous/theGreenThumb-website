"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const imageAnimation = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      type: "spring",
      stiffness: 100,
    },
  },
};

const Model = () => {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
      <motion.div
        className="w-[300px] h-[400px] md:w-[400px] md:h-[550px] flex items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={imageAnimation}
      >
        <Image
          src={"/logo.png"}
          alt="The GreenThumb logo"
          priority
          height={500}
          width={500}
          className="object-contain"
        />
      </motion.div>
    </div>
  );
};

export default Model;
