<?php

require_once(dirname(__FILE__).'/jwtoken.class.php');

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
    
if($ret === 1){

    bad_request();
    die();

} elseif($ret === 2) {

    set_error_response(401, "Token has expired.");
    exit();

}

// dummy data
$items = array();
for($i = 0; $i < 30; $i++) {
    $items[] = array("value" => $i);
}

set_response(array("status" => 200, "items" => $items));

?>