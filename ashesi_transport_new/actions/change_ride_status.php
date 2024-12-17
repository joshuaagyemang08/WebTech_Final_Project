<?php
include_once('../settings/db_config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $ride_id = $_POST['ride_id'];
    $status = $_POST['status'];

    $sql = "UPDATE rides SET ride_status = ? WHERE ride_id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("si", $status, $ride_id);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Ride status updated successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error updating ride status: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>