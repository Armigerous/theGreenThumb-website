"use client";

import React from "react";
import Link from "next/link";
import {
  FacebookIconBlack,
  InstagramIconBlack,
  TiktokIconBlack,
  YoutubeIconBlack,
} from "./Icons";
import siteMetaData from "@/lib/siteMetaData";

// Define the form data interface
// interface FormData {
//   Email: string; // Email address of the user
// }

// Define the Footer functional component
const Footer: React.FC = () => {
  return (
    <footer
      className="mt-16 rounded-2xl flex flex-col items-center 
      text-cream-50 
      bg-cream-800 
      m-2 sm:m-10"
    >
      <h3
        className="px-4 text-center capitalize 
      text-2xl sm:text-3xl lg:text-4xl
      mt-8 sm:mt-16 
      font-medium "
      >
        Interesting Stories | Updates | Guides
      </h3>
      <p className="mt-5 px-4 text-center w-full sm:w-3/5 font-cream-50 text-sm sm:text-base">
        Subscribe to learn about new technology and updates. Join over 5000+
        members community to stay up to date with latest news.
      </p>

      <form
        className="mt-6 flex items-stretch bg-cream-50 rounded mx-4
        p-1 sm:p-2
        w-fit sm:min-w-[384px]"
      >
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full bg-transparent text-cream-800 focus:border-cream-800 focus:ring-0 border-0 focus:border-b mr-2 pb-1
          pl-2 sm:pl-0"
          autoComplete="on"
        />
        <input
          type="submit"
          className="cursor-pointer font-medium rounded py-1
          px-3 sm:px-5
          bg-accent-200 text-cream-800"
        />
      </form>

      {/* Social Media Icons */}
      <div className="flex flex-center mt-8">
        {/* Facebook */}
        <a
          href={siteMetaData.facebook}
          className="inline-block w-6 h-6 mr-4"
          target="_blank"
        >
          <FacebookIconBlack
            className="hover:scale-125 transition-all ease duration-200 
            fill-accent-200 "
          />
        </a>
        {/* Instagram */}
        <a
          href={siteMetaData.instagram}
          className="inline-block w-6 h-6 mr-4"
          target="_blank"
        >
          <InstagramIconBlack
            className="hover:scale-125 transition-all ease duration-200
            fill-accent-200"
          />
        </a>
        {/* TikTok */}
        <a
          href={siteMetaData.tiktok}
          className="inline-block w-6 h-6 mr-4"
          target="_blank"
        >
          <TiktokIconBlack
            className="hover:scale-125 transition-all ease duration-200
            fill-accent-200 "
          />
        </a>
        {/* YouTube */}
        <a
          href={siteMetaData.youtube}
          className="inline-block w-6 h-6 mr-4"
          target="_blank"
        >
          <YoutubeIconBlack
            className="hover:scale-125 transition-all ease duration-200
          fill-accent-200 "
          />
        </a>
      </div>

      {/* Footer Bottom */}
      <div
        className="w-full relative font-medium border-t border-solid py-6 px-8 flex items-center justify-around
      mt-8 md:mt-16
      border-cream-50 
      flex-col md:flex-row"
      >
        <span className="text-center my-2 md:my-0">
          &copy;2024 The GreenThumb. All rights reserved.
        </span>
        <Link href="/sitemap.xml" className="text-center underline">
          sitemap.xml
        </Link>
      </div>
    </footer>
  );
};

// Export the Footer component as the default export
export default Footer;
