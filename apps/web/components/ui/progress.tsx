import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-white/70 ring-1 ring-white/75", className)}>
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#630330,#a83d74,#88b9dd)] shadow-[0_0_22px_rgba(99,3,48,0.28)] transition-all duration-500"
        style={{ width: `${Math.max(10, Math.min(value, 100))}%` }}
      />
    </div>
  );
}
