"use client";

import { WorkMediaItem } from "@/content/site";
import Image from "next/image";
import { useState } from "react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { WorkMediaModal } from "@/components/ui/work-media-modal";

export function WorksGrid({ items }: { items: WorkMediaItem[] }) {
  const [activeItem, setActiveItem] = useState<WorkMediaItem | null>(null);

  return (
    <>
      <div className="workshop-band workshop-band-brown rounded-[1.6rem] px-6 py-8 md:px-8 md:py-10">
        <div className="grid items-start gap-4 md:grid-cols-12">
          {items.map((item, index) => (
            <SectionReveal
              key={`${item.title}-${index}`}
              className={`work-card group self-start overflow-hidden rounded-[1.1rem] border border-white/12 ${item.span}`}
            >
              <div className={`relative overflow-hidden ${item.heightClass}`}>
                <button
                  type="button"
                  className="relative block h-full w-full text-left"
                  aria-label={`Open ${item.title} in fullscreen`}
                  onClick={() => setActiveItem(item)}
                >
                  {item.mediaType === "video" ? (
                    <video
                      className="h-full w-full object-cover"
                      poster={item.poster}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={(event) => event.currentTarget.play().catch(() => null)}
                      onMouseLeave={(event) => {
                        event.currentTarget.pause();
                        event.currentTarget.currentTime = 0;
                      }}
                    >
                      <source src={item.src} type="video/mp4" />
                    </video>
                  ) : (
                    <Image src={item.src} alt={item.alt} fill className="object-cover" />
                  )}
                </button>
              </div>
              <div className="work-overlay p-4">
                <h2 className="display-font text-2xl tracking-[0.03em] text-white">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-slate-200">{item.label}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
      <WorkMediaModal item={activeItem} onClose={() => setActiveItem(null)} />
    </>
  );
}
