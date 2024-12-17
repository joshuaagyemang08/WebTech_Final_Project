<?php
include '../settings/db_config.php';

$ride_id = $_GET['id'];
$sql = "SELECT * FROM rides WHERE ride_id = $ride_id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    echo json_encode(array("error" => "Ride not found"));
}
?>