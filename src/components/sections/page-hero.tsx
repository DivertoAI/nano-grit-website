import { ReactNode } from "react";

type PageHeroProps = {
  title: string;
  description: string;
  eyebrow?: string;
  badge?: string;
  children?: ReactNode;
};

export function PageHero({
  title,
  description,
  eyebrow = "Nano Grit Solutions",
  badge = "Performance Finish",
  children,
}: PageHeroProps) {
  return (
    <section className="shell pt-20">
      <div className="card ghost-grid relative overflow-hidden px-6 py-14 md:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
          {eyebrow}
        </p>
        <h1 className="display-font mt-4 text-5xl leading-[0.95] tracking-[0.05em] text-slate-900 md:text-7xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted md:text-lg">{description}</p>
        <div className="pointer-events-none absolute -right-3 -top-7 rounded-full border border-blue-300/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-600/60">
          {badge}
        </div>
        {children}
      </div>
    </section>
  );
}
