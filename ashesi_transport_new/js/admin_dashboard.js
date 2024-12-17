$(document).ready(function () {
    // Load users on page load
    loadUsers();

    // Event delegation for Users link
    $(document).on('click', '#usersLink', function () {
        loadUsers();
    });

    // Load users
    function loadUsers() {
        $.ajax({
            url: '../actions/get_users.php',
            type: 'GET',
            success: function (data,status) {
                console.log(data,status);
                const users = JSON.parse(data);
                let content = '<h3>Users</h3><button class="btn btn-success" id="addUserBtn">Add User</button><table class="table table-striped"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Ashesi ID</th><th>Phone Number</th><th>User Type</th><th>Role</th><th>Actions</th></tr></thead><tbody>';
                users.forEach(user => {
                    content += `
                        <tr>
                            <td>${user.user_id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.ashesi_id}</td>
                            <td>${user.phone_number}</td>
                            <td>${user.user_type}</td>
                            <td>${user.role}</td>
                            <td>
                                <button class="btn btn-info edit-user-btn" data-user-id="${user.user_id}">Edit</button>
                                <button class="btn btn-danger delete-user-btn" data-user-id="${user.user_id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                content += '</tbody></table>';
                $('#mainContent').html(content);
            },
            error: function (error) {
                console.error('Error loading users:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while loading users. Please try again.',
                });
            }
        });
    }

    // Add user
    $(document).on('click', '#addUserBtn', function () {
        Swal.fire({
            title: 'Add User',
            html: `
                <input type="text" id="userName" class="swal2-input" placeholder="Name">
                <input type="email" id="userEmail" class="swal2-input" placeholder="Email">
                <input type="password" id="userPassword" class="swal2-input" placeholder="Password">
                <input type="text" id="userAshesiId" class="swal2-input" placeholder="Ashesi ID">
                <input type="text" id="userPhoneNumber" class="swal2-input" placeholder="Phone Number">
                <select id="userType" class="swal2-input">
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                </select>
                <select id="userRole" class="swal2-input">
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: 'Add',
            preConfirm: () => {
                const username = $('#userName').val();
                const email = $('#userEmail').val();
                const password = $('#userPassword').val();
                const ashesi_id = $('#userAshesiId').val();
                const phone_number = $('#userPhoneNumber').val();
                const user_type = $('#userType').val();
                const role = $('#userRole').val();
                return { username, email, password, ashesi_id, phone_number, user_type, role };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '../actions/add_user.php',
                    type: 'POST',
                    data: result.value,
                    success: function (response) {
                        const res = JSON.parse(response);
                        if (res.success) {
                            Swal.fire('Added!', 'User has been added.', 'success');
                            loadUsers();
                        } else {
                            Swal.fire('Error!', res.error, 'error');
                        }
                    }
                });
            }
        });
    });

    // Edit user
    $(document).on('click', '.edit-user-btn', function () {
        const userId = $(this).data('user-id');
        $.ajax({
            url: '../actions/get_user.php',
            type: 'GET',
            data: { id: userId },
            success: function (data,status) {
                console.log(data,status);
                const user = JSON.parse(data);
                Swal.fire({
                    title: 'Edit User',
                    html: `
                        <input type="text" id="userName" class="swal2-input" value="${user.username}">
                        <input type="email" id="userEmail" class="swal2-input" value="${user.email}">
                        <input type="password" id="userPassword" class="swal2-input" placeholder="Password (leave blank to keep current)">
                        <input type="text" id="userAshesiId" class="swal2-input" value="${user.ashesi_id}">
                        <input type="text" id="userPhoneNumber" class="swal2-input" value="${user.phone_number}">
                        <select id="userType" class="swal2-input">
                            <option value="student" ${user.user_type === 'student' ? 'selected' : ''}>Student</option>
                            <option value="staff" ${user.user_type === 'staff' ? 'selected' : ''}>Staff</option>
                        </select>
                        <select id="userRole" class="swal2-input">
                            <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                            <option value="staff" ${user.role === 'staff' ? 'selected' : ''}>Staff</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    preConfirm: () => {
                        const username = $('#userName').val();
                        const email = $('#userEmail').val();
                        const password = $('#userPassword').val();
                        const ashesi_id = $('#userAshesiId').val();
                        const phone_number = $('#userPhoneNumber').val();
                        const user_type = $('#userType').val();
                        const role = $('#userRole').val();
                        return { id: userId, username, email, password, ashesi_id, phone_number, user_type, role };
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: '../actions/edit_user.php',
                            type: 'POST',
                            data: result.value,
                            success: function (data,status) {
                                const res = JSON.parse(data);
                                console.log(data,status);
                                if (res.success) {
                                    Swal.fire('Saved!', 'User has been updated.', 'success');
                                    loadUsers();
                                } else {
                                    Swal.fire('Error!', res.error, 'error');
                                }
                            }
                        });
                    }
                });
            },
            error: function (error) {
                console.error('Error loading users:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while loading users. Please try again.',
                });
            }
      
        });
    });

    // Delete user
    $(document).on('click', '.delete-user-btn', function () {
        const userId = $(this).data('user-id');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '../actions/delete_user.php',
                    type: 'POST',
                    data: { id: userId },
                    success: function (response) {
                        const res = JSON.parse(response);
                        if (res.success) {
                            Swal.fire('Deleted!', 'User has been deleted.', 'success');
                            loadUsers();
                        } else {
                            Swal.fire('Error!', res.error, 'error');
                        }
                    }
                });
            }
        });
    });
});