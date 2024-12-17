<?php
include_once('../settings/db_config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    session_start();
    if (!isset($_SESSION['driver_id']) && !isset($_SESSION['user_id'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in."]);
        exit();
    }

    if (!isset($_POST['message_id'])) {
        echo json_encode(["status" => "error", "message" => "Missing required parameters."]);
        exit();
    }

    $message_id = $_POST['message_id'];

    // Update the message text to 'Deleted'
    $sql = "UPDATE messages SET message_text = 'Deleted' WHERE message_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $message_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Message deleted successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete message."]);
    }

    $stmt->close();
    $conn->close();
}
?>