<?php
include_once('../settings/db_config.php');

$sql = "SELECT * FROM drivers";
$result = $conn->query($sql);

$drivers = [];
while ($row = $result->fetch_assoc()) {
    $drivers[] = $row;
}

echo json_encode($drivers);

$conn->close();
?>