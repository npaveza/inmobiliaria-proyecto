<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProyectoController;
use App\Http\Controllers\Api\UnidadController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContratoController;
use App\Http\Controllers\Api\PagoController;
use App\Http\Controllers\Api\CalificacionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas con JWT
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('proyectos', ProyectoController::class);
    Route::apiResource('unidades', UnidadController::class);
    Route::apiResource('clientes', ClienteController::class);
    Route::apiResource('contratos', ContratoController::class);
    Route::get('/contratos', [ContratoController::class, 'index']);
    Route::get('/contratos/{id}', [ContratoController::class, 'show']);
    Route::put('/contratos/{id}', [ContratoController::class, 'update']);
    Route::apiResource('pagos', PagoController::class);
    Route::apiResource('calificaciones', CalificacionController::class);
    //Route::get('/clientes/buscar-por-rut/{rut}', 'ClienteController@buscarPorRut');
    Route::get('/clientes/buscar-por-rut/{rut}', [ClienteController::class, 'buscarPorRut']);

});
