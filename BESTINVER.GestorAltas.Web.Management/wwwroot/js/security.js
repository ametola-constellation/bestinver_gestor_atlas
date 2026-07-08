$(document).ready(function () {
    loadUsersTableBehavior();
    loadRolesManagementBehavior();
    loadSyncUsersBehavior();
});

function loadUsersTableBehavior() {
    var usersTable = $('#users-list').DataTable({
        "bServerSide": true,
        "sAjaxSource": routeConfig.Security_GetSecurityUsers,
        "bProcessing": true,
        fixedColumns: true,
        "aoColumns": [
            {
                "sName": "Name",
                "bSearchable": true,
                "bSortable": true
            },
            {
                "sName": "Email",
                "bSearchable": true,
                "bSortable": true
            },
            {
                "sName": "Roles",
                "bSearchable": true,
                "bSortable": false
            },
            {
                "sName": "Id",
                "bSearchable": false,
                "bSortable": false,
                "visible": false
            },
            {
                "sName": "ShowRecord",
                "bSearchable": false,
                "bSortable": false
            }
        ],
        "columnDefs": [
            {
                "targets": 4,
                "data": null,
                "defaultContent": "<button type='button' class='btn btn-outline-secondary btn-sm add'><span class='fas fa-plus-circle'></span> Asignar rol</button><button type='button' class='btn btn-outline-secondary btn-sm remove'><span class='fas fa-trash-alt'></span> Quitar rol</button><button type='button' class='btn btn-danger btn-sm delete'><span class='fas fa-trash-alt'></span> Eliminar</button>"
            }
        ]
    });

    $('#users-list tbody').on('click', 'button.add', function (e) {
        e.preventDefault();

        var data = usersTable.row($(this).parents('tr')).data();

        $.ajax({
            type: "GET",
            url: routeConfig.Security_GetRolesList,
            success: function (response) {
                console.log(response.data);

                bootbox.prompt({
                    title: "Seleccione el Rol del usuario",
                    inputType: 'select',
                    inputOptions: response.data,
                    callback: function (result) {
                        if (result) {
                            var roleName = $.grep(response.data, function (n, i) { return n.value === result; })[0].text;

                            $.ajax({
                                type: "PUT",
                                url: routeConfig.Security_AddUserToRole + '/' + roleName,
                                data: JSON.stringify(data[3]),
                                contentType: 'application/json',
                                success: function (response) {
                                    toastr.success(response.result, '', { timeOut: 2000 });
                                    usersTable.draw();
                                }
                            });
                        }
                    }
                });
            },
            error: function (response) {
                console.log(response);
            },
            failure: function (response) {
                console.log(response);
            }
        });
    });
    $('#users-list tbody').on('click', 'button.remove', function (e) {
        e.preventDefault();

        var row = usersTable.row($(this).parents('tr'));
        var data = row.data();
        console.log("remove:" + data[0] + " email is: " + data[1]);

        bootbox.confirm("¿Quitar roles al usuario?", function (result) {
            if (result) {
                console.log("Quitar");
                $.ajax({
                    type: "DELETE",
                    url: routeConfig.Security_RemoveUserRoles + '/' + data[3],
                    success: function (response) {
                        toastr.success(response.result, '', { timeOut: 2000 });
                        usersTable.draw();
                    }
                });
            }
        });
    });
    $('#users-list tbody').on('click', 'button.delete', function (e) {
        e.preventDefault();

        var row = usersTable.row($(this).parents('tr'));
        var data = row.data();
        console.log("delete:" + data[0] + " email is: " + data[1]);

        bootbox.confirm("¿Eliminar al usuario?", function (result) {
            if (result) {
                console.log("Eliminar");
                $.ajax({
                    type: "DELETE",
                    url: routeConfig.Security_DeleteUser + '/' + data[3],
                    success: function (response) {
                        toastr.success(response.result, '', { timeOut: 2000 });
                        usersTable.draw();
                    }
                });
            }
        });
    });
}

