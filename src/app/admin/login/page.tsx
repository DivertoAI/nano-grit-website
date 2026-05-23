"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Incorrect email or password.");
        return;
      }

      const from = searchParams.get("from") ?? "/admin";
      router.replace(from);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur"
    >
      <h1 className="mb-5 text-base font-bold text-white">Sign in to continue</h1>

      <div className="grid gap-3">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="login-input w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="login-input w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e] px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/brand/nano-grit-logo-cutout.png"
            alt="Nano Grit"
            width={56}
            height={56}
            className="h-14 w-auto"
          />
          <div className="text-center">
            <p className="font-display text-lg font-bold uppercase tracking-[0.2em] text-white">
              Nano Grit
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Media Manager
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="rounded-2xl border border-white/10 bg-white/5 p-7" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
