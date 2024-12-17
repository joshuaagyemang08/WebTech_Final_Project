$(document).ready(function() {
    // Load reports data
    $.ajax({
        url: '../actions/get_reports_data.php', // Ensure this URL is correct
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log("Reports data loaded successfully:", data);
            renderReports(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error loading reports:", {
                readyState: jqXHR.readyState,
                status: jqXHR.status,
                statusText: jqXHR.statusText,
                responseText: jqXHR.responseText
            });
            Swal.fire({
                icon: 'error',
                title: 'Error loading reports',
                text: 'An error occurred while loading the reports. Please try again later.'
            });
        }
    });

    function renderReports(data) {
        // Render user types chart
        var ctx = document.getElementById('userTypesChart');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.users.labels,
                datasets: [{
                    label: 'User Types',
                    data: data.users.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false, // Disable responsiveness to control size
                maintainAspectRatio: false // Disable maintaining aspect ratio
            }
        });
    }

    // Render top driver
    function renderTopDriver(topDriver) {
        $('#topDriver').html(`
            <h4>Driver with Most Completed Rides</h4>
            <p>Name: ${topDriver.username}</p>
            <p>Email: ${topDriver.email}</p>
            <p>Completed Rides: ${topDriver.completed_rides}</p>
        `);
    }
});