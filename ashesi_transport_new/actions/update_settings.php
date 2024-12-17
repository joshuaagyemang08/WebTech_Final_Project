<?php
include '../settings/db_config.php';

$site_name = $_POST['site_name'];
$admin_email = $_POST['admin_email'];

$sql = "UPDATE settings SET site_name = '$site_name', admin_email = '$admin_email' WHERE id = 1";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("success" => true));
} else {
    echo json_encode(array("success" => false, "error" => $conn->error));
}
?>