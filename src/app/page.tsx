import { Hero } from "@/components/hero";
import { WorkGrid } from "@/components/work/grid";
import { SketchList } from "@/components/sketches";
import { HomeSection } from "@/components/home-section";

export default function Page() {
  const getStaggerVal = (int: number) =>
    ({
      "--animation-order": int,
    } as React.CSSProperties);

  return (
    <main className="w-full mx-auto flex flex-col gap-6">
      <Hero />
      <div className="my-4 flex flex-col gap-24">
        <HomeSection
          title="work"
          description="things i shipped at my day job alongside academic research and projects, every now and then, a technical article"
          link="/work"
        >
          <WorkGrid />
        </HomeSection>
        <HomeSection
          title="sketches"
          description="math, ai, algorithms, computer graphics, experimental design and
          interface components"
        >
          <SketchList />
        </HomeSection>
      </div>
    </main>
  );
}
