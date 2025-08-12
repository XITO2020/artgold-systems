"use client";

import { Card } from "ù/card";
import { Progress } from "ù/progress";
import { Button } from "ù/button";
import { Badge } from "ù/badge";
import { Gift, Lock, Unlock, ArrowRight } from "lucide-react";
import { BONUS_SLOTS_CONFIG } from "~/constants";
import { useToast } from "#/use-toast";

interface BonusSlotsInfoProps {
  artworkCount: number;
  tabzBalance: number;
  agtBalance: number;
  bonusSlots: number;
  maxSlots: number;
  onClaimSlots?: () => void;
}

export function BonusSlotsInfo({
  artworkCount,
  tabzBalance,
  agtBalance,
  bonusSlots,
  maxSlots,
  onClaimSlots
}: BonusSlotsInfoProps) {
  const { toast } = useToast();
  
  const isEligible = 
    artworkCount >= BONUS_SLOTS_CONFIG.THRESHOLD_ARTWORKS &&
    (tabzBalance >= BONUS_SLOTS_CONFIG.THRESHOLD_TABZ ||
     agtBalance >= BONUS_SLOTS_CONFIG.THRESHOLD_AGT);

  const artworkProgress = Math.min((artworkCount / BONUS_SLOTS_CONFIG.THRESHOLD_ARTWORKS) * 100, 100);
  const tabzProgress = Math.min((tabzBalance / BONUS_SLOTS_CONFIG.THRESHOLD_TABZ) * 100, 100);
  const agtProgress = Math.min((agtBalance / BONUS_SLOTS_CONFIG.THRESHOLD_AGT) * 100, 100);

  const handleClaim = async () => {
    if (!isEligible) {
      toast({
        title: "Not Eligible",
        description: "You haven't met the requirements for bonus slots yet.",
        variant: "destructive"
      });
      return;
    }

    try {
      await fetch('/api/bonus-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim' })
      });

      toast({
        title: "Success!",
        description: `You've claimed ${BONUS_SLOTS_CONFIG.BONUS_SLOTS} bonus slots!`
      });

      onClaimSlots?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim bonus slots. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Gift className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Bonus Slots</h3>
            <p className="text-sm text-muted-foreground">
              {bonusSlots} / {maxSlots} slots available
            </p>
          </div>
        </div>
        <Badge variant={isEligible ? "default" : "secondary"}>
          {isEligible ? (
            <div className="flex items-center gap-1">
              <Unlock className="h-4 w-4" />
              Eligible
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              Locked
            </div>
          )}
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Artworks ({artworkCount}/{BONUS_SLOTS_CONFIG.THRESHOLD_ARTWORKS})</span>
            <span>{Math.round(artworkProgress)}%</span>
          </div>
          <Progress value={artworkProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>TABZ Balance ({tabzBalance}/{BONUS_SLOTS_CONFIG.THRESHOLD_TABZ})</span>
            <span>{Math.round(tabzProgress)}%</span>
          </div>
          <Progress value={tabzProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>AGT Balance ({agtBalance}/{BONUS_SLOTS_CONFIG.THRESHOLD_AGT})</span>
            <span>{Math.round(agtProgress)}%</span>
          </div>
          <Progress value={agtProgress} className="h-2" />
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Requirements</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              {BONUS_SLOTS_CONFIG.THRESHOLD_ARTWORKS} artworks uploaded and sold
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              {BONUS_SLOTS_CONFIG.THRESHOLD_TABZ} TABZ or {BONUS_SLOTS_CONFIG.THRESHOLD_AGT} AGT balance
            </li>
          </ul>
        </div>

        <Button 
          className="w-full" 
          disabled={!isEligible}
          onClick={handleClaim}
        >
          Claim {BONUS_SLOTS_CONFIG.BONUS_SLOTS} Bonus Slots
        </Button>
      </div>
    </Card>
  );
}