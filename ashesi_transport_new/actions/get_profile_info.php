<?php
include_once('../settings/db_config.php');

session_start(); // Ensure the session is started

if (!isset($_SESSION['user_id']) && !isset($_SESSION['driver_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit();
}

$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
$driver_id = isset($_SESSION['driver_id']) ? $_SESSION['driver_id'] : null;

if ($user_id) {
    $sql = "SELECT username, email, phone_number FROM users WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
} else {
    $sql = "SELECT username, email, phone_number FROM drivers WHERE driver_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $driver_id);
}

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $profile = $result->fetch_assoc();
    echo json_encode($profile);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to retrieve profile information."]);
}

$stmt->close();
$conn->close();
?>