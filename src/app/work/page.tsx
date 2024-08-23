import type { Metadata } from "next";
import { ContentHeading, Divider, Header } from "@/components";


const description =
  "My gallery of selected work from industry and academia. If it's here, it shipped or was presented.";

export const metadata: Metadata = {
  title: "Work",
  description,
};

export default function NotesHome() {
  return (
    <>
      <Header className="py-0 px-0">
        <ContentHeading title="Work" description={description} />
        <Divider className="mt-2 mb-4" />
      </Header>
    </>
  );
}



