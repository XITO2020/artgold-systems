// components/ui/tab-button.tsx
"use client";

import { Button } from "@ui/button";
import { ArrowLeftRight } from "lucide-react";

interface TabButtonProps {
  amount: number;
  onClick?: () => void;
}

export function TabButton({ amount, onClick }: TabButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
    >
      <ArrowLeftRight className="h-4 w-4" />
      <span>{amount} TABZ</span>
    </Button>
  );
}
