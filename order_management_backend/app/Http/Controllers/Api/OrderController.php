<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Models\Orders;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request)
    {
        try {
            $orders = Orders::where('user_id', $request->user()->id)
                ->with(['items'])
                ->orderBy('id', 'desc')
                ->get();

            return response()->json([
                'data' => $orders,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unable to retrieve order history.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(OrderRequest $request)
    {
        try {
            $order = $this->orderService->createOrder(
                $request,
                $request->user()
            );

            return response()->json([
                'success' => true,
                'order' => $order,
            ], 201);

        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while placing the order.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
