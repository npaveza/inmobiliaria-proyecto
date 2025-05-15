<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
namespace App\Http\Controllers\Api;
use App\Models\Proyecto;

class ProyectoController extends Controller
{
    public function index()
    {
        return Proyecto::with('unidades')->paginate(10);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'ubicacion' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
            'estado' => 'required|string'
        ]);

        $proyecto = Proyecto::create($data);

        return response()->json($proyecto, 201);
    }

    public function show($id)
    {
        return Proyecto::with('unidades')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $proyecto = Proyecto::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'string',
            'descripcion' => 'string',
            'ubicacion' => 'string',
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date',
            'estado' => 'string'
        ]);

        $proyecto->update($data);

        return response()->json($proyecto);
    }

    public function destroy($id)
    {
        Proyecto::destroy($id);
        return response()->json(null, 204);
    }
}
