"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import  Button  from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaTiktok, FaInstagram } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to send verification email",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Check your email for the login link",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-16">
      <Card className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Sign In to TabAsCoin</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Choose your preferred authentication method
          </p>
        </div>

        <div className="grid gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() => signIn("google")}
            className="flex items-center gap-2"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn("discord")}
            className="flex items-center gap-2"
          >
            <FaDiscord className="h-5 w-5 text-indigo-600" />
            Continue with Discord
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn("tiktok")}
            className="flex items-center gap-2"
          >
            <FaTiktok className="h-5 w-5" />
            Continue with TikTok
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn("instagram")}
            className="flex items-center gap-2"
          >
            <FaInstagram className="h-5 w-5 text-pink-600" />
            Continue with Instagram
          </Button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending link..." : "Sign in with Email"}
          </Button>
        </form>
      </Card>
    </div>
  );
}