<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

    public function transfer(Request $request) {
        $user = $request->user();
    
        $myWallet = $user->wallet->wallet;
        $myPublicAddress = $user->wallet->public_address;
        $recipientPublicAddress = $request->input('public_address');
        $amountToSend = (float) $request->input('amount');
    
        if (empty($recipientPublicAddress)) {
            return response()->json(['error' => 'Recipient public address is required'], 400);
        }
    
        if (!preg_match('/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-zA-HJ-NP-Z0-9]{25,90}$/', $recipientPublicAddress)) {
            return response()->json(['error' => 'Invalid recipient public address'], 400);
        }
    
        if ($recipientPublicAddress === $myPublicAddress) {
            return response()->json(['error' => 'No puedes enviar BTC a tu propia dirección'], 400);
        }
    
        $url = "http://127.0.0.1:8332/wallet/{$myWallet}";
        $authHeader = ['Authorization' => 'Basic YXJuaV9iYXNvOlN2ZTE1ZkBzdWRhLTE=', 'Content-Type' => 'application/json'];
    
        // Obtener tarifas dinámicas desde mempool.space
        $feeRateResponse = Http::get('https://mempool.space/api/v1/fees/recommended');
    
        if (!$feeRateResponse->successful()) {
            return response()->json(['error' => 'Failed to fetch fee rates'], 500);
        }
    
        $feeRateData = $feeRateResponse->json();
    
        // Use 'minimumFee' from the API response
        $feeRate = isset($feeRateData['minimumFee']) ? $feeRateData['minimumFee'] / 100000000 : 0.00002; // 20 satoshis por byte como fallback
    
        // Listar UTXOs disponibles
        $response = Http::withHeaders($authHeader)->post($url, [
            'jsonrpc' => '1.0',
            'id' => 'curltest',
            'method' => 'listunspent',
            'params' => [0, 9999999, [$myPublicAddress]],
        ]);
    
        if (!$response->successful()) {
            return response()->json(['error' => 'Failed to fetch unspent transactions'], 500);
        }
    
        $utxos = $response->json()['result'];
        if (empty($utxos)) {
            return response()->json(['error' => 'No hay transacciones no gastadas disponibles'], 400);
        }
    
        // Crear transacción en bruto
        $inputs = array_map(fn($utxo) => ['txid' => $utxo['txid'], 'vout' => $utxo['vout']], $utxos);
        $outputs = [$recipientPublicAddress => $amountToSend];
    
        $rawTransactionResponse = Http::withHeaders($authHeader)->post($url, [
            'jsonrpc' => '1.0',
            'id' => 'curltest',
            'method' => 'createrawtransaction',
            'params' => [$inputs, $outputs],
        ]);
    
        $rawTransaction = $rawTransactionResponse->json()['result'];
    
        // Calcular tarifas usando fundrawtransaction
        $fundResponse = Http::withHeaders($authHeader)->post($url, [
            'jsonrpc' => '1.0',
            'id' => 'curltest',
            'method' => 'fundrawtransaction',
            'params' => [
                $rawTransaction,
                [
                    'feeRate' => $feeRate,
                    'changeAddress' => $myPublicAddress
                ]
            ],
        ]);
    
        $fundedTransaction = $fundResponse->json()['result']['hex'];
    
        // Firmar la transacción
        $signResponse = Http::withHeaders($authHeader)->post($url, [
            'jsonrpc' => '1.0',
            'id' => 'curltest',
            'method' => 'signrawtransactionwithwallet',
            'params' => [$fundedTransaction],
        ]);
    
        $signedTransaction = $signResponse->json()['result']['hex'];
    
        // Enviar la transacción
        $sendResponse = Http::withHeaders($authHeader)->post($url, [
            'jsonrpc' => '1.0',
            'id' => 'curltest',
            'method' => 'sendrawtransaction',
            'params' => [$signedTransaction],
        ]);
    
        if ($sendResponse->successful()) {
            $txid = $sendResponse->json()['result'];
            return response()->json(['message' => 'Transferencia realizada con éxito', 'txid' => $txid]);
        }
    
        return response()->json(['error' => 'Failed to send raw transaction'], 500);
    }
    
}
