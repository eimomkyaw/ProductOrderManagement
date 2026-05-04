<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\Facades\Config;

class UnauthorizedException extends Exception
{
    protected $code = 401;

    protected $message = '';

    public function __construct($code = 401, $message = null)
    {
        $this->message = ! empty($message) ? $message : Config::get('constants.ERROR_MSG_UNAUTHORIZED');
        $this->code = $code;
    }

    public function render($request)
    {
        return response()->json([
            'message' => $this->message,
        ], $this->code);
    }
}
