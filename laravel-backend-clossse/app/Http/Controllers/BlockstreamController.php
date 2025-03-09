<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class BlockstreamController extends Controller {
    // URL base de la API de Blockstream Esplora
    private $baseUrl = 'https://blockstream.info/api';

    /**
     * Consultar el saldo de una dirección Bitcoin.
     *
     * @param string $address
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBalance($address)
    {
        $response = Http::get("{$this->baseUrl}/address/{$address}");

        if ($response->successful()) {
            $data = $response->json();
            $balance = $data['chain_stats']['funded_txo_sum'] - $data['chain_stats']['spent_txo_sum'];
            return response()->json(['balance' => $balance]);
        }

        return response()->json(['error' => 'No se pudo obtener el saldo.'], 500);
    }

    /**
     * Transmitir una transacción a la red Bitcoin.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function broadcastTransaction(Request $request) {
        $request->validate([
            'txHex' => 'required|string',
        ]);

        $response = Http::post("{$this->baseUrl}/tx", $request->txHex);

        if ($response->successful()) {
            return response()->json(['txid' => $response->body()]);
        }

        return response()->json(['error' => 'No se pudo transmitir la transacción.'], 500);
    }
}
