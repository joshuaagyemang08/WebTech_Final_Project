<?php
include_once('../settings/db_config.php');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$user_id = $_POST['id'];
$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];
$ashesi_id = $_POST['ashesi_id'];
$phone_number = $_POST['phone_number'];
$user_type = $_POST['user_type'];
$role = $_POST['role'];

if (!empty($password)) {
    $password = password_hash($password, PASSWORD_BCRYPT);
    $sql = "UPDATE users SET username = '$username', email = '$email', password = '$password', ashesi_id = '$ashesi_id', phone_number = '$phone_number', user_type = '$user_type', role = '$role' WHERE user_id = $user_id";
} else {
    $sql = "UPDATE users SET username = '$username', email = '$email', ashesi_id = '$ashesi_id', phone_number = '$phone_number', user_type = '$user_type', role = '$role' WHERE user_id = $user_id";
}

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("success" => true));
} else {
    echo json_encode(array("success" => false, "error" => $conn->error));
}
?>