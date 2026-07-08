//Constantes (no se puede usar CONST porque Gulp da error en la compilación)
var MAX_FILE_SIZE_UPLOAD = 5242880; // 5Mb * 1024 *1024
var CANCELLED_STATUS_ID = 10;
var SENT_TO_OPERATIONS_STATUS_ID = 30;

var zipdocuments;
var documentSppiner = $(".documentSppiner");
var requestJuridic = false;
var UNSUITABLE_ADVICE_ID = 32 //Asesoramiento no idoneo
var allowSendReminderEmail = true;

$(document).ready(function () {
    loadEcerticViewDocumentsByRequest();
    documentTogglers();
    loadDocumentUploadBehavior();
});

function isDocumentOlderThanSixMonths(documents) {
    if (!documents || documents.length === 0) {
        return false;
    }

    var sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return documents.some(function (doc) {
        if (doc.fechaFirma) {
            var docDate = new Date(doc.fechaFirma);
            return docDate < sixMonthsAgo;
        }
        return false;
    });
}

function loadEcerticViewDocumentsByRequest() {
    var data = managementRequestModel;
    requestJuridic = managementRequestModel.data.BasicData.ApplicantType != 1;

    var lastRequestStatus = managementRequestModel.Status[managementRequestModel.Status.length - 1];
    allowSendReminderEmail = UNSUITABLE_ADVICE_ID !== lastRequestStatus.IDStatus;

    $.ajax({
        url: routeConfig.Details_GetEcerticSignedStatus,
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            documentSppiner.append('<span><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>Cargando...</span>');
        },
        success: function (response) {
            drawSigners(response.data);
            $('.documentsppiner').hide();
            loadSaveDniDataButtonBehavior();
            loadReminderButtonBehavior();
            loadZipDownloadButtonBehavior();
            loadScanButtonBehavior();
        },
        failure: function (response) { console.log(response); },
        error: function (response) {
            console.error(response);
        }
    }).always(function () {
        documentSppiner.html('');
    });
}

function drawSigners(data) {
    if (data && data.length > 0) {
        var isSignatureTypeHandwrittenDefault = data.some(
            function (item) {
                return item.documents.some(function (d) { return d.tipoFirma === 2; });
            });
        $.each(data, function (index, item) {
            $('#documents-list').append("<li><h3 class='badge badge-secondary'>Firmante: " + item.signer + "</h3>" + drawDNI(item) + drawDocuments(item, isSignatureTypeHandwrittenDefault) + "</li>");
        });
    }
    else {
        $('#documents-list').prepend("<div class='alert alert-primary' role='alert'>Esta solicitud todavía <strong>no tiene documentación</strong> asociada.</div>");
    }
}

