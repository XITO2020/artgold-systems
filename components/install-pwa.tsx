"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const hasUserDismissed = localStorage.getItem('pwa-install-dismissed');
    
    if (isStandalone || hasUserDismissed) {
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);

      // Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'pwa_install_prompt_shown');
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app was installed
    window.addEventListener('appinstalled', () => {
      setShowInstall(false);
      setDeferredPrompt(null);
      
      // Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'pwa_installed');
      }
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show install prompt
    deferredPrompt.prompt();
    
    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstall(false);
      // Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'pwa_install_accepted');
      }
    } else {
      // Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'pwa_install_rejected');
      }
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstall(false);
    setInstallDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
    
    // Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'pwa_install_dismissed');
    }
  };

  if (!showInstall || installDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] z-50">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Install TabAsCoin App</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Get the best experience with our app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-sm">Fast access to your artwork</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-sm">Works offline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-sm">Real-time price updates</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={handleInstall}
          >
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}