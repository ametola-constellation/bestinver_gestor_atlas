'use strict';
window.onbeforeunload = function () { return "El proceso de actualización de documentación quedará cancelado."; };
var maxsizeInMB = (MaxPdfUploadSize / 1048576).toFixed(2).replace('.', ',');
ko.validation.registerExtenders();
ko.validation.init({
    insertMessages: false,
    decorateElement: true,
    errorClass: 'error_message'
});
ko.bindingHandlers.placeholder = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var underlyingObservable = valueAccessor();
        ko.applyBindingsToNode(element, { attr: { placeholder: underlyingObservable } });
    }
};

var RequestApplicantTypeEnum = {
    TITULAR: 1,
    COTITULAR: 2,
    AUTORIZADO: 3,
    BENEFICIARIO: 4,
    TUTOR: 5,
    APODERADO: 6,
    HEREDERO: 8,
    DONACION: 9,
    MINUSVALIDO: 10,
    TITULARREAL: 11,
    TITULARREALANDAPODERADO: 12,
    COTITULARYTUTOR: 13,
    TITULARYTUTOR: 14,
    ADMINISTRADOR: 15,
    APODERADOYADMINISTRADOR: 16,
    PATRONO: 17,
    ORGANOREPRESENTACION: 18,
    PATRONOYAPODERADO: 19,
    ORGANOREPRESENTACIONYAPODERADO: 20,
    JUNTADIRECTIVA: 21,
    HEREDEROYTUTOR: 22,
    USUFRUCTUARIO: 23,
    USUFRUCTUARIOYTUTOR: 24,
    COHEREDERO: 25,
    COHEREDEROYTUTOR: 26,

    properties:
    {
        1: { name: "Titular", value: 1 },
        2: { name: "Cotitular", value: 2 },
        3: { name: "Autorizado", value: 3 },
        4: { name: "Beneficiario", value: 4 },
        5: { name: "Tutor", value: 5 },
        6: { name: "Apoderado", value: 6 },
        8: { name: "Heredero", value: 8 },
        9: { name: "Beneficiario donación", value: 9 },
        10: { name: "Minusválido", value: 10 },
        11: { name: "Titular Real", value: 11 },
        12: { name: "Titular Real y Apoderado", value: 12 },
        13: { name: "Cotitular y tutor", value: 13 },
        14: { name: "Titular y tutor", value: 14 },
        15: { name: "Administrador", value: 15 },
        16: { name: "Apoderado y Administrador", value: 16 },
        17: { name: "Patrono", value: 17 },
        18: { name: "Órgano de Representación o Junta Directiva", value: 18 },
        19: { name: "Patrono y Apoderado", value: 19 },
        20: { name: "Órgano de Representación o Junta Directiva y Apoderado", value: 20 },
        21: { name: "Junta Directiva", value: 21 },
        22: { name: "Heredero y Tutor", value: 22 },
        23: { name: "Usufructuario", value: 23 },
        24: { name: "Usufructuario y Tutor", value: 24 },
        25: { name: "Coheredero", value: 25 },
        26: { name: "Coheredero y Tutor", value: 26 }
    }
};

var RequestTypeEnum = {
    TEST_DNI: 1,
    DNI: 2,
    TEST: 3
};

var Valor = function (k, v, d, t, s) {
    this.id = k;
    this.valor = v;
    this.descripcion = d;
    this.tooltip = t;
    this.svgfile = s;
};

var CustomDate = function (date) {
    var self = this;
    this.Day = ko.observable(date ? date.date() : null);
    this.Month = ko.observable(date ? date.month() + 1 : null);
    this.Year = ko.observable(date ? date.year() : null);

    this.DateIsNull = ko.computed(function () {
        return (self.Day() == null || isNaN(self.Day()) || self.Day() == "")
            && (self.Month() == null || isNaN(self.Month()) || self.Month() == "")
            && (self.Year() == null || isNaN(self.Year()) || self.Year() == "");
    }, this);

    this.DateIsOk = function () {
        var date = Utils.getMomentDate(self.Day(), self.Month(), self.Year());
        return date.isValid();
    };

    this.getDate = function () {
        var date = Utils.getMomentDate(self.Day(), self.Month(), self.Year());
        return date;
    };

    this.getAge = function () {
        var age = moment().diff(self.getDate(), 'years');
        return age;
    };

    this.parseString = function () {
        var datestring = self.getDate().format("YYYY-MM-DD");
        return datestring;
    };

    this.DateIsExpiredOk = function () {
        var ok = false;
        var date = Utils.getMomentDate(self.Day(), self.Month(), self.Year());
        ok = date.isAfter(new moment()) && date.isValid();
        return ok;
    };
};

var userValidationModel = function (_clientId, _clientCode) {
    var self = this;

    this.clientId = ko.observable(_clientId);
    this.errorMessage = ko.observable();
    this.userValidationCodigoRD = ko.observable(_clientCode);
    this.userValidationInputValue = ko.observable("");
    this.inputPlaceHolder = ko.computed(function () {
        if (vm.RequestApplicantType() === 4) {
            return "CIF";
        }

        if (vm.personalDataModel().isForeignDniVisible() == "False") {
            return "NIF/NIE";
        }
        else {
            return "Código Cliente";
        }
    });
    this.inputTitle = ko.computed(function () {
        if (vm.RequestApplicantType() === 4) {
            return "INTRODUCE TU CIF";
        }

        if (vm.personalDataModel().isForeignDniVisible() == "False") {
            return "INTRODUCE TU NIF/NIE";
        }
        else {
            return "INTRODUCE TU CÓDIGO CLIENTE DE BESTINVER";
        }
    });

    this.isDniFormatRight = function () {
        return Utils.validateDNI(self.userValidationInputValue());
    };

    this.isCifFormatRight = function () {
        return Utils.ValidateCIF(self.userValidationInputValue());
    };

    this.userValidation = function () {
        if (vm.personalDataModel().isForeignDniVisible() == "False") {
            self.userValidationInputValue(self.userValidationInputValue()); //.padStart(9, "0"));
            self.userValidationInputValue(self.userValidationInputValue().toUpperCase());

            //validamos contra el dni o cif
            var validateFormat = vm.RequestApplicantType() === 4 ? self.isCifFormatRight() : self.isDniFormatRight();

            if (validateFormat) {
                if (self.userValidationInputValue() == vm.personalDataModel().dni()) {
                    self.errorMessage('');
                    vm.gotoNextStep();
                }
                else {
                    if (vm.RequestApplicantType() === 4) {
                        self.errorMessage('El valor introducido NO se corresponde con el CIF del usuario.');
                    } else {
                        self.errorMessage('El valor introducido NO se corresponde con el DNI del usuario.');
                    }
                }
            }
            else {
                if (vm.RequestApplicantType() === 4) {
                    self.errorMessage('El valor introducido NO es un CIF válido.');
                } else {
                    self.errorMessage('El valor introducido NO es un DNI válido.');
                }
            }
        }
        else {
            //validamos contra el código de usuario
            if (self.userValidationInputValue() == self.userValidationCodigoRD()) {
                self.errorMessage('');
                vm.gotoNextStep();
            }
            else {
                self.errorMessage('El valor introducido NO se corresponde con el Código del usuario.');
            }
        }
    };
};
var dniModel = function () {
    var self = this;

    this.requestId = ko.observable();
    this.anversoDniBase64 = ko.observable();
    this.reversoDniBase64 = ko.observable();
    this.dni = ko.observable();
    this.mzdData = ko.observable();
    this.sendingWayId = 1; //solo se permite adjuntar dni
    this.expirationYear = ko.observable();
    this.expirationMonth = ko.observable();
    this.expirationDay = ko.observable();
    this.isPermanent = ko.observable(false);
    this.errorMessage = ko.observable();
    this.errorMessageValidDate = ko.observable();

    this.validateExpirationDate = function () {
        var currentdate = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD', true);
        var valdate = Utils.getMomentDate(self.expirationDay(), self.expirationMonth(), self.expirationYear());
        return valdate.isValid() && currentdate.isBefore(valdate);
    };
    this.toJson = ko.pureComputed(function () {
        var data = {
            RemediacionId: vm.remediacionId(),
            ClientId: vm.userValidationModel().clientId(),
            Dni: {
                RequestId: self.requestId(),
                AnversoDni: self.anversoDniBase64(),
                ReversoDni: self.reversoDniBase64(),
                Dni: self.dni(),
                MzdData: self.mzdData(),
                IdSendingWay: self.sendingWayId,
                ExpirationYear: self.isPermanent() ? "9999" : self.expirationYear(),
                ExpirationMonth: self.isPermanent() ? "01" : self.expirationMonth(),
                ExpirationDay: self.isPermanent() ? "01" : self.expirationDay(),
                IsPermanent: self.isPermanent()
            }
        };
        return data;
    }, this);
    this.saveDniData = function () {
        var inputs = $('#documentationdelivery-id input:file');
        var adjuntos = 0;
        for (var j = 0; j < inputs.length; j++) {
            if (inputs[j].files.length > 0) {
                adjuntos += 1;
            }
        }
        if (adjuntos > 0) {
            if (adjuntos == 1) {
                var inputFile1 = inputs[0].files[0];
                var inputFile1Type = inputFile1.type.split("/")[0];

                if (inputFile1Type == "application") {
                    inputFile1Type = inputFile1.type.split("/")[1];
                }
                if (inputFile1Type == '') {
                    inputFile1Type = inputFile1.name.substr(inputFile1.name.lastIndexOf('.') + 1);
                }

                if (inputFile1Type == "pdf" && inputs[0].files[0].size > MaxPdfUploadSize) {
                    self.errorMessage('Revisa el tamaño del documento. Los pdf no pueden exceder de ' + maxsizeInMB + 'MB');
                } else if (inputFile1Type == "image" || inputFile1Type == "pdf") {
                    Utils.GetBase64(inputs[0].files[0]).then(function (result) {
                        self.errorMessage();
                        self.anversoDniBase64(result);
                        self.sendDniData();
                    });
                }
                else if (inputFile1Type != "pdf" && inputFile1Type != "jpg" && inputFile1Type != "png") {
                    self.errorMessage('El formato del documento debe ser pdf, png o jpg.');
                }
                else {
                    self.errorMessage('Documento adjunto incorrecto.');
                }
            }

            else if (adjuntos == 2) {
                var inputFile1 = inputs[0].files[0];
                var inputFile1Type = inputFile1.type.split("/")[0];

                if (inputFile1Type == "application") {
                    inputFile1Type = inputFile1.type.split("/")[1];
                }
                if (inputFile1Type == '') {
                    inputFile1Type = inputFile1.name.substr(inputFile1.name.lastIndexOf('.') + 1);
                }

                var inputFile2 = inputs[1].files[0];
                var inputFile2Type = inputFile2.type.split("/")[0];

                if (inputFile2Type == "application") {
                    inputFile2Type = inputFile2.type.split("/")[1];
                }
                if (inputFile2Type == '') {
                    inputFile2Type = inputFile2.name.substr(inputFile2.name.lastIndexOf('.') + 1);
                }
                if (inputFile1Type == "pdf" && inputs[0].files[0].size > MaxPdfUploadSize) {
                    self.errorMessage('Revisa el tamaño de los documentos. Los pdf no pueden exceder de ' + maxsizeInMB + 'MB');
                } else if (inputFile2Type == "pdf" && inputs[1].files[0].size > MaxPdfUploadSize) {
                    self.errorMessage('Revisa el tamaño de los documentos. Los pdf no pueden exceder de ' + maxsizeInMB + 'MB');
                } else if ((inputFile1Type == "image" || inputFile1Type == "pdf") && (inputFile2Type == "image" || inputFile2Type == "pdf")) {
                    Utils.GetBase64(inputs[0].files[0]).then(function (result) {
                        self.anversoDniBase64(result);
                        Utils.GetBase64(inputs[1].files[0]).then(function (result2) {
                            self.errorMessage();
                            self.reversoDniBase64(result2);
                            self.sendDniData();
                        });
                    });
                }
                else if (inputFile1Type != "pdf" && inputFile1Type != "jpg" && inputFile1Type != "png" || inputFile2Type != "pdf" && inputFile2Type != "jpg" && inputFile2Type != "png") {
                    self.errorMessage('El formato del documento debe ser pdf, png o jpg.');
                }
                else {
                    self.errorMessage('Documento adjunto incorrecto.');
                }
            }
        }
        else {
            self.errorMessage('No se ha adjuntado ningún documento.');
        }
    };
    this.sendDniData = function () {
        if (self.isPermanent() || self.validateExpirationDate()) {
            var data = self.toJson();
            var button = $('#save-applicant-document-data');
            button.toggleClass('loading');

            $.ajax({
                url: routeCollection.API_Remediacion_Dni,
                context: this,
                type: "POST",
                crossDomain: false,
                data: data,
                contentType: "application/x-www-form-urlencoded",
                dataType: "json"
            }).done(function (data, textStatus, xhr) {
                self.errorMessage();
                self.errorMessageValidDate();
                vm.gotoNextStep();
            }).fail(function (data, textStatus, xhr) {
                self.errorMessage('En estos momentos no se puede realizar la operación.');
            }).always(function () {
                button.toggleClass('loading');
            });
        }
        else {
            self.errorMessageValidDate('El DNI/NIF está caducado o ha indicado una fecha incorrecta');
        }
    };

};
var PersonalDataModel = function (_year, _month, _day, _nacionality, _country, _bornPlace, _name, _firstSurname, _secondSurname, _dni, _email, _phoneNumber, _profile, _isForeignDni, _fiscalCountry, _clientId, _requestApplicantType, _hasToSign, _hasSigned) {
    var self = this;
    this.clientId = ko.observable(_clientId);
    this.requestApplicantType = ko.observable(_requestApplicantType);
    this.year = ko.observable(_year);
    this.month = ko.observable(_month);
    this.day = ko.observable(_day);
    this.bornPlace = ko.observable(_bornPlace);
    this.name = ko.observable(_name);
    this.firstSurname = ko.observable(_firstSurname);
    this.secondSurname = ko.observable(_secondSurname);
    this.isEmailOk = ko.observable('true');
    this.email = ko.observable(_email);
    this.phoneNumber = ko.observable(_phoneNumber);
    this.phonePrefix = ko.observable("+34");
    this.dni = ko.observable(_dni);
    this.nacionalityValue = ko.observable(_nacionality);
    this.countryValue = ko.observable(_country);
    this.profile = ko.observable(_profile);
    this.hasToSign = ko.observable(_hasToSign);
    this.hasSigned = ko.observable(_hasSigned);
    this.profileText = ko.computed(function () {
        if (vm.RequestApplicantType() === 4) {
            return self.profile() == 1 || self.profile() == 4 ? "Titular" : "Representante";
        } else {
            return self.profile() == 1 ? "Titular" : "Representante";
        }
    });
    this.isForeignDniVisible = ko.observable(_isForeignDni);
    this.errorMessage = ko.observable();
    this.errorMessageBirthday = ko.observable();
    this.errorMessageNacionality = ko.observable();
    this.errorMessageCountry = ko.observable();
    this.errorMessagePlace = ko.observable();
    this.errorMessageMobilePhone = ko.observable();
    this.errorMessageEmail = ko.observable();
    this.errorMessageForeignDni = ko.observable();
    this.fiscalCountry = ko.observable(_fiscalCountry);

    this.userName = ko.computed(function () {
        return self.name() + ' ' + self.firstSurname() + ' ' + self.secondSurname();
    });
    this.isOlderThan65 = ko.computed(function () {
        var birthday = Utils.getMomentDate(self.day(), self.month(), self.year());
        return moment().diff(birthday, 'years') >= 65;
    });

    this.toJson = ko.pureComputed(function () {
        var data = {
            RDTitular: vm.userValidationModel().clientId(),
            Birthday: new Date(Date.UTC(self.year(), self.month() - 1, self.day())).toISOString(),
            Nacionality: self.nacionalityValue().id,
            Country: self.countryValue().id,
            BornPlace: self.bornPlace(),
            Name: self.name(),
            FirstSurname: self.firstSurname(),
            SecondSurname: self.secondSurname(),
            Email: self.email(),
            PhoneNumber: self.phoneNumber(),
            Dni: self.dni(),
            RemediacionId: vm.remediacionId()
        };
        return data;
    }, this);

    this.checkEmail = function () {
        self.isEmailOk('false');

        var result = self.email() != undefined && self.email().replace(/\s/g, '').length > 0;

        if (result) {
            var mailok = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(self.email());
            if (mailok) {
                self.isEmailOk('true');
                return true;
            }

            self.errorMessageEmail('El email introducido NO es correcto.');
        }
        else {
            self.errorMessageEmail('Tiene que introducir un email.');
        }

        return false;
    };
    this.validateBirthday = function () {
        var mindate = moment("1900-01-01", 'YYYY-MM-DD', true);
        var currentdate = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD', true);
        var birthday = Utils.getMomentDate(self.day(), self.month(), self.year());
        var result = birthday.isValid() && mindate.isBefore(birthday) && birthday.isBefore(currentdate);

        if (!result) {
            self.errorMessageBirthday("La fecha introducida es incorrecta.");
        }

        return result;
    };
    this.validateBirthdayOlderThan18 = function () {
        var maxYear = new Date().getUTCFullYear() - 18;
        var maxMonth = new Date().getUTCMonth();
        var maxDay = new Date().getUTCDate();

        if (maxYear > self.year()) {
            return true;
        }
        else if (maxYear == self.year()) {
            if (maxMonth > self.month()) {
                return true;
            }
            else if (maxMonth == self.month()) {
                if (maxDay >= self.day()) {
                    return true;
                }
            }
        }

        self.errorMessageBirthday("La fecha introducida es incorrecta.");
        return false;
    };
    this.validateNacionality = function () {
        var result = self.nacionalityValue() != undefined && self.nacionalityValue().id > 0;

        if (!result) {
            self.errorMessageNacionality("Hay que seleccionar una nacionalidad.");
        }

        return result;
    };
    this.validateCountry = function () {
        var result = self.countryValue() != undefined && self.countryValue().id > 0;

        if (!result) {
            self.errorMessageCountry("Hay que seleccionar un país de nacimiento.");
        }

        return result;
    };
    this.validateBornPlace = function () {
        var result = self.bornPlace() != undefined && self.bornPlace().replace(/\s/g, '').length > 0;

        if (!result) {
            self.errorMessagePlace("Hay que seleccionar un lugar de nacimiento.");
        }

        return result;
    };
    this.validateForeignDni = function () {
        var result = self.isForeignDniVisible() == "False" || self.dni() != undefined && self.dni().replace(/\s/g, '').length > 0;

        if (!result) {
            self.errorMessageForeignDni("Tiene que introducir un documento de identificación");
        }

        return result;
    };

    this.ApplicantTypeJuridic = ko.computed(function () {
        var type;
        switch (self.requestApplicantType()) {
            case 1:
                type = "Titular";
                break;
            case 2:
                type = "Cotitular";
                break;
            case 3:
                type = "Autorizado";
                break;
            case 4:
                type = "Beneficiario";
                break;
            case 5:
                type = "Tutor";
                break;
            case 6:
                type = "Apoderado";
                break;
            case 7:
                type = "Representante";
                break;
            case 8:
                type = "Heredero";
                break;
            case 9:
                type = "Beneficiario Donación";
                break;
            case 10:
                type = "Minusválido";
                break;
            case 11:
                type = "Titular Real";
                break;
            case 12:
                type = "Titular Real y Apoderado";
                break;
            default:
                type = ""
                break;
        }
        return type;
    }, this);

    this.savePersonalData = function () {
        self.errorMessageBirthday('');
        self.errorMessageNacionality('');
        self.errorMessageCountry('');
        self.errorMessagePlace('');
        self.errorMessageForeignDni('');

        var validationSuccess = false;
        if (self.validateBirthday() && self.validateNacionality() && self.validateCountry() && self.validateBornPlace() && self.validateForeignDni()) {
            validationSuccess = true;
        }

        if (validationSuccess) {
            var data = self.toJson();
            var button = $('#save_personal_data');
            button.toggleClass('loading');

            $.ajax({
                url: routeCollection.API_Remediacion_PersonalData,
                context: this,
                type: "POST",
                crossDomain: false,
                data: data,
                //contentType: 'application/json; charset=utf-8',
                contentType: "application/x-www-form-urlencoded",
                dataType: "json"
            }).done(function (data, textStatus, xhr) {
                self.errorMessage('');
                vm.gotoNextStep();
            }).fail(function (data, textStatus, xhr) {
                self.errorMessage('En estos momentos no se puede realizar la operación.');
            }).always(function () {
                button.toggleClass('loading');
            });
        }
    };
};
var pdfDocument = function (_name, _url) {
    var self = this;
    this.name = _name;
    this.url = _url;
    this.linkHtml = "<a href=" + "'" + _url + "'" + " title='Ver documento' class='link brown darken iframeLightbox pdf'><span>Ver documento</span></a>";
};
var pdfDocumentData = function () {
    var self = this;

    this.Dni = ko.observable();
    this.OtpsToken = ko.observable();
    this.OtpsTokensSigner = ko.observable();
    this.ElectronicSignatureServiceVersion = ko.observable();
    this.AccessToken = ko.observable();
    this.OtpsId = ko.observable();
    this.OtpsPins = ko.observable();
    this.DocumentList = ko.observableArray();
    this.CompleteName = ko.observable();
    this.RequestApplicantType = ko.observable();
};
var routeCollection = {
    API_Remediacion_PersonalData: sitePreffix + "/Remediacion/PersonalData",
    API_Remediacion_KnowledgeTest: sitePreffix + "/Remediacion/KnowledgeTest",
    API_Remediacion_KnowledgeTestInputFile: sitePreffix + "/Remediacion/KnowledgeTestInputFile",
    API_Remediacion_Dni: sitePreffix + "/Remediacion/Dni",
    API_Remediacion_SignatureData: sitePreffix + "/Remediacion/SignatureData",
    API_Remediacion_JuridicSignatureData: sitePreffix + "/Remediacion/JuridicSignatureData",
    API_Remediacion_CompleteProcess: sitePreffix + "/Remediacion/CompleteProcess",
    API_Remediacion_SetRemediationSigned: sitePreffix + "/Remediacion/SetRemediationSigned",
    API_Remediacion_SetJuridicRemediationSigned: sitePreffix + "/Remediacion/SetJuridicRemediationSigned",
    API_Remediacion_SendHelpMail: sitePreffix + "/Remediacion/SendHelpMail",
    API_Remediacion_LegalModalContent: sitePreffix + "/Remediacion/LegalModalContent",
};

