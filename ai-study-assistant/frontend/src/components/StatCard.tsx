import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone: "ocean" | "mint" | "coral" | "saffron";
};

const toneClasses = {
  ocean: "bg-ocean/10 text-ocean",
  mint: "bg-mint/10 text-mint",
  coral: "bg-coral/10 text-coral",
  saffron: "bg-saffron/20 text-amber-700",
};

export function StatCard({ label, value, helper, icon: Icon, tone }: StatCardProps) {
  return (
    <article className="surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-normal">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
          <Icon size={20} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{helper}</p>
    </article>
  );
}

