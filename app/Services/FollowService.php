<?php

namespace App\Services;

use App\Models\Follow;
use Illuminate\Support\Facades\Redis;

class FollowService
{

    public function getFollowsFrom(string $userId)
    {
        return Follow::query()
            ->where("from_id", $userId)
            ->get();
    }

    public function userFollowsUser(string $fromId, string $toId): string | null
    {
        $cacheKey = $this->followsCacheKey($fromId, $toId);
        $cached = Redis::get($cacheKey);
        if ($cached !== null) {
            return $cached != "null" ? $cached : null;
        }

        $following = Follow::query()
            ->where("from_id", $fromId)
            ->where("to_id", $toId)
            ->first();

        $value = $following != null ? $following->id : "null";
        Redis::set($cacheKey, $value);
        return $value;
    }

    public function createFollow(string $fromId, string $toId): Follow | null
    {
        $existing = Follow::where("from_id", $fromId)
            ->where("to_id", $toId)
            ->first();

        if ($existing != null) {
            return null;
        }

        $follow = Follow::create([
            "from_id" => $fromId,
            "to_id" => $toId,
        ]);

        Redis::set($this->followsCacheKey($fromId, $toId), $follow->id);
        return $follow;
    }

    public function deleteFollow(string $fromId, string $followId): bool
    {
        $follow = Follow::where("from_id", $fromId)
            ->where("id", $followId)
            ->first();

        if ($follow == null) {
            return false;
        }

        $follow->delete();
        Redis::set($this->followsCacheKey($fromId, $follow->to_id), "null");
        return true;
    }

    private function followsCacheKey(string $fromId, string $toId): string
    {
        return "follows_{$fromId}_{$toId}";
    }
}