var remediacionViewModel = function (_remediacionId, _sendType, _role, _channel, _expiredknowledgetest, _isJointSignature, _isCompletedProcess, _requestType) {
    var self = this;

    this.RequestApplicantTypeEnum = ["Cotitular", "Autorizado", "Apoderado", "Representante", "Heredero", "Beneficiario Donación", "Minusválido", "Titular Real", "Titular Real y Apoderado"];

    this.stepCollection = ko.observableArray();
    this.headerItemCollection = ko.observableArray();

    this.currentStep = ko.observable(0);
    this.dniModel = ko.observable(new dniModel());
    this.personalDataModel = ko.observable();
    this.nacionalityCollection = ko.observableArray();
    this.countryCollection = ko.observableArray();
    this.documentCollection = ko.observableArray();
    this.viaTypesCollection = ko.observableArray();
    this.provincesCollection = ko.observableArray();
    this.juridicApplicantsCollection = ko.observableArray();
    this.juridicSignersCollection = ko.observableArray();

    this.ApplicantDocumentTypes = ko.observableArray([{ id: 'DNI', valor: 'DNI' }/*, { id: 'PAS', valor: 'Pasaporte' }*/]);
    this.userValidationModel = ko.observable();
    this.remediacionId = ko.observable(_remediacionId);
    this.sendType = ko.observable(_sendType);
    this.errorMessage = ko.observable();
    this.pdfDocumentData = ko.observable();
    this.pdfDocumentDataList = ko.observableArray();
    this.personalDataTitle = ko.observable();
    this.documentDataTitle = ko.observable();
    this.testDataClienteTitle = ko.observable();
    this.testDataRepresentanteTitle = ko.observable();
    this.signatureDataTitle = ko.observable();
    this.RequestApplicantType = ko.observable(_role);
    this.currentApplicantSignatureTitle = ko.observable();
    this.currentApplicantSendingDocumentTitle = ko.observable();
    this.CurrentKnowledgeTest = ko.observable();
    this.RemediacionChannel = ko.observable(_channel);
    this.UpdateDocument = ko.observable();
    this.ForeignCountryList = ko.observableArray();
    this.UserQuestionAnswerModel = ko.observableArray([]);
    this.IsExpiredKnowledgeTest = ko.observable(_expiredknowledgetest);
    this.CurrentjuridicSigner = ko.observable();
    this.IsJointSignature = ko.observable(_isJointSignature);
    this.IsCompletedProcess = ko.observable(_isCompletedProcess);
    this.AnySigner = ko.observable(false);
    this.OtpsPins = ko.observable();
    this.RequestType = ko.observable(_requestType);
    this.IsRubricaeEventsAttached = ko.observable(false);

    this.ShowJuridicUserValidation = ko.computed(function () {
        if (self.RequestApplicantType() == '4') {
            return (self.AnySigner() == true && self.IsCompletedProcess() == false || self.AnySigner() == false && self.IsCompletedProcess() == true);
        }
        return false;
    }, this);
    this.ShowJuridicGenericError = ko.computed(function () {
        if (self.RequestApplicantType() == '4') {
            return self.IsCompletedProcess() == false && (self.AnySigner() == false || (self.isPatron() && self.isRepresentative()))
        }
        return false;
    }, this);

    this.setCurrentJuridicSigner = function (signer) {

        if (self.juridicApplicantsCollection().length >= 1) {
            self.CurrentjuridicSigner(signer != undefined ? signer : self.juridicSignersCollection().filter(function (a) { return a.hasToSign() == true })[0]);
        }
    }

    this.isActiveCompany = ko.computed(function () {
        var isActive = false;
        if (self.CurrentKnowledgeTest() != undefined && self.RequestApplicantType() === 4) {
            isActive = self.CurrentKnowledgeTest().fatcaCrsQuestion() != undefined ? self.CurrentKnowledgeTest().fatcaCrsQuestion().isActiveAnswer() : false
        }
        return isActive;
    }, this);

    this.setCurrentTitles = function () {
        self.currentApplicantSignatureTitle("Documentos personales del " + self.personalDataModel().profileText() + " " + self.personalDataModel().userName());
        self.currentApplicantSendingDocumentTitle("Pulsa en ADJUNTAR DOCUMENTOS para adjuntar una copia del DNI/NIE por las 2 caras en formato JPG o PDF (máximo " + maxsizeInMB + "MB)");
    };
    this.showCurrentStep = function () {

        var currentStepValue = self.stepCollection()[self.currentStep()];

        switch (currentStepValue.id) {
            case "userValidation":
                $('#test-content').addClass('hidden');
                $('#documents-content').addClass('hidden');
                $('#signature-documents-content').addClass('hidden');
                $('#personal-data-content').addClass('hidden');
                $('#end-content').addClass('hidden');

                $('#user-validation-content').removeClass('hidden');
                $(window).scrollTop(0);
                break;
            case "personalData":
                $('#test-content').addClass('hidden');
                $('#documents-content').addClass('hidden');
                $('#signature-documents-content').addClass('hidden');
                $('#user-validation-content').addClass('hidden');
                $('#end-content').addClass('hidden');

                $('#personal-data-content').removeClass('hidden');
                window.SetCleaveClass();
                $(window).scrollTop(0);
                break;
            case "testData":
                $('#personal-data-content').addClass('hidden');
                $('#documents-content').addClass('hidden');
                $('#signature-documents-content').addClass('hidden');
                $('#user-validation-content').addClass('hidden');
                $('#end-content').addClass('hidden');

                $('#test-content').removeClass('hidden');
                $(window).scrollTop(0);
                break;
            case "documentData":
                $('#personal-data-content').addClass('hidden');
                $('#test-content').addClass('hidden');
                $('#signature-documents-content').addClass('hidden');
                $('#user-validation-content').addClass('hidden');
                $('#end-content').addClass('hidden');

                $('#documents-content').removeClass('hidden');
                window.SetCleaveClass();
                $(window).scrollTop(0);
                break;
            case "signatureData":
                $('#personal-data-content').addClass('hidden');
                $('#test-content').addClass('hidden');
                $('#documents-content').addClass('hidden');
                $('#user-validation-content').addClass('hidden');
                $('#end-content').addClass('hidden');

                $('#signature-documents-content').removeClass('hidden');
                $('#signature-content-head').removeClass('hidden');
                $('#signature-document-content-head').addClass('hidden');

                $('#signature-content').removeClass('hidden');
                $('#signature-content-download').addClass('hidden');
                $('#signature-content-post').addClass('hidden');
                $(window).scrollTop(0);
                break;
            case "signatureDataDownload":
                $('#personal-data-content').addClass('hidden');
                $('#test-content').addClass('hidden');
                $('#documents-content').addClass('hidden');
                $('#user-validation-content').addClass('hidden');
                $('#end-content').addClass('hidden');

                $('#signature-documents-content').removeClass('hidden');
                $('#signature-content-head').removeClass('hidden');
                $('#signature-document-content-head').addClass('hidden');

                $('#signature-content').addClass('hidden');
                $('#signature-content-download').removeClass('hidden');
                $('#signature-content-post').addClass('hidden');
                $(window).scrollTop(0);
                break;
            case "signatureDataPost":
                $('#personal-data-content').addClass('hidden');
                $('#test-content').addClass('hidden');
                $('#documents-content').addClass('hidden');
                $('#user-validation-content').addClass('hidden');
                $('#end-content').addClass('hidden');

                $('#signature-documents-content').removeClass('hidden');
                $('#signature-content-head').removeClass('hidden');
                $('#signature-document-content-head').addClass('hidden');

                $('#signature-content').addClass('hidden');
                $('#signature-content-download').addClass('hidden');
                $('#signature-content-post').removeClass('hidden');
                $(window).scrollTop(0);
                break;
            case "signatureDocumentData":
                $('#personal-data-content').addClass('hidden');
                $('#test-content').addClass('hidden');
                $('#documents-content').addClass('hidden');
                $('#user-validation-content').addClass('hidden');
                $('#end-content').addClass('hidden');

                $('#signature-documents-content').removeClass('hidden');
                $('#signature-document-content-head').removeClass('hidden');
                $('#signature-content-head').addClass('hidden');
                $(window).scrollTop(0);
                break;
            case "endView":
                $('#personal-data-content').addClass('hidden');
                $('#documents-content').addClass('hidden');
                $('#signature-documents-content').addClass('hidden');
                $('#user-validation-content').addClass('hidden');
                $('#test-content').addClass('hidden');

                $('#end-content').removeClass('hidden');
                $(window).scrollTop(0);

                if (self.RequestType() == RequestTypeEnum.TEST || self.RequestType() == RequestTypeEnum.TEST_DNI) {
                    window.launchAjax(routeConfig.GA_Register_PopPup_popup_test_remediation_finished);
                }

                break;
        };

        if (currentStepValue.callback) {
            currentStepValue.callback();
        }

        self.setProcessTracker($('[data-step^="' + currentStepValue.id + '"]').data('circle'), $('[data-step^="' + currentStepValue.id + '"]').data('progress'));
    };
    this.gotoNextStep = function () {
        customDebug(self.currentStep(), 'gotoNextStep current');
        customDebug(self.stepCollection(), 'gotoNextStep collection')
        if (self.currentStep() + 1 < self.stepCollection().length) {
            self.currentStep(self.currentStep() + 1);
            self.showCurrentStep();
        }
    };
    this.gotoPreviousStep = function () {
        if (self.currentStep() - 1 >= 0) {
            self.currentStep(self.currentStep() - 1);
            self.showCurrentStep();
        }
    };
    this.setProcessTracker = function (progressItem, perc) {
        $('.module_list-element').removeClass('active').removeClass('complete').addClass('inactive');

        if (self.RequestApplicantType() === 4) {
            progressItem = progressItem - 1;
        }

        if (progressItem > 1) {
            var currentProgress = 1;
            while (currentProgress < progressItem) {
                $('.module_list-element').each(function () {
                    var elem = $(this);
                    if (elem.is('#progress-' + currentProgress)) {
                        elem.attr('data-perc', 100).addClass('complete').removeClass('inactive').addClass('active');
                    }
                })
                currentProgress++;
            }
            self.updateCircles();
        }

        $('.module_list-element').each(function () {
            var elem = $(this);

            if (elem.is('#progress-' + progressItem)) {

                elem.removeClass('inactive').addClass('active');

                if (perc < 100) {
                    elem.attr('data-perc', perc);
                    self.updateCircles();
                }

                if (perc >= 100) {
                    elem.attr('data-perc', 100);
                    self.updateCircles();
                }
            }
        })

    };
    this.updateCircles = function () {
        var $circles = jQuery('.circle_complete');

        $circles.each(function () {

            var $circle = jQuery(this),
                radius = $circle.attr('r'),
                $li = $circle.closest('.module_list-element'),
                perc = $li.attr('data-perc'),
                $number = $li.find('.number-data'),
                zero,
                newOffset,
                opacity,
                clase = $li.attr('class');

            zero = Math.PI * radius * 2;
            newOffset = zero - (zero * (perc / 100));

            opacity = (.3 + (.7 * (Number(perc) / 100)));

            $circle.css('stroke-dashoffset', newOffset);
            $number.css('opacity', opacity);
        });
    };

    this.setProvincesList = function (list) {
        self.provincesCollection.pushAll($.map(list, function (item) {
            return new Valor(item.id, item.valor);
        }));
    };

    this.getProvinceByName = function (name) {
        var provinces =
            $.grep(self.provincesCollection(), function (e) {
                return e.valor.toUpperCase() == name.toUpperCase();
            });
        return provinces[0];
    };

    this.setNationalityList = function (list) {
        self.nacionalityCollection.pushAll($.map(list, function (item) {
            return new Valor(item.id, item.valor);
        }));
    };

    this.setViaTypesList = function (viaTypes) {
        self.viaTypesCollection.pushAll($.map(viaTypes, function (item) {
            return new Valor(item.id, item.valor);
        }));
    }

    this.getViaTypeNameById = function (id) {
        var found = self.viaTypesCollection().find(function (elem) {
            return elem.id == id;
        });

        if (found == undefined)
            return '';

        return found.valor;
    };

    this.setCountryList = function (list) {
        self.countryCollection.pushAll($.map(list, function (item) {
            return new Valor(item.id, item.valor);
        }));

        var foreigncountries = self.countryCollection().filter(function (elem) {
            if (elem.id != 1) {
                return new Valor(elem.id, elem.valor);
            }
        })

        self.ForeignCountryList(foreigncountries);
    };

    this.getCountryNameById = function (id) {
        var found = self.countryCollection().find(function (elem) {
            return elem.id == id;
        });

        if (found == undefined)
            return '';

        return found.valor;
    };
    this.setJuridicApplicants = function (_juridicApplicants) {
        self.juridicApplicantsCollection(_juridicApplicants);
    }

    this.setJuridicSigners = function (_juridicApplicants) {
        var signers = _juridicApplicants.filter(function (a) {
            return a.RequestApplicantTypeId === RequestApplicantTypeEnum.APODERADO
                || a.RequestApplicantTypeId === RequestApplicantTypeEnum.TITULARREALANDAPODERADO
                || a.RequestApplicantTypeId === RequestApplicantTypeEnum.ADMINISTRADOR
                || a.RequestApplicantTypeId === RequestApplicantTypeEnum.APODERADOYADMINISTRADOR
                || a.RequestApplicantTypeId === RequestApplicantTypeEnum.PATRONOYAPODERADO
                || a.RequestApplicantTypeId === RequestApplicantTypeEnum.ORGANOREPRESENTACIONYAPODERADO;
        });
        signers.forEach(function (s) {
            var pdm = new PersonalDataModel(
                '',
                '',
                '',
                '',
                '',
                '',
                s.Name,
                s.FirstSurname,
                s.SecondSurname,
                s.DocumentNumber,
                s.Email,
                s.MobilePhoneNumber,
                '',
                '',
                '',
                s.RdCode,
                s.RequestApplicantTypeId,
                s.HasToSign,
                false,
            );
            if (s.HasToSign == true) {
                self.juridicSignersCollection().push(pdm);
            }
        });

        if (self.juridicSignersCollection().length >= 1) {
            self.AnySigner(true);
            self.setCurrentJuridicSigner();
        }
    }

    this.isRealOwner = ko.computed(function () {
        var isRealOwner = false;
        if (self.juridicApplicantsCollection() != undefined) {
            isRealOwner = self.juridicApplicantsCollection().some(function (a) {
                return a.RequestApplicantTypeId == RequestApplicantTypeEnum.TITULARREAL
                    || a.RequestApplicantTypeId == RequestApplicantTypeEnum.TITULARREALANDAPODERADO;
            })
        }
        return isRealOwner;
    }, this);

    this.isAdmin = ko.computed(function () {
        var isAdmin = false;
        if (self.juridicApplicantsCollection() != undefined) {
            isAdmin = self.juridicApplicantsCollection().some(function (a) {
                return a.RequestApplicantTypeId == RequestApplicantTypeEnum.ADMINISTRADOR
                    || a.RequestApplicantTypeId == RequestApplicantTypeEnum.APODERADOYADMINISTRADOR;
            })
        }
        return isAdmin;
    }, this);

    this.isPatron = ko.computed(function () {
        var isPatron = false;
        if (self.juridicApplicantsCollection() != undefined) {
            isPatron = self.juridicApplicantsCollection().some(function (a) {
                return a.RequestApplicantTypeId == RequestApplicantTypeEnum.PATRONO
                    || a.RequestApplicantTypeId == RequestApplicantTypeEnum.PATRONOYAPODERADO;
            })
        }
        return isPatron;
    }, this);

    this.isRepresentative = ko.computed(function () {
        var isRepresentative = false;
        if (self.juridicApplicantsCollection() != undefined) {
            isRepresentative = self.juridicApplicantsCollection().some(function (a) {
                return a.RequestApplicantTypeId == RequestApplicantTypeEnum.ORGANOREPRESENTACION
                    || a.RequestApplicantTypeId == RequestApplicantTypeEnum.ORGANOREPRESENTACIONYAPODERADO
                    || a.RequestApplicantTypeId == RequestApplicantTypeEnum.JUNTADIRECTIVA;
            })
        }
        return isRepresentative;
    }, this);

    this.setPersonalDataModel = function (_personalDataModel) { self.personalDataModel(_personalDataModel); };
    this.setKnowledgeTestModel = function (_userQuestionAnswerModel) {
        if (self.RequestApplicantType() === 1) {
            self.CurrentKnowledgeTest(new KnowledgeTest(self.personalDataModel().fiscalCountry(), _userQuestionAnswerModel));
        }
        else if (self.RequestApplicantType() === 2) {
            self.CurrentKnowledgeTest(new KnowledgeTestRepresentative(self.personalDataModel().fiscalCountry(), _userQuestionAnswerModel));
        }
        else if (self.RequestApplicantType() === 3) {
            self.CurrentKnowledgeTest(new KnowledgeTestTutor(self.personalDataModel().fiscalCountry(), _userQuestionAnswerModel));
        } else if (self.RequestApplicantType() === 4) {
            self.CurrentKnowledgeTest(new KnowledgeTestJuridica(self.personalDataModel().fiscalCountry(), _userQuestionAnswerModel));
        } else {
            self.CurrentKnowledgeTest(new KnowledgeTestRepresentative(self.personalDataModel().fiscalCountry(), _userQuestionAnswerModel));
        }

        self.UserQuestionAnswerModel(_userQuestionAnswerModel);
        self.CurrentKnowledgeTest().loadQuestionAnswer();
    };
    this.setUserValidationModel = function (_userValidationModel) { self.userValidationModel(_userValidationModel); };

    this.createSignatureData = function () {
        if (self.RequestApplicantType() === 4 && self.juridicSignersCollection().length >= 1) {
            if (self.juridicSignersCollection().some(function (a) { return a.checkEmail() == false })) {
                self.juridicSignersCollection().forEach(function (a) {
                    a.errorMessageEmail('');
                    a.errorMessageMobilePhone('');
                    if (a.checkEmail()) {
                    } else {
                        self.errorMessage('Los datos introducidos no son correctos');
                    }
                });
            } else {
                var dataCollection =
                {
                    RemediacionId: self.remediacionId(),
                    RemediacionModelList: []
                };

                self.juridicSignersCollection().forEach(function (a) {
                    var phoneNumber = a.phoneNumber().startsWith("+") ? a.phoneNumber() : a.phonePrefix() + a.phoneNumber()
                    var data = {
                        RemediacionId: self.remediacionId(),
                        ClientId: a.clientId(),
                        Signature: {
                            PhoneNumber: phoneNumber,
                            Email: a.email()
                        },
                        Dni: {
                            Dni: a.dni()
                        }
                    };
                    dataCollection.RemediacionModelList.push(data);
                });

                var button = $('#save-signature-data');
                var div = $('#document-wait');
                button.toggleClass('loading');
                div.toggleClass('hidden');
                $.ajax({
                    url: routeCollection.API_Remediacion_JuridicSignatureData,
                    context: this,
                    type: "POST",
                    crossDomain: false,
                    data: dataCollection,
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded"
                }).done(function (data, textStatus, xhr) {
                    if (data.length == 0) {
                        self.errorMessage('En estos momentos no podemos realizar la operación. Por favor, inténtelo en otro momento.');
                    }
                    else {
                        var obj = data
                        self.setCurrentJuridicSigner();
                        var pdfdocumentlist = self.getDocuments(obj);
                        self.filterJuridicDocumentCollection(pdfdocumentlist);

                        self.documentCollection(self.pdfDocumentData().DocumentList());
                        self.errorMessage('');
                        self.gotoNextStep();
                    }
                }).fail(function (data, textStatus, xhr) {
                    self.errorMessage('En estos momentos no podemos realizar la operación. Por favor, inténtelo en otro momento.');
                }).always(function () {
                    button.toggleClass('loading');
                    div.toggleClass('hidden');
                });
            }
        } else {
            self.personalDataModel().errorMessageEmail('');
            self.personalDataModel().errorMessageMobilePhone('');

            if (self.personalDataModel().checkEmail()) {

                var data = {
                    RemediacionId: self.remediacionId(),
                    ClientId: self.userValidationModel().clientId(),
                    Signature: {
                        PhoneNumber: self.personalDataModel().phonePrefix() + self.personalDataModel().phoneNumber(),
                        Email: self.personalDataModel().email()
                    }
                };
                var button = $('#save-signature-data');
                var div = $('#document-wait');
                button.toggleClass('loading');
                div.toggleClass('hidden');

                $.ajax({
                    url: routeCollection.API_Remediacion_SignatureData,
                    context: this,
                    type: "POST",
                    crossDomain: false,
                    data: data,
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded"
                }).done(function (data, textStatus, xhr) {
                    if (data.length == 0) {
                        self.errorMessage('En estos momentos no podemos realizar la operación. Por favor, inténtelo en otro momento.');
                    }
                    else {
                        var obj = data;
                        var pdfdocumentlist = self.getDocuments(obj);
                        self.filterDocumentCollection(pdfdocumentlist);

                        self.documentCollection(self.pdfDocumentData().DocumentList());
                        self.errorMessage('');
                        self.gotoNextStep();
                    }
                }).fail(function (data, textStatus, xhr) {
                    self.errorMessage('En estos momentos no podemos realizar la operación. Por favor, inténtelo en otro momento.');
                }).always(function () {
                    button.toggleClass('loading');
                    div.toggleClass('hidden');
                });
            }
            else {
                self.errorMessage('Los datos introducidos no son correctos');
            }
        }
    };

    this.getDocuments = function (data) {
        var DocumentList = [];

        $.each(data, function (i, item) {
            var _pdfdocument = new pdfDocumentData();
            _pdfdocument.Dni(data[i].Dni);
            _pdfdocument.OtpsToken(data[i].OtpsToken);
            _pdfdocument.OtpsTokensSigner(data[i].OtpsTokensSigner);
            _pdfdocument.ElectronicSignatureServiceVersion(data[i].ElectronicSignatureServiceVersion);
            _pdfdocument.AccessToken(data[i].AccessToken);
            _pdfdocument.OtpsId(data[i].OtpsId);
            _pdfdocument.OtpsPins(data[i].OtpsPins);

            var doc = data[i].DocumentList;
            var doclist = [];

            $.each(doc, function (i, item) {
                doclist.push(new PdfDocument(doc[i].Label, doc[i].Url));
            });

            _pdfdocument.DocumentList(doclist);

            DocumentList.push(_pdfdocument);
        });

        return DocumentList;
    };
    this.callCompleteProcess = function () {
        var data = {
            RemediacionId: self.remediacionId(),
            ClientId: self.userValidationModel().clientId(),
            UpdateDocument: self.UpdateDocument(),
            PersonalData: {
                SendType: self.sendType()
            }
        };

        $.ajax({
            url: routeCollection.API_Remediacion_CompleteProcess,
            context: this,
            type: "POST",
            crossDomain: false,
            data: data,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded"
        }).done(function (data, textStatus, xhr) {
            console.log("Process completed");
        }).fail(function (data, textStatus, xhr) {
            self.errorMessage('En estos momentos no podemos realizar la operación. Por favor, inténtelo en otro momento.');
        });
    };

    this.filterDocumentCollection = function (docs) {

        //Guardar documentos del titular
        var filterlist = (
            $.grep(docs, function (e) {
                return e.Dni().toUpperCase() == self.personalDataModel().dni().toUpperCase();
            })
        );

        if (filterlist.length == 1) {
            self.pdfDocumentData(filterlist[0]);
        };

        var intentos = 1;
        var maxintentos = 3;
        var intervalid;

        $('#signature-box').block({ message: null });

        intervalid = setInterval(function () {
            customDebug(intentos, 'Reintentos de carga de otp');
            appInsights.trackEvent("Intento de cargar componente de firma", { Intento: intentos, Maximo: 3 });
            if (intentos <= maxintentos && !self.IsOtpComponentLoaded()) {
                if (filterlist.length == 1) {
                    self.initSignApplicantDocument();
                };
            } else if (intentos > maxintentos || !self.IsOtpComponentLoaded()) {
                try {
                    throw new Error('Ha fallado el componente de firma tras 3 intentos')
                } catch (e) {
                    appInsights.trackException(
                        new Error(e)
                    );
                    $('#signature-box').unblock({ message: null });
                    clearInterval(intervalid);
                }
            } else {
                $('#signature-box').unblock({ message: null });
                clearInterval(intervalid);
            }
            intentos++;
        }, 3000);
    };

    this.filterJuridicDocumentCollection = function (docs, recall = false) {

        //Guardar documentos del titular
        var filterlist = (
            $.grep(docs, function (e) {
                return e.Dni().toUpperCase() == self.CurrentjuridicSigner().dni().toUpperCase();
            })
        );

        if (filterlist.length == 1) {
            self.pdfDocumentData(filterlist[0]);
        };

        self.pdfDocumentDataList(docs);
        self.pdfDocumentData().OtpsPins();

        var intentos = 1;
        var maxintentos = 3;
        var intervalid;

        $('#signature-box').block({ message: null });

        if (recall) {
            $('#success-signature').toggleClass('hidden');
            $('#signature-document-content').unblock({ message: null });
            self.initSignApplicantDocument();
        } else {
            intervalid = setInterval(function () {
                customDebug(intentos, 'Reintentos de carga de otp');
                appInsights.trackEvent("Intento de cargar componente de firma", { Intento: intentos, Maximo: 3 });
                if (intentos <= maxintentos && !self.IsOtpComponentLoaded()) {
                    if (filterlist.length == 1) {
                        self.initSignApplicantDocument();
                    };
                } else if (intentos > maxintentos || !self.IsOtpComponentLoaded()) {
                    try {
                        throw new Error('Ha fallado el componente de firma tras 3 intentos')
                    } catch (e) {
                        appInsights.trackException(
                            new Error(e)
                        );
                        $('#signature-box').unblock({ message: null });
                        clearInterval(intervalid);
                    }
                } else {
                    $('#signature-box').unblock({ message: null });
                    clearInterval(intervalid);
                }
                intentos++;
            }, 3000);
        }
    };


    this.IsOtpComponentLoaded = function () {
        if (self.pdfDocumentData().ElectronicSignatureServiceVersion() == 1) {
            var loaded = $('#OtpSecureSubmit').length > 0;
            return loaded;
        } else if (self.pdfDocumentData().ElectronicSignatureServiceVersion() == 2) {
            //var loaded = $('#ro-button-container').length > 0;
            //return loaded;
            return self.IsRubricaeEventsAttached();
        } else {
            var loaded = $('bst-sign-otp').length > 0;
            return loaded;
        }
    }

    this.destroySignApplicantDocument = function () {
        customDebug(self.pdfDocumentData().ElectronicSignatureServiceVersion(), 'destroySignApplicantDocument');

        var rOtps = document.getElementById('r-otps');
        if (rOtps) {
            customDebug(rOtps, 'destroySignApplicantDocument');
            rOtps.parentElement.removeChild(rOtps);
        }

        var bstSingOtp = document.getElementsByTagName('bst-sign-otp');
        if (bstSingOtp && bstSingOtp.length > 0) {
            customDebug(bstSingOtp[0], 'destroySignApplicantDocument');
            bstSingOtp[0].parentElement.removeChild(bstSingOtp[0]);
        }
    }

    this.initSignApplicantDocument = function () {
        customDebug(self.pdfDocumentData().ElectronicSignatureServiceVersion(), 'initSignApplicantDocument');
        if (self.pdfDocumentData().ElectronicSignatureServiceVersion() === 3) {
            // Limpiamos el componente de firma
            self.destroySignApplicantDocument();
            self.showErrorSignApplicantDocument('');
            $('#success-signature').addClass('hidden');
            $('#contact-signature').addClass('hidden');


            var canSkip = true;
            var anySigned = self.juridicSignersCollection().some(function (a) { return a.hasSigned() });

            if (self.juridicSignersCollection().length > 1) {
                var index = self.juridicSignersCollection().findIndex(a => a.dni().toUpperCase() == self.CurrentjuridicSigner().dni().toUpperCase());
                if (index >= (self.juridicSignersCollection().length - 1)) {
                    canSkip = false;
                }
            }
            else {
                canSkip = false;
            }
            customDebug('Interviniente no presente ' + !self.IsJointSignature() + '-' + anySigned + '-' + canSkip, 'Bestinver.Skip');


            var bstSO = document.createElement('bst-sign-otp');
            bstSO.setAttribute('url-signature-issuer', urlSignatureIssuerApi);
            bstSO.setAttribute('id-signature', self.pdfDocumentData().OtpsToken());
            bstSO.setAttribute('locale', 'es');
            bstSO.setAttribute('show-no-present-link', (!self.IsJointSignature() && (anySigned || canSkip)).toString());
            bstSO.setAttribute('show-resend-otp-link', 'false');
            bstSO.setAttribute('text-button', 'Firmar');
            bstSO.setAttribute('text-placeholder', 'Introduce el PIN recibido por SMS');


            // Añadir el div al inicio de rOtps                     
            var containerBestinverOTP = document.getElementById('validarBestinverOTP-form');
            containerBestinverOTP.appendChild(bstSO);
            containerBestinverOTP.style.display = 'block';

            //Añadir codigo de Juridica
            if (self.juridicSignersCollection().length >= 1) {
                self.OtpsPins(self.pdfDocumentData().OtpsPins());
            }

            bstSO.addEventListener('otpSignOK', (data) => {
                console.log('otpSignOK event fired', data);
                self.handdleBestinverOtpOk(data);
            })
            bstSO.addEventListener('otpNotPresent', (data) => {
                console.log('otpNotPresent event fired', data);
                //Establecemos el siguiente firmante/completamos el proceso
                self.goToNextJuridicSigner();
            })
            bstSO.addEventListener('otpComponentLoaded', (data) => {
                console.log('otpComponentLoaded event fired', data);
                $('#signature-box').unblock({ message: null });
            })
            bstSO.addEventListener('otpSignKO', (data) => {
                console.log('otpSignKO event fired', data);
            })
            bstSO.addEventListener('otpCancelled', (data) => {
                console.log('otpCancelled event fired', data);
                self.handdleBestinverOtpExpired(data);
            })
            bstSO.addEventListener('otpExpired', (data) => {
                console.log('otpExpired event fired', data);
                self.handdleBestinverOtpExpired(data);
            })
            bstSO.addEventListener('otpRequestCode', (data) => {
                console.log('otpRequestCode event fired', data);
            })
            bstSO.addEventListener('otpError', (data) => {
                console.log('otpError event fired', data);
            })
        }
        else if (self.pdfDocumentData().ElectronicSignatureServiceVersion() === 2) {
            // Limpiamos el componente de firma
            self.destroySignApplicantDocument();
            self.showErrorSignApplicantDocument('');

            // Crear el componente de firma
            var rOtps = document.createElement('r-otps');
            rOtps.setAttribute('id', 'r-otps');
            rOtps.setAttribute('oid', self.pdfDocumentData().OtpsToken());
            rOtps.setAttribute('sid', self.pdfDocumentData().OtpsTokensSigner());
            rOtps.setAttribute('token', self.pdfDocumentData().AccessToken());
            rOtps.setAttribute('showdocument', 'false');
            rOtps.setAttribute('automaticdownload', 'false');
            rOtps.setAttribute('textbutton', 'Firmar');
            rOtps.setAttribute('textplaceholder', 'Introduce el PIN recibido por SMS');

            // Crear el div con el subtitle antes de pintar el componente
            self.showRubricaeSubtitle();

            // Añadir el div al inicio de rOtps                        
            document.getElementById('validarRubricaeOTP-form').appendChild(rOtps);

            $('#signature-box').unblock({ message: null });

            //Añadir codigo de Juridica
            if (self.juridicSignersCollection().length >= 1) {
                self.OtpsPins(self.pdfDocumentData().OtpsPins());
            }

            // Escuchar el evento "signedEvent" si no esta registrado
            if (self.IsRubricaeEventsAttached() === false) {
                self.IsRubricaeEventsAttached(true);
                window.addEventListener("signedEvent", function (event) {
                    if (!event.origin) {
                        self.handdleRubricaeEventSigned(event);
                    }
                });

                window.addEventListener("loadedEvent", function (event) {
                    if (!event.origin) {
                        self.handdleRubricaeEventLoaded(event);
                    }
                });
            }
        }
    };

    this.handdleBestinverOtpOk = function (data) {
        customDebug('Bestinver.OtpOk', data);
        var containerBestinverOTP = document.getElementById('validarBestinverOTP-form');
        containerBestinverOTP.style.display = 'none';

        self.setRemediationSigned();

        $('#success-signature').toggleClass('hidden');

        if (self.RequestApplicantType() === 4 && self.juridicSignersCollection().length > 1) {
            self.updateJuridicSignerCollectionStatus();
            self.goToNextJuridicSigner();
        } else {
            self.gotoNextStep();
        }
    }

    this.handdleBestinverOtpExpired = function (data) {
        customDebug('Bestinver.Expired', data);

        $('#contact-signature').toggleClass('hidden');
    }

    this.showRubricaeSubtitle = function () {
        var subtitleRubricaeElement = document.querySelector('#validarRubricaeOTP-form .ro-subtitle-rubricae');
        if (subtitleRubricaeElement) {
            subtitleRubricaeElement.style.display = 'block';
        }
        else {
            // Crear el div con el h4 dentro
            var rubricaeSubtitle = document.createElement('div');
            var subtitle = document.createElement('h4');
            subtitle.className = 'ro-subtitle-rubricae';
            subtitle.textContent = 'La introducción del código recibido por SMS sustituiría la firma manuscrita del test de conocimiento.';
            rubricaeSubtitle.appendChild(subtitle);

            // Añadir el div al inicio de rOtps            
            document.getElementById('validarRubricaeOTP-form').appendChild(rubricaeSubtitle);
        }
    }

    this.hideRubricaeSubtitle = function () {
        var subtitleRubricaeElement = document.querySelector('#validarRubricaeOTP-form .ro-subtitle-rubricae');
        if (subtitleRubricaeElement) {
            subtitleRubricaeElement.style.display = 'none';
        }
    }

    this.handdleRubricaeEventLoaded = function (event) {
        customDebug(event, 'Rubricae Loaded Event');

        //HACK: Esperar a que se cargue el componente de firma ya que aunque se ejecute el evento de eventloadded aun no se han cargado los elementos
        const intervalId = setInterval(() => {
            if ($('#ro-button').length > 0 && $('#ro-otp-input').length > 0) {
                $('#ro-button').click(function (e) {
                    if ($('#ro-otp-input').val() !== '') {
                        $('#ro-button').addClass('loading');
                    }
                });
                $('#ro-otp-input').on("input", function () {
                    if ($('#ro-otp-input').val() === '') {
                        self.showErrorSignApplicantDocument('OTP VACIO');
                    } else {
                        self.showErrorSignApplicantDocument('');
                    }
                });

                var canSkip = true;
                var anySigned = self.juridicSignersCollection().some(function (a) { return a.hasSigned() });

                if (self.juridicSignersCollection().length > 1) {
                    var index = self.juridicSignersCollection().findIndex(a => a.dni().toUpperCase() == self.CurrentjuridicSigner().dni().toUpperCase());
                    if (index >= (self.juridicSignersCollection().length - 1)) {
                        canSkip = false;
                    }
                }
                else {
                    canSkip = false;
                }
                customDebug('Interviniente no presente ' + !self.IsJointSignature() + '-' + anySigned + '-' + canSkip, 'Rubricae.Skip');
                if (!self.IsJointSignature() && (anySigned || canSkip)) {
                    $('#ro-button').after('<button id="SignSkip" class="link darken"><span>Interviniente no presente</span></button>');
                    $('#SignSkip').click(function (e) {
                        e.preventDefault();
                        $('#success-signature').toggleClass('hidden');
                        //Establecemos el siguiente firmante/completamos el proceso
                        self.goToNextJuridicSigner();
                    });
                }

                clearInterval(intervalId);
            }
        }, 100)
    }

    this.handdleRubricaeEventSigned = function (event) {
        // Obtener el valor de event.detail.signed
        var signed = event.detail.signed;
        var eventCode = event.detail.eventCode;

        customDebug(event, 'Rubricae Event');

        // Eliminar la clase loading del botón
        $('#ro-button').removeClass('loading');
        //HACK: Eliminar la clase loading del botón ya que en casos como OTP Vacío se ejecuta antes "EventSigned" que el "click" del boton que asociamos en "EventLoaded"
        setTimeout(function () { $('#ro-button').removeClass('loading'); }, 2000);

        // Lógica a ejecutar si la firma es correcta
        if (signed) {
            self.handdleRubricaeOtpOk(eventCode);
        } else if (eventCode != 1) {
            var codeSign = document.getElementById('ro-otp-input').value;
            if (codeSign.trim() == '') {
                self.handdleRubricaeOtpEmpty(eventCode);
            } else {
                self.handdleRubricaeOtpExpired(eventCode);
            }
        }
        else {
            self.handdleRubricaeOtpKo(eventCode);
        }
    }

    this.handdleRubricaeOtpOk = function (eventCode) {
        self.hideRubricaeSubtitle();

        self.setRemediationSigned();
        $('#success-signature').toggleClass('hidden');
        if (self.RequestApplicantType() === 4 && self.juridicSignersCollection().length > 1) {
            self.updateJuridicSignerCollectionStatus();
            self.goToNextJuridicSigner();
        } else {
            self.gotoNextStep();
        }
    }

    this.handdleRubricaeOtpExpired = function (eventCode) {
        customDebug('Event Code ' + eventCode, 'Rubricae.Error');

        $('#contact-signature').toggleClass('hidden');

        self.showErrorSignApplicantDocument('Se ha superado el número máximo de intentos erroneos.');
    }

    this.handdleRubricaeOtpKo = function (eventCode) {
        if (document.getElementById('ro-otp-input').value == '') {
            customDebug('Event Code ' + eventCode, 'Rubricae.Pin Vacío');
            if (document.getElementById('errorRubricaeSignature')) {
                self.showErrorSignApplicantDocument('OTP VACÍO');
            }
        }
        else {
            customDebug('Event Code ' + eventCode, 'Rubricae.Pin Incorrecto');
            self.showErrorSignApplicantDocument('PIN INCORRECTO');
        }
    }

    this.handdleRubricaeOtpEmpty = function (eventCode) {
        customDebug('Event Code ' + eventCode, 'Rubricae.Pin Vacío');
        if (document.getElementById('errorRubricaeSignature')) {
            Self.showErrorSignApplicantDocument('OTP INVÁLIDO');
        }
    }

    this.showErrorSignApplicantDocument = function (message) {
        if (!document.getElementById('errorRubricaeSignature')) {
            // Crear el nuevo div cuando la firma no es correcta
            var errorDiv = document.createElement('div');
            errorDiv.id = 'errorRubricaeSignature';
            errorDiv.className = 'errorRubricaeSignature';
            errorDiv.textContent = message;

            // Obtener el contenedor donde se insertará el nuevo div
            var container = document.getElementById('validarRubricaeOTP-form');
            if (container) {
                container.insertAdjacentElement('afterend', errorDiv);
            }
        }
        else {
            document.getElementById('errorRubricaeSignature').textContent = message;
        }
    }

    this.getNextApplicantSigner = function () {
        var index = self.juridicSignersCollection().findIndex(a => a.dni().toUpperCase() == self.CurrentjuridicSigner().dni().toUpperCase());
        return self.juridicSignersCollection()[index + 1];
    }

    this.updateJuridicSignerCollectionStatus = function () {
        var currentSigner = self.CurrentjuridicSigner();
        self.juridicSignersCollection().forEach(function (a) {
            if (a.dni().toUpperCase() == currentSigner.dni().toUpperCase()) {
                a.hasSigned(true);
            }
        });
    }

    this.goToNextJuridicSigner = function () {
        customDebug('GoToNextJuridicSigner', 'Rubricae.NextSigner');
        var applicant = self.getNextApplicantSigner();
        if (applicant != undefined) {
            self.setCurrentJuridicSigner(applicant);

            self.filterJuridicDocumentCollection(self.pdfDocumentDataList(), true);
            self.OtpsPins("");

            self.documentCollection(self.pdfDocumentData().DocumentList());
            self.errorMessage('');
        } else {
            self.gotoNextStep();
        }
    }

    this.sendSignatureDataByEmail = function () {
        self.gotoNextStep();
    };


    this.loadStepCollection = function (_updateDocument, _updateTest, _pendingSign) {

        self.stepCollection().push({ id: "userValidation", descripcion: "Validación del documento de identidad" });

        if (self.RemediacionChannel() == 1 && self.RequestApplicantType() != 4) {
            self.stepCollection().splice(1, 0, { id: "personalData", descripcion: "Datos personales y contacto" });
            self.stepCollection().push({ id: "testData", descripcion: "Test de conocimiento" });

            self.headerItemCollection().splice(0, 0, { id: "personalData", descripcion: "Datos personales y contacto" });
            self.headerItemCollection().push({ id: "testData", descripcion: "Test de conocimiento" });

            _updateDocument = false;
            _updateTest = false;
        }

        if (_updateTest) {
            if (self.RequestApplicantType() != 4) {
                self.stepCollection().splice(1, 0, { id: "personalData", descripcion: "Datos personales y contacto" });

                self.headerItemCollection().splice(0, 0, { id: "personalData", descripcion: "Datos personales y contacto" });
            }

            self.stepCollection().push({ id: "testData", descripcion: "Test de conocimiento" });
            self.headerItemCollection().push({ id: "testData", descripcion: "Test de conocimiento" });

            if (self.sendType() == 1) {
                self.stepCollection().push({ id: "signatureData", descripcion: "Firma" });
                self.stepCollection().push({ id: "signatureDocumentData", descripcion: "Firma" });

                self.headerItemCollection().push({ id: "signatureData", descripcion: "Firma" });
            }
        }

        if (_pendingSign) {
            self.stepCollection().push({ id: "signatureData", descripcion: "Firma" });
            self.stepCollection().push({ id: "signatureDocumentData", descripcion: "Firma" });
            self.headerItemCollection().push({ id: "signatureData", descripcion: "Firma" });
        }

        if (_updateDocument) {
            self.stepCollection().push({ id: "documentData", descripcion: "Documento de identificación" });
            self.headerItemCollection().push({ id: "documentData", descripcion: "Documento de identificación" });
        }

        self.stepCollection().push({
            id: "endView", descripcion: "Firma", callback: function () {
                self.callCompleteProcess();
            }
        });

        self.UpdateDocument(_updateDocument);

        self.loadTitles();
    };
    this.loadTitles = function () {
        var index = self.headerItemCollection.indexOf(self.headerItemCollection().find(function (a) { return a.id == 'personalData'; }));
        self.personalDataTitle((index + 1) + '. Datos personales');

        index = self.headerItemCollection.indexOf(self.headerItemCollection().find(function (a) { return a.id == 'documentData'; }));
        self.documentDataTitle((index + 1) + '. Documento de identificación');

        index = self.headerItemCollection.indexOf(self.headerItemCollection().find(function (a) { return a.id == 'testData'; }));
        self.testDataClienteTitle((index + 1) + '. Test de cliente - Conocimiento');

        index = self.headerItemCollection.indexOf(self.headerItemCollection().find(function (a) { return a.id == 'testData'; }));
        self.testDataRepresentanteTitle((index + 1) + '. Test de representante - Conocimiento');

        index = self.headerItemCollection.indexOf(self.headerItemCollection().find(function (a) { return a.id == 'signatureData'; }));
        self.signatureDataTitle((index + 1) + '. Firma de documentación');
    };

    this.SaveKnowledgeTest = function () {
        if (self.sendType() == 1 || self.RemediacionChannel() == 1) {
            self.saveKnowledgeTestQuestionCollection();
        }
        else {
            self.saveKnowledgeTestInpuFile();
        }
    };

    this.saveKnowledgeTestQuestionCollection = function () {
        if (self.CurrentKnowledgeTest().IsOk()) {
            var answers = self.CurrentKnowledgeTest().getQuestionsAnswer();

            var data = {
                "RemediacionId": self.remediacionId(),
                "Answers": answers,
                "KnowledgeFile": self.testInputFile(),
                "ClientId": self.userValidationModel().clientId(),
                "PersonalData": {
                    "Role": self.RequestApplicantType(),
                    "SendType": self.sendType()
                },
                "RemediacionChannel": self.RemediacionChannel(),
                "UpdateDocument": self.UpdateDocument(),
                "IsExpiredKnowledgeTest": self.IsExpiredKnowledgeTest(),
            };

            if (vm.RequestApplicantType() === 4) {
                var juridicApplicants = self.juridicApplicantsCollection();
                var currentJuridicOwners = self.CurrentKnowledgeTest().owners();

                if (currentJuridicOwners != undefined) {
                    juridicApplicants.forEach(function callback(a, index) {
                        var applicant = currentJuridicOwners.find(function (b) { return b.Id() === a.RdCode && b.RequestApplicantTypeId() === a.RequestApplicantTypeId });
                        if (applicant != undefined) {
                            a.Percentage = applicant.Percentage();
                        }
                    });
                }

                data['JuridicApplicants'] = juridicApplicants;
            }

            var button = $('#save-request-data');
            button.toggleClass('loading');

            $.ajax({
                url: routeCollection.API_Remediacion_KnowledgeTest,
                context: this,
                type: "POST",
                crossDomain: false,
                data: data,
                dataType: "json",
                contentType: "application/x-www-form-urlencoded"
            }).done(function (data, textStatus, xhr) {
                self.errorMessage('');
                vm.gotoNextStep();
            }).fail(function (data, textStatus, xhr) {
                self.errorMessage('En este momento no se puede realizar la operación.');
            }).always(function () {
                button.toggleClass('loading');
            });
        }
        else {
            self.errorMessage('Revise las respuestas del test.');
        }
    };
    this.testInputFile = ko.observable();
    this.testClientVisible = this.RequestApplicantType() == 1 || this.RequestApplicantType() == 4;
    this.testAgentVisible = this.RequestApplicantType() != 1 && this.RequestApplicantType() != 4;
    this.textHeader = ko.computed(function () {

        return self.personalDataModel() != undefined ? "Test de conocimiento para " + self.personalDataModel().userName() : "";
    });
    this.saveKnowledgeTestInpuFile = function () {
        var inputs = $('#testdelivery-id input:file');
        var adjuntos = 0;
        for (var j = 0; j < inputs.length; j++) {
            if (inputs[j].files.length > 0) {
                adjuntos += 1;
            }
        }
        if (adjuntos > 0) {
            var inputFile1 = inputs[0].files[0];
            var inputFile1Type = inputFile1.type.split("/")[0];

            if (inputFile1Type == "application") {
                inputFile1Type = inputFile1.type.split("/")[1];
            }
            if (inputFile1Type == '') {
                inputFile1Type = inputFile1.name.substr(inputFile1.name.lastIndexOf('.') + 1);
            }

            if (inputFile1Type == "pdf" && inputs[0].files[0].size > MaxPdfUploadSize) {
                self.errorMessage('Revisa el tamaño del documento. Los pdf no pueden exceder de ' + maxsizeInMB + 'MB');
            } else if (inputFile1Type == "image" || inputFile1Type == "pdf") {
                Utils.GetBase64(inputs[0].files[0]).then(function (result) {
                    self.testInputFile(result);
                    self.saveKnowledgeTestQuestionCollection();
                });
            }
            else {
                self.errorMessage('Documento adjunto incorrecto.');
            }
        }
        else {
            self.errorMessage('No se ha adjuntado ningún documento.');
        }
    };
    this.setRemediationSigned = function () {
        if (self.RequestApplicantType() === 4) {
            $.ajax({
                url: routeCollection.API_Remediacion_SetJuridicRemediationSigned,
                context: this,
                type: "POST",
                async: false,
                crossDomain: false,
                data: { requestId: self.remediacionId(), applicantId: self.CurrentjuridicSigner().clientId(), setpartialStatus: self.UpdateDocument() },
                dataType: "json",
                contentType: "application/x-www-form-urlencoded"
            }).done(function (data, textStatus, xhr) {
            }).fail(function (data, textStatus, xhr) {
            }).always(function () {
            });
        } else {
            $.ajax({
                url: routeCollection.API_Remediacion_SetRemediationSigned,
                context: this,
                type: "POST",
                async: false,
                crossDomain: false,
                data: { requestId: self.remediacionId(), setpartialStatus: self.UpdateDocument() },
                dataType: "json",
                contentType: "application/x-www-form-urlencoded"
            }).done(function (data, textStatus, xhr) {
            }).fail(function (data, textStatus, xhr) {
            }).always(function () {
            });
        }
    }
};



