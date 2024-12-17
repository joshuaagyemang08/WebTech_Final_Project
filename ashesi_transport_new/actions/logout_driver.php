<?php
include_once('../settings/db_config.php');

session_start();
if (isset($_SESSION['driver_id'])) {
    $driver_id = $_SESSION['driver_id'];

    // Set driver online status to FALSE
    $updateSql = "UPDATE drivers SET online_status = FALSE WHERE driver_id = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("i", $driver_id);
    $updateStmt->execute();
    $updateStmt->close();

    session_unset();
    session_destroy();

    echo json_encode(["status" => "success", "message" => "Logout successful!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Driver not logged in."]);
}
?>