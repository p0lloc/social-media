<?php

namespace App\Http\Responses;

use App\Models\Follow;

class FollowResponse
{
    public Follow $follow;
    public UserMeta $user;

    public function __construct(Follow $follow, UserMeta $user)
    {
        $this->follow = $follow;
        $this->user = $user;
    }
}
