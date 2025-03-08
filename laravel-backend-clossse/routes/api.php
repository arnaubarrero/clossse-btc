<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BtcAddressController;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\auth\LoginRegisterController;

Route::prefix('autentificacio')->group(function () {
    Route::post('login', [LoginRegisterController::class, 'login']);
    Route::post('register', [LoginRegisterController::class, 'registrar']);
    Route::middleware('auth:sanctum')->post('logout', [LoginRegisterController::class, 'logout']);
    Route::middleware('auth:sanctum')->post('change-password', [LoginRegisterController::class, 'changePassword']);
});

Route::get('verify-email/{id}/{hash}', [LoginRegisterController::class, 'verifyEmail'])->name('verify.email');

Route::middleware('auth:sanctum')->get('/user/name', [LoginRegisterController::class, 'getName']);

Route::get('/generate-address', [BtcAddressController::class, 'generateBitcoinAddress']);

Route::middleware('auth:sanctum')->get('/user-info', [LoginRegisterController::class, 'getUserInfo']);

Route::middleware('auth:sanctum')->get('/search', function (Request $request) {
    $request->validate([
        'query' => 'required|string|min:1|max:255',
    ]);

    $query = $request->input('query');
    $user = $request->user(); // Obtén el usuario autenticado

    // Busca usuarios que coincidan con la consulta
    $results = DB::table('users')
        ->where('username', 'like', "%{$query}%")
        ->orWhere('email', 'like', "%{$query}%")
        ->select('id', 'username', 'email')
        ->get();

    // Verifica si cada usuario en los resultados es amigo del usuario autenticado
    $results = $results->map(function ($userResult) use ($user) {
        $isFriend = DB::table('friendships')
            ->where(function ($query) use ($user, $userResult) {
                $query->where('user_id', $user->id)
                    ->where('friend_id', $userResult->id);
            })
            ->orWhere(function ($query) use ($user, $userResult) {
                $query->where('user_id', $userResult->id)
                    ->where('friend_id', $user->id);
            })
            ->exists();

        // Agrega el campo `is_friend` al resultado
        $userResult->is_friend = $isFriend;
        return $userResult;
    });

    return response()->json($results);
});

Route::middleware('auth:sanctum')->post('/add-friend', [FriendshipController::class, 'addFriend']);
