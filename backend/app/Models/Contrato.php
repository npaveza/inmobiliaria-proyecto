<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contrato extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'unidad_id',
        'fecha_inicio',
        'fecha_fin',
        'monto_total',
        'estado',        // activo, finalizado, cancelado
        'tipo_contrato', // arriendo / venta
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin'    => 'date',
    ];

    // Un contrato pertenece a un cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    // Un contrato pertenece a una unidad
    public function unidad()
    {
        return $this->belongsTo(Unidad::class);
    }

    // Un contrato tiene muchos pagos
    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }

    // Un contrato tiene una calificación (opcional)
    public function calificacion()
    {
        return $this->hasOne(Calificacion::class);
    }
}
