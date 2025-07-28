<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    /**
     * Health check endpoint
     */
    public function health(): JsonResponse
    {
        $health = [
            'status' => 'ok',
            'service' => 'laravel-app',
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0'
        ];

        // Testar conexão com banco
        try {
            DB::connection()->getPdo();
            $health['database'] = 'connected';
        } catch (\Exception $e) {
            $health['database'] = 'disconnected';
            $health['status'] = 'warning';
        }

        return response()->json($health);
    }

    /**
     * Test external microservice communication
     */
    public function external(): JsonResponse
    {
        try {
            $nodeServiceUrl = config('app.node_service_url', 'http://node-service:3001');
            
            $response = Http::timeout(10)
                ->retry(3, 1000)
                ->get($nodeServiceUrl . '/data');
            
            if ($response->successful()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Comunicação com microsserviço Node.js estabelecida',
                    'microservice_url' => $nodeServiceUrl,
                    'response_time' => $response->handlerStats()['total_time'] ?? null,
                    'data' => $response->json()
                ]);
            }
            
            return response()->json([
                'status' => 'error',
                'message' => 'Microsserviço Node.js retornou erro',
                'http_status' => $response->status(),
                'microservice_url' => $nodeServiceUrl
            ], 503);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Falha na comunicação com microsserviço Node.js',
                'error' => $e->getMessage(),
                'microservice_url' => config('app.node_service_url', 'http://node-service:3001')
            ], 500);
        }
    }
}