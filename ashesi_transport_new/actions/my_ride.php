<?php
include_once '../settings/db_config.php';
session_start();

$user_id = $_SESSION['user_id'];

$sql = "SELECT Rides.ride_id, Rides.pickup_location, Rides.dropoff_location, Rides.ride_status, Drivers.username AS driver_name 
        FROM Rides 
        JOIN Drivers ON Rides.driver_id = Drivers.driver_id 
        WHERE Rides.user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$rides = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rides[] = $row;
    }
}
$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Rides</title>
</head>
<body>
    <h2>My Rides</h2>
    <table>
        <thead>
            <tr>
                <th>Pickup Location</th>
                <th>Dropoff Location</th>
                <th>Driver</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($rides as $ride): ?>
                <tr>
                    <td><?php echo htmlspecialchars($ride['pickup_location']); ?></td>
                    <td><?php echo htmlspecialchars($ride['dropoff_location']); ?></td>
                    <td><?php echo htmlspecialchars($ride['driver_name']); ?></td>
                    <td><?php echo htmlspecialchars($ride['ride_status']); ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</body>
</html>