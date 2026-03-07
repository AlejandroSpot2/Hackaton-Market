import { SummaryCard as SummaryCardType } from "@/lib/types";

interface SummaryCardProps {
  title: string;
  card: SummaryCardType | null;
  fallback: string;
  variant?: "brutal" | "opportunity";
}

const VARIANTS = {
  brutal: {
    eyebrow: "text-rose-400",
    border: "border-rose-500/25",
    bg: "bg-gradient-to-br from-rose-900/10 to-[rgba(7,15,28,0.97)]",
  },
  opportunity: {
    eyebrow: "text-amber-400",
    border: "border-amber-500/25",
    bg: "bg-gradient-to-br from-amber-900/10 to-[rgba(7,15,28,0.97)]",
  },
};

export function SummaryCard({ title, card, fallback, variant }: SummaryCardProps) {
  const v = variant ? VARIANTS[variant] : { eyebrow: "text-amber-400/70", border: "border-white/[0.08]", bg: "" };

  if (!card) {
    return (
      <section className={`rounded-2xl border ${v.border} ${v.bg} bg-[rgba(7,15,28,0.97)] p-5`}>
        <p className={`text-[10px] uppercase tracking-[0.12em] font-semibold mb-2 ${v.eyebrow}`}>{title}</p>
        <p className="text-sm text-muted">{fallback}</p>
      </section>
    );
  }

  return (
    <section className={`rounded-2xl border ${v.border} ${v.bg} bg-[rgba(7,15,28,0.97)] p-5 flex flex-col gap-3`}>
      <p className={`text-[10px] uppercase tracking-[0.12em] font-semibold ${v.eyebrow}`}>{title}</p>
      <h3 className="text-[15px] font-bold text-slate-100 leading-snug">{card.headline}</h3>
      <p className="text-[12px] text-muted leading-relaxed">{card.body}</p>
      <ul className="space-y-2">
        {card.bullets.map((b) => (
          <li key={b} className="flex gap-2 text-[12px] text-muted">
            <span className={`mt-0.5 flex-shrink-0 ${variant === "brutal" ? "text-rose-500" : "text-amber-500"}`}>▸</span>
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}