'use strict';

function Request() { }

Request.CreateBasicData = function (viewModel) {
    if (timeoutcheck) {
        customError(viewModel.MainApplicant().ApplicantBasicData().DNI() + ": Timeout", apiConfig.API_Register_SaveApplicantBasicData);
        location.href = timeouturl;
        return;
    }
    var phone = viewModel.IsFCR() ? "91 000 92 90" : "900 878 280";
    var mail = viewModel.IsFCR() ? "bestinver-infra@bestinver.es" : "bestinver@bestinver.es";
    var data = viewModel.MainApplicant().ApplicantBasicData().ViewModelToJSON();
    data.Username = viewModel.UserCRII();
    data.IdSalesChannel = viewModel.MainApplicant().ApplicantBasicData().SalesChannel();
    data.ManagedByCommercial = viewModel.ManagedByCommercial();
    data.AgentShippingMail = viewModel.MainApplicant().ApplicantBasicData().EmailCrii();
    data.utm_medium = sessionStorage.getItem('utm_medium');
    data.utm_source = sessionStorage.getItem('utm_source');
    data.utm_campaign = sessionStorage.getItem('utm_campaign');
    data.utm_content = sessionStorage.getItem('utm_content');
    data.utm_term = sessionStorage.getItem('utm_term');
    data.web = Utils.isNullOrEmpty(viewModel.UserCRII());
    data.isApp = (Utils.GetMobileAppData()).AppVersion != null;
    var button = $('#save-basic-data');
    button.toggleClass('loading');
    $('#personal-data-content').block({ message: null });
    customDebug(JSON.stringify(data), 'Request.CreateBasicData');
    $.ajax({
        context: this,
        type: "POST",
        url: apiConfig.API_Register_SaveApplicantBasicData,
        crossDomain: false,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
    }).done(function (data, textStatus, xhr) {
        try {
            var obj = data;
            sessionStorage.setItem('requestid', obj.ParentRequestID);
            viewModel.MainApplicant().ApplicantBasicData().RequestId(obj.Id);
            viewModel.SignatureData().RequestId(obj.Id);
            viewModel.RequestId(obj.Id);
            viewModel.goToNextStep();
            customDebug(data.Id, apiConfig.API_Register_SaveApplicantBasicData);
        } catch (err) {
            viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono '+ phone +' o del correo electrónico '+ mail +'<br/><br/>Muchas gracias.');
            Navigation.NextStep(viewModel.CurrentStep, 'Error');
            GMT.PushEvent(PageEnum.DATOS_BASICOS_TITULAR, 'error', viewModel.ErrorMessage());
            customError(err.stack, apiConfig.API_Register_SaveApplicantBasicData);
        }
    }).fail(function (data, textStatus, xhr) {
        try {
            switch (data.status) {
                case 409:
                    viewModel.ErrorMessage('El DNI indicado ya tiene una solicitud de alta en Bestinver, para finalizar el proceso contacta con nosotros a través del teléfono '+ phone +' o del correo electrónico '+ mail +', muchas gracias.');
                    Navigation.NextStep(viewModel.CurrentStep, 'Error');
                    break;
                case 403:
                    viewModel.ErrorMessage('Sentimos comunicarle que no puede realizar el alta de una cuenta. Para cualquier aclaración puede ponerse en contacto con el Centro de Relación con el Inversor llamando al teléfono ' + phone);
                    Navigation.NextStep(viewModel.CurrentStep, 'Error');
                    break;
                case 405:
                    viewModel.ErrorMessage('Para la contratación de un producto puede dirigirse a la Zona Cliente o llamar al teléfono del Centro de Relación con el Inversor '+ phone +'.');
                    Navigation.NextStep(viewModel.CurrentStep, 'Error');
                    break;
                case 502:
                    viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono '+ phone +' o del correo electrónico '+ mail +'<br/><br/>Muchas gracias.');
                    Navigation.NextStep(viewModel.CurrentStep, 'Error');
                    break;
                case 302:
                    customError(viewModel.MainApplicant().ApplicantBasicData().DNI() + ": Timeout", apiConfig.API_Register_SaveApplicantBasicData);
                    location.href = timeouturl;
                    break;
                default:
                    viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono '+ phone +' o del correo electrónico '+ mail +'<br/><br/>Muchas gracias.');
                    Navigation.NextStep(viewModel.CurrentStep, 'Error');
            }
            GMT.PushEvent(PageEnum.DATOS_BASICOS_TITULAR, 'error', viewModel.ErrorMessage());
            customError(data.responseText, apiConfig.API_Register_SaveApplicantBasicData);
        } catch (err) {
            customError(err.stack, apiConfig.API_Register_SaveApplicantBasicData);
            viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono '+ phone +' o del correo electrónico '+ mail +'<br/><br/>Muchas gracias.');
            Navigation.NextStep(viewModel.CurrentStep, 'Error');
            GMT.PushEvent(PageEnum.DATOS_BASICOS_TITULAR, 'error', viewModel.ErrorMessage());
        }
    }).always(function () {
        button.toggleClass('loading');
        $('#personal-data-content').unblock({ message: null });
        ResetTimeoutFnc();
    });
};

