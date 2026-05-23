"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useHomeWorks, useGalleryWorks, useHeroCollage, useHeroVideo } from "@/lib/media-store";
import { WorkMediaItem, HeroCollageImage } from "@/content/site";

type Tab = "hero-video" | "home" | "gallery" | "collage";

const SPAN_OPTIONS = [
  { label: "Narrow (4/12)", value: "md:col-span-4" },
  { label: "Wide (8/12)", value: "md:col-span-8" },
  { label: "Full (12/12)", value: "md:col-span-12" },
];
const HEIGHT_OPTIONS = [
  { label: "Portrait 4:5", value: "aspect-[4/5]" },
  { label: "Landscape 16:9", value: "aspect-video" },
  { label: "Wide 5:3", value: "aspect-[5/3]" },
  { label: "Square 1:1", value: "aspect-square" },
];
const TIER_OPTIONS: HeroCollageImage["tier"][] = ["near", "mid", "far"];
const COLLAGE_POSITIONS = [
  "left-[-3%] top-8 h-[7rem] w-[6rem] rotate-[-7deg] md:h-[10rem] md:w-[7rem]",
  "left-[17%] top-4 h-[6rem] w-[4.5rem] rotate-[6deg] md:h-[8rem] md:w-[6rem]",
  "left-[39%] top-14 h-[6.5rem] w-[5rem] rotate-[-5deg] md:h-[9rem] md:w-[6.5rem]",
  "left-[58%] top-5 h-[5.5rem] w-[4rem] rotate-[4deg] md:h-[7.5rem] md:w-[5rem]",
  "right-[10%] top-8 h-[6rem] w-[5rem] rotate-[-6deg] md:h-[8rem] md:w-[6rem]",
  "left-[2%] bottom-9 h-[5rem] w-[6.5rem] rotate-[5deg] md:h-[7rem] md:w-[9rem]",
  "left-[34%] bottom-5 h-[4.5rem] w-[6rem] rotate-[-4deg] md:h-[6.5rem] md:w-[8rem]",
  "right-[6%] bottom-6 h-[6rem] w-[5rem] rotate-[5deg] md:h-[8rem] md:w-[6rem]",
];

// ─── Upload helper ────────────────────────────────────────────────────────────
function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const upload = useCallback(async (file: File): Promise<{ path: string; type: "video" | "image" } | null> => {
    setUploading(true);
    setUploadWarning(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.warning) setUploadWarning(data.warning);
      return data;
    } catch {
      return null;
    } finally {
      setUploading(false);
    }
  }, []);
  return { upload, uploading, uploadWarning };
}

// ─── Shared input style ───────────────────────────────────────────────────────
const inp = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500";
const sel = "rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

