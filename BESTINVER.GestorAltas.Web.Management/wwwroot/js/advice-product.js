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
            var statusId = parseInt(full[9]);

            return "<input type='checkbox' id='" + data + "'>";
        },
        'data': '8'
    },
    {
        'targets': [7],
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
            return "<span>" + data + "</span><button type='button' class='btn btn-secundary btn-sm' title='Ver resto de titulares'><span class='fas fa-users'></span></button>";
        }
    },
    { "data": "4", "autoWidth": true, "orderable": false },
    { "data": "5", "autoWidth": true, "orderable": false },
    {
        "data": "6", "autoWidth": true, "orderable": false,
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
];

$(document).on('click', '#btnSendPreviousDocumentation', function (e) {
    e.preventDefault();
    var url = $(this).data('url');
    $.get(url, function (data) {
        $('#SendPreviousDocumentationModal').html(data);
        $('#SendPreviousDocumentationModal').modal('show');
        setCleaveClasses();
    });
});

$(document).on('click', '#btnSearchClient', function (e) {
    $("#resultSearch").html('');
    var dniSearch = $("#dniSearch").val();
    if (fn_ValidateDni(dniSearch)) {
        e.preventDefault();
        var url = routePrefix + '/AdviceProduct/SearchAccount';
        var fcrFund = {
            dni: dniSearch
        };
        e.target.disabled = true;
        e.target.textContent = "Buscando...";

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(fcrFund),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc,
            complete: function () {
                e.target.disabled = false;
                e.target.textContent = "Buscar";
            }
        });
    }
    else {
        if ($.fn.dataTable.isDataTable('#tblResultAccounts')) {
            tblResultAccounts.destroy();
        }

        $('#tblResultAccounts').addClass('d-none');
    }
});

var tblResultAccounts = null;

function successFunc(data) {
    if (data.status) {
        switch (data.status) {
            case 'success':
                var url = $('#tblResultAccounts').attr('action-url');
                url = url + "?idAccount=" + data.idAccount + "&documentNumber=" + data.documentNumber + "&customerFullName=" + data.customerFullName
                $.get(url, function (data) {
                    $('#GenerateAdviceModal').html(data);
                    $('#GenerateAdviceModal').modal('show');
                    setCleaveClasses();
                }).fail(function () {
                    $("#resultSearch").html("<div class='form-group col-md-11 alert alert-danger mx-4'><span>Hubo un error al cargar los datos. Intenta nuevamente.</span></div>");
                });

                $('#SendPreviousDocumentationModal').modal('hide');
                break;

            case 'error_minor':
                $("#resultSearch").html("<div class='form-group col-md-11 alert alert-danger mx-4'><span>El cliente es menor de edad y no se pueden hacer asesoramientos sobre él.</span></div>");
                break;

            case 'error_not_person':
                $("#resultSearch").html("<div class='form-group col-md-11 alert alert-danger mx-4'><span>No se pueden hacer asesoramientos a personas no físicas.</span></div>");
                break;

            case 'error_pending_request':
                $("#resultSearch").html("<div class='form-group col-md-11 alert alert-danger mx-4'><span>El cliente ya tiene una operación de asesoramiento pendiente de firmar. Si quiere hacer una nueva, antes debe de cancelar la que está en curso.</span></div>");
                break;

            case 'error_no_account':
                $("#resultSearch").html("<div class='form-group col-md-11 alert alert-danger mx-4'><span>El cliente no tiene ninguna cuenta en la que sea titular, por lo que no disponemos de su test de conocimiento. Hay que realizar un alta asistida.</span></div>");
                break;

            default:
                $("#resultSearch").html("<div class='form-group col-md-11 alert alert-danger mx-4'><span>Ocurrió un error. Intenta nuevamente.</span></div>");
                break;
        }
    } else {
        $("#resultSearch").html("<div class='form-group col-md-11 alert alert-danger mx-4'><span>Ocurrió un error inesperado.</span></div>");
    }
}

