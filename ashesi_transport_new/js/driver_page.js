$(document).ready(function () {

    // Load driver content
    function loadDriverContent(statuses = ['pending', 'accepted']) {
        console.log(`Loading ${statuses.join(', ')} bookings`);
        $.ajax({
            url: '../actions/get_driver_rides.php',
            type: 'GET',
            data: { statuses: statuses },
            success: function (response) {
                console.log(`Response for ${statuses.join(', ')} bookings:`, response);
                const rides = JSON.parse(response);
                let headerText = 'Bookings';
                if (statuses.includes('pending') || statuses.includes('accepted')) {
                    headerText = 'Active Bookings';
                } else if (statuses.includes('cancelled')) {
                    headerText = 'Cancelled Bookings';
                } else if (statuses.includes('completed')) {
                    headerText = 'Completed Bookings';
                }
                let content = `<h3>${headerText}</h3>`;
                rides.forEach(ride => {
                    let statusOptions = '';
                    if (ride.ride_status !== 'cancelled' && ride.ride_status !== 'completed') {
                        statusOptions = `
                            <div class="form-check">
                                <input class="form-check-input change-status" type="radio" name="status-${ride.ride_id}" id="accept-${ride.ride_id}" value="accepted">
                                <label class="form-check-label" for="accept-${ride.ride_id}">Accept</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input change-status" type="radio" name="status-${ride.ride_id}" id="cancel-${ride.ride_id}" value="cancelled">
                                <label class="form-check-label" for="cancel-${ride.ride_id}">Cancel</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input change-status" type="radio" name="status-${ride.ride_id}" id="complete-${ride.ride_id}" value="completed">
                                <label class="form-check-label" for="complete-${ride.ride_id}">Complete</label>
                            </div>
                            <button class="btn btn-primary update-status-btn" data-ride-id="${ride.ride_id}">Update Status</button>
                        `;
                    }
                    content += `
                        <div class="ride-info card">
                            <div class="card-body">
                                <h5 class="card-title">Ride ID: ${ride.ride_id}</h5>
                                <p class="card-text">User: ${ride.username}</p>
                                <p class="card-text">Email: ${ride.email}</p>
                                <p class="card-text">Phone: ${ride.phone_number}</p>
                                <p class="card-text">Pickup: ${ride.pickup_location}</p>
                                <p class="card-text">Dropoff: ${ride.dropoff_location}</p>
                                <p class="card-text">Status: ${ride.ride_status}</p>
                                ${statusOptions}
                                <button class="btn btn-info view-conversation-btn" data-ride-id="${ride.ride_id}"><i class="fas fa-comments"></i> View Conversation</button>
                                <div class="messages" id="messages-${ride.ride_id}">
                                    <!-- Messages will be dynamically loaded here -->
                                </div>
                                <div class="message-box">
                                    <textarea class="form-control reply-message" placeholder="Enter your message"></textarea>
                                    <button class="btn btn-primary send-message-btn" data-ride-id="${ride.ride_id}">Send</button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                $('#mainContent').html(content);
            },
            error: function (error) {
                console.error(`Error loading ${statuses.join(', ')} bookings:`, error);
            }
        });
    }

    loadDriverContent();

    // Show profile modal
    $('#profileBtn').click(function () {
        $.ajax({
            url: '../actions/get_profile_info.php',
            type: 'GET',
            success: function (response) {
                const profile = JSON.parse(response);
                $('#profileName').val(profile.username);
                $('#profileEmail').val(profile.email);
                $('#profilePhone').val(profile.phone_number);
                $('#profileLocation').val(profile.location); // Add location field
                $('#profileModal').modal('show');
            },
            error: function (error) {
                console.error('Error loading profile information:', error);
            }
        });
    });

    // Update profile
    $('#profileForm').submit(function (event) {
        event.preventDefault();
        const formData = $(this).serialize();
        $.ajax({
            url: '../actions/update_profile.php',
            type: 'POST',
            data: formData,
            success: function (response) {
                try {
                    const res = JSON.parse(response);
                    if (res.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Profile updated successfully!',
                            text: res.message,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: res.message,
                        });
                    }
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                    console.error('Response:', response);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while updating profile. Please try again.',
                    });
                }
            },
            error: function (error) {
                console.error('Error updating profile:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while updating profile. Please try again.',
                });
            }
        });
    });

    // Load active bookings
    $('#activeBookingsBtn').click(function () {
        loadDriverContent(['pending', 'accepted']);
    });

    // Load cancelled bookings
    $('#cancelledBookingsBtn').click(function () {
        loadDriverContent(['cancelled']);
    });

    // Load completed bookings
    $('#completedBookingsBtn').click(function () {
        loadDriverContent(['completed']);
    });

    // View conversation
    $(document).on('click', '.view-conversation-btn', function () {
        const rideId = $(this).data('ride-id');
        loadMessages(rideId);
        $(`#messages-${rideId}`).toggle();
    });

    // Send message
    $(document).on('click', '.send-message-btn', function () {
        const rideId = $(this).data('ride-id');
        const message = $(this).siblings('.reply-message').val();
    
        // Send the message
        $.ajax({
            url: '../actions/send_message.php',
            type: 'POST',
            data: {
                ride_id: rideId,
                message: message
            },
            success: function (response) {
                console.log(`Message sent response:`, response);
                try {
                    const res = JSON.parse(response);
                    if (res.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Message sent successfully!',
                            text: res.message,
                        }).then(() => {
                            loadMessages(rideId);
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: res.message,
                        });
                    }
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                    console.error('Response:', response);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while sending the message. Please try again.',
                    });
                }
            },
            error: function (error) {
                console.error('Error sending message:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred. Please try again.',
                });
            }
        });
    });

    // Load messages
    function loadMessages(rideId) {
        console.log(`Loading messages for ride ID: ${rideId}`);
        $.ajax({
            url: '../actions/get_messages.php',
            type: 'GET',
            data: { ride_id: rideId },
            success: function (response) {
                try {
                    const messages = JSON.parse(response);
                    let messageContent = '';
                    const currentUserId = localStorage.getItem('driver_id'); // Use session information
                    messages.forEach(message => {
                        const messageClass = message.sender_id == currentUserId ? 'me' : 'other';
                        const senderName = message.sender_id == currentUserId ? 'me' : message.sender_name;
                        messageContent += `<div class="message ${messageClass}"><strong>${senderName}:</strong> ${message.message_text}</div>`;
                    });
                    $(`#messages-${rideId}`).html(messageContent);
                    $(`#messages-${rideId}`).css('display', 'block'); // Ensure messages are displayed
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                    console.error('Response:', response);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while loading messages. Please try again.',
                    });
                }
            },
            error: function (error) {
                console.error(`Error loading messages for ride ID: ${rideId}`, error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while loading messages. Please try again.',
                });
            }
        });
    }

    // Update ride status
    $(document).on('click', '.update-status-btn', function () {
        const rideId = $(this).data('ride-id');
        const status = $(`input[name="status-${rideId}"]:checked`).val();
        if (!status) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a status.',
            });
            return;
        }
        console.log(`Updating status of ride ID: ${rideId} to ${status}`);
        $.ajax({
            url: '../actions/change_ride_status.php',
            type: 'POST',
            data: { ride_id: rideId, status: status },
            success: function (response) {
                console.log(`Status change response:`, response);
                try {
                    const res = JSON.parse(response);
                    if (res.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Status changed successfully!',
                            text: res.message,
                        }).then(() => {
                            loadDriverContent(['pending', 'accepted']);
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: res.message,
                        });
                    }
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                    console.error('Response:', response);
                }
            },
            error: function (error) {
                console.error(`Error changing status for ride ID: ${rideId}`, error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred. Please try again.',
                });
            }
        });
    });

    // Logout
    $('#logoutBtn').click(function () {
        $.ajax({
            url: '../actions/logout_driver.php',
            type: 'POST',
            success: function () {
                localStorage.removeItem('userType');
                window.location.href = '../login/login.html';
            },
            error: function (error) {
                console.error('Error logging out:', error);
            }
        });
    });
});