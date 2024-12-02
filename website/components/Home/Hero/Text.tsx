import React from "react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Text = () => {
  return (
    <div className="text-left md:w-1/2 mb-6 md:mb-0 pt-20 lg:pt-0 px-4">
      <p className="text-medium sm:text-base lg:text-lg mb-4 italic">
        For North Carolina Gardeners
      </p>
      <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-normal md:leading-relaxed lg:leading-normal">
        Your Garden&apos;s{" "}
        <span className="bg-primary text-cream-50 p-2 rounded-xl">
          Smartest
        </span>{" "}
        Tool is Here!
      </h1>
      <p className="mb-4 text-sm md:text-xl max-w-full">
        Effortlessly monitor and optimize your
        <strong> plants&apos; </strong>health with real-time insights in order
        to keep them
        <strong> healthy and thriving.</strong>
      </p>
      <ul
        className="list-none space-y-2 text-sm md:text-lg"
        aria-label="Key features"
      >
        {[
          { text: "Simple recommendations", underline: "Simple" },
          { text: "24/7 monitoring", underline: "24/7" },
          { text: "Simple and beautiful design", underline: "beautiful" },
          { text: "Perfect for any level of gardener", underline: "any" },
        ].map((item, index) => (
          <li key={index} className="flex items-center font-bold">
            <CheckIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>
              {item.text.split(item.underline).map((part, i) =>
                i === 0 ? (
                  part
                ) : (
                  <React.Fragment key={i}>
                    <u>{item.underline}</u>
                    {part}
                  </React.Fragment>
                )
              )}
            </span>
          </li>
        ))}
      </ul>
      <Link href="/tips" passHref>
        <Button
          variant={"default"}
          className="flex justify-center items-center mt-6 w-full text-cream-50 text-lg md:text-xl 
          lg:text-2xl py-6 bg-primary transition-all transform hover:scale-105 
          focus:ring focus:ring-brand-600 shadow-lg"
          aria-label="Start Growing Smarter - Navigate to gardening tips"
        >
          <span className="mr-2">Start Growing Smarter</span>
        </Button>
      </Link>
    </div>
  );
};

export default Text;
