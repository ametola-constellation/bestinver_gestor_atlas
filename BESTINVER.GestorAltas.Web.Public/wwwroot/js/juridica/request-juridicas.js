function Request() { };

Request.CreateBasicData = function (viewModel) {
    if (timeoutcheck) {
        customDebug(viewModel.RequestId() + ": Timeout", apiConfig.API_Juridica_SaveApplicantBasicData);
        location.href = timeouturl;
        return;
    }
    var data = viewModel.MainApplicant().ApplicantBasicData().ViewModelToJSON();
    data.Username = viewModel.UserCRII();
    data.IdSalesChannel = viewModel.MainApplicant().ApplicantBasicData().SalesChannel();
    data.ManagedByCommercial = viewModel.ManagedByCommercial();
    data.AgentShippingMail = viewModel.MainApplicant().ApplicantBasicData().EmailCrii();
    var button = $('#save-basic-data');
    button.toggleClass('loading');
    $('#personal-data-content').block({ message: null });
    customDebug(data, 'Request.CreateBasicData');
    $.ajax({
        url: apiConfig.API_Juridica_SaveApplicantBasicData,
        context: this,
        type: "POST",
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
            viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es<br/><br/>Muchas gracias.');
            Navigation.NextStep(viewModel.CurrentStep, 'Error');
            customDebug(err, apiConfig.API_Register_SaveApplicantBasicData);
        }
    }).fail(function (data, textStatus, xhr) {
        try {
            switch (data.status) {
                case 409:
                    viewModel.ErrorMessage('El DNI indicado ya tiene una solicitud de alta en Bestinver, para finalizar el proceso contacta con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es, muchas gracias.');
                    Navigation.NextStep(viewModel.CurrentStep, 'Error');
                    break;
                case 403:
                    viewModel.ErrorMessage('Sentimos comunicarle que no puede realizar el alta de una cuenta. Para cualquier aclaración puede ponerse en contacto con el Centro de Relación con el Inversor llamando al teléfono 900 878 280');
                    Navigation.NextStep(viewModel.CurrentStep, 'Error');
                    break;
                case 405:
                    viewModel.ErrorMessage('Para la contratación de un producto puede dirigirse a la Zona Cliente o llamar al teléfono del Centro de Relación con el Inversor 900 878 280.');
                    Navigation.NextStep(viewModel.CurrentStep, 'Error');
                    break;
                case 502:
                    viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es<br/><br/>Muchas gracias.');
                    Navigation.NextStep(viewModel.CurrentStep, 'Error');
                    break;
                case 302:
                    customDebug(viewModel.MainApplicant().ApplicantBasicData().DNI() + ": Timeout", apiConfig.API_Register_SaveApplicantBasicData);
                    location.href = timeouturl;
                    break;
                default:
                    viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es<br/><br/>Muchas gracias.');
                    Navigation.NextStep(viewModel.CurrentStep, 'Error');
            }
            customDebug(data, apiConfig.API_Register_SaveApplicantBasicData);
        } catch (err) {
            customDebug(err, apiConfig.API_Register_SaveApplicantBasicData);
            viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es<br/><br/>Muchas gracias.');
            Navigation.NextStep(viewModel.CurrentStep, 'Error');
        }
    }).always(function () {
        button.toggleClass('loading');
        $('#personal-data-content').unblock({ message: null });
        ResetTimeoutFnc();
    });
};