function drawDNI(item) {
    var table = '';
    var librofamila = false;

    if (item.dni !== null) {
        if (item.dni.anversoDNI !== '' && item.dni.reversoDNI !== '') {
            if (item.otherDocuments && item.otherDocuments.length > 0) {
                table = "<div class='alert alert-primary'><table class='table table-bordered'><thead><tr>" +
                    "<th>Anverso</th>" +
                    "<th>Reverso</th>" +
                    "<th>Libro de familia</th>" +
                    "</tr></thead><tbody><tr>";
                librofamila = true;
            } else {
                table = "<div class='alert alert-primary'><table class='table table-bordered'><thead><tr>" +
                    "<th>Anverso</th>" +
                    "<th>Reverso</th>" +
                    "</tr></thead><tbody><tr>";
            }

            table += "<td><img src='" + item.dni.anversoDNI + "' class='img-thumbnail' /><br/><a href='" + item.dni.anversoDNI + "' title='Abrir documento' target='_blank'>Ver documento en nueva ventana</a>";
            table += "<td><img src='" + item.dni.reversoDNI + "' class='img-thumbnail' /><br/><a href='" + item.dni.reversoDNI + "' title='Abrir documento' target='_blank'>Ver documento en nueva ventana</a>";
            if (librofamila) {
                table += "<td><img src='" + item.otherDocuments[0] + "' class='img-thumbnail' /><br/><a href='" + item.otherDocuments[0] + "' title='Abrir documento' target='_blank'>Ver documento en nueva ventana</a>";
            }
            table += "</tr></tbody></table>";
        }
        else if (item.dni.anversoDNI !== '') {
            if (item.otherDocuments && item.otherDocuments.length > 0) {
                table = "<div class='alert alert-primary'><table class='table table-bordered'><thead><tr>" +
                    "<th>DNI / NIE</th>" +
                    "<th>Libro de familia</th>" +
                    "</tr></thead><tbody><tr>";
                librofamila = true;
            } else {
                table = "<div class='alert alert-primary'><table class='table table-bordered'><thead><tr>" +
                    "<th>DNI / NIE</th>" +
                    "</tr></thead><tbody><tr>";
            }

            table += "<td><a href='" + item.dni.anversoDNI + "' title='Abrir documento' target='_blank'> Ver documento </a>";
            if (librofamila) {
                table += "<td><a href='" + item.otherDocuments[0] + "' title='Abrir documento' target='_blank'> Ver documento </a>";
            }
            table += "</tr></tbody></table>";
        }
    } else if (!item.allowSendPoderes) {
        table = "<div class='alert alert-primary'><table class='table table-bordered'><thead><tr>" +
            "<th>DNI / NIE</th>" +
            "</tr></thead><tbody><tr>";
        table += "<td>El participe " + item.signer + " no ha adjuntado su DNI / NIE</td>";
        table += "</tr></tbody></table>";
    } else {
        table = "<div class='alert alert-primary'></table>";
    }

    return table;
}

