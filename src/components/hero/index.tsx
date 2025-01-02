import { Paragraph as Body, Heading, Link } from "@/components/typography";
import Image from "next/image";
import { Clock } from "./clock";
import { cx } from "class-variance-authority";
import NextLink from "next/link";
import { PersonLink } from "@/components/person-link";

export function Hero() {
  return (
    <header className="max-w-screen-sm leading-none">
      <Heading level={1}>preston bourne</Heading>
      <Body className={"my-2"}>(web ∧ graphics ∧ design) engineer</Body>
      <Body className={"mb-2"}>
        currently a{" "}
        <PersonLink name="hashicorp" url="https://www.hashicorp.com" />{" "}
        engineer, responsible for a suite of high traffic web applications.
      </Body>
      <div className="flex flex-row gap-3 my-7 items-center">
        <Links />
        <span className="text-foreground-muted">|</span>
        <Clock />
      </div>
    </header>
  );
}

export function Links() {
  return (
    <>
      <Body>
        <Link href="https://x.com/prestonb0urne" target="_blank">
          X
        </Link>
      </Body>
      <Body>
        <Link href="https://www.linkedin.com/in/prestonbourne/" target="_blank">
          LinkedIn
        </Link>
      </Body>
      <Body>
        <Link href="https://github.com/prestonbourne" target="_blank">
          Github
        </Link>
      </Body>
    </>
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
