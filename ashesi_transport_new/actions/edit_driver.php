<?php
include '../settings/db_config.php';

$driver_id = $_POST['id'];
$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];
$phone_number = $_POST['phone_number'];
$vehicle_type = $_POST['vehicle_type'];
$license_plate = $_POST['license_plate'];
$location = $_POST['location'];

if (!empty($password)) {
    $password = password_hash($password, PASSWORD_BCRYPT);
    $sql = "UPDATE drivers SET username = '$username', email = '$email', password = '$password', phone_number = '$phone_number', vehicle_type = '$vehicle_type', license_plate = '$license_plate', location = '$location' WHERE driver_id = $driver_id";
} else {
    $sql = "UPDATE drivers SET username = '$username', email = '$email', phone_number = '$phone_number', vehicle_type = '$vehicle_type', license_plate = '$license_plate', location = '$location' WHERE driver_id = $driver_id";
}

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("success" => true));
} else {
    echo json_encode(array("success" => false, "error" => $conn->error));
}
?>