function drawDocuments(item, isSignatureTypeHandwrittenDefault) {    
    var signerRole = item.signerRole;
    var signerIsMinor = item.signerIsMinor;
    var allowRecoverySignature = item.allowRecoverySignature;
    var operationList = item.documents;
    var isSignatureTypeHandwritten = operationList.some(
        function (document) {
            return document.tipoFirma === 2;
        });
    var emptyListDocuments = operationList.length == 0;
    var allowSendDniData = item.allowSendDniData;
    var allowSendLibroFamilia = item.allowSendLibroFamilia;
    var allowSendPoderes = item.allowSendPoderes;
    var allowSendEscrituras = item.allowSendEscrituras;
    var documents = item.documents;
    var disabled = '';
    var table = '';
    var participeDNI = item.signerDNI;
    var idRequest = $('#IDRequest').val();
    var documentsAreTooOld = isDocumentOlderThanSixMonths(documents);

    if (emptyListDocuments && isSignatureTypeHandwritten == false) {
        isSignatureTypeHandwritten = isSignatureTypeHandwrittenDefault;
    }
    if ($('#documents-list').attr('disabled') === 'disabled') {
        disabled = 'disabled';
    }
    if (documents && documents.length > 0) {
        table = "<div class='alert alert-primary'><table class='table table-bordered'><thead><tr>" +
            "<th>Nombre</th>" +
            "<th class='text-center'>Enlace</th>" +
            "<th class='text-center'>Firmado</th>" +
            "<th>Fecha de firma</th>" +
            "<th class='text-center'>Documento firmado</th>" +
            "<th class='text-center'>Válido</th>" +
            "<th class='text-center'>Recibido</th>" +
            "</tr></thead><tbody>";
        $.each(documents, function (jindex, item) {
            participeDNI = item.participeDNI;
            idRequest = item.idRequest;
            table += "<tr>";
            table += "<td>" + item.documentName + "</td>";            
            if (item.availableDownloadDoc) {
                table += "<td class='text-center'><a class='btn-sm btn-info' role='button' href='" + item.documentUrl + "' target='_blank'><span class='fas fa-file'></span> Ver documento </a></td>";
            } else {
                table += "<td class='text-center'><button class='btn-sm btn-info' type='button' onclick=\"toastr.warning('Este documento no se puede visualizar, solo disponible en Docuware.', '', { timeOut: 5000 });\"><span class='fas fa-exclamation-triangle'></span> Ver en Docuware</button></td>";
            }
            if (item.documentUrlFirmado) {
                table += "<td class='text-center'><span class='fas fa-check-circle text-success'></span></td>";
                table += "<td>" + formatDateTime(item.fechaFirma) + "</td>";

                if (item.availableDownloadDocFirmado) {
                    table += "<td class='text-center'><a class='btn-sm btn-info' role='button' href='" + item.documentUrlFirmado + "' target='_blank'><span class='fas fa-check-circle'></span> Ver documento </a></td>";
                } else {
                    table += "<td class='text-center'><button class='btn-sm btn-info' type='button' onclick=\"toastr.warning('Este documento no se puede visualizar, solo disponible en Docuware.', '', { timeOut: 5000 });\"><span class='fas fa-exclamation-triangle'></span> Ver en Docuware</button></td>";
                }
            } else {
                table += "<td></td><td></td><td></td>";
            }
            if (item.valido) {
                table += '<td class="text-center"><input ' + disabled + ' type="checkbox" class="toggle-valido" data-docId="' + item.id + '" data-dni="' + participeDNI + '" data-requestid="' + idRequest + '" checked></td>';
            } else {
                table += '<td class="text-center"><input ' + disabled + ' type="checkbox" class="toggle-valido" data-docId="' + item.id + '" data-dni="' + participeDNI + '" data-requestid="' + idRequest + '"></td>';
            }
            if (item.recibido) {
                table += '<td class="text-center"><input ' + disabled + ' type="checkbox" class="toggle-recibido" data-docId="' + item.id + '" data-dni="' + participeDNI + '" data-requestid="' + idRequest + '" checked></td>';
            } else {
                table += '<td class="text-center"><input ' + disabled + ' type="checkbox" class="toggle-recibido" data-docId="' + item.id + '" data-dni="' + participeDNI + '" data-requestid="' + idRequest + '"></td>';
            }
            table += "</tr>";
        });
        table += "</tbody></table>";

        table += "<div>";

        if (allowRecoverySignature && !isSignatureTypeHandwritten && allowSendReminderEmail && !signerIsMinor) {
            table += "<button type='button' class='btn btn-documents email-remainder' data-requestId='" + idRequest + "' data-dni='" + participeDNI + "' ><span class='mr-2 fas fa-file-signature'></span>Enviar email recordatorio de firma</button>";
        }

        if (allowSendDniData && !isSignatureTypeHandwritten && signerRole != 4) {
            table += "<button type='button' class='btn btn-documents' data-toggle='modal' data-target='#documentModal' data-juridic='false' data-dni='" + participeDNI + "' data-requestid='" + idRequest + "' data-minor='" + allowSendLibroFamilia + "'><span class='mr-2 fas fa-file-upload'></span>Adjuntar documentos de identidad</button>";
            table += "<button type='button' class='btn btn-documents send-scan-link' data-requestId='" + idRequest + "' data-dni='" + participeDNI + "' ><span class='mr-2 fas fa-images'></span>Enviar email con link escaneo dni</button>";
        }

        // Solo mostrar el botón de descarga ZIP si los documentos no tienen más de 6 meses
        if (!documentsAreTooOld) {
            table += "<button type='button' class='btn btn-documents zip-documents' data-requestId='" + idRequest + "' data-dni='" + participeDNI + "' ><span class='mr-2 fas fa-download'></span>Descargar documentos</button>";
        }

        table += "</div></div>";
    }
    else if (!isSignatureTypeHandwritten) {
        table += "<div>";

        if (allowSendDniData && signerRole != 4) {
            table += "<button type='button' class='btn btn-documents' data-toggle='modal' data-target='#documentModal' data-juridic='false' data-dni='" + participeDNI + "' data-requestid='" + idRequest + "' data-minor='" + allowSendLibroFamilia + "'><span class='mr-2 fas fa-file-upload'></span>Adjuntar documentos de identidad</button>";
            table += "<button type='button' class='btn btn-documents send-scan-link' data-requestId='" + idRequest + "' data-dni='" + participeDNI + "' ><span class='mr-2 fas fa-images'></span>Enviar email con link escaneo dni</button>";
        }

        // Si el estado es "Cancelado" o "Enviado a operaciones", no se permite adjuntar Cif/Poderes/Escrituras
        var lastRequestStatus = managementRequestModel.Status[managementRequestModel.Status.length - 1];
        var allowSendDocsByStatus = lastRequestStatus.IDStatus != CANCELLED_STATUS_ID && lastRequestStatus.IDStatus != SENT_TO_OPERATIONS_STATUS_ID;
        if (allowSendEscrituras && allowSendPoderes && allowSendDocsByStatus) {
            table += "<button type='button' class='btn btn-documents' data-toggle='modal' data-target='#documentModal' data-dni='" + participeDNI + "' data-requestid='" + idRequest + "' data-minor='" + 'false' + "' data-juridic='true'><span class='mr-2 fas fa-file-contract'></span>Adjuntar poderes y escrituras</button>";
        }

        table += "</div>";
    }
    return table;
}

