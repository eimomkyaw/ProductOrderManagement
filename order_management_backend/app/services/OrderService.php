<?php

namespace App\Services;

use App\Models\Orders;
use App\Models\Products;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrder($data, $user)
    {
        return DB::transaction(function () use ($data, $user) {
            $totalPrice = 0;
            $items = $data['items'];

            foreach ($items as $item) {
                $product = Products::find($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    throw new \InvalidArgumentException("Only {$product->stock} item(s) of {$product->name} are available.");
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

            return $order->load('items');
        });
    }
}
