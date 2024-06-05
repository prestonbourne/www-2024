import { Banner } from "./Banner";
import { Main } from "@/components/Main";
import { Header } from "@/components/Header";
import { Heading, Body, Link } from "@/components/markdown";

export const Home = () => {
    return (
        <>
            <Banner />
            <Header>
                <Heading
                    level={2}
                    render="h1"
                >
                    Preston Bourne
                    <span className="text-base lg:text-lg text-slate-500">
                        &nbsp;/ engineering + design
                    </span>
                </Heading>
                <p className="text-lg text-slate-700 font-medium">
                    Crafting beautiful & performant software
                </p>
            </Header>
            <Main>
                <Body>
                    I earned my Bachelor&rsquo;s degree in Design & Technology
                    from{" "}
                    <Link
                        href="https://www.newschool.edu/parsons/bfa-design-technology/"
                        target="_blank"
                    >
                        Parsons School of Design
                    </Link>
                    . In my final year, I had the privilege of studying as an
                    exchange student at{" "}
                    <Link href={"https://tech.cornell.edu/"} target="_blank">
                        Cornell University
                    </Link>
                    &nbsp;where I worked with MS and MBA students under a Ph.D.
                    mentor from Microsoft Azure. We iterated on solutions to
                    productionize LLMs in regulated sectors such as Finance and
                    Healthcare.
                </Body>
                <Body>
                    The previous summer, I interned at{" "}
                    <Link href="https://www.hashicorp.com/" target="_blank">
                        Hashicorp
                    </Link>{" "}
                    and received an offer to return as a full-time Engineer on
                    the Web Infrastructure and Platforms team, where I work to
                    this day.
                </Body>
                <Body>
                    In tandem with my professional life, I&rsquo;m pursuing a
                    Master&rsquo;s in Computer Science at NYU Tandon. My studies
                    focus on Computer rendering, perception and vision.
                </Body>
                <Body>
                    You&rsquo;re invited to explore my written work, technical
                    projects and online profiles. If you have questions about
                    how I built or advice on how to improve something,
                    don&rsquo;t hesitate to reach out.
                </Body>
                <hr className="my-4" />
                <Body>
                    <Link
                        href="https://www.linkedin.com/in/prestonbourne/"
                        target="_blank"
                    >
                        LinkedIn
                    </Link>
                    &nbsp;|&nbsp;
                    <Link
                        href="https://twitter.com/prestonxbourne"
                        target="_blank"
                    >
                        X / Twitter
                    </Link>
                    &nbsp;|&nbsp;
                    <Link
                        href="https://sketches.prestonbourne.dev"
                        target="_blank"
                    >
                        Code Sketches
                    </Link>
                    &nbsp;|&nbsp;
                    <Link
                        href="/notes"
                    >
                        Notes
                    </Link>
                </Body>
            </Main>
        </>
    );
};
