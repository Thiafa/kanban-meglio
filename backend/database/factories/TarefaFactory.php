<?php

namespace Database\Factories;

use App\Models\Coluna;
use App\Models\User;
use App\StatusEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tarefa>
 */
class TarefaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $usersCount = User::all()->count();
        $colunasCount = Coluna::all()->count();
        return [
            'titulo' => fake()->word(),
            'descricao' => fake()->text(),
            'user_id' => rand(1, $usersCount),
            'coluna_id' => rand(1, $colunasCount),
        ];
    }
}
