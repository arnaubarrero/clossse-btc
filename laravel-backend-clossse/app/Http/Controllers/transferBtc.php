<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class transferBtc extends Controller
{
    public function search(Request $request)
    {
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

    public function getUserInfoById($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json([
            'username' => $user->username,
            'public_address' => $user->wallet ? $user->wallet->public_address : null,
        ]);
    }

    public function transfer(Request $request)
    {
        // Obtener el usuario autenticado mediante el token de sesión
        $user = $request->user();

        // Obtener la wallet y la dirección pública del usuario desde la relación `wallet`
        $myWallet = $user->wallet->wallet; // Asumiendo que 'wallet' es el campo que almacena la wallet
        $myPublicAddress = $user->wallet->public_address;

        // Obtener los datos del request (dirección pública del destinatario y cantidad de BTC a enviar)
        $recipientPublicAddress = $request->input('recipient_public_address');
        $amountToSend = $request->input('amount');

        // Retornar toda la información
        return response()->json([
            'received_data' => $request->all(),
            'user_id' => $user->id,
            'my_wallet' => $myWallet,
            'my_public_address' => $myPublicAddress,
            'recipient_public_address' => $recipientPublicAddress,
            'amount_to_send' => $amountToSend,
        ]);
    }
}