function loadRolesManagementBehavior() {
    $('#btnDeleteRole').prop('disabled', true);
    loadRolesDropDown();

    $('#btnCreateRole').on('click', function () {
        bootbox.prompt("Introduce el nombre del Rol", function (result) {
            if (result || result.length > 0) {
                $.ajax({
                    type: "POST",
                    url: routeConfig.Security_CreateRole + '/' + result,
                    success: function (response) {
                        toastr.success(response.result, '', { timeOut: 2000 });
                        loadRolesDropDown();
                    }
                });
            }
        });
    });

    $('#btnDeleteRole').on('click', function () {
        var selectedRole = $("#Roles").find(":selected").text();

        bootbox.confirm("¿Eliminar el rol de usuario?", function (result) {
            if (result) {
                $.ajax({
                    type: "DELETE",
                    url: routeConfig.Security_DeleteRole + '/' + selectedRole,
                    success: function (response) {
                        toastr.success(response.result, '', { timeOut: 2000 });
                        loadRolesDropDown();
                        usersTable.draw();
                    },
                    error: function (response) {
                        console.log(response);
                    },
                    failure: function (response) {
                        console.log(response);
                    }
                });
            }
        });
    });

    $('#Roles').on('change', function () {
        var selectedRole = $(this).find(":selected").text();
        if (!selectedRole) {
            $('#btnDeleteRole').prop('disabled', true);
        }
        else {
            $('#btnDeleteRole').prop('disabled', false);
        }
        loadPermissionsTable(selectedRole);
    });

    loadPermissionsTable("");
}

function loadRolesDropDown() {
    var select = $('#Roles');
    select.html("");

    $.ajax({
        type: "GET",
        url: routeConfig.Security_GetRolesList,
        success: function (response) {
            console.log(response);
            var select = $('#Roles');
            $.each(response.data, function (i, role) {
                $('<option>', {
                    value: role.value
                }).html(role.text).appendTo(select);
            });
        },
        error: function (response) {
            console.log(response);
        },
        failure: function (response) {
            console.log(response);
        }
    });

    loadPermissionsTable("");
}

function loadPermissionsTable(roleName) {
    var checkboxes = $('#table-permissions tbody tr td  input[type=checkbox]');

    if (roleName) {
        var permissions;
        $.ajax({
            type: "GET",
            url: routeConfig.Security_GetPermissions + '/' + roleName,
            success: function (response) {
                permissions = response;
            },
            complete: function (data) {
                if (permissions) {
                    $.each(checkboxes, function (index, e) {
                        console.log($(e));
                        var key = $(e).data("permission");
                        var permission = permissions.getProp(key);
                        $(e).prop('checked', permission.succeeded);
                        $(e).prop('disabled', false);
                    });
                } else {
                    checkboxes.prop('disabled', true);
                    checkboxes.prop('checked', false);
                }
            },
            error: function (response) {
                console.log(response);
            },
            failure: function (response) {
                console.log(response);
            }
        });

        checkboxes.unbind().on('change', function () {
            console.log(roleName);
            console.log($(this));
            console.log($(this).prop('checked'));
            var permissionsModel = {
                roleName: roleName,
                name: $(this).data("permission"),
                isActive: $(this).prop('checked')
            };
            $.ajax({
                type: "PUT",
                url: routeConfig.Security_SetPermission,
                contentType: 'application/json',
                data: JSON.stringify(permissionsModel),
                success: function (response) {
                    toastr.success(response.result, '', { timeOut: 2000 });
                },
                error: function (response) {
                    console.log(response);
                },
                failure: function (response) {
                    console.log(response);
                }
            });
        });
    }
    else {
        checkboxes.prop('disabled', true);
    }
}

function loadSyncUsersBehavior() {
    $('#syncUsers').on('click', function () {
        var button = $(this);
        bootbox.confirm({
            message: "Se van a sincronizar los usuarios del directorio activo",
            buttons: {
                confirm: {
                    label: 'Aceptar',
                    className: 'btn-primary'
                },
                cancel: {
                    label: 'Cancelar',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                buttonInactive(button);
                if (result) {
                    $.ajax({
                        type: "GET",
                        url: routeConfig.Security_SyncUsers,
                        success: function (response) {
                            toastr.success('<strong>Completado!</strong>', '', { timeOut: 4000 });
                            window.location.reload();
                        },
                        error: function (response) {
                            toastr.error('<strong>Se ha producido un error!</strong>', '', { timeOut: 4000 });
                        },
                        failure: function (response) {
                            toastr.error('<strong>Se ha producido un error!</strong>', '', { timeOut: 4000 });
                        }
                    });
                } else {
                    buttonActive(button);
                }
            }
        });
    });
}

