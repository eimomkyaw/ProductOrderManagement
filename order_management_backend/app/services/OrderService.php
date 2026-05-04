<?php

namespace App\Services;

use App\Models\Orders;
use App\Models\Products;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrder($data, $user)
    {
        DB::beginTransaction();

        $totalPrice = 0;
        $items = $data['items'];

        foreach ($items as $item) {
            $product = Products::find($item['product_id']);

            if ($product->stock < $item['quantity']) {
                return response()->json(['message' => "Product {$product->name} is not enough stock"], 400);
            }

            $totalPrice += $product->price * $item['quantity'];
        }

        $order = Orders::create([
            'user_id' => $user->id,
            'total_price' => $totalPrice,
        ]);

        foreach ($items as $item) {
            $product = Products::find($item['product_id']);

            $order->items()->attach($product->id, [
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);

            $product->decrement('stock', $item['quantity']);
        }

        DB::commit();

        return $order->load('items');

    }
}