function documentTogglers() {
    $(document).on('change', '.toggle-valido', function () {
        var elem = $(this);
        var documentId = elem.attr('data-docId');
        var value = elem.is(':checked');
        var dni = elem.attr('data-dni');
        var requestid = elem.attr('data-requestid');

        $.ajax({
            url: routeConfig.Details_ChangeDocValidStatus + "?docId=" + documentId + "&status=" + value + "&requestId=" + requestid + "&dni=" + dni,
            type: 'POST',
            success: function (response) { toastr.success("Valor actualizado correctamente"); },
            failure: function (response) {
                elem.prop('checked', !value);
                NoHemosPodidoActualizar();
            },
            error: function (response) {
                elem.prop('checked', !value);
                NoHemosPodidoActualizar();
            }
        });
    });

    $(document).on('change', '.toggle-recibido', function () {
        var elem = $(this);
        var documentId = elem.attr('data-docId');
        var value = elem.is(':checked');
        var dni = elem.attr('data-dni');
        var requestid = elem.attr('data-requestid');

        $.ajax({
            url: routeConfig.Details_ChangeDocReceivedStatus + "?docId=" + documentId + "&status=" + value + "&requestId=" + requestid + "&dni=" + dni,
            type: 'POST',
            success: function (response) { toastr.success("Valor actualizado correctamente"); },
            failure: function (response) {
                elem.prop('checked', !value);
                NoHemosPodidoActualizar();
            },
            error: function (response) {
                elem.prop('checked', !value);
                NoHemosPodidoActualizar();
            }
        });
    });
}

function NoHemosPodidoActualizar() {
    var message = "No hemos podido actualizar el valor. Inténtalo de nuevo más tarde";
    toastr.error(message);
    console.error(message);
}

function loadDocumentUploadBehavior() {
    // We can attach the `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    // We can watch for our custom `fileselect` event like this
    $(document).ready(function () {
        $(':file').on('fileselect', function (event, numFiles, label) {
            var input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' files selected' : label;

            if (input.length) {
                input.val(log);
            } else {
                if (log) alert(log);
            }
        });
    });

    $('#documentModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var dni = button.data('dni');
        var requestid = button.data('requestid');
        var minor = button.data('minor');
        var juridic = button.data('juridic');
        var modal = $(this);
        modal.find('.modal-title').text('Adjuntar documentos de identidad');
        modal.find('.modal-body #dnidata-applicantdni').val(dni);
        modal.find('.modal-body #dnidata-requestid').val(requestid);
        modal.find('.modal-body #dnidata-juridicperson').val(juridic);

        if (minor) {
            modal.find('.modal-body #div-libro-familia').show();
        } else {
            modal.find('.modal-body #div-libro-familia').hide();
        }

        if (juridic) {
            modal.find('.modal-body div[id^="div-dni"]').hide();
            modal.find('.modal-body div[id^="div-cif"]').show();
            modal.find('.modal-body div[id^="div-poderes"]').show();
            modal.find('.modal-body div[id^="div-escrituras"]').show();
        } else {
            modal.find('.modal-body div[id^="div-dni"]').show();
            modal.find('.modal-body div[id^="div-cif"]').hide();
            modal.find('.modal-body div[id^="div-poderes"]').hide();
            modal.find('.modal-body div[id^="div-escrituras"]').hide();
        }
    });

    $("#documentModal").on("hidden.bs.modal", function () {
        anversodni = '';
        reversodni = '';
        librofamilia = '';

        $('#documentModal input[type=text]').each(function () {
            $(this).val('');
        });

        $('#documentModal input[type=file]').each(function () {
            $(this).val('');
        });
        
        $('#btn-savednidata').prop('disabled', false);
    });
}

