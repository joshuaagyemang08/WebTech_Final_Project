<?php
include_once('../settings/db_config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $email = $_POST["email"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $ashesi_id = $_POST["ashesi_id"];
    $phone_number = $_POST["phone_number"];
    $user_type = $_POST["user_type"];

    $sql = "INSERT INTO users (username, email, password, ashesi_id, phone_number, user_type) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", $username, $email, $password, $ashesi_id, $phone_number, $user_type);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "User registered successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>