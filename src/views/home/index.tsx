import { Banner } from "./Banner";
import { Main } from "@/components/Main";
import { Header } from "@/components/Header";

export const Home = () => {
    return (
        <>
            <Banner />
            <Header>
                <h1 className="text-4xl font-bold pb-2">
                    Preston Bourne
                    <span className="text-xl text-slate-500">
                        &nbsp;/ engineering + design
                    </span>
                </h1>
                <p className="text-2xl font-bold text-slate-700">
                    Crafting beautiful & performant software
                </p>
            </Header>
            <Main>
                <Body>
                    I earned my Bachlor&rsquo;s degree in Design & Technology
                    from Parsons in New York. In my penultimate year, I was
                    accepted as an exchange student at Cornell University where I worked with graduate students and was advised by a Ph.d at Microsoft Azure
                    on building solutions to ensure LLMs were safe enough for highly regulated production environments like Finance and Healthcare.
                </Body>
                <Body>
                    I interned at @Hashicorp and received an offer to join fulltime as an
                    Engineer on the Web Infrastucture and Platforms team.
                </Body>
                <Body>
                    In tandem with my professional life, I&apos;m
                    pursuing a Master&apos;s in Computer Science @ NYU Tandon.
                    My studies focus on Computer rendering, perception and vision.
                </Body>
                <Body>
                    You&apos;re invited to explore my written work, technical
                    projects and social media profiles. If you have questions
                    about how I built or advice on how to improve
                    something. Don&apos;t hesitate to reach out.
                </Body>
            </Main>
        </>
    );
};

interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const Body: React.FC<BodyProps> = ({ className, children, ...props }) => {
    return (
        <p className={`text-base leading-relaxed my-2 font-[450] ${className}`} {...props}>
            {children}
        </p>
    );
};
