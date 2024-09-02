import { Component, ComponentProps } from "react";
import { Heading, Paragraph } from "../typography";

type HomeSectionProps = ComponentProps<"section"> & {
  title: string;
  description: string;
  children: React.ReactNode;
};

export const HomeSection: React.FC<HomeSectionProps> = ({
  title,
  description,
  children,
  ...rest
}) => {
  return (
    <section {...rest}>
      <Heading level={3} render="h1" className="mb-0 pb-0">
        {title}
      </Heading>
      <Paragraph className="mb-4">{description}</Paragraph>
      {children}
    </section>
  );
};
