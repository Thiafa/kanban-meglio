<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tarefa extends Model
{
    use HasFactory;

    protected $fillable = ['titulo', 'descricao', 'user_id', 'status'];

    public function coluna(): BelongsTo
    {
        return $this->belongsTo(Coluna::class);
    }

    public function scopeSearch(Builder $query, $request): Builder
    {
        return $query->when($request->titulo, function (Builder $query, string $titulo) {
            return $query->where('titulo', 'like', '%' . $titulo . '%');
        })->$query->when($request->descricao, function (Builder $query, string $descricao) {
            return $query->where('descricao', 'like', '%' . $descricao . '%');
        })->$query->when($request->user_id, function (Builder $query, string $user_id) {
            return $query->where('user_id', $user_id);
        })->$query->when($request->status, function (Builder $query, string $status) {
            return $query->whereRelation('status', $status);
        });
    }
}