Request.CreateSignatureData = function (viewModel) {
    if (timeoutcheck) {
        customError(viewModel.RequestId() + ": Timeout", apiConfig.API_Register_SaveSignatureData);
        location.href = timeouturl;
        return;
    }
    var phone = viewModel.IsFCR() ? "91 000 92 90" : "900 878 280";
    var mail = viewModel.IsFCR() ? "bestinver-infra@bestinver.es" : "bestinver@bestinver.es";
    var data = viewModel.SignatureData().ViewModelToJSON();
    data.ManagedByCommercial = viewModel.ManagedByCommercial();
    var button = $('#save-signature-data');
    var div = $('#document-wait');
    button.toggleClass('loading');
    $('#signature-content').block({ message: null });
    div.toggleClass('hidden');
    customDebug(JSON.stringify(data), 'Request.CreateSignatureData');
    $.ajax({
        url: apiConfig.API_Register_SaveSignatureData,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
    }).done(function (data, textStatus, xhr) {
        try {
            if (data.length == 0) {
                viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono ' + phone +' o del correo electrónico ' + mail + '<br/><br/>Muchas gracias.');
                Navigation.NextStep(viewModel.CurrentStep, 'Error');
                GMT.PushEvent(PageEnum.FIRMA_DOCUMENTOS, 'error', viewModel.ErrorMessage());
            } else if (viewModel.SignatureData().IdDocumentSignatureType() == DocumentSignatureTypeEnum.DIGITAL) {
                var obj = data;
                var pdfdocumentlist = Utils.GetDocuments(obj);
                viewModel.SetApplicantDocuments(pdfdocumentlist);
                if (!viewModel.MainApplicant().IsOlderThan18()) {
                    var applicant = viewModel.GetNextApplicantSignature();
                    viewModel.CurrentEditApplicant(applicant);
                    viewModel.InitSignApplicantDocument();
                    if (applicant.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.BENEFICIARIO
                        || applicant.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.AUTORIZADO) {
                        $('#signature-sms').css('display', 'block');
                        $('#GDPR-Online-Acceptation-content').css('display', 'block');                        
                        GMT.Push(PageEnum.FIRMA_DOCUMENTOS_PIN);                       
                    }
                }
                viewModel.goToNextStep();
            } else {
                if (viewModel.SignatureData().IdSendingWay() == DocumentSendingWayEnum.ADJUNTAR) {
                    var obj = $.parseJSON(JSON.stringify(data));
                    var pdfdocumentlist = Utils.GetDocuments(obj);
                    viewModel.SetApplicantDocuments(pdfdocumentlist);
                    $('#signature-content').toggleClass('hidden');
                    $('#signature-content-download').toggleClass('hidden');
                } else {
                    $('#signature-content').toggleClass('hidden');
                    $('#signature-content-post').toggleClass('hidden');
                }               
            }
            customDebug(JSON.stringify(data), apiConfig.API_Register_SaveSignatureData);
        } catch (err) {
            customError(err.stack, apiConfig.API_Register_SaveSignatureData);
            viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono '+ phone +' o del correo electrónico '+ mail +'<br/><br/>Muchas gracias.');
            Navigation.NextStep(viewModel.CurrentStep, 'Error');
            GMT.PushEvent(PageEnum.FIRMA_DOCUMENTOS, 'error', viewModel.ErrorMessage());
        }
    }).fail(function (data, textStatus, xhr) {
        try {
            switch (data.status) {
                case 302:
                    customError(viewModel.RequestId() + ": Timeout", apiConfig.API_Register_SaveSignatureData);
                    location.href = timeouturl;
                    break;
                default:
                    GMT.PushEvent(PageEnum.FIRMA_DOCUMENTOS, 'error', 'Error en la firma de documentos');
                    customError(data.responseText, apiConfig.API_Register_SaveSignatureData);
                    location.href = internalerrorurl;
            }
        } catch (err) {
            customError(err.stack, apiConfig.API_Register_SaveSignatureData);
        }
    }).always(function () {
        button.toggleClass('loading');
        div.toggleClass('hidden');
        $('#signature-content').block({ message: null });
        ResetTimeoutFnc();
    });
};

