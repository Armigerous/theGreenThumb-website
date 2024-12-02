"use client";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { FeaturesProduct, ProductFeature } from "@/types/features";
import { motion, useScroll, useSpring } from "framer-motion";
import React, { useRef } from "react";
import Single from "./Single";

const ProductFeatures: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <div className="relative m-5" ref={ref}>
      <MaxWidthWrapper className="max-w-screen-xl">
        <div className="sticky top-[2vh] pt-14 lg:pt-16 text-cream-800 mb-36">
          <div className="flex w-full flex-col items-center gap-5">
            <h1 className="font-black text-3xl md:text-5xl lg:text-6xl text-center">
              Product Features
            </h1>
            <motion.div
              style={{ scaleX }}
              className="w-full h-4 bg-brand-600 rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {FeaturesProduct.map((ProductFeature: ProductFeature, index) => (
            <motion.div
              key={ProductFeature.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2,
                duration: 0.3,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <Single item={ProductFeature} />
            </motion.div>
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default ProductFeatures;
