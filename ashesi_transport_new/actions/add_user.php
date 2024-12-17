<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Do not display errors
ini_set('log_errors', 1); // Log errors
ini_set('error_log', '../logs/php_errors.log'); // Log file path

// Direct database connection
$servername = "localhost";
$username = "joshua.agyemang";
$password = "@roy0245876597";
$dbname = "webtech_fall2024_joshua_agyemang";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}

// Log the received POST data for debugging
error_log("Received POST data: " . print_r($_POST, true));

try {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $ashesi_id = $_POST['ashesi_id'];
    $phone_number = $_POST['phone_number'];
    $user_type = $_POST['user_type'];
    $role = $_POST['role'];

    $sql = "INSERT INTO users (username, email, password, ashesi_id, phone_number, user_type, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("sssssss", $username, $email, $password, $ashesi_id, $phone_number, $user_type, $role);
        if ($stmt->execute()) {
            echo json_encode(array("success" => true));
        } else {
            throw new Exception("Error executing statement: " . $stmt->error);
        }
        $stmt->close();
    } else {
        throw new Exception("Error preparing statement: " . $conn->error);
    }
} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(array("success" => false, "error" => $e->getMessage()));
}

$conn->close();
?>