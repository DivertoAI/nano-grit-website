import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionReveal } from "@/components/ui/section-reveal";
import { PROCESS, STATS } from "@/content/site";

export const metadata: Metadata = {
  title: "About | Nano Grit Detailing & Coating Solutions",
  description: "Nano Grit is an automotive detailing and coating team focused on precision prep, durable protection, and premium finish standards for cars and bikes.",
  openGraph: {
    title: "About Nano Grit",
    description: "A detailing and coating team built for owners who want measurable coating quality — controlled process stages, panel-wise checks, premium chemistry.",
    images: [{ url: "/media/collage/collage-04.jpg", width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  return (
    <main className="pb-16">
      <PageHero
        title="About Nano Grit"
        description="We are an automotive detailing and coating solutions team focused on precision prep, durable protection, and premium finish standards."
      />
      <section className="shell mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <SectionReveal className="card p-7">
          <h2 className="display-font text-4xl tracking-[0.04em] text-slate-900">
            Our Approach
          </h2>
          <p className="mt-4 text-base text-muted">
            NANO GRIT was built for owners who want measurable coating quality. Our team
            works with controlled process stages, panel-wise checks, and premium chemistry
            to maintain gloss and protection beyond initial delivery.
          </p>
          <p className="mt-4 text-base text-muted">
            Every vehicle profile is different, so we match service intensity to paint
            condition, usage pattern, and desired finish outcome before recommending any
            package.
          </p>
        </SectionReveal>
        <SectionReveal delay={0.1} className="dark-band rounded-[1.35rem] border border-slate-700/70 p-7">
          <h2 className="display-font text-3xl tracking-[0.04em] text-white">
            Process Discipline
          </h2>
          <div className="mt-4 space-y-2">
            {PROCESS.map((step, index) => (
              <p
                key={step}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-blue-100"
              >
                {index + 1}. {step}
              </p>
            ))}
          </div>
        </SectionReveal>
      </section>

      <section className="shell mt-10">
        <div className="dark-band rounded-[1.4rem] border border-slate-700/80 px-6 py-8 md:px-9">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-200">
            Confidence Layer
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-5"
              >
                <p className="display-font text-4xl text-white">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.1em] text-blue-200">
                  {stat.label}
                </p>
                <p className="mt-2 text-xs text-slate-300">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