var anversodni = '';
var reversodni = '';
var librofamilia = '';

function loadSaveDniDataButtonBehavior() {
    $('#btn-savednidata').on('click', function (e) {
        var button = $(this);
        $(button).prop('disabled', true);

        var filesResult = getFiles(function () {
            var dni = $('#dnidata-applicantdni').val();
            var requestid = $('#dnidata-requestid').val();

            if (anversodni == '' || dni == '' || requestid == '') {
                toastr.error('Debes adjuntar al menos el anverso del dni', '', { timeOut: 3000 });
                $(button).prop('disabled', false);
            } else {
                var msgerr = validateFileInputs();
                if (msgerr != "") {
                    toastr.error(msgerr, '', { timeOut: 3000 });
                    $(button).prop('disabled', false);
                } else {
                    var data = {
                        RequestId: requestid,
                        AnversoDni: anversodni,
                        ReversoDni: reversodni,
                        DNI: dni,
                        IdSendingWay: 0,
                        LibroFamilia: librofamilia,
                        AltaJuridica: requestJuridic
                    };
                    $.ajax({
                        url: routeConfig.Details_SaveDniData,
                        context: this,
                        type: "POST",
                        crossDomain: false,
                        data: JSON.stringify(data),
                        dataType: "json",
                        contentType: 'application/json; charset=utf-8',
                        success: function (response) {
                            if (response.result) {
                                toastr.success('Los documentos han sido guardados, tenga en cuenta que pueden tardar un poco en aparecer', '', { timeOut: 5000 });
                                $("#btn-close-savednidata").trigger("click");
                                $("#documents-list").find("[data-dni='" + dni + "']").hide();
                            }
                            else {
                                toastr.error('No se pudieron guardar los documentos', '', { timeOut: 3000 });
                            }
                            $(button).prop('disabled', false);
                        },
                        failure: function (response) { console.log(response); },
                        error: function (response) { console.log(response); },
                        always: function (response) { $(button).prop('disabled', false); }
                    });
                }
            }
        }
        );

        if (filesResult === false) {
            $(button).prop('disabled', false);
        }
    });
}

function changeStatusManual(button) {
    var operationsDate;
    $.ajax({
        type: "POST",
        url: routeConfig.Details_ChangeRequestStatus + '?IDSolicitud=' + $('#IDRequest').val() + '&type=1',
        data: JSON.stringify(operationsDate),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        traditional: true,
        success: function (response) {
            if (response.result) {
                toastr.success('Los documentos han sido guardados, tenga en cuenta que pueden tardar un poco en aparecer', '', { timeOut: 5000 });
            }
            else {
                toastr.warning("No se pudo realizar la acción", '', { timeOut: 3000 });
            }
            $(button).prop('disabled', false);
            location.reload(true);
        },
        error: function (response) {
            console.error(response); location.reload();
        },
        failure: function (response) {
            console.error(response); location.reload();
        }
    });
}

