<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController
{

    public function __construct(protected UserService $userService) {}
    private const PROVIDER_NAME = "google";

    public function redirect()
    {
        return Socialite::driver($this::PROVIDER_NAME)->redirect();
    }

    public function callback()
    {
        $user = Socialite::driver($this::PROVIDER_NAME)->user();
        $email = $user->getEmail();
        $avatar = $user->getAvatar();

        if (!$this->userService->onThirdPartyCallback($this::PROVIDER_NAME, $email, $avatar)) {
            return response()->json(["error" => "Account already exists"], status: 400);
        }

        return redirect("http://localhost:8000");
    }
}
