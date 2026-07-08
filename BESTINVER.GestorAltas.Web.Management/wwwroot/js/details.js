var invalidPhones = "";

$(document).ready(function () {
    loadDifferentPostalAddressButtonBehavior();
    loadStatusButtonsBehavior();
    createAlertButtonBehavior();
    statusInfoModalTriggersBehavior();
    changeSignatureType();
    loadCancelRequestBehavior();
    operationsTableButtonsBehavior();
    operationsSendPSD2ButtonsBehavior();
});

function loadCancelRequestBehavior() {
    ajaxModal($('button[data-target="#cancel-request"]'), null, function (data) {
        if (data.result === true) {
            toastr.success('<strong>Completado!</strong> Solicitud modificada', '', { timeOut: 3000 });
            window.location.reload();
        } else if (data.result === false) {
            toastr.error('No se pudo realizar la acción', '', { timeOut: 3000 });
        } else {
            toastr.warning('No se pudo realizar la acción', 'Solicitud ya esta cancelada', { timeOut: 3000 });
        }
    });
}

function changeSignatureType() {
    $(document).on('change', '.signaturetype', function () {
        var value = $(this).val();
        checkSignatureValue(value);
    });

    var value = $('#IdRequestSignatureHidden').val();
    var requestHasFCR = $('#RequestProductCheckFCRHidden').val();
    checkSignatureValue(value, requestHasFCR);

    $('#generateDocumentationModal form').submit(function () {
        var button = $(this).find('button[type=submit]');
        buttonInactive(button);
        $('.sendingway').prop('disabled', false);
    });    

    $('#regenerateDocumentationModal form').submit(function () {
        var button = $(this).find('button[type=submit]');
        buttonInactive(button);
        $('.sendingway').prop('disabled', false);
    });

}

function checkSignatureValue(value, requestHasFCR) {
    if ($('#ProductTypeIdHidden').val() != 5) {
    if (value == 1 && (requestHasFCR == 'False' || requestHasFCR == undefined)) {
        $('.sendingway').append('<option value="5">Firma Online</option>');
        $('.sendingway').val(5);
        $('.sendingway').prop('disabled', true);
    } else {
        $('.sendingway option[value="5"]').remove();
        $('.sendingway').prop('disabled', false);
    }
    } else {
        $('.sendingway').val(1);
        $('.sendingway').prop('disabled', true);
    }
}

function operationsTableButtonsBehavior() {
    $(document).on('click', '#products-list tbody button', function (e) {
        e.preventDefault();

        var idRequest = $(this).data('requestid');
        var idProduct = $(this).data('productid');
        var idOperation = $(this).data('operationid');
        var url = $(this).data('url');

        url = url + "?idRequest=" + idRequest + "&idOperation=" + idOperation + "&idProduct=" + idProduct;
        showOperationsModal(url);
    });
}

function operationsSendPSD2ButtonsBehavior() {
    $(document).on('click', '#btnSendPSD2', function (e) {
        e.preventDefault();

        var idRequest = $(this).data('requestid');
        var idProduct = $(this).data('productid');
        var sendPSD2 = $(this).data('sendpsd2')
        var url = $(this).data('url');

        url = url + "?idRequest=" + idRequest + "&idProduct=" + idProduct + "&sendPSD2=" + sendPSD2;
        showOperationsModal(url);
    });
}

function showOperationsModal(url) {
    $.get(url, function (data) {
        $('#operationsModal').html(data);
        $('#operationsModal').modal('show');
        setCleaveClasses();
    });
}

function loadDifferentPostalAddressButtonBehavior() {
    if ($('#fiscalAddressData #DifferentPostalAddress').is(':checked')) {
        $('.rowPostalAddress').show();
    }
    else {
        $('.rowPostalAddress').hide();
    }

    $('#fiscalAddressData #DifferentPostalAddress').change(function () {
        if ($(this).is(':checked')) {
            $('.rowPostalAddress').show();
        }
        else {
            $('.rowPostalAddress').hide();
        }
    });
}

