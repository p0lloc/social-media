<?php

namespace App\Services;

use App\Http\Responses\UserMeta;
use App\Mail\ConfirmEmail;
use App\Mail\ResetPassword;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\URL;

class UserService
{

    public function register(string $email, string $password): bool
    {
        $normalizedEmail = $this->normalizeEmail($email);
        $user = $this->getUserByEmail($normalizedEmail);

        if ($user != null)
            return false;

        $user = User::create([
            "email" => $normalizedEmail,
            "name" => "coolestkid",
            "auth_type" => "password",
            "password" => Hash::make($password),
            "description" => "coolest"
        ]);

        Mail::to($user)->send(new ConfirmEmail(
            URL::signedRoute("confirmEmail", ["token" => $user->id])
        ));

        return true;
    }

    public function confirmEmail(string $userId)
    {
        $user = $this->getUserById($userId);
        if ($user == null) return;

        $user->markEmailAsVerified();
        $user->save();
    }

    public function initResetPassword(string $email)
    {
        $user = $this->getUserByEmail($email);
        if ($user == null) return;

        Mail::to($user)->send(new ResetPassword(URL::signedRoute('resetPasswordView', ['token' => $user->id])));
    }

    public function resetPassword(string $userId, string $password)
    {
        $user = $this->getUserById($userId);
        if ($user == null) return;

        $user->password = Hash::make($password);
        $user->save();
    }

    public function setPassword(string $id, string $previous, string $new): bool
    {
        $user = $this->getUserById($id);
        if ($user == null) return false;

        if (!Hash::check($previous, $user->getAuthPassword()))
            return false;

        $user->password = Hash::make($new);
        $user->save();
        return true;
    }

    public function login(string $email, string $password): bool
    {
        return Auth::attempt([
            "email" => $email,
            "auth_type" => "password",
            "password" => $password
        ]);
    }

    public function onThirdPartyCallback(string $provider, string $email, string $avatar)
    {
        $normalizedEmail = $this->normalizeEmail($email);
        $user = $this->getUserByEmail($normalizedEmail);

        // Don't let existing users login/register with a different provider.
        if ($user != null && $user->auth_type != $provider) {
            return false;
        }

        if ($user == null) {
            $user = $this->registerThirdParty($provider, $email, $avatar);
        }

        Auth::login($user);
    }

    public function setUserAvatar(string $user, string $avatar)
    {
        $user = $this->getUserById($user);
        if ($user == null) return;

        $user->avatar = $avatar;
        $user->save();

        $this->updateCachedMeta($user);
    }

    public function setUserDescription(string $user, string $description)
    {
        $user = $this->getUserById($user);
        if ($user == null) return;

        $user->description = $description;
        $user->save();
    }

    public function setUserBanner(string $user, string $banner)
    {
        $user = $this->getUserById($user);
        if ($user == null) return;

        $user->banner = $banner;
        $user->save();
    }

    private function updateCachedMeta(User $user)
    {
        $meta = $this->userMetaFromUser($user);
        Redis::set($this->userMetaCacheKey($user->id), json_encode($meta->toJson()));
    }

    private function userMetaFromUser(User $user): UserMeta
    {
        return new UserMeta(
            id: $user->id,
            username: $user->username,
            name: $user->name,
            avatar: $user->avatar
        );
    }

    public function getUserMetaById(string $id): UserMeta | null
    {
        $cached = Redis::get($this->userMetaCacheKey($id));
        if ($cached != null) {
            return $cached != "null" ? UserMeta::fromJson(json_decode($cached, true)) : null;
        }

        $user = $this->getUserById($id);
        if ($user == null) {
            Redis::set($this->userMetaCacheKey($id), "null");
            return null;
        }

        $meta = $this->userMetaFromUser($user);

        Redis::set($this->userMetaCacheKey($id), json_encode($meta->toJson()));
        return $meta;
    }

    private function registerThirdParty(string $provider, string $email, string $avatar): User
    {
        return User::create([
            "email" => $email,
            "name" => $email,
            "auth_type" => $provider,
            "password" => "",
            "description" => ""
        ]);
    }

    private function normalizeEmail(string $email): string
    {
        return strtolower($email);
    }


    public function getUserById(string $id): User | null
    {
        return User::query()
            ->where("id", $id)
            ->first();
    }

    public function getUserByEmail(string $email): User | null
    {
        return User::query()
            ->where("email", $email)
            ->first();
    }

    public function getUserByUsername(string $username): User | null
    {
        return User::query()
            ->where("username", $username)
            ->first();
    }

    private function userMetaCacheKey(string $id)
    {
        return "user_meta:$id";
    }
}
