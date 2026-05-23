import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionReveal } from "@/components/ui/section-reveal";
import { PACKAGES } from "@/content/site";

export const metadata: Metadata = {
  title: "Packages | Nano Grit Detailing & Coating Solutions",
  description: "Choose from Street Shield, Track Gloss, or Titanium Pro — ceramic coating packages built around your finish goals and driving conditions.",
  openGraph: {
    title: "Packages | Nano Grit",
    description: "Ceramic coating packages for every vehicle and use case — from daily drivers to track cars.",
    images: [{ url: "/media/collage/collage-03.jpg", width: 1200, height: 630 }],
  },
};

export default function PackagesPage() {
  return (
    <main className="pb-16">
      <PageHero
        title="Packages"
        description="Choose a coating package based on your finish goals, driving conditions, and maintenance preference."
      />
      <section className="shell mt-12 grid gap-4 lg:grid-cols-3">
        {PACKAGES.map((item, index) => (
          <SectionReveal key={item.name} className="card p-6" delay={index * 0.07}>
            <p className="display-font text-3xl tracking-[0.05em] text-slate-900">
              {item.name}
            </p>
            <p className="mt-2 text-lg font-bold text-[var(--accent-strong)]">{item.price}</p>
            <p className="mt-3 text-sm text-muted">{item.description}</p>
            <ul className="mt-4 grid gap-2">
              {item.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </SectionReveal>
        ))}
        <SectionReveal className="card p-6" delay={0.21}>
          <p className="display-font text-3xl tracking-[0.05em] text-slate-900">🏍️ Bike Coating</p>
          <p className="mt-2 text-lg font-bold text-[var(--accent-strong)]">Starts at ₹3,999</p>
          <p className="mt-3 text-sm text-muted">Ceramic coating packages for bikes — from daily commuters to performance machines.</p>
          <ul className="mt-4 grid gap-2">
            <li className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">Single-layer ceramic</li>
            <li className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">Decontamination wash</li>
            <li className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">Multi-layer options available</li>
          </ul>
        </SectionReveal>
      </section>
    </main>
  );
}
