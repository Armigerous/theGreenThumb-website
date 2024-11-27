import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLottie } from "lottie-react";
import React, { useRef } from "react";

interface Item {
  id: number;
  title: string;
  animationData: string;
  desc: string;
  longDesc: string;
}

interface SingleProps {
  item: Item;
}

const Single: React.FC<SingleProps> = ({ item }) => {
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

  const style = { height: "auto", width: "auto" };
  const lottie = useLottie(options, style);

  return (
    <section ref={ref}>
      <motion.div
        className="flex items-center justify-center h-screen w-full overflow-hidden"
        style={{ y, opacity }}
      >
        <div className="max-w-[1366px] lg:max-w-screen-lg h-full flex items-center gap-12">
          <div className="flex-1">
            <div className="bg-cream-700 border-black rounded-3xl">
              {lottie.View}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-7">
            <h2 className="text-7xl">{item.title}</h2>
            <p className="text-xl">{item.desc}</p>
            <Button className="px-4 py-2 bg-brand-600 text-white rounded-md">
              Read More
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Single;
