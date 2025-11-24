<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calificacion extends Model
{
    use HasFactory;

    protected $fillable = [
        'contrato_id',
        'puntaje',
        'comentario'
    ];

    public function contrato()
    {
        return $this->belongsTo(Contrato::class);
    }
}
