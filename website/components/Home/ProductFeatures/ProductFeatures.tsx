"use client";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import { FeaturesProduct, ProductFeature } from "@/types/features";
import { motion } from "framer-motion";
import React from "react";
import Single from "./Single";

const ProductFeatures: React.FC = () => {
  return (
    <div className="relative m-5">
      <MaxWidthWrapper className="max-w-screen-xl">
        <div className="sticky top-[2vh] pt-14 lg:pt-16 text-cream-800 mb-36">
          <h1 className="font-black text-3xl md:text-5xl lg:text-6xl text-center">
            Product Features
          </h1>
        </div>

        <div className="flex flex-col gap-10">
          {FeaturesProduct.map((ProductFeature: ProductFeature, index) => (
            <motion.div
              key={ProductFeature.id}
              initial={{ opacity: 0, y: 20 }}
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
