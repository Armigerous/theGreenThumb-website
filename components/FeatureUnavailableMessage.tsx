"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function FeatureUnavailableMessage() {
  const searchParams = useSearchParams();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "feature-unavailable") {
      setShowMessage(true);
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => setShowMessage(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!showMessage) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
        <Info className="h-4 w-4" />
        <AlertDescription>
          This feature is temporarily unavailable while we make improvements.
          Please check back soon!
        </AlertDescription>
      </Alert>
    </div>
  );
}
