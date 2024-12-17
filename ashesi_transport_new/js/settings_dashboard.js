$(document).ready(function () {
    // Load settings when the Settings link is clicked
    $('#settingsLink').click(function () {
        loadSettings();
    });

    // Load settings
    function loadSettings() {
        $.ajax({
            url: '../actions/get_settings.php',
            type: 'GET',
            success: function (response) {
                const settings = JSON.parse(response);
                renderSettings(settings);
            },
            error: function (error) {
                console.error('Error loading settings:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while loading settings. Please try again.',
                });
            }
        });
    }

    // Render settings form
    function renderSettings(settings) {
        $('#mainContent').html(`
            <h3>Settings</h3>
            <form id="settingsForm">
                <div class="form-group">
                    <label for="siteName">Site Name</label>
                    <input type="text" class="form-control" id="siteName" value="${settings.site_name}">
                </div>
                <div class="form-group">
                    <label for="adminEmail">Admin Email</label>
                    <input type="email" class="form-control" id="adminEmail" value="${settings.admin_email}">
                </div>
                <button type="submit" class="btn btn-primary">Save</button>
            </form>
        `);

        // Handle form submission
        $('#settingsForm').submit(function (e) {
            e.preventDefault();
            const site_name = $('#siteName').val();
            const admin_email = $('#adminEmail').val();
            $.ajax({
                url: '../actions/update_settings.php',
                type: 'POST',
                data: { site_name, admin_email },
                success: function (response) {
                    const res = JSON.parse(response);
                    if (res.success) {
                        Swal.fire('Saved!', 'Settings have been updated.', 'success');
                    } else {
                        Swal.fire('Error!', res.error, 'error');
                    }
                },
                error: function (error) {
                    console.error('Error updating settings:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'An error occurred while updating settings. Please try again.',
                    });
                }
            });
        });
    }
});