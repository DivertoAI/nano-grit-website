"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BRAND } from "@/content/site";

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20Nano%20Grit%2C%20I%27d%20like%20to%20get%20a%20quote.`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_24px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_32px_rgba(37,211,102,0.6)] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <Image src="/icons/whatsapp-mark.svg" alt="WhatsApp" width={28} height={28} />
    </a>
  );
}
