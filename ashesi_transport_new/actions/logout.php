<?php
include_once('../settings/db_config.php');

session_start();
$driver_id = $_SESSION['user_id']; // Assuming driver_id is stored in session

$sql = "UPDATE Drivers SET online_status = FALSE WHERE driver_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $driver_id);
$stmt->execute();

session_destroy();

$stmt->close();
$conn->close();
?>