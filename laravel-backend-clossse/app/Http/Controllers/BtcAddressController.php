<?php
    namespace App\Http\Controllers;

    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Http;

    class BtcAddressController extends Controller {
        public function generateBitcoinAddress() {
            // Sol·lícitud a la api per generar les addreses
            $response = Http::post('https://api.blockcypher.com/v1/btc/main/addrs');

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'private_key' => $data['private'],
                    'public_address' => $data['address'],
                ];
            }

            return response()->json([
                'error' => 'No se pudo generar la dirección de Bitcoin.',
            ], 500);
        }
    }