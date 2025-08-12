import * as React from "react";
import { cn } from "@lib/cn";

type Variant = "default" | "secondary" | "destructive" | "outline" | "accentOne"; // ← ajout

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";

const variants: Record<Variant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-red-600 text-white",
  outline: "text-foreground",
  accentOne: "border-transparent bg-violet-600 text-white"
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <div className={cn(base, variants[variant], className)} {...props} />;
}
export default Badge;
