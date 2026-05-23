"use client";

import { BRAND, NAV_ITEMS } from "@/content/site";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-4 z-30 shell">
      <nav className="surface-strong rounded-[1.15rem] border border-white/60 px-4 py-3 shadow-[0_10px_35px_rgba(14,34,54,0.12)] backdrop-blur md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link className="focus-ring flex items-center gap-2 rounded-md px-1" href="/">
            <Image
              src="/brand/nano-grit-logo-cutout.png"
              alt="Nano Grit logo"
              width={38}
              height={38}
              className="h-9 w-auto"
            />
            <div>
              <p className="display-font nav-brand text-xl leading-none tracking-[0.16em]">
                {BRAND.name}
              </p>
              <p className="nav-subbrand text-[11px] uppercase tracking-[0.2em]">
                Detailing &amp; Coating Solutions
              </p>
            </div>
          </Link>

          <button
            type="button"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 lg:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((state) => !state)}
          >
            <span className="relative block h-4 w-5">
              <span className="absolute left-0 top-0 h-0.5 w-5 bg-current transition" />
              <span className="absolute left-0 top-[7px] h-0.5 w-5 bg-current transition" />
              <span className="absolute left-0 top-[14px] h-0.5 w-5 bg-current transition" />
            </span>
          </button>

          <div className="hidden items-center gap-6 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "text-sm font-semibold uppercase tracking-[0.12em]",
                  pathname === item.href
                    ? "text-[var(--accent-strong)]"
                    : "text-slate-700 hover:text-slate-900",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="glow-pill rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white"
              href="/contact"
            >
              Book Now
            </Link>
          </div>
        </div>

        {open ? (
          <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="glow-pill rounded-full bg-[var(--accent)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.12em] text-white"
              onClick={() => setOpen(false)}
            >
              Book Now
            </Link>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
