<?php
    namespace App\Http\Controllers\auth;

    use App\Models\User;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Mail;
    use Illuminate\Support\Facades\Hash;
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Validator;
    use App\Http\Controllers\BtcAddressController;

    class LoginRegisterController extends Controller {
        public function registrar(Request $request) {
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

        public function verifyEmail($id, $hash) {
            $cliente = User::findOrFail($id);
        
            if (sha1($cliente->email) === $hash) {
                $cliente->markEmailAsVerified();
        
                $btcAddressController = new BtcAddressController();
                $btcAddress = $btcAddressController->generateBitcoinAddress();
        
                $cliente->wallet()->create([
                    'public_address' => $btcAddress['public_address'],
                    'private_key' => $btcAddress['private_key'],
                ]);
        
                return response()->json(['message' => 'Correo verificado con éxito y dirección Bitcoin generada.'], 200);
            }
        
            return response()->json(['message' => 'El enlace de verificación es inválido o ha caducado.'], 400);
        }

        public function login(Request $request) {
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

        public function getName(Request $request) {
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

        public function logout(Request $request) {
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
            $allFriends = $user->allFriends();
        
            $friends = $allFriends->map(function ($friend) {
                return [
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
                ],
                'friends' => $friends,
            ], 200);
        }
    }