"use client";

import { useSearchParams } from "next/navigation";
import { Card } from "@ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@ui/button";

const getErrorMessage = (error: string | null) => {
  switch (error) {
    case "Configuration":
      return "There is a problem with the server configuration. Please try again later.";
    case "AccessDenied":
      return "You do not have permission to sign in.";
    case "Verification":
      return "The verification link may have expired or already been used.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = getErrorMessage(error);

  return (
    <div className="container max-w-md mx-auto py-16">
      <Card className="p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-6">
            {errorMessage}
          </p>
          <div className="inline-block">
            <a 
              href="/" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Revenir à l'accueil
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
