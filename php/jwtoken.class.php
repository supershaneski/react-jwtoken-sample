<?php

class jwtoken {
    
    protected $secret;

    public function __construct($secret)
    {
        $this->secret = $secret;
    }

    public function create($raw_payload, $expire = null)
    {
        $header = json_encode(array(
            'alg' => 'HS256',
            'typ' => 'JWT'
        ));
        
        if(isset($expire)) {

            $hours = (int)$expire;
            $right_now = new DateTime();
            $right_now->add(new DateInterval("PT{$hours}H"));
            $expiry = $right_now->format(DateTime::ATOM);
            $int_expiry = strtotime($expiry);

            $payload_merge = array_merge($raw_payload, array('exp' => $int_expiry));
            $payload = json_encode($payload_merge);

        } else {

            $payload = json_encode($raw_payload);
        }
        
        $b64_header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $b64_payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $signature = hash_hmac('sha256', $b64_header . "." . $b64_payload, $this->secret, true);
        $b64_signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $b64_header . '.' . $b64_payload . '.' . $b64_signature;
    }

    public function verify($token)
    {
        $token_items = explode(".", $token);

        $header = count($token_items) > 0 ? $token_items[0] : '';
        $payload = count($token_items) > 1 ? $token_items[1] : '';
        $signature = count($token_items) > 2 ? $token_items[2] : '';
        
        if(strlen($header) === 0 || strlen($payload) === 0 || strlen($signature) === 0)
        {
            return 1;
        }

        $_signature = hash_hmac('sha256', $header . "." . $payload, $this->secret, true);
        $verify_signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($_signature));

        $ret = strcmp($verify_signature, $signature) === 0 ? 1 : 0;
        if($ret === 0) {
            return 1;
        }

        $_payload = $this->base64_decode($payload);
        $payload = json_decode($_payload);

        $expiry = isset($payload->exp) ? (int)$payload->exp : '';

        if(strlen($expiry) === 0) 
        {
            return 0;
        }

        $str_expiry = date(DATE_ISO8601, $expiry);
        if(new DateTime() > new DateTime($str_expiry))
        {
            return 2;
        }

        return 0;

    }

    protected function base64_decode($data)
    {
        $decode = strtr($data, '-_', '+/');
        return base64_decode($decode, true);
    }

    public function get_payload($token)
    {
        $token_items = explode(".", $token);
        $payload = count($token_items) > 1 ? $token_items[1] : '';

        if(strlen($payload) === 0)
        {
            return '';
        }

        return $this->base64_decode($payload);
    }

}

?>