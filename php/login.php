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
$apikey = $headers["x-api-key"];

if(!isset($apikey))
{
    bad_request();
    die();
}

if(strcmp($apikey, API_KEY) !== 0)
{
    bad_request();
    die();
}

$str_json = file_get_contents('php://input');
$param = json_decode($str_json);

$login = isset($param->id) ? clean_input($param->id) : '';
$password = isset($param->pwd) ? clean_input($param->pwd) : '';

if(empty($login) || empty($password))
{
    bad_request();
    die();
}

if(strcmp($login, USER_LOGIN) !== 0)
{
    set_error_response(301, 'Account not found.');
    exit();
}

if(strcmp($password, USER_PASSWD) !== 0)
{
    set_error_response(302, 'Wrong password.');
    exit();
}

$user_id = random_bytes(9);
$user_id = bin2hex($user_id);

$jwt = new jwtoken(SECRET_KEY);
$jwtoken = $jwt->create(array(
    'sub' => $user_id,
), 1);

set_response(array("status" => 200, "token" => $jwtoken));

?>