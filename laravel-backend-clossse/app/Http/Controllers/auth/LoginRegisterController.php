<?php

namespace App\Http\Controllers\auth;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\BtcAddressController;

class LoginRegisterController extends Controller
{
    public function registrar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $userExists = User::where('email', $request->email)->first();
        if ($userExists) {
            return response()->json([
                'success' => false,
                'message' => "L'usuari ja existeix"
            ], 409);
        }

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación',
                'errors' => $validator->errors()
            ], 422);
        }



        $cliente = User::create([
            'name' => $request->name,
            'apellidos' => $request->apellidos,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Generar URL de verificación
        $verificationUrl = route('verify.email', [
            'id' => $cliente->id,
            'hash' => sha1($cliente->email),
        ]);

        // Enviar email con la URL de verificación
        Mail::send('emails.verify', ['verificationUrl' => $verificationUrl], function ($message) use ($cliente) {
            $message->to($cliente->email)
                ->subject('Verificació d\'email');
        });

        return response()->json([
            'success' => true,
            'message' => 'Cliente creado exitosamente. Por favor, verifica tu correo electrónico.',
            'user' => $cliente
        ], 201);
    }

    public function verifyEmail($id, $hash)
    {
        $cliente = User::findOrFail($id);

        if (sha1($cliente->email) === $hash) {
            $cliente->markEmailAsVerified();

            // Crear wallet con nombre aleatorio
            $walletName = 'wallet_' . uniqid();
            
            // Verificar que la wallet no exista en el nodo
            $walletExists = $this->checkWalletExists($walletName);
            if ($walletExists) {
                return response()->json(['message' => 'Error: la wallet ya existe en el nodo.'], 400);
            }

            // Crear la wallet en el nodo Bitcoin Core
            $createWalletResponse = $this->createWallet($walletName);
            if (!$createWalletResponse['success']) {
                return response()->json(['message' => 'Error al crear la wallet en el nodo.'], 500);
            }

            // Generar una dirección pública
            $publicAddress = $this->generateBitcoinAddress($walletName);
            if (!$publicAddress) {
                return response()->json(['message' => 'Error al generar la dirección pública.'], 500);
            }

            // Obtener la clave privada de la dirección pública
            $privateKey = $this->getPrivateKey($walletName, $publicAddress);
            if (!$privateKey) {
                return response()->json(['message' => 'Error al obtener la clave privada.'], 500);
            }

            // Guardar la wallet en la base de datos
            Wallet::create([
                'user_id' => $cliente->id,
                'wallet' => $walletName,
                'public_address' => $publicAddress,
                'private_key' => $privateKey,
            ]);

            return response()->json(['message' => 'Correo verificado, wallet creada y dirección almacenada.'], 200);
        }

        return response()->json(['message' => 'El enlace de verificación es inválido o ha caducado.'], 400);
    }

    // Método para verificar si una wallet ya existe en el nodo
    private function checkWalletExists($walletName)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Basic YXJuaV9iYXNvOlN2ZTE1ZkBzdWRhLTE='
        ])->post('http://127.0.0.1:8332/', [
            'jsonrpc' => '1.0',
            'id' => 'curltest',
            'method' => 'listwallets',
            'params' => []
        ]);

        $wallets = $response->json()['result'] ?? [];
        return in_array($walletName, $wallets);
    }

    // Método para crear una wallet en el nodo
    private function createWallet($walletName)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Basic YXJuaV9iYXNvOlN2ZTE1ZkBzdWRhLTE='
        ])->post('http://127.0.0.1:8332/', [
            'jsonrpc' => '1.0',
            'id' => 'curltest',
            'method' => 'createwallet',
            'params' => [$walletName, false, false, "", false, false, false]
        ]);

        return ['success' => $response->successful()];
    }

    // Método para generar una dirección pública en la wallet
    private function generateBitcoinAddress($walletName)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Basic YXJuaV9iYXNvOlN2ZTE1ZkBzdWRhLTE='
        ])->post("http://127.0.0.1:8332/wallet/{$walletName}", [
            'jsonrpc' => '1.0',
            'id' => 'curltest',
            'method' => 'getnewaddress',
            'params' => ["", "legacy"]
        ]);

        return $response->json()['result'] ?? null;
    }

    // Método para obtener la clave privada de una dirección pública
    private function getPrivateKey($walletName, $publicAddress)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Basic YXJuaV9iYXNvOlN2ZTE1ZkBzdWRhLTE='
        ])->post("http://127.0.0.1:8332/wallet/{$walletName}", [
            'jsonrpc' => '1.0',
            'id' => 'curltest',
            'method' => 'dumpprivkey',
            'params' => [$publicAddress]
        ]);

        return $response->json()['result'] ?? null;
    }


    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 422);
        }

        $cliente = User::where('email', $request->email)->first();
        $comercio = User::where('id', $cliente->id)->first();

        if (!$cliente) {
            return response()->json([
                'error' => 'El client no existeix'
            ], 404);
        }

        if (!Hash::check($request->password, $cliente->password)) {
            return response()->json([
                'error' => 'Credencials incorrectes'
            ], 401);
        }

        if ($cliente->email_verified_at === null) {
            return response()->json([
                'error' => 'Verifica el teu email avans d\'iniciar sessió.'
            ], 400);
        }

        $token = $cliente->createToken('API Token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso.',
            'user' => $cliente,
            'token' => $token,
            'comercio' => $comercio,
        ], 200);
    }

    public function getName(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado',
            ], 401);
        }

        return response()->json([
            'name' => $user->name,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente',
        ], 200);
    }

    public function getUserInfo(Request $request) {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado',
            ], 401);
        }

        $publicAddress = $user->wallet ? $user->wallet->public_address : null;

        $balance = 0;
        if ($publicAddress) {
            $balanceResponse = Http::get("https://blockstream.info/api/address/{$publicAddress}");
            if ($balanceResponse->successful()) {
                $data = $balanceResponse->json();
                $balance = $data['chain_stats']['funded_txo_sum'] - $data['chain_stats']['spent_txo_sum'];
            }
        }

        $transactions = [];
        if ($publicAddress) {
            $transactionsResponse = Http::get("https://blockstream.info/api/address/{$publicAddress}/txs");
            if ($transactionsResponse->successful()) {
                $transactionsData = $transactionsResponse->json();
                $transactions = array_map(function ($tx) use ($publicAddress) {
                    $isSent = collect($tx['vin'])->contains(function ($input) use ($publicAddress) {
                        return isset($input['prevout']['scriptpubkey_address']) &&
                            $input['prevout']['scriptpubkey_address'] === $publicAddress;
                    });

                    $amount = collect($tx['vout'])->sum(function ($output) {
                        return $output['value'];
                    });

                    $amountBTC = $amount / 100000000;

                    $date = isset($tx['status']['block_time']) ?
                        date('Y-m-d H:i:s', $tx['status']['block_time']) :
                        'Pending';

                    return [
                        'type' => $isSent ? 'Sent' : 'Received',
                        'amount' => $amountBTC,
                        'date' => $date,
                    ];
                }, $transactionsData);
            }
        }

        $allFriends = $user->allFriends();
        $friends = $allFriends->map(function ($friend) {
            return [
                'id' => $friend->id,
                'name' => $friend->name,
                'apellidos' => $friend->apellidos,
                'username' => $friend->username,
                'email' => $friend->email,
                'public_address' => $friend->wallet ? $friend->wallet->public_address : null,
            ];
        });

        return response()->json([
            'user' => [
                'name' => $user->name,
                'apellidos' => $user->apellidos,
                'username' => $user->username,
                'email' => $user->email,
                'public_address' => $publicAddress,
                'balance' => $balance / 100000000, // Convertir a BTC
            ],
            'friends' => $friends,
            'transactions' => $transactions, // Historial de transacciones
        ], 200);
    }

    public function updateUsername(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|min:3|max:255|unique:users,username',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado',
            ], 401);
        }

        $user->username = $request->input('username');
        $user->save();

        return response()->json([
            'message' => 'Username updated successfully',
            'username' => $user->username,
        ], 200);
    }
}