Request.CreateRequestData = function (viewModel) {
    if (timeoutcheck) {
        customError(viewModel.RequestId() + ": Timeout", apiConfig.API_Register_SaveRequestData);
        location.href = timeouturl;
        return;
    }
    var phone = viewModel.IsFCR() ? "91 000 92 90" : "900 878 280";
    var mail = viewModel.IsFCR() ? "bestinver-infra@bestinver.es" : "bestinver@bestinver.es";
    viewModel.CreateEmptyOperationAdviceProduct();
    var button = $('#save-request-data');
    button.toggleClass('loading');
    $('#test-content').block({ message: null });
    var data = viewModel.GetJsonRequestData();
    customDebug(JSON.stringify(data), 'Request.CreateRequestData');
    $.ajax({
        url: apiConfig.API_Register_SaveRequestData,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
    }).done(function (data) {
        Navigation.NextStepAuto();
        customDebug(data, apiConfig.API_Register_SaveRequestData);
    }).fail(function (data, textStatus, xhr) {      
        switch (data.status) {
            case 409:
                viewModel.ErrorMessage('Muchas gracias por completar el proceso de alta, el Equipo de Relación con el Inversor contactará contigo para indicarte los próximos pasos a seguir.<br/><br/>Si lo deseas,  puedes ponerte en contacto con nosotros a través del teléfono '+ phone +' o del correo electrónico ' + mail);
                Navigation.NextStep(viewModel.CurrentStep, 'Error');
                break;
            case 403:
                viewModel.ErrorMessage('Sentimos comunicarle que no puede realizar el alta de una cuenta. Para cualquier aclaración puede ponerse en contacto con el Centro de Relación con el Inversor llamando al teléfono '+ phone +'.');
                Navigation.NextStep(viewModel.CurrentStep, 'Error');
                break;
            case 302:
                customError(viewModel.RequestId() + ": Timeout", apiConfig.API_Register_SaveRequestData);
                location.href = timeouturl;
                break;
            case 423:
                viewModel.ErrorMessage('POR MOTIVOS AJENOS A BESTINVER, EN ESTE MOMENTO NO ES POSIBLE REALIZAR LA FIRMA DIGITAL DE SU OPERACIÓN.<br/><br/>Por favor, póngase en contacto con BESTINVER en horario de lunes a viernes de 9:00h a 19:00h en el teléfono 900 878 280 o en bestinver@bestinver.es para continuar con su operación.<br/><br/>Disculpe las molestias.');
                Navigation.NextStep(viewModel.CurrentStep, 'Error');
                break;
            case 451:
                viewModel.ErrorMessage('Debido a la situación actual, el Grupo Bestinver se ve obligado a limitar la operativa en el proceso de alta. Por favor, póngase en contacto con nosotros en el <a href= "tel:900878280" class="link brown">' + phone + ' </a>');
                Navigation.NextStep(viewModel.CurrentStep, 'Error');
                break;
            default:
                viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono ' + phone +' o del correo electrónico '+ mail +'<br/><br/>Muchas gracias.');
                Navigation.NextStep(viewModel.CurrentStep, 'Error');
        }
        GMT.PushEvent(PageEnum.CONOCIMIENTO, 'error', viewModel.ErrorMessage());
        customError(data.responseText, apiConfig.API_Register_SaveRequestData);
    }).always(function () {
        button.toggleClass('loading');
        $('#test-content').unblock({ message: null });
        ResetTimeoutFnc();
    });
};

