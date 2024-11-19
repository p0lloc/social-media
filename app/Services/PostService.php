<?php

namespace App\Services;

use App\Http\Responses\PaginatedResponse;
use App\Http\Responses\PostResponse;
use App\Models\Post;

class PostService
{

    private LikeService $likeService;
    private CommentService $commentService;
    private UserService $userService;

    public function __construct(LikeService $likeService, CommentService $commentService, UserService $userService)
    {
        $this->likeService = $likeService;
        $this->commentService = $commentService;
        $this->userService = $userService;
    }

    public function getPosts(string | null $userId, string | null $byUser)
    {
        $query = Post::orderBy('created_at', 'desc');
        if ($byUser != null) {
            $query->where("user_id", $byUser);
        }

        $paginator = $query->paginate(5);
        $posts = [];
        foreach ($paginator->items() as $post) {
            array_push($posts, new PostResponse(
                post: $post,
                likes: $this->likeService->getLikeCount($post->id),
                comments: $this->commentService->getCommentCount($post->id),
                author: $this->userService->getUserMetaById($post->user_id),
                liked: $userId != null ? $this->likeService->userLikesPost($userId, $post->id) : null,
            ));
        }

        return new PaginatedResponse(
            data: $posts,
            current_page: $paginator->currentPage(),
            last_page: $paginator->lastPage(),
        );
    }

    public function createPost(string $userId, string $caption, string | null $image): PostResponse
    {
        return new PostResponse(
            post: Post::create([
                "caption" => $caption,
                "user_id" => $userId,
                "image" => $image,
            ]),
            comments: 0,
            liked: null,
            likes: 0,
            author: $this->userService->getUserMetaById($userId)
        );
    }

    public function updatePost(string $userId, string $id, string $caption): Post | null
    {
        $post = Post::find([
            "id" => $id,
            "user_id" => $userId,
        ])->first();

        if ($post == null) {
            return null;
        }

        $post->caption = $caption;
        $post->save();
        return $post;
    }

    public function deletePost(string $userId, string $postId): bool
    {
        $post = Post::query()
            ->where("user_id", $userId)
            ->where("id", $postId)
            ->first();

        if ($post == null) {
            return false;
        }

        $post->delete();
        return true;
    }
}
