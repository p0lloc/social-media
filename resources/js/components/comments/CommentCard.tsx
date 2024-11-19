import { Link } from "wouter";
import { CommentResponse } from "../../model/comment";
import Avatar from "../base/Avatar";
import { BASE_URL, DEFAULT_AVATAR } from "../../constants";

function CommentCard({ comment }: { comment: CommentResponse }) {
    return (
        <div className={"flex items-center gap-4"}>
            <Avatar image={`${BASE_URL}/storage/avatars/${comment.author.avatar ?? DEFAULT_AVATAR}`} customClass={"w-14 h-14"} />
            <div className={"flex-1"}>
                <Link to={`/profile/${comment.author.username}`}><b className={"text-sm"}>{comment.author.name} (@{comment.author.username})</b></Link>
                <p className={"text-sm"}>{comment.comment.content}</p>
                <p className={"text-xs text-gray-500 mt-2"}>{comment.comment.created_at}</p>
            </div>
        </div>
    );
};

export default CommentCard;