Request.GetIsinData = function () {
    var isin = $('#contracttype-externaltransfer-fundisin').val();
    var isinpre = isin.substring(0, 2);
    customDebug(JSON.stringify({ letters: isin }), 'Request.GetIsinData');

    var button = $('#save-investment-data');
    $('#investment-content').block({ message: null });

    $.getJSON(apiConfig.API_Master_IsinData, { letters: isin }, function (data) { }).done(function (data) {
        if (data.length === 1) {
            var item = data[0];

            $("#contracttype-externaltransfer-fundname-previous").val(item.nombref).trigger("change");
            $("#contracttype-externaltransfer-fundname").val(item.nombref).trigger("change");
            $("#contracttype-externaltransfer-fundname-code").val(item.codigo).trigger("change");

            $("#contracttype-externaltransfer-manager-previous").val('').trigger("change");
            $("#contracttype-externaltransfer-manager").val('').trigger("change");
            $("#contracttype-externaltransfer-manager-code").val('').trigger("change");

            var options_gestora = {
                url: function (phrase) {
                    return apiConfig.API_Master_ComsData + "?letters=" + phrase + "&isin=" + isin;
                },
                getValue: "nombre",
                requestDelay: 500,
                list: {
                    maxNumberOfElements: 12,
                    onSelectItemEvent: function () {
                        var val_manager = $("#contracttype-externaltransfer-manager").getSelectedItemData().nombre;
                        var val_manager_code = $("#contracttype-externaltransfer-manager").getSelectedItemData().comercializadora;
                        $("#contracttype-externaltransfer-manager-previous").val(val_manager).trigger("change");
                        $("#contracttype-externaltransfer-manager").val(val_manager).trigger("change");
                        $("#contracttype-externaltransfer-manager-code").val(val_manager_code).trigger("change");
                    }
                }
            };
            $("#contracttype-externaltransfer-manager").easyAutocomplete(options_gestora);
        } else {
            $("#contracttype-externaltransfer-fundname").val('').trigger("change");
            $("#contracttype-externaltransfer-fundname-code").val('').trigger("change");
            $("#contracttype-externaltransfer-manager").val('').trigger("change");
            $("#contracttype-externaltransfer-manager-code").val('').trigger("change");
        }
    }).fail(function (data, textStatus, xhr) {
        customError(data.responseText, apiConfig.API_Master_IsinData);
    }).always(function () {
        $('#investment-content').unblock({ message: null });
        ResetTimeoutFnc();
    });
};

