<?php
include_once('../settings/db_config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in."]);
        exit();
    }

    $ride_id = $_POST['ride_id'];

    $sql = "UPDATE rides SET ride_status = 'cancelled' WHERE ride_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $ride_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Ride cancelled successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error cancelling ride: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>