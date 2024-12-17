<?php
include_once('../settings/db_config.php');

$sql = "SELECT driver_id, username, email, online_status, phone_number, vehicle_type, location FROM drivers";
$result = $conn->query($sql);

$drivers = [];
while ($row = $result->fetch_assoc()) {
    $drivers[] = $row;
}

echo json_encode($drivers);

$conn->close();
?>