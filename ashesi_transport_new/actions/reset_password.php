<?php
header('Content-Type: application/json');
$response = [];

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the database connection
require('../settings/db_config.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $newPassword = password_hash($_POST['new_password'], PASSWORD_BCRYPT);

    // Determine the table to update
    $accountType = $_POST['account_type'];
    $table = $accountType === 'driver' ? 'drivers' : 'users';
    $emailColumn = 'email';

    // Update the password
    $stmt = $conn->prepare("UPDATE $table SET password = ? WHERE $emailColumn = ?");
    $stmt->bind_param('ss', $newPassword, $email);
    if ($stmt->execute()) {
        $response = ['status' => 'success', 'message' => 'Password reset successful.'];
    } else {
        $response = ['status' => 'error', 'message' => 'Failed to reset password.'];
    }

    $stmt->close();
} else {
    $response = ['status' => 'error', 'message' => 'Invalid request method.'];
}

echo json_encode($response);
$conn->close();
?>