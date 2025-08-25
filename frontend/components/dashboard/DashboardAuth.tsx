"use client";

import { useState } from "react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";
import { loginEmailPassword, signupEmailPassword } from "@lib/api";
import { setAuthToken } from "@/lib/auth";

export function DashboardAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await loginEmailPassword(email, password);
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in!",
        });
        router.push("/dashboard");
      } else {
        await signupEmailPassword({ email, password, name: name || undefined });
        toast({
          title: "Account created!",
          description: "Your account has been created successfully!",
        });
        // Reset form
        setEmail("");
        setPassword("");
        setName("");
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-16">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Sign In" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mb-4"
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}
              disabled={isLoading}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            <p className="text-center text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}