Request.CreateSignatureData = function (viewModel) {
    if (timeoutcheck) {
        customDebug(viewModel.RequestId() + ": Timeout", apiConfig.API_Register_SaveSignatureData);
        location.href = timeouturl;
        return;
    }
    var data = viewModel.SignatureData().ViewModelToJSON();
    data.ManagedByCommercial = viewModel.ManagedByCommercial();
    var button = $('#save-signature-data');
    var div = $('#document-wait');
    button.toggleClass('loading');
    $('#signature-content').block({ message: null });
    customDebug(data, 'Request.CreateSignatureData');
    $.ajax({
        url: apiConfig.API_Juridica_SaveSignatureData,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
    }).done(function (data, textStatus, xhr) {
        try {
            viewModel.goToNextStep();
            customDebug(data, apiConfig.API_Register_SaveSignatureData);
        } catch (err) {
            customDebug(err, apiConfig.API_Register_SaveSignatureData);
            viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es<br/><br/>Muchas gracias.');
            Navigation.NextStep(viewModel.CurrentStep, 'Error');
        }
    }).fail(function (data, textStatus, xhr) {
        try {
            switch (data.status) {
                case 302:
                    customDebug(viewModel.RequestId() + ": Timeout", apiConfig.API_Register_SaveSignatureData);
                    location.href = timeouturl;
                    break;
                default:
                    viewModel.ErrorMessage('');
                    Navigation.NextStep(viewModel.CurrentStep, 'Error');
                    customDebug(data, apiConfig.API_Register_SaveSignatureData);
            }
        } catch (err) {
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
        customDebug(viewModel.RequestId() + ": Timeout", apiConfig.API_Juridica_SaveRequestData);
        location.href = timeouturl;
        return;
    }
    var button = $('#save-request-data');
    button.toggleClass('loading');
    $('#test-content').block({ message: null });
    var data = viewModel.GetJsonRequestData();
    customDebug(data, 'Request.CreateRequestData');
    $.ajax({
        url: apiConfig.API_Juridica_SaveRequestData,
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
                viewModel.ErrorMessage('Muchas gracias por completar el proceso de alta, el Equipo de Relación con el Inversor contactará contigo para indicarte los próximos pasos a seguir.<br/><br/>Si lo deseas,  puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es');
                Navigation.NextStep(viewModel.CurrentStep, 'Error');
                break;
            case 403:
                viewModel.ErrorMessage('Sentimos comunicarle que no puede realizar el alta de una cuenta. Para cualquier aclaración puede ponerse en contacto con el Centro de Relación con el Inversor llamando al teléfono 900 878 280.');
                Navigation.NextStep(viewModel.CurrentStep, 'Error');
                break;
            case 302:
                customDebug(viewModel.RequestId() + ": Timeout", apiConfig.API_Register_SaveRequestData);
                location.href = timeouturl;
                break;
            case 451:
                viewModel.ErrorMessage('Debido a la situación actual, el Grupo Bestinver se ve obligado a limitar la operativa en el proceso de alta. Por favor, póngase en contacto con nosotros en el <a href= "tel:900878280" class="link brown">900 878 280</a>');
                Navigation.NextStep(viewModel.CurrentStep, 'Error');
                break;
            default:
                viewModel.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es<br/><br/>Muchas gracias.');
                Navigation.NextStep(viewModel.CurrentStep, 'Error');
        }

        customDebug(data, apiConfig.API_Register_SaveRequestData);
    }).always(function () {
        button.toggleClass('loading');
        $('#test-content').unblock({ message: null });
        ResetTimeoutFnc();
    });
};

Request.GetIsinData = function () {
    var isin = $('#contracttype-externaltransfer-fundisin-ext').val();
    var isinpre = isin.substring(0, 2);
    customDebug({ letters: isin }, 'Request.GetIsinData');

    if (isinpre.toUpperCase() == 'ES') {
        $('#message-error-isin').text('Está usted introduciondo un ISIN nacional cuando ha seleccionado Fondo Extranjero');
        return true;
    } else {
        $('#message-error-isin').text('');
    }

    $.getJSON(apiConfig.API_Master_IsinData, { letters: isin }, function (data) {
        var obj = jQuery.parseJSON(JSON.stringify(data));
        var isin_array = JSON.parse(obj);
        if (isin_array.length == 1) {
            var item = isin_array[0];
            var isin = item.isin;
            $("#contracttype-externaltransfer-fundname-ext").val(item.nombref).trigger("change");
            $("#contracttype-externaltransfer-fundname-code-ext").val(item.codigo).trigger("change");
            var options_gestora = {
                url: function (phrase) {
                    return apiConfig.API_Master_ComsData + "?letters=" + phrase + "&isin=" + isin;
                },
                getValue: "nombre",
                requestDelay: 500,
                list: {
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
        }
        customDebug(data, apiConfig.API_Register_SaveRequestData);
    }).fail(function () {
    }).always(function () {
        customDebug(data, apiConfig.API_Register_SaveRequestData);
        ResetTimeoutFnc();
    })
}

Request.SaveDniData = function (DniData, callback) {
    if (timeoutcheck) {
        customDebug(DniData.RequestId() + ": Timeout", apiConfig.API_Register_SaveDNIData);
        location.href = timeouturl;
        return;
    }
    var data = DniData.ViewModelToJSON();
    customDebug(data, 'Request.SaveDniData');
    $.ajax({
        url: apiConfig.API_Juridica_SaveDNIData,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
    }).done(function (data, textStatus, xhr) {
        customDebug(data, apiConfig.API_Register_SaveDNIData);
        callback(true);
    }).fail(function (data, textStatus, xhr) {
        customDebug(data, apiConfig.API_Register_SaveDNIData);
        callback(false);
    }).always(function () {
        ResetTimeoutFnc();
    });
};

Request.SendHelpMail = function (phone) {
    return new Promise(function (resolve, reject) {
        var data = {
            phone: phone
        };
        customDebug(data, 'Request.SendHelpMail');
        $.ajax({
            url: apiConfig.API_Juridica_SendHelpMail,
            context: this,
            type: "POST",
            crossDomain: false,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
        }).done(function (data) {
            customDebug(data, apiConfig.API_Master_SendHelpMail);
            resolve(true);
        }).error(function (ex) {
            customDebug(ex, apiConfig.API_Master_SendHelpMail);
            resolve(false);
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

Request.CompleteProcess = function (requestId, messagearray, idSendingWay) {
    var data = {
        RequestId: requestId,
        Messages: messagearray,
        IdSendingWay: idSendingWay
    };
    customDebug(data, 'Request.CompleteProcess');

    $.ajax({
        url: apiConfig.API_Juridica_CompleteProcess,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() }
    }).done(function (data) {
        customDebug(data, apiConfig.API_Master_CompleteProcess);
    }).error(function (ex) {
        customDebug(ex, apiConfig.API_Master_CompleteProcess);
    }).always(function () { ResetTimeoutFnc(); });
};

Request.GetClientToken = function (requestId) {
    customDebug(requestId, 'Request.GetClientToken');
    return new Promise(function (resolve, reject) {
        $.getJSON(apiConfig.API_Juridica_GetClientId, { requestId: requestId }, function (result) { })
            .done(function (result) {
                customDebug(result, apiConfig.API_Register_GetClientId);
                var obj = JSON.parse(result.data);
                resolve(obj.clientToken);
            }).error(function (data, textStatus, xhr) {
                customDebug(data, apiConfig.API_Register_GetClientId);
                resolve(false);
            }).always(function () { ResetTimeoutFnc(); });
    });
}

Request.AskForRequiredRealOwner = function (fiscalCountry, percentageCountry, cif, name, answer, callback) {
    var data = {
        FiscalCountryId: fiscalCountry,
        MostProfitableCountry: percentageCountry,
        cif: cif,
        OrganizationName: name,
        SectorAnswer: answer
    };
    customDebug(data, 'Request.AskForRequiredRealOwner');
    $.ajax({
        url: apiConfig.API_Juridica_AskForRequiredRealOwner,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() },
        async: false
    }).done(function (data) {
        customDebug(data, apiConfig.API_Juridica_AskForRequiredRealOwner);
        callback(data);
    }).error(function (ex) {
        customDebug(ex, apiConfig.API_Juridica_AskForRequiredRealOwner);
        callback(false);
    }).always(function () { ResetTimeoutFnc(); });
};

Request.CheckConvenience = function (product, test, callback) {
    var data = {
        ProductId: product,
        Answers: test
    };
    customDebug(data, 'Request.CheckConvenience');
    $.ajax({
        url: apiConfig.API_Juridica_CheckConvenience,
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
    }).always(function () { ResetTimeoutFnc();});
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