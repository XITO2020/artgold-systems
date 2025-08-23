"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Card } from "@ui/card";
import { Label } from "@ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaTiktok, FaInstagram, FaTwitter } from "react-icons/fa";
import { useToast } from "@hooks/use-toast";
import { ParticlesBackground } from "@comp/particles-background";
import { useAuth } from "@hooks/useAuth";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();

  // état pour le flux email/password
  const [variant, setVariant] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");    // ← manquait
  const [name, setName] = useState("");            // ← manquait (pour register)
  const [isLoading, setIsLoading] = useState(false);

  // ton hook côté backend JWT
  const { login, signup, loading: authLoading } = useAuth();

  const toggleVariant = useCallback(() => {
    setVariant((v) => (v === "login" ? "register" : "login"));
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (variant === "login") {
        await login(email, password);
        router.push("/profiles");
      } else {
        // si ton hook expose signup(email, password, name)
        await signup(email, password, name);
        // tu peux soit rediriger direct, soit demander login derrière
        router.push("/profiles");
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.message ?? "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ParticlesBackground />

      <div className="container max-w-md mx-auto py-16 relative z-10">
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">
              {variant === "login" ? "Sign In" : "Register"} to TabAsCoin
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Choose your preferred authentication method
            </p>
          </div>

          {/* OAuth Providers - Coming Soon */}
          <div className="grid gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => alert('OAuth providers will be implemented soon')}
              className="flex items-center gap-2"
              disabled
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google (Coming Soon)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => alert('OAuth providers will be implemented soon')}
              className="flex items-center gap-2"
              disabled
            >
              <FaDiscord className="h-5 w-5 text-indigo-600" />
              Continue with Discord (Coming Soon)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => alert('OAuth providers will be implemented soon')}
              className="flex items-center gap-2"
              disabled
            >
              <FaTiktok className="h-5 w-5" />
              Continue with TikTok (Coming Soon)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => alert('OAuth providers will be implemented soon')}
              className="flex items-center gap-2"
              disabled
            >
              <FaInstagram className="h-5 w-5 text-pink-600" />
              Continue with Instagram (Coming Soon)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => alert('OAuth providers will be implemented soon')}
              className="flex items-center gap-2"
              disabled
            >
              <FaTwitter className="h-5 w-5 text-blue-400" />
              Continue with Twitter (Coming Soon)
            </Button>
          </div>

          {/* séparateur */}
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

          {/* Email + password via ton backend JWT */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={variant === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {variant === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name">Username (optional)</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your display name"
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
              {isLoading
                ? variant === "login" ? "Signing in..." : "Creating account..."
                : variant === "login" ? "Sign in with Email" : "Create account"}
            </Button>
          </form>

          <button
            type="button"
            onClick={toggleVariant}
            className="text-center block mt-4 w-full p-4 rounded-md transition ease-in duration-500 text-light mb-12 hover:bg-quadriary hover:text-quintary"
          >
            {variant === "login"
              ? "Need an account? Register"
              : "Already have an account? Log in"}
          </button>

          {/* Lien vers une page dédiée d’inscription si tu veux la garder */}
          <div className="text-center mt-2">
            <a 
              href="/auth/register"
              className="underline text-sm text-muted-foreground"
            >
              Prefer a dedicated signup page?
            </a>
          </div>
        </Card>
      </div>
    </>
  );
}
