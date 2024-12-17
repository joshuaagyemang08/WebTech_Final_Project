<?php
include_once('../settings/db_config.php');

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit();
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT r.ride_id, d.username AS driver_name, r.pickup_location, r.dropoff_location, r.ride_status
        FROM rides r
        JOIN drivers d ON r.driver_id = d.driver_id
        WHERE r.user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$rides = [];
while ($row = $result->fetch_assoc()) {
    $rides[] = $row;
}

echo json_encode($rides);

$stmt->close();
$conn->close();
?>