
import React from 'react';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from "next-i18next";
import { Brush, Sparkles, Shield, TrendingUp, ArrowUpCircle, MapPin, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ValueDistribution } from '@/components/value-distribution';
import { ValidationProcess } from '@/components/validation-process';

export default function Home() {
  const t = useTranslation();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
            Transform Your Art into Valuable Currency"
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Convert your handmade masterpieces into digital gold. Each validated artwork becomes a secure, tradeable asset with guaranteed appreciation.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/upload">
              <Button size="lg" className="text-lg bg-yellow-500 hover:bg-yellow-600">
                Convert Your Art
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="text-lg">
                View Treasury
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="mb-4">
                <Shield className="h-12 w-12 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Validation</h3>
              <p className="text-muted-foreground">
                Advanced AI and human verification ensure authenticity
              </p>
            </Card>
            <Card className="p-6">
              <div className="mb-4">
                <TrendingUp className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Value Growth</h3>
              <p className="text-muted-foreground">
                Your art's value only increases through our community system
              </p>
            </Card>
            <Card className="p-6">
              <div className="mb-4">
                <Users className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Distribution</h3>
              <p className="text-muted-foreground">
                Transparent value sharing between creators and investors
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Distribution */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Value Distribution</h2>
          <ValueDistribution />
        </div>
      </section>

      {/* Validation Process */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Validation Process</h2>
          <ValidationProcess />
        </div>
      </section>
    </div>
  );
}