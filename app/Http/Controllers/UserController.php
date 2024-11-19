<?php

namespace App\Http\Controllers;

use App\Http\Responses\ProfileResponse;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController
{
    public function __construct(protected UserService $userService) {}


    public function login(Request $req)
    {
        $validated = $req->validate([
            "email" => "required",
            "password" => "required"
        ]);

        if (!$this->userService->login(email: $validated["email"], password: $validated["password"])) {
            return response()->json(["error" => "Incorrect password or email."], status: 401);
        }

        $req->session()->regenerate();

        return response('');
    }

    public function confirmEmail(Request $req)
    {
        if (!$req->hasValidSignature()) {
            abort(401);
        }

        $validated = $req->validate([
            "token" => "required"
        ]);

        $userId = $validated["token"];
        $this->userService->confirmEmail($userId);
        return response("Successfully confirmed email, thank you!");
    }

    public function resetPasswordView(Request $request)
    {
        if (!$request->hasValidSignature()) {
            abort(401);
        }

        return view('reset_password');
    }

    public function register(Request $req)
    {
        $validated = $req->validate([
            "email" => "required",
            "password" => "required"
        ]);

        if (!$this->userService->register(email: $validated["email"], password: $validated["password"])) {
            return response()->json(["error" => "Account already exists"], status: 400);
        }

        return response('');
    }

    public function setAvatar(Request $req)
    {

        $req->validate([
            "image" => "required|file|mimes:jpeg,png|max:2048",
        ]);

        $image = $req->file("image");
        if (!$image->isValid()) {
            return;
        }


        if (!$image->store("avatars", "public")) {
            return;
        }

        $hash = $image->hashName();
        $this->userService->setUserAvatar(user: Auth::id(), avatar: $hash);

        return response($hash);
    }

    public function setDescription(Request $req)
    {
        $description = $req->getContent();
        $this->userService->setUserDescription(user: Auth::id(), description: $description);

        return response('');
    }

    public function setBanner(Request $req)
    {

        $req->validate([
            "image" => "required|file|mimes:jpeg,png|max:2048",
        ]);

        $image = $req->file("image");
        if (!$image->isValid()) {
            return;
        }


        if (!$image->store("banners", "public")) {
            return;
        }

        $hash = $image->hashName();
        $this->userService->setUserBanner(user: Auth::id(), banner: $hash);

        return response($hash);
    }

    public function logout()
    {
        Auth::guard("web")->logout();
    }

    public function getUserDetails()
    {
        $user = Auth::user();
        if ($user == null) {
            return response('', status: 401);
        }

        return response()->json([
            "email" => $user->email,
            "username" => $user->username,
            "avatar" => $user->avatar
        ]);
    }

    public function setPassword(Request $req)
    {
        $validated = $req->validate([
            "previous" => "required",
            "new" => "required",
        ]);

        if (!$this->userService->setPassword(Auth::id(), $validated["previous"], $validated["new"])) {
            return response()->json(["error" => "Incorrect previous password"], status: 401);
        }

        return response('');
    }

    public function resetPassword(Request $request)
    {
        if (!$request->hasValidSignature()) {
            abort(401);
        }

        $validated = $request->validate([
            "token" => "required",
            "password" => "required"
        ]);

        $userId = $request->query("token");
        $this->userService->resetPassword($userId, $validated['password']);

        return response("Successfully reset password, you can now log in.");
    }

    public function initPasswordReset(Request $req)
    {
        $validated = $req->validate([
            "email" => "required",
        ]);

        $this->userService->initResetPassword($validated["email"]);
    }

    public function getUserByUsername(string $username)
    {
        $user = $this->userService->getUserByUsername($username);
        if ($user == null) {
            return response()->json(["error" => "User not found"], status: 404);
        }

        return response()->json(new ProfileResponse(
            id: $user->id,
            username: $user->username,
            name: $user->name,
            avatar: $user->avatar,
            description: $user->description,
            banner: $user->banner
        ));
    }
}
