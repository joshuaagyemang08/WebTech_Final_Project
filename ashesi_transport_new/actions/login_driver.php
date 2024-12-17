<?php
include_once('../settings/db_config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Log the received email for debugging
    error_log("Login attempt with email: $email");

    $sql = "SELECT * FROM drivers WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        error_log("Error preparing statement: " . $conn->error);
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement."]);
        exit();
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $driver = $result->fetch_assoc();

    if ($driver && password_verify($password, $driver['password'])) {
        session_start();
        $_SESSION['driver_id'] = $driver['driver_id'];
        $_SESSION['username'] = $driver['username'];
        $_SESSION['user_type'] = 'driver';

        // Set driver online status to TRUE
        $updateSql = "UPDATE drivers SET online_status = TRUE WHERE driver_id = ?";
        $updateStmt = $conn->prepare($updateSql);
        if (!$updateStmt) {
            error_log("Error preparing update statement: " . $conn->error);
            echo json_encode(["status" => "error", "message" => "Failed to prepare update statement."]);
            exit();
        }
        $updateStmt->bind_param("i", $driver['driver_id']);
        $updateStmt->execute();
        $updateStmt->close();

        echo json_encode(["status" => "success", "message" => "Login successful!", "redirect" => "../views/driver_page.html"]);
    } else {
        error_log("Invalid email or password for email: $email");
        echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
    }

    $stmt->close();
    $conn->close();
} else {
    error_log("Invalid request method: " . $_SERVER["REQUEST_METHOD"]);
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>