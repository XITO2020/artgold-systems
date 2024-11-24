"use client";
import React from 'react';
import { Card } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle2, Ban, Scale } from "lucide-react";

export function ValidationProcess() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Content Validation</h3>
            <p className="text-muted-foreground">
              Our advanced AI system screens all submissions for:
            </p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-500" />
                <span>AI-generated content</span>
              </li>
              <li className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-500" />
                <span>Duplicate artworks</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Political messaging</span>
              </li>
              <li className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-500" />
                <span>Violent imagery</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Human Review</h3>
            <p className="text-muted-foreground">
              Our team personally reviews each submission to ensure:
            </p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Artistic merit</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Originality verification</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Community guidelines compliance</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6 md:col-span-2 bg-red-50 dark:bg-red-900/10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
            <Scale className="h-6 w-6 text-red-600 dark:text-red-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">
              Fraud Protection & Consequences
            </h3>
            <p className="text-muted-foreground mb-4">
              Submitting fraudulent artworks (AI-generated, copies, or prints) will result in severe consequences:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 mt-1 text-red-500" />
                <span>Immediate forfeiture of all assets and investments</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 mt-1 text-red-500" />
                <span>Permanent ban from the platform</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 mt-1 text-red-500" />
                <span>Legal action for fraud and damages</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 mt-1 text-red-500" />
                <span>Public disclosure of fraudulent activity</span>
              </li>
            </ul>
            <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
              By submitting artwork, you acknowledge these terms and accept full legal responsibility for authenticity.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}