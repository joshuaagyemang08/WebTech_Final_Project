<?php
include '../settings/db_config.php';

$sql = "SELECT * FROM rides";
$result = $conn->query($sql);

$rides = array();
while($row = $result->fetch_assoc()) {
    $rides[] = $row;
}

echo json_encode($rides);
?>