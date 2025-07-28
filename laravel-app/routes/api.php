<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\HealthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check endpoints
Route::get('/health', [HealthController::class, 'health']);
Route::get('/external', [HealthController::class, 'external']);

// Users CRUD - Rotas específicas
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{user}', [UserController::class, 'show']);
Route::put('/users/{user}', [UserController::class, 'update']);
Route::delete('/users/{user}', [UserController::class, 'destroy']);

// Rota de boas-vindas da API
Route::get('/', function () {
    return response()->json([
        'message' => 'Laravel Microservices API',
        'version' => '1.0.0',
        'endpoints' => [
            'health' => '/api/health',
            'external' => '/api/external',
            'users' => '/api/users'
        ]
    ]);
});