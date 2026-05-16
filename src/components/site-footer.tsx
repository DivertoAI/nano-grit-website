import { BRAND, NAV_ITEMS } from "@/content/site";
import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-slate-200/80 bg-slate-950 text-slate-200">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.15fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/brand/nano-grit-logo-cutout.png"
              alt="Nano Grit logo"
              width={52}
              height={52}
              className="h-11 w-auto"
            />
            <p className="display-font text-3xl tracking-[0.12em] text-white">
              {BRAND.name}
            </p>
          </div>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-300">
            {BRAND.tagline}
          </p>
          <p className="mt-4 max-w-md text-sm text-slate-400">
            {BRAND.subtitle}
          </p>
        </div>

        <div>
          <h3 className="display-font text-xl tracking-[0.08em] text-white">
            Quick Links
          </h3>
          <div className="mt-4 grid gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="display-font text-xl tracking-[0.08em] text-white">
            Contact
          </h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-300">
            <p>{BRAND.location}</p>
            <a href={BRAND.phoneHref} className="hover:text-white">
              {BRAND.phone}
            </a>
            <a href={`mailto:${BRAND.email}`} className="hover:text-white">
              {BRAND.email}
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              WhatsApp Chat
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="shell flex flex-col gap-2 py-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>2026 NANO GRIT. Premium detailing and protective coating solutions.</p>
          <p>Coatings, custom paint, wrapping, tinting, and booking support. {BRAND.hours}</p>
        </div>
      </div>
    </footer>
  );
}
