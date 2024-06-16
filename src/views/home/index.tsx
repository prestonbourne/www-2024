import { Banner } from "./Banner";
import { Main } from "@/components/Main";
import { Header } from "@/components/Header";
import {
  Heading,
  Body as BaseBody,
  Link,
  Divider,
} from "@/components/markdown";
import { ComponentProps } from "react";

const Body = ({ children }: ComponentProps<"p">) => {
  return <BaseBody className="py-2">{children}</BaseBody>;
};

export const Home = () => {
  return (
    <>
      <Banner />
      <Header>
        <Heading level={2} render="h1" className="pb-2">
          Preston Bourne
          <span className="text-base lg:text-lg">
            &nbsp;/ engineering + design
          </span>
        </Heading>
        <p className="text-lg font-medium">
          Crafting beautiful & performant software
        </p>
      </Header>
      <Main>
        <Body>
          I earned my Bachelor&rsquo;s in Design & Technology from{" "}
          <Link
            href="https://www.newschool.edu/parsons/bfa-design-technology/"
            target="_blank"
          >
            Parsons School of Design
          </Link>
          . I had the privilege of studying as an exchange student at{" "}
          <Link href={"https://tech.cornell.edu/"} target="_blank">
            Cornell University
          </Link>, here, I worked with graudate students under a Ph.D. advisor. We collaborated with Microsoft on ways to safely productionize LLMs in
          regulated sectors such as Finance and Healthcare.
        </Body>
        <Body>
          I currently work as an Engineer at{" "}
          <Link href="https://www.hashicorp.com/" target="_blank">
            Hashicorp
          </Link>
          . I build and maintain a suite of high traffic web applications,
          alongside internal tools for marketing, engineering and design
          teams.
        </Body>
        <Body>
          In tandem with my professional life, I&rsquo;m pursuing a
          Master&rsquo;s in Computer Science at NYU Tandon. My studies focus on
          Computer rendering, perception and vision.
        </Body>
        <Body>
          You&rsquo;re invited to explore my written work, technical projects
          and online profiles. If you have questions about how I built, or
          advice on how to improve something, don&rsquo;t hesitate to reach out.
          ;)
        </Body>
        <Divider className="my-4" />
        <Body>
          <Link
            href="https://www.linkedin.com/in/prestonbourne/"
            target="_blank"
          >
            LinkedIn
          </Link>
          &nbsp;|&nbsp;
          <Link href="https://twitter.com/prestonxbourne" target="_blank">
            X / Twitter
          </Link>
          &nbsp;|&nbsp;
          <Link href="https://sketches.prestonbourne.dev" target="_blank">
            Sketches
          </Link>
          &nbsp;|&nbsp;
          <Link href="/notes">Notes</Link>
        </Body>
      </Main>
    </>
  );
};
