import { Paragraph as Body, Heading } from "@/components/typography";
import Image from "next/image";
import { Clock } from "./clock";
import { cx } from "class-variance-authority";
import NextLink from "next/link";

export function Hero() {
  return (
    <header className="max-w-screen-sm leading-none">
      <Heading level={2} render="h1">
        preston bourne
      </Heading>
      <Heading
        level={5}
        render="h2"
        className="mt-0 pt-0 mb-6 dark:text-gray-300"
      >
        chasing beautiful, performant software
      </Heading>
      <Body className={"mb-2"}>
        currently a web engineer at hashicorp, where I build and maintain a
        suite of high traffic web applications.
      </Body>
      <Clock className="mb-8" />
      <Links />
    </header>
  );
}

export function Links() {
  return (
    <div className="flex flex-row gap-3 mt-2">
      <SocialLink label="X" imageURL="/social/x.png" />
      <SocialLink label="LinkedIn" imageURL="/social/linkedin.png" />
      <SocialLink label="Github" imageURL="/social/github.png" />
    </div>
  );
}

export type LinkCardProps = {
  imageURL: string;
  label: string;
};

export const SocialLink = ({ imageURL, label }: LinkCardProps) => {
  const containerClass = cx(
    "relative overflow-clip py-2 px-4",
    "rounded-md shadow-sharp",
    "dark:bg-gray-900/50 dark:shadow-inner-shine",
    "transition-all w-36",
    "hover:cursor-pointer hover:scale-[1.05] group"
  );

  return (
    <div className={containerClass}>
      <div className="top-0 left-0 absolute h-full w-8">
        <Image src={imageURL} sizes="32px" fill alt="" className="object-cover" />
      </div>
      <div className="ml-6">
        <NextLink className="dark:group-hover:text-white" href="">
          {label}
        </NextLink>
      </div>
    </div>
  );
};
