<?php
    namespace App\Http\Controllers;
    use App\Models\User;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Http;

    class transferBtc extends Controller {
        public function search(Request $request) {
            $request->validate([
                'query' => 'required|string|min:4',
            ]);

            $query = $request->input('query');

            $users = User::where('username', 'like', "%{$query}%")
                ->with('wallet')
                ->get(['id', 'name', 'apellidos', 'email', 'username']);

            $formattedUsers = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'apellidos' => $user->apellidos,
                    'email' => $user->email,
                    'username' => $user->username,
                    'public_address' => $user->wallet ? $user->wallet->public_address : null,
                ];
            });

            return response()->json($formattedUsers);
        }

        public function getUserInfoById($id) {
            $user = User::find($id);
    
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
    
            return response()->json([
                'username' => $user->username,
                'public_address' => $user->wallet ? $user->wallet->public_address : null,
            ]);
        }
    }