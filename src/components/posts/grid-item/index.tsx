import { PostGridItem } from "./component";
import type { Post } from "@/lib/types";


type PostItemsSwitcherProps = {
    post: Post;
};
export const PostItemsSwitcher = ({post}: PostItemsSwitcherProps) => {
    return <PostGridItem post={post} />;
};

