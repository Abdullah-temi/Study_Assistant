import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  eyebrow: string;
  children?: ReactNode;
};

export function PageHeader({ title, eyebrow, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-coral">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-normal text-ink md:text-3xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

