import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "min-h-[180px] w-full rounded-[1.5rem] border border-white/65 bg-white/55 px-5 py-4 text-base leading-7 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl outline-none placeholder:text-muted-foreground/80 focus:border-primary/35 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
