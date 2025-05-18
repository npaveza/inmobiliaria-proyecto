<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Unidad;

class UnidadController extends Controller
{
    public function index()
    {
        return Unidad::with(['proyecto', 'cliente'])->paginate(10);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'numero_unidad' => 'required|string',
            'tipo_unidad' => 'required|string',
            'metraje' => 'required|numeric',
            'precio_venta' => 'required|numeric',
            'estado' => 'required|string',
            'proyecto_id' => 'required|uuid|exists:proyectos,id',
            'cliente_id' => 'nullable|uuid|exists:clientes,id'
        ]);

        $unidad = Unidad::create($data);
        return response()->json($unidad, 201);
    }

    public function show($id)
    {
        return Unidad::with(['proyecto', 'cliente'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $unidad = Unidad::findOrFail($id);

        $data = $request->validate([
            'numero_unidad' => 'string',
            'tipo_unidad' => 'string',
            'metraje' => 'numeric',
            'precio_venta' => 'numeric',
            'estado' => 'string',
            'proyecto_id' => 'uuid|exists:proyectos,id',
            'cliente_id' => 'nullable|uuid|exists:clientes,id'
        ]);

        $unidad->update($data);
        return response()->json($unidad);
    }

    public function destroy($id)
    {
        Unidad::destroy($id);
        return response()->json(null, 204);
    }
}
