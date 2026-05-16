"use client";

type EngineLoaderProps = {
  visible: boolean;
};

export function EngineLoader({ visible }: EngineLoaderProps) {
  return (
    <div
      className={[
        "fixed inset-0 z-50 overflow-hidden bg-[#040609] transition-opacity duration-700",
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={!visible}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(27,140,255,0.28),transparent_42%)]" />
      <div className="absolute left-1/2 top-[48%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10">
        <div className="tach-track absolute inset-6 rounded-full border border-cyan-300/35" />
        <div className="tach-needle absolute left-1/2 top-1/2 h-20 w-1 -translate-x-1/2 -translate-y-[92%] rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(80,210,255,0.8)]" />
        <div className="spark absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_30px_rgba(120,230,255,0.95)]" />
      </div>
      <div className="absolute left-1/2 top-[63%] h-2 w-[min(70vw,30rem)] -translate-x-1/2 rounded-full bg-white/10">
        <div className="rpm h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-white" />
      </div>
      <div className="flare absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(118,228,255,0.27),transparent_45%)]" />
      <div className="brand absolute inset-x-0 top-[72%] text-center">
        <p className="display-font text-5xl tracking-[0.2em] text-white md:text-7xl">
          NANO GRIT
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.45em] text-blue-200 md:text-sm">
          Engine Ready. Protection Engaged.
        </p>
      </div>
    </div>
  );
}
