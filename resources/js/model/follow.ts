import { UserMeta } from "./user";

export interface Follow {
    id: string;
    from_id: string;
    to_id: string;
}

export interface FollowResponse {
    user: UserMeta;
    follow: Follow;
}