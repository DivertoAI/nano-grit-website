import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { WorksGrid } from "@/components/sections/works-grid";
import { WORKS } from "@/content/site";

export const metadata: Metadata = {
  title: "Our Works | Nano Grit Detailing & Coating Solutions",
  description: "Real correction, coating, and detailing work from the Nano Grit workshop floor — paint enhancement, ceramic coatings, and full detail outcomes.",
  openGraph: {
    title: "Our Works | Nano Grit",
    description: "Real workshop results: paint correction, ceramic coatings, and premium detailing for cars and bikes.",
    images: [{ url: "/media/collage/collage-01.jpg", width: 1200, height: 630 }],
  },
};

export default function GalleryPage() {
  return (
    <main className="pb-16">
      <PageHero
        title="Our Works"
        description="Real workshop moments from correction, coating prep, gloss checks, and final delivery outcomes."
      />
      <section className="shell mt-10">
        <WorksGrid items={WORKS.slice(4)} />
      </section>
    </main>
  );
}
