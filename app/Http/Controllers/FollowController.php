<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateFollowRequest;
use App\Http\Responses\FollowResponse;
use App\Services\FollowService;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;

class FollowController
{

    public function __construct(protected FollowService $followService, protected UserService $userService) {}

    public function getFollows()
    {
        $follows = $this->followService->getFollowsFrom(userId: Auth::id());
        $res = [];

        foreach ($follows as $follow) {
            array_push($res, new FollowResponse(
                follow: $follow,
                user: $this->userService->getUserMetaById($follow->to_id)
            ));
        }

        return $res;
    }

    public function createFollow(CreateFollowRequest $req)
    {
        $validated = $req->validated();
        $follow = $this->followService->createFollow(
            fromId: Auth::id(),
            toId: $validated["to_id"]
        );

        if ($follow == null) {
            return response()->json(["error" => "You are already following this user!"], 400);
        }

        return $follow;
    }

    public function getFollow(string $toUser)
    {
        $followId = $this->followService->userFollowsUser(Auth::id(), $toUser);
        if ($followId == null) {
            return response('', status: 404);
        }

        return response($followId);
    }

    public function deleteFollow(string $id)
    {
        if ($this->followService->deleteFollow(
            fromId: Auth::id(),
            followId: $id
        )) {
            return response()->noContent(status: 200);
        } else {
            return response()->json([
                "error" => "You are not following this user."
            ], status: 404);
        }
    }
}