Request.ValidateIsin = function (callback) {
    var isin = $('#contracttype-externaltransfer-fundisin').val();

    if (isin == undefined) {
        callback();
        return true;
    }

    var isinpre = isin.substring(0, 2);
    customDebug(JSON.stringify({ letters: isin }), 'Request.GetIsinData');

    $.ajax({
        url: apiConfig.API_Master_IsinData + "?letters=" + isin,
        type: "GET",
        async: false,
        dataType: "json"
    }).done(function (data, textStatus, xhr) {
        if (data.length === 1) {

            Request.GetFundData(data[0].codigo, 2).then(function (result) {
                var val_isin = result.IsinCode;

                if (val_isin != isin) {
                    var item = data[0];

                    $("#contracttype-externaltransfer-fundname-previous").val(item.nombref).trigger("change");
                    $("#contracttype-externaltransfer-fundname").val(item.nombref).trigger("change");
                    $("#contracttype-externaltransfer-fundname-code").val(item.codigo).trigger("change");

                    $("#contracttype-externaltransfer-manager-previous").val('').trigger("change");
                    $("#contracttype-externaltransfer-manager").val('').trigger("change");
                    $("#contracttype-externaltransfer-manager-code").val('').trigger("change");

                    var options_gestora = {
                        url: function (phrase) {
                            return apiConfig.API_Master_ComsData + "?letters=" + phrase + "&isin=" + val_isin;
                        },
                        getValue: "nombre",
                        requestDelay: 500,
                        list: {
                            maxNumberOfElements: 12,
                            onSelectItemEvent: function () {
                                var val_manager = $("#contracttype-externaltransfer-manager").getSelectedItemData().nombre;
                                var val_manager_code = $("#contracttype-externaltransfer-manager").getSelectedItemData().codigo;
                                $("#contracttype-externaltransfer-manager-previous").val(val_manager).trigger("change");
                                $("#contracttype-externaltransfer-manager").val(val_manager).trigger("change");
                                $("#contracttype-externaltransfer-manager-code").val(val_manager_code).trigger("change");
                            }
                        }
                    };
                    $("#contracttype-externaltransfer-manager").easyAutocomplete(options_gestora);
                }
            });
        } else {
            $("#contracttype-externaltransfer-fundname").val('').trigger("change");
            $("#contracttype-externaltransfer-fundname-code").val('').trigger("change");
            $("#contracttype-externaltransfer-manager").val('').trigger("change");
            $("#contracttype-externaltransfer-manager-code").val('').trigger("change");
        }
    }).fail(function (data, textStatus, xhr) {
        callback(false);
    }).always(function () {
        ResetTimeoutFnc();
        callback();
    });
};

Request.SaveDniData = function (DniData, callback) {
    if (timeoutcheck) {
        customError(DniData.RequestId() + ": Timeout", apiConfig.API_Register_SaveDNIData);
        location.href = timeouturl;
        return;
    }
    var data = DniData.ViewModelToJSON();
    var button = $('#save-applicant-document-data');
    button.toggleClass('loading');
    $('#applicant-document-content').block({ message: null });
    customDebug(JSON.stringify(data), 'Request.SaveDniData');
    $.ajax({
        url: apiConfig.API_Register_SaveDNIData,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
    }).done(function (data, textStatus, xhr) {
        callback(true);
        $('#pre-save-applicant-document-data').removeClass('disabled');
        $('#pre-save-applicant-document-data').removeClass('loading');
    }).fail(function (data, textStatus, xhr) {
        switch (data.status) {
            case 302:
                customError(DniData.RequestId() + ": Timeout", apiConfig.API_Register_SaveDNIData);
                location.href = timeouturl;
                break;
            default:
                customError(data.responseText, apiConfig.API_Register_SaveDNIData);
                callback(false);
        }
    }).always(function () {
        button.toggleClass('loading');
        $('#applicant-document-content').unblock({ message: null });
        ResetTimeoutFnc();
    });
};

Request.SendHelpMail = function (phone) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: apiConfig.API_Juridica_SendHelpMail,
            context: this,
            type: "POST",
            crossDomain: false,
            data: phone,
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
        }).done(function (data) {
            resolve(true);
        }).fail(function (data, textStatus, xhr) {
            switch (data.status) {
                case 302:
                    customError(requestId + ": Timeout", apiConfig.API_Master_SendHelpMail);
                    location.href = timeouturl;
                    break;
                default:
                    customError(data.responseText, apiConfig.API_Master_SendHelpMail);
                    resolve(false);
            }
        }).always(function () { ResetTimeoutFnc(); });
    });
};

