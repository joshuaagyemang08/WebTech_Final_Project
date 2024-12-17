<?php
include_once('../settings/db_config.php');

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $ride_id = $_GET['ride_id'];

    $sql = "SELECT driver_id FROM rides WHERE ride_id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("i", $ride_id);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Failed to execute statement: " . $stmt->error]);
        exit();
    }
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["status" => "error", "message" => "Ride not found"]);
    }

    $stmt->close();
    $conn->close();
}
?>