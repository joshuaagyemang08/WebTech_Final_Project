$(document).ready(function () {
    // Load drivers when the Drivers link is clicked
    $('#driversLink').click(function () {
        loadDrivers();
    });

    // Load drivers
    function loadDrivers() {
        $.ajax({
            url: '../actions/get_all_drivers.php',
            type: 'GET',
            success: function (response) {
                const drivers = JSON.parse(response);
                let content = '<h3>Drivers</h3><button class="btn btn-success" id="addDriverBtn">Add Driver</button><table class="table table-striped"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone Number</th><th>Vehicle Type</th><th>License Plate</th><th>Location</th><th>Actions</th></tr></thead><tbody>';
                drivers.forEach(driver => {
                    content += `
                        <tr>
                            <td>${driver.driver_id}</td>
                            <td>${driver.username}</td>
                            <td>${driver.email}</td>
                            <td>${driver.phone_number}</td>
                            <td>${driver.vehicle_type}</td>
                            <td>${driver.license_plate}</td>
                            <td>${driver.location}</td>
                            <td>
                                <button class="btn btn-info edit-driver-btn" data-driver-id="${driver.driver_id}">Edit</button>
                                <button class="btn btn-danger delete-driver-btn" data-driver-id="${driver.driver_id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                content += '</tbody></table>';
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

    // Add driver
    $(document).on('click', '#addDriverBtn', function () {
        Swal.fire({
            title: 'Add Driver',
            html: `
                <input type="text" id="driverName" class="swal2-input" placeholder="Name">
                <input type="email" id="driverEmail" class="swal2-input" placeholder="Email">
                <input type="password" id="driverPassword" class="swal2-input" placeholder="Password">
                <input type="text" id="driverPhoneNumber" class="swal2-input" placeholder="Phone Number">
                <input type="text" id="driverVehicleType" class="swal2-input" placeholder="Vehicle Type">
                <input type="text" id="driverLicensePlate" class="swal2-input" placeholder="License Plate">
                <input type="text" id="driverLocation" class="swal2-input" placeholder="Location">
            `,
            showCancelButton: true,
            confirmButtonText: 'Add',
            preConfirm: () => {
                const username = $('#driverName').val();
                const email = $('#driverEmail').val();
                const password = $('#driverPassword').val();
                const phone_number = $('#driverPhoneNumber').val();
                const vehicle_type = $('#driverVehicleType').val();
                const license_plate = $('#driverLicensePlate').val();
                const location = $('#driverLocation').val();
                return { username, email, password, phone_number, vehicle_type, license_plate, location };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '../actions/add_driver.php',
                    type: 'POST',
                    data: result.value,
                    success: function (response) {
                        const res = JSON.parse(response);
                        if (res.success) {
                            Swal.fire('Added!', 'Driver has been added.', 'success');
                            loadDrivers();
                        } else {
                            Swal.fire('Error!', res.error, 'error');
                        }
                    }
                });
            }
        });
    });

    // Edit driver
    $(document).on('click', '.edit-driver-btn', function () {
        const driverId = $(this).data('driver-id');
        $.ajax({
            url: '../actions/get_driver_details.php',
            type: 'GET',
            data: { id: driverId },
            success: function (response) {
                const driver = JSON.parse(response);
                Swal.fire({
                    title: 'Edit Driver',
                    html: `
                        <input type="text" id="driverName" class="swal2-input" value="${driver.username}">
                        <input type="email" id="driverEmail" class="swal2-input" value="${driver.email}">
                        <input type="password" id="driverPassword" class="swal2-input" placeholder="Password (leave blank to keep current)">
                        <input type="text" id="driverPhoneNumber" class="swal2-input" value="${driver.phone_number}">
                        <input type="text" id="driverVehicleType" class="swal2-input" value="${driver.vehicle_type}">
                        <input type="text" id="driverLicensePlate" class="swal2-input" value="${driver.license_plate}">
                        <input type="text" id="driverLocation" class="swal2-input" value="${driver.location}">
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    preConfirm: () => {
                        const username = $('#driverName').val();
                        const email = $('#driverEmail').val();
                        const password = $('#driverPassword').val();
                        const phone_number = $('#driverPhoneNumber').val();
                        const vehicle_type = $('#driverVehicleType').val();
                        const license_plate = $('#driverLicensePlate').val();
                        const location = $('#driverLocation').val();
                        return { id: driverId, username, email, password, phone_number, vehicle_type, license_plate, location };
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: '../actions/edit_driver.php',
                            type: 'POST',
                            data: result.value,
                            success: function (response) {
                                const res = JSON.parse(response);
                                if (res.success) {
                                    Swal.fire('Saved!', 'Driver has been updated.', 'success');
                                    loadDrivers();
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

    // Delete driver
    $(document).on('click', '.delete-driver-btn', function () {
        const driverId = $(this).data('driver-id');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '../actions/delete_driver.php',
                    type: 'POST',
                    data: { id: driverId },
                    success: function (response) {
                        const res = JSON.parse(response);
                        if (res.success) {
                            Swal.fire('Deleted!', 'Driver has been deleted.', 'success');
                            loadDrivers();
                        } else {
                            Swal.fire('Error!', res.error, 'error');
                        }
                    }
                });
            }
        });
    });
});