<?php
include '../settings/db_config.php';

$ride_id = $_POST['id'];
$user_id = $_POST['user_id'];
$driver_id = $_POST['driver_id'];
$pickup_location = $_POST['pickup_location'];
$dropoff_location = $_POST['dropoff_location'];
$ride_status = $_POST['ride_status'];

$sql = "UPDATE rides SET user_id = '$user_id', driver_id = '$driver_id', pickup_location = '$pickup_location', dropoff_location = '$dropoff_location', ride_status = '$ride_status' WHERE ride_id = $ride_id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("success" => true));
} else {
    echo json_encode(array("success" => false, "error" => $conn->error));
}
?>