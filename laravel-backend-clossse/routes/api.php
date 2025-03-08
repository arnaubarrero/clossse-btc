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

    Route::get('/search', function (Request $request) {
        $request->validate([
            'query' => 'required|string|min:1|max:255',
        ]);

        $query = $request->input('query');

        $results = DB::table('users')
            ->where('username', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->get();

        return response()->json($results);
    });

    Route::middleware('auth:sanctum')->post('/add-friend', [FriendshipController::class, 'addFriend']);