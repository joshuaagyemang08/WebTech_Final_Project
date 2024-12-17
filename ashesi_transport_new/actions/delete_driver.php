<?php
include '../settings/db_config.php';

$driver_id = $_POST['id'];

$sql = "DELETE FROM drivers WHERE driver_id = $driver_id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("success" => true));
} else {
    echo json_encode(array("success" => false, "error" => $conn->error));
}
?>