import { AuthService } from "./services/auth";
import { CommentService } from "./services/comment";
import { FollowService } from "./services/follow";
import { LikeService } from "./services/like";
import { PostService } from "./services/post";
import { UserService } from "./services/user";

export const authService = new AuthService();
export const postService = new PostService();
export const likeService = new LikeService();
export const commentService = new CommentService();
export const userService = new UserService();
export const followService = new FollowService();