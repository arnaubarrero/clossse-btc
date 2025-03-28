<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\transferBtc;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\auth\LoginRegisterController;

Route::prefix('autentificacio')->group(function () {
    Route::post('login', [LoginRegisterController::class, 'login']);
    Route::post('register', [LoginRegisterController::class, 'registrar']);
    Route::middleware('auth:sanctum')->post('logout', [LoginRegisterController::class, 'logout']);
    Route::middleware('auth:sanctum')->post('change-password', [LoginRegisterController::class, 'changePassword']);
});


Route::middleware('auth:sanctum')->get('/search', function (Request $request) {
    $request->validate([
        'query' => 'required|string|min:1|max:255',
    ]);

    $query = $request->input('query');
    $user = $request->user();

    $results = DB::table('users')
        ->leftJoin('wallets', 'users.id', '=', 'wallets.user_id')
        ->where('username', 'like', "%{$query}%")
        ->orWhere('email', 'like', "%{$query}%")
        ->select('users.id', 'users.username', 'users.email', 'wallets.public_address')
        ->get();

    $results = $results->map(function ($userResult) use ($user) {
        $isFriend = DB::table('friendships')
            ->where(function ($query) use ($user, $userResult) {
                $query->where('user_id', $user->id)->where('friend_id', $userResult->id);
            })
            ->orWhere(function ($query) use ($user, $userResult) {
                $query->where('user_id', $userResult->id)->where('friend_id', $user->id);
            })
            ->exists();

        $userResult->is_friend = $isFriend;
        return $userResult;
    });

    return response()->json($results);
});


// ==== GET ====================

Route::get('/getUserInfoById/{id}', [transferBtc::class, 'getUserInfoById']);

Route::get('/generate-address', [transferBtc::class, 'generateBitcoinAddress']);

Route::middleware('auth:sanctum')->get('/search-users', [transferBtc::class, 'search']);

Route::middleware('auth:sanctum')->get('/friends', [FriendshipController::class, 'getFriends']);

Route::middleware('auth:sanctum')->get('/user/name', [LoginRegisterController::class, 'getName']);

Route::middleware('auth:sanctum')->get('/user-info', [LoginRegisterController::class, 'getUserInfo']);

Route::get('verify-email/{id}/{hash}', [LoginRegisterController::class, 'verifyEmail'])->name('verify.email');


// ==== POST ===================

Route::middleware('auth:sanctum')->post('/transfer', [transferBtc::class, 'transfer']);

Route::middleware('auth:sanctum')->post('/add-friend', [FriendshipController::class, 'addFriend']);

Route::middleware('auth:sanctum')->post('/update-username', [LoginRegisterController::class, 'updateUsername']);