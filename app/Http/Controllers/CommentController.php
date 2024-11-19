<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Services\CommentService;
use Illuminate\Support\Facades\Auth;

class CommentController
{

    public function __construct(protected CommentService $commentService) {}

    public function createComment(CreateCommentRequest $req)
    {
        $validated = $req->validated();
        return $this->commentService->createComment(
            userId: Auth::id(),
            postId: $validated["post_id"],
            content: $validated["content"]
        );
    }

    public function getPostComments(string $postId)
    {
        return $this->commentService->getPostComments($postId);
    }

    public function updateComment(UpdateCommentRequest $req, string $id)
    {
        $validated = $req->validated();
        $comment = $this->commentService->updateComment(
            userId: Auth::id(),
            commentId: $id,
            content: $validated["content"]
        );

        if ($comment == null) {
            return response()->json([
                "error" => "This comment does not exist."
            ], status: 404);
        }

        return $comment;
    }

    public function deleteComment(string $id)
    {
        if ($this->commentService->deleteComment(
            userId: Auth::id(),
            commentId: $id
        )) {
            return response()->noContent(status: 200);
        } else {
            return response()->json([
                "error" => "This comment does not exist."
            ], status: 404);
        }
    }
}
