"use client";

import { Card } from "@comp/ui/card";
import { Button } from "@comp/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaTwitter, FaTiktok, FaInstagram } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { useState } from "react";
import { Input } from "@comp/ui/input";
import { useToast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@comp/ui/tabs";
import { loginEmailPassword, signupEmailPassword } from "@lib/api";

const providers = [
  {
    id: "google",
    name: "Google",
    icon: FcGoogle,
    color: "bg-white hover:bg-gradient-to-r from-white via-red-100 to-red-200",
    textColor: "text-gray-900 hover:text-emerald-700",
  },
  {
    id: "discord",
    name: "Discord",
    icon: FaDiscord,
    color: "bg-[#5865F2] hover:bg-gradient-to-r from-[#5865F2] via-[#5865F2] to-[#2732C4]",
    textColor: "text-white hover:text-violet-200",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: FaTwitter,
    color: "bg-[#1DA1F2] hover:bg-gradient-to-r from-[#1DA1F2] via-[#1A8CD8] to-[#000004]",
    textColor: "text-white hover:text-slate-400",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: FaTiktok,
    color: "bg-[#000000] hover:bg-gradient-to-r from-[#000000] via-[#000012] to-[#DD0099]",
    textColor: "text-white hover:text-cyan-400",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: FaInstagram,
    color: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-80",
    textColor: "text-white hover:text-yellow-400 text-opacity-100 hover:text-opacity-100",
  },
];

export function AuthForm() {
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { toast } = useToast();
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === "signup") {
        await signupEmailPassword({ email, password, name });
        toast({
          title: "Account created!",
          description: "Your account has been created successfully!",
        });
        // Reset form
        setEmail("");
        setPassword("");
        setName("");
        setAuthMode("login");
      } else {
        await loginEmailPassword(email, password);
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in!",
        });
        router.push("/dashboard");
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

  const handleProviderSignIn = async (providerId: string) => {
    setIsLoading(true);
    try {
      // Rediriger vers l'endpoint d'authentification du fournisseur
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/${providerId}`;
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Image
          src="/icons/welcome.gif"
          alt="Logo"
          width={392}
          height={227}
          className="rounded-md"
        />
        
        <Tabs defaultValue={authMode} className="w-full" onValueChange={(v) => setAuthMode(v as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-2xl font-bold text-primary text-center">
          {isEmailMode 
            ? "Enter your anon email to begin the real journey " 
            : "Select a mainstream controlled network..."}
        </p>
      </div>

      {isEmailMode ? (
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            {authMode === "signup" && (
              <Input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-yellow-200 hover:from-green-400 hover:to-yellow-400 text-white"
            disabled={isLoading}
          >
            {isLoading 
              ? "Forging your path..." 
              : authMode === "signup" 
                ? "Begin Your Journey" 
                : "Return to Your Path"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsEmailMode(false)}
            disabled={isLoading}
          >
            Choose Another Path
          </Button>
        </form>
      ) : (
        <div className="space-y-3">
          {providers.map((provider) => (
            <Button
              key={provider.id}
              type="button"
              className={`w-full ${provider.color} ${provider.textColor}`}
              onClick={() => handleProviderSignIn(provider.id)}
              disabled={isLoading}
            >
              <provider.icon className="mr-2 h-5 w-5" />
              {authMode === "signup" ? "Sign up" : "Continue"} with {provider.name}
            </Button>
          ))}
          <h1 className="text-2xl font-bold text-center text-primary">Or join the braves path...</h1>
          <Button
            type="button"
            variant="outline"
            className="w-full bg-gradient-to-r from-emerald-600 to-yellow-200 hover:from-green-400 hover:to-yellow-400 text-black"
            onClick={() => setIsEmailMode(true)}
            disabled={isLoading}
          >
            <HiMail className="mr-2 h-5 w-5" />
            {authMode === "signup" ? "Sign up" : "Continue"} with Email
          </Button>
        </div>
      )}
    </Card>
  );
}
