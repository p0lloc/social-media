<?php

namespace App\Http\Responses;

class UserMeta
{
    public string $id;
    public string $username;
    public string $name;
    public string | null $avatar;

    public function __construct(
        string $id,
        string $username,
        string $name,
        string | null $avatar
    ) {
        $this->id = $id;
        $this->username = $username;
        $this->name = $name;
        $this->avatar = $avatar;
    }

    public static function fromJson(array $json): UserMeta
    {
        return new UserMeta(id: $json["id"], username: $json["username"], name: $json["name"], avatar: $json["avatar"]);
    }

    public function toJson(): array
    {
        return [
            "id" => $this->id,
            "username" => $this->username,
            "name" => $this->name,
            "avatar" => $this->avatar
        ];
    }
}
