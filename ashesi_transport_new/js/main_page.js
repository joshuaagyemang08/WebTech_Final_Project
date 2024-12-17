$(document).ready(function () {

    // Load all drivers on page load
    loadDrivers();

    // Load drivers
    function loadDrivers() {
        $.ajax({
            url: '../actions/get_online_drivers.php',
            type: 'GET',
            success: function (data,status) {
                console.log(data,status);
                const drivers = JSON.parse(data);
                let content = '';
                drivers.forEach(driver => {
                    content += `
                        <div class="driver-info card">
                            <div class="card-body">
                                <h5 class="card-title">Driver: ${driver.username}</h5>
                                <p class="card-text">Email: ${driver.email}</p>
                                <p class="card-text">Phone: ${driver.phone_number}</p>
                                <p class="card-text">Vehicle: ${driver.vehicle_type}</p>
                                <p class="card-text">Location: ${driver.location}</p>
                                <p class="card-text">Status: ${driver.online_status == 1 ? 'Online' : 'Offline'}</p>
                                ${driver.online_status == 1 ? `<button class="btn btn-primary book-ride-btn" data-driver-id="${driver.driver_id}">Book Ride</button>` : ''}
                            </div>
                        </div>
                    `;
                });
                $('#mainContent').html(content);
            },
            error: function (error) {
                console.error('Error loading drivers:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while loading drivers. Please try again.',
                });
            }
        });
    }

    // Show all drivers when the button is clicked
    $('#allDriversBtn').click(function () {
        loadDrivers();
    });

    // Search drivers by name
    $('#searchInput').on('input', function () {
        const searchValue = $(this).val().toLowerCase();
        $('.driver-info').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
        });
    });


    // Load user content
    function loadUserContent(statuses = ['pending', 'accepted']) {
        console.log(`Loading ${statuses.join(', ')} rides`);
        $.ajax({
            url: '../actions/get_user_rides.php',
            type: 'GET',
            data: { statuses: statuses },
            success: function (response) {
                console.log(`Response for ${statuses.join(', ')} rides:`, response);
                try {
                    const rides = JSON.parse(response);
                    let content = `<h3>${statuses.join(', ')} Rides</h3>`;
                    rides.forEach(ride => {
                        content += `
                            <div class="ride-info card">
                                <div class="card-body">
                                    <h5 class="card-title">Ride ID: ${ride.ride_id}</h5>
                                    <p class="card-text">Driver: ${ride.driver_name}</p>
                                    <p class="card-text">Email: ${ride.email}</p>
                                    <p class="card-text">Phone: ${ride.phone_number}</p>
                                    <p class="card-text">Pickup: ${ride.pickup_location}</p>
                                    <p class="card-text">Dropoff: ${ride.dropoff_location}</p>
                                    <p class="card-text">Status: ${ride.ride_status}</p>
                                    <button class="btn btn-info view-conversation-btn" data-ride-id="${ride.ride_id}"><i class="fas fa-comments"></i> View Conversation</button>
                                    ${ride.ride_status !== 'completed' ? `<button class="btn btn-danger cancel-ride-btn" data-ride-id="${ride.ride_id}">Cancel Ride</button>` : ''}
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
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                    console.error('Response:', response);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while processing your request. Please try again.',
                    });
                }
            },
            error: function (error) {
                console.error(`Error loading ${statuses.join(', ')} rides:`, error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while loading rides. Please try again.',
                });
            }
        });
    }

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
                $('#profileModal').modal('show');
            },
            error: function (error) {
                console.error('Error loading profile information:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while loading profile information. Please try again.',
                });
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

    // Book ride
    $(document).on('click', '.book-ride-btn', function () {
        const driverId = $(this).data('driver-id');
        Swal.fire({
            title: 'Enter Pickup and Dropoff Locations',
            html: `
                <input type="text" id="pickupLocation" class="swal2-input" placeholder="Pickup Location">
                <input type="text" id="dropoffLocation" class="swal2-input" placeholder="Dropoff Location">
                <textarea id="message" class="swal2-textarea" placeholder="Enter your message"></textarea>
            `,
            showCancelButton: true,
            confirmButtonText: 'Book Ride',
            preConfirm: () => {
                const pickupLocation = $('#pickupLocation').val();
                const dropoffLocation = $('#dropoffLocation').val();
                const message = $('#message').val();
                if (!pickupLocation || !dropoffLocation) {
                    Swal.showValidationMessage('Please enter both locations');
                }
                return { pickupLocation, dropoffLocation, message };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { pickupLocation, dropoffLocation, message } = result.value;
                $.ajax({
                    url: '../actions/book_ride.php',
                    type: 'POST',
                    data: {
                        driver_id: driverId,
                        pickup_location: pickupLocation,
                        dropoff_location: dropoffLocation,
                        message: message
                    },
                    success: function (response) {
                        try {
                            const res = JSON.parse(response);
                            if (res.status === 'success') {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Ride booked successfully!',
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
                                text: 'An error occurred while booking the ride. Please try again.',
                            });
                        }
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'An error occurred. Please try again.',
                        });
                    }
                });
            }
        });
    });

    // Cancel ride
    $(document).on('click', '.cancel-ride-btn', function () {
        const rideId = $(this).data('ride-id');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '../actions/cancel_ride.php',
                    type: 'POST',
                    data: { ride_id: rideId },
                    success: function (response) {
                        try {
                            const res = JSON.parse(response);
                            if (res.status === 'success') {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Cancelled!',
                                    text: res.message,
                                });
                                loadUserContent(['pending', 'accepted']);
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
                                text: 'An error occurred while cancelling the ride. Please try again.',
                            });
                        }
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'An error occurred. Please try again.',
                        });
                    }
                });
            }
        });
    });

    // Load active rides
    $('#activeRidesBtn').click(function () {
        $('#mainContent').empty();
        loadUserContent(['pending', 'accepted']);
    });

    // Load cancelled rides
    $('#cancelledRidesBtn').click(function () {
        $('#mainContent').empty();
        loadUserContent(['cancelled']);
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
    
        // First, retrieve the ride details to get the correct recipient ID
        $.ajax({
            url: '../actions/get_ride_details.php',
            type: 'GET',
            data: { ride_id: rideId },
            success: function (response) {
                try {
                    const rideDetails = JSON.parse(response);
                    const recipientId = rideDetails.driver_id; // Assuming the PHP script returns the driver_id
    
                    if (!recipientId) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Recipient ID is missing.',
                        });
                        return;
                    }
    
                    // Now send the message with the correct recipient ID
                    $.ajax({
                        url: '../actions/send_message.php',
                        type: 'POST',
                        data: {
                            ride_id: rideId,
                            message: message,
                            recipient_id: recipientId
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
                            }
                        },
                        error: function () {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'An error occurred. Please try again.',
                            });
                        }
                    });
                } catch (e) {
                    console.error('Error parsing ride details:', e);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while retrieving ride details.',
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while retrieving ride details.',
                });
            }
        });
    });
    
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
                    const currentUserId = localStorage.getItem('userType') === 'driver' ? localStorage.getItem('driver_id') : localStorage.getItem('user_id');
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
    // Load messages for a ride
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
                const currentUserId = localStorage.getItem('user_id'); // Use session information
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

    // Context menu for messages
    $(document).on('contextmenu', '.message', function (e) {
        e.preventDefault();
        const messageId = $(this).data('message-id');
        const messageElement = $(this);
        const messageText = messageElement.text().trim();

        // Check if the message is already deleted
        if (messageText === 'Deleted') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'This message has already been deleted.',
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '../actions/delete_message.php',
                    type: 'POST',
                    data: { message_id: messageId },
                    success: function (response) {
                        try {
                            const res = JSON.parse(response);
                            if (res.status === 'success') {
                                messageElement.html('<strong>Deleted</strong>');
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Deleted!',
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
                                text: 'An error occurred while deleting the message. Please try again.',
                            });
                        }
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'An error occurred. Please try again.',
                        });
                    }
                });
            }
        });
    });

    // Logout
    $('#logoutBtn').click(function () {
        const userType = localStorage.getItem('userType');
        if (userType === 'driver') {
            $.ajax({
                url: '../actions/logout_driver.php',
                type: 'POST',
                success: function () {
                    localStorage.removeItem('userType');
                    window.location.href = '../login/login.html';
                },
                error: function (error) {
                    console.error('Error logging out:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while logging out. Please try again.',
                    });
                }
            });
        } else {
            localStorage.removeItem('userType');
            window.location.href = '../login/login.html';
        }
    });
});