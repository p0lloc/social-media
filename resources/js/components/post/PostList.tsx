
import { useEffect, useState } from "react";
import { Post, PostResponse } from "../../model/post";
import { postService } from "../../bootstrap";
import PostCard from "../../components/post/PostCard";
import CreatePost from "../../components/post/CreatePost";
import { Like } from "../../model/like";
import { CommentResponse } from "../../model/comment";

function PostList({ canPost, user = null }: { canPost: boolean, user?: string | null }) {

    const [posts, setPosts] = useState<PostResponse[]>([]);

    let currentPage = 1;
    let lastPage = 0;
    let fetching = false;

    useEffect(() => {
        renderPosts(1);

        document.addEventListener("wheel", onScroll);

        return () => {
            document.removeEventListener("wheel", onScroll);
        }
    }, []);

    async function onScroll() {
        if (fetching) return;

        if (currentPage == lastPage) return;

        let currentScroll = window.scrollY;
        let maxScrollHeight = document.documentElement.scrollHeight - window.innerHeight;


        if (currentScroll / maxScrollHeight > 0.7 || maxScrollHeight == 0) {
            fetching = true;
            currentPage++;
            await renderPosts(currentPage);
            fetching = false;
        }
    }

    async function renderPosts(page: number) {
        let response = await postService.getPosts(page, user);
        currentPage = response.current_page;
        lastPage = response.last_page;

        setPosts((p) => [...p, ...response.data]);
    }

    function onPostCreated(p: PostResponse) {
        setPosts([p, ...posts]);
    }

    function onPostLike(p: PostResponse, l: Like) {
        updatePost(p.post, { liked: l.id, likes: p.likes + 1 });
    }

    function onPostUnlike(p: PostResponse) {
        updatePost(p.post, { liked: null, likes: p.likes - 1 });
    }

    function onPostComment(p: PostResponse, comments: CommentResponse[]) {
        updatePost(p.post, { comments: comments.length });
    }

    function updatePost(p: Post, data: object) {
        setPosts(posts.map(v => {
            if (v.post.id == p.id) {
                return { ...v, ...data }
            } else {
                return v;
            }
        }));
    }

    return (
        <div>
            {canPost ?
                <div className="mt-4"><CreatePost onPostCreated={onPostCreated} /></div> : null}

            <div className="flex flex-col gap-2 mt-2 pb-4">
                {posts.map((p) => (
                    <PostCard key={p.post.id}
                        onUnlike={() => onPostUnlike(p)}
                        onLike={(l) => onPostLike(p, l)}
                        onComment={(comments) => onPostComment(p, comments)}
                        post={p}>

                    </PostCard>
                ))}
            </div>
        </div>
    )

}

export default PostList;