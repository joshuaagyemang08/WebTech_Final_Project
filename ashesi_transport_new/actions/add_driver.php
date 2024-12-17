<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once('../settings/db_config.php');

// Log the received POST data for debugging
error_log("Received POST data: " . print_r($_POST, true));

$username = $_POST['username'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);
$phone_number = $_POST['phone_number'];
$vehicle_type = $_POST['vehicle_type'];
$license_plate = $_POST['license_plate'];
$location = $_POST['location'];

$sql = "INSERT INTO drivers (username, email, password, phone_number, vehicle_type, license_plate, location) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if ($stmt) {
    $stmt->bind_param("sssssss", $username, $email, $password, $phone_number, $vehicle_type, $license_plate, $location);
    if ($stmt->execute()) {
        echo json_encode(array("success" => true));
    } else {
        error_log("Error executing statement: " . $stmt->error);
        echo json_encode(array("success" => false, "error" => $stmt->error));
    }
    $stmt->close();
} else {
    error_log("Error preparing statement: " . $conn->error);
    echo json_encode(array("success" => false, "error" => $conn->error));
}

$conn->close();
?>