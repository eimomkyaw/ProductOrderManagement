<?php

use App\Http\Controllers\Api\Auth\AuthController; 
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AuthUser;

Route::group(['prefix' => 'auth'], function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::group(['middleware' => [AuthUser::class]], function () {
        Route::delete('/logout', [AuthController::class, 'logout']);
        Route::apiResource('orders', OrderController::class)->only(['index', 'store']);
    });
});

Route::get('/products', [ProductController::class, 'index']);
