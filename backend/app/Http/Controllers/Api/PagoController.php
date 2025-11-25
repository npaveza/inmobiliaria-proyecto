<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pago;
use App\Models\Contrato;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PagoController extends Controller
{
    /**
     * Listar todos los pagos
     */
    public function index()
    {
        $pagos = Pago::with('contrato')->get();
        return response()->json($pagos, 200);
    }

    /**
     * Registrar un nuevo pago
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contrato_id' => 'required|exists:contratos,id',
            'monto' => 'required|integer|min:0',
            'metodo_pago' => 'required|string|in:efectivo,transferencia,tarjeta',
            'estado' => 'sometimes|string|in:pendiente,completado,fallido',
            'fecha_pago' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $pago = Pago::create($validator->validated());


        return response()->json([
            'message' => 'Pago registrado correctamente.',
            'pago' => $pago
        ], 201);
    }

    /**
     * Mostrar un pago en detalle
     */
    public function show($id)
    {
        $pago = Pago::with('contrato')->find($id);

        if (!$pago) {
            return response()->json(['error' => 'Pago no encontrado'], 404);
        }

        return response()->json($pago, 200);
    }

    /**
     * Actualizar un pago
     */
    public function update(Request $request, $id)
    {
        $pago = Pago::find($id);

        if (!$pago) {
            return response()->json(['error' => 'Pago no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'monto' => 'sometimes|integer|min:0',
            'metodo_pago' => 'sometimes|string|in:efectivo,transferencia,tarjeta',
            'estado' => 'sometimes|string|in:pendiente,completado,fallido',
            'fecha_pago' => 'sometimes|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // ✔ cambio importante aquí
        $pago->update($validator->validated());

        return response()->json([
            'message' => 'Pago actualizado correctamente.',
            'pago' => $pago->fresh()->load('contrato')
        ], 200);
    }


    /**
     * Eliminar un pago
     */
    public function destroy($id)
    {
        $pago = Pago::find($id);

        if (!$pago) {
            return response()->json(['error' => 'Pago no encontrado'], 404);
        }

        $pago->delete();

        return response()->json([
            'message' => 'Pago eliminado correctamente.'
        ], 200);
    }

    
}
