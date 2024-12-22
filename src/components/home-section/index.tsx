import { ComponentProps } from "react";
import { Heading, Paragraph } from "../typography";
import NextLink from "next/link";
import { Link2Icon } from "@radix-ui/react-icons";

type HomeSectionProps = ComponentProps<"section"> & {
  title: string;
  description: string;
  link?: string;
  children: React.ReactNode;
};

export const HomeSection: React.FC<HomeSectionProps> = ({
  title,
  description,
  children,
  link,
  ...rest
}) => {
  const headerLink = link ? (
    <Heading level={2} >
      <NextLink href={link} className="group hover:text-purple-600 dark:hover:text-lime-500">
        {title}
        <Link2Icon className="ml-2 w-6 h-6 group-hover:opacity-100 opacity-0 inline-block" />
      </NextLink>
    </Heading>
  ) : (
    <Heading level={2} className="mb-0 pb-0">
      {title}
    </Heading>
  );

  return (
    <section {...rest}>
      {headerLink}
      <Paragraph className="mb-4">{description}</Paragraph>
      {children}
    </section>
  );
};
