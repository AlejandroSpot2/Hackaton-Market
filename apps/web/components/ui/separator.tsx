import { cn } from "@/lib/utils";

interface SeparatorProps {
  className?: string;
}

export function Separator({ className }: SeparatorProps) {
  return <div className={cn("h-px w-full bg-[linear-gradient(90deg,rgba(99,3,48,0.06),rgba(99,3,48,0.18),rgba(99,3,48,0.06))]", className)} />;
}
