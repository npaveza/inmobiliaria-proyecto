<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $fillable = [
        'contrato_id',
        'monto',
        'fecha_pago',
        'metodo_pago',
        'estado'
    ];

    protected $casts = [
        'fecha_pago' => 'datetime',
    ];

    public function contrato()
    {
        return $this->belongsTo(Contrato::class);
    }
}
