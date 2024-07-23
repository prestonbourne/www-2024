import { Paragraph } from "./typography/Paragraph";
import { Heading } from "./typography/Heading";

export const ContentHeading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <>
      <Heading level={1} className="pb-1">
        {title}
      </Heading>
      <Paragraph className="text-sub-text py-2">{description}</Paragraph>
    </>
  );
};
