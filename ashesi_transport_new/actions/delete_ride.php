<?php
include '../settings/db_config.php';

$ride_id = $_POST['id'];

$sql = "DELETE FROM rides WHERE ride_id = $ride_id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("success" => true));
} else {
    echo json_encode(array("success" => false, "error" => $conn->error));
}
?>