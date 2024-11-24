"use client";
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Award } from "lucide-react";

interface ArtistLevelBadgeProps {
  level: number;
  totalPoints: number;
  isAirdropEligible: boolean;
  nextThreshold: number;
}

export function ArtistLevelBadge({
  level,
  totalPoints,
  isAirdropEligible,
  nextThreshold
}: ArtistLevelBadgeProps) {
  const getBadgeColor = (level: number) => {
    if (level >= 100) return "text-purple-500";
    if (level >= 80) return "text-yellow-500";
    if (level >= 50) return "text-blue-500";
    return "text-gray-500";
  };

  const getBadgeIcon = (level: number) => {
    if (level >= 100) return <Trophy className="h-6 w-6" />;
    if (level >= 80) return <Star className="h-6 w-6" />;
    return <Award className="h-6 w-6" />;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className={`${getBadgeColor(level)}`}>
          {getBadgeIcon(level)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Level {level}</span>
            <span className="text-sm text-muted-foreground">{totalPoints} points</span>
          </div>
          {isAirdropEligible && (
            <div className="space-y-2">
              <Progress value={(totalPoints / nextThreshold) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Next airdrop at level {nextThreshold}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}