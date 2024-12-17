<?php
include '../settings/db_config.php';

$sql = "SELECT * FROM drivers";
$result = $conn->query($sql);

$drivers = array();
while($row = $result->fetch_assoc()) {
    $drivers[] = $row;
}

echo json_encode($drivers);
?>