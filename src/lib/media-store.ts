"use client";
import { useCallback, useEffect, useState } from "react";
import { HERO_COLLAGE, WORKS, WorkMediaItem, HeroCollageImage } from "@/content/site";

const KEYS = { home: "ng_home_works", gallery: "ng_gallery_works", collage: "ng_hero_collage", heroVideo: "ng_hero_video" };

const HERO_VIDEO_DEFAULT = "/media/videos/hero-showcase.mp4";

function load<T>(key: string, fallback: () => T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback();
  } catch {
    return fallback();
  }
}

function save<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function useHomeWorks() {
  const [items, setItems] = useState<WorkMediaItem[]>(() => WORKS.slice(0, 5));
  useEffect(() => { setItems(load(KEYS.home, () => WORKS.slice(0, 5))); }, []);
  const update = useCallback((next: WorkMediaItem[]) => { setItems(next); save(KEYS.home, next); }, []);
  const reset = useCallback(() => { const d = WORKS.slice(0, 5); setItems(d); window.localStorage.removeItem(KEYS.home); }, []);
  return { items, update, reset };
}

export function useGalleryWorks() {
  const [items, setItems] = useState<WorkMediaItem[]>(() => WORKS.slice(4));
  useEffect(() => { setItems(load(KEYS.gallery, () => WORKS.slice(4))); }, []);
  const update = useCallback((next: WorkMediaItem[]) => { setItems(next); save(KEYS.gallery, next); }, []);
  const reset = useCallback(() => { const d = WORKS.slice(4); setItems(d); window.localStorage.removeItem(KEYS.gallery); }, []);
  return { items, update, reset };
}

export function useHeroVideo() {
  const [src, setSrc] = useState<string>(HERO_VIDEO_DEFAULT);
  useEffect(() => { setSrc(load(KEYS.heroVideo, () => HERO_VIDEO_DEFAULT)); }, []);
  const update = useCallback((next: string) => { setSrc(next); save(KEYS.heroVideo, next); }, []);
  const reset = useCallback(() => { setSrc(HERO_VIDEO_DEFAULT); window.localStorage.removeItem(KEYS.heroVideo); }, []);
  return { src, update, reset };
}

export function useHeroCollage() {
  const [items, setItems] = useState<HeroCollageImage[]>(() => [...HERO_COLLAGE]);
  useEffect(() => { setItems(load(KEYS.collage, () => [...HERO_COLLAGE])); }, []);
  const update = useCallback((next: HeroCollageImage[]) => { setItems(next); save(KEYS.collage, next); }, []);
  const reset = useCallback(() => { setItems([...HERO_COLLAGE]); window.localStorage.removeItem(KEYS.collage); }, []);
  return { items, update, reset };
}
