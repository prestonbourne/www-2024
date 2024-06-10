import { Heading, Body } from "@/components/markdown";

/*
    NoteHeading renders the title and description of a note.
    This component is also used in the note list aka index page.
*/
export const NoteHeading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <>
      <Heading level={1}>{title}</Heading>
      <Body className="text-slate-700 text-sm">{description}</Body>
    </>
  );
};
