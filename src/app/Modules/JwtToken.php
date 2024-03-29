<?php

namespace App\Modules;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;
use Nowakowskir\JWT\JWT;
use Nowakowskir\JWT\TokenDecoded;
use Nowakowskir\JWT\TokenEncoded;

class JwtToken
{
    /**
     * @param string $email
     * @param string $password
     * @param int    $time
     *
     * @throws Exception
     *
     * @return \Nowakowskir\JWT\TokenEncoded
     */
    public static function getAccessToken(string $email, string $password, int $time): \Nowakowskir\JWT\TokenEncoded
    {
        if (!$user = User::where('email', '=', $email)->first()) {
            throw new Exception('Wrong user');
        }

        if (!Hash::check($password, $user->password)) {
            throw new Exception('Wrong password');
        }

        $exp = time() + 60 * $time;

        $payLoad = [
            'name'  => $user->name,
            'id'    => $user->user_id,
            'avatar'=> $user->avatar,
            'admin' => $user->admin,
            'exp'   => $exp,
        ];

        $header = [
            'alg' => 'HS512',
            'type'=> 'access',
        ];

        $privateKey = config('jwt.privateKey');
        $tokenDecoded = new TokenDecoded($payLoad, $header);

        return $tokenDecoded->encode($privateKey, JWT::ALGORITHM_HS512);
    }

    /**
     * @param $accessToken
     * @param $time
     *
     * @throws Exception
     *
     * @return array|TokenEncoded
     */
    public static function getRefreshToken(string $accessToken, int $time): \Nowakowskir\JWT\TokenEncoded
    {
        $privateKey = config('jwt.privateKey');

        $tokenEncoded = new TokenEncoded($accessToken);
        $accessToken = $tokenEncoded->decode($privateKey, JWT::ALGORITHM_HS512);

        if ($accessToken->getHeader()['type'] != 'access') {
            throw new Exception('type != access');
        }

        $tokenEncoded->validate($privateKey, JWT::ALGORITHM_HS512);
        $payload = $accessToken->getPayload();

        $exp = time() + 60 * $time;

        $payLoad = [
            'name'  => $payload['name'],
            'id'    => $payload['id'],
            'avatar'=> $payload['avatar'],
            'exp'   => $exp,
        ];

        $header = [
            'alg' => 'HS512',
            'type'=> 'refresh',
        ];

        $tokenDecoded = new TokenDecoded($payLoad, $header);

        return $tokenDecoded->encode($privateKey, JWT::ALGORITHM_HS512);
    }

    public static function validateToken($token)
    {
        $privateKey = config('jwt.privateKey');
        $tokenEncoded = new TokenEncoded($token);

        try {
            if ($tokenEncoded->validate($privateKey, JWT::ALGORITHM_HS512)) {
                return true;
            }

            return false;
        } catch (Exception $ex) {
            return false;
        }
    }
}