function loadStatusButtonsBehavior() {
    $("#btnAttachmentDocumentsAdvice").on("click", function () {
        var requestId = encodeURI($('#IDRequest').val());
        var documentNumber = document.getElementById("RequestDocumentNumber").value;
        var idAccount = document.getElementById("Request_IdCuenta").value;
        var customerFullName = document.getElementById("CustomerFullName").value;

        $.get('/AdviceProduct/ShowAttachmentDocumentsModal', {
            requestID: requestId,
            idAccount: idAccount,
            documentNumber: documentNumber,
            customerFullName: customerFullName
        }, function (data) {
            $('#GenerateAdviceRequestModal').html(data);
            $('#GenerateAdviceRequestModal').modal('show');
        }).fail(function () {
            alert('Ocurrió un error al cargar el contenido del modal.');
        });
    });
    $('#btnApproveStatus').on('click', function () {
        var button = $(this);
        bootbox.prompt({
            title: 'Esta acción hará que la solicitud pase al siguiente estado. Para confirmar introduzca el detalle de la aprobación de estado',
            inputType: 'textarea',
            callback: function (result) {
                if (result !== null) {
                    var data =
                    {
                        comments: encodeURI(result),
                        requestId: encodeURI($('#IDRequest').val())
                    };

                    buttonPromptResult(button, routeConfig.Details_ChangeRequestStatus, data);
                }
            }
        });
    });

    $('#btnDesistirStatus').on('click', function () {
        var button = $(this);
        bootbox.prompt({
            title: 'Esta acción hará que la solicitud quede Desistida. Para confirmar introduzca el motivo',
            inputType: 'textarea',
            callback: function (result) {
                if (result !== null) {
                    var data =
                    {
                        comments: encodeURI(result),
                        requestId: encodeURI($('#IDRequest').val())
                    };

                    buttonPromptResult(button, routeConfig.Details_MoveToAbandoned, data);
                }
            }
        });
    });
    $('#btnCaducarStatus').on('click', function () {
        var button = $(this);
        bootbox.prompt({
            title: 'Esta acción hará que la solicitud quede Cacudada. Para confirmar introduzca el motivo',
            inputType: 'textarea',
            callback: function (result) {
                if (result !== null) {
                    var data =
                    {
                        comments: encodeURI(result),
                        requestId: encodeURI($('#IDRequest').val())
                    };

                    buttonPromptResult(button, routeConfig.Details_MoveToExpired, data);
                }
            }
        });
    });
    $('#btnSendToRD').on('click', function () {
        var button = $(this);
        $(".btnRd").prop('disabled', true);
        bootbox.confirm('Esto enviará los datos de solicitud a Operaciones. ¿Confirmar?', function (result) {
            if (result)
            {
                var operationsDate = {};
                callEndBootBoxOperations(button, 0, operationsDate);
            }
        });
    });
    $('#btnSendManualToRD').on('click', function () {
        var requestId = $('#IDRequest').val();
        bootbox.prompt({
            title: 'Introduzca código RD para operación: ',
            inputType: 'number',
            callback: function (result) {
                if (!result) {
                    toastr.warning('El código RD es obligatorio obligatorio', '', { timeOut: 3000 });
                }
                else {
                    $.ajax({
                        type: 'GET',
                        url: routeConfig.Details_GetRDCode,
                        data: { 'requestID': requestId, 'rdCode': result },
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        beforeSend: function () {
                            toastr.warning('Enviando a RD...', '', { timeOut: 3000 });
                        },
                        success: function (response) {
                            if (response.result) {
                                toastr.success('Se ha realizado la operación con éxito', { timeOut: 3000 });
                                location.reload();
                            }
                            else {
                                toastr.warning('No se pudo realizar la acción', '', { timeOut: 3000 });
                            }
                        },
                        error: function (response) {
                            console.log(response);
                            toastr.error('No se pudo realizar la acción', response.responseText, { timeOut: 3000 });
                        },
                        failure: function (response) {
                            console.log(response);
                            toastr.error('No se pudo realizar la acción', response.responseText, { timeOut: 3000 });
                        }
                    });
                }
            }
        });
    });
    $('#btnApproveStatusNoRestrictions').on('click', function () {
        var button = $(this);
        bootbox.prompt({
            title: 'Esta acción hará que la solicitud pase al siguiente estado. Para confirmar introduzca el detalle de la aprobación de estado',
            inputType: 'textarea',
            callback: function (result) {
                if (result !== null) {
                    var data =
                    {
                        comments: encodeURI(result),
                        requestId: encodeURI($('#IDRequest').val()),
                        noRestrictions: true
                    };

                    buttonPromptResult(button, routeConfig.Details_ChangeRequestStatus, data);
                }
            }
        });
    });

    $('#btnAdesdasStatus').on('click', function () {
        var button = $(this);
        bootbox.prompt({
            title: 'Esta acción hará que la solicitud pase a estado alta con adendas. Para confirmar introduzca el motivo',
            inputType: 'textarea',
            callback: function (result) {
                if (result !== null) {
                    var data =
                    {
                        comments: encodeURI(result),
                        requestId: encodeURI($('#IDRequest').val())
                    };

                    buttonPromptResult(button, routeConfig.Details_MoveToAdendas, data);
                }
            }
        });
    });

    $('#btnSendPartialAccountRD').on('click', function () {
        var button = $(this);

        bootbox.confirm("Esto enviará los datos de solicitud a RD. ¿Confirmar?", function (result) {
            if (result) {
                if (result != null) {
                    var data =
                    {
                        comments: encodeURI("RD"),
                        requestId: encodeURI($('#IDRequest').val())
                    };

                    buttonRdSendingResult(button, routeConfig.Details_SendApplicantsToRD, data);
                }
            }
        });
    });

    $('#btnSendPartialCompleteRD').on('click', function () {
        var button = $(this);
        bootbox.confirm('Esto enviará los datos de solicitud a RD. ¿Confirmar?', function (result) {
            if (result) {
                var operationsDate = {};
                var validRows = $('.operations-list tbody tr[data-type=1],.operations-list tbody tr[data-type=2]');
                if (validRows.length > 0) {
                    $.each($(validRows), function (index, item) {
                        var idOperation = $(item).find('td:nth(0)').text();
                        var typeOperation = $(item).find('td:nth(1)').text();
                        var cantidadOperation = $(item).find('td:nth(2)').text();

                        bootbox.prompt({
                            title: 'Introduzca la fecha de la operación para operación: ' + idOperation + '. Tipo: ' + typeOperation + '. Cantidad: ' + cantidadOperation,
                            inputType: 'date',
                            callback: function (result) {
                                if (!result) {
                                    toastr.warning('Las fechas son obligatorias', '', { timeOut: 3000 });
                                }
                                else {
                                    operationsDate[idOperation] = result;

                                    var data =
                                    {
                                        comments: encodeURI("RD"),
                                        requestId: encodeURI($('#IDRequest').val()),
                                        operationsDate: operationsDate,
                                        RDIdCuenta: encodeURI($('#Request_IdCuenta').val())
                                    };

                                    buttonRdSendingResult(button, routeConfig.Details_SendOperationsToRD, data);
                                    //callEndBootBoxOperations(button, validRows.length, operationsDate);
                                }
                            }
                        });
                    });
                }
                else {
                    var data =
                    {
                        comments: encodeURI("RD"),
                        requestId: encodeURI($('#IDRequest').val()),
                        operationsDate: operationsDate,
                        RDIdCuenta: encodeURI($('#Request_IdCuenta').val())
                    };

                    buttonRdSendingResult(button, routeConfig.Details_SendOperationsToRD, data);
                }
            }
        });
    });

    $('#btnUploadDocumentsSFTP').on('click', function () {
        var button = $(this);
        callUploadDocumentsSFTP(button);
    });
}

