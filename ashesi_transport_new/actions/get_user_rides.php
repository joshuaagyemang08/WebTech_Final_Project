<?php
include_once('../settings/db_config.php');

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in."]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $user_id = $_SESSION['user_id'];
    $statuses = $_GET['statuses'];
    $statusPlaceholders = implode(',', array_fill(0, count($statuses), '?'));
    $types = str_repeat('s', count($statuses));

    $sql = "SELECT r.ride_id, r.driver_id, r.pickup_location, r.dropoff_location, r.ride_status, d.username AS driver_name, d.email, d.phone_number
            FROM rides r
            JOIN drivers d ON r.driver_id = d.driver_id
            WHERE r.user_id = ? AND r.ride_status IN ($statusPlaceholders)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("i" . $types, $user_id, ...$statuses);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Failed to execute statement: " . $stmt->error]);
        exit();
    }
    $result = $stmt->get_result();

    $rides = [];
    while ($row = $result->fetch_assoc()) {
        $rides[] = $row;
    }

    echo json_encode($rides);

    $stmt->close();
    $conn->close();
}
?>