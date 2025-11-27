<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ConsultaContratoController extends Controller
{
    /**
     * Buscar contrato por RUT real
     * GET /api/contratos/buscar-rut/{rut}
     */
    public function buscarPorRut($rut)
    {
        // Normalizar RUT
        $rut = strtoupper(str_replace('.', '', $rut));

        // 1) Buscar cliente por RUT (tabla clientes)
        $cliente = Cliente::where('rut', $rut)->first();

        if (!$cliente) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'No existe un cliente con este RUT.'
            ], 404);
        }

        // 2) Buscar contratos del cliente
        $contrato = $cliente->contratos()
            ->with(['unidad.proyecto'])
            ->first();

        if (!$contrato) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'El cliente existe, pero no tiene contratos asociados.'
            ], 404);
        }

        return response()->json([
            'status' => 'ok',
            'cliente' => [
                'id' => $cliente->id,
                'nombre' => $cliente->nombre ?? null,
                'rut' => $cliente->rut,
            ],
            'contrato' => [
                'id' => $contrato->id,
                'estado' => $contrato->estado,
                'tipo' => $contrato->tipo_contrato,
                'unidad' => $contrato->unidad->nombre ?? null,
                'proyecto' => $contrato->unidad->proyecto->nombre ?? null,
            ]
        ]);
    }
}
