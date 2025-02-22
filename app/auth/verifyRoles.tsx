"use client";

import { useState } from 'react';
import { Button } from "ù/button";
import { Card } from "ù/card";
import { Input } from "ù/input";
import { Label } from "ù/label";
import { useToast } from "#/hooks/use-toast";
import { Shield, AlertCircle } from "lucide-react";

export default function VerifyRoles() {
  const [userId, setUserId] = useState('');
  const [guildId, setGuildId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const response = await fetch(
        `/api/auth/verifyRole?userId=${userId}&guildId=${guildId}&roleId=${roleId}`
      );
      const data = await response.json();

      if (data.success) {
        setIsVerified(true);
        toast({
          title: "Verification Successful",
          description: "Your Discord role has been verified",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "You don't have the required role",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify Discord role",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-8">
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-2 rounded-full ${
            isVerified ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {isVerified ? (
              <Shield className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold">Discord Role Verification</h1>
            <p className="text-sm text-muted-foreground">
              Enter your Discord details to verify your role
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your Discord User ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guildId">Server ID</Label>
            <Input
              id="guildId"
              value={guildId}
              onChange={(e) => setGuildId(e.target.value)}
              placeholder="Enter Discord Server ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roleId">Role ID</Label>
            <Input
              id="roleId"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              placeholder="Enter Role ID to verify"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isVerifying || isVerified}
          >
            {isVerifying ? "Verifying..." : "Verify Role"}
          </Button>
        </form>

        {isVerified && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-600 text-sm font-medium">
              Role verification successful! You now have access to additional features.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}