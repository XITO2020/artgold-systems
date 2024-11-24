"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Lock, TrendingUp } from "lucide-react";

export function ValueDistribution() {
  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Value Distribution System</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Creator</span>
              <span className="text-muted-foreground">10%</span>
            </div>
            <Progress value={10} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              Original artist always retains 10% of artwork value
            </p>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Owner</span>
              <span className="text-muted-foreground">80%</span>
            </div>
            <Progress value={80} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              Current owner holds 80% of the artwork value
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Community Buyers</span>
              <span className="text-muted-foreground">10%</span>
            </div>
            <Progress value={10} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              Shared among unique buyers (one share per buyer)
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Token System</h3>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-yellow-100">
              <Coins className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">TABZ Token (Gold-Backed)</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 1 TABZ = 0.0001g of Gold</li>
                <li>• Minimum value guaranteed by gold backing</li>
                <li>• Additional value from artwork appreciation</li>
                <li>• Tradeable after 1-year lockup period</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-gray-100">
              <TrendingUp className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">AGT Token (Silver-Backed)</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 1 AGT = 0.001g of Silver</li>
                <li>• Community governance token</li>
                <li>• Used for platform decisions</li>
                <li>• Tradeable after 1-year lockup period</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">1-Year Lockup Period</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Initial 1-year accumulation period</li>
                <li>• Exchange listing after lockup period</li>
                <li>• Convertible to ETH/SOL after listing</li>
                <li>• Continuous price discovery phase</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Market Entry Timeline</h3>
        <div className="space-y-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-100 text-green-600">
                  Phase 1: Accumulation
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block text-green-600">
                  1 Year
                </span>
              </div>
            </div>
            <Progress value={25} className="h-2" />
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-100 text-blue-600">
                  Phase 2: Exchange Listing
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block text-blue-600">
                  Q1 2025
                </span>
              </div>
            </div>
            <Progress value={50} className="h-2" />
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-100 text-purple-600">
                  Phase 3: Full Trading
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block text-purple-600">
                  Q2 2025
                </span>
              </div>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}