/* Tests */

var KnowledgeTest = function (fiscalCountry, questionAnswers) {
    var self = this;

    this.confirmaQuestion = ko.observable(new ConfirmQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 29; })));
    this.fiscalQuestion = ko.observable(new FiscalResidenceQuestion(fiscalCountry));
    this.secondResidenceQuestion = ko.observable(new SecondCountryQuestion(fiscalCountry != 1));
    this.usaSecurityNumberQuestion = ko.observable(new SsnQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 44; })));
    this.occupationQuestion = ko.observable(new OccupationQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 45; })));
    this.sectorQuestion = ko.observable(new SectorQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 46; })));
    this.cargoQuestion = ko.observable(new CargoQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 47; })));
    this.publicQuestion = ko.observable(new PublicPositionQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 48; })));
    this.ongQuestion = ko.observable(new OngQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 50; })));
    this.originQuestion = ko.observable(new OriginMoneyQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 51; })));
    this.annualQuestion = ko.observable(new AnnualIncomeQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 52; })));
    this.prpQuestion = ko.observable(new PrpQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 49; })));

    this.IsOk = function () {
        var ok = true;

        self.confirmaQuestion().validate();
        self.fiscalQuestion().validate();
        self.secondResidenceQuestion().validate();
        self.occupationQuestion().validate();
        self.sectorQuestion().validate();
        self.publicQuestion().validate();
        self.ongQuestion().validate();
        self.originQuestion().validate();
        self.annualQuestion().validate();

        if (self.visiblePrp())
            self.prpQuestion().validate();

        if (self.visibleCargo())
            self.cargoQuestion().validate();

        ok = self.confirmaQuestion().questionOK()
            && self.fiscalQuestion().questionIsFullOk()
            && self.secondResidenceQuestion().questionIsFullOk()
            && self.occupationQuestion().questionOK()
            && self.sectorQuestion().questionOK()
            && self.publicQuestion().questionOK()
            && self.ongQuestion().questionOK()
            && self.originQuestion().questionOK()
            && self.annualQuestion().questionOK()
            && (self.visiblePrp() ? self.prpQuestion().questionOK() : true)
            && (self.visibleCargo() ? self.cargoQuestion().questionOK() : true);

        return ok;
    };

    this.visibleCargo = ko.computed(function () {
        return !this.sectorQuestion().answers()[16].checked() && !this.sectorQuestion().answers()[17].checked();
    }, this);

    this.visiblePrp = ko.computed(function () {
        var answer = this.publicQuestion().value();
        return answer != undefined && answer.id() === 136;
    }, this);

    this.getQuestionsAnswer = function () {
        var questionanswers = [];
        questionanswers = questionanswers.concat(
            self.confirmaQuestion().getQuestionsAnswer(),
            self.fiscalQuestion().getQuestionsAnswer(),
            self.secondResidenceQuestion().getQuestionsAnswer(),
            self.usaSecurityNumberQuestion().getQuestionsAnswer(),
            self.occupationQuestion().getQuestionsAnswer(),
            self.sectorQuestion().getQuestionsAnswer(),
            self.publicQuestion().getQuestionsAnswer(),
            self.ongQuestion().getQuestionsAnswer(),
            self.originQuestion().getQuestionsAnswer(),
            self.annualQuestion().getQuestionsAnswer(),
            self.visiblePrp() ? self.prpQuestion().getQuestionsAnswer() : [],
            self.visibleCargo() ? self.cargoQuestion().getQuestionsAnswer() : []
        );

        return questionanswers;

    };

    this.loadQuestionAnswer = function () {
        self.occupationQuestion().loadQuestionAnswer();
        self.sectorQuestion().loadQuestionAnswer();
        self.cargoQuestion().loadQuestionAnswer();
        self.publicQuestion().loadQuestionAnswer();
        self.ongQuestion().loadQuestionAnswer();
        self.originQuestion().loadQuestionAnswer();
        self.annualQuestion().loadQuestionAnswer();
        self.prpQuestion().loadQuestionAnswer();
    }
};

