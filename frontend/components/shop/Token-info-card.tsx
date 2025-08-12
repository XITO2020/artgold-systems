"use client";

import { Card } from "ù/card";
import { Info } from "lucide-react";
import { TOKEN_CONFIG } from '~/token-config';

interface TokenInfoCardProps {
  token: 'TABZ' | 'AGT';
}

export function TokenInfoCard({ token }: TokenInfoCardProps) {
  const config = TOKEN_CONFIG[token];

  const getMetalInfo = () => {
    if (token === 'TABZ') {
      return {
        metal: 'Gold',
        gramsPerToken: config.goldGramsPerToken || 0
      };
    }
    return {
      metal: 'Silver',
      gramsPerToken: (config as typeof TOKEN_CONFIG.AGT).silverGramsPerToken || 0
    };
  };

  const metalInfo = getMetalInfo();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={config.logo}
          alt={config.name}
          className="w-12 h-12"
        />
        <div>
          <h3 className="font-semibold">{config.name}</h3>
          <p className="text-sm text-muted-foreground">{config.symbol}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Backed by</span>
          <span>{metalInfo.metal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Metal per token</span>
          <span>{metalInfo.gramsPerToken}g {metalInfo.metal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Network</span>
          <span>{config.network}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Min Purchase</span>
          <span>{config.minPurchase} {config.symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Max Purchase</span>
          <span>{config.maxPurchase} {config.symbol}</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex gap-2">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
          <p className="text-sm text-muted-foreground">
            Tokens are locked for 1 year before they can be exchanged. During this period,
            they can only be used within the platform.
          </p>
        </div>
      </div>
    </Card>
  );
}