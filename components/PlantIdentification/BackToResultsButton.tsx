"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Reason: Component to show "Back to Results" button when user came from plant identification
export function BackToResultsButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Reason: Check if user has plant identification results in localStorage
    try {
      const stored = localStorage.getItem("plant-identification-state");
      if (stored) {
        const state = JSON.parse(stored);
        const isValid =
          state.results &&
          state.results.length > 0 &&
          Date.now() - state.timestamp < 30 * 60 * 1000; // 30 minutes
        setShowButton(isValid);
      }
    } catch (error) {
      console.error("Error checking plant identification state:", error);
    }
  }, []);

  if (!showButton) {
    return null;
  }

  return (
    <div className="mb-4">
      <Button asChild variant="outline" className="flex items-center gap-2">
        <Link href="/identify">
          <ArrowLeft className="h-4 w-4" />
          Back to Identification Results
        </Link>
      </Button>
    </div>
  );
}
