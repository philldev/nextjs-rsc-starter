"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const errorMessage = error?.message || "An unexpected error occurred";

  return (
    <div className="flex-1 grid place-items-center">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-900/10 mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Oops! Something went wrong
        </h2>
        <p className="text-center mb-8 text-muted-foreground">
          {errorMessage}. Please try again.
        </p>
        <Button size="sm" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
