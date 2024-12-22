import { Paragraph as Body, Heading } from "@/components/typography";
import Image from "next/image";
import { Clock } from "./clock";
import { cx } from "class-variance-authority";
import NextLink from "next/link";

export function Hero() {
  return (
    <header className="max-w-screen-sm leading-none">
      <Heading level={1}>
        preston bourne
      </Heading>
      <p
        className="text-sm mt-0 pt-0 mb-6 dark:text-gray-300"
      >
        chasing beautiful, performant software
      </p>
      <Body className={"mb-2"}>
        currently a web engineer at hashicorp, where I build and maintain a
        suite of high traffic web applications.
      </Body>
      <Clock />
      <Links />
    </header>
  );
}

export function Links() {
  return (
    <div className="flex flex-row gap-3 mt-2">
      <SocialLink
        label="X"
        imageURL="/social/x.png"
        href="https://x.com/prestonbourne_"
      />
      <SocialLink
        label="LinkedIn"
        imageURL="/social/linkedin.png"
        href="https://www.linkedin.com/in/prestonbourne/"
      />
      <SocialLink
        label="Github"
        imageURL="/social/github.png"
        href="https://github.com/prestonbourne"
      />
    </div>
  );
}

export type SocialLinkProps = {
  imageURL: string;
  label: string;
  href: string;
};

export const SocialLink = ({ imageURL, label, href }: SocialLinkProps) => {
  const containerClass = cx(
    "relative overflow-clip py-2 px-4",
    "rounded-md shadow-sharp",
    "dark:bg-gray-900/50 dark:shadow-inner-shine",
    "transition-all w-36",
    "hover:cursor-pointer hover:scale-[1.05] group"
  );

  return (
    <div className={containerClass}>
      <NextLink href={href} target="_blank">
        <div className="top-0 left-0 absolute h-full w-8">
          <Image
            src={imageURL}
            loading="eager"
            sizes="32px"
            fill
            alt=""
            className="object-cover"
          />
        </div>
        <div className="ml-6 dark:group-hover:text-white">{label}</div>
      </NextLink>
    </div>
  );
};
