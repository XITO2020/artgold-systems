"use client";

import { Card } from "ù/card";
import { Shield, AlertTriangle, CheckCircle2, Ban, Scale } from "lucide-react";

interface ValueDistributionProps {
  dict: any; // Remplacez "any" par le type correct si disponible
  lang: string;
}

export function ValidationProcess({ dict, lang }: ValueDistributionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 my-5">
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-red-500">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{dict.home.ai.title}</h3>
            <p className="text-muted-foreground">
            {dict.home.ai.parag}
            </p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-500" />
                <span>{dict.home.ai.exp1}</span>
              </li>
              <li className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-500" />
                <span>{dict.home.ai.exp2}</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>{dict.home.ai.exp4}</span>
              </li>
              <li className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-500" />
                <span>{dict.home.ai.exp3}</span>
              </li>
              <li className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-500" />
                <span>{dict.home.ai.exp5}</span>
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
            <h3 className="text-lg font-semibold mb-2">{dict.home.human.title}</h3>
            <p className="text-muted-foreground">
            {dict.home.human.parag}
            </p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{dict.home.human.exp1}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{dict.home.human.exp2}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{dict.home.human.exp3}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{dict.home.human.exp5}</span>
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
            {dict.home.fraud.title}
            </h3>
            <p className="text-muted-foreground mb-4">
            {dict.home.fraud.parag}
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 mt-1 text-red-500" />
                <span>{dict.home.fraud.exp1}</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 mt-1 text-red-500" />
                <span>{dict.home.fraud.exp2}</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 mt-1 text-red-500" />
                <span>{dict.home.fraud.exp3}</span>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 mt-1 text-red-500" />
                <span>{dict.home.fraud.exp4}</span>
              </li>
            </ul>
            <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
            {dict.home.fraud.exp5}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}