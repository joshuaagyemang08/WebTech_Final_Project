<?php
header('Content-Type: application/json');
$response = [];

// Include the database connection
require('../settings/db_config.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $resetCode = $_POST['reset_code'];

    // Check if the reset code is valid
    $stmt = $conn->prepare("SELECT * FROM resetcodes WHERE email = ? AND reset_code = ?");
    $stmt->bind_param('si', $email, $resetCode);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response = ['status' => 'success', 'message' => 'Reset code verified.'];
    } else {
        $response = ['status' => 'error', 'message' => 'Invalid reset code.'];
    }

    $stmt->close();
} else {
    $response = ['status' => 'error', 'message' => 'Invalid request method.'];
}

echo json_encode($response);
$conn->close();
?>