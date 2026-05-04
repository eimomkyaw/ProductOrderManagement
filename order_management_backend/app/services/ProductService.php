<?php

namespace App\Services;

use App\Models\Products;

class ProductService
{
    public function getAllProducts($request)
    {
        $limit = $request->query('limit', 15);

        $products = Products::orderBy('id', 'asc')->paginate($limit);

        return $products;

    }
}
