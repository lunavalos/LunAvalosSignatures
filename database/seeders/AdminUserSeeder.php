<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::updateOrCreate(
            ['username' => 'admin'], // Clave única para buscar
            [
                'name' => 'Admin LunAvalos',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'company_id' => null,
            ]
        );
    }
}
