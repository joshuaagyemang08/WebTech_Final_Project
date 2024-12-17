<?php
include '../settings/db_config.php';

// Fetch rides data
$rides_sql = "SELECT ride_status, COUNT(*) as count FROM rides GROUP BY ride_status";
$rides_result = $conn->query($rides_sql);

$rides_data = array();
$rides_labels = array();
while($row = $rides_result->fetch_assoc()) {
    $rides_labels[] = $row['ride_status'];
    $rides_data[] = $row['count'];
}

// Fetch users data
$users_sql = "SELECT user_type, COUNT(*) as count FROM users GROUP BY user_type";
$users_result = $conn->query($users_sql);

$users_data = array();
$users_labels = array();
while($row = $users_result->fetch_assoc()) {
    $users_labels[] = $row['user_type'];
    $users_data[] = $row['count'];
}

// Fetch driver with most completed rides
$top_driver_sql = "SELECT d.username, d.email, COUNT(r.ride_id) as completed_rides
                   FROM drivers d
                   JOIN rides r ON d.driver_id = r.driver_id
                   WHERE r.ride_status = 'completed'
                   GROUP BY d.driver_id
                   ORDER BY completed_rides DESC
                   LIMIT 1";
$top_driver_result = $conn->query($top_driver_sql);
$top_driver = $top_driver_result->fetch_assoc();

echo json_encode(array(
    "rides" => array(
        "labels" => $rides_labels,
        "data" => $rides_data
    ),
    "users" => array(
        "labels" => $users_labels,
        "data" => $users_data
    ),
    "topDriver" => $top_driver
));
?>