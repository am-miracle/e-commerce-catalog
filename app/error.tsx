"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Page error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Something went wrong!</h1>

          <p className="text-muted-foreground mb-6">
            {error.message || "Failed to load products. Please try again."}
          </p>

          <div className="flex gap-3 justify-center">
            <Button onClick={reset} size="lg">
              Try Again
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => (window.location.href = "/")}
            >
              Go Home
            </Button>
          </div>

          {error.digest && (
            <p className="mt-6 text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