var KnowledgeTestRepresentative = function (fiscalCountry, questionAnswers) {
    var self = this;

    this.confirmaQuestion = ko.observable(new ConfirmQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 29; })));
    this.fiscalQuestion = ko.observable(new FiscalResidenceQuestion(fiscalCountry));
    this.secondResidenceQuestion = ko.observable(new SecondCountryQuestion(fiscalCountry != 1));
    this.usaSecurityNumberQuestion = ko.observable(new SsnQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 44; })));
    this.occupationQuestion = ko.observable(new OccupationQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 45; })));
    this.sectorQuestion = ko.observable(new SectorQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 46; })));
    this.cargoQuestion = ko.observable(new CargoQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 47; })));
    this.publicQuestion = ko.observable(new PublicPositionQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 48; })));
    this.ongQuestion = ko.observable(new OngQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 50; })));
    this.originQuestion = ko.observable(new OriginMoneyQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 51; })));
    this.annualQuestion = ko.observable(new AnnualIncomeQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 52; })));
    this.prpQuestion = ko.observable(new PrpQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 49; })));

    this.IsOk = function () {
        var ok = true;

        self.fiscalQuestion().validate();
        self.secondResidenceQuestion().validate();
        self.publicQuestion().validate();
        self.ongQuestion().validate();

        if (self.visiblePrp())
            self.prpQuestion().validate();

        ok = self.fiscalQuestion().questionIsFullOk()
            && self.secondResidenceQuestion().questionIsFullOk()
            && self.publicQuestion().questionOK()
            && self.ongQuestion().questionOK()
            && (self.visiblePrp() ? self.prpQuestion().questionOK() : true);

        return ok;
    };

    this.visibleCargo = ko.computed(function () {
        return !this.sectorQuestion().answers()[16].checked() && !this.sectorQuestion().answers()[17].checked();
    }, this);

    this.visiblePrp = ko.computed(function () {
        var answer = this.publicQuestion().value();
        return answer != undefined && answer.id() === 136;
    }, this);

    this.getQuestionsAnswer = function () {
        var questionanswers = [];
        questionanswers = questionanswers.concat(
            self.fiscalQuestion().getQuestionsAnswer(),
            self.secondResidenceQuestion().getQuestionsAnswer(),
            self.usaSecurityNumberQuestion().getQuestionsAnswer(),
            self.publicQuestion().getQuestionsAnswer(),
            self.ongQuestion().getQuestionsAnswer(),
            self.visiblePrp() ? self.prpQuestion().getQuestionsAnswer() : []
        );

        return questionanswers;
    };

    this.loadQuestionAnswer = function () {
        self.occupationQuestion().loadQuestionAnswer();
        self.sectorQuestion().loadQuestionAnswer();
        self.cargoQuestion().loadQuestionAnswer();
        self.publicQuestion().loadQuestionAnswer();
        self.ongQuestion().loadQuestionAnswer();
        self.originQuestion().loadQuestionAnswer();
        self.annualQuestion().loadQuestionAnswer();
        self.prpQuestion().loadQuestionAnswer();
    }

};

var KnowledgeTestTutor = function (fiscalCountry, questionAnswers) {
    var self = this;

    this.fiscalQuestion = ko.observable(new FiscalResidenceQuestion(fiscalCountry));
    this.secondResidenceQuestion = ko.observable(new SecondCountryQuestion(fiscalCountry != 1));
    this.usaSecurityNumberQuestion = ko.observable(new SsnQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 44; })));
    this.publicQuestion = ko.observable(new PublicPositionQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 48; })));
    this.ongQuestion = ko.observable(new OngQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 50; })));
    this.occupationQuestion = ko.observable(new OccupationQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 45; })));
    this.sectorQuestion = ko.observable(new SectorQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 46; })));
    this.cargoQuestion = ko.observable(new CargoQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 47; })));
    this.prpQuestion = ko.observable(new PrpQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 49; })));

    this.IsOk = function () {
        var ok = true;

        self.fiscalQuestion().validate();
        self.secondResidenceQuestion().validate();
        self.publicQuestion().validate();
        self.ongQuestion().validate();
        self.occupationQuestion().validate();
        self.sectorQuestion().validate();

        if (self.visiblePrp())
            self.prpQuestion().validate();

        if (self.visibleCargo())
            self.cargoQuestion().validate();

        ok = self.fiscalQuestion().questionIsFullOk()
            && self.secondResidenceQuestion().questionIsFullOk()
            && self.publicQuestion().questionOK()
            && self.ongQuestion().questionOK()
            && self.occupationQuestion().questionOK()
            && self.sectorQuestion().questionOK()
            && (self.visiblePrp() ? self.prpQuestion().questionOK() : true)
            && (self.visibleCargo() ? self.cargoQuestion().questionOK() : true);

        return ok;
    };

    this.visibleCargo = ko.computed(function () {
        return !this.sectorQuestion().answers()[16].checked() && !this.sectorQuestion().answers()[17].checked();
    }, this);

    this.visiblePrp = ko.computed(function () {
        var answer = this.publicQuestion().value();
        return answer != undefined && answer.id() === 136;
    }, this);

    this.getQuestionsAnswer = function () {
        var questionanswers = [];
        questionanswers = questionanswers.concat(
            self.fiscalQuestion().getQuestionsAnswer(),
            self.secondResidenceQuestion().getQuestionsAnswer(),
            self.usaSecurityNumberQuestion().getQuestionsAnswer(),
            self.publicQuestion().getQuestionsAnswer(),
            self.ongQuestion().getQuestionsAnswer(),
            self.occupationQuestion().getQuestionsAnswer(),
            self.sectorQuestion().getQuestionsAnswer(),
            self.visiblePrp() ? self.prpQuestion().getQuestionsAnswer() : [],
            self.visibleCargo() ? self.cargoQuestion().getQuestionsAnswer() : []
        );

        return questionanswers;
    };

    this.loadQuestionAnswer = function () {
        self.publicQuestion().loadQuestionAnswer();
        self.ongQuestion().loadQuestionAnswer();
        self.occupationQuestion().loadQuestionAnswer();
        self.sectorQuestion().loadQuestionAnswer();
        self.cargoQuestion().loadQuestionAnswer();
        self.prpQuestion().loadQuestionAnswer();
    }

};

// KnowledgeTest Juridica Question Models
var InvestmentOwnerQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 53; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 53; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 53; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(53);
    this.answers = ko.observableArray([
        new CheckAnswer(124, 'Cuenta propia', false),
        new CheckAnswer(125, 'Cuenta de terceros', false)
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.manageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (s) {
                if (s.id() != scope.id()) {
                    s.checked(false);
                }
            });
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var elemchecked = self.answers().find(function (elem) {
            return elem.checked();
        });

        ok = elemchecked != undefined;
        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined) {
            self.answers().find(function (checkanswer) { return checkanswer.id() == userQuestionAnswer.IdAnswer }).checked(true);
        }
    }
};

var PercentageCountryQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 58; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 58; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 58; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(58);
    this.value = ko.observable();
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.value() != undefined;
        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var country = {
            "idQuestion": self.id(), "idAnswer": self.value().id, "OtherAnswer": ""
        };
        questions.push(country);

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined) {
            var answer = vm.countryCollection().find(function (a) { return a.id == userQuestionAnswer.IdAnswer });
            if (answer != undefined) {
                self.value(answer);
            }
        }
    }
};

var FatcaCrsQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 60; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 60; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 60; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(60);
    this.answers = ko.observableArray([
        new FatcaAnswer(
            127,
            'Entidad No Financiera:',
            [
                new FatcaAnswer(1045, 'Activa'),
                new FatcaAnswer(1046, 'Pasiva')
            ]),
        new FatcaAnswer(128, 'Entidad Financiera:', [
            new FatcaAnswer(1047, 'Institución financiera obligada a comunicar información y dispone de GIIN número:', null, true),
            new FatcaAnswer(1048, 'Institución financiera no participante con FATCA'),
            new FatcaAnswer(1049, 'Institución financiera no obligada a comunicar información, una Institución financiera considerada cumplidora, un beneficiario efectivo exento o una Institución financiera exceptuada.'),
            new FatcaAnswer(1050, 'Institución financiera Sponsored que tiene delegadas el cumplimiento de susobligaciones FATCA en una Sponsoring entity con GIIN número:', null, true),
            new FatcaAnswer(1051, 'Institución financiera con titulares documentados que sean personas estadounidenses específicas (Owner-documented Financial Institution).'),
            new FatcaAnswer(1052, 'La entidad es una persona estadounidense.'),
            new FatcaAnswer(1053, 'La entidad no se encuentra en ninguna de las clasificaciones anteriores. La entidad debe considerarse como una', null, false,
                [
                    new FatcaSubAnswer(1054, '(completar categoría correspondiente) y, si dispone de GIIN'),
                    new FatcaSubAnswer(1055, '(en su caso, completar nº GIIN).')
                ]
            )
        ])
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.manageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                    if (p.subanswersfatca() != null) {
                        p.subanswersfatca().forEach(function (s) {
                            s.checked(false);
                        });
                    }
                }
            });
        } else {
            if (scope.subanswersfatca() != null) {
                scope.subanswersfatca().forEach(function (subanswer) {
                    subanswer.checked(false);
                });
            }
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var elemchecked = self.answers().find(function (elem) {
            return elem.checked();
        });

        if (elemchecked != undefined) {
            if (elemchecked.showSubanswersfatca()) {
                var subelemchecked = elemchecked.subanswersfatca().find(function (elem) {
                    return elem.checked();
                });

                ok = subelemchecked != undefined;
            }
        } else {
            ok = false;
        }

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        var subanswer = answer.subanswersfatca().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        if (answer.showSubanswersfatca()) {
            questions.push({ "idQuestion": self.id(), "idAnswer": subanswer.id(), "OtherAnswer": subanswer.extendedanswer() });
        }

        if (subanswer.showSubTextanswersfatca()) {
            subanswer.textsubanswers().forEach(function (sub) {
                questions.push({ "idQuestion": self.id(), "idAnswer": sub.id(), "OtherAnswer": sub.value() });
            });
        }

        return questions;
    };

    this.isFinantialAnswer = function () {
        return self.answers()[1].checked();
    }

    this.isActiveAnswer = function () {
        return self.answers()[0].subanswersfatca()[0].checked();
    }

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined && userQuestionAnswer.length > 0) {
            var answer = self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer });
            if (answer != undefined) {
                self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).checked(true);

                if (userQuestionAnswer.length > 1) {

                    self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).subanswersfatca().find(function (subanswer) {
                        return subanswer.id() == userQuestionAnswer[1].IdAnswer;
                    }).checked(true);

                    if (userQuestionAnswer[1].OtherAnswer != undefined) {
                        self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).subanswersfatca().find(function (subanswer) {
                            return subanswer.id() == userQuestionAnswer[1].IdAnswer;
                        }).extendedanswer(userQuestionAnswer[1].OtherAnswer);
                    }

                    if (userQuestionAnswer[2] != undefined && userQuestionAnswer[2].OtherAnswer != undefined) {
                        self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).subanswersfatca().find(function (subanswer) {
                            return subanswer.id() == userQuestionAnswer[1].IdAnswer;
                        }).textsubanswers()[0].value(userQuestionAnswer[2].OtherAnswer);
                    }


                    if (userQuestionAnswer[3] != undefined && userQuestionAnswer[3].OtherAnswer != undefined) {
                        self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).subanswersfatca().find(function (subanswer) {
                            return subanswer.id() == userQuestionAnswer[1].IdAnswer;
                        }).textsubanswers()[1].value(userQuestionAnswer[3].OtherAnswer);
                    }
                }
            }
        }
    }

};

