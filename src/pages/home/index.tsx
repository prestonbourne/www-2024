import { Banner } from "./Banner";
import { Main } from "@/components/Main";
import { Header } from "@/components/Header";

export const Home = () => {
    return (
        <>
            <Banner />
            <Header>
                <h1 className="text-4xl font-bold">
                    Preston Bourne
                    <span className="text-xl text-slate-500">
                        &nbsp;/ engineering + design
                    </span>
                </h1>
            </Header>
            <Main>
                <p className="text-2xl mb-4 font-bold text-slate-700">
                    Chasing performant & beautiful software
                </p>
                <Body>
                    I earned my Bachlor&rsquo;s degree in Design & Technology
                    from Parsons in New York. In my penultimate year, I was
                    accepted as an exchange student at Cornell University.
                    During this time, I was advised by a Ph.d Researcher at
                    Microsoft where we focused on making Large Language Models
                    safe enough for production in environments.
                </Body>
                <Body>
                    Subsequently, after graduation, I joined Hashicorp as an
                    Engineer where I do a mixture of Frontend, Server side and
                    DevOps work.
                </Body>
                <Body>
                    In tandem with current my professional life, I&apos;m
                    pursuing a Master&apos;s in Computer Science @ NYU Tandon.
                    My studies encompass Physics, Computer Graphics and Applied
                    Machine Learning with a focus on Vision and Rendering.
                </Body>
                <Body>
                    I welcome you to explore some of my written work, technical
                    projects and social media profiles. If you have a question
                    about how I built something or advice on how to improve
                    something. Don&apos;t hesitate to reach out.
                </Body>
            </Main>
        </>
    );
};

interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const Body: React.FC<BodyProps> = ({ className, children, ...props }) => {
    return (
        <p className={`text-base my-4 font-[450] ${className}`} {...props}>
            {children}
        </p>
    );
};
