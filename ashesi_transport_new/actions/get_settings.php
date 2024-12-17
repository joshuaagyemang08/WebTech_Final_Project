<?php
include '../settings/db_config.php';

$sql = "SELECT * FROM settings LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    echo json_encode(array("error" => "Settings not found"));
}
?>