function callEndBootBoxOperations(button, total, operationsDate) {
   
    var changeRequestStatus =
    {
        comments: encodeURI("RD"),
        requestId: encodeURI($('#IDRequest').val()),
        operationsDate: operationsDate
    };

    buttonRdSendingResult(button, routeConfig.Details_SendToRD, changeRequestStatus);
}


function callEndBootBoxOperationsRequiereCommitment(button, total, operationsDate, compromiseId) {
    if (total === Object.keys(operationsDate).length) {
        console.log(operationsDate);
        var salesChannelId = button.data("sales-channel");

        var changeRequestStatus =
        {
            comments: encodeURI("RD"),
            requestId: encodeURI($('#IDRequest').val()),
            operationsDate: operationsDate,
            CompromiseId: compromiseId,
        };

        var url = salesChannelId == 6 ? routeConfig.Details_SendToRDSubscriptionWithCompromise : routeConfig.Details_SendToRDWithCompromise;

        buttonRdSendingResult(button, url, changeRequestStatus);
    }
}

function buttonRdSendingResult(button, url, data) {
    var message = '<strong>Completado!</strong> Solicitud modificada';

    if (data.noRestrictions === undefined)
        data.noRestrictions = false;
    buttonInactive(button);

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function () {
            $("#btnRd").prop('disabled', true);
            $("#btnParcial").prop('disabled', true);
        },
        success: function (response) {
            $("#btnRd").prop('disabled', false);
            $("#btnParcial").prop('disabled', false);

            if (response.result) {
                toastr.success(message, '', { timeOut: 3000 });
                location.reload();
            }
            else {
                buttonActive(button);
                toastr.warning('No se pudo realizar la acción', '', { timeOut: 3000 });
                location.reload();
            }
        },
        error: function (response) {
            buttonActive(button);
            toastr.error('No se pudo realizar la acción', response.responseText, { timeOut: 3000 });

            $("#btnRd").prop('disabled', false);
            $("#btnParcial").prop('disabled', false);
            location.reload();
        },
        failure: function (response) {
            buttonActive(button);
            toastr.error('No se pudo realizar la acción', response.responseText, { timeOut: 3000 });

            $("#btnRd").prop('disabled', false);
            $("#btnParcial").prop('disabled', false);
            location.reload();
        }
    });

}


