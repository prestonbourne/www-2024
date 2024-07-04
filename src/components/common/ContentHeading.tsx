import { Heading, Body } from "@/components/markdown";

export const ContentHeading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <>
      <Heading level={1} className="pb-1">{title}</Heading>
      <Body className="text-sub-text py-2">{description}</Body>
    </>
  );
};