function getFiles(callback) {
    var inputanversodni = document.getElementById('input-anverso-dni');
    var inputreversodni = document.getElementById('input-reverso-dni');
    var inputlibrofamilia = document.getElementById('input-libro-familia');
    var inputcif = document.getElementById('input-cif');
    var escrituras = $('input[id^=input-escrituras]').filter(function () {
        return this.files.length > 0;
    }).toArray();
    var poderes = $('input[id^=input-poderes]').filter(function () {
        return this.files.length > 0;
    }).toArray();

    anversodni = "";
    reversodni = "";
    librofamilia = "";

    if (FileExceedSize(inputanversodni))
        return false;
    if (FileExceedSize(inputreversodni))
        return false;
    if (FileExceedSize(inputlibrofamilia))
        return false;
    if (FileExceedSize(inputcif))
        return false;
    if ($.grep(poderes, function (p) { return FileExceedSize(p); }).length > 0)
        return false;
    if ($.grep(escrituras, function (p) { return FileExceedSize(p); }).length > 0)
        return false;

    if (inputanversodni.files.length > 0) {
        getBase64(inputanversodni.files[0]).then(function (result) {
            anversodni = result;
            if (inputreversodni.files.length > 0) {
                getBase64(inputreversodni.files[0]).then(function (result) {
                    reversodni = result;
                    if (inputlibrofamilia.files.length > 0) {
                        getBase64(inputlibrofamilia.files[0]).then(function (result) {
                            librofamilia = result;
                            callback();
                        });
                    } else {
                        callback();
                    }
                });
            } else {
                if (inputlibrofamilia.files.length > 0) {
                    getBase64(inputlibrofamilia.files[0]).then(function (result) {
                        librofamilia = result;
                        callback();
                    });
                } else {
                    callback();
                }
            }
        });
    } else if (escrituras.length > 0 || poderes.length > 0 || inputcif.files.length > 0) {
        var button = $('#btn-savednidata');

        uploadFile('CIFSociedad', inputcif).catch(function (reason) {
            toastr.error('No se pudo guardar el CIF, ni las escrituras ni los poderes', '', { timeOut: 3000 });
            $(button).prop('disabled', false);
        }).then(function () {
            escrituras.reduce(function (current, next, index) {
                return current.then(function () {
                    return uploadFile('EscriturasCertificado', next);
                });
            }, Promise.resolve()).then(function (xhr) {
                poderes.reduce(function (current, next, index) {
                    return current.then(function () {
                        return uploadFile('PoderesApoderados', next);
                    });
                }, Promise.resolve()).then(function () {
                    toastr.success('Los documentos han sido guardados, tenga en cuenta que pueden tardar un poco en aparecer', '', { timeOut: 5000 });
                    $("#btn-close-savednidata").trigger("click");
                    $(button).prop('disabled', false);
                }).catch(function (reason) {
                    toastr.error('No se pudieron guardar los poderes', '', { timeOut: 3000 });
                    $(button).prop('disabled', false);
                });
            }).catch(function (reason) {
                toastr.error('No se pudieron guardar las escrituras, ni los poderes', '', { timeOut: 3000 });
                $(button).prop('disabled', false);
            });
        });
    } else {
        callback();
    }
}

function uploadFile(name, fileinput) {
    return new Promise(function (resolve, reject) {
        if (fileinput.files.length == 0) {
            resolve(null);
            return;
        }

        var file = fileinput.files[0];

        return getBase64(file).then(function (base64) {
            var data = {
                RequestId: $('#dnidata-requestid').val(),
                IdSendingWay: 0,
                dni: $('#dnidata-applicantdni').val(),
                AltaJuridica: true,
                FileName:  fileinput.dataset.fileName
            };
            data[name] = (name == 'PoderesApoderados' || name == 'EscriturasCertificado') ? [base64] : base64;
            return $.ajax({
                url: routeConfig.Details_SaveDniData,
                context: this,
                type: "POST",
                crossDomain: false,
                data: JSON.stringify(data),
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    resolve(result);
                },
                error: function (xhr) {
                    reject(xhr);
                }
            });
        });
    });
}

function FileExceedSize(input) {
    if (input && input.files && input.files.length > 0) {
        var file = input.files[0];

        if (file.size > MAX_FILE_SIZE_UPLOAD) {
            toastr.warning('No está permitido subir ficheros de más de ' + (MAX_FILE_SIZE_UPLOAD / 1024 / 1024).toFixed(0) + 'MB', '', { timeOut: 5000 });
            return true;
        }
    }
    return false;
}

var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".pdf"];
function ValidateInputFileExtension(oInput) {
    if (oInput.type == "file") {
        var sFileName = oInput.value;
        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validFileExtensions.length; j++) {
                var sCurExtension = _validFileExtensions[j];
                if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
            }
            if (!blnValid) {
                return false;
            }
        }
    }

    return true;
}

