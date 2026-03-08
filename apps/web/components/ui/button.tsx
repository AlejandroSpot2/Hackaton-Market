import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default:
          "bg-primary px-5 py-3 text-primary-foreground shadow-[0_20px_40px_-20px_rgba(99,3,48,0.55)] hover:-translate-y-0.5 hover:bg-[#520228]",
        secondary:
          "bg-white/70 px-5 py-3 text-foreground shadow-[0_16px_36px_-24px_rgba(99,3,48,0.35)] ring-1 ring-white/70 backdrop-blur-xl hover:bg-white/85",
        outline:
          "bg-white/45 px-4 py-2.5 text-foreground ring-1 ring-white/70 backdrop-blur-xl hover:bg-white/70",
        ghost: "px-3 py-2 text-muted-foreground hover:bg-white/50 hover:text-foreground"
      },
      size: {
        default: "",
        sm: "px-4 py-2 text-sm",
        lg: "px-6 py-3.5 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
