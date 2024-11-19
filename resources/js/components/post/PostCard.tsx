import { useContext, useState } from "react";
import { Post, PostResponse } from "../../model/post";
import Avatar from "../base/Avatar";
import { authContext } from "../../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { commentService, likeService, postService } from "../../bootstrap";
import { Like } from "../../model/like";
import { Comment, CommentResponse } from "../../model/comment";
import CommentSection from "../comments/CommentSection";
import Button from "../base/Button";
import { BASE_URL, DEFAULT_AVATAR } from "../../constants";
import { Link } from "wouter";

function PostCard({ post, onLike, onUnlike, onComment }: { post: PostResponse, onLike: (l: Like) => void, onUnlike: () => void, onComment: (c: CommentResponse[]) => void }) {

    const [commentSection, setCommentSection] = useState(false);
    const [comments, setComments] = useState<CommentResponse[]>([]);

    const auth = useContext(authContext);

    async function like() {
        if (post.liked == null) {
            let like = await likeService.likePost(post.post.id);
            onLike(like);
        } else {
            await likeService.unlikePost(post.liked);
            onUnlike();
        }
    }

    async function toggleCommentSection() {
        if (!commentSection) {
            let comments = await postService.getPostComments(post.post.id);
            setComments(comments);
        }

        setCommentSection(!commentSection);
    }

    async function createComment(content: string) {
        let comments = await commentService.createComment(post.post.id, content);
        onComment(comments);
        setComments(comments);
    }

    return (
        <div className="bg-white p-2 border rounded-md">
            <div className="flex items-center gap-4">
                <Avatar image={`${BASE_URL}/storage/avatars/${post.author.avatar ?? DEFAULT_AVATAR}`} />
                <div>
                    <p className="text-xl">{post.author.name}</p>
                    <Link className="text-sm text-blue-700" to={`/profile/${post.author.username}`}>@{post.author.username}</Link>
                </div>
            </div>
            {post.post.image != null ?
                <img className="h-52 object-cover w-full mt-2" src={`http://localhost:8000/storage/uploads/${post.post.image}`}></img> : null
            }

            <p className="mt-2">{post.post.caption}</p>

            {
                auth.authenticatedUser != null ?
                    (<>
                        <div className="flex gap-2 items-center mt-4">
                            <Button onClick={toggleCommentSection} size="small" bold={false} color="white">
                                <FontAwesomeIcon icon={faComment} className="text-blue-400" />
                                Comment ({post.comments})
                            </Button>

                            <Button onClick={like} size="small" bold={false} color={post.liked != null ? "blue" : "white"} >
                                <FontAwesomeIcon icon={faThumbsUp} className={post.liked ? "text-white" : "text-blue-400"} />
                                Like ({post.likes})
                            </Button>
                        </div>
                    </>
                    ) : null
            }

            {
                commentSection ? <CommentSection comments={comments} createComment={createComment} /> : null
            }
        </div >
    );
};

export default PostCard;