function buttonPromptResult(button, url, data) {
    var message = '<strong>Completado!</strong> Solicitud modificada';

    if (data.noRestrictions === undefined)
        data.noRestrictions = false;
    buttonInactive(button);
   
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            if (response.result) {
                if (response.showPendingSignaturePopUp) {
                    bootbox.alert('Se ha cambiado el tipo de firma a manuscrita, recuerde verificar los documentos firmados por el cliente y que se encuentran en la VPN. Gracias');
                }

                toastr.success(message, '', { timeOut: 3000 });
                location.reload();
            }
            else {
                buttonActive(button);
                if (response.showPendingSignaturePopUp) {
                    toastr.warning('No se puede avanzar de estado, existen documentos pendientes de firma', '', { timeOut: 3000 });
                } else {
                    toastr.warning('No se pudo realizar la acción', '', { timeOut: 3000 });
                }                
            }
        },
        error: function (response) {
            buttonActive(button);
            toastr.error('No se pudo realizar la acción', response.responseText, { timeOut: 3000 });
        },
        failure: function (response) {
            buttonActive(button);
            toastr.error('No se pudo realizar la acción', response.responseText, { timeOut: 3000 });
        }
    });
}

function createAlertButtonBehavior() {
    ajaxModal($('button[data-target="#create-alert-modal"]'), null, function (data) {
        if (data === true) {
            toastr.success('Alerta creada', '', { timeOut: 3000 });
            window.location.reload();
        } else if (data === false) {
            toastr.error('No se pudo realizar la acción', '', { timeOut: 3000 });
        }
    });
}

function statusInfoModalTriggersBehavior() {
    $('.statusModalTrigger').on('click', function () {
        var targetID = $(this).data('statusmodaltrigger');
        console.log(targetID);

        $('#' + targetID).modal();
    });
}

function callUploadDocumentsSFTP(button) {
    var requestId = $('#IDRequest').val()
    var message = "<strong>Documentos enviados al SFTP</strong>";
    buttonInactive(button);
    $.ajax({
        type: "POST",
        url: routeConfig.Details_UploadDocumentToSFTP,
        data: { 'requestID': requestId },
        success: function (response) {
            if (response.result) {
                toastr.success(message, '', { timeOut: 3000 });
            }
            else {
                toastr.warning("No se pudo realizar la acción", '', { timeOut: 3000 });
            }
            location.reload();
        },
        error: function (response) {
            console.log(response); location.reload();
        },
        failure: function (response) {
            console.log(response); location.reload();
        }
    });
}

