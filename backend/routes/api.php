<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ColunaController;
use App\Http\Controllers\TarefaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response('bem vindo');
})->middleware(['auth:sanctum']);


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::apiResource('tarefas', TarefaController::class);
    Route::apiResource('colunas', ColunaController::class);
});


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware(['auth:sanctum']);
