import { PageHero } from "@/components/sections/page-hero";
import { WorksGrid } from "@/components/sections/works-grid";
import { WORKS } from "@/content/site";

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