function errorFunc() {
    if ($.fn.dataTable.isDataTable('#tblResultAccounts')) {
        tblResultAccounts.destroy();
    }

    $('#tblResultAccounts').addClass('d-none');

    $("#resultSearch").html("<div class='form-group col-md-12'><span> No se ha encontrado el cliente </span></div>");
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

function getTable() {
    var formData = $('#filterForm').serializeArray();

    rows_selected = [];
    table = $('#request-list').DataTable({
        pageLength: 25,
        lengthMenu: [10, 25, 50],
        bServerSide: true,
        sAjaxSource: routeConfig.AdviceProduct_LoadDataTable,
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

        $('#request-list tbody').on('click', '.btn-info', function (e) {
            e.preventDefault();
            var data = table.row($(this).parents('tr')).data();
            var id = data[0];

            $.ajax({
                type: "POST",
                url: routeConfig.Operations_ShowDocuments,
                data: { requestID: id },
                error: function (xhr, status, error) {
                    toastr.error('Se ha producido al mostrar la información', '', { timeOut: 3000 });
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
                    url: routeConfig.AdviceProduct_LoadDataTable,
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
                    url: routeConfig.AdviceProduct_LoadDataTable,
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

        $('#request-list tbody').on('click', '.btn-primary', function (e) {
            e.preventDefault();
            var data = table.row($(this).parents('tr')).data();
            var url = $('#ShowSignatureStatusModal').data('url');
            url = url + "?requestID=" + data[0];
            $.get(url, function (data) {
                $('#ShowSignatureStatusModal').html(data);
                $('#ShowSignatureStatusModal').modal('show');
            });
        });

        table.on('xhr', function (e, settings, json) {
            $("#searchResult").show();
            $("#searchLoader").hide();
        });
    }

    firstRun = true;

    return table;
}

function searchTableButtonBehaviour() {
    $(document).on('click', '#tblResultAccounts tbody button', function (e) {
        e.preventDefault();

        var idAccount = $(this).data('accountid');
        var url = $(this).data('url');
        url = url + "?idAccount=" + idAccount;
        $.get(url, function (data) {
            $('#GenerateAdviceModal').html(data);
            $('#GenerateAdviceModal').modal('show');
            setCleaveClasses();
        });

        $('#SendPreviousDocumentationModal').modal('hide');
    });
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


function fn_ValidateDate(dateText) {
    $("#dateError").html("");
    var date = new Date(dateText.value);
    var today = new Date;
    today.setHours(0, 0, 0, 0);
    if (date < today) {
        $("#dateError").removeAttr('hidden');
        $("#dateError").html("<span class='alert alert-danger'>La fecha de inicio no puede ser menor a la de hoy</span>");
        return false;
    }

    return true;
}

function fn_ValidateDni(dni) {
    $("#dniError").html("");
    if (dni.trim() != null && dni.trim() != "") {
        return true;
    }
    $("#dniError").removeAttr('hidden');
    $("#dniError").html("<span class='alert alert-danger'>Debe introducir un DNI</span>");
    return false;
}

function loadButtonsBehavior() {
    $('#btnClearFilter').on('click', function () {
        $('#filterForm input').val('');
        $.each($('#filterForm select'), function () {
            $(this).find('option:eq(0)').prop('selected', true);
        });
    });

}

function loadButton(text) {
    var button = $("#modalButton button:first-child");
    var spinner = '<i id="font-spinner" class="fas fa-spin fa-spinner"></i>';
    button.prop('textContent', ' ' + text);
    button.prop('disabled', true);
    button.prepend(spinner);
}

function fn_ValidateInputFiles(inputFiles) {
    $("#fileError").html("");
    for (var i = 0; i < inputFiles.length; i += 2) {
        var fileInput1 = inputFiles[i];
        var fileInput2 = inputFiles[i + 1];
        var file1 = fileInput1.files[0];
        var file2 = fileInput2.files[0];

        var file1Empty = !file1 || file1.size === 0;
        var file2Empty = !file2 || file2.size === 0;

        if ((file1Empty && !file2Empty && file2) || (!file1Empty && file1 && file2Empty)) {
            var messagge = 'Es necesario ambos archivos o no adjuntar archivos por applicant.';
            $("#fileError").removeAttr('hidden');
            $("#fileError").html("<span class='alert alert-danger'>" + messagge + "</span>");

            return false;
        }
    }
    return true;
}

function fn_ValidateFileExceedSizeAndFileType(inputFiles, fileType) {
    $("#fileError").html("");
    for (var i = 0; i < inputFiles.length; i += 1) {
        var input = inputFiles[i];

        if (input.files.length > 0) {
            var inputFile = input.files[0];
            var inputFileType = inputFile.type.split("/")[0];

            if (inputFileType === "application") {
                inputFileType = inputFile.type.split("/")[1];
            }
            if (inputFileType === '') {
                inputFileType = inputFile.name.substr(inputFile.name.lastIndexOf('.') + 1);
            }

            if (inputFileType === fileType) {
                if (inputFile.size > maxPdfUploadSize) {
                    var maxSizeMB = maxPdfUploadSize / (1024 * 1024);
                    var message = 'Revisa el tamaño de los archivos. No puede ser superior a ' + maxSizeMB + 'MB';
                    $("#fileError").removeAttr('hidden');
                    $("#fileError").html("<span class='alert alert-danger'>" + message.replace("ñ", "&ntilde;") + "</span>");
                    return false
                }
            } else {
                $("#fileError").removeAttr('hidden');
                $("#fileError").html("<span class='alert alert-danger'>Hay un documento adjunto incorrecto.</span>");
                return false;
            }
        }
    }

    return true;
}

function onChangeConditions(input) {
    if (input.checked) {
        $('#sendDocumentation button[type=submit]').prop('disabled', false);
    } else {
        $('#sendDocumentation button[type=submit]').prop('disabled', true);
    }
}

function openModal(requestId, idAccount, documentNumber, customerFullName) {
    $.get('/AdviceProduct/ShowAttachmentDocumentsModal', {
        requestID: requestId,
        idAccount: idAccount,
        documentNumber: documentNumber,
        customerFullName: customerFullName
    }, function (data) {
        $('#GenerateAdviceModal').html(data);
        $('#GenerateAdviceModal').modal('show');
    }).fail(function () {
        alert('Ocurrió un error al cargar el contenido del modal.');
    });
}

$(document).ready(function () {
    loadButtonsBehavior();
});