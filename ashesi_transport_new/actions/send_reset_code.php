<?php
header('Content-Type: application/json');
$response = [];

// Include the database connection
require('../settings/db_config.php');

// Include PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require '../vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accountType = $_POST['account_type'];
    $email = $_POST['email'];

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Determine the table to query
        $table = $accountType === 'driver' ? 'drivers' : 'users';
        $emailColumn = 'email';

        // Check if the email exists
        $stmt = $conn->prepare("SELECT * FROM $table WHERE $emailColumn = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Generate a 4-digit reset code
            $resetCode = rand(1000, 9999);

            // Insert the reset code into the resetcodes table
            $stmt = $conn->prepare("INSERT INTO resetcodes (email, reset_code) VALUES (?, ?) ON DUPLICATE KEY UPDATE reset_code = ?");
            $stmt->bind_param('ssi', $email, $resetCode, $resetCode);
            if ($stmt->execute()) {
                // Send the reset code via email using PHPMailer
                $mail = new PHPMailer(true);
                try {
                    // Server settings
                    $mail->isSMTP();
                    $mail->Host = 'smtp.gmail.com';
                    $mail->SMTPAuth = true;
                    $mail->Username = 'your-email@gmail.com';
                    $mail->Password = 'your-email-password';
                    $mail->SMTPSecure = 'tls';
                    $mail->Port = 587;

                    // Recipients
                    $mail->setFrom('your-email@gmail.com', 'Your Name');
                    $mail->addAddress($email);

                    // Content
                    $mail->isHTML(true);
                    $mail->Subject = 'Password Reset Code';
                    $mail->Body = "Your password reset code is: $resetCode";

                    $mail->send();
                    $response = ['status' => 'success', 'message' => 'A reset code has been sent to your email address.'];
                } catch (Exception $e) {
                    $response = ['status' => 'error', 'message' => 'Failed to send email.'];
                }
            } else {
                $response = ['status' => 'error', 'message' => 'Failed to save reset code.'];
            }
        } else {
            $response = ['status' => 'error', 'message' => 'Email not found.'];
        }

        $stmt->close();
    } else {
        $response = ['status' => 'error', 'message' => 'Invalid email address.'];
    }
} else {
    $response = ['status' => 'error', 'message' => 'Invalid request method.'];
}

echo json_encode($response);
$conn->close();
?>