var RequestStatusEnum = {
    NoIniciado: 1,
    Iniciado: 2,
    DatosContactoActualizados: 3,
    TestConocimientoActualizado: 4,
    DocumentoActualizado: 5,
    SolicitudFirmada: 6,
    SolicitudFinalizadaParcialmente: 7,
    SolicitudAprovisionadaRD: 9,
    SolicitudPendienteValidar: 11,
    SolicitudBloqueada: 12
};

$(document).ready(function () {

    $('#filterForm').submit(function () {
        var clientRD = $('#idClient').val();
        var resultElement = $('#result-remediacion');
        var button = $('#btnFilter');
        buttonInactive(button);

        $.ajax({
            url: routeConfig.Remediacion_CheckRequestStatus + '?idClient=' + clientRD,
            dataType: 'html',
            success: function (html) {
                if (html == undefined) { toastr.info('No se ha encontrado al cliente buscado'); }
                resultElement.html(html);
            },
            error: function (xhr, error) {
                toastr.info('No se ha encontrado al cliente buscado');
            },
            complete: function () {
                buttonActive(button);
            }
        });

        return false;
    });

    $('#btnSyncUrls').on('click', function () {
        var button = $(this);
       
        var dialog = bootbox.dialog({
            title: "¿Generar Urls de usuarios que todavía no la tienen?",
            message: "¿Está seguro de que desea generar las Urls de los usuarios que todavía no la tienen generada? Este proceso puede tardar unos minutos",
            buttons: {
                cancel: {
                    label: 'Cancel',
                    className: 'btn-default'
                },
                confirm: {
                    label: 'OK',
                    className: 'btn-primary',
                    callback: function (result) {
                        if (result) {
                            buttonInactive(button);
                            $.ajax({
                                url: routeConfig.Remediacion_UpdateUrls,
                                type: "GET",
                                dataType: "json",
                                contentType: "application/x-www-form-urlencoded"
                            }).done(function (response) {
                                if (response.result) {
                                    toastr.success('Se ha realizado la operación con éxito', { timeOut: 3000 });
                                } else {
                                    toastr.warning('No se pudo realizar la acción', '', { timeOut: 3000 });
                                }
                            }).fail(function (data, textStatus, xhr) {
                                toastr.warning('No se pudo realizar la acción', '', { timeOut: 3000 });
                            }).always(function () {
                                buttonActive(button);
                            });
                        } else {
                            buttonActive(button);
                        }
                    }
                }
            }
        });
    });

    $(document).on('click', '#btnChangeType', function () {
        var button = $(this);
        var resultElement = $('#result-remediacion');
        bootbox.prompt({
            title: "Cambiar estado de la petición",
            message: "¿Está seguro de que desea cambiar el estado de la petición?",
            inputType: 'select',
            inputOptions: JSON.parse(sendArrayTypes),
            callback: function (result) {
                if (result != null) {
                    buttonInactive(button);
                    $.ajax({
                        url: routeConfig.Remediacion_UpdateSendType + '?requestId=' + $('#remediacionDetail').data('id') + '&type=' + result,
                        dataType: 'html',
                        success: function (html) {
                            resultElement.html(html);
                        },
                        error: function (xhr, error) {
                            toastr.error('Ha ocurrido un error al actualizar el valor. Inténtelo de nuevo más tarde');
                        }, complete: function () {
                            buttonActive(button);
                        }
                    });
                }
            }
        });
    });

    $(document).on('click', '#editRemediationChannel', function () {
        var button = $(this);
        var resultElement = $('#result-remediacion');
        bootbox.prompt({
            title: "Cambiar canal",
            message: "¿Está seguro de que desea cambiar el canal?",
            inputType: 'select',
            inputOptions: JSON.parse(requestChannelArray),
            callback: function (result) {
                if (result != null) {
                    buttonInactive(button);
                    $.ajax({
                        url: routeConfig.Remediacion_UpdateChannel + '?requestId=' + $('#remediacionDetail').data('id') + '&channel=' + result,
                        dataType: 'html',
                        success: function (html) {
                            resultElement.html(html);
                        },
                        error: function (xhr, error) {
                            toastr.error('Ha ocurrido un error al actualizar el valor. Inténtelo de nuevo más tarde');
                        }, complete: function () {
                            buttonActive(button);
                        }
                    });
                }
            }
        });
    });

    $(document).on('click', '#btnBlockRequest', function () {
        var button = $(this);
        var resultElement = $('#result-remediacion');

        bootbox.prompt({
            title: "Bloquear remediación",
            message: "Motivo",
            inputType: 'textarea',
            callback: function (result) {
                if (result != null) {
                    buttonInactive(button);
                    $.ajax({
                        url: routeConfig.Remediacion_SetRemediacionStatus +
                            '?requestId=' + $('#remediacionDetail').data('id') +
                            '&status=' + RequestStatusEnum.SolicitudBloqueada +
                            '&description=' + escape(result),
                        dataType: 'html',
                        success: function (html) {
                            $('.bootbox.modal .resetDialog select').val(0);
                            toastr.success('Solicitud bloqueada correctamente');
                            resultElement.html(html);
                            table.ajax.reload();
                        },
                        error: function (xhr, error) {
                            toastr.error('Ha ocurrido un error al actualizar el valor. Inténtelo de nuevo más tarde');
                        }, complete: function () {
                            buttonActive(button);
                        }
                    });
                }
            }
        });
    });

    $(document).on('click', '#btnUnblockRequest', function () {
        var button = $(this);
        var resultElement = $('#result-remediacion');
        bootbox.prompt({
            title: "Desbloquear remediación",
            inputType: 'textarea',
            callback: function (result) {
                if (result != null) {
                    buttonInactive(button);
                    $.ajax({
                        url: routeConfig.Remediacion_SetRemediacionStatus +
                            '?requestId=' + $('#remediacionDetail').data('id') +
                            '&status=' + $('#toUnblockStatus [data-status]').data('status') +
                            '&description=' + escape(result),
                        dataType: 'html',
                        success: function (html) {
                            $('.bootbox.modal .resetDialog select').val(0);
                            toastr.success('Solicitud desbloqueada correctamente');
                            resultElement.html(html);
                            table.ajax.reload();
                        },
                        error: function () {
                            toastr.error('Ha ocurrido un error al actualizar el valor. Inténtelo de nuevo más tarde');
                        }, complete: function () {
                            buttonActive(button);
                        }
                    });
                }
            }
        });
    });

    // PRO-9787: Ya no es necesario este evento en la parte de Cloud, pero se queda comentado por si fuera necesario de nuevo.
    // $(document).on('click', '#btnRepeatRequest', function () {
    //     var button = $(this);
    //     var resultElement = $('#result-remediacion');
    //     bootbox.dialog({
    //         title: "Validar remediación",
    //         message: $('.resetDialog').parent().clone().removeClass('hide'),
    //         buttons: {
    //             cancel: {
    //                 label: 'Cancel',
    //                 className: 'btn-default',
    //                 callback: function () { }
    //             },
    //             confirm: {
    //                 label: 'OK',
    //                 className: 'btn-primary',
    //                 callback: function () {

    //                     var status = $('.bootbox.modal .resetDialog select').val();
    //                     var description = $('.bootbox.modal .resetDialog textarea').val();

    //                     if (status == '1' && !description) {
    //                         toastr.error('Debes especificar un motivo');
    //                         return false;
    //                     }

    //                     if (status == '0') {
    //                         toastr.error('Debes seleccionar una opción');
    //                         return false;
    //                     }

    //                     buttonInactive(button);
    //                     $.ajax({
    //                         url: routeConfig.Remediacion_SetRemediacionStatus +
    //                             '?requestId=' + $('#remediacionDetail').data('id') +
    //                             '&status=' + status +
    //                             '&description=' + escape(description),
    //                         dataType: 'html',
    //                         success: function (html) {
    //                             $('.bootbox.modal .resetDialog select').val(0);
    //                             toastr.success('Petición de remediación relanzada correctamente');
    //                             resultElement.html(html);
    //                             table.ajax.reload();
    //                         },
    //                         error: function () {
    //                             toastr.error('Ha ocurrido un error al actualizar el valor. Inténtelo de nuevo más tarde');
    //                         }, complete: function () {
    //                             buttonActive(button);
    //                         }
    //                     });
    //                 }
    //             }
    //         }
    //     });
    // });

    $(document).on('change', '.resetDialog select', function () {
        var value = $(this).val();
        $('.resetDialog .otros-especificar').addClass('hide');

        if (value == '1') {
            $('.resetDialog .otros-especificar').removeClass('hide');
        }
    });

    $(document).on('click', '#btnChangeDate', function () {
        var button = $(this);
        var resultElement = $('#result-remediacion');
        var dialog = bootbox.dialog({
            title: "Cambiar fecha de expiración",
            message: $('.changeDateDialog').parent().clone().removeClass('hide'),
            buttons: {
                cancel: {
                    label: 'Cancel',
                    className: 'btn-default',
                    callback: function () { }
                },
                confirm: {
                    label: 'OK',
                    className: 'btn-primary',
                    callback: function () {
                        var fecha = $('.bootbox.modal .changeDateDialog [type=date]').val();
                        var notExpiry = $('.bootbox.modal .changeDateDialog [type=checkbox]').is(':checked');

                        if (!fecha && !notExpiry) {
                            toastr.error('Debes especificar una fecha o marcar que no expira');
                            return false;
                        }
                        if (fecha) {
                            var fechaobj = moment(fecha);
                            if (fechaobj.isBefore(moment())) {
                                toastr.error('La fecha de expiración debe de ser mayor a la fecha actual');
                                return false;
                            }
                            fecha = fechaobj.toISOString();
                        }

                        buttonInactive(button);
                        $.ajax({
                            url: routeConfig.Remediacion_UpdateDniExpiration +
                                '?requestId=' + $('#remediacionDetail').data('id') +
                                '&date=' + fecha +
                                '&notExpiry=' + notExpiry,
                            dataType: 'html',
                            success: function (html) {
                                $('.bootbox.modal .resetDialog select').val(0);
                                toastr.success('Petición de remediación relanzada correctamente');
                                resultElement.html(html);
                                table.ajax.reload();
                            },
                            error: function () {
                                toastr.error('Ha ocurrido un error al actualizar el valor. Inténtelo de nuevo más tarde');
                            },
                            complete: function () {
                                buttonActive(button);
                            }
                        });
                    }
                }
            }
        });

        $(document).on('change', '.changeDateDialog input.input-checkbox', function () {
            $('.bootbox.modal .changeDateDialog [type=date]').prop('disabled', false);
            if ($(this).is(':checked')) {
                $('.bootbox.modal .changeDateDialog [type=date]').val('').prop('disabled', true);
            }
        });

    });

    $(document).on('click', '#editRequestType', function () {
        var button = $(this);
        var resultElement = $('#result-remediacion');
        bootbox.prompt({
            title: "Cambiar estado de la petición",
            message: "¿Está seguro de que desea cambiar el estado de la petición?",
            inputType: 'select',
            inputOptions: JSON.parse(requestTypesArray),
            callback: function (result) {
                if (result != null) {
                    buttonInactive(button);
                    $.ajax({
                        url: routeConfig.Remediacion_UpdateRequestType + '?requestId=' + $('#remediacionDetail').data('id') + '&type=' + result,
                        dataType: 'html',
                        success: function (html) {
                            resultElement.html(html);
                        },
                        error: function (xhr, error) {
                            toastr.error('Ha ocurrido un error al actualizar el valor. Inténtelo de nuevo más tarde');
                        }, complete: function () {
                            buttonActive(button);
                        }
                    });
                }
            }
        });
    });

    var table = $('#remediacion-list').DataTable({
        pageLength: 25,
        lengthMenu: [10, 25, 50],
        bServerSide: true,
        sAjaxSource: $('#filterListForm').attr('action'),
        fnServerParams: function (aoData) {
            var formData = $('#filterListForm').serializeArray();
            for (var i = 0; i < formData.length; i++) {
                var toPush = formData[i];
                //if ((toPush.name === 'from' || toPush.name === 'to' || toPush.name === 'laststatusdate') && toPush.value) {
                //    toPush.value = toPush.value;
                //}
                aoData.push(toPush);
            }
        },
        bProcessing: true,
        fixedColumns: true,
        filter: false,
        order: [[4, 'asc']],
        columns: [
            { "data": "0", "visible": false, "orderable": false },
            { "data": "1", "visible": true, "orderable": true },
            { "data": "2", "visible": true, "orderable": false },
            { "data": "3", "visible": true, "orderable": false },
            { "data": "4", "visible": true, "orderable": true,
                "render": function (data) { return formatDateTime(data); }
            },
            { "data": "5", "visible": true, "orderable": true },
            {
                "data": null,  
                "defaultContent": "",  
                "orderable": false,
                "render": function (data, type, full, meta) {
                    var id = (full[1] != undefined ? full[1] : full[2]);
                    var template = "<a href='#' class='checkdetail' data-id='" + id + "'>Consultar</a>";
                    return template;
                }
            }
        ]
    });

    $(document).on('click', '.checkdetail', function () {
        var id = $(this).data('id');
        $('#idClient').val(id);
        $('#filterForm').submit();
        $('[href="#home"]').click();
    });

    $('#filterListForm').submit(function () {
        table.ajax.reload();
        return false;
    });

    $(document).on('click', '#btnManualPhoneRemediation', function () {
        var button = $(this);
        buttonInactive(button);
        $.ajax({
            url: routeConfig.Remediacion_SetRemediationUser + '?requestId=' + $('#remediacionDetail').data('id'),
            type: "GET",
            dataType: "json",
            contentType: "application/x-www-form-urlencoded"
        }).done(function (response) {
            if (response.url) {
                window.open(response.url, '_blank');
            } else {
                toastr.warning('No se pudo realizar la acción', '', { timeOut: 3000 });
            }
        }).fail(function (data, textStatus, xhr) {
            toastr.warning('No se pudo realizar la acción', '', { timeOut: 3000 });
        }).always(function () {
            buttonActive(button);
        });
    });

    $(document).on('click', '#btnResendOperations', function () {
        var button = $(this);
        var requestId = button.data('request-id');

        buttonInactive(button);

        $.ajax({
            url: routeConfig.Remediacion_ResendOperation,
            type: "POST",
            data: {
                requestId: requestId
            },
            success: function (response) {
                toastr.success('Reenvío realizado correctamente');
                var btnReload = $('#btnFilter');
                if (btnReload.length) {
                    btnReload.trigger('click');
                }
            },
            error: function () {
                toastr.error('Error al reenviar a operaciones');
            },
            complete: function () {
                buttonActive(button);
            }
        });
    });
});