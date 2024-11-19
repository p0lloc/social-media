<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('index');
});


Route::prefix("/auth")->group(function () {
    Route::post("/login", [UserController::class, 'login']);
    Route::post("/register", [UserController::class, 'register']);

    Route::middleware("auth:sanctum")->group(function () {

        Route::post("/logout", [UserController::class, 'logout']);
        Route::get("/user", [UserController::class, 'getUserDetails']);
        Route::post("/password", [UserController::class, 'setPassword']);
    });

    Route::post("/initReset", [UserController::class, 'initPasswordReset']);

    Route::get("/reset", [UserController::class, 'resetPasswordView'])->name('resetPasswordView');
    Route::post("/reset", [UserController::class, 'resetPassword']);

    Route::get("/confirm", [UserController::class, 'confirmEmail'])->name("confirmEmail");

    Route::get("/redirect/google", [GoogleAuthController::class, 'redirect']);
    Route::get("/callback/google", [GoogleAuthController::class, 'callback']);
});

Route::prefix("/api")->group(function () {
    Route::prefix("/posts")->group(function () {
        Route::get("/", [PostController::class, 'getPosts']);
        Route::post("/", [PostController::class, 'createPost'])->middleware("auth:sanctum");
        Route::put("/{id}", [PostController::class, 'updatePost']);
        Route::delete("/{id}", [PostController::class, 'deletePost']);

        Route::get("/{id}/comments", [CommentController::class, 'getPostComments']);
    });

    Route::prefix("/likes")->group(function () {
        Route::post("/", [LikeController::class, 'createLike']);
        Route::delete("/{id}", [LikeController::class, 'deleteLike']);
    });

    Route::prefix("/comments")->group(function () {
        Route::post("/", [CommentController::class, 'createComment']);
        Route::put("/{id}", [CommentController::class, 'updateComment']);
        Route::delete("/{id}", [CommentController::class, 'deleteComment']);
    });

    Route::prefix("/follows")->group(function () {
        Route::get("/", [FollowController::class, 'getFollows']);
        Route::post("/", [FollowController::class, 'createFollow']);
        Route::get("/following/{toUser}", [FollowController::class, 'getFollow']);
        Route::delete("/{id}", [FollowController::class, 'deleteFollow']);
    });

    Route::get("/user/{username}", [UserController::class, 'getUserByUsername']);

    Route::prefix("/user")->middleware("auth:sanctum")->group(function () {
        Route::post("/avatar", [UserController::class, 'setAvatar']);
        Route::post("/banner", [UserController::class, 'setBanner']);
        Route::post("/description", [UserController::class, 'setDescription']);
    });
});