var FatcaAnswer = function (answerid, answerlabel, subanswers, isextended, textsubanswers) {
    var self = this;
    this.id = ko.observable(answerid);
    this.label = ko.observable(answerlabel);
    this.checked = ko.observable(false);
    this.extendedanswer = ko.observable();
    this.subanswersfatca = ko.observableArray(subanswers);
    this.isextended = ko.observable(isextended);
    this.textsubanswers = ko.observableArray(textsubanswers);

    this.showSubanswersfatca = ko.computed(function () {
        return self.subanswersfatca() != null && self.subanswersfatca().length > 0;
    }, this);

    this.showSubTextanswersfatca = ko.computed(function () {
        return self.textsubanswers() != null && self.checked();
    }, this);

    this.showExtended = ko.computed(function () {
        return self.isextended() === true && self.checked();
    }, this);

    this.manageSubCheck = function (scope) {
        if (scope.checked() === true) {
            self.subanswersfatca().forEach(function (s) {
                if (s.id() != scope.id()) {
                    s.checked(false);
                }
            });
        }
        return true;
    };
};

var FatcaSubAnswer = function (answerid, answerlabel) {
    var self = this;
    this.id = ko.observable(answerid);
    this.label = ko.observable(answerlabel);
    this.value = ko.observable();
};

var SectorFinantialQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 61; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 61; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 61; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(61);
    this.answers = ko.observableArray([
        new SectorAnswer(181, 'Banca y Servicios financieros', [
            new SectorAnswer(1063, 'Banca privada'),
            new SectorAnswer(1064, 'Seguros'),
            new SectorAnswer(1065, 'Otros (Resto de servicios financieros como actividad bancaria, gestión de IIC y FP, intermediación financiera, etc.)')
        ], false, '', '', true)
    ]);

    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.manageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                    if (p.subSectors() != null) {
                        p.subSectors().forEach(function (s) {
                            s.checked(false);
                        });
                    }
                }
            });
        } else {
            if (scope.subSectors() != null) {
                scope.subSectors().forEach(function (subsector) {
                    subsector.checked(false);
                });
            }
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var elemchecked = self.answers().find(function (elem) {
            return elem.checked();
        });

        if (elemchecked != undefined) {
            if (elemchecked.showSubSectors()) {
                var subelemchecked = elemchecked.subSectors().find(function (elem) {
                    return elem.checked();
                });
                ok = subelemchecked != undefined && (subelemchecked.isextended() ? subelemchecked.extendedanswer() != undefined && subelemchecked.extendedanswer().trim().length > 0 : true);
            } else {
                ok = ok && (elemchecked.isextended() ? elemchecked.extendedanswer() != undefined && elemchecked.extendedanswer().trim().length > 0 : true);
            }
        } else {
            ok = false;
        }

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        var subanswer = answer.subSectors().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        if (answer.showSubSectors()) {
            questions.push({ "idQuestion": self.id(), "idAnswer": subanswer.id(), "OtherAnswer": subanswer.extendedanswer() });
        }

        return questions;
    };

    this.getSelectedAnswer = function () {
        var answer = self.answers().find(function (q) {
            return q.checked();
        });
        return answer;
    }

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined && userQuestionAnswer.length > 0) {
            var answer = self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer });
            if (answer != undefined) {
                self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).checked(true);

                if (userQuestionAnswer.length > 1) {

                    self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).subSectors().find(function (subanswer) {
                        return subanswer.id() == userQuestionAnswer[1].IdAnswer;
                    }).checked(true);

                    if (userQuestionAnswer[1].OtherAnswer != undefined) {
                        self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).subSectors().find(function (subanswer) {
                            return subanswer.id() == userQuestionAnswer[1].IdAnswer;
                        }).extendedanswer(userQuestionAnswer[1].OtherAnswer);
                    }

                }
            }
        }
    }

};

var RealOwnerQuestion = function () {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 70; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 70; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 70; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(70);
    this.owners = ko.observableArray([]);

    this.IsAddingOwner = ko.observable(false);
    this.IsEditingOwner = ko.observable(false);

    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow() && self.IsMinPercentage() == false;
                }
            },
            percentageMin: {
                params: self.owners(),
                message: "Porcentaje debe ser mayor de 25%",
                onlyIf: function () {
                    return self.validateNow() && self.IsMinPercentage() == true;
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.LoadOwner = function () {
        if (vm.juridicApplicantsCollection() == undefined) {
            return;
        }
        var owners = vm.juridicApplicantsCollection().filter(function (a) {
            return a.RequestApplicantTypeId === RequestApplicantTypeEnum.TITULARREAL
                || a.RequestApplicantTypeId === RequestApplicantTypeEnum.TITULARREALANDAPODERADO;
        });
        owners.forEach(function (o) {
            var newOwner = new Owner(o.RdCode,
                o.Name,
                o.FirstSurname,
                o.SecondSurname,
                o.DocumentNumber,
                o.Percentage ? o.Percentage.toLocaleString('es') : "",
                true,
                self.owners(),
                null,
                false,
                o.RequestApplicantTypeId);
            self.owners().push(newOwner);
        });
    }

    if (vm.isRealOwner()) {
        this.LoadOwner();
    }

    this.CancelEditOwner = function () {
        self.IsEditingOwner(false);
        window.scrollWindow('real-owner');
    };

    // edit owner
    this.BeginEditOwner = function (owner) {
        var ownerToEdit = new Owner(
            owner.Id(),
            owner.Name(),
            owner.FirstSurname(),
            owner.SecondSurname(),
            owner.DNI(),
            owner.Percentage(),
            true,
            self.owners().filter(function (a) { return a.DNI() != owner.DNI() }),
            null,
            false,
            owner.RequestApplicantTypeId());
        self.OwnerToEdit(ownerToEdit);
        self.IsEditingOwner(true);
        window.scrollWindow('edit-real-owner');
        bindAutocomplete();
        initAutocomplete();
        window.SetCleaveClass();
    };

    this.EditOwner = function () {
        if (!self.OwnerToEdit().IsOk(vm.isActiveCompany(), true)) {
            return;
        }

        var currentEditOwner = self.OwnerToEdit();
        self.owners(self.owners().map(owner =>
            owner.Id() === currentEditOwner.Id() && owner.RequestApplicantTypeId() === currentEditOwner.RequestApplicantTypeId()
                ? currentEditOwner
                : owner));
        self.owners.valueHasMutated();
        self.IsEditingOwner(false);
        window.scrollWindow('real-owner');
        self.validate(true);
    };

    this.RemoveOwner = function (owner) {
        self.owners.remove(owner);
    };

    this.OwnerToEdit = ko.observable(new Owner("", "", "", "", "", ""));

    this.HasOwners = ko.computed(function () {
        return self.owners().length > 0;
    }, this);

    this.IsMinPercentage = ko.computed(function () {
        var minPercentage = 25;
        return self.owners().some(function (o) {
            return o.Percentage() < minPercentage
        });
    });

    this.IsExcluded = ko.computed(function () {
        var isExcluded = false;
        isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().adminOwnerQuestion().HasOwners();
        return isExcluded;
    }, this);

    this.validate = function (onSaveOwner) {
        var ok = true;
        self.validateNow(onSaveOwner ? false : true);

        var entityType = vm.CurrentKnowledgeTest() == undefined ? 0 : vm.CurrentKnowledgeTest().companyTypeQuestion().value() != undefined ? vm.CurrentKnowledgeTest().companyTypeQuestion().value().id() : 0;
        var isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().adminOwnerQuestion().HasOwners();

        if (entityType == 242 && !isExcluded) {
            ok = self.HasOwners();
        }

        if (!onSaveOwner) {
            ok = ok && !self.IsMinPercentage();
        }

        self.questionOK(ok);
        return ok;
    };
};

var AddressJuridica = function (addressType) {
    var self = this;

    this.validateNow = ko.observable(false);
    this.ValidateEPSVPostalCode = ko.observable(false);
    this.ValidateResident = ko.observable(false);
    this.AddressTypeId = ko.observable(addressType);
    this.FullAddress = ko.observable();
    this.ViaType = ko.observable().extend({
        required: {
            message: "Por favor indique el tipo de vía"
        }
        //        if(_postalcode.length < 5) {
        //    _postalcode = Utils.Paddy(self.PostalCode(), 5);
        //}

    });
    this.Street = ko.observable().extend({
        required: {
            message: "Por favor indique la calle"
        },
        validation: {
            validator: function (val) {
                var _street = self.Street();
                if (_street.length > 40) {
                    return false;
                }
                return true;
            },
            message: "La longitud de la calle no puede superar los 40 caracteres."
        }
    });
    this.StreetNumber = ko.observable().extend({
        required: {
            message: "Por favor indique el número"
        }
    });
    this.Stairs = ko.observable();
    this.Floor = ko.observable();
    this.Door = ko.observable();
    this.AddressExtension = ko.observable().extend({
        validation: {
            validator: function (val) {
                if (!val) return true;

                var _adressExtension = self.AddressExtension();
                if (_adressExtension.length > 40) {
                    return false;
                }
                return true;
            },
            message: "La longitud no puede superar los 40 caracteres."
        }
    });

    this.PostalCode = ko.observable().extend({
        required: {
            message: "Por favor indique el código postal"
        },
        EPSVPostalCode: {
            params: {
                supportedPrefixes: ['01', '20', '48']
            },
            message: "Sólo se puede contratar una EPSV si la dirección fiscal es en el País Vasco",
            onlyIf: function () {
                return self.ValidateEPSVPostalCode() && self.validateNow()
            }
        }
    });

    this.City = ko.observable().extend({
        required: {
            message: "Por favor indique la ciudad"
        }
    });

    this.CountryId = ko.observable().extend({
        required: { message: "Por favor indique el país" },

        SameFiscalCountry: {
            params: function () {
                return self.ValidateResident();
            },
            //message: "Si es residente en España la dirección fiscal tiene que estar en España",
            onlyIf: function () {
                return !isNaN(self.CountryId()) && self.AddressTypeId() == "FiscalAddress" && self.validateNow();
            }
        }
    });

    this.Province = ko.observable().extend({
        required: {
            onlyIf: function () {
                return self.CountryId() == 1
            },
            message: "Por favor indique la provincia"
        },
        Province: {
            params: function () {
                return self.PostalCode();
            },
            message: "El código postal no coincide con la provincia",
            onlyIf: function () {
                return !isNaN(self.PostalCode()) && self.validateNow() && self.CountryId() == 1
            }
        }
    });

    this.ReadOnlyProvince = ko.computed(function () {
        return self.CountryId() != undefined && self.CountryId() != 1;
    }, this);

    self.CountryId.subscribe(function (newValue) {
        if (newValue != 1) {
            self.Province('');
        }
    });

    this.errors = ko.validation.group(this);

    this.IsValidAddress = function () {
        self.validateNow(true);
        if (self.errors().length === 0) {
            return true;
        }
        else {
            self.errors.showAllMessages();
            window.scrollError();
            return false;
        }
    };

    this.FullAddressString = ko.computed(function () {
        var fulladdress = '';

        if (self.ViaType() != undefined) {
            fulladdress = vm.getViaTypeNameById(self.ViaType()) + ' '
                + self.Street() + ' '
                + self.StreetNumber() + ' '
                + (self.Floor() == null ? '' : self.Floor()) + ' '
                + (self.Door() == null ? '' : self.Door()) + ' '
                + self.City() + ' '
                + vm.getCountryNameById(self.CountryId());
        }

        return fulladdress;
    }, this);

    this.AddressTypeName = ko.computed(function () {
        if (self.AddressTypeId() == "FiscalAddress") {
            return "Dirección fiscal";
        } else {
            return "Dirección postal";
        }
    }, this);

    this.toString = ko.computed(function () {
        var addressData = [
            self.ViaType() || "",
            self.Street() || "",
            (self.StreetNumber() || "") + ",",
            ((self.Stairs() || "").length > 0) ? ("Escalera " + self.Stairs()) : "",
            self.Floor() || "",
            self.Door() || "",
            "\n",
            ((self.AddressExtension() || "").length > 0) ? (self.AddressExtension() + "\n") : "",
            (self.PostalCode() || {
            }),
            (self.City() || {
            }) + ",",
            (self.Province() || {}) + ",",
            (self.CountryId() || {
            })
        ];
        return addressData.join(" ");
    });

    this.equals = function (otherAddress) {
        return (self.ViaType() == otherAddress.ViaType()) &&
            (self.Street() == otherAddress.Street()) &&
            (self.StreetNumber() == otherAddress.StreetNumber()) &&
            (self.Stairs() == otherAddress.Stairs()) &&
            (self.Floor() == otherAddress.Floor()) &&
            (self.Door() == otherAddress.Door()) &&
            (self.AddressExtension() == otherAddress.AddressExtension()) &&
            (self.PostalCode() == otherAddress.PostalCode()) &&
            (self.City() == otherAddress.City()) &&
            (self.Province() == otherAddress.Province()) &&
            (self.CountryId() == otherAddress.CountryId());
    }

    this.ToolTipText = ko.pureComputed(function () {
        var tooltiptext = '';
        if (self.AddressTypeId() == 'FiscalAddress') {
            tooltiptext = 'El domicilio fiscal de una persona física es su residencia habitual. De todas maneras, si dicha persona desarrolla actividades económicas, es posible que se considere como su domicilio fiscal aquel donde se centraliza la dirección y la gestión de dichas actividades.';
        } else {
            tooltiptext = 'La dirección postal es el domicilio donde recibirás todas las comunicaciones realizadas por correo postal.';
        }
        return tooltiptext;
    }, this);
};


var Owner = function (_Id, _Name, _FirstSurname, _SecondSurname, _DNI, _Percentage, _PercentageRequired, _OtherOwners, _OtherApplicants, _assisted, _requestApplicantTypeId) {
    var self = this;
    this.validateNow = ko.observable(false);
    this.Assisted = ko.observable(_assisted);
    this.RequestApplicantTypeId = ko.observable(_requestApplicantTypeId);
    this.Id = ko.observable(_Id);
    this.OtherOwners = ko.observableArray(_OtherOwners);
    this.OtherApplicants = ko.observableArray(_OtherApplicants);
    this.ApplicantDocumentTypes = ko.observableArray([{ id: 'DNI', valor: 'DNI' }/*, { id: 'PAS', valor: 'Pasaporte' }*/]);
    this.Name = ko.observable(_Name).extend({
        required: {
            message: "Por favor indique su nombre",
            onlyIf: function () {
                return self.validateNow() && !self.ValidatePercentage();
            }
        },
        minLength: {
            message: "El nombre debe tener al menos dos caracteres",
            onlyIf: function () {
                return self.validateNow() && !self.ValidatePercentage();
            },
            params: 2
        },
        pattern: {
            message: "Caracteres no permitidos",
            params: /^[a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüàª '.çÇ-]+$/,
            onlyIf: function () {
                return self.validateNow() && !self.ValidatePercentage();
            }
        }
    });
    this.BornPlace = ko.observable(_Name).extend({
        required: {
            params: true,
            message: "Por favor indique el lugar de nacimiento",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta() && !self.ValidatePercentage();
            }
        }
    });
    this.FirstSurname = ko.observable(_FirstSurname).extend({
        required: {
            message: "Por favor indique su primer apellido",
            onlyIf: function () {
                return self.validateNow() && !self.ValidatePercentage();
            }
        },
        minLength: {
            message: "El primer apellido debe tener al menos dos caracteres",
            onlyIf: function () {
                return self.validateNow() && !self.ValidatePercentage();
            },
            params: 2
        },
        pattern: {
            message: "Caracteres no permitidos",
            params: /^[a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüàª '.çÇ-]+$/,
            onlyIf: function () {
                return self.validateNow() && !self.ValidatePercentage();
            }
        }
    });
    this.SecondSurname = ko.observable(_SecondSurname).extend({
        minLength: {
            message: "El segundo apellido debe tener al menos dos caracteres",
            onlyIf: function () {
                return self.validateNow() && !self.ValidatePercentage();
            },
            params: 2
        },
        pattern: {
            message: "Caracteres no permitidos",
            params: /^[a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüàª '.çÇ-]+$/,
            onlyIf: function () {
                return self.validateNow() && !self.ValidatePercentage();
            }
        }
    });
    this.DNI = ko.observable(_DNI).extend({
        required: {
            params: true,
            message: "Por favor indique el NIF",
            onlyIf: function () {
                return self.validateNow() && !self.ValidatePercentage();
            }
        },
        DNI: {
            message: "El documento de identidad no es válido",
            onlyIf: function () {
                return self.validateNow() && self.DocumentType() != undefined && self.DocumentType().id == 'DNI' && !self.ValidatePercentage();
            }
        },
        validation: [
            {
                validator: function (val) {
                    var _valid = true;
                    if (self.OtherOwners().some(function (o) { return o.DNI() == val; })) {
                        _valid = false;
                    }
                    return _valid;
                },
                message: 'Ya existe otra persona física con ese NIF'
            }]
    });
    this.TotalGroup = ko.computed(function () {
        var totalGroup = 0;
        ko.utils.arrayForEach(self.OtherOwners(), function (o, index) {
            totalGroup += Utils.ParseFloatWithComma(o.Percentage());
        });
        return totalGroup;
    }, this);
    this.IsPercentageRequired = ko.observable(_PercentageRequired);
    this.Percentage = ko.observable(_Percentage).extend({
        required: {
            message: "Por favor indique su porcentaje",
            onlyIf: function () {
                return self.IsPercentageRequired() && self.validateNow();
            }
        },
        validation: [
            {
                validator: function (val) {
                    var _valid = true;
                    if (parseInt(val) < 25) {
                        _valid = false
                    }
                    return _valid;
                },
                message: 'Debe ser mayor de 25%'
            },
            {
                validator: function (val) {
                    var _valid = true;
                    if (parseInt(val) > 100) {
                        _valid = false
                    }
                    return _valid;
                },
                message: 'Debe ser menor de 100%'
            },
            {
                validator: function (val) {
                    var _valid = true;
                    if (Utils.ParseFloatWithComma(val) + Utils.ParseFloatWithComma(self.TotalGroup()) > 100) {
                        _valid = false
                    }
                    return _valid;
                },
                message: 'El total no puede ser mayor de 100%'
            }]
    });
    //this.FiscalAddress = ko.observable(new AddressJuridica("FiscalAddress"));
    this.ShowAddressInfo = ko.observable(true);
    this.SameTitularAddress = ko.observable(false);
    this.ValidateExta = ko.observable(true);
    this.ValidatePercentage = ko.observable(false);
    this.errors = ko.validation.group(this);

    this.IsOk = function (isActiveCompany, isPercentageOnly = false) {
        self.ValidateExta(!isActiveCompany);
        self.ValidatePercentage(isPercentageOnly);
        var ok = false;
        self.validateNow(true);

        if (self.errors().length === 0) {
            ok = true;
        } else {
            self.errors.showAllMessages();
            window.scrollError();
            ok = false;
        }

        return ok;

    };
    this.Birthday = ko.observable(new CustomDate()).extend({
        RequiredCustomDate: {
            message: "Por favor indique su fecha de nacimiento",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta() && !self.ValidatePercentage();
            }
        },
        Birthday: {
            message: "La fecha de nacimiento no es correcta",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta() && !self.ValidatePercentage();
            }
        },
        OlderThan: {
            params: {
                age: 18
            },
            message: "La persona debe ser mayor de edad",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta() && !self.ValidatePercentage();
            }
        },
        customdate: {
            message: "La fecha de nacimiento no es correcta",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta() && !self.ValidatePercentage();
            }
        }
    });
    this.Nationality = ko.observable().extend({
        required: {
            message: "Por favor indique su nacionalidad",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta() && !self.ValidatePercentage();
            }
        }
    });
    this.Country = ko.observable().extend({
        required: {
            message: "Por favor indique su país",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta() && !self.ValidatePercentage();
            }
        }
    });

    this.FiscalCountry = ko.observable();
    this.FiscalNumber = ko.observable();
    this.UsaFiscalNumber = ko.observable();
    this.DocumentType = ko.observable().extend({
        required: {
            message: "Por favor indique el tipo de documento de identidad",
            onlyIf: function () {
                return self.validateNow() && !self.ValidatePercentage();
            }
        }
    });

    this.IDDocumentIsPermanent = ko.observable();
    this.ShowDocumentExpirationDate = ko.pureComputed(function () {
        return (self.IDDocumentIsPermanent() == false) || (self.IDDocumentIsPermanent() == null);
    }, this);
    this.IDDocumentExpirationDate = ko.observable(new CustomDate()).extend({
        RequiredCustomDate: {
            message: "Por favor indique la fecha de expiración del DNI/NIE",
            onlyIf: function () {
                return self.validateNow() && self.ShowDocumentExpirationDate() && self.ValidateExta() && !self.ValidatePercentage();
            }
        },
        ExpirationCustomDate: {
            message: "El DNI / NIF está caducado o ha indicado una fecha incorrecta",
            onlyIf: function () {
                return self.validateNow() && self.ShowDocumentExpirationDate() && self.ValidateExta() && !self.ValidatePercentage();
            }
        },
        customdate: {
            message: "El DNI / NIF está caducado o ha indicado una fecha incorrecta",
            onlyIf: function () {
                return self.validateNow() && self.ShowDocumentExpirationDate() && self.ValidateExta() && !self.ValidatePercentage();
            }
        }
    });
    this.ShowPermanentValidity = ko.computed(function () {
        var age = self.Birthday().getAge();
        return age >= 65;
    }, this);
    this.ShowExtendedQuestions = ko.computed(function () {
        return self.DocumentType() != undefined && self.DocumentType().id === 'PAS';
    }, this);

    this.CheckDNI = function () {
        if (self.DNI() != null && self.DNI() != "")
            self.ProcessDNI(self.DNI());
    };

    this.ProcessDNI = function (newValue) {
        var dni = Utils.ProcessDNI(newValue);

        var existingApplicant = ko.utils.arrayFirst(self.OtherApplicants(), function (a) { return a.ApplicantBasicData().DNI() == dni; });
        if (existingApplicant != null) {
            self.DNI(dni);
            self.Name(existingApplicant.ApplicantBasicData().Name());
            self.FirstSurname(existingApplicant.ApplicantBasicData().FirstSurname());
            self.SecondSurname(existingApplicant.ApplicantBasicData().SecondSurname());
            self.Country(existingApplicant.ApplicantPersonalData().Country());
            self.BornPlace(existingApplicant.ApplicantPersonalData().BornPlace());
            self.Nationality(existingApplicant.ApplicantPersonalData().Nationality());
            self.Birthday(existingApplicant.ApplicantPersonalData().Birthday());
            self.IDDocumentExpirationDate(existingApplicant.ApplicantPersonalData().IDDocumentExpirationDate());
            self.IDDocumentIsPermanent(existingApplicant.ApplicantPersonalData().IDDocumentIsPermanent());
            self.DocumentType(self.ApplicantDocumentTypes()[0]);
            self.ShowAddressInfo(false);
            self.SameTitularAddress(true);
        } else {
            self.ShowAddressInfo(true);
            self.SameTitularAddress(false);
            if (self.DocumentType().id == 'DNI') {
                self.DNI(dni);
            }
        }
    };

    self.DNI.subscribe(function (newValue) {
        if (newValue != null && newValue.length >= 9) {
            self.ProcessDNI(newValue);
        }
    });
    self.Birthday().Year.subscribe(function (newValue) {
        if (self.Birthday().getAge() < 65) {
            self.IDDocumentIsPermanent(false);
        }
    });
    self.IDDocumentExpirationDate().Year.subscribe(function (newValue) {
        if (newValue == "") return;
        var momentDate = Utils.getMomentDate(self.IDDocumentExpirationDate().Day(), self.IDDocumentExpirationDate().Month(), self.IDDocumentExpirationDate().Year());
        self.IDDocumentExpirationDate(new CustomDate(momentDate));
    });
    self.SameTitularAddress.subscribe(function (newValue) {
        bindAutocomplete();
        initAutocomplete();
    });
};

