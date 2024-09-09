import { WorkGrid } from "@/components/work/grid";
import { Heading, Paragraph } from "@/components/typography";
import { BackLink } from "@/components/back-link";


export default function WorkPage() {
  return (
      <main>
        <BackLink href="/" />
        <Heading level={1} render="h1" className="mb-0 pb-0">
          work
        </Heading>
        <Paragraph className="mb-4">
          things i shipped at my day job alongside academic research and projects,
          every now and then, a technical article
        </Paragraph>
        <WorkGrid />
      </main>
  );
}
