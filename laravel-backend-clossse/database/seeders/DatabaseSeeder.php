<?php
    namespace Database\Seeders;

    use App\Models\User;
    use App\Models\Wallet;
    use Illuminate\Database\Seeder;
    use Illuminate\Support\Facades\Hash;

    class DatabaseSeeder extends Seeder {
        public function run(): void {
            $users = [
                [
                    'name' => 'Arnau', 
                    'apellidos' => 'Barrero', 
                    'email' => 'arnau.baso@gmail.com', 
                    'email_verified_at' => now(),
                    'username' => 'arni_baso', 
                    'password' => Hash::make('Arnau_2004')
                ],
                [
                    'name' => 'Ledger', 
                    'apellidos' => 'Top', 
                    'email' => 'ledger@gmail.com', 
                    'email_verified_at' => now(),
                    'username' => 'ledger_top', 
                    'password' => Hash::make('Arnau_2004')
                ],
            ];

            foreach ($users as $userData) {
                $user = User::create($userData);

                Wallet::create([
                    'user_id' => $user->id,
                    'public_address' => '18odWv8uQfPzKzjdCJZoGM4pDi7sp2quUH',
                    'private_key' => 'KxmHq8CJP34RRtkQRm7kAz7MM47MK7moxokcKK8jtP8v8e3MaJGY',
                    'wallet' => 'wallet_67d34af552edc'
                ]);
            }
        }
    }