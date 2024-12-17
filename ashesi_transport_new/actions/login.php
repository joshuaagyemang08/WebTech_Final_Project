<?php
include_once('../settings/db_config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];
    $userType = $_POST["userType"];

    if ($userType == "driver") {
        $sql = "SELECT * FROM drivers WHERE email = ?";
    } else {
        $sql = "SELECT * FROM users WHERE email = ?";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row["password"])) {
            session_start();
            $_SESSION["user_id"] = $row["user_id"];
            $_SESSION["username"] = $row["username"];
            $_SESSION["user_type"] = $userType;

            if ($userType == "driver") {
                // Set driver online status to true
                $updateSql = "UPDATE Drivers SET online_status = TRUE WHERE driver_id = ?";
                $updateStmt = $conn->prepare($updateSql);
                $updateStmt->bind_param("i", $row["driver_id"]);
                $updateStmt->execute();
                $updateStmt->close();
            }

            header("Location: main_page.html");
        } else {
            echo "Invalid password.";
        }
    } else {
        echo "No user found with that email.";
    }

    $stmt->close();
}

$conn->close();
?>