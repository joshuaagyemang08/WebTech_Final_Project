<?php
include '../settings/db_config.php';

$driver_id = $_GET['id'];
$sql = "SELECT * FROM drivers WHERE driver_id = $driver_id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    echo json_encode(array("error" => "Driver not found"));
}
?>