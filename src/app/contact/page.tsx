import { PageHero } from "@/components/sections/page-hero";
import {
  BOOKING_ELIGIBILITY_RULES,
  BOOKING_HIGHLIGHTS,
  BOOKING_MODES,
  BRAND,
  PRODUCT_CATALOG_GROUPS,
} from "@/content/site";

export default function ContactPage() {
  return (
    <main className="pb-16">
      <PageHero
        title="Contact"
        description="Book your calendar slot, discuss onsite eligibility, and confirm advance payment workflow with the Nano Grit team."
      />
      <section className="shell mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="card p-7 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
            Solutions Info
          </p>
          <h2 className="display-font mt-3 text-4xl tracking-[0.04em] text-slate-900 md:text-5xl">
            Visit Nano Grit
          </h2>
          <div className="mt-6 grid gap-3 text-sm text-slate-700">
            <p>{BRAND.location}</p>
            <a href={BRAND.phoneHref}>{BRAND.phone}</a>
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            <a href={BRAND.mapUrl} target="_blank" rel="noreferrer">
              Open Solutions Map
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=I%20want%20to%20book%20Nano%20Grit%20services`}
              target="_blank"
              rel="noreferrer"
            >
              Get Quote on WhatsApp
            </a>
          </div>
        </div>
        <div className="card p-7 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
            Booking
          </p>
          <h2 className="display-font mt-3 text-4xl tracking-[0.04em] text-slate-900 md:text-5xl">
            Booking Flow
          </h2>
          <div className="mt-5 space-y-2">
            {BOOKING_HIGHLIGHTS.map((item) => (
              <p key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {item}
              </p>
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            {BOOKING_MODES.map((mode) => (
              <div key={mode.value} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
                  {mode.label}
                </p>
                <p className="mt-1 text-sm text-slate-700">{mode.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              Onsite Eligibility Checklist
            </p>
            <div className="mt-3 space-y-2">
              {BOOKING_ELIGIBILITY_RULES.map((rule) => (
                <label key={rule.label} className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                  <span>{rule.label}</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-blue-700">
              Premium vehicles can be towed from customer location to solutions when required.
            </p>
          </div>
          <a
            href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20Nano%20Grit,%20I%20want%20to%20book%20a%20slot.%20Please%20help%20with%20calendar%20availability%20and%20deposit%20details.`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full border border-emerald-700/25 bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
          >
            Get Quote on WhatsApp
          </a>
        </div>
      </section>

      <section className="shell mt-12 grid gap-6 lg:grid-cols-2">
        {PRODUCT_CATALOG_GROUPS.map((group) => (
          <div key={group.title} className="card p-7">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
              Product Inquiry
            </p>
            <h3 className="display-font mt-2 text-3xl tracking-[0.04em] text-slate-900">
              {group.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{group.description}</p>
            <ul className="mt-5 grid gap-2">
              {group.products.map((product) => (
                <li key={product.title} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  {product.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section className="shell mt-10">
        <div className="dark-band rounded-[1.4rem] border border-slate-700/80 px-6 py-8 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-200">
            Custom Paint Desk
          </p>
          <h3 className="display-font mt-2 text-4xl tracking-[0.04em] text-white md:text-5xl">
            Send Your Design. We Build The Finish.
          </h3>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            Share your concept for custom paint or powder coating on WhatsApp. We will
            review feasibility, schedule slot planning, and confirm deposit/payment steps.
          </p>
          <a
            href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20Nano%20Grit,%20I%20want%20custom%20paint%20or%20powder%20coating.%20I%20will%20share%20my%20design%20reference.`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
          >
            Share Design on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
