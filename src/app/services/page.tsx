import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionReveal } from "@/components/ui/section-reveal";
import { BRAND, PRODUCT_CATALOG_GROUPS, SERVICE_GROUPS } from "@/content/site";

export const metadata: Metadata = {
  title: "Services | Nano Grit Detailing & Coating Solutions",
  description: "Glass, plastic, alloy, paint and leather coatings — plus custom paint, powder coating, tinting, wrapping, and ceramic maintenance products.",
  openGraph: {
    title: "Services | Nano Grit",
    description: "Full-range detailing services: coatings, custom paint, powder coating, tinting, wrapping, and maintenance products for cars and bikes.",
    images: [{ url: "/media/collage/collage-02.jpg", width: 1200, height: 630 }],
  },
};

export default function ServicesPage() {
  return (
    <main className="pb-16">
      <PageHero
        title="Services"
        description="Coatings, custom paint, powder coating, tinting, wrapping, and maintenance products - built into one precision workflow."
      />

      <section className="shell mt-12 space-y-10">
        {SERVICE_GROUPS.map((group, groupIndex) => (
          <SectionReveal key={group.title} className="card p-7 md:p-8" delay={groupIndex * 0.05}>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
              Service Group
            </p>
            <h2 className="display-font mt-2 text-4xl tracking-[0.04em] text-slate-900 md:text-5xl">
              {group.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-muted">{group.description}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.services.map((service) => (
                <article key={service.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="display-font text-2xl tracking-[0.03em] text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{service.description}</p>
                  <ul className="mt-3 space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-sm text-slate-700">
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {service.useCase ? (
                    <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                      {service.useCase}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20Nano%20Grit,%20I%20want%20a%20quote%20for%20${encodeURIComponent(group.title)}.`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full border border-emerald-700/25 bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
            >
              {group.ctaLabel ?? "Get Quote on WhatsApp"}
            </a>
          </SectionReveal>
        ))}
      </section>

      <section className="shell mt-16 space-y-6">
        <SectionReveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
            Product Catalog
          </p>
          <h2 className="display-font mt-2 text-4xl tracking-[0.04em] text-slate-900 md:text-5xl">
            Detailer & Customer Product Lines
          </h2>
        </SectionReveal>
        <div className="grid gap-6 lg:grid-cols-2">
          {PRODUCT_CATALOG_GROUPS.map((group, index) => (
            <SectionReveal key={group.title} className="card p-7" delay={index * 0.08}>
              <h3 className="display-font text-3xl tracking-[0.04em] text-slate-900">
                {group.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{group.description}</p>
              <div className="mt-5 grid gap-3">
                {group.products.map((product) => (
                  <article key={product.title} className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      {product.audience === "detailer"
                        ? "For Detailers"
                        : "For Vehicle Owners"}
                    </p>
                    <h4 className="mt-1 text-base font-semibold text-slate-900">{product.title}</h4>
                    <p className="mt-1 text-sm text-muted">{product.description}</p>
                  </article>
                ))}
              </div>
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20Nano%20Grit,%20I%20want%20pricing%20for%20${encodeURIComponent(group.title)}.`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full border border-slate-300 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700"
              >
                Get Quote on WhatsApp
              </a>
            </SectionReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
