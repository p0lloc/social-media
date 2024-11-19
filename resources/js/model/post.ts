import { UserMeta } from "./user";

export interface Post {
    id: string;
    caption: string;
    image: string | null;
}

export interface PostResponse {
    post: Post;
    likes: number;
    comments: number;
    liked: string | null;
    author: UserMeta;
}