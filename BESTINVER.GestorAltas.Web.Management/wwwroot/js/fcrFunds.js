var table = null;
var operations = [];
var firstRun = false;
var rows_selected = [];

routeConfig.Operations_LoadDataTable = routeConfig.FCRFunds_LoadDataTable;
routeConfig.Operations_SolveRequestStatusOperation = routeConfig.FCRFunds_SolveRequestStatusOperation;
routeConfig.Operations_ShowInfo = routeConfig.FCRFunds_ShowInfo;
routeConfig.Operations_ShowDocuments = routeConfig.FCRFunds_ShowDocuments;

window.columnsTableOperationsDefs = [
    {
        'targets': 0,
        'searchable': false,
        'orderable': false,
        'width': '1%',
        'className': 'dt-body-center',
        'render': function (data, type, full, meta) {
            var statusId = parseInt(full[9]);
            var operationtype = parseInt(full[10]);
            var statusInput = (statusId === 24) || (statusId === 23 && operationtype === 10) ? "" : "disabled";
            var producttype = full[11];

            return "<input type='checkbox' id='" + data + "' " + statusInput + " data-operationtype=" + operationtype + " data-producttype=" + producttype + ">";
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
    { "data": "1", "autoWidth": true, "orderable": true, "render": function (data) { return formatDateTime(data); } },
    { "data": "2", "autoWidth": true, "orderable": false },
    {
        "data": "3",
        "orderable": false,
        "render": function (data, type, full, meta) {
            return "<span>" + data + "  </span><button type='button' class='btn btn-secundary btn-sm' title='Ver resto de titulares'><span class='fas fa-users'></span></button>";
        }
    },
    { "data": "6", "autoWidth": true, "orderable": false },
    { "data": "7", "autoWidth": true, "orderable": false },
    { "data": "12", "autoWidth": true, "orderable": false, "render": function (data) { return formatDateTime(data); } },
    {
        "data": "0",
        "orderable": false,
        "render": function (data, type, full, meta) {
            var url = routeConfig.Details_Index + "?requestID=" + data;
            var template = "<a href='#URL#'>Consultar</a>";
            return template.replace("#URL#", url);
        }
    },
]

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
        var url = routePrefix + '/FCRFunds/SearchAccount';
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
    if ($.fn.dataTable.isDataTable('#tblResultAccounts')) {
        tblResultAccounts.destroy();
    }

    var url = $('#tblResultAccounts').attr('action-url');
    tblResultAccounts = $('#tblResultAccounts').DataTable({
        fixedColumns: true,
        filter: false,
        data: data,
        language: {
            "emptyTable": "No se han encontrado cuentas"
        },
        columns: [
            { "data": "accountid", "autoWidth": true, "orderable": false },
            {
                "data": "owners", "autoWidth": true, "orderable": false,
                "render": function (data) {
                    var c = "";
                    $.each(data, function (k, v) {
                        c = c + '<strong>' + k + '</strong>: ' + v + '<br>';
                    });
                    return c;
                }
            },
            {
                "data": "accountid",
                "render": function (data) {
                    return '<button type="button" class="btn btn-outline-secondary" data-url="' + url + '" data-accountid="' + data + '" >Elegir cuenta</button>';
                }
            }
        ],
    });

    $('#tblResultAccounts').removeClass('d-none');

    searchTableButtonBehaviour();
}
function errorFunc() {
    if ($.fn.dataTable.isDataTable('#tblResultAccounts')) {
        tblResultAccounts.destroy();
    }

    $('#tblResultAccounts').addClass('d-none');

    $("#resultSearch").html("<div class='form-group col-md-12'><span> No se ha encontrado el cliente </span></div>");
}

function searchTableButtonBehaviour() {
    $(document).on('click', '#tblResultAccounts tbody button', function (e) {
        e.preventDefault();

        var idAccount = $(this).data('accountid');
        var url = $(this).data('url');
        url = url + "?idAccount=" + idAccount;
        $.get(url, function (data) {
            $('#fcrFundModal').html(data);
            $('#fcrFundModal').modal('show');
            setCleaveClasses();
        });

        $('#SendPreviousDocumentationModal').modal('hide');
    });
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

function fn_ValidateAmount(amountText, aditionalMin) {
    $("#amountError").html("");
    var isAdviceChecked = $('#adviceCheckbox').prop('checked');
    if (isAdviceChecked) {
        aditionalMin = Math.min(parseFloat(aditionalMin), 10000);
    }
    if (amountText.value != null && amountText.value != "") {
        var amountReplace = amountText.value.replace(",", ".");
        var regexp = new RegExp("^[0-9]+([.][0-9]+)?$");
        if (!regexp.test(amountReplace)) {
            $("#amountError").removeAttr('hidden');
            $("#amountError").html("<span class='alert alert-danger'>El importe debe ser un numero</span>");
            return false;
        }
        if (amountReplace < parseFloat(aditionalMin)) {
            $("#amountError").removeAttr('hidden');
            $("#amountError").html("<span class='alert alert-danger'>Debe ser una cantidad de " + parseFloat(aditionalMin) + " como mínimo por titular.</span>");
            return false;
        }
        return true;
    }
    $("#amountError").removeAttr('hidden');
    $("#amountError").html("<span class='alert alert-danger'>Debe introducir una cantidad</span>");
    return false;
}
function fn_ValidateLastAdvice(lastAdvice, validAdvice) {
    $("#lastAdviceError").html("");
    if (validAdvice) {
        return true;
    }
    $("#lastAdviceError").removeAttr('hidden');
    if (lastAdvice == null || lastAdvice === "") {
        $("#lastAdviceError").html("<span class='alert alert-danger'>No existe asesoramiento anterior</span>");
    } else {
        $("#lastAdviceError").html("<span class='alert alert-danger'>El último asesoramiento es anterior a 30 días</span>");
    }
    return false;
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
    var productSelected = $('#productSelect').val();
    if (input.checked && productSelected) {
        $('#sendDocumentation button[type=submit]').prop('disabled', false);
    } else {
        $('#sendDocumentation button[type=submit]').prop('disabled', true);
    }
}

$(document).ready(function () {
    loadButtonsBehavior();
});