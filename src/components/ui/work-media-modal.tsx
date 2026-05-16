"use client";

import { WorkMediaItem } from "@/content/site";
import Image from "next/image";
import { useEffect, useRef } from "react";

type WorkMediaModalProps = {
  item: WorkMediaItem | null;
  onClose: () => void;
};

export function WorkMediaModal({ item, onClose }: WorkMediaModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!item) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const requestFullScreen = async () => {
    if (!videoRef.current) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await videoRef.current.requestFullscreen();
      }
    } catch {
      // Ignore browser fullscreen errors.
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl rounded-2xl border border-white/15 bg-slate-900 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <div className="mb-3 flex items-center justify-between gap-3 px-2">
          <div>
            <p className="display-font text-2xl tracking-[0.03em] text-white">
              {item.title}
            </p>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
              {item.label}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {item.mediaType === "video" ? (
              <button
                type="button"
                onClick={requestFullScreen}
                className="rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
              >
                Full Screen
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
            >
              Close
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl bg-black">
          {item.mediaType === "video" ? (
            <video
              ref={videoRef}
              className="h-[75vh] w-full bg-black object-contain"
              controls
              autoPlay
              playsInline
              poster={item.poster}
            >
              <source src={item.src} type="video/mp4" />
            </video>
          ) : (
            <div className="relative h-[75vh] w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
