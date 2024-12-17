<?php
include_once('../settings/db_config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    session_start();
    if (!isset($_SESSION['driver_id']) && !isset($_SESSION['user_id'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in."]);
        exit();
    }

    if (!isset($_POST['ride_id']) || !isset($_POST['message'])) {
        echo json_encode(["status" => "error", "message" => "Missing required parameters."]);
        exit();
    }

    $ride_id = $_POST['ride_id'];
    $message = $_POST['message'];
    $timestamp = date('Y-m-d H:i:s'); // Add timestamp

    // Determine sender and recipient based on session
    if (isset($_SESSION['driver_id'])) {
        $sender_id = $_SESSION['driver_id'];
        $sender_type = 'driver';
        $recipient_sql = "SELECT user_id FROM rides WHERE ride_id = ?";
    } else {
        $sender_id = $_SESSION['user_id'];
        $sender_type = 'user';
        $recipient_sql = "SELECT driver_id FROM rides WHERE ride_id = ?";
    }

    // Fetch the recipient ID based on the ride ID
    $stmt = $conn->prepare($recipient_sql);
    if (!$stmt) {
        error_log("Error preparing statement: " . $conn->error);
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement."]);
        exit();
    }
    $stmt->bind_param("i", $ride_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "No ride found with this ID."]);
        exit();
    }
    
    $row = $result->fetch_assoc();
    $recipient_id = $sender_type == 'driver' ? $row['user_id'] : $row['driver_id'];
    $stmt->close();

    // Debugging information
    error_log("Sender ID: $sender_id, Recipient ID: $recipient_id, Ride ID: $ride_id, Sender Type: $sender_type");

    // Ensure recipient ID exists in the referenced table
    if ($sender_type == 'driver') {
        $recipient_query = "SELECT user_id FROM users WHERE user_id = ?";
    } else {
        $recipient_query = "SELECT driver_id FROM drivers WHERE driver_id = ?";
    }

    $recipient_stmt = $conn->prepare($recipient_query);
    if (!$recipient_stmt) {
        error_log("Error preparing recipient statement: " . $conn->error);
        echo json_encode(["status" => "error", "message" => "Failed to prepare recipient statement."]);
        exit();
    }
    $recipient_stmt->bind_param("i", $recipient_id);
    $recipient_stmt->execute();
    $recipient_result = $recipient_stmt->get_result();

    // Debugging information
    error_log("Recipient Query: $recipient_query, Recipient ID: $recipient_id");

    if ($recipient_result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "Recipient does not exist."]);
        $recipient_stmt->close();
        exit();
    }
    $recipient_stmt->close();

    // Print values to the console for debugging
    error_log("Message: $message, Timestamp: $timestamp");

    // Insert the message into the database
    $sql = "INSERT INTO messages (ride_id, sender_id, recipient_id, message_text, timestamp) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        error_log("Error preparing insert statement: " . $conn->error);
        echo json_encode(["status" => "error", "message" => "Failed to prepare insert statement."]);
        exit();
    }
    $stmt->bind_param("iiiss", $ride_id, $sender_id, $recipient_id, $message, $timestamp);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Message sent successfully!", "sender_id" => $sender_id]);
    } else {
        // Log the error for debugging
        error_log("Error executing insert statement: " . $stmt->error);
        echo json_encode(["status" => "error", "message" => "Failed to send message."]);
    }

    $stmt->close();
    $conn->close();
}
?>