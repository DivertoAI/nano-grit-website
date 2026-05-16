import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | Nano Grit",
  description: "This page could not be found.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <h1 className="display-font text-6xl tracking-[0.08em] text-slate-900">404</h1>
        <p className="mt-3 text-sm text-muted">This page could not be found.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
