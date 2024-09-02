import type { Work } from "@/lib/work/types";
import { WorkRouteGridItem } from "./component";


type WorkItemsSwitcherProps = {
    work: Work;
};
export const WorkItemsSwitcher = ({work}: WorkItemsSwitcherProps) => {
    switch (work.type) {
        case "work_route":
        case "work_external":
            return <WorkRouteGridItem work={work} />;
        default:
            return null;
    }
};

