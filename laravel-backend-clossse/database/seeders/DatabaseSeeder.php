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
                    'username' => 'arni_baso', 
                    'password' => Hash::make('Arnau_2004')
                ],
            ];

            foreach ($users as $userData) {
                $user = User::create($userData);

                Wallet::create([
                    'user_id' => $user->id,
                    'public_address' => '1KXGrLaKRgaHgFmzJ9LvrSXduCWXr2Kqcg',
                    'private_key' => 'KyQcerULBQQCbVQHrrvFhAm49L9LSPKNFBForysMcAkdSiSC7fX4',
                    'wallet' => 'wallet_67d1d4c1f3a6d'
                ]);
            }
        }
    }