"use client";

import Image from "next/image";

const Model = () => {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
      <div
        className="bg-white border-4 border-black rounded-lg shadow-xl 
   w-[300px] h-[400px] md:w-[400px] md:h-[550px] flex items-center justify-center"
      >
        <Image
          src={"/logo.png"}
          alt="The GreenThumb logo"
          priority
          height={500}
          width={500}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Model;
