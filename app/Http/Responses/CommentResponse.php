<?php

namespace App\Http\Responses;

use App\Models\Comment;

class CommentResponse
{
    public Comment $comment;
    public UserMeta $author;

    public function __construct(Comment $comment, UserMeta $author)
    {
        $this->comment = $comment;
        $this->author = $author;
    }
}
