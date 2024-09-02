<?php

namespace Database\Seeders;

use App\Models\Coluna;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ColunaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Coluna::factory(10)->create();
    }
}
