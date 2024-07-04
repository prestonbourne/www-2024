import {
  Heading,
  Body as BaseBody,
  Link as BaseLink,
  LinkProps,
  Divider,
} from "@/components/markdown";
import { ComponentProps } from "react";
import { Main, Header } from "@/components/common";

const Body = ({ children, ...rest }: ComponentProps<"p">) => {
  return (
    <BaseBody className="py-2 dark:text-sub-text" {...rest}>
      {children}
    </BaseBody>
  );
};

const Link = ({ children, href, ...rest }: LinkProps) => {
  return (
    <BaseLink
      className={"dark:text-white text-sub-text"}
      href={href!}
      {...rest}
    >
      {children}
    </BaseLink>
  );
};

export const Home = () => {
  const getStaggerVal = (int: number) =>
    ({
      "--animation-order": int,
    } as React.CSSProperties);

  return (
    <>
      <Header style={getStaggerVal(1)}>
        {/* <Image
          placeholder="blur"
          src={srcImg}
          alt="Headshot of Preston Bourne"
          className="object-cover rounded-lg w-16 h-16 lg:w-20 lg:h-20 shadow-dense border-gray-400 border-2"
        /> */}
        <Heading level={2} render="h1" className="pb-1">
          Preston Bourne
        </Heading>
        <BaseBody className="italic dark:text-white">
          chasing beautiful, performant software...
        </BaseBody>
      </Header>
      <Main>
        <Body style={getStaggerVal(2)}>
          i work as an engineer at{" "}
          <Link href="https://www.hashicorp.com/" target="_blank" icon>
            hashicorp
          </Link>{" "}
          where I build and maintain a suite of high traffic web applications,
          alongside internal tools for marketing, engineering and design teams.
        </Body>
        <Body style={getStaggerVal(3)}>
          i earned my Bachelor&rsquo;s in Design & Technology from{" "}
          <Link
            href="https://www.newschool.edu/parsons/bfa-design-technology/"
            target="_blank"
            icon
          >
            parsons school of design
          </Link>{" "}
          and had the privilege of studying as an exchange student at{" "}
          <Link href={"https://tech.cornell.edu/"} target="_blank" icon>
            cornell tech
          </Link>
        </Body>
        <Body>feel free to reach out or connect with me, links below</Body>
      </Main>
    </>
  );
};

export default Home;
