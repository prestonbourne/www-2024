import { Banner } from "./Banner";
import { Main } from "@/components/Main";
import { Header } from "@/components/Header";
import { Link } from "@/components/Link";

export const Home = () => {
    return (
        <>
            <Banner />
            <Header>
                <h1 className="text-2xl lg:text-3xl font-bold md:pb-2">
                    Preston Bourne
                    <span className="text-base lg:text-lg text-slate-500">
                        &nbsp;/ engineering + design
                    </span>
                </h1>
                <p className="text-lg text-slate-700 font-medium">
                    Crafting beautiful & performant software
                </p>
            </Header>
            <Main>
                <Body>
                    I earned my Bachelor&rsquo;s degree in Design & Technology
                    from <Link href="https://www.newschool.edu/parsons/bfa-design-technology/" target={'_blank'} >Parsons in New York </Link> . During my
                    penultimate year, I had the privilege of studying as an
                    exchange student at <Link href={"https://tech.cornell.edu/"} target="_blank" >Cornell University</Link>, collaborating with
                    graduate students under the mentorship of a Ph.D. at
                    Microsoft Azure on solutions to safeguard LLMs in regulated
                    sectors such as Finance and Healthcare.
                </Body>
                <Body>
                    I interned at <Link href="https://www.hashicorp.com/" target="_blank" >Hashicorp</Link> and received an offer to return
                    full-time as an Engineer on the Web Infrastructure and
                    Platforms team.
                </Body>
                <Body>
                    In tandem with my professional life, I&apos;m pursuing a
                    Master&apos;s in Computer Science at NYU Tandon. My studies
                    focus on Computer rendering, perception and vision.
                </Body>
                <Body>
                    You&apos;re invited to explore my written work, technical
                    projects and social media profiles. If you have questions
                    about how I built or advice on how to improve something,
                    don&apos;t hesitate to reach out.
                </Body>
                <Body>
                    <hr className="my-4" />
                    <Link href="https://www.linkedin.com/in/prestonbourne/" target="_blank">LinkedIn</Link>
                    &nbsp;|&nbsp;
                    <Link href="https://twitter.com/prestonxbourne" target="_blank">X / Twitter</Link>
                </Body>
            </Main>
        </>
    );
};

interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const Body: React.FC<BodyProps> = ({ className, children, ...props }) => {
    return (
        <p
            className={`text-sm md:text-base leading-relaxed my-2 ${className}`}
            {...props}
        >
            {children}
        </p>
    );
};
