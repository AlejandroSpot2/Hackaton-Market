import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] ring-1 backdrop-blur-xl",
  {
    variants: {
      variant: {
        default: "bg-primary/12 text-primary ring-primary/15",
        secondary: "bg-white/60 text-foreground ring-white/75",
        outline: "bg-transparent text-muted-foreground ring-border",
        success: "bg-emerald-100/80 text-emerald-800 ring-emerald-200/80",
        warning: "bg-amber-100/85 text-amber-800 ring-amber-200/85",
        destructive: "bg-rose-100/90 text-rose-700 ring-rose-200/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
