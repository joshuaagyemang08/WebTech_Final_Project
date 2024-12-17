<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once('../settings/db_config.php');

// Log the received POST data for debugging
error_log("Received POST data: " . print_r($_POST, true));

$user_id = $_POST['user_id'];
$driver_id = $_POST['driver_id'];
$pickup_location = $_POST['pickup_location'];
$dropoff_location = $_POST['dropoff_location'];
$ride_status = $_POST['ride_status'];

$sql = "INSERT INTO rides (user_id, driver_id, pickup_location, dropoff_location, ride_status) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if ($stmt) {
    $stmt->bind_param("iisss", $user_id, $driver_id, $pickup_location, $dropoff_location, $ride_status);
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