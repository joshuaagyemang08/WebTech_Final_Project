<?php
include_once('../settings/db_config.php');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $email = $_POST["email"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $phone_number = $_POST["phone_number"];
    $vehicle_type = $_POST["vehicle_type"];
    $license_plate = $_POST["license_plate"];

    $sql = "INSERT INTO drivers (username, email, password, phone_number, vehicle_type, license_plate) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", $username, $email, $password, $phone_number, $vehicle_type, $license_plate);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Driver registered successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>