var AdminQuestion = function () {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 71; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 71; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 71; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(71);
    this.owners = ko.observableArray([]);
    this.IsAddingOwner = ko.observable(false);
    this.IsEditingOwner = ko.observable(false);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.LoadOwner = function () {
        if (vm.juridicApplicantsCollection() == undefined) {
            return;
        }
        var owners = vm.juridicApplicantsCollection().filter(function (a) {
            return a.RequestApplicantTypeId === RequestApplicantTypeEnum.ADMINISTRADOR
                || a.RequestApplicantTypeId === RequestApplicantTypeEnum.APODERADOYADMINISTRADOR;
        });
        owners.forEach(function (o) {
            var newOwner = new Owner(o.RdCode,
                o.Name,
                o.FirstSurname,
                o.SecondSurname,
                o.DocumentNumber,
                o.Percentage ? o.Percentage.toLocaleString('es') : "",
                true,
                self.owners(),
                null,
                false,
                o.RequestApplicantTypeId);
            self.owners().push(newOwner);
        });
    }

    if (vm.isAdmin()) {
        this.LoadOwner();
    }

    this.CancelEditOwner = function () {
        self.IsEditingOwner(false);
        window.scrollWindow('admin-owner');
    };

    // edit owner
    this.BeginEditOwner = function (owner) {
        var ownerToEdit = new Owner(
            owner.Id(),
            owner.Name(),
            owner.FirstSurname(),
            owner.SecondSurname(),
            owner.DNI(),
            owner.Percentage(),
            true,
            self.owners().filter(function (a) { return a.DNI() != owner.DNI() }),
            null,
            false,
            owner.RequestApplicantTypeId());
        self.OwnerToEdit(ownerToEdit);
        self.IsEditingOwner(true);
        window.scrollWindow('edit-admin-owner');
        bindAutocomplete();
        initAutocomplete();
        window.SetCleaveClass();
    };

    this.EditOwner = function () {
        if (!self.OwnerToEdit().IsOk(vm.isActiveCompany(), true)) {
            return;
        }

        var currentEditOwner = self.OwnerToEdit();
        self.owners(self.owners().map(owner =>
            owner.Id() === currentEditOwner.Id() && owner.RequestApplicantTypeId() === currentEditOwner.RequestApplicantTypeId()
                ? currentEditOwner
                : owner));
        self.owners.valueHasMutated();
        self.IsEditingOwner(false);
        window.scrollWindow('admin-owner');
        self.validate();
    };

    this.RemoveOwner = function (owner) {
        self.owners.remove(owner);
    };

    this.OwnerToEdit = ko.observable(new Owner("", "", "", "", "", ""));

    this.HasOwners = ko.computed(function () {
        return self.owners().length > 0;
    }, this);

    this.IsExcluded = ko.computed(function () {
        var isExcluded = false;
        isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().realOwnerQuestion().HasOwners();
        return isExcluded;
    }, this);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var entityType = vm.CurrentKnowledgeTest() == undefined ? 0 : vm.CurrentKnowledgeTest().companyTypeQuestion().value() != undefined ? vm.CurrentKnowledgeTest().companyTypeQuestion().value().id() : 0;
        var isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().realOwnerQuestion().HasOwners();

        if (entityType == 242 && !isExcluded) {
            ok = self.HasOwners();
        }

        self.questionOK(ok);
        return ok;
    };
};

var PatronQuestion = function () {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 72; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 72; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 72; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(72);
    this.owners = ko.observableArray([]);
    this.IsAddingOwner = ko.observable(false);
    this.IsEditingOwner = ko.observable(false);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow() && self.IsMinPercentage() == false;
                }
            },
            percentageMin: {
                params: self.owners(),
                message: "Porcentaje debe ser mayor de 25%",
                onlyIf: function () {
                    return self.validateNow() && self.IsMinPercentage() == true;
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.LoadOwner = function () {
        if (vm.juridicApplicantsCollection() == undefined) {
            return;
        }
        var owners = vm.juridicApplicantsCollection().filter(function (a) {
            return a.RequestApplicantTypeId === RequestApplicantTypeEnum.PATRONO
                || a.RequestApplicantTypeId === RequestApplicantTypeEnum.PATRONOYAPODERADO;
        });
        owners.forEach(function (o) {
            var newOwner = new Owner(o.RdCode,
                o.Name,
                o.FirstSurname,
                o.SecondSurname,
                o.DocumentNumber,
                o.Percentage ? o.Percentage.toLocaleString('es') : "",
                true,
                self.owners(),
                null,
                false,
                o.RequestApplicantTypeId);
            self.owners().push(newOwner);
        });
    }

    if (vm.isPatron()) {
        this.LoadOwner();
    }

    this.CancelEditOwner = function () {
        self.IsEditingOwner(false);
        window.scrollWindow('patron-owner');
    };

    // edit owner
    this.BeginEditOwner = function (owner) {
        var ownerToEdit = new Owner(
            owner.Id(),
            owner.Name(),
            owner.FirstSurname(),
            owner.SecondSurname(),
            owner.DNI(),
            owner.Percentage(),
            true,
            self.owners().filter(function (a) { return a.DNI() != owner.DNI() }),
            null,
            false,
            owner.RequestApplicantTypeId());
        self.OwnerToEdit(ownerToEdit);
        self.IsEditingOwner(true);
        window.scrollWindow('edit-patron-owner');
        bindAutocomplete();
        initAutocomplete();
        window.SetCleaveClass();
    };

    this.EditOwner = function () {
        if (!self.OwnerToEdit().IsOk(vm.isActiveCompany(), true)) {
            return;
        }

        var currentEditOwner = self.OwnerToEdit();
        self.owners(self.owners().map(owner =>
            owner.Id() === currentEditOwner.Id() && owner.RequestApplicantTypeId() === currentEditOwner.RequestApplicantTypeId()
                ? currentEditOwner
                : owner));
        self.owners.valueHasMutated();
        self.IsEditingOwner(false);
        window.scrollWindow('patron-owner');
        self.validate(true);
    };

    this.RemoveOwner = function (owner) {
        self.owners.remove(owner);
    };

    this.OwnerToEdit = ko.observable(new Owner("", "", "", "", "", ""));

    this.HasOwners = ko.computed(function () {
        return self.owners().length > 0;
    }, this);

    this.IsMinPercentage = ko.computed(function () {
        var minPercentage = 25;
        return self.owners().some(function (o) {
            return o.Percentage() < minPercentage
        });
    });

    this.IsExcluded = ko.computed(function () {
        var isExcluded = false;
        isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().representationOwnerQuestion().HasOwners();
        return isExcluded;
    }, this);

    this.validate = function (onSaveOwner) {
        var ok = true;
        self.validateNow(onSaveOwner ? false : true);

        var entityType = vm.CurrentKnowledgeTest() == undefined ? 0 : vm.CurrentKnowledgeTest().companyTypeQuestion().value() != undefined ? vm.CurrentKnowledgeTest().companyTypeQuestion().value().id() : 0;
        var isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().representationOwnerQuestion().HasOwners();

        if (entityType == 243 && !isExcluded) {
            ok = self.HasOwners();
        }

        if (!onSaveOwner) {
            ok = ok && !self.IsMinPercentage();
        }

        self.questionOK(ok);
        return ok;
    };
};

var RepresentativeQuestion = function () {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 73; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 73; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 73; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(73);
    this.owners = ko.observableArray([]);
    this.IsAddingOwner = ko.observable(false);
    this.IsEditingOwner = ko.observable(false);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.LoadOwner = function () {
        if (vm.juridicApplicantsCollection() == undefined) {
            return;
        }
        var owners = vm.juridicApplicantsCollection().filter(function (a) {
            return a.RequestApplicantTypeId === RequestApplicantTypeEnum.ORGANOREPRESENTACION
                || a.RequestApplicantTypeId === RequestApplicantTypeEnum.ORGANOREPRESENTACIONYAPODERADO
                || a.RequestApplicantTypeId === RequestApplicantTypeEnum.JUNTADIRECTIVA;
        });
        owners.forEach(function (o) {
            var newOwner = new Owner(o.RdCode,
                o.Name,
                o.FirstSurname,
                o.SecondSurname,
                o.DocumentNumber,
                o.Percentage ? o.Percentage.toLocaleString('es') : "",
                true,
                self.owners(),
                null,
                false,
                o.RequestApplicantTypeId);
            self.owners().push(newOwner);
        });
    }

    if (vm.isRepresentative()) {
        this.LoadOwner();
    }

    this.CancelEditOwner = function () {
        self.IsEditingOwner(false);
        window.scrollWindow('representative-owner');
    };

    // edit owner
    this.BeginEditOwner = function (owner) {
        var ownerToEdit = new Owner(
            owner.Id(),
            owner.Name(),
            owner.FirstSurname(),
            owner.SecondSurname(),
            owner.DNI(),
            owner.Percentage(),
            true,
            self.owners().filter(function (a) { return a.DNI() != owner.DNI() }),
            null,
            false,
            owner.RequestApplicantTypeId());
        self.OwnerToEdit(ownerToEdit);
        self.IsEditingOwner(true);
        window.scrollWindow('edit-representative-owner');
        bindAutocomplete();
        initAutocomplete();
        window.SetCleaveClass();
    };

    this.EditOwner = function () {
        if (!self.OwnerToEdit().IsOk(vm.isActiveCompany(), true)) {
            return;
        }

        var currentEditOwner = self.OwnerToEdit();
        self.owners(self.owners().map(owner =>
            owner.Id() === currentEditOwner.Id() && owner.RequestApplicantTypeId() === currentEditOwner.RequestApplicantTypeId()
                ? currentEditOwner
                : owner));
        self.owners.valueHasMutated();
        self.IsEditingOwner(false);
        window.scrollWindow('representative-owner');
        self.validate();
    };

    this.RemoveOwner = function (owner) {
        self.owners.remove(owner);
    };

    this.OwnerToEdit = ko.observable(new Owner("", "", "", "", "", ""));

    this.HasOwners = ko.computed(function () {
        return self.owners().length > 0;
    }, this);

    this.IsExcluded = ko.computed(function () {
        var isExcluded = false;
        isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().patronOwnerQuestion().HasOwners();
        return isExcluded;
    }, this);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var entityType = vm.CurrentKnowledgeTest() == undefined ? 0 : vm.CurrentKnowledgeTest().companyTypeQuestion().value() != undefined ? vm.CurrentKnowledgeTest().companyTypeQuestion().value().id() : 0;
        var isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().patronOwnerQuestion().HasOwners();

        if (entityType == 243 && !isExcluded) {
            ok = self.HasOwners();
        }

        self.questionOK(ok);
        return ok;
    };
};

var AnnualAmountQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 63; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 63; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 63; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(63);
    this.answers = ko.observableArray([
        new CheckAnswer(193, '< 500.000 €', false),
        new CheckAnswer(194, 'Entre 500.000 € y 5.000.000 €', false),
        new CheckAnswer(195, 'Entre 5.000.000 € y 39.999.999 €', false),
        new CheckAnswer(196, 'Igual o superior a 40.000.000 €', false)
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.ManageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                }
            });
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.answers().some(function (elem) {
            return elem.checked();
        });
        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined) {
            self.answers().find(function (checkanswer) { return checkanswer.id() == userQuestionAnswer.IdAnswer }).checked(true);
        }
    }
};

var AnnualBenefitQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 64; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 64; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 64; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(64);
    this.answers = ko.observableArray([
        new CheckAnswer(197, '< 10.000 €', false),
        new CheckAnswer(198, 'Entre 10.000 € y 50.000 €', false),
        new CheckAnswer(199, 'Entre 50.000,01 € y 499.999,99 €', false),
        new CheckAnswer(200, 'Igual o superior a 500.000 €', false)
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.ManageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                }
            });
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.answers().some(function (elem) {
            return elem.checked();
        });
        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined) {
            self.answers().find(function (checkanswer) { return checkanswer.id() == userQuestionAnswer.IdAnswer }).checked(true);
        }
    }
};

var FundsVolumeQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 65; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 65; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 65; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(65);
    this.answers = ko.observableArray([
        new CheckAnswer(201, '< 50.000 €', false),
        new CheckAnswer(202, 'Entre 50.000 € y 500.000 €', false),
        new CheckAnswer(203, 'Entre 500.000,01 € y 1.999.999,99 €', false),
        new CheckAnswer(204, 'Igual o superior a 2.000.000 €', false)
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.ManageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                }
            });
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.answers().some(function (elem) {
            return elem.checked();
        });
        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined) {
            self.answers().find(function (checkanswer) { return checkanswer.id() == userQuestionAnswer.IdAnswer }).checked(true);
        }
    }
};

var ActiveQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 66; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 66; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 66; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(66);
    this.answers = ko.observableArray([
        new CheckAnswer(229, '< 50.000 €', false),
        new CheckAnswer(230, 'Entre 50.000 € y 5.000.000 €', false),
        new CheckAnswer(231, 'Entre 5.000.000,01 € y 19.999.999,99 €', false),
        new CheckAnswer(232, 'Igual o superior a 20.000.000 €', false)
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.ManageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                }
            });
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.answers().some(function (elem) {
            return elem.checked();
        });
        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined) {
            self.answers().find(function (checkanswer) { return checkanswer.id() == userQuestionAnswer.IdAnswer }).checked(true);
        }
    }
};

var EmployeesQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 67; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 67; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 67; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(67);
    this.answers = ko.observableArray([
        new CheckAnswer(205, '< 5 empleados', false),
        new CheckAnswer(206, 'De 5 a 15 empleados', false),
        new CheckAnswer(207, 'De 16 a 30 empleados', false),
        new CheckAnswer(208, '> 30 empleados', false)
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.ManageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                }
            });
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.answers().some(function (elem) {
            return elem.checked();
        });
        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined) {
            self.answers().find(function (checkanswer) { return checkanswer.id() == userQuestionAnswer.IdAnswer }).checked(true);
        }
    }
};

var SectorQuestionJuridica = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 61; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 61; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 61; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(61);
    this.answers = ko.observableArray([
        new SectorAnswer(174, 'Agricultura, Ganadería y Pesca'),
        new SectorAnswer(
            175,
            'Industria, Agua, Metalurgia y Energía',
            [
                new SectorAnswer(1056, 'Extracción de materiales preciosos o combustibles'),
                new SectorAnswer(1057, 'Reciclado de metales'),
                new SectorAnswer(1058, 'Vehículos (fabribación/reparación)'),
                new SectorAnswer(1059, 'Armamentística'),
                new SectorAnswer(1060, 'Tabaco'),
                new SectorAnswer(1061, 'Alcohol'),
                new SectorAnswer(1062, 'Otros')
            ]),
        new SectorAnswer(176, 'Inmobiliaria y Construcción'),
        new SectorAnswer(177, 'Comercio'),
        new SectorAnswer(178, 'Transporte, almacenamiento y distribución'),
        new SectorAnswer(179, 'Hostelería y Restauración'),
        new SectorAnswer(180, 'Comunicación, prensa y televisivón'),
        //new SectorAnswer(181, 'Banca y Servicios financieros', [
        //    new SectorAnswer(1063, 'Banca privada'),
        //    new SectorAnswer(1064, 'Seguros'),
        //    new SectorAnswer(1065, 'Otros')
        //]),
        new SectorAnswer(182, 'Envío de divisas'),
        new SectorAnswer(183, 'Casa de cambio de Moneda'),
        new SectorAnswer(184, 'Enseñanza/Educación'),
        new SectorAnswer(185, 'Sanidad y servicios sociales', [
            new SectorAnswer(1066, 'Odontología'),
            new SectorAnswer(1067, 'Cirugía plástica'),
            new SectorAnswer(1068, 'Farmacia'),
            new SectorAnswer(1069, 'Otras especialidades')
        ]),
        new SectorAnswer(186, 'Espectáculos-deportes'),
        new SectorAnswer(187, 'Servicios Profesionales', null, false, 'Servicios profesionales: Consultoría, gestoría, abogacía, auditoría, contabilidad, estudio de arquitectura, estudio de ingeniería, estudio de decoración, investigación, publicidad, veterinaria, traducción y fotografía.', 1),
        new SectorAnswer(188, 'Actividades de organizaciones y organismos extraterritoriales'),
        new SectorAnswer(189, 'Administración pública'),
        new SectorAnswer(190, 'Rentista', null, false, 'Rentista: Aquellos que perciban rentas de bienes muebles y/o inmuebles (ej. dividendos, alquileres, etc.', 2),
        new SectorAnswer(191, 'Otros servicios',
            [
                new SectorAnswer(1070, 'Asociaciones/sindicatos/Organizaciones sin ánimo de lucro/Órdenes religiosas'),
                new SectorAnswer(1071, 'Reparación de efectos personales y artículos de uso doméstico'),
                new SectorAnswer(1072, 'Otros (En caso de ser ésta la opción seleccionada, es de obligada cumplimentación el siguiente espacio):', null, true)
            ]),
        new SectorAnswer(192, 'Entidades de derecho público de los Estados miembros de la Unión Europea o de países terceros equivalentes; sociedades controladas o participadas mayoritariamente por entidades mencionadas anteriormente; entidades financieras, exceptuadas las entidades de pago, domiciliadas en la Unión Europea o en países terceros equivalentes que sean objeto de supervisión en materia de PBC; o sociedades cotizadas cuyos valores se admitan a negociación en un mercado regulado de la Unión Europea o de países terceros equivalentes así como sus sucursales y filiales participadas mayoritariamente.')
    ]);

    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.manageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                    if (p.subSectors() != null) {
                        p.subSectors().forEach(function (s) {
                            s.checked(false);
                        });
                    }
                }
            });
        } else {
            if (scope.subSectors() != null) {
                scope.subSectors().forEach(function (subsector) {
                    subsector.checked(false);
                });
            }
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var elemchecked = self.answers().find(function (elem) {
            return elem.checked();
        });

        if (elemchecked != undefined) {
            if (elemchecked.showSubSectors()) {
                var subelemchecked = elemchecked.subSectors().find(function (elem) {
                    return elem.checked();
                });
                ok = subelemchecked != undefined && (subelemchecked.isextended() ? subelemchecked.extendedanswer() != undefined && subelemchecked.extendedanswer().trim().length > 0 : true);
            } else {
                ok = ok && (elemchecked.isextended() ? elemchecked.extendedanswer() != undefined && elemchecked.extendedanswer().trim().length > 0 : true);
            }
        } else {
            ok = false;
        }

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        var subanswer = answer.subSectors().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        if (answer.showSubSectors()) {
            questions.push({ "idQuestion": self.id(), "idAnswer": subanswer.id(), "OtherAnswer": subanswer.extendedanswer() });
        }

        return questions;
    };

    this.getSelectedAnswer = function () {
        var answer = self.answers().find(function (q) {
            return q.checked();
        });
        return answer;
    }

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined && userQuestionAnswer.length > 0) {
            var answer = self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer });
            if (answer != undefined) {
                self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).checked(true);

                if (userQuestionAnswer.length > 1) {

                    self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).subSectors().find(function (subanswer) {
                        return subanswer.id() == userQuestionAnswer[1].IdAnswer;
                    }).checked(true);

                    if (userQuestionAnswer[1].OtherAnswer != undefined) {
                        self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).subSectors().find(function (subanswer) {
                            return subanswer.id() == userQuestionAnswer[1].IdAnswer;
                        }).extendedanswer(userQuestionAnswer[1].OtherAnswer);
                    }

                }
            }
        }
    }
};