Request.GetLegalModalContent = function () {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: apiConfig.API_Juridica_LegalModalContent,
            context: this,
            type: "GET",
            crossDomain: false,
            dataType: "json",
            contentType: 'application/json; charset=utf-8'
        }).done(function (data) {
            resolve(data);
        }).fail(function (data, textStatus, xhr) {
            switch (data.status) {
                case 302:
                    location.href = timeouturl;
                    break;
                default:
                    resolve(false);
            }
        });
    });
};

Request.CompleteProcess = function (requestId, messagearray) {
    if (timeoutcheck) {
        customError(requestId + ": Timeout", apiConfig.API_Master_CompleteProcess);
        location.href = timeouturl;
        return;
    }
    var data = {
        RequestId: requestId,
        Messages: messagearray
    };
    customDebug(JSON.stringify(data), 'Request.CompleteProcess');

    $.ajax({
        url: apiConfig.API_Register_CompleteProcess,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
    }).done(function (data) {
    }).fail(function (data, textStatus, xhr) {
        switch (data.status) {
            case 302:
                customError(requestId + ": Timeout", apiConfig.API_Master_CompleteProcess);
                location.href = timeouturl;
                break;
            default:
                customError(data.responseText, apiConfig.API_Master_CompleteProcess);
                location.href = internalerrorurl;
        }
    }).always(function () { ResetTimeoutFnc(); });
};

Request.GetFundData = function (fundId, fundType) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: apiConfig.API_Master_FundDetail + "?fundId=" + fundId + "&fundType=" + fundType,
            context: this,
            type: "GET",
            crossDomain: false,
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
        }).done(function (data) {
            resolve(data);
        }).fail(function (data, textStatus, xhr) {
            resolve(false);
        });
    });
};

Request.SetGDPR = function (gdprdata) {
    $.ajax({
        url: apiConfig.API_Register_SetApplicantGDPR,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(gdprdata),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
    }).done(function (data, textStatus, xhr) {
    }).fail(function (data, textStatus, xhr) {
    }).always(function () { ResetTimeoutFnc(); });
};

Request.MoveToNextStatus = function (requestId) {
    var data = { "RequestId": requestId }
    $.ajax({
        url: apiConfig.API_Register_MoveTonextStatus,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
    }).done(function (data, textStatus, xhr) {
    }).fail(function (data, textStatus, xhr) {
    }).always(function () { ResetTimeoutFnc(); });
};

Request.SetApplicantSignDate = function (requestId, dni) {
    $.getJSON(apiConfig.API_Register_SetApplicantSignDate, { requestId: requestId, dni: dni }, function (data) {
    }).done(function (data) {
    }).error(function (data, textStatus, xhr) {
    }).always(function () { ResetTimeoutFnc(); });
};

Request.CheckConvenience = function (product, test, callback) {
    var data = {
        ProductId: product,
        Answers: test
    };
    customDebug(data, 'Request.CheckConvenience');
    $.ajax({
        url: apiConfig.API_Register_CheckConvenience,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() },
        async: false
    }).done(function (data) {
        customDebug(data, apiConfig.CheckConvenience);
        callback(data);
    }).error(function (ex) {
        customDebug(ex, apiConfig.CheckConvenience);
        callback(false);
    }).always(function () {
        ResetTimeoutFnc();
    });
};

Request.CheckConvenienceExistingApplicant = function (dni, productId, callback) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: apiConfig.API_Register_CheckConvenienceExistingApplicant + "?dni=" + dni + "&productId=" + productId,
            context: this,
            type: "GET",
            async: false,
            crossDomain: false,
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
        }).done(function (data) {
            var obj = jQuery.parseJSON(JSON.stringify(data));
            callback(obj);
        }).fail(function (data, textStatus, xhr) {
            resolve(false);
        });
    });
};