function setValidateExpiredData() {
    $('#txtIDDocumentExpirationDate').toggleClass('greatherThanToday');
}

//Validaciones

$.validator.addMethod('validage',
    function (value, element, params) {
        var birthday = $(params[0]).val(),
            isminor = params[1].toLowerCase() === 'true' ? true : false,
            momentdate = getDate(birthday),
            age = moment().diff(momentdate, 'years');

        if (isminor && age >= 18) {
            // no se permite el cambio de menor a mayor de edad
            return false;
        }

        if (!isminor && age < 18) {
            // no se permite el cambio de mayor a menor de edad
            return false;
        }

        if (!momentdate.isValid())
            return false;

        return momentdate.isValid() && isBirthDayOk(momentdate);
    });

$.validator.unobtrusive.adapters.add('validage',
    ['minor'],
    function (options) {
        var element = $(options.form).find('input#Birthday')[0];
        options.rules['validage'] = [element, options.params['minor']];
        options.messages['validage'] = options.message;
    });

function getDate(value) {
    var dateparts = value.split('-');

    var year = dateparts[0];
    var month = dateparts[1];
    var dia = dateparts[2];

    return getMomentDate(dia, month, year);
}

function getMomentDate(pday, pmonth, pyear) {
    var day = pday != undefined ? Paddy(pday, 2) : 0;
    var month = pmonth != undefined ? Paddy(pmonth, 2) : 0;
    var year = pyear != undefined ? Paddy(pyear, 4) : 0;
    var datestring = year + "-" + month + "-" + day;
    var date = moment(datestring, 'YYYY-MM-DD', true);
    return date;
}

function Paddy(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}

function isBirthDayOk(val) {
    var currentdate = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD', true);
    var mindate = moment("1900-01-01", 'YYYY-MM-DD', true);
    return val.isBefore(currentdate) && mindate.isBefore(val);
}

$.validator.addMethod('requiredexpirationdate',
    function (value, element, params) {
        var expirationdate = $(params[0]).val(),
            ispermanent = document.getElementById('IDDocumentIsPermanent').checked ? true : false;

        if (!ispermanent && expirationdate === "") {
            // Si no es un documento de identidad permanente la fecha de caducidad es obligatoria
            return false;
        }

        return true;
    });

function ShowModalUploadSuscriptionDeal() {
    $("#uploadSubscriptionDealModal").modal('show')
}

$.validator.unobtrusive.adapters.add('requiredexpirationdate',
    function (options) {
        var element = $(options.form).find('input#IDDocumentExpirationDate')[0];
        var ispermanent = $(options.form).find('input#IDDocumentIsPermanent')[0].value;
        options.rules['requiredexpirationdate'] = [element, ispermanent];
        options.messages['requiredexpirationdate'] = options.message;
    });

jQuery.validator.addMethod("uniquemobilephone", function (value, element, param) {
    value = value.replace("+34", "");
    var phones = $(element).data('val-applicanttype') == 1 ? $("#invalidPhonesArray").val() : $("#cotitularInvalidPhonesArray").val();
    if (phones != undefined || phones != "") {
        var phonesArray = phones.split(";");
        var exists = phonesArray.indexOf(value);
        return exists < 0;
    } else {
        return true;
    }
});
jQuery.validator.unobtrusive.adapters.addBool("uniquemobilephone");

document.addEventListener("DOMContentLoaded", function () {
    var elements = document.querySelectorAll('[data-datetime]');
    elements.forEach(function (el) {
        var dateInput = el.getAttribute('data-datetime');
        var utcDate = new Date(dateInput); // Convierte el valor ISO 8601 a un objeto Date
        var localDate = utcDate.toLocaleString(); // Convierte la fecha al huso horario local
        el.value = localDate; // Actualiza el campo con la fecha local (input)
        el.textContent = localDate; // Actualiza el campo con la fecha local (text)
    });
});