<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePostRequest;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController
{

    public function __construct(protected PostService $postService) {}

    public function getPosts(Request $req)
    {
        $user = $req->query("user");
        return response()->json($this->postService->getPosts(Auth::id(), $user));
    }

    public function createPost(CreatePostRequest $req)
    {
        $validated = $req->validated();
        $caption = $validated["caption"];

        $file = $req->file("image");
        $image = null;
        if ($file != null && $file->isValid()) {
            if ($file->store("uploads", "public")) {
                $image = $file->hashName();
            }
        }

        return response()->json($this->postService->createPost(userId: Auth::id(), caption: $caption, image: $image));
    }

    public function updatePost(CreatePostRequest $req, string $id): Post | JsonResponse
    {
        $validated = $req->validated();
        $caption = $validated["caption"];

        $post = $this->postService->updatePost(userId: Auth::id(), id: $id, caption: $caption);
        if ($post == null) {
            return response()->json([
                "error" => "Post not found"
            ], status: 404);
        }

        return $post;
    }

    public function deletePost(string $id)
    {
        if ($this->postService->deletePost(userId: Auth::id(), postId: $id)) {
            return response()->noContent(status: 200);
        } else {
            return response()->json([
                "error" => "Post not found"
            ], status: 404);
        }
    }
}
