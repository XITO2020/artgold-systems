"use client";

import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Card } from "ù/card";
import { Label } from "ù/label"; // Assurez-vous d'importer le composant Label
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaTiktok, FaInstagram } from "react-icons/fa";
import { useToast } from "#//use-toast";
import { ParticlesBackground } from "@comp/particles-background";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [variant, setVariant] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
  }, []);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (variant === 'login') {
        const isAdmin = email === 'admin@naim.com' && password === '7654321';

        if (isAdmin) {
          router.push('/admin/dashboard');
        } else {
          await signIn('credentials', {
            email,
            password,
            callbackUrl: '/profiles',
            redirect: false,
          });
          router.push('/profiles');
        }
      } else {
        await register();
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async () => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Registration successful! Please log in.",
        });
        setVariant('login');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <ParticlesBackground />
      <div className="container max-w-md mx-auto py-16 relative z-10">
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{variant === 'login' ? 'Sign In' : 'Register'} to TabAsCoin</h1>
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
                Or, only for the braves...
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(ev: any) => setEmail(ev.target.value)}
                  id="email"
                  type="email"
                  value={email}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={(ev: any) => setPassword(ev.target.value)}
                  id="password"
                  type="password"
                  value={password}
                />
              </div>
              {variant === 'register' && (
                <div>
                  <Label htmlFor="name">Username</Label>
                  <Input
                    onChange={(ev: any) => setName(ev.target.value)}
                    id="name"
                    type="text"
                    value={name}
                  />
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : variant === 'login' ? 'Log in!' : 'Sign up!'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={toggleVariant}
              className="text-center block mt-4 w-full p-4 rounded-md transition ease-in duration-500 text-light mb-12 hover:bg-quadriary hover:text-quintary"

            >
              {variant === 'login' ? 'Need an account? Register' : 'Already have an account? Log in'}
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
