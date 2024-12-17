<?php
include_once('../settings/db_config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        session_start();
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['user_type'] = $user['user_type'];
        $_SESSION['role'] = $user['role'];

        if ($user['role'] == 'admin') {
            $redirect = '../views/admin_dashboard.html';
        } else {
            $redirect = '../views/main_page.html';
        }

        echo json_encode(["status" => "success", "message" => "Login successful!", "redirect" => $redirect]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
    }

    $stmt->close();
    $conn->close();
}
?>