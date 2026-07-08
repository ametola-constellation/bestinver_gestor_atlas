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
        'targets': [9],
        "searchable": false,
        "orderable": false
    }
]

window.columnsTableOperations = [
    { "data": "0", "autoWidth": true, "orderable": false },
    { "data": "1", "autoWidth": true, "orderable": true },
    { "data": "2", "autoWidth": true, "orderable": false },
    {
        "data": "3",
        "orderable": false,
        "render": function (data, type, full, meta) {
            return "<span>" + data + "  </span><button type='button' class='btn btn-secundary btn-sm' title='Ver resto de titulares'><span class='fas fa-users'></span></button>";
        }
    },
    { "data": "4", "autoWidth": true, "orderable": false },
    { "data": "6", "autoWidth": true, "orderable": false },
    { "data": "7", "autoWidth": true, "orderable": false },
    { "data": "19", "autoWidth": true, "orderable": false },
    { "data": "20", "autoWidth": true, "orderable": false },
    { "data": "16", "autoWidth": true, "orderable": false },
    { "data": "8", "autoWidth": true, "orderable": false },
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
$(document).on('click', '#btnCreateOperation', function (e) {
    e.preventDefault();
    var url = $(this).data('url');
    $.get(url, function (data) {
        $('#CreateOperationModal').html(data);
        $('#CreateOperationModal').modal('show');
        setCleaveClasses();
    });
});

$(document).on('click', '#btnConfirmationModal', function (e) {
    e.preventDefault();
    var url = $(this).data('url');
    var idRequest = $(this).data('requestid');
    var confirmationType = $(this).data('confirmationtype');
    url = url + "?idRequest=" + idRequest + "&confirmationType=" + confirmationType;
    $.get(url, function (data) {
        $('#confirmationModal').html(data);
        $('#confirmationModal').modal('show');
        setCleaveClasses();
    });
});

$(document).on('click', '#confirmButton', function (e) {
    e.preventDefault();
    var url = $(this).data('url');
    var idRequest = $(this).data('requestid');
    url = url + "?idRequest=" + idRequest;
    window.location = url;
});


$(document).on('click', '#btnSearchClient', function (e) {
    $("#resultSearch").html('');
    var dniSearch = $("#dniSearch").val();
    if (fn_ValidateDni(dniSearch)) {
        e.preventDefault();
        var url = routePrefix + '/FCRFunds/SearchAccount';
        var periodicOperation = {
            dni: dniSearch
        };
        e.target.disabled = true;
        e.target.textContent = "Buscando...";

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(periodicOperation),
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

function loadButton(text) {
    var button = $("#modalButton button:first-child");
    var spinner = '<i id="font-spinner" class="fas fa-spin fa-spinner"></i>';
    button.prop('textContent', ' ' + text);
    button.prop('disabled', true);
    button.prepend(spinner);
}

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
            $('#operationsModal').html(data);
            $('#operationsModal').modal('show');
            setCleaveClasses();
        });

        $('#CreateOperationModal').modal('hide');
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

function fn_ValidateAmount(amountText, aditionalMin) {
    $("#monthlyAmountError").html("");
    if (amountText.value != null && amountText.value != "") {
        var amountReplace = amountText.value.replace(",", ".");
        var regexp = new RegExp("^[0-9]+([.][0-9]+)?$");
        if (!regexp.test(amountReplace)) {
            $("#monthlyAmountError").removeAttr('hidden');
            $("#monthlyAmountError").html("<span class='alert alert-danger'>El importe debe ser un numero</span>");
            return false;
        }
        if (amountReplace < parseFloat(aditionalMin)) {
            $("#monthlyAmountError").removeAttr('hidden');
            $("#monthlyAmountError").html("<span class='alert alert-danger'>Debe ser una cantidad de " + parseFloat(aditionalMin) + " como minimo</span>");
            return false;
        }
        return true;
    }
    $("#monthlyAmountError").removeAttr('hidden');
    $("#monthlyAmountError").html("<span class='alert alert-danger'>Debe introducir una cantidad</span>");
    return false;
}

function fn_ValidateSigner() {
    $("#signerError").html("");
    var signerSelected = $('input[name=signerInput]:checked');
    if (signerSelected.length == 0) {
        $("#signerError").removeAttr('hidden');
        $("#signerError").html("<span class='alert alert-danger'>Debe seleccionar un firmante</span>");
        return false;
    }
    return true;
}

function fn_ValidateIBAN(iban) {
    $("#ibanError").html("");

    if (!$('#isPSD2').prop('checked')) {
        return true;
    }

    var valueIban = iban.value.toUpperCase();
    if (valueIban != null && valueIban != "") {
        valueIban = valueIban.trim();
        valueIban = valueIban.replace(/\s/g, "");

        var letra1, letra2, num1, num2;
        var isbanaux;
        if (valueIban.length != 24) {
            $("#ibanError").removeAttr('hidden');
            $("#ibanError").html("<span class='alert alert-danger'>El IBAN introducido no es correcto</span>");
            return false;
        }

        // Se coge las primeras dos letras y se pasan a números
        letra1 = valueIban.substring(0, 1);
        letra2 = valueIban.substring(1, 2);
        num1 = getnumIBAN(letra1);
        num2 = getnumIBAN(letra2);
        //Se sustituye las letras por números.
        isbanaux = String(num1) + String(num2) + valueIban.substring(2);
        // Se mueve los 6 primeros caracteres al final de la cadena.
        isbanaux = isbanaux.substring(6) + isbanaux.substring(0, 6);

        //Se calcula el resto, llamando a la función modulo97, definida más abajo
        var resto = modulo97(isbanaux);
        if (resto == 1) {
            return true;
        } else {
            $("#ibanError").removeAttr('hidden');
            $("#ibanError").html("<span class='alert alert-danger'>El IBAN introducido no es correcto</span>");
            return false;
        }
    }
    
    $("#ibanError").removeAttr('hidden');
    $("#ibanError").html("<span class='alert alert-danger'>Debe introducir IBAN</span>");
    return false;

}

function modulo97(iban) {
    var parts = Math.ceil(iban.length / 7);
    var remainer = "";

    for (var i = 1; i <= parts; i++) {
        remainer = String(parseFloat(remainer + iban.substr((i - 1) * 7, 7)) % 97);
    }

    return remainer;
}

function getnumIBAN(letra) {
    var ls_letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return ls_letras.search(letra) + 10;
}
