<?php
    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\auth\LoginRegisterController;

    Route::prefix('autentificacio')->group(function () {
        Route::post('login', [LoginRegisterController::class, 'login']);
        Route::post('register', [LoginRegisterController::class, 'registrar']);
        Route::middleware('auth:sanctum')->post('logout', [LoginRegisterController::class, 'logout']);
        Route::middleware('auth:sanctum')->post('change-password', [LoginRegisterController::class, 'changePassword']);
    });

    Route::get('verify-email/{id}/{hash}', [LoginRegisterController::class, 'verifyEmail'])->name('verify.email');

    Route::middleware('auth:sanctum')->get('/user/name', [LoginRegisterController::class, 'getName']);