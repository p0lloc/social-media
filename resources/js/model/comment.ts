import { UserMeta } from "./user";

export interface Comment {
    id: string;
    content: string;
    created_at: string;
}

export interface CommentResponse {
    comment: Comment;
    author: UserMeta;
}