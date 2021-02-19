<?php

/**
 * Handles refresh token request
 */
require(dirname(__FILE__).'/config.php');
require(dirname(__FILE__).'/jwtoken.class.php');

define(API_KEY, 'MY-API-KEY');
define(SECRET_KEY, 'MY-SECRET-KEY');
define(USER_LOGIN, 'MY-LOGIN');
define(USER_PASSWD, 'MY-PASSWD');

function bad_request() 
{
    header('HTTP/1.1 400 Bad Request');
    echo 'HTTP/1.1 400 Bad Request';
}

function clean_input($data) 
{
    $data= trim($data);
    $data= stripslashes($data);
    $data= htmlspecialchars($data);
    return $data;
}

function set_error_response($status, $message) 
{
    header('Content-Type: application/json;charset=utf-8');
    echo json_encode(array('status' => $status, 'message' => $message));
}

function set_response($data) 
{
    header('Content-Type: application/json;charset=utf-8');
    echo json_encode($data);
}

$headers = apache_request_headers();
$jwtoken = $headers["authorization"];

if(!isset($jwtoken)) 
{
    bad_request();
    die();
} 

$token = explode(" ", $jwtoken);
$jwtoken = count($token) > 1 ? $token[1] : '';
    
if(strlen($jwtoken) === 0) 
{
    bad_request();
    die();
}

$jwt = new jwtoken(SECRET_KEY);
$ret = $jwt->verify($jwtoken);
    
if($ret === 1){ // invalid token

    bad_request();
    die();

} elseif($ret === 2) { // expired token

    // generate new token
    $user_id = random_bytes(9);
    $user_id = bin2hex($user_id);

    $jwtoken = $jwt->create(array(
        'sub' => $user_id,
    ), 1);

    set_response(array("status" => 200, "token" => $jwtoken));

} else { // token still valid, send back same token

    set_response(array("status" => 200, "token" => $jwtoken));

}

?>