// End new questions

// new test juridica
var KnowledgeTestJuridica = function (fiscalCountry, questionAnswers) {
    var self = this;

    this.companyTypeQuestion = ko.observable(new ComboQuestionJuridica(74, [
        new ComboAnswer(242, 'Sociedad o Comunidad de Bienes'),
        new ComboAnswer(243, ' Fundación, ONG, Entidad Religiosa o Asociación')],
        'Debe responder a la pregunta: Indica el tipo de entidad:',
        questionAnswers.find(function (question) { return question.IdQuestion === 74; }))
    );

    this.investmentOwnerQuestion = ko.observable(new InvestmentOwnerQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 53; })));
    this.percentageCountryQuestion = ko.observable(new PercentageCountryQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 58; })));
    this.ssnQuestion = ko.observable(new SsnQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 59; }), 59));
    this.fatcaCrsQuestion = ko.observable(new FatcaCrsQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 60; })));
    this.sectorQuestion = ko.observable(new SectorQuestionJuridica(questionAnswers.filter(function (question) { return question.IdQuestion === 61; })));
    this.sectorFinantialQuestion = ko.observable(new SectorFinantialQuestion(questionAnswers.filter(function (question) { return question.IdQuestion === 61; })));
    this.realOwnerQuestion = ko.observable(new RealOwnerQuestion());
    this.adminOwnerQuestion = ko.observable(new AdminQuestion());
    this.patronOwnerQuestion = ko.observable(new PatronQuestion());
    this.representationOwnerQuestion = ko.observable(new RepresentativeQuestion());
    this.annualAmountQuestion = ko.observable(new AnnualAmountQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 63; })));
    this.annualBenefitQuestion = ko.observable(new AnnualBenefitQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 64; })));
    this.fundsVolumeQuestion = ko.observable(new FundsVolumeQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 65; })));
    this.activeQuestion = ko.observable(new ActiveQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 66; })));
    this.employeesQuestion = ko.observable(new EmployeesQuestion(questionAnswers.find(function (question) { return question.IdQuestion === 67; })));

    this.owners = ko.computed(function () {
        if (vm.isRealOwner()) {
            return self.realOwnerQuestion().owners();
        } else if (vm.isAdmin()) {
            return self.adminOwnerQuestion().owners();
        } else if (vm.isPatron()) {
            return self.patronOwnerQuestion().owners();
        } else if (vm.isRepresentative()) {
            return self.representationOwnerQuestion().owners();
        }
    });

    this.visibleOwnerSociety = ko.computed(function () {
        return self.companyTypeQuestion().value() != undefined && self.companyTypeQuestion().value().id() == 242;
    }, this);

    this.visibleOwnerFundation = ko.computed(function () {
        return self.companyTypeQuestion().value() != undefined && self.companyTypeQuestion().value().id() == 243;
    }, this);

    this.allowContinue = ko.computed(function () {
        return self.companyTypeQuestion().value() != undefined;
    }, this);

    this.isFinantialCompany = ko.computed(function () {
        return self.fatcaCrsQuestion().isFinantialAnswer();
    }, this);

    this.getOwners = function () {
        var owners = [];
        if (self.visibleOwnerSociety()) {
            owners = self.realOwnerQuestion().owners().push(self.adminOwnerQuestion().owners());
        } else {
            owners = self.patronOwnerQuestion().owners().push(self.representationOwnerQuestion().owners());
        }
        return owners;
    };

    this.IsOk = function () {
        var ok = true;

        var requiredOwners = false;

        if (self.sectorQuestion().getSelectedAnswer() != undefined && self.percentageCountryQuestion().value() != undefined) {
            var cif = vm.personalDataModel().dni()
            var name = vm.personalDataModel().name() == null || vm.personalDataModel().name() == "" ?
                vm.personalDataModel().firstSurname() : vm.personalDataModel().name()
            var answer = self.sectorQuestion().getSelectedAnswer().id();
            var percentageCountry = self.percentageCountryQuestion().value().id;

            Request.AskForRequiredRealOwnerRemediation(fiscalCountry, percentageCountry, cif, name, answer, function (result) {
                requiredOwners = result;
            });
        }

        self.companyTypeQuestion().validate();
        self.investmentOwnerQuestion().validate();
        self.percentageCountryQuestion().validate();
        self.fatcaCrsQuestion().validate();



        if (self.isFinantialCompany()) {
            self.sectorFinantialQuestion().validate();
        } else {
            self.sectorQuestion().validate();
            self.annualAmountQuestion().validate();
            self.annualBenefitQuestion().validate();
            self.fundsVolumeQuestion().validate();
            self.activeQuestion().validate();
            self.employeesQuestion().validate();

            if (requiredOwners) {
                self.realOwnerQuestion().validate();
                self.adminOwnerQuestion().validate();
                self.patronOwnerQuestion().validate();
                self.representationOwnerQuestion().validate();
            }
        }

        ok = self.companyTypeQuestion().questionOK()
            && self.investmentOwnerQuestion().questionOK()
            && self.percentageCountryQuestion().questionOK()
            && self.fatcaCrsQuestion().questionOK()


        if (self.isFinantialCompany()) {
            ok = ok && self.sectorFinantialQuestion().questionOK();
            self.annualAmountQuestion().questionOK(true)
            self.annualBenefitQuestion().questionOK(true)
            self.fundsVolumeQuestion().questionOK(true)
            self.activeQuestion().questionOK(true)
            self.employeesQuestion().questionOK(true);
            self.realOwnerQuestion().questionOK(true);
            self.adminOwnerQuestion().questionOK(true);
            self.patronOwnerQuestion().questionOK(true);
            self.representationOwnerQuestion().questionOK(true);
            self.representationOwnerQuestion().questionOK(true);
        } else {
            ok = ok && self.sectorQuestion().questionOK()
                && self.annualAmountQuestion().questionOK()
                && self.annualBenefitQuestion().questionOK()
                && self.fundsVolumeQuestion().questionOK()
                && self.activeQuestion().questionOK()
                && self.employeesQuestion().questionOK();

            if (requiredOwners) {
                ok = ok
                    && self.realOwnerQuestion().questionOK()
                    && self.adminOwnerQuestion().questionOK()
                    && self.patronOwnerQuestion().questionOK()
                    && self.representationOwnerQuestion().questionOK();
            } else {
                self.realOwnerQuestion().questionOK(true);
                self.adminOwnerQuestion().questionOK(true);
                self.patronOwnerQuestion().questionOK(true);
                self.representationOwnerQuestion().questionOK(true);
            }
        }

        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questionanswers = [];
        questionanswers = questionanswers.concat(
            self.companyTypeQuestion().getQuestionsAnswer(),
            self.investmentOwnerQuestion().getQuestionsAnswer(),
            self.percentageCountryQuestion().getQuestionsAnswer(),
            self.ssnQuestion().getQuestionsAnswer(),
            self.fatcaCrsQuestion().getQuestionsAnswer(),
            self.isFinantialCompany() ? self.sectorFinantialQuestion().getQuestionsAnswer() : self.sectorQuestion().getQuestionsAnswer()
        );

        if (!self.isFinantialCompany()) {
            questionanswers = questionanswers.concat(
                self.annualAmountQuestion().getQuestionsAnswer(),
                self.annualBenefitQuestion().getQuestionsAnswer(),
                self.fundsVolumeQuestion().getQuestionsAnswer(),
                self.activeQuestion().getQuestionsAnswer(),
                self.employeesQuestion().getQuestionsAnswer()
            );
        }

        return questionanswers;
    };

    this.loadQuestionAnswer = function () {
        self.companyTypeQuestion().loadQuestionAnswer();
        self.investmentOwnerQuestion().loadQuestionAnswer();
        self.percentageCountryQuestion().loadQuestionAnswer();
        self.fatcaCrsQuestion().loadQuestionAnswer();
        self.ssnQuestion().loadQuestionAnswer();
        self.sectorQuestion().loadQuestionAnswer();
        self.sectorFinantialQuestion().loadQuestionAnswer();
        self.annualAmountQuestion().loadQuestionAnswer(),
            self.annualBenefitQuestion().loadQuestionAnswer(),
            self.fundsVolumeQuestion().loadQuestionAnswer(),
            self.activeQuestion().loadQuestionAnswer(),
            self.employeesQuestion().loadQuestionAnswer()
    }
};


var ConvenienceTest = function (applicant) {
    var self = this;

    this.instrumentQuestion = ko.observable(new InstrumentQuestion());
    this.experienceQuestion = ko.observable(new ExperienceQuestion());

    this.IsOk = function () {
        var ok = true;

        self.instrumentQuestion().validate();
        self.experienceQuestion().validate();

        ok = self.instrumentQuestion().questionOK() && self.experienceQuestion().questionOK();

        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questionanswers = [];
        questionanswers = questionanswers.concat(
            self.instrumentQuestion().getQuestionsAnswer(),
            self.experienceQuestion().getQuestionsAnswer()
        );

        return questionanswers;
    };
};

/* Knowledge test questions */

/* Confirm question */

var ConfirmQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 29; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 29; }).ErrorMessage);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(29);
    this.checked = ko.observable(userQuestionAnswer != undefined ? userQuestionAnswer.IdAnswer == 85 : false);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);


    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.checked();
        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];
        questions.push({ "idQuestion": self.id(), "idAnswer": 85, "OtherAnswer": "" });
        return questions;
    };
};

/* fiscal residence question */
var FiscalResidenceQuestion = function (fiscalCountry) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 34; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 34; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 34; }).QuestionLabel);
    this.id = ko.observable(34);
    this.value = ko.observable(vm.countryCollection().find(function (a) { return a.id == fiscalCountry; }));
    this.countryName = ko.observable(self.value() != undefined ? self.value().valor : '');
    this.allowcountry = ko.observable(fiscalCountry == 0 || fiscalCountry == undefined)
    this.validateNow = ko.observable(false);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);
    this.questionIsFullOk = ko.observable(true);

    //subquestions
    this.DocumentNnumber = ko.observable(new TextQuestion(36, 'Debe responder a la pregunta: Número de tu documento de identidad'));
    this.DocumentType = ko.observable(new ComboQuestion(35, [
        new ComboAnswer(244, 'DNI/Equivalente'),
        new ComboAnswer(245, 'Pasaporte'),
        new ComboAnswer(246, 'Tarjeta de identificación expedida por autoridades del país de la UE o EEE.', false, 'UE: Unión Europea EEE: Espacio Económico Europeo', 1)],
        'Debe responder a la pregunta: Confirma tu tipo de documento')
    );
    this.DocumentExpirationDate = ko.observable(new TextDateQuestion(37, 'Debe responder a la pregunta: Fecha de caducidad del documento, con una fecha válida'));
    this.DocumentIdentification = ko.observable(new TextQuestion(38, 'Debe responder a la pregunta: Número de identificación fiscal'));

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        if (self.value() == null) {
            ok = false;
            self.questionOK(false);
            self.questionIsFullOk(ok);
        }
        else {
            self.questionOK(true);
            if (self.value().id != "1") {
                self.DocumentNnumber().validateNow(true);
                self.DocumentType().validateNow(true);
                self.DocumentExpirationDate().validateNow(true);
                self.DocumentIdentification().validateNow(true);

                self.DocumentNnumber().questionOK(
                    self.DocumentNnumber().value() != null && self.DocumentNnumber().value().trim().length > 0
                );

                self.DocumentType().questionOK(
                    self.DocumentType().value() != null
                );

                self.DocumentExpirationDate().questionOK(
                    self.DocumentExpirationDate().value() != null && !self.DocumentExpirationDate().value().DateIsNull() && self.DocumentExpirationDate().value().DateIsExpiredOk()
                );

                self.DocumentIdentification().questionOK(
                    self.DocumentIdentification().value() != null
                );

                ok = self.DocumentNnumber().questionOK()
                    && self.DocumentType().questionOK()
                    && self.DocumentExpirationDate().questionOK()
                    && self.DocumentIdentification().questionOK();
            }
        }

        self.questionIsFullOk(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        if (self.value() != undefined) {
            var fiscalCountry = {
                "idQuestion": self.id(), "idAnswer": self.value().id, "OtherAnswer": ""
            };
            questions.push(fiscalCountry);

            if (self.value().id != "1") {
                questions.push({ "idQuestion": self.DocumentNnumber().id(), "idAnswer": 1, "OtherAnswer": self.DocumentNnumber().value() });
                questions.push({ "idQuestion": self.DocumentType().id(), "idAnswer": self.DocumentType().value().id(), "OtherAnswer": "" });
                questions.push({ "idQuestion": self.DocumentExpirationDate().id(), "idAnswer": self.DocumentExpirationDate().value().getDate().year(), "OtherAnswer": self.DocumentExpirationDate().value().parseString() });
                questions.push({ "idQuestion": self.DocumentIdentification().id(), "idAnswer": 1, "OtherAnswer": self.DocumentIdentification().value() });
            }
        }

        return questions;
    };

    this.selected = ko.computed(function () {
        return self.value() != null && self.value().id != "1";
    }, this);
};

/* Second country question */

var SecondCountryQuestion = function (enabled) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 39; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 39; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 39; }).QuestionLabel);
    this.id = ko.observable(39);
    this.value = ko.observable();
    this.enabled = ko.observable(enabled);
    this.validateNow = ko.observable(false);
    this.questionOK = ko.observable(true);
    this.questionIsFullOk = ko.observable(true);

    //subquestions
    this.SecondDocumentNumber = ko.observable(new TextQuestion(41, 'Debe responder a la pregunta: Número del documento'));
    this.SecondDocumentType = ko.observable(new ComboQuestion(40, [
        new ComboAnswer(86, 'DNI/Equivalente'),
        new ComboAnswer(87, 'Pasaporte'),
        new ComboAnswer(88, 'Tarjeta de identificación expedida por autoridades del país de la UE o EEE.', false, 'UE: Unión Europea EEE: Espacio Económico Europeo', 1)],
        'Debe responder a la pregunta: Confirma tu tipo de documento')
    );
    this.SecondDocumentExpirationDate = ko.observable(new TextDateQuestion(42, 'Debe responder a la pregunta: Fecha de caducidad del documento, con una fecha válida'));
    this.SecondDocumentIdentification = ko.observable(new TextQuestion(43, 'Debe responder a la pregunta: Número de identificación fiscal (TIN – TAX identification Number)'));

    this.selected = ko.computed(function () {
        return self.value() != null;
    }, this);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        if (self.value() != null) {
            self.SecondDocumentNumber().validateNow(true);
            self.SecondDocumentType().validateNow(true);
            self.SecondDocumentExpirationDate().validateNow(true);
            self.SecondDocumentIdentification().validateNow(true);

            self.SecondDocumentNumber().questionOK(
                self.SecondDocumentNumber().value() != null && self.SecondDocumentNumber().value().trim().length > 0
            );

            self.SecondDocumentType().questionOK(
                self.SecondDocumentType().value() != null
            );

            self.SecondDocumentExpirationDate().questionOK(
                self.SecondDocumentExpirationDate().value() != null && !self.SecondDocumentExpirationDate().value().DateIsNull() && self.SecondDocumentExpirationDate().value().DateIsExpiredOk()
            );

            self.SecondDocumentIdentification().questionOK(
                self.SecondDocumentIdentification().value() != null
            );

            ok = self.SecondDocumentNumber().questionOK()
                && self.SecondDocumentType().questionOK()
                && self.SecondDocumentExpirationDate().questionOK()
                && self.SecondDocumentIdentification().questionOK();
        }

        self.questionIsFullOk(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        if (self.value() != undefined) {
            var fiscalCountry = {
                "idQuestion": self.id(), "idAnswer": self.value().id, "OtherAnswer": ""
            };
            questions.push(fiscalCountry);

            questions.push({ "idQuestion": self.SecondDocumentNumber().id(), "idAnswer": 1, "OtherAnswer": self.SecondDocumentNumber().value() });
            questions.push({ "idQuestion": self.SecondDocumentType().id(), "idAnswer": self.SecondDocumentType().value().id(), "OtherAnswer": "" });
            questions.push({ "idQuestion": self.SecondDocumentExpirationDate().id(), "idAnswer": self.SecondDocumentExpirationDate().value().getDate().year(), "OtherAnswer": self.SecondDocumentExpirationDate().value().parseString() });
            questions.push({ "idQuestion": self.SecondDocumentIdentification().id(), "idAnswer": 1, "OtherAnswer": self.SecondDocumentIdentification().value() });
        }

        return questions;
    };
};

/* EEUU SSN question */

var SsnQuestion = function (userQuestionAnswer, id = 44) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === id; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === id; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === id; }).QuestionLabel);
    this.id = ko.observable(id);
    this.value = ko.observable(userQuestionAnswer != undefined ? userQuestionAnswer.OtherAnswer : '');
    this.label = ko.observable();

    this.getQuestionsAnswer = function () {
        var questions = [];
        if (self.value() != null && self.value().trim().length > 0) {
            var ssn = {
                "idQuestion": self.id(), "idAnswer": 1, "OtherAnswer": self.value()
            };
            questions.push(ssn);
        }

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined) {
            var answer = userQuestionAnswer.OtherAnswer;
            if (answer != undefined) {
                self.value(answer);
            }
        }
    }
};


/* Ocupation question */

var OccupationQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 45; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 45; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 45; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(45);
    this.value = ko.observable();
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);
    this.answers = ko.observableArray([
        new ComboAnswer(139, 'Desempleado'),
        new ComboAnswer(140, 'Ama de casa'),
        new ComboAnswer(141, 'Jubilado'),
        new ComboAnswer(142, 'Trabajador por cuenta ajena'),
        new ComboAnswer(143, 'Trabajador por cuenta propia'),
        new ComboAnswer(144, 'Estudiante/Menor de edad')
    ]);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.value() != null;
        self.questionOK(ok);

        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];
        var occupation = {
            "idQuestion": self.id(), "idAnswer": self.value().id, "OtherAnswer": ""
        };
        questions.push(occupation);

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined) {
            var answer = self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer.IdAnswer });
            if (answer != undefined) {
                self.value(answer);
            }
        }
    }

};

/* Sector question */

var SectorQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 46; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 46; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 46; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(46);
    this.answers = ko.observableArray([
        new SectorAnswer(145, 'Agricultura, Ganadería y Pesca'),
        new SectorAnswer(
            146,
            'Industria, Agua, Metalurgia y Energía',
            [
                new SectorAnswer(1023, 'Extracción de materiales preciosos o combustibles'),
                new SectorAnswer(1024, 'Reciclado de metales'),
                new SectorAnswer(1025, 'Vehículos (fabribación/reparación)'),
                new SectorAnswer(1026, 'Armamentística'),
                new SectorAnswer(1027, 'Tabaco'),
                new SectorAnswer(1028, 'Alcohol'),
                new SectorAnswer(1029, 'Otros')
            ]),
        new SectorAnswer(147, 'Inmobiliaria y Construcción'),
        new SectorAnswer(148, 'Comercio'),
        new SectorAnswer(149, 'Transporte, almacenamiento y distribución'),
        new SectorAnswer(150, 'Hostelería y Restauración'),
        new SectorAnswer(151, 'Comunicación, prensa y televisivón'),
        new SectorAnswer(152, 'Banca y Servicios financieros', [
            new SectorAnswer(1030, 'Banca privada'),
            new SectorAnswer(1031, 'Seguros'),
            new SectorAnswer(1032, 'Otros')
        ]),
        new SectorAnswer(153, 'Envío de divisas'),
        new SectorAnswer(154, 'Casa de cambio de Moneda'),
        new SectorAnswer(155, 'Enseñanza/Educación'),
        new SectorAnswer(156, 'Sanidad y servicios sociales', [
            new SectorAnswer(1033, 'Odontología'),
            new SectorAnswer(1034, 'Cirugía plástica'),
            new SectorAnswer(1035, 'Farmacia'),
            new SectorAnswer(1036, 'Otras especialidades')
        ]),
        new SectorAnswer(157, 'Espectáculos-deportes'),
        new SectorAnswer(158, 'Servicios Profesionales', null, false, 'Servicios profesionales: Consultoría, gestoría, abogacía, auditoría, contabilidad, estudio de arquitectura, estudio de ingeniería, estudio de decoración, investigación, publicidad, veterinaria, traducción y fotografía.', 1),
        new SectorAnswer(159, 'Actividades de organizaciones y organismos extraterritoriales'),
        new SectorAnswer(160, 'Administración pública'),
        new SectorAnswer(161, 'Rentista', null, false, 'Rentista: Aquellos que perciban rentas de bienes muebles y/o inmuebles (ej. dividendos, alquileres, etc.', 2),
        new SectorAnswer(162, 'Ama de casa/Estudiante/Menor de edad'),
        new SectorAnswer(163, 'Otros servicios',
            [
                new SectorAnswer(1037, 'Asociaciones/sindicatos/Organizaciones sin ánimo de lucro/Órdenes religiosas'),
                new SectorAnswer(1038, 'Reparación de efectos personales y artículos de uso doméstico'),
                new SectorAnswer(1039, 'Otros (En caso de ser ésta la opción seleccionada, es de obligada cumplimentación el siguiente espacio):', null, true)
            ])
    ]);

    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.manageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                    if (p.subSectors() != null) {
                        p.subSectors().forEach(function (s) {
                            s.checked(false);
                        });
                    }
                }
            });
        } else {
            if (scope.subSectors() != null) {
                scope.subSectors().forEach(function (subsector) {
                    subsector.checked(false);
                });
            }
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var elemchecked = self.answers().find(function (elem) {
            return elem.checked();
        });

        if (elemchecked != undefined) {
            if (elemchecked.showSubSectors()) {
                var subelemchecked = elemchecked.subSectors().find(function (elem) {
                    return elem.checked();
                });
                ok = subelemchecked != undefined && (subelemchecked.isextended() ? subelemchecked.extendedanswer() != undefined && subelemchecked.extendedanswer().trim().length > 0 : true);
            } else {
                ok = ok && (elemchecked.isextended() ? elemchecked.extendedanswer() != undefined && elemchecked.extendedanswer().trim().length > 0 : true);
            }
        } else {
            ok = false;
        }

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        var subanswer = answer.subSectors().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        if (answer.showSubSectors()) {
            questions.push({ "idQuestion": self.id(), "idAnswer": subanswer.id(), "OtherAnswer": subanswer.extendedanswer() });
        }

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined && userQuestionAnswer.length > 0) {
            var answer = self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer });
            if (answer != undefined) {
                self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).checked(true);

                if (userQuestionAnswer.length > 1 && answer.subSectors().length > 0) {
                    self.answers().find(function (comboanswer) {
                        return userQuestionAnswer.some(function (userAnswer) {
                            return comboanswer.id() == userAnswer.IdAnswer;
                        });
                    })?.subSectors().find(function (subanswer) {
                        return userQuestionAnswer.some(function (userAnswer) {
                            return subanswer.id() == userAnswer.IdAnswer;
                        });
                    })?.checked(true);

                    if (userQuestionAnswer[1].OtherAnswer != undefined) {
                        self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer }).subSectors().find(function (subanswer) {
                            return subanswer.id() == userQuestionAnswer[1].IdAnswer;
                        }).extendedanswer(userQuestionAnswer[1].OtherAnswer);
                    }
                }
            }
        }
    }

};

