var table = null;
var operations = [];
var firstRun = false;
var rows_selected = [];

window.columnsTableOperationsDefs = [
    {
        'targets': 0,
        'searchable': false,
        'orderable': false,
        'width': '1%',
        'className': 'dt-body-center',
        'render': function (data, type, full, meta) {
            var lifeCycle = full[13] == "Si" || full[14] == "Si";
            var disabled = (parseInt(full[9]) !== 12 || lifeCycle) ? "disabled" : "";
            var operationtype = full[10];
            var producttype = full[11];

            var found = operations.find(
                function (elem) {
                    return elem[0] === data;
                }
            );

            if (found != undefined) {
                var index = operations.indexOf(found);
            }

            return "<input type='checkbox' id='" + data + "' " + disabled + " data-operationtype=" + operationtype + " data-producttype=" + producttype + ">";
        },
        'data': '8'
    },
    {
        'targets': [9],
        "searchable": false,
        "orderable": false
    }
]

window.columnsTableOperations = [
    { "data": "0", "autoWidth": true, "orderable": false },
    {
        "data": "1", "autoWidth": true, "orderable": true,
        "render": function (data) { return formatDateTime(data); }
    },
    { "data": "2", "autoWidth": true, "orderable": false },
    {
        "data": "3",
        "orderable": false,
        "render": function (data, type, full, meta) {
            return "<span>" + data + "  </span><button type='button' class='btn btn-secundary btn-sm' title='Ver resto de titulares'><span class='fas fa-users'></span></button>";
        }
    },
    { "data": "4", "autoWidth": true, "orderable": false },
    { "data": "5", "autoWidth": true, "orderable": false },
    { "data": "6", "autoWidth": true, "orderable": false },
    { "data": "7", "autoWidth": true, "orderable": false },
    { "data": "8", "autoWidth": true, "orderable": false },
    {
        "orderable": false,
        "render": function (data, type, full, meta) {
            var result = "<div class='row'>";
            var allowValidate = full[15] == 'true';
            var status = full[9];

            if (parseInt(status) === parseInt('14')) {
                result = result + (allowValidate == true ? "<div class='col-md-4'><button type='button' class='btn btn-success btn-sm' title='Validar blanqueo de capitales'><span class='fas fa-alert'></span></button></div>" : "");
            } else {
                result = result + "<div class='col-md-4'><button type='button' class='btn btn-warning btn-sm' title='Modificar operación'><span class='fas fa-edit'></span></button></div>";
            }

            result = result + "<div class='col-md-4'><button type='button' class='btn btn-info btn-sm btn-show-documents' title='Ver documentos'><span class='fas fa-file-alt'></span></button></div>";

            return result + "</div>";
        }
    },
    {
        "data": "12", "autoWidth": true, "orderable": false,
        "render": function (data) { return formatDateTime(data); }
    },
    {
        "data": "0",
        "orderable": false,
        "render": function (data, type, full, meta) {
            var url = routeConfig.Details_Index + "?requestID=" + data;
            var template = "<a href='#URL#'>Consultar</a>";
            return template.replace("#URL#", url);
        }
    },
    { "data": "13", "autoWidth": true, "orderable": false },
    { "data": "14", "autoWidth": true, "orderable": false },
    { "data": "18", "autoWidth": true, "orderable": false },

]


function ManageAcceptOperation(id, accepted) {
    $.ajax({
        type: "POST",
        url: routeConfig.Operations_SolveRequestStatusOperation,
        data: { requestID: id, accepted: accepted },
        error: function (xhr, status, error) {
            toastr.error('Se ha producido un error al modificar la operación', '', { timeOut: 3000 });
        },
        success: function (response) {
            if (response) {
                toastr.success('La operación de ha modificado correctamente', '', { timeOut: 3000 });

                setTimeout(function () {
                    location.reload();
                }, 1000);
            }
            else {
                toastr.error('Se ha producido un error al modificar la operación', '', { timeOut: 3000 });
            }
        }
    });
}

