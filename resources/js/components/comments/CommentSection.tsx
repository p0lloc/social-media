import { useContext, useState } from "react";
import { Comment, CommentResponse } from "../../model/comment";
import { authContext } from "../../context/auth";
import Avatar from "../base/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import CommentCard from "./CommentCard";
import Button from "../base/Button";
import { BASE_URL, DEFAULT_AVATAR } from "../../constants";

function CommentSection({ comments, createComment }: { comments: CommentResponse[], createComment: (c: string) => void }) {
    const auth = useContext(authContext);
    const [content, setContent] = useState("");

    function create() {
        createComment(content);
        setContent("");
    }

    return (
        <div className="p-4">
            {auth.authenticatedUser != null ? (
                <div className={"flex gap-4 items-center"}>
                    <Avatar
                        image={`${BASE_URL}/storage/avatars/${auth.authenticatedUser.avatar ?? DEFAULT_AVATAR}`}
                        customClass={"w-14 h-14"}
                    />
                    <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        type={"text"}
                        placeholder={"Write a comment..."}
                        className={"border rounded-md flex-1 p-2"}
                    />
                    <Button
                        className="py-4"
                        onClick={create}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                </div>
            ) : null}

            <div className={"flex flex-col gap-2 mt-4"}>
                {comments.map((c) => (
                    <CommentCard key={c.comment.id} comment={c} />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;