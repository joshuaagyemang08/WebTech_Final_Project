<?php
include_once ('../settings/db_config.php');

$sql = "SELECT driver_id, username FROM drivers WHERE online_status = TRUE";
$result = $conn->query($sql);

$drivers = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $drivers[] = $row;
    }
}

echo json_encode($drivers);
?>