function loadButtonsBehavior() {
    $('#btnClearFilter').on('click', function () {
        $('#filterForm input').val('');
        $.each($('#filterForm select'), function () {
            $(this).find('option:eq(0)').prop('selected', true);
        });
    });

    $('#btnClearOperations').on('click', function () {
        bootbox.confirm("Se van a perder las operaciones seleccionadas", function (result) {
            if (result) {
                operations = [];
                $('#operation-count').text(operations.length == 0 ? '' : operations.length);
                $('#btnClearOperations').hide();
                loadSearchResultsTable(event);
            }
        });
    });
}

function fixDatatableStyles() {
    $('ul.pagination li').removeClass("paginate_button");
}

function CreateStatusOperation(btnClicked) {
    var $form = $(btnClicked).parents('form');
    buttonInactive($(btnClicked));
    $.ajax({
        type: "POST",
        url: $form.attr('action'),
        data: $form.serialize(),
        error: function (xhr, status, error) {
            toastr.error('Se ha producido un error al modificar la operación', '', { timeOut: 3000 });
            $('#ObservacionesModal').modal('hide');
        },
        success: function (response) {
            if (response.result) {
                toastr.success('La operación de ha modificado correctamente', '', { timeOut: 3000 });

                setTimeout(function () {
                    location.reload();
                }, 1000);
            }
            else {
                toastr.error('Se ha producido un error al modificar la operación', '', { timeOut: 3000 });
            }

            $('#ObservacionesModal').modal('hide');
        }
    }).always(function () {
        buttonActive($(btnClicked));
    });

    return false;
}

function CreateFileOperations(btnClicked) {
    var $form = $(btnClicked).parents('form');
    buttonInactive($(btnClicked));
    $.ajax({
        type: "POST",
        url: $form.attr('action'),
        data: $form.serialize(),
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                window.location = routePrefix + "/home/index";
            } else {
                toastr.error('Se ha producido al generar el fichero', '', { timeOut: 3000 });
                $('#ShowInfoModal').modal('hide');
            }
        },
        success: function (response) {
            if (response.result) {
                toastr.success('El fichero se ha generado correctamente', '', { timeOut: 3000 });

                setTimeout(function () {
                    location.reload();
                }, 1000);
            }
            else {
                toastr.error('Se ha producido al generar el fichero', '', { timeOut: 3000 });
            }

            //buttonActive(button);
            $('#ShowInfoModal').modal('hide');
        }
    }).always(function () {
        buttonActive($(btnClicked));
    });

    return false;
}

function updateDataTableSelectAllCtrl(table) {
    var $table = table.table().node();
    var $chkbox_all = $('tbody input[type="checkbox"]', $table);
    var $chkbox_checked = $('tbody input[type="checkbox"]:checked', $table);
    var chkbox_select_all = $('thead input[name="select_all"]', $table).get(0);

    // If none of the checkboxes are checked
    if ($chkbox_checked.length === 0) {
        chkbox_select_all.checked = false;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }

        // If all of the checkboxes are checked
    } else if ($chkbox_checked.length === $chkbox_all.length) {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }

        // If some of the checkboxes are checked
    } else {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = true;
        }
    }
}

function loadSearchResultsTable(event) {
    event.preventDefault();
    $("#searchLoader").show();
    $("#searchResult").hide();

    if ($.fn.dataTable.isDataTable('#request-list')) {
        table.destroy();
        table = getTable();
    } else {
        table = getTable();
    }

    $('#filterForm .dt-buttons a').attr("role", "button");
    $('#filterForm .dt-buttons a').prepend("<span class='fas fa-download-alt'></span>");
}

