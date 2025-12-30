<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Companies with logos
        $syacsa = \App\Models\Company::create([
            'name' => 'Syacsa',
            'signature_html' => null, // We'll use the hardcoded components for now as backup
            'logo' => '/storage/companies/syacsa-logo.png',
        ]);

        $absolute = \App\Models\Company::create([
            'name' => 'Absolute Group',
            'signature_html' => null,
            'logo' => '/storage/companies/absolute-logo.png',
        ]);

        // Admin User
        \App\Models\User::create([
            'name' => 'Admin LunAvalos',
            'username' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
            'company_id' => null,
        ]);
    }
}
