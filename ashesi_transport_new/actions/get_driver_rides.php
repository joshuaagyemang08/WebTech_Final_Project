<?php
include_once('../settings/db_config.php');

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $statuses = $_GET['statuses'];
    $statusPlaceholders = implode(',', array_fill(0, count($statuses), '?'));
    $types = str_repeat('s', count($statuses));

    $sql = "SELECT r.ride_id, r.user_id, r.driver_id, r.pickup_location, r.dropoff_location, r.ride_status, u.username, u.email, u.phone_number
            FROM rides r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.ride_status IN ($statusPlaceholders)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]);
        exit();
    }
    $stmt->bind_param($types, ...$statuses);
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