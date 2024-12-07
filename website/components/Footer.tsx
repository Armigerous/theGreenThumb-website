"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sprout } from "lucide-react"; // Import the Sprout icon
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  FacebookIconBlack,
  InstagramIconBlack,
  TiktokIconBlack,
  YoutubeIconBlack,
} from "./Icons";
import siteMetaData from "@/lib/siteMetaData";
import { MaxWidthWrapper } from "./maxWidthWrapper";
import { supabase } from "@/lib/supabaseClient";
import Confetti from "./Confetti"; // Import the Confetti component

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false); // State to control confetti display

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("Emails").insert({ email });
      if (error) throw error;
      setDialogMessage("🎉 Thank you for subscribing!");
      setShowConfetti(true); // Show confetti on successful subscription
    } catch (error) {
      if (error instanceof Error) {
        console.error("Subscription Error:", error.message);
        setDialogMessage(
          "⚠️ There was an error subscribing. Please try again."
        );
      } else {
        console.error("Unknown error:", error);
        setDialogMessage("⚠️ An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsDialogOpen(true);
      setEmail("");
    }
  };

  return (
    <MaxWidthWrapper>
      <footer>
        {showConfetti && <Confetti />} {/* Render Confetti conditionally */}
        <Card className="my-10 rounded-2xl bg-cream-300/70 text-cream-800 shadow-lg">
          <CardHeader>
            <h3 className="px-4 text-center capitalize text-lg sm:text-3xl lg:text-4xl mt-8 sm:mt-16 font-bold flex items-center justify-center gap-2">
              <Sprout className="size-9 text-primary" /> Gardening Tips{" "}
              <span className="text-primary">|</span>
              Seasonal Advice <span className="text-primary">
                |
              </span> Community Updates
              <Sprout className=" text-primary size-10" />
            </h3>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="mt-5 px-4 text-center w-full sm:w-3/5 text-sm sm:text-base">
              Subscribe to explore the world of gardening with tips, tools, and
              updates. Join over 2000+ green thumbs staying connected!
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex items-stretch w-full sm:w-[384px] max-w-full"
            >
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-cream-50 text-cream-800 focus:border-cream-800 focus:ring-0 mr-2"
                autoComplete="on"
                required
              />
              <Button type="submit" className="bg-primary text-cream-50">
                Subscribe
              </Button>
            </form>

            <div className="flex justify-center mt-8 gap-x-4">
              {[
                { href: siteMetaData.facebook, Icon: FacebookIconBlack },
                { href: siteMetaData.instagram, Icon: InstagramIconBlack },
                { href: siteMetaData.tiktok, Icon: TiktokIconBlack },
                { href: siteMetaData.youtube, Icon: YoutubeIconBlack },
              ].map(({ href, Icon }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="inline-block w-6 h-6"
                  target="_blank"
                  aria-label={`Visit our ${href.split(".")[1]} page`}
                >
                  <Icon className="hover:scale-125 transition-transform fill-cream-800" />
                </Link>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center sm:flex-row sm:justify-between w-full border-t-2 border-cream-50 mt-6 py-4 space-y-4 sm:space-y-0">
            <span className="text-center text-sm sm:text-base">
              &copy;2024 The GreenThumb. All rights reserved.
            </span>
            <Link
              href="/sitemap.xml"
              className="text-center underline text-sm sm:text-base"
            >
              sitemap.xml
            </Link>
          </CardFooter>
        </Card>
      </footer>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thank You!</AlertDialogTitle>
            <AlertDialogDescription aria-live="polite">
              {dialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                setShowConfetti(false); // Hide confetti when dialog is closed
              }}
              className="bg-primary text-cream-50 font-semibold"
            >
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MaxWidthWrapper>
  );
};

export default Footer;
