<?php
include_once('../settings/db_config.php');

session_start();
if (!isset($_SESSION['user_id']) && !isset($_SESSION['driver_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $location = $_POST['location']; // Add location field

    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
        $sql = "UPDATE users SET email = ?, phone_number = ?, location = ? WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]);
            exit();
        }
        $stmt->bind_param("sssi", $email, $phone, $location, $user_id);
    } else {
        $driver_id = $_SESSION['driver_id'];
        $sql = "UPDATE drivers SET email = ?, phone_number = ?, location = ? WHERE driver_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]);
            exit();
        }
        $stmt->bind_param("sssi", $email, $phone, $location, $driver_id);
    }

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Profile updated successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error updating profile: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>