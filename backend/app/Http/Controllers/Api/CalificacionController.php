<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Calificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CalificacionController extends Controller
{
    /**
     * Listar todas las calificaciones
     */
    public function index()
    {
        $calificaciones = Calificacion::all();
        return response()->json($calificaciones, 200);
    }

    /**
     * Registrar una calificación
     */
    public function store(Request $request)
    {
        // Como aún no tienes campos, solo validamos timestamps opcionales
        $validator = Validator::make($request->all(), []);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $calificacion = Calificacion::create([]);

        return response()->json([
            'message' => 'Calificación registrada correctamente.',
            'calificacion' => $calificacion
        ], 201);
    }

    /**
     * Mostrar una calificación
     */
    public function show($id)
    {
        $calificacion = Calificacion::find($id);

        if (!$calificacion) {
            return response()->json(['error' => 'Calificación no encontrada'], 404);
        }

        return response()->json($calificacion, 200);
    }

    /**
     * Actualizar una calificación
     */
    public function update(Request $request, $id)
    {
        $calificacion = Calificacion::find($id);

        if (!$calificacion) {
            return response()->json(['error' => 'Calificación no encontrada'], 404);
        }

        $validator = Validator::make($request->all(), []);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $calificacion->update([]);

        return response()->json([
            'message' => 'Calificación actualizada correctamente.',
            'calificacion' => $calificacion
        ], 200);
    }

    /**
     * Eliminar calificación
     */
    public function destroy($id)
    {
        $calificacion = Calificacion::find($id);

        if (!$calificacion) {
            return response()->json(['error' => 'Calificación no encontrada'], 404);
        }

        $calificacion->delete();

        return response()->json([
            'message' => 'Calificación eliminada correctamente.'
        ], 200);
    }
}
