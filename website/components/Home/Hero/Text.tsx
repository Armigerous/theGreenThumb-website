import React from "react";
import { CheckmarkIcon } from "@sanity/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Text = () => {
  return (
    <div className="text-left md:w-1/2 mb-6 md:mb-0 pt-20 lg:pt-0 px-5">
      <p className="text-medium sm:text-base lg:text-lg mb-4 italic">
        For North Carolina Gardeners
      </p>
      {/* Big */}
      <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-normal md:leading-relaxed lg:leading-normal">
        Your Garden&apos;s{" "}
        <span className="bg-brand-700 p-2 rounded-xl text-white">Smartest</span>{" "}
        Tool is Here!
      </h1>
      <p className="mb-4 text-sm md:text-xl max-w-full md:max-w-96">
        Effortlessly monitor and optimize your
        <span className="font-bold"> plants&apos; </span>health with real-time
        insights in order to keep them
        <span className="font-bold"> healthy and thriving.</span>
      </p>
      {/* Checklist of Features */}
      <ul className="list-none space-y-2 text-sm md:text-lg">
        <li className="flex items-center font-bold">
          <CheckmarkIcon />
          <span>
            <span className="underline">Simple</span> recommendations
          </span>
        </li>
        <li className="flex items-center font-bold">
          <CheckmarkIcon />
          <span>
            <span className="underline">24/7</span> monitoring
          </span>
        </li>
        <li className="flex items-center font-bold">
          <CheckmarkIcon />
          <span>
            Simple and <span className="underline">beautiful</span> design
          </span>
        </li>
        <li className="flex items-center font-bold">
          <CheckmarkIcon />
          <span>
            Perfect for <span className="underline">any</span> level of gardener
          </span>
        </li>
      </ul>
      <Link href="/tips">
        <Button variant={"default"} className="mt-6 w-full">
          Start Growing Smarter
        </Button>
      </Link>
    </div>
  );
};

export default Text;
