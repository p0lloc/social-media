<?php

namespace App\Services;

use App\Http\Responses\CommentResponse;
use App\Models\Comment;
use Illuminate\Support\Facades\Redis;

class CommentService
{

    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function createComment(string $userId, string $postId, string $content)
    {
        Comment::create([
            "user_id" => $userId,
            "post_id" => $postId,
            "content" => $content,
        ]);

        Redis::incr($this->getCommentCountCacheKey($postId));

        return $this->getPostComments($postId);
    }

    public function getPostComments(string $postId)
    {
        $comments = Comment::where("post_id", $postId)->orderBy("created_at", "desc")->get();

        $res = [];
        foreach ($comments as $comment) {
            array_push($res, new CommentResponse(
                comment: $comment,
                author: $this->userService->getUserMetaById($comment->user_id)
            ));
        }

        return $res;
    }

    public function getCommentCount(string $postId)
    {
        $cacheKey = $this->getCommentCountCacheKey($postId);
        $cached = Redis::get($cacheKey);
        if ($cached != null) {
            return $cached;
        }

        $count = Comment::where("post_id", $postId)->count();
        Redis::set($cacheKey, $count);

        return $count;
    }

    public function updateComment(string $userId, string $commentId, string $content): Comment | null
    {
        $comment = Comment::find([
            "user_id" => $userId,
            "id" => $commentId,
        ])->first();

        if ($comment == null) {
            return null;
        }

        $comment->content = $content;
        $comment->save();
        return $comment;
    }

    public function deleteComment(string $userId, string $commentId): bool
    {
        $comment = Comment::find([
            "user_id" => $userId,
            "id" => $commentId,
        ])->first();

        if ($comment == null) {
            return false;
        }

        $comment->delete();
        return true;
    }

    private function getCommentCountCacheKey(string $postId): string
    {
        return "comment_count:$postId";
    }
}
