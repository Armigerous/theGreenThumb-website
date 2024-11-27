import { Button } from "@/components/ui/button";
import { Item } from "@/types/features";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLottie } from "lottie-react";
import React, { useRef } from "react";

const Single: React.FC<{ item: Item }> = ({ item }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.6, 1], [0, 1, 0]);

  const options = {
    animationData: item.animationData,
    loop: true,
    autoplay: true,
  };

  const lottie = useLottie(options, { height: "100%", width: "100%" });

  return (
    <section ref={ref}>
      <motion.div
        className="flex flex-col lg:flex-row items-center justify-center h-auto lg:h-screen w-full overflow-hidden gap-10 lg:gap-12"
        style={{ y, opacity }}
      >
        <div className="flex-1 flex justify-center">
          <div className="bg-cream-800 border-black rounded-3xl w-[80%] lg:w-full max-w-[400px] lg:max-w-none">
            {lottie.View}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-5 lg:gap-7 text-left">
          <h2 className="text-2xl md:text-4xl lg:text-5xl">{item.title}</h2>
          <p className="text-sm md:text-base lg:text-lg">{item.desc}</p>
          <Button className="px-4 py-2 bg-brand-600 text-cream-50 rounded-md mx-auto lg:mx-0">
            Read More
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default Single;
