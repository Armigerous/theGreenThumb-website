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
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [-200, 200]);

  // Options for light mode animation
  const optionsLight = {
    animationData: item.animationData,
    loop: true,
    autoplay: true,
  };

  const style = {
    height: "auto",
    width: "auto",
  };

  const lottieLight = useLottie(optionsLight, style);

  return (
    <section>
      <div className="flex items-center justify-center h-full w-full overflow-hidden mt-10">
        <div className="max-w-[1366px] lg:max-w-screen-lg h-full m-auto flex items-center justify-center gap-12">
          <div className="flex-1 h-1/2" ref={ref}>
            <div className="bg-cream-700 border-black rounded-3xl">
              {lottieLight.View}
            </div>
          </div>
          <motion.div className="flex-1 flex flex-col gap-7" style={{ y }}>
            <h2 className="text-7xl">{item.title}</h2>
            <p className="text-xl">{item.desc}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="bg-secondary text-light text-xl border-none rounded-xl p-3 w-48 cursor-pointer"
            >
              Read More
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Single;
