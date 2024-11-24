import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brush, 
  Sparkles, 
  Shield, 
  TrendingUp, 
  ArrowUpCircle, 
  MapPin, 
  Users, 
  CheckCircle2,
  Coins,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/lib/dictionary';
import { ValueDistribution } from '@/components/value-distribution';
import { ValidationProcess } from '@/components/validation-process';

export default async function Home({
  params: { lang }
}: {
  params: { lang: string }
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
            {dict.home.hero.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {dict.home.hero.description}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/upload">
              <Button size="lg" className="text-lg bg-yellow-500 hover:bg-yellow-600">
                {dict.home.cta.convert}
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="text-lg">
                {dict.home.cta.explore}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{dict.home.features.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="mb-4">
                <Shield className="h-12 w-12 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{dict.home.features.validation.title}</h3>
              <p className="text-muted-foreground">
                {dict.home.features.validation.description}
              </p>
            </Card>
            <Card className="p-6">
              <div className="mb-4">
                <TrendingUp className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{dict.home.features.growth.title}</h3>
              <p className="text-muted-foreground">
                {dict.home.features.growth.description}
              </p>
            </Card>
            <Card className="p-6">
              <div className="mb-4">
                <Users className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{dict.home.features.distribution.title}</h3>
              <p className="text-muted-foreground">
                {dict.home.features.distribution.description}
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

      {/* Tokenomics & Value Growth */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tokenomics & Value Growth</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Coins className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">TABZ Token (Gold-Backed)</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 1 TABZ = 0.0001g of Gold</li>
                    <li>• Minimum value guaranteed by gold backing</li>
                    <li>• Additional value from artwork appreciation</li>
                    <li>• Tradeable after 1-year lockup period</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">AGT Token (Silver-Backed)</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 1 AGT = 0.001g of Silver</li>
                    <li>• Community governance token</li>
                    <li>• Used for platform decisions</li>
                    <li>• Tradeable after 1-year lockup period</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Value Growth System</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Base value secured by precious metals</p>
                <p>• Additional value from community engagement</p>
                <p>• Value increases with each trade</p>
                <p>• Previous owners earn from future trades</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Market Entry Timeline</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Initial 1-year accumulation period</p>
                <p>• Exchange listing after lockup period</p>
                <p>• Convertible to ETH/SOL after listing</p>
                <p>• Continuous price discovery phase</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Price Stability</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Floor price set by metal backing</p>
                <p>• Daily metal price updates</p>
                <p>• Artwork value adds premium</p>
                <p>• Anti-dump mechanisms</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Validation Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Validation Process</h2>
          <ValidationProcess />
        </div>
      </section>
    </div>
  );
}