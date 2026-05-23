"use client";
import { WorksGrid } from "@/components/sections/works-grid";
import { useGalleryWorks } from "@/lib/media-store";

export function GalleryClient() {
  const { items } = useGalleryWorks();
  return <WorksGrid items={items} />;
}
