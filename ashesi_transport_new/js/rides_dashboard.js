$(document).ready(function () {
    // Load rides when the Rides link is clicked
    $('#ridesLink').click(function () {
        loadRides();
    });

    // Load rides
    function loadRides() {
        $.ajax({
            url: '../actions/get_all_rides.php',
            type: 'GET',
            success: function (response) {
                const rides = JSON.parse(response);
                let content = '<h3>Rides</h3><button class="btn btn-success" id="addRideBtn">Add Ride</button><table class="table table-striped"><thead><tr><th>ID</th><th>User ID</th><th>Driver ID</th><th>Status</th><th>Pickup Location</th><th>Dropoff Location</th><th>Actions</th></tr></thead><tbody>';
                rides.forEach(ride => {
                    content += `
                        <tr>
                            <td>${ride.ride_id}</td>
                            <td>${ride.user_id}</td>
                            <td>${ride.driver_id}</td>
                            <td>${ride.ride_status}</td>
                            <td>${ride.pickup_location}</td>
                            <td>${ride.dropoff_location}</td>
                            <td>
                                <button class="btn btn-info edit-ride-btn" data-ride-id="${ride.ride_id}">Edit</button>
                                <button class="btn btn-danger delete-ride-btn" data-ride-id="${ride.ride_id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                content += '</tbody></table>';
                $('#mainContent').html(content);
            },
            error: function (error) {
                console.error('Error loading rides:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while loading rides. Please try again.',
                });
            }
        });
    }

    // Add ride
    $(document).on('click', '#addRideBtn', function () {
        Swal.fire({
            title: 'Add Ride',
            html: `
                <input type="text" id="userId" class="swal2-input" placeholder="User ID">
                <input type="text" id="driverId" class="swal2-input" placeholder="Driver ID">
                <input type="text" id="pickupLocation" class="swal2-input" placeholder="Pickup Location">
                <input type="text" id="dropoffLocation" class="swal2-input" placeholder="Dropoff Location">
                <select id="rideStatus" class="swal2-input">
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: 'Add',
            preConfirm: () => {
                const user_id = $('#userId').val();
                const driver_id = $('#driverId').val();
                const pickup_location = $('#pickupLocation').val();
                const dropoff_location = $('#dropoffLocation').val();
                const ride_status = $('#rideStatus').val();
                return { user_id, driver_id, pickup_location, dropoff_location, ride_status };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '../actions/add_ride.php',
                    type: 'POST',
                    data: result.value,
                    success: function (response) {
                        const res = JSON.parse(response);
                        if (res.success) {
                            Swal.fire('Added!', 'Ride has been added.', 'success');
                            loadRides();
                        } else {
                            Swal.fire('Error!', res.error, 'error');
                        }
                    }
                });
            }
        });
    });

    // Edit ride
    $(document).on('click', '.edit-ride-btn', function () {
        const rideId = $(this).data('ride-id');
        $.ajax({
            url: '../actions/fetch_ride_details.php',
            type: 'GET',
            data: { id: rideId },
            success: function (response) {
                const ride = JSON.parse(response);
                Swal.fire({
                    title: 'Edit Ride',
                    html: `
                        <input type="text" id="userId" class="swal2-input" value="${ride.user_id}">
                        <input type="text" id="driverId" class="swal2-input" value="${ride.driver_id}">
                        <input type="text" id="pickupLocation" class="swal2-input" value="${ride.pickup_location}">
                        <input type="text" id="dropoffLocation" class="swal2-input" value="${ride.dropoff_location}">
                        <select id="rideStatus" class="swal2-input">
                            <option value="pending" ${ride.ride_status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="accepted" ${ride.ride_status === 'accepted' ? 'selected' : ''}>Accepted</option>
                            <option value="completed" ${ride.ride_status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="cancelled" ${ride.ride_status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    preConfirm: () => {
                        const user_id = $('#userId').val();
                        const driver_id = $('#driverId').val();
                        const pickup_location = $('#pickupLocation').val();
                        const dropoff_location = $('#dropoffLocation').val();
                        const ride_status = $('#rideStatus').val();
                        return { id: rideId, user_id, driver_id, pickup_location, dropoff_location, ride_status };
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: '../actions/edit_ride.php',
                            type: 'POST',
                            data: result.value,
                            success: function (response) {
                                const res = JSON.parse(response);
                                if (res.success) {
                                    Swal.fire('Saved!', 'Ride has been updated.', 'success');
                                    loadRides();
                                } else {
                                    Swal.fire('Error!', res.error, 'error');
                                }
                            }
                        });
                    }
                });
            }
        });
    });

    // Delete ride
    $(document).on('click', '.delete-ride-btn', function () {
        const rideId = $(this).data('ride-id');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '../actions/delete_ride.php',
                    type: 'POST',
                    data: { id: rideId },
                    success: function (response) {
                        const res = JSON.parse(response);
                        if (res.success) {
                            Swal.fire('Deleted!', 'Ride has been deleted.', 'success');
                            loadRides();
                        } else {
                            Swal.fire('Error!', res.error, 'error');
                        }
                    }
                });
            }
        });
    });
});