function SendSignatureReplay(btnClicked) {
    var $form = $(btnClicked).parents('form');
    buttonInactive($(btnClicked));
    $.ajax({
        type: "POST",
        url: $form.attr('action'),
        data: $form.serialize(),
        error: function (xhr, status, error) {
            toastr.error('Se ha producido un error al enviar el recordatorio de firma', '', { timeOut: 3000 });
            $('#ShowSignatureStatusModal').modal('hide');
        },
        success: function (response) {
            if (response.result) {
                toastr.success('Se ha envíado el recordatorio de firma', '', { timeOut: 3000 });
            }
            else {
                toastr.error('Se ha producido un error al enviar el recordatorio de firma', '', { timeOut: 3000 });
            }

            $('#ShowSignatureStatusModal').modal('hide');
        }
    }).always(function () {
        buttonActive($(btnClicked));
    });

    return false;
}

function getTable() {
    var formData = $('#filterForm').serializeArray();

    rows_selected = [];
    table = $('#request-list').DataTable({
        pageLength: 25,
        lengthMenu: [10, 25, 50],
        bServerSide: true,
        sAjaxSource: routeConfig.Operations_LoadDataTable,
        sServerMethod: "POST",
        fnServerParams: function (aoData) {
            for (var i = 0; i < formData.length; i++) {
                var multiplevalues = formData[i].name.includes('[');

                if (!multiplevalues) {
                    aoData.push(formData[i]);
                }
            }
        },
        bProcessing: true,
        rowCallback: function (row, data, dataIndex) {
            // Get row Id
            var rowId = data[0];

            // If row Id is in the list of selected row IDs
            if ($.inArray(rowId, rows_selected) !== -1) {
                $(row).find('input[type="checkbox"]').prop('checked', true);
                $(row).addClass('selected');
            }
        },
        fixedColumns: true,
        order: [[1, 'desc']],
        filter: false,

        'columnDefs': columnsTableOperationsDefs,

        "columns": columnsTableOperations,

        "drawCallback": function (settings) {
            console.log('datatable finish')
            operations.forEach(function (elem) {
                var ckbox = $('#' + elem[0]);
                if (ckbox != undefined) {
                    ckbox.click();
                }
            });
        }
    });

    if (!firstRun) {
        // Handle click on checkbox
        $('#request-list tbody').on('click', 'input[type="checkbox"]', function (e) {
            var $row = $(this).closest('tr');

            // Get row data
            var data = table.row($row).data();

            // Get row Id
            var rowId = data[0];

            // Determine whether row Id is in the list of selected row IDs
            var index = $.inArray(rowId, rows_selected);

            // If checkbox is checked and row Id is not in list of selected row IDs
            if (this.checked && index === -1) {
                rows_selected.push(rowId);
                // Otherwise, if checkbox is not checked and row Id is in list of selected row IDs
            } else if (!this.checked && index !== -1) {
                rows_selected.splice(index, 1);
            }

            if (this.checked) {
                $row.addClass('selected');
                AddOperationDataToProccess(data);
            } else {
                $row.removeClass('selected');
                RemoveOperationDataToProccess(data);
            }

            // Update state of "Select all" control
            updateDataTableSelectAllCtrl(table);

            // Prevent click event from propagating to parent
            e.stopPropagation();
        });

        // Handle click on "Select all" control
        $('thead input[name="select_all"]', table.table().container()).on('click', function (e) {
            if (this.checked) {
                $('#request-list tbody input[type="checkbox"]:not(:checked)').trigger('click');
            } else {
                $('#request-list tbody input[type="checkbox"]:checked').trigger('click');
            }

            // Prevent click event from propagating to parent
            e.stopPropagation();
        });

        // Handle table draw event
        table.on('draw', function () {
            // Update state of "Select all" control
            updateDataTableSelectAllCtrl(table);
        });

        // Handle form submission event
        $('#request-list').on('submit', function (e) {
            var form = this;

            // Iterate over all selected checkboxes
            $.each(rows_selected, function (index, rowId) {
                // Create a hidden element
                $(form).append(
                    $('<input>')
                        .attr('type', 'hidden')
                        .attr('name', 'id[]')
                        .val(rowId)
                );
            });
        });

        $('#request-list tbody').on('click', '.btn-secundary', function (e) {
            e.preventDefault();
            var data = table.row($(this).parents('tr')).data();
            var url = $('#TitularesModal').data('url');
            url = url + "?requestID=" + data[0];
            $.get(url, function (data) {
                $('#TitularesModal').html(data);
                $('#TitularesModal').modal('show');
            });
        });

        $('#request-list tbody').on('click', '.btn-warning', function (e) {
            e.preventDefault();
            var data = table.row($(this).parents('tr')).data();
            var url = $('#ObservacionesModal').data('url');
            url = url + "?requestID=" + data[0];
            $.get(url, function (data) {
                $('#ObservacionesModal').html(data);
                $('#ObservacionesModal').modal('show');
            });
        });

        $('#request-list tbody').on('click', '.btn-show-documents', function (e) {
            e.preventDefault();
            var data = table.row($(this).parents('tr')).data();
            var id = data[0];

            $.ajax({
                type: "POST",
                url: routeConfig.Operations_ShowDocuments,
                data: { requestID: id },
                error: function (xhr, status, error) {                    
                    if (xhr.status === 410) {
                        toastr.warning('Los documentos no están disponibles. El host es antiguo y los documentos han expirado.', '', { timeOut: 5000 });
                    } else {
                        toastr.error('Se ha producido un error al mostrar la información', '', { timeOut: 3000 });
                    }
                },
                success: function (response) {
                    $('#ShowDocumentsModal').html(response);
                    $('#ShowDocumentsModal').modal('show');
                }
            });
        });

        $('#request-list tbody').on('click', '.btn-success', function (e) {
            e.preventDefault();

            var data = table.row($(this).parents('tr')).data();
            var id = data[0];

            bootbox.dialog({
                title: 'Aceptar operación',
                message: "<p>¿Quiere aceptar o rechazar la solicitud?</p>",
                buttons: {
                    cancel: {
                        label: "Rechazar",
                        className: 'btn-danger',
                        callback: function () {
                            ManageAcceptOperation(id, false);
                        }
                    },
                    ok: {
                        label: "Aceptar",
                        className: 'btn-success',
                        callback: function () {
                            ManageAcceptOperation(id, true);
                        }
                    }
                }
            });
        });

        $('#OpGenerateAndPrint').on('click', function (e) {
            e.preventDefault();
            var $table = table.table().node();
            var $chkbox_checked = $('tbody input[type="checkbox"]:checked', $table);
            var date = $('#FVliquidativo').val();

            var currentUri = window.location.href;
            var lastSegmentUri = currentUri.split('/').pop();
            var isPeriodic = lastSegmentUri.toLowerCase() == 'periodicsoperations';

            var ids = [];
            var producttypes = [];
            var operationtypes = [];
            var fundsIds = [];
            var statusTypes = [];
            var firstProductType;
            var firstOperationType;
            var firstFund;
            //var firstStatus;
            var valid = true;
            var button = $(this);

            operations.forEach(function (elem) {
                ids.push(elem[0]);
                operationtypes.push(elem[10]);
                producttypes.push(elem[11]);
                fundsIds.push(elem[17]);
                statusTypes.push(elem[9]);
            });

            if (ids.length === 0) {
                valid = false;
                toastr.error('Debe seleccionar las operaciones', '', { timeOut: 3000 });
            }

            if (ids.length > 250) {
                valid = false;
                toastr.error('Solo puedes seleccionar 250 registros', '', { timeOut: 3000 });
            }

            if (producttypes.length > 0) {
                firstProductType = producttypes[0];
            }

            var producttypesok = producttypes.every(function (elem) {
                return elem === firstProductType;
            });

            if (operationtypes.length > 0) {
                firstOperationType = operationtypes[0];
            }

            var operationtypeok = operationtypes.every(function (elem) {
                return elem === firstOperationType;
            });

            if (fundsIds.length > 0) {
                firstFund = fundsIds[0];
            }

            //COMPROBAR QUE TODOS LOS ESTADOS SEAN PENDIENTE
            var statustypeok = statusTypes.every(function (elem) {
                return parseInt(elem) === 12;
            });

            if (!producttypesok) {
                valid = false;
                toastr.error('Debe seleccionar el mismo tipo de producto', '', { timeOut: 3000 });
            }

            if (!operationtypeok) {
                valid = false;
                toastr.error('Debe seleccionar el mismo tipo de operación', '', { timeOut: 3000 });
            }

            if (!statustypeok && !isPeriodic) {
                valid = false;
                toastr.error('El estado de las operaciones debe ser pendiente', '', { timeOut: 3000 });
            }

            if (date === '' && valid) {
                if (parseInt(firstOperationType) !== 3 && parseInt(firstOperationType) !== 8 && parseInt(firstOperationType) !== 4) {
                    valid = false;
                    toastr.error('Debe seleccionar la fecha valor liquidativo', '', { timeOut: 3000 });
                }
            } else {                
                var momentdate = moment(date, 'YYYY-MM-DD');

                if (!momentdate.isValid()) {
                    valid = false;
                    toastr.error('La fecha introducida no es correcta', '', { timeOut: 3000 });
                }
            }

            if (valid) {
                buttonInactive(button);
                $.ajax({
                    type: "POST",
                    url: routeConfig.Operations_ShowInfo,
                    data: { LiquidativeDate: date, RequestIds: ids, GenerateFile: true },
                    error: function (xhr, status, error) {
                        toastr.error('Se ha producido al mostrar la información', '', { timeOut: 3000 });
                    },
                    success: function (response) {
                        $('#ShowInfoModal').html(response);
                        $('#ShowInfoModal').modal('show');
                    }
                }).always(function () {
                    buttonActive(button);
                });
            }
        });

        $('#OpPrint').on('click', function (e) {
            e.preventDefault();
            var $table = table.table().node();
            var $chkbox_checked = $('tbody input[type="checkbox"]:checked', $table);

            var ids = [];
            var valid = true;
            var button = $(this);

            ids = ids.concat(operations);

            if (ids.length === 0) {
                valid = false;
                toastr.error('Debe seleccionar las operaciones', '', { timeOut: 3000 });
            }

            if (valid) {
                buttonInactive(button);
                $.ajax({
                    type: "POST",
                    url: routeConfig.Operations_ShowInfo,
                    data: { RequestIds: ids, GenerateFile: false },
                    error: function (xhr, status, error) {
                        toastr.error('Se ha producido al mostrar la información', '', { timeOut: 3000 });
                    },
                    success: function (response) {
                        $('#ShowInfoModal').html(response);
                        $('#ShowInfoModal').modal('show');
                    }
                }).always(function () {
                    buttonActive(button);
                });
            }
        });

        table.on('xhr', function (e, settings, json) {
            $("#searchResult").show();
            $("#searchLoader").hide();
        });
    }

    firstRun = true;

    return table;
}

function AddOperationDataToProccess(data) {
    var exists = operations.some(
        function (elem) {
            return elem[0] === data[0];
        }
    );

    if (!exists) {
        operations.push(data);
        $('#operation-count').text(operations.length == 0 ? '' : operations.length);
        $('#btnClearOperations').show();
    }
}

function RemoveOperationDataToProccess(data) {
    var found = operations.find(
        function (elem) {
            return elem[0] === data[0];
        }
    );

    if (found != undefined) {
        var index = operations.indexOf(found);
        operations.splice(index, 1);
        $('#operation-count').text(operations.length == 0 ? '' : operations.length);
        if (operations.length == 0) {
            $('#btnClearOperations').hide();
        }
    }
}

$(document).ready(function () {
    loadButtonsBehavior();
});