var SectorAnswer = function (answerid, answerlabel, answersubsectors, isextended, tooltip, sup) {
    var self = this;
    this.id = ko.observable(answerid);
    this.label = ko.observable(answerlabel);
    this.checked = ko.observable(false);
    this.extendedanswer = ko.observable();
    this.isextended = ko.observable(isextended);
    this.tooltip = ko.observable(tooltip);
    this.sup = ko.observable(sup);

    this.subSectors = ko.observableArray(answersubsectors);

    this.showSubSectors = ko.computed(function () {
        return self.subSectors() != undefined && self.subSectors().length > 0;
    }, this);

    this.showExtended = ko.computed(function () {
        return self.checked() && self.isextended();
    }, this);

    this.manageSubCheck = function (scope) {
        if (scope.checked() === true) {
            self.subSectors().forEach(function (s) {
                if (s.id() != scope.id()) {
                    s.checked(false);
                }
            });
        }
        return true;
    };
};

/* Cargo question */

var CargoQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 47; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 47; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 47; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(47);
    this.answers = ko.observableArray([
        new ComboAnswer(117, 'Autónomo'),
        new ComboAnswer(118, 'Alto cargo / Directivo'),
        new ComboAnswer(119, 'Gerente / Técnico superior'),
        new ComboAnswer(120, 'Técnico / Administrativo'),
        new ComboAnswer(121, 'Funcionario - Alto cargo / Directivo / Gerente / Cuadro medio'),
        new ComboAnswer(122, 'Funcionario - Técnico / Técnico superior / Administrativo')
    ]);
    this.value = ko.observable();
    this.OtrosAnswer = ko.observable(new TextAnswer(1040));
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);
    this.extendedAnswers = [{ "answer": 118, "dependentAnswer": 1040 }, { "answer": 119, "dependentAnswer": 1041 }, { "answer": 120, "dependentAnswer": 1042 }, { "answer": 121, "dependentAnswer": 1043 }, { "answer": 122, "dependentAnswer": 1044 }];

    this.visibleOtros = ko.computed(function () {
        return self.value() != undefined && self.value().id() != 117;
    }, this);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        if (self.value() != undefined) {
            if (self.visibleOtros()) {
                ok = self.OtrosAnswer().value() != undefined && self.OtrosAnswer().value().trim().length > 0;
            }
        } else {
            ok = false;
        }

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        questions.push({ "idQuestion": self.id(), "idAnswer": self.value().id(), "OtherAnswer": "" });

        if (self.visibleOtros()) {
            var extendedAnswerId = self.extendedAnswers.find(function (obj) { return obj.answer == self.value().id(); }).dependentAnswer;
            questions.push({ "idQuestion": self.id(), "idAnswer": extendedAnswerId, "OtherAnswer": self.OtrosAnswer().value() });
        }

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined && userQuestionAnswer.length > 0) {
            var answer = self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer });
            if (answer != undefined) {
                self.value(answer);
                if (userQuestionAnswer.length > 1) {
                    self.OtrosAnswer(new TextAnswer(userQuestionAnswer[1].IdAnswer));
                    self.OtrosAnswer().value(userQuestionAnswer[1].OtherAnswer);
                }
            }
        }
    }
};

/* Public person question */

var PublicPositionQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 48; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 48; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 48; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(48);
    this.answers = ko.observableArray([
        new ComboAnswer(136, 'Sí'),
        new ComboAnswer(135, 'No')
    ]);
    this.entity = ko.observable(new TextAnswer(1018));
    this.department = ko.observable(new TextAnswer(1019));
    this.position = ko.observable(new TextAnswer(1020));
    this.value = ko.observable();

    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.IsOk = function () {
        return self.value() != undefined; //self.yes() != undefined || self.no() != undefined;
    };

    this.showextended = ko.computed(function () {
        return self.value() != undefined && self.value().id() === 136;
    }, this);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        if (self.value() == undefined) {
            ok = false;
        } else if (self.value() != undefined && self.value().id() === 136) {
            ok = (self.entity() != undefined && self.entity().value() != undefined && self.entity().value().trim().length > 0) &&
                (self.department() != undefined && self.department().value() != undefined && self.department().value().trim().length > 0) &&
                (self.position() != undefined && self.position().value() != undefined && self.position().value().trim().length > 0);
        } else if (self.value() != undefined && self.value().id() === 135) {
            ok = true;
        } else {
            ok = false;
        }

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        questions.push({ "idQuestion": self.id(), "idAnswer": self.value().id(), "OtherAnswer": "" });

        if (self.showextended()) {
            questions.push({ "idQuestion": self.id(), "idAnswer": self.entity().id(), "OtherAnswer": self.entity().value() });
            questions.push({ "idQuestion": self.id(), "idAnswer": self.department().id(), "OtherAnswer": self.department().value() });
            questions.push({ "idQuestion": self.id(), "idAnswer": self.position().id(), "OtherAnswer": self.position().value() });
        }

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined && userQuestionAnswer.length > 0) {
            var answer = self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer });
            if (answer != undefined) {
                self.value(answer);

                if (userQuestionAnswer.length > 1) {

                    var entity = userQuestionAnswer.find(function (answer) { return answer.IdAnswer == 1018 });
                    self.entity().value(entity.OtherAnswer);

                    var department = userQuestionAnswer.find(function (answer) { return answer.IdAnswer == 1019 });
                    self.department().value(department.OtherAnswer);

                    var position = userQuestionAnswer.find(function (answer) { return answer.IdAnswer == 1020 });
                    self.position().value(position.OtherAnswer);

                }
            }
        }
    }

};

/* ONG question */

var OngQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 50; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 50; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 50; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(50);
    this.answers = ko.observableArray([
        new ComboAnswer(138, 'Sí'),
        new ComboAnswer(137, 'No')
    ]);
    this.entity = ko.observable(new TextAnswer(1021));
    this.position = ko.observable(new TextAnswer(1022));
    this.value = ko.observable();
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.IsOk = function () {
        return self.yes() != undefined || self.no() != undefined;
    };

    this.showextended = ko.computed(function () {
        return self.value() != undefined && self.value().id() === 138;
    }, this);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        if (self.value() == undefined) {
            ok = false;
        } else if (self.value() != undefined && self.value().id() === 138) {
            ok = (self.entity() != undefined && self.entity().value() != undefined && self.entity().value().trim().length > 0) &&
                (self.position() != undefined && self.position().value() != undefined && self.position().value().trim().length > 0);
        } else if (self.value() != undefined && self.value().id() === 137) {
            ok = true;
        } else {
            ok = false;
        }

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        questions.push({ "idQuestion": self.id(), "idAnswer": self.value().id(), "OtherAnswer": "" });

        if (self.showextended()) {
            questions.push({ "idQuestion": self.id(), "idAnswer": self.entity().id(), "OtherAnswer": self.entity().value() });
            questions.push({ "idQuestion": self.id(), "idAnswer": self.position().id(), "OtherAnswer": self.position().value() });
        }

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined && userQuestionAnswer.length > 0) {
            var answer = self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer[0].IdAnswer });
            if (answer != undefined) {
                self.value(answer);

                if (userQuestionAnswer.length > 1) {

                    var entity = userQuestionAnswer.find(function (answer) { return answer.IdAnswer == 1021 });
                    self.entity().value(entity.OtherAnswer);


                    var position = userQuestionAnswer.find(function (answer) { return answer.IdAnswer == 1022 });
                    self.position().value(position.OtherAnswer);

                }
            }
        }
    }
};

/* Origin money question */

var OriginMoneyQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 51; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 51; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 51; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(51);
    this.value = ko.observable();
    this.answers = ko.observableArray([
        new CheckAnswer(109, 'Salario', false),
        new CheckAnswer(110, 'Actividad empresarial', false),
        new CheckAnswer(111, 'Venta de bienes', false),
        new CheckAnswer(112, 'Indemnización', false),
        new CheckAnswer(113, 'Herencia', false),
        new CheckAnswer(114, 'Donación', false),
        new CheckAnswer(115, 'Ahorros', false),
        new CheckAnswer(116, 'Otros (Especificar):', true)
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.ManageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                }
            });
        }

        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var answersChecked = self.answers().filter(function (answer) {
            return answer.checked();
        });

        if (answersChecked.length > 0) {
            answersChecked.forEach(function (answer) {
                ok = ok && ((answer.isextended() && answer.extendedtext() != undefined && answer.extendedtext().trim().length > 0) || !answer.isextended());
            });
        } else {
            ok = false;
        }

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        self.answers().forEach(function (answer) {
            if (answer.checked()) {
                questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": answer.isextended() === true ? answer.extendedtext() : "" });
            }
        });

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined && userQuestionAnswer.length > 0) {
            userQuestionAnswer.forEach(function (answer) {
                self.answers().find(function (comboanswer) { return comboanswer.id() == answer.IdAnswer }).checked(true);
            });
        }
    }
};

/* Annual income question*/

var AnnualIncomeQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 52; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 52; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 52; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(52);
    this.answers = ko.observableArray([
        new CheckAnswer(225, 'Entre 0€ y 40.000€', false),
        new CheckAnswer(226, 'Entre 40.000€ y 80.000€', false),
        new CheckAnswer(227, 'Entre 80.000€ y 150.000€', false),
        new CheckAnswer(228, 'Más de 150.000€', false)
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.ManageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                }
            });
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.answers().some(function (elem) {
            return elem.checked();
        });
        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined) {
            self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer.IdAnswer }).checked(true);
        }
    }
};

/* Prp question*/

var PrpQuestion = function (userQuestionAnswer) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 49; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 49; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 49; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(49);
    this.answers = ko.observableArray([
        new CheckAnswer(213, 'Jefes de Estado, de gobierno / consejeros de gobierno /ministros / secretario de Estado o subsecretario / delegado de gobierno / miembro parlamentario / diputado autonómico', true),
        new CheckAnswer(214, 'Magistrado del tribunal supremo / del tribunal constitucional u otras altas instancias judiciales cuyas decisiones no admitan normalmente recurso, salvo en circunstancias excepcionales, con inclusión de los miembros equivalentes del Ministerio Fiscal', true),
        new CheckAnswer(215, 'Miembro del tribunal de cuentas / consejero de bancos centrales', true),
        new CheckAnswer(216, 'Embajadores / jefes de misión diplomática permanente / jefe de representación permanente ante organizaciones internacionales y encargados de negocios', true),
        new CheckAnswer(217, 'Alto personal militar de las Fuerzas Armadas', true),
        new CheckAnswer(218, 'Miembro de órganos de administración/ de gestión / de supervisión de empresas de titularidad pública', true),
        new CheckAnswer(219, 'Presidente y/o Vicepresidente y/o miembro del Consejo de la Comisión Nacional de los Mercados y de la Competencia / Presidente del Consejo de Transparencia y Buen Gobierno / Presidente de la Autoridad Independiente de Responsabilidad Fiscal / Presidente y/o Vicepresidente y/o Vocal del Consejo de la Comisión Nacional del Mercado de Valores / Presidente y/o Consejero y/o Secretario General del Consejo de Seguridad Nuclear / Presidente y/o miembro de los órganos rectores de cualquier otro organismo regulador o de supervisión', true),
        new CheckAnswer(220, 'Director/ Director ejecutivo / Secretario General y/o equivalente de los organismos reguladores y de supervisión', true),
        new CheckAnswer(221, 'Titular de cualquier otro puesto de trabajo en el sector público estatal, cualquiera que sea su denominación, cuyo nombramiento se efectúe por el Consejo de Ministros, con excepción de aquellos que tengan la consideración de Subdirector General y asimilado', true),
        new CheckAnswer(222, 'Alcaldes, concejales y las personas que desempeñen cargos equivalentes de los municipios capitales de provincia, o de Comunidad Autónoma y de las Entidades Locales de más de 50.000 habitantes', true),
        new CheckAnswer(223, 'Cargos de alta dirección en organizaciones sindicales o empresariales españolas', true),
        new CheckAnswer(224, 'Familiar directo y/o allegado de alguna de las personas citadas anteriormente', true)
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.manageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                }
            });
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var elemchecked = self.answers().find(function (elem) {
            return elem.checked();
        });

        if (elemchecked != undefined) {
            ok = elemchecked.extendedtext() != undefined && elemchecked.extendedtext().trim().length > 0;
        } else {
            ok = false;
        }

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": answer.isextended() === true ? answer.extendedtext() : "" });

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined && userQuestionAnswer.length > 0) {
            self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer.IdAnswer }).checked(true);
            if (userQuestionAnswer.OtherAnswer != undefined) {
                self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer.IdAnswer }).extendedtext(userQuestionAnswer.OtherAnswer);
            }
        }
    }
};


/* Generic types */

var TextAnswer = function (answerid) {
    var self = this;
    this.id = ko.observable(answerid);
    this.value = ko.observable();
};

var YesNoAnswer = function (answerid, answerlabel) {
    var self = this;
    this.id = ko.observable(answerid);
    this.label = ko.observable(answerlabel);
    this.value = ko.observable();
};

var CheckAnswer = function (answerid, answerlabel, answerisextended) {
    var self = this;
    this.id = ko.observable(answerid);
    this.label = ko.observable(answerlabel);
    this.checked = ko.observable(false);
    this.isextended = ko.observable(answerisextended);
    this.extendedtext = ko.observable();

    this.showextendedinput = ko.computed(function () {
        return self.checked() === true && self.isextended() === true;
    }, this);
};

var ComboAnswer = function (answerid, answerlabel, answerisextended, tooltip, sup) {
    var self = this;
    this.id = ko.observable(answerid);
    this.label = ko.observable(answerlabel);
    this.value = ko.observable();
    this.isExtended = ko.observable(answerisextended);
    this.extendedAnswer = ko.observable();
    this.tooltip = ko.observable(tooltip);
    this.sup = ko.observable(sup);
};

var TextDateQuestion = function (questionid, errormessage) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(questionid);
    this.value = ko.observable(new CustomDate());
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);
};

var TextQuestion = function (questionid, errormessage) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(questionid);
    this.value = ko.observable();
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);
};

var ComboQuestion = function (questionid, options, errormessage) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(questionid);
    this.value = ko.observable();
    this.answers = ko.observableArray(options);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.showExtended = ko.computed(function () {
        return self.value() != null && self.value().isExtended();
    }, this);

};

//new
var ComboQuestionJuridica = function (questionid, options, errormessage, userQuestionAnswer, disabled = false) {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === questionid; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.disabled = ko.observable(disabled);
    this.id = ko.observable(questionid);
    this.value = ko.observable();
    this.answers = ko.observableArray(options);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: self.ErrorMessage(),
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.showExtended = ko.computed(function () {
        return self.value() != null && self.value().isExtended();
    }, this);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        ok = self.value() != undefined;

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        questions.push({ "idQuestion": self.id(), "idAnswer": self.value().id(), "OtherAnswer": "" });

        return questions;
    };

    this.loadQuestionAnswer = function () {
        if (userQuestionAnswer != undefined) {
            var answer = self.answers().find(function (comboanswer) { return comboanswer.id() == userQuestionAnswer.IdAnswer });
            if (answer != undefined) {
                self.value(answer);
            }
        }
    }
};

/* Convenience test questions */

var InstrumentQuestion = function () {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 21; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 21; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 21; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(21);
    this.answers = ko.observableArray([
        new CheckAnswer(63, 'Ninguno', false),
        new CheckAnswer(64, 'Renta fija, fondos de inversión monetarios, de renta fija, renta fija mixta o garantizados.', false),
        new CheckAnswer(65, 'Fondos de inversión de renta variable, variable mixta, global o inversión directa en acciones cotizadas.', false),
        new CheckAnswer(66, 'Fondos de inversión libre - Hedge Funds -.', false)
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: 'Debe responder a la pregunta: Señala aquellos instrumentos financieros en los que durante los últimos 5 años has realizado dos o más operaciones de importe superior a 3.000 euros, o sobre los que mantienes o has tenido en ese periodo dos o más posiciones de, al menos, ese importe.',
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.ManageCheck = function (scope) {
        if (scope.checked() === true && scope.id() === 63) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                }
            });
        } else {
            var ninguno = self.answers().find(function (q) {
                return q.id() === 63;
            });
            ninguno.checked(false);
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.answers().some(function (elem) {
            return elem.checked();
        });
        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": "" });

        return questions;
    };
};

var ExperienceQuestion = function () {
    var self = this;
    this.questionText = ko.observable(questions.find(function (question) { return question.IdQuestion === 22; }).Question);
    this.ErrorMessage = ko.observable(questions.find(function (question) { return question.IdQuestion === 22; }).ErrorMessage);
    this.questionLabel = ko.observable(questions.find(function (question) { return question.IdQuestion === 22; }).QuestionLabel);
    this.validateNow = ko.observable(false);
    this.id = ko.observable(22);
    this.answers = ko.observableArray([
        new CheckAnswer(80, 'No', false),
        new CheckAnswer(67, 'Sí', true)
    ]);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: 'Debe responder a la pregunta: ¿Tienes experiencia profesional en el mercado de valores ocupando cargos que requieran elevados conocimiento de instrumentos financieros? En caso afirmativo, resume brevemente tu experiencia profesional (cargo, empresa, número de años, ...)',
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);

    this.ManageCheck = function (scope) {
        if (scope.checked() === true) {
            self.answers().forEach(function (p) {
                if (p.id() != scope.id()) {
                    p.checked(false);
                }
            });
        }
        return true;
    };

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var elemchecked = self.answers().find(function (elem) {
            return elem.checked();
        });

        if (elemchecked != undefined) {
            ok = elemchecked.isextended() ? (elemchecked.extendedtext() != undefined && elemchecked.extendedtext().trim().length > 0) : true;
        } else {
            ok = false;
        }

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        var answer = self.answers().find(function (q) {
            return q.checked();
        });

        questions.push({ "idQuestion": self.id(), "idAnswer": answer.id(), "OtherAnswer": answer.isextended() === true ? answer.extendedtext() : "" });

        return questions;
    };
};

function Request() { }

Request.SendHelpMail = function (phone) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: routeCollection.API_Remediacion_SendHelpMail,
            context: this,
            type: "POST",
            crossDomain: false,
            data: phone,
            dataType: "json",
            contentType: 'application/json; charset=utf-8'
        }).done(function (data) {
            resolve(true);
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

Request.GetLegalModalContent = function () {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: routeCollection.API_Remediacion_LegalModalContent,
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

Request.AskForRequiredRealOwnerRemediation = function (fiscalCountry, percentageCountry, cif, name, answer, callback) {
    var data = {
        FiscalCountryId: fiscalCountry,
        MostProfitableCountry: percentageCountry,
        cif: cif,
        OrganizationName: name,
        SectorAnswer: answer
    };
    customDebug(data, 'Request.AskForRequiredRealOwnerRemediation');
    $.ajax({
        url: apiConfig.API_Juridica_Remediation_AskForRequiredRealOwner,
        context: this,
        type: "POST",
        crossDomain: false,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        headers: { 'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val() },
        async: false
    }).done(function (data) {
        customDebug(data, apiConfig.API_Juridica_Remediation_AskForRequiredRealOwner);
        callback(data);
    }).error(function (ex) {
        customDebug(ex, apiConfig.API_Juridica_Remediation_AskForRequiredRealOwner);
        callback(false);
    });
};