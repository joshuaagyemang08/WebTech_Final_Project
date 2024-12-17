<?php
include_once('../settings/db_config.php');

session_start();
if (!isset($_SESSION['user_id']) && !isset($_SESSION['driver_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_SESSION['user_id'];
    $driver_id = $_POST['driver_id'];
    $pickup_location = $_POST['pickup_location'];
    $dropoff_location = $_POST['dropoff_location'];
    $message = $_POST['message']; // Get the message from the form
    $ride_status = 'pending'; // Set initial status to "pending"
    $requested_at = date('Y-m-d H:i:s');

    // Check if there is already a pending ride with the same driver
    $checkSql = "SELECT * FROM rides WHERE user_id = ? AND driver_id = ? AND ride_status = 'pending'";
    $checkStmt = $conn->prepare($checkSql);
    if (!$checkStmt) {
        echo json_encode(["status" => "error", "message" => "Failed to prepare check statement: " . $conn->error]);
        exit();
    }
    $checkStmt->bind_param("ii", $user_id, $driver_id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    if ($checkResult->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "You already have a pending ride with this driver."]);
        $checkStmt->close();
        $conn->close();
        exit();
    }
    $checkStmt->close();

    $sql = "INSERT INTO rides (user_id, driver_id, pickup_location, dropoff_location, ride_status, requested_at) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("iissss", $user_id, $driver_id, $pickup_location, $dropoff_location, $ride_status, $requested_at);
    if ($stmt->execute()) {
        $ride_id = $stmt->insert_id; // Get the auto-generated ride ID
        $messageSql = "INSERT INTO messages (ride_id, sender_id, recipient_id, message_text, timestamp) VALUES (?, ?, ?, ?, ?)";
        $messageStmt = $conn->prepare($messageSql);
        if (!$messageStmt) {
            echo json_encode(["status" => "error", "message" => "Failed to prepare message statement: " . $conn->error]);
            exit();
        }
        $messageStmt->bind_param("iiiss", $ride_id, $user_id, $driver_id, $message, $requested_at);

        if ($messageStmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Ride booked successfully!",
                "driver_contact" => $driver_id // Assuming driver contact is driver_id for now
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error inserting message: " . $messageStmt->error]);
        }

        $messageStmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Error booking ride: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>