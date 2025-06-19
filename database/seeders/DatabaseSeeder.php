<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Shashwat Pandey',
            'email' => 'shashwatpandey100@gmail.com',
            'password' => Hash::make('Password@100'),
            'email_verified_at' => now(),
        ]);
    }
}