// ─── WorkItemCard ─────────────────────────────────────────────────────────────
function WorkItemCard({
  item, index, total,
  onChange, onDelete, onMove,
}: {
  item: WorkMediaItem; index: number; total: number;
  onChange: (updated: WorkMediaItem) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const set = (patch: Partial<WorkMediaItem>) => onChange({ ...item, ...patch });
  const { upload, uploading } = useUpload();
  const mediaRef = useRef<HTMLInputElement>(null);
  const posterRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {item.mediaType === "video" ? (
            <video src={item.src} poster={item.poster} className="h-full w-full object-cover" muted playsInline preload="metadata" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
          )}
          <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            {item.mediaType}
          </span>
        </div>

        {/* Fields */}
        <div className="flex flex-1 flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <input className={inp} placeholder="Title" value={item.title} onChange={e => set({ title: e.target.value })} />
            <input className={inp} placeholder="Label (subtitle)" value={item.label} onChange={e => set({ label: e.target.value })} />
          </div>
          <input className={inp} placeholder="Alt text (accessibility)" value={item.alt} onChange={e => set({ alt: e.target.value })} />

          <div className="grid grid-cols-2 gap-2">
            {/* Media file */}
            <div className="flex gap-1">
              <input className={inp} placeholder="Media path e.g. /media/videos/work.mp4" value={item.src} onChange={e => set({ src: e.target.value, mediaType: e.target.value.match(/\.(mp4|mov|webm)$/i) ? "video" : "image" })} />
              <button
                type="button"
                title="Upload media file"
                onClick={() => mediaRef.current?.click()}
                className="flex-shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-600 hover:bg-slate-100"
              >
                {uploading ? "…" : "↑"}
              </button>
              <input ref={mediaRef} type="file" accept="video/*,image/*" className="hidden" onChange={async e => {
                const f = e.target.files?.[0]; if (!f) return;
                const res = await upload(f);
                if (res) set({ src: res.path, mediaType: res.type });
              }} />
            </div>

            {/* Poster file */}
            <div className="flex gap-1">
              <input className={inp} placeholder="Poster/thumbnail path" value={item.poster} onChange={e => set({ poster: e.target.value })} />
              <button
                type="button"
                title="Upload poster image"
                onClick={() => posterRef.current?.click()}
                className="flex-shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-600 hover:bg-slate-100"
              >
                {uploading ? "…" : "↑"}
              </button>
              <input ref={posterRef} type="file" accept="image/*" className="hidden" onChange={async e => {
                const f = e.target.files?.[0]; if (!f) return;
                const res = await upload(f);
                if (res) set({ poster: res.path });
              }} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select className={sel} value={item.mediaType} onChange={e => set({ mediaType: e.target.value as WorkMediaItem["mediaType"] })}>
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>
            <select className={sel} value={item.span} onChange={e => set({ span: e.target.value })}>
              {SPAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select className={sel} value={item.heightClass} onChange={e => set({ heightClass: e.target.value })}>
              {HEIGHT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-1">
          <button onClick={() => onMove(-1)} disabled={index === 0} title="Move up" className="rounded p-1 text-slate-400 hover:text-slate-700 disabled:opacity-25">▲</button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} title="Move down" className="rounded p-1 text-slate-400 hover:text-slate-700 disabled:opacity-25">▼</button>
          <button onClick={onDelete} title="Remove" className="mt-auto rounded p-1 text-rose-400 hover:text-rose-600">✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── AddWorkForm ──────────────────────────────────────────────────────────────
function AddWorkForm({ onAdd }: { onAdd: (item: WorkMediaItem) => void }) {
  const blank: WorkMediaItem = { title: "", label: "", alt: "", src: "", poster: "", mediaType: "video", span: "md:col-span-4", heightClass: "aspect-[4/5]" };
  const [form, setForm] = useState<WorkMediaItem>(blank);
  const [open, setOpen] = useState(false);
  const { upload, uploading } = useUpload();
  const mediaRef = useRef<HTMLInputElement>(null);
  const posterRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<WorkMediaItem>) => setForm(f => ({ ...f, ...patch }));

  const handleAdd = () => {
    if (!form.src) return;
    onAdd({ ...form, poster: form.poster || form.src });
    setForm(blank);
    setOpen(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-4 w-full rounded-2xl border-2 border-dashed border-slate-300 py-4 text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600">
        + Add new item
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border-2 border-blue-300 bg-blue-50 p-5">
      <p className="mb-3 text-sm font-bold text-blue-700">New Item</p>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-2">
          <input className={inp} placeholder="Title *" value={form.title} onChange={e => set({ title: e.target.value })} />
          <input className={inp} placeholder="Label (subtitle)" value={form.label} onChange={e => set({ label: e.target.value })} />
        </div>
        <input className={inp} placeholder="Alt text" value={form.alt} onChange={e => set({ alt: e.target.value })} />

        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-1">
            <input className={inp} placeholder="Media path or upload →" value={form.src} onChange={e => set({ src: e.target.value, mediaType: e.target.value.match(/\.(mp4|mov|webm)$/i) ? "video" : "image" })} />
            <button type="button" onClick={() => mediaRef.current?.click()} className="flex-shrink-0 rounded-lg border border-blue-300 bg-white px-3 text-xs font-semibold text-blue-600 hover:bg-blue-100">
              {uploading ? "…" : "Upload"}
            </button>
            <input ref={mediaRef} type="file" accept="video/*,image/*" className="hidden" onChange={async e => {
              const f = e.target.files?.[0]; if (!f) return;
              const res = await upload(f);
              if (res) set({ src: res.path, mediaType: res.type });
            }} />
          </div>
          <div className="flex gap-1">
            <input className={inp} placeholder="Poster image (optional)" value={form.poster} onChange={e => set({ poster: e.target.value })} />
            <button type="button" onClick={() => posterRef.current?.click()} className="flex-shrink-0 rounded-lg border border-blue-300 bg-white px-3 text-xs font-semibold text-blue-600 hover:bg-blue-100">
              {uploading ? "…" : "Upload"}
            </button>
            <input ref={posterRef} type="file" accept="image/*" className="hidden" onChange={async e => {
              const f = e.target.files?.[0]; if (!f) return;
              const res = await upload(f);
              if (res) set({ poster: res.path });
            }} />
          </div>
        </div>

        <div className="flex gap-2">
          <select className={sel} value={form.mediaType} onChange={e => set({ mediaType: e.target.value as WorkMediaItem["mediaType"] })}>
            <option value="video">Video</option>
            <option value="image">Image</option>
          </select>
          <select className={sel} value={form.span} onChange={e => set({ span: e.target.value })}>
            {SPAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select className={sel} value={form.heightClass} onChange={e => set({ heightClass: e.target.value })}>
            {HEIGHT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="ml-auto flex gap-2">
            <button onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleAdd} disabled={!form.src} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-40">Add Item</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WorksSection ─────────────────────────────────────────────────────────────
function WorksSection({ label, items, update, reset }: { label: string; items: WorkMediaItem[]; update: (v: WorkMediaItem[]) => void; reset: () => void }) {
  const change = (i: number, updated: WorkMediaItem) => update(items.map((it, idx) => idx === i ? updated : it));
  const remove = (i: number) => update(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        <button onClick={reset} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100">
          Reset to defaults
        </button>
      </div>
      <div className="grid gap-3">
        {items.map((item, i) => (
          <WorkItemCard key={`${item.src}-${i}`} item={item} index={i} total={items.length}
            onChange={u => change(i, u)} onDelete={() => remove(i)} onMove={dir => move(i, dir)}
          />
        ))}
      </div>
      <AddWorkForm onAdd={item => update([...items, item])} />
    </div>
  );
}

// ─── CollageItemCard ──────────────────────────────────────────────────────────
function CollageItemCard({ item, index, total, onChange, onDelete, onMove }: {
  item: HeroCollageImage; index: number; total: number;
  onChange: (u: HeroCollageImage) => void; onDelete: () => void; onMove: (d: -1 | 1) => void;
}) {
  const set = (patch: Partial<HeroCollageImage>) => onChange({ ...item, ...patch });
  const { upload, uploading } = useUpload();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
        </div>

        {/* Fields */}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex gap-1">
            <input className={inp} placeholder="Image path e.g. /media/collage/collage-01.jpg" value={item.src} onChange={e => set({ src: e.target.value })} />
            <button type="button" onClick={() => fileRef.current?.click()} className="flex-shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-600 hover:bg-slate-100">
              {uploading ? "…" : "↑"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async e => {
              const f = e.target.files?.[0]; if (!f) return;
              const res = await upload(f);
              if (res) set({ src: res.path });
            }} />
          </div>
          <input className={inp} placeholder="Alt text (describes the image)" value={item.alt} onChange={e => set({ alt: e.target.value })} />
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Parallax tier:</label>
            <select className={sel} value={item.tier} onChange={e => set({ tier: e.target.value as HeroCollageImage["tier"] })}>
              {TIER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button onClick={() => onMove(-1)} disabled={index === 0} className="rounded p-1 text-slate-400 hover:text-slate-700 disabled:opacity-25">▲</button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} className="rounded p-1 text-slate-400 hover:text-slate-700 disabled:opacity-25">▼</button>
          <button onClick={onDelete} className="mt-auto rounded p-1 text-rose-400 hover:text-rose-600">✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── AddCollageForm ───────────────────────────────────────────────────────────
function AddCollageForm({ existingCount, onAdd }: { existingCount: number; onAdd: (item: HeroCollageImage) => void }) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [tier, setTier] = useState<HeroCollageImage["tier"]>("mid");
  const { upload, uploading } = useUpload();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!src) return;
    const className = COLLAGE_POSITIONS[existingCount % COLLAGE_POSITIONS.length];
    onAdd({ src, alt, tier, className });
    setSrc(""); setAlt(""); setTier("mid");
    setOpen(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-4 w-full rounded-2xl border-2 border-dashed border-slate-300 py-4 text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600">
        + Add new collage image
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border-2 border-blue-300 bg-blue-50 p-5">
      <p className="mb-3 text-sm font-bold text-blue-700">New Collage Image</p>
      <div className="grid gap-3">
        <div className="flex gap-1">
          <input className={inp} placeholder="Image path or upload →" value={src} onChange={e => setSrc(e.target.value)} />
          <button type="button" onClick={() => fileRef.current?.click()} className="flex-shrink-0 rounded-lg border border-blue-300 bg-white px-3 text-xs font-semibold text-blue-600 hover:bg-blue-100">
            {uploading ? "…" : "Upload"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async e => {
            const f = e.target.files?.[0]; if (!f) return;
            const res = await upload(f);
            if (res) setSrc(res.path);
          }} />
        </div>
        <input className={inp} placeholder="Alt text" value={alt} onChange={e => setAlt(e.target.value)} />
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-600">Parallax tier:</label>
          <select className={sel} value={tier} onChange={e => setTier(e.target.value as HeroCollageImage["tier"])}>
            {TIER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="ml-auto flex gap-2">
            <button onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleAdd} disabled={!src} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-40">Add Image</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CollageSection ───────────────────────────────────────────────────────────
function CollageSection({ items, update, reset }: { items: HeroCollageImage[]; update: (v: HeroCollageImage[]) => void; reset: () => void }) {
  const change = (i: number, u: HeroCollageImage) => update(items.map((it, idx) => idx === i ? u : it));
  const remove = (i: number) => update(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items]; const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]]; update(next);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">{items.length} image{items.length !== 1 ? "s" : ""} · positions auto-assigned for new items</p>
        <button onClick={reset} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100">Reset to defaults</button>
      </div>
      <div className="grid gap-3">
        {items.map((item, i) => (
          <CollageItemCard key={`${item.src}-${i}`} item={item} index={i} total={items.length}
            onChange={u => change(i, u)} onDelete={() => remove(i)} onMove={d => move(i, d)}
          />
        ))}
      </div>
      <AddCollageForm existingCount={items.length} onAdd={item => update([...items, item])} />
    </div>
  );
}

// ─── HeroVideoSection ─────────────────────────────────────────────────────────
function HeroVideoSection({ src, update, reset }: { src: string; update: (v: string) => void; reset: () => void }) {
  const { upload, uploading } = useUpload();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">The full-bleed video inside the hero card on the home page.</p>
        <button onClick={reset} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100">Reset to default</button>
      </div>

      {/* Preview */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
        <video key={src} src={src} className="h-64 w-full object-cover" muted loop autoPlay playsInline />
      </div>

      {/* Controls */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Replace Video</p>
        <div className="flex gap-2">
          <input
            className={inp}
            placeholder="Video path e.g. /media/videos/hero-showcase.mp4"
            value={src}
            onChange={e => update(e.target.value)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex-shrink-0 rounded-lg border border-blue-300 bg-blue-50 px-4 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          >
            {uploading ? "Uploading…" : "Upload video"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={async e => {
              const f = e.target.files?.[0]; if (!f) return;
              const res = await upload(f);
              if (res) update(res.path);
            }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">Uploaded files are saved to <code className="rounded bg-slate-100 px-1">/public/media/uploads/videos/</code></p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("hero-video");
  const heroVideo = useHeroVideo();
  const homeWorks = useHomeWorks();
  const galleryWorks = useGalleryWorks();
  const heroCollage = useHeroCollage();

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "hero-video", label: "Hero Video" },
    { id: "home", label: "Home — Our Works", count: homeWorks.items.length },
    { id: "gallery", label: "Gallery Page", count: galleryWorks.items.length },
    { id: "collage", label: "Hero Background", count: heroCollage.items.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Nano Grit</p>
            <h1 className="text-xl font-bold text-slate-900">Media Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              ← Back to site
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/admin-auth", { method: "DELETE" });
                window.location.href = "/admin/login";
              }}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl gap-1 px-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tab === t.id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Production upload notice */}
      {typeof window !== "undefined" && window.location.hostname !== "localhost" && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-3">
          <p className="mx-auto max-w-4xl text-xs text-amber-800">
            <strong>Production mode:</strong> Uploaded files are temporary and won&apos;t persist after the serverless function ends. To permanently add media, place the file in <code className="rounded bg-amber-100 px-1">public/media/</code> in the git repo and redeploy.
          </p>
        </div>
      )}

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        {tab === "hero-video" && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Hero Section Video</h2>
              <p className="mt-1 text-sm text-slate-500">The full-bleed video shown in the hero card on the home page. Upload a new one or change the path.</p>
            </div>
            <HeroVideoSection src={heroVideo.src} update={heroVideo.update} reset={heroVideo.reset} />
          </>
        )}
        {tab === "home" && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Home Page — Our Works</h2>
              <p className="mt-1 text-sm text-slate-500">These items appear in the "Our Works" section on the home page. Changes save instantly.</p>
            </div>
            <WorksSection label="home" {...homeWorks} />
          </>
        )}
        {tab === "gallery" && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Gallery Page — Our Works</h2>
              <p className="mt-1 text-sm text-slate-500">These items appear on the /gallery page. Changes save instantly.</p>
            </div>
            <WorksSection label="gallery" {...galleryWorks} />
          </>
        )}
        {tab === "collage" && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Hero Background Images</h2>
              <p className="mt-1 text-sm text-slate-500">Scattered images in the hero section background with parallax. Positions are auto-assigned for new images.</p>
            </div>
            <CollageSection {...heroCollage} />
          </>
        )}
      </main>
    </div>
  );
}
