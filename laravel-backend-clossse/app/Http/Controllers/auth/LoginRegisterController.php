<?php

namespace App\Http\Controllers\auth;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

            $walletName = 'wallet_' . uniqid();

            $walletExists = $this->checkWalletExists($walletName);
            if ($walletExists) {
                return response()->json(['message' => 'Error: la wallet ya existe en el nodo.'], 400);
            }

            $createWalletResponse = $this->createWallet($walletName);
            if (!$createWalletResponse['success']) {
                return response()->json(['message' => 'Error al crear la wallet en el nodo.'], 500);
            }

            $publicAddress = $this->generateBitcoinAddress($walletName);
            if (!$publicAddress) {
                return response()->json(['message' => 'Error al generar la dirección pública.'], 500);
            }

            $privateKey = $this->getPrivateKey($walletName, $publicAddress);
            if (!$privateKey) {
                return response()->json(['message' => 'Error al obtener la clave privada.'], 500);
            }

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
        try {
            $user = $request->user();

            if (!$user) {
                // Log::error('Usuario no autenticado');
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            $wallet = $user->wallet;

            if (!$wallet) {
                // Log::error('Wallet no encontrada para el usuario: ' . $user->id);
                return response()->json(['error' => 'Wallet no encontrada'], 404);
            }

            // Log::info('Wallet encontrada: ' . $wallet->wallet);

            $bitcoinCoreUrl = 'http://127.0.0.1:8332';
            $credentials = 'YXJuaV9iYXNvOlN2ZTE1ZkBzdWRhLTE=';

            $makeRequest = function ($url, $payload) use ($credentials) {
                return Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Basic ' . $credentials,
                ])->post($url, $payload);
            };

            // Verificar si la billetera ya está cargada
            $listWalletsPayload = [
                "jsonrpc" => "1.0",
                "id" => "curltest",
                "method" => "listwallets",
                "params" => []
            ];

            // Log::info('Verificando billeteras cargadas');
            $listWalletsResponse = $makeRequest($bitcoinCoreUrl, $listWalletsPayload);

            if ($listWalletsResponse->failed() || isset($listWalletsResponse->json()['error'])) {
                $errorMessage = $listWalletsResponse->json()['error']['message'] ?? 'Error desconocido';
                // Log::error('Error al listar billeteras: ' . $errorMessage);
                return response()->json(['error' => 'Error al listar billeteras: ' . $errorMessage], 500);
            }

            $loadedWallets = $listWalletsResponse->json()['result'] ?? [];
            // Log::info('Billeteras cargadas: ' . json_encode($loadedWallets));

            // Cargar la billetera solo si no está cargada
            if (!in_array($wallet->wallet, $loadedWallets)) {
                // Log::info('Cargando billetera: ' . $wallet->wallet);

                $loadWalletPayload = [
                    "jsonrpc" => "1.0",
                    "id" => "curltest",
                    "method" => "loadwallet",
                    "params" => [$wallet->wallet] // Nombre de la billetera
                ];

                $loadWalletResponse = $makeRequest($bitcoinCoreUrl, $loadWalletPayload);

                if ($loadWalletResponse->failed() || isset($loadWalletResponse->json()['error'])) {
                    $errorMessage = $loadWalletResponse->json()['error']['message'] ?? 'Error desconocido';
                    Log::error('Error al cargar la billetera: ' . $errorMessage);
                    return response()->json(['error' => 'Error al cargar la billetera: ' . $errorMessage], 500);
                }

                Log::info('Billetera cargada correctamente');
            } else {
                Log::info('La billetera ya está cargada: ' . $wallet->wallet);
            }

            // Proceder con la solicitud de transacciones
            $listTransactionsPayload = [
                "jsonrpc" => "1.0",
                "id" => "curltest",
                "method" => "listtransactions",
                "params" => ["*", 99999999, 0, true]
            ];

            // Log::info('Solicitando transacciones para la billetera: ' . $wallet->wallet);
            $response = $makeRequest($bitcoinCoreUrl . '/wallet/' . $wallet->wallet, $listTransactionsPayload);

            if ($response->failed() || isset($response->json()['error'])) {
                $errorMessage = $response->json()['error']['message'] ?? 'Error desconocido';
                // Log::error('Error al obtener transacciones: ' . $errorMessage);
                return response()->json(['error' => 'Error al obtener transacciones: ' . $errorMessage], 500);
            }

            $data = $response->json();

            if (!isset($data['result'])) {
                // Log::error('No se encontraron transacciones en la respuesta');
                return response()->json(['error' => 'No se encontraron transacciones'], 404);
            }

            // Log::info('Transacciones obtenidas correctamente');

            $receivedTransactions = [];
            $sentTransactions = [];
            $pendingTransactions = [];
            $balance = 0;

            foreach ($data['result'] as $transaction) {
                if (!isset($transaction['category'])) {
                    // Log::warning('Transacción sin categoría: ' . json_encode($transaction));
                    continue; // Saltar transacciones sin categoría
                }

                if ($transaction['category'] === 'receive') {
                    if (!isset($transaction['confirmations'])) {
                        // Log::warning('Transacción recibida sin confirmaciones: ' . json_encode($transaction));
                        continue; // Saltar transacciones sin confirmaciones
                    }

                    if ($transaction['confirmations'] === 0) {
                        $pendingTransactions[] = $transaction;
                    } else {
                        $receivedTransactions[] = $transaction;
                        if (isset($transaction['amount'])) {
                            $balance += $transaction['amount'];
                        }
                    }
                } elseif ($transaction['category'] === 'send') {
                    $sentTransactions[] = $transaction;
                    if (isset($transaction['fee'])) {
                        $balance += $transaction['fee'];
                    }
                }
            }

            // Log::info('Procesamiento de transacciones completado');

            return response()->json([
                'balance' => $balance,
                'receivedTransactions' => $receivedTransactions,
                'sentTransactions' => $sentTransactions,
                'pendingTransactions' => $pendingTransactions,
            ]);
        } catch (\Exception $e) {
            // Log::error('Error interno del servidor: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno del servidor: ' . $e->getMessage()], 500);
        }
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
