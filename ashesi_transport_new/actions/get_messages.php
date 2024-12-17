<?php
include_once('../settings/db_config.php');

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $ride_id = $_GET['ride_id'];

    $sql = "SELECT m.message_id, m.message_text, m.sender_id, m.timestamp, 
                   CASE 
                       WHEN u.user_id IS NOT NULL THEN u.username
                       ELSE d.username
                   END AS sender_name
            FROM messages m
            LEFT JOIN users u ON m.sender_id = u.user_id
            LEFT JOIN drivers d ON m.sender_id = d.driver_id
            WHERE m.ride_id = ?
            ORDER BY m.timestamp ASC"; // Ensure messages are ordered by their timestamp
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("i", $ride_id);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Failed to execute statement: " . $stmt->error]);
        exit();
    }
    $result = $stmt->get_result();

    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }

    echo json_encode($messages);

    $stmt->close();
    $conn->close();
}
?>