function getBase64(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();

        if (file.type.match(/image.*/)) {
            var img = new Image();
            var img64;

            img.onload = function (evt) {
                var cvs = document.createElement('canvas');
                var aspectRatio = 1024 / img.width;
                cvs.width = 1024;
                cvs.height = this.height * aspectRatio;

                //calculamos la calidad de la imagen para enviar imagenes de 1MB
                var ctx = cvs.getContext("2d").drawImage(img, 0, 0, 1024, img.height * aspectRatio);

                setTimeout(function () {
                    var base64imageData = cvs.toDataURL('image/jpeg');
                    resolve(base64imageData);
                }, 100);
            };

            // Read in the image file as a data URL.
            img.src = URL.createObjectURL(file);
        } else {
            reader.readAsDataURL(file);
            reader.onload = function () {
                img64 = reader.result;
                resolve(img64);
            };
        }
    });
}

function validateFileInputs() {
    var inputanversodni = document.getElementById('input-anverso-dni');
    var inputreversodni = document.getElementById('input-reverso-dni');
    var inputlibrofamilia = document.getElementById('input-libro-familia');

    var msgerr = "";

    if (!ValidateInputFileExtension(inputanversodni))
        msgerr += "Debe adjuntar el anverso del dni en formato imagen o pdf <br/>";

    if (!ValidateInputFileExtension(inputreversodni))
        msgerr += "Debe adjuntar el reverso del dni en formato imagen o pdf <br/>";

    if (!ValidateInputFileExtension(inputlibrofamilia))
        msgerr += "Debe adjuntar el libro de familia en formato imagen o pdf <br/>";

    return msgerr;
}

function loadReminderButtonBehavior() {
    $('button.email-remainder').on('click', function (e) {
        var button = $(this);
        bootbox.confirm("¿Enviar recordatorio por email al firmante?", function (result) {
            if (result) {
                $(button).prop('disabled', true);

                console.log($(button).data('dni'));
                console.log($(button).data('requestid'));

                $.ajax({
                    url: routeConfig.Details_ReplaySignature + '?requestId=' + $(button).data('requestid') + '&dni=' + $(button).data('dni'),
                    type: 'GET',
                    success: function (response) {
                        if (result)
                            toastr.success('Email de recordatorio enviado', '', { timeOut: 3000 });
                        else
                            toastr.error('No se pudo enviar email de recordatorio', '', { timeOut: 3000 });

                        $(button).hide();
                    },
                    failure: function (response) { console.log(response); },
                    error: function (response) { console.log(response); }
                });
            }
        });
    });
}

function loadZipDownloadButtonBehavior() {
    $('button.zip-documents').on('click', function (e) {
        var button = $(this);
        var requestId = $(button).data('requestid');
        var dni = $(button).data('dni');
        var url;
        var ok = false;

        $(button).prop('disabled', true);
        getZipUrl(requestId, dni).then(function (result) {
            window.open(result, '_blank');
            $(button).prop('disabled', false);
        });
    });
}

function loadScanButtonBehavior() {
    $('button.send-scan-link').on('click', function (e) {
        var button = $(this);
        bootbox.confirm("¿Enviar email con el link para escanear el dni?", function (result) {
            if (result) {
                $(button).prop('disabled', true);

                console.log($(button).data('dni'));
                console.log($(button).data('requestid'));

                $.ajax({
                    url: routeConfig.Details_SendDniremainderMail + '?requestId=' + $(button).data('requestid') + '&dni=' + $(button).data('dni'),
                    type: 'GET',
                    success: function (response) {
                        if (result)
                            toastr.success('Email con el link para escanear el dni enviado', '', { timeOut: 3000 });
                        else
                            toastr.error('No se pudo enviar email con el link para escanear el dni', '', { timeOut: 3000 });

                        $(button).hide();
                    },
                    failure: function (response) { console.log(response); },
                    error: function (response) { console.log(response); }
                });
            }
        });
    });
}

function getZipUrl(requestid, dni) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: routeConfig.Details_GetZipDocuments + '?requestId=' + requestid + '&dni=' + dni,
            type: 'GET',
            async: false,
            success: function (response) {
                var url = response.url;
                console.log(url);
                resolve(url);
            },
            failure: function (response) { resolve(undefined); },
            error: function (response) { resolve(undefined); }
        });
    });
}