<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calificacions', function (Blueprint $table) {
            $table->id();
            $table->uuid('cliente_id');
            $table->uuid('unidad_id')->nullable();
            $table->uuid('proyecto_id')->nullable();
            $table->tinyInteger('puntaje'); // 1-5
            $table->text('comentario')->nullable();
            $table->timestamps();

            $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');
            $table->foreign('unidad_id')->references('id')->on('unidades')->nullOnDelete();
            $table->foreign('proyecto_id')->references('id')->on('proyectos')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calificacions');
    }
};
