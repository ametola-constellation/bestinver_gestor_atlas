'use strict';

var NumFormatLocale = new Intl.NumberFormat("es-ES");

var SvgFileEnum = {
    FONDO: "<svg width='32' height='21' viewBox='0 0 32 21' xmlns='http://www.w3.org/2000/svg'><g stroke='#000' stroke-width='2.444' fill='none' fill-rule='evenodd'><path d='M.156 19.559h31.148M.787 13.048l7.999-6.606 8.838 4.934L29.832.926'></path></g></svg>",
    PLAN: "<svg width='32' height='24' viewBox='0 0 32 24' xmlns='http://www.w3.org/2000/svg'><g stroke-width='2.19' stroke='#000' fill='none' fill-rule='evenodd'><path d='M2 22.154h14.221V1.094H2zM16.221 22.154h14.221V1.094h-14.22zM5.532 6.805h3.346M5.532 11.186h6.692M5.532 15.567h6.692M18.917 15.567h8.923M20.032 12.281V8.996M23.378 12.281V6.805M26.724 12.281V8.996'></path></g></svg>",
    EPSV: "<svg width='29' height='23' viewBox='0 0 29 23' xmlns='http://www.w3.org/2000/svg'><g fill-rule='evenodd'><path d='M0 22.192h28.31V.001H0v22.191zM2.071 2.09h24.167v7.542h-4.05l-5.55 3.14-5.547.09-5.512 3.481H2.071V2.09zm0 16.343h4.103l5.527-3.49 5.494-.088 5.534-3.132h3.509v8.378H2.07v-1.668z'></path><path d='M4.488 10.573h5.178v-2.09H4.488zm0-3.554h2.589V4.928h-2.59z'></path></g></svg>",
    TRANSFER: "<svg width='24' height='32' viewBox='0 0 24 32' xmlns='http://www.w3.org/2000/svg'><g stroke-width='2' stroke='#000' fill='none' fill-rule='evenodd' opacity='.8'><path d='M1.645 8.25h20.148'></path><path d='M1.395 8.25l6.755 6.848M1.395 8.25L8.15 1.4' stroke-linecap='square'></path><path d='M21.544 23.584H1.395'></path><path d='M21.793 23.584l-6.755 6.849M21.793 23.584l-6.755-6.848' stroke-linecap='square'></path></g></svg>",
    SUBSCRIPTION: "<svg width='32' height='22' viewBox='0 0 32 22' xmlns='http://www.w3.org/2000/svg'><g stroke='#000' fill='none' fill-rule='evenodd' opacity='.8'><path stroke-width='2' d='M1.001 21h29.398V1H1.001zM1.775 6.888h29.04'></path><path d='M9.276 17h4.065M4.103 17H8.17M14.448 17h4.066'></path></g></svg>"
};

var Valor = function (k, v, d, t, s) {
    this.id = k;
    this.valor = v;
    this.descripcion = d;
    this.tooltip = t;
    this.svgfile = s;
};

var IsProductComplex = false;
var IsAltaCrii = true;

var PdfDocument = function (_name, _url) {
    var self = this;
    this.name = _name;
    this.url = _url;
    this.linkhtml = "<a href=" + "'" + _url + "'" + " title='Ver documento' class='link brown darken iframeLightbox pdf'><span>Ver documento</span></a>";

    this.EventPdf = function () {
        GMT.PushEventNoPageName('descarga pdf', self.name);
    };
};

var PdfDocumentData = function () {
    var self = this;

    this.Dni = ko.observable();
    this.OtpsToken = ko.observable();
    this.OtpsTokensSigner = ko.observable();
    this.ElectronicSignatureServiceVersion = ko.observable();
    this.AccessToken = ko.observable();
    this.OtpsId = ko.observable();
    this.DocumentList = ko.observableArray();
    this.CompleteName = ko.observable();
    this.RequestApplicantType = ko.observable();
    this.Signed = ko.observable(false);
};

var SignatureDataConfirmPhone = function (prefix, mobile, name, dni, type) {
    var self = this;

    this.validateNow = ko.observable(false);

    this.IsMobilePhoneOk = ko.observable().extend({
        required: {
            message: "Por favor indique si su teléfono móvil es correcto",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.MobilePhonePrefix = ko.observable(prefix).extend({
        minLength: {
            params: 2,
            message: "Por favor indique un prefijo",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        pattern: {
            message: "Formato no válido para el prefijo",
            params: /^\+[0-9]{1,3}$/,
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.MobilePhone = ko.observable(mobile).extend({
        required: {
            message: "Por favor indique su teléfono móvil",
            onlyIf: function () {
                return self.validateNow() && self.IsMobilePhoneOk() == 'false';
            }
        },
        pattern: {
            message: "Formato no válido para el teléfono móvil",
            params: /^[6|7]{1}([\d]{2}[-]*){3}[\d]{2}$/,
            onlyIf: function () {
                return self.validateNow() && self.IsMobilePhoneOk() == 'false' && self.MobilePhonePrefix().indexOf("+34") >= 0;
            }
        },
        NoRepeatNumber: {
            message: "Formato no válido para el teléfono móvil",
            onlyIf: function () {
                return self.validateNow() && self.IsMobilePhoneOk() == 'false';
            }
        }
    });
    this.ApplicantName = ko.observable(name);
    this.ApplicantDni = ko.observable(dni);
    this.RequestApplicantType = ko.observable(type);
    this.OldMobile = '';
    this.OldPrefix = '';
    this.errors = ko.validation.group(this);

    self.IsMobilePhoneOk.subscribe(function (newValue) {
        if (newValue == 'true') {
            self.MobilePhone(self.OldMobile);
            self.MobilePhonePrefix(self.OldPrefix);
        }
    });

    this.ViewModelToJSON = ko.pureComputed(function () {
        var data = {
            ApplicantId: self.ApplicantDni(),
            MobilePhone: self.MobilePhonePrefix() + self.MobilePhone(),
            IsMobilePhoneOk: self.IsMobilePhoneOk()
        };
        return data;
    }, this);

    this.ValidatePhones = function () {
        self.validateNow(true);
        var ok = true;
        if (self.errors().length === 0) {
            ok = true;
        } else {
            self.errors.showAllMessages();
            ok = false;
        }
        return ok;
    };
};

var SignatureData = function () {

    var self = this;

    this.validateNow = ko.observable(false);
    this.RequestId = ko.observable();
    this.IdDocumentSignatureType = ko.observable().extend({
        required: {
            message: "Por favor indique el tipo de firma"
        },
        onlyIf: function () {
            return self.validateNow();
        }
    });
    this.IdSendingWay = ko.observable().extend({
        required: {
            message: "Por favor indique la forma de envío de la documentación",
            onlyIf: function () {
                return self.validateNow() && self.IdDocumentSignatureType() == DocumentSignatureTypeEnum.MANUSCRITA;
            }
        }
    });
    this.ShowSendingWays = ko.observable(true);
    this.ApplicantPhones = ko.observableArray([]);
    this.ManualAssisted = ko.observable(false);
    this.IsOtherProductFCR = ko.observable(false);
    this.GDPR_Group = ko.observable(false);

    this.errors = ko.validation.group(this);

    self.IdDocumentSignatureType.subscribe(function (newValue) {
        if (newValue == DocumentSignatureTypeEnum.DIGITAL) {
            window.setDatalayerItem('tipoFirma', 'Contrato : Electronica');
            GMT.Push(PageEnum.FIRMA_ELECTRONICA);
            window.SetCleaveClass();
        } else {
            window.setDatalayerItem('tipoFirma', 'Contrato : Manual');
            GMT.Push(PageEnum.FIRMA_MANUAL);
        }
    });

    self.IdSendingWay.subscribe(function (newValue) {
        if (newValue == DocumentSendingWayEnum.ADJUNTAR) {
            window.setDatalayerItem('enviarFirmaManual', 'descarga');
        }
        if (newValue == DocumentSendingWayEnum.CORREO) {
            window.setDatalayerItem('enviarFirmaManual', 'correo postal');
        }
    });

    self.GetMobilePhoneByApplicantToJSON = function () {
        var data = [];
        self.ApplicantPhones().forEach(function (p) {
            data.push(p.ViewModelToJSON());
        });
        return data;
    };

    this.ViewModelToJSON = ko.pureComputed(function () {
        var data = {
            RequestId: self.RequestId(),
            IdDocumentSignatureType: self.IdDocumentSignatureType(),
            IdSendingWay: self.IdDocumentSignatureType() == DocumentSignatureTypeEnum.DIGITAL ? DocumentSendingWayEnum.FIRMA_ONLINE : self.IdSendingWay(),
            MobilePhoneByApplicant: self.GetMobilePhoneByApplicantToJSON()
        };
        return data;
    }, this);

    this.CreateSignatureData = function (scope) {
        self.validateNow(true);
        if (self.errors().length === 0) {

            if (self.IdDocumentSignatureType() == DocumentSignatureTypeEnum.MANUSCRITA) {
                scope.CreateSignatureData();
            } else {
                var phones_ok = true;
                self.ApplicantPhones().forEach(function (a) {
                    if (!a.ValidatePhones()) {
                        phones_ok = false;
                    }
                });

                if (phones_ok) {
                    scope.CreateSignatureData();
                }
            }

        } else {
            self.errors.showAllMessages();
            window.scrollError();
            GMT.PushEventErrorArray(PageEnum.DATOS_BASICOS_TITULAR, 'error', self.errors());
        }
    };
};

var DniData = function () {

    var self = this;

    this.validateNow = ko.observable(false);
    this.IdSendingWay = ko.observable().extend({
        required: {
            message: "Por favor indique un modo de envío",
            onlyIf: function () {
                return self.validateNow() && (self.ScanDni() == 'false');
            }
        }
    });
    this.RequestId = ko.observable();
    this.ScanDni = ko.observable().extend({
        required: {
            message: "Por favor seleccione una opcion de envío",
            onlyIf: function () {
                return self.validateNow() && Utils.ValidateScanDNI();
            }
        }
    });
    this.DNIAnversoBase64 = ko.observable().extend({
        required: {
            message: "Por favor adjunte el dni/nie.",
            onlyIf: function () {
                return self.validateNow() && (self.ScanDni() == 'false') && self.IdSendingWay() == DocumentSendingWayEnum.ADJUNTAR;
            }
        }
    });
    this.DNIReversoBase64 = ko.observable();

    this.DocumentExtensionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: "Debe adjuntar los documentos en formato imagen o pdf",
                onlyIf: function () {
                    return self.validateNow() && self.ScanDni() == 'false';
                }
            }
        });
    this.LibroFamilia = ko.observable();
    this.Dni = ko.observable();
    this.MzdData = ko.observable();
    this.MoveStatus = ko.observable();
    this.ElectronicIDRequestId = ko.observable().extend({
        required: {
            message: "Por favor adjunte el anverso y el reverso del dni/nie. Si su dispositivo no se inicia, puede enviar sus documentos haciendo click en OTRAS OPCIONES",
            onlyIf: function () {
                return self.validateNow() && (self.ScanDni() == 'true');
            }
        }
    });

    this.errors = ko.validation.group(this);

    self.ScanDni.subscribe(function (newValue) {
        if (GMT == undefined) {
            return;
        }
        if (newValue == 'true') {
            window.setDatalayerItem('opcionesEnvio', 'escanear');
            GMT.Push(PageEnum.ESCANEAR);
        }
        else if (newValue == 'false') {
            GMT.Push(PageEnum.OTRAS_OPCIONES);
        }
    });

    self.IdSendingWay.subscribe(function (newValue) {
        switch (newValue) {
            case DocumentSendingWayEnum.ADJUNTAR:
                window.setDatalayerItem('opcionesEnvio', 'adjuntar documentacion');
                break;
            case DocumentSendingWayEnum.CORREO:
                window.setDatalayerItem('opcionesEnvio', 'enviar por correo postal');
                break;
            case DocumentSendingWayEnum.MENSAJERO:
                window.setDatalayerItem('opcionesEnvio', 'solicitar por mensajero gratuito');
                break;
            case DocumentSendingWayEnum.EMAIL:
                window.setDatalayerItem('opcionesEnvio', 'enviar por email');
                break;
        }
    });

    this.IsValid = function () {
        if (!Utils.ValidateScanDNI() && !self.ScanDni() == "true") {
            self.ScanDni("false");
        }
        self.validateNow(true);
        if (self.errors().length === 0) {
            self.validateNow(false);
            return true;
        } else {
            $('#pre-save-applicant-document-data').removeClass('disabled');
            $('#pre-save-applicant-document-data').removeClass('loading');
            self.errors.showAllMessages();
            window.scrollError();
            if (GMT != undefined)
                GMT.PushEventErrorArray(PageEnum.ENVIO_DOCUMENTACION, 'error', self.errors());
            return false;
        }
    };

    this.ViewModelToJSON = ko.pureComputed(function () {
        var data = {
            RequestId: self.RequestId(),
            AnversoDni: self.DNIAnversoBase64(),
            ReversoDni: self.DNIReversoBase64(),
            DNI: self.Dni(),
            MzdData: self.MzdData(),
            IdSendingWay: self.ScanDni() == "true" ? 0 : self.IdSendingWay(),
            LibroFamilia: self.LibroFamilia(),
            moveStatus: self.MoveStatus(),
            ElectronicIDRequestId: self.ElectronicIDRequestId()
        };
        return data;
    }, this);

    this.CreateDniData = function (scope) {
        scope.CreateDniData();
    };

};

var OperationData = function (ProductInit) {

    var self = this;

    this.validateNow = ko.observable(false);
    this.Product = ko.observable(ProductInit);
    this.MaxAmount = ko.observable();
    this.MinAmount = ko.observable();
    this.MaxMonthlyAmount = ko.observable();
    this.MinMonthlyAmount = ko.observable();
    this.IdOperationType = ko.observable().extend({
        required: {
            message: "Por favor indique un tipo de operación",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });

    this.MinMonthlyAmountWithAportacion = ko.observable(50);
    this.MinMonthlyAmountWithNoAportacion = ko.observable(100);

    this.AmountTextError = ko.observable();
    this.Amount = ko.observable('').extend({
        DecimalRequired: {
            message: "Por favor indique el importe",
            onlyIf: function () {
                return (self.validateNow() && (self.IdOperationType() == OperationTypeEnum.APORTACION || self.IdOperationType() == OperationTypeEnum.RECIBO) && Utils.IsNullOrzeroDecimal(self.MonthlyAmount()))
                    ||
                    (self.validateNow() && self.IdOperationType() == OperationTypeEnum.SUSCRIPCION);
            }
        },

        AmountRange: ko.computed(function () {
            return {
                params: {
                    min: self.MinAmount(),
                    max: self.MaxAmount(),
                    validate: (
                        (
                            self.validateNow()
                            && (self.IdOperationType() == OperationTypeEnum.APORTACION || self.IdOperationType() == OperationTypeEnum.SUSCRIPCION || self.IdOperationType() == OperationTypeEnum.RECIBO)
                            && Utils.IsDecimalValidHigherThan(self.Amount(), 0)
                        )
                    ),
                    includeMin: self.MinAmount() > 0,
                    includeMax: self.MaxAmount() > 0
                }
            };
        })
    });
    this.IdWayToPay = ko.observable('1').extend({
        required: {
            message: "Por favor indique la forma de pago",
            onlyIf: function () {
                return self.validateNow()
                    && (self.IdOperationType() == OperationTypeEnum.APORTACION) || (self.IdOperationType() == OperationTypeEnum.SUSCRIPCION);
            }
        }
    });
    this.FondoType = ko.observable('true').extend({
        required: {
            message: "Por favor indique un tipo de fondo",
            onlyIf: function () {
                return self.validateNow()
                    && self.IdOperationType() == OperationTypeEnum.TRASPASO
                    && self.Product().ProductTypeId() != ProductTypeEnum.PLANES;
            }
        }
    });
    this.PlanName = ko.observable().extend({
        validation: {
            validator: function (val) {
                var doValidation = self.validateNow()
                    && self.IdOperationType() == OperationTypeEnum.TRASPASO
                    && (self.Product().ProductTypeId() == ProductTypeEnum.PLANES || self.Product().ProductTypeId() == ProductTypeEnum.EPSV);

                if (doValidation) {
                    return val == $('#contracttype-externaltransfer-planname-previous').val();
                }

                return true;
            },
            message: 'El nombre del plan no es correcto'
        }
    });
    this.PlanCode = ko.observable().extend({
        required: {
            message: "Por favor indique el plan",
            onlyIf: function () {
                return self.validateNow()
                    && self.IdOperationType() == OperationTypeEnum.TRASPASO
                    && (self.Product().ProductTypeId() == ProductTypeEnum.PLANES || self.Product().ProductTypeId() == ProductTypeEnum.EPSV);
            }
        }
    });
    this.FondoName = ko.observable().extend({
        validation: {
            validator: function (val) {
                var doValidation = self.validateNow()
                    && self.IdOperationType() == OperationTypeEnum.TRASPASO
                    && (self.Product().ProductTypeId() == ProductTypeEnum.FONDOS || self.Product().ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE)
                    && Utils.IsNational(self.FondoISIN());

                if (doValidation) {
                    return val == $('#contracttype-externaltransfer-fundname-previous').val();
                }

                return true;
            },
            message: 'El nombre del fondo no es correcto'
        }
    });
    this.FondoCode = ko.observable().extend({
        required: {
            message: "Por favor indique el fondo",
            onlyIf: function () {
                return self.validateNow()
                    && self.IdOperationType() == OperationTypeEnum.TRASPASO
                    && (self.Product().ProductTypeId() == ProductTypeEnum.FONDOS || self.Product().ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE);
            }
        }
    });
    this.FondoISIN = ko.observable().extend({
        required: {
            message: "Por favor indique el ISIN",
            onlyIf: function () {
                return self.validateNow()
                    && self.IdOperationType() == OperationTypeEnum.TRASPASO
                    && (self.Product().ProductTypeId() == ProductTypeEnum.FONDOS || self.Product().ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE);
            }
        },
        ISIN: {
            message: "El ISIN no es válido",
            onlyIf: function () {
                return self.validateNow()
                    && self.IdOperationType() == OperationTypeEnum.TRASPASO
                    && (self.Product().ProductTypeId() == ProductTypeEnum.FONDOS || self.Product().ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE);
            }
        }
    });
    this.ManagerCode = ko.observable().extend({
        required: {
            message: 'Por favor indique la comercializadora',
            onlyIf: function () {
                return self.validateNow()
                    && self.IdOperationType() == OperationTypeEnum.TRASPASO
                    && (self.Product().ProductTypeId() == ProductTypeEnum.FONDOS || self.Product().ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE)
                    && !Utils.IsNational(self.FondoISIN());
            }
        }
    });
    this.ManagerName = ko.observable().extend({
        validation: {
            validator: function (val) {
                var doValidation = self.validateNow()
                    && self.IdOperationType() == OperationTypeEnum.TRASPASO
                    && (self.Product().ProductTypeId() == ProductTypeEnum.FONDOS || self.Product().ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE)
                    && !Utils.IsNational(self.FondoISIN());

                if (doValidation) {
                    return val == $('#contracttype-externaltransfer-manager-previous').val();
                }

                return true;
            },
            message: 'El nombre de la gestora no es correcto'
        }
    });
    this.selectedTransferType = ko.observable();
    this.ParticipantAccount = ko.observable();
    this.Before2007 = ko.observable();
    this.After2007 = ko.observable();
    this.MonthlyAmount = ko.observable().extend({
        AmountRange: ko.computed(function () {
            return {
                params: {
                    min: self.MinMonthlyAmount(),
                    max: self.MaxMonthlyAmount(),
                    currentAmount: self.Amount(),
                    maxYearAmount: self.MaxAmount(),
                    validate: (
                        self.validateNow()
                        && (self.IdOperationType() == OperationTypeEnum.APORTACION || self.IdOperationType() == OperationTypeEnum.RECIBO)
                        && Utils.IsDecimalValidHigherThan(self.MonthlyAmount(), 0)
                        && self.Product().ProductTypeId() == ProductTypeEnum.PLANES
                    ),
                    includeMin: true,
                    includeMax: true
                }
            };
        })
    });
    this.IBAN = ko.observable().extend({
        required: {
            message: "Por favor indique el IBAN",
            onlyIf: function () {
                return self.validateNow()
                    && (self.IdOperationType() == OperationTypeEnum.APORTACION || self.IdOperationType() == OperationTypeEnum.RECIBO)
                    && Utils.IsDecimalValidHigherThan(self.MonthlyAmount(), 0);
            }
        },
        IBAN: {
            message: "El IBAN no es válido",
            onlyIf: function () {
                return self.validateNow()
                    && (self.IdOperationType() == OperationTypeEnum.APORTACION || self.IdOperationType() == OperationTypeEnum.RECIBO)
                    && Utils.IsDecimalValidHigherThan(self.MonthlyAmount(), 0);
            }
        }
    });
    this.TotalAmount = ko.observable().extend({
        validation: {
            validator: function (val) {
                var doValidation = false;

                doValidation = self.validateNow()
                    && (self.IdOperationType() == OperationTypeEnum.APORTACION || self.IdOperationType() == OperationTypeEnum.RECIBO)
                    && Utils.IsDecimalValidHigherThan(self.MonthlyAmount(), 0)
                    && Utils.IsDecimalValidHigherThan(self.Amount(), 0)
                    && self.Product().ProductTypeId() == ProductTypeEnum.PLANES;

                if (doValidation) {
                    var total = Utils.GetDecimalValue(self.Amount()) + Utils.GetDecimalValue(self.MonthlyAmount());
                    return total <= Utils.GetDecimalValue(self.MaxAmount());
                }

                return true;
            },
            message: 'El importe total supera el máximo'
        }
    });
    this.TransferPartNumAmount = ko.observable().extend({
        DecimalRequired: {
            message: "Por favor indique el número de participaciones",
            onlyIf: function () {
                return self.validateNow() && self.IdOperationType() == OperationTypeEnum.TRASPASO && self.selectedTransferType().id == TransferTypeEnum.PARTICIPACIONES;
            }
        }
    });
    this.TransferPartPercentageAmount = ko.observable().extend({
        DecimalRequired: {
            message: "Por favor indique el porcentaje de participaciones",
            onlyIf: function () {
                return self.validateNow() && self.IdOperationType() == OperationTypeEnum.TRASPASO && self.selectedTransferType().id == TransferTypeEnum.PORCENTAJE;
            }
        },
        TransferPartPercentageAmount: {
            message: "El porcentaje no puede ser mayor del 100%",
            onlyIf: function () {
                return self.validateNow() && self.IdOperationType() == OperationTypeEnum.TRASPASO && self.selectedTransferType().id == TransferTypeEnum.PORCENTAJE;
            }
        }
    });
    self.TransferPartPercentageAmount.subscribe(function (newValue) {
        self.TransferPartPercentageAmount(newValue);
        window.setDatalayerItem('importeOperacion', newValue);
    });
    this.TransferAmount = ko.observable().extend({
        DecimalRequired: {
            message: "Por favor indique el importe",
            onlyIf: function () {
                return self.validateNow() && self.IdOperationType() == OperationTypeEnum.TRASPASO && self.selectedTransferType().id == TransferTypeEnum.PARCIAL;
            }
        },

        AmountRange: ko.computed(function () {
            return {
                params: {
                    min: self.MinAmount(),
                    max: 0,
                    validate: (
                        self.validateNow()
                        && self.IdOperationType() == OperationTypeEnum.TRASPASO
                        && self.selectedTransferType().id == TransferTypeEnum.PARCIAL
                    ),
                    includeMin: self.MinAmount() > 0,
                    includeMax: false
                }
            };
        })
    });
    this.PayerName = ko.observable();
    this.DisableSuscribe = ko.observable(false);

    this.IdPeriodicity = ko.observable();
    this.InitialMonth = ko.observable();
    this.InitialYear = ko.observable();
    this.IsEmployee = ko.observable(false);
    this.NotEmployeeMinAmount = ko.observable(false);

    self.IsEmployee.subscribe(function (newValue) {
        if (newValue) {
            var min = 6000;
            min = Math.round(min * 100) / 100;
            self.MinAmount(Number(min).toLocaleString());
        } else {
            self.MinAmount(self.NotEmployeeMinAmount());
        }
    });


    self.IdOperationType.subscribe(function (newValue) {
        window.setDatalayerItem('tipoOperacion', OperationTypeEnum.properties[newValue].name);
        GMT.PushByOperationType(newValue, ProductTypeEnum.properties[self.Product().ProductTypeId()].name, self.Product().Name());
        self.InitializeOperation();
    });

    self.Amount.subscribe(function (newValue) {
        window.setDatalayerItem('importeOperacion', newValue);

        if (self.Product().ProductTypeId() == ProductTypeEnum.PLANES) {
            if (!Utils.IsDecimalValid(newValue)) {
                self.MinMonthlyAmount(self.MinMonthlyAmountWithNoAportacion());
            } else {
                if (Utils.IsDecimalValidHigherThan(newValue, 0)) {
                    self.MinMonthlyAmount(self.MinMonthlyAmountWithAportacion());
                } else {
                    self.MinMonthlyAmount(self.MinMonthlyAmountWithNoAportacion());
                }
            }
        }
    });

    self.MonthlyAmount.subscribe(function (newValue) {
        window.setDatalayerItem('importeOperacion', newValue);

        if (self.Product().ProductTypeId() == ProductTypeEnum.PLANES) {
            if (!Utils.IsDecimalValid(newValue)) {
                self.MinMonthlyAmount(self.MinMonthlyAmountWithNoAportacion());
            } else {
                if (Utils.IsDecimalValidHigherThan(newValue, 0)) {
                    self.MinMonthlyAmount(self.MinMonthlyAmountWithAportacion());
                } else {
                    self.MinMonthlyAmount(self.MinMonthlyAmountWithNoAportacion());
                }
            }
        }
    });

    self.TransferAmount.subscribe(function (newValue) {
        window.setDatalayerItem('importeOperacion', newValue);
    });

    self.TransferPartNumAmount.subscribe(function (newValue) {
        window.setDatalayerItem('importeOperacion', newValue);
    });

    self.FondoType.subscribe(function (newValue) {
        if (newValue == 'true') {
            window.setDatalayerItem('fundtype', 'nacional');
        } else {
            window.setDatalayerItem('fundtype', 'extranjero');
        }
    });

    self.selectedTransferType.subscribe(function (newValue) {
        if (newValue != undefined)
            window.setDatalayerItem('transfertype', TransferTypeEnum.properties[newValue.id].name);
    });

    self.ParticipantAccount.subscribe(function (newValue) {
        window.setDatalayerItem('participantaccount', newValue);
    });

    self.FondoName.subscribe(function (newValue) {
        if (newValue != undefined)
            window.setDatalayerItem('fundname', newValue);
    });

    self.FondoISIN.subscribe(function (newvalue) {
        if (Utils.isNullOrEmpty(newvalue))
            return false;

        var isinpre = newvalue.substring(0, 2);
        if (isinpre.toUpperCase() == 'ES') {
            self.FondoType('true');
        }
        else {
            self.FondoType('false');
            Request.GetIsinData();
        }

    });

    this.InitializeOperation = function () {
        if (!self.DisableSuscribe()) {
            self.validateNow(false);
            self.Amount('');
            self.PlanName('');
            self.PlanCode('');
            self.FondoName('');
            self.FondoCode('');
            self.FondoISIN('');
            self.ManagerCode('');
            self.ManagerName('');
            self.ParticipantAccount('');
            self.MonthlyAmount('');
            self.IBAN('');
            self.TotalAmount('');
            self.TransferPartNumAmount('');
            self.TransferPartPercentageAmount('');
            self.TransferAmount('');
            self.PayerName('');
            self.FondoType('true');
            self.InitialMonth('');
            self.InitialYear('');
            self.IdPeriodicity(null);
        }
    }

    this.clearfunde = function () {
        self.FondoCode('');
        self.FondoISIN('');
    };

    this.clearplan = function () {
        self.PlanCode('');
    };

    this.ResetData = function () {
        self.FondoCode('');
        self.FondoName('');
        self.FondoISIN('');
        self.ManagerCode('');
        self.ManagerName('');
        return true;
    };

    this.SetAmountValidValues = function (minor, disabled) {
        var max;
        var min;
        var maxmonthly;
        var periodicity = 12;

        if (self.Product() != null) {
            if (minor) {
                max = self.Product().MinorMax();
                min = self.Product().MinorMin();
                maxmonthly = (self.Product().ProductTypeId() == ProductTypeEnum.PLANES && self.Product().MinorMax() != 0) ? self.Product().MinorMax() / periodicity : 0;
            } else {
                max = self.Product().AdultMax();
                min = self.Product().AdultMin();
                maxmonthly = ((self.Product().ProductTypeId() == ProductTypeEnum.PLANES || self.Product().ProductTypeId() == ProductTypeEnum.EPSV) && self.Product().AdultMax() != 0) ? self.Product().AdultMax() / periodicity : 0;
            }

            if (self.Product().ProductTypeId() == ProductTypeEnum.PLANES && self.IdOperationType() == OperationTypeEnum.TRASPASO) {
                max = 0;
            }

            if (self.IsEmployee()) {
                min = self.Product().EmployeeMin();
                max = self.Product().EmployeeMax();
            }

            if (self.Product().ProductTypeId() == ProductTypeEnum.PLANES || self.Product().ProductTypeId() == OperationTypeEnum.RECIBO) {
                if (disabled) {
                    max = self.Product().DisabledMax();
                    maxmonthly = max / periodicity;
                    self.MaxMonthlyAmount(Math.round(maxmonthly * 100) / 100);
                } else {
                    self.MaxMonthlyAmount(Math.round(maxmonthly * 100) / 100);
                }

                if (self.Product().ProductTypeId() == ProductTypeEnum.PLANES) {
                    if (!Utils.IsDecimalValid(self.Amount())) {
                        self.MinMonthlyAmount(self.MinMonthlyAmountWithNoAportacion());
                    } else {
                        if (Utils.IsDecimalValidHigherThan(self.Amount(), 0)) {
                            self.MinMonthlyAmount(self.MinMonthlyAmountWithAportacion());
                        } else {
                            self.MinMonthlyAmount(self.MinMonthlyAmountWithNoAportacion());
                        }
                    }
                } else {
                    self.MinMonthlyAmount(0);
                }
            }

            max = Math.round(max * 100) / 100;
            min = Math.round(min * 100) / 100;

            if (self.Product() == 1 && minor) {
                max = self.Product().MinorMax();
            }
            else {
                if (!disabled)
                    max = self.Product().AdultMax();
            }

            self.MaxAmount(max);
            self.MinAmount(min);
            self.NotEmployeeMinAmount(self.MinAmount());
        }
    };

    this.AmountRange = ko.computed(function () {
        var AmountRangeText = '';
        if (self.MinAmount() > 0) {
            self.Product().Family() != 12 && self.Product().Family() != 11 ? AmountRangeText += 'Importe mínimo: ' + NumFormatLocale.format(self.MinAmount()) + '€. ' :
                AmountRangeText += 'Importe mínimo: ' + NumFormatLocale.format(self.MinAmount()) + '€ por titular. ';
        }

        if (self.MaxAmount() > 0) {
            self.Product().Family() != 12 && self.Product().Family() != 11 ? AmountRangeText += 'Importe mínimo: ' + NumFormatLocale.format(self.MinAmount()) + '€. ' :
                AmountRangeText += 'Importe máximo: ' + NumFormatLocale.format(self.MaxAmount()) + '€ por titular. ';
        }

        return AmountRangeText;
    }, this);

    this.TransferAmountRange = ko.computed(function () {
        var AmountRangeText = '';
        if (self.MinAmount() > 0) {
            self.Product().Family() != 12 && self.Product().Family() != 11 ? AmountRangeText += 'Importe mínimo: ' + NumFormatLocale.format(self.MinAmount()) + '€. ' :
                AmountRangeText += 'Importe mínimo: ' + NumFormatLocale.format(self.MinAmount()) + '€ por titular. ';
        }

        return AmountRangeText;
    }, this);

    this.MonthlyAmountRange = ko.computed(function () {
        var AmountRangeText = ' ';
        if (self.MinMonthlyAmount() > 0) {
            AmountRangeText += 'Importe mínimo sólo domiciliación: 100€. Importe mínimo domiciliación con además aportación o traspaso: 50€. ';
        }

        if (self.MaxMonthlyAmount() > 0) {
            var formatAmount = NumFormatLocale.format(self.MaxMonthlyAmount());
            AmountRangeText += 'Importe máximo: ' + formatAmount + '€. ';
        }

        return AmountRangeText;

    }, this);

    this.errors = ko.validation.group(this);

    this.ClearCodes = function () {
        if (self.PlanName() == '') {
            self.PlanCode(null);
        }

        if (self.ManagerName == '') {
            self.ManagerCode(null);
        }

        if (self.FondoName() == '') {
            self.FondoCode(null);
        }
    };

    this.ValidateOperation = function (scope) {
        var ok = false;
        Request.ValidateIsin(function (result) {
            self.ClearCodes();
            self.SetAmountValidValues(scope.CheckAllTitularMinors(), scope.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.MINUSVALIDO);
            self.validateNow(true);
            if (self.errors().length === 0) {
                self.ChangeOperationType();

                if (self.Amount() != undefined)
                    GMT.PushEvent(PageEnum.TIPO_OPERACION, 'importe operacion', self.Amount());

                if (self.Amount() == undefined && self.MonthlyAmount() != undefined)
                    GMT.PushEvent(PageEnum.TIPO_OPERACION, 'importe operacion', self.MonthlyAmount());

                ok = true;
            } else {
                self.errors.showAllMessages();
                window.scrollError();
                GMT.PushEventErrorArray(PageEnum.TIPO_OPERACION, 'error', self.errors());
                ok = false;
            }
        });
        return ok;
    };

    this.ChangeOperationType = function () {
        self.DisableSuscribe(true);
        if (self.IdOperationType() == OperationTypeEnum.APORTACION) {
            if (Utils.IsDecimalValidHigherThan(self.MonthlyAmount(), 0)) {
                self.IdOperationType('4');
            }
        } else if (self.IdOperationType() == OperationTypeEnum.RECIBO) {
            if (!Utils.IsDecimalValid(self.MonthlyAmount())) {
                self.IdOperationType('2');
            }
        }

        self.DisableSuscribe(false);
    }

    this.ViewModelToJSON = ko.pureComputed(function () {

        var _amount;

        if (self.IdOperationType() == OperationTypeEnum.APORTACION || self.IdOperationType() == OperationTypeEnum.SUSCRIPCION) {
            _amount = self.Amount() == null ? '' : self.Amount().toString().replaceAll('.', '');
        }

        if (self.IdOperationType() == OperationTypeEnum.TRASPASO) {
            self.IdWayToPay(null);
            if (self.selectedTransferType().id == TransferTypeEnum.PARCIAL) {
                _amount = self.TransferAmount() == null ? '' : self.TransferAmount().toString().replaceAll('.', '');
            } else if (self.selectedTransferType().id == TransferTypeEnum.PARTICIPACIONES) {
                _amount = self.TransferPartNumAmount() == null ? '' : self.TransferPartNumAmount().toString().replaceAll('.', '');
            } else if (self.selectedTransferType().id == TransferTypeEnum.PORCENTAJE) {
                _amount = self.TransferPartPercentageAmount() == null ? '' : self.TransferPartPercentageAmount().toString().replaceAll('.', '');
            }
        }

        if (self.IdOperationType() == OperationTypeEnum.RECIBO) {
            self.IdWayToPay(null);
        }

        var data = {
            IdOperationType: self.IdOperationType(),
            Amount: _amount,
            IdWayToPay: self.IdOperationType() == OperationTypeEnum.TRASPASO || self.IdOperationType() == OperationTypeEnum.RECIBO ? null : self.IdWayToPay(),
            FondoType: self.FondoType(),
            FondoName: self.FondoName(),
            FondoCode: self.FondoCode(),
            FondoISIN: self.FondoISIN(),
            ManagerCode: self.ManagerCode(),
            ManagerName: self.ManagerName(),
            PlanName: self.PlanName(),
            PlanCode: self.PlanCode(),
            IdTransferType: self.selectedTransferType() == undefined ? null : self.selectedTransferType().id,
            IdProduct: self.Product().Id(),
            ParticipantAccount: self.ParticipantAccount(),
            Before2007: self.Before2007(),
            After2007: self.After2007(),
            MonthlyAmount: self.MonthlyAmount() == null ? '' : self.MonthlyAmount().toString().replaceAll('.', ''),
            IBAN: self.IBAN(),
            PayerName: self.PayerName(),
            InitialMonth: self.InitialMonth(),
            InitialYear: self.InitialYear(),
            IdPeriodicity: self.IdPeriodicity(),
            IsEmployee: self.IsEmployee()
        };
        return data;
    }, this);

    this.OperationTypeName = ko.pureComputed(function () {
        var type;

        if (self.IdOperationType() != undefined)
            type = OperationTypeEnum.properties[self.IdOperationType()].name;

        return type;
    }, this);

    this.WayToPayName = ko.pureComputed(function () {
        var type;

        if (self.IdWayToPay() != undefined)
            type = WayToPayEnum.properties[self.IdWayToPay()].name;

        return type;
    }, this);

    this.AmountToString = ko.pureComputed(function () {
        var _amount = '';

        if (self.IdOperationType() == OperationTypeEnum.SUSCRIPCION || self.IdOperationType() == OperationTypeEnum.APORTACION) {
            _amount = self.WayToPayName();
            if (Utils.IsDecimalValidHigherThan(self.Amount(), 0)) {
                _amount = _amount + '/' + self.Amount() + '€';
            }
        }

        if (self.IdOperationType() == OperationTypeEnum.TRASPASO && self.selectedTransferType().id == TransferTypeEnum.TOTAL) {
            _amount = 'Traspaso Total';
        }

        if (self.IdOperationType() == OperationTypeEnum.TRASPASO && self.selectedTransferType().id == TransferTypeEnum.PARCIAL) {
            _amount = 'Traspaso Parcial' + '/' + self.TransferAmount() + '€';
        }

        if (self.IdOperationType() == OperationTypeEnum.TRASPASO && self.selectedTransferType().id == TransferTypeEnum.PARTICIPACIONES) {
            _amount = 'Traspaso Parcial por participaciones' + '/' + self.TransferPartNumAmount();
        }

        if (self.IdOperationType() == OperationTypeEnum.TRASPASO && self.selectedTransferType().id == TransferTypeEnum.PORCENTAJE) {
            _amount = 'Traspaso Parcial por porcentaje' + '/' + self.TransferPartPercentageAmount() + "%";
        }

        if (self.IdOperationType() == OperationTypeEnum.RECIBO) {
            _amount = _amount + self.MonthlyAmount() + '€';
        }

        return _amount;

    }, this);

    this.PayerDisclaimer = ko.computed(function () {
        var discalimer = "";
        if (self.Product() != undefined) {
            if (self.Product().ProductTypeId() == 2 || self.Product().ProductTypeId() == 3) {
                discalimer = "Por favor, tenga en cuenta que la transferencia del importe a invertir en la cuenta del titular de las participaciones del fondo debe coincidir con el titular / ordenante de la cuenta bancaria";
            } else {
                discalimer = "Si la transferencia la realiza a favor del cónyuge, persona con discapacidad o como mediación en el pago, por favor, indique a continuación el nombre del ordenante";
            }
        }
        return discalimer;
    }, this);

};

var BasicData = function (applicantType) {
    var self = this;
    this.validateNow = ko.observable(false);

    this.Name = ko.observable().extend({
        required: {
            message: "Por favor indique su nombre",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        minLength: {
            message: "El nombre debe tener al menos dos caracteres",
            onlyIf: function () {
                return self.validateNow();
            },
            params: 2
        },
        pattern: {
            message: "Caracteres no permitidos",
            params: /^[a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüàª '.çÇ-]+$/,
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.DNI = ko.observable().extend({
        required: {
            message: "Por favor indique su documento de identidad",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        DNI: {
            message: "El documento de identidad no es válido",
            onlyIf: function () {
                return self.validateNow() && self.ApplicantType() == ApplicantTypeEnum.FISICA;
            }
        },
        //TODO: Validación para el pasaporte?¿
    });
    this.IDDocumentType = ko.observable();
    this.FirstSurname = ko.observable().extend({
        required: {
            message: "Por favor indique su primer apellido",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        minLength: {
            message: "El primer apellido debe tener al menos dos caracteres",
            onlyIf: function () {
                return self.validateNow();
            },
            params: 2
        },
        pattern: {
            message: "Caracteres no permitidos",
            params: /^[a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüàª '.çÇ-]+$/,
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.SecondSurname = ko.observable().extend({
        minLength: {
            message: "El segundo apellido debe tener al menos dos caracteres",
            onlyIf: function () {
                return self.validateNow();
            },
            params: 2
        },
        pattern: {
            message: "Caracteres no permitidos",
            params: /^[a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüàª '.çÇ-]+$/,
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.Email = ko.observable().extend({
        email: {
            message: "Formato no válido para el email",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.EmailCrii = ko.observable().extend({
        required: {
            message: "Por favor indique el email del agente",
            onlyIf: function () {
                return self.validateNow() && (Utils.isNullOrEmpty(self.Email()) || Utils.isNullOrEmpty(self.MobilePhoneNumber()));
            }
        },
        email: {
            message: "Formato no válido para el email",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        pattern: {
            params: /@bestinver.es\s*$/,
            message: "El email tiene que ser del dominio de bestinver",
            onlyIf: function () {
                return self.validateNow() && validatedomain;
            }
        }
    });
    this.EmailCriiEnabled = ko.observable(true);
    this.MobilePhonePrefix = ko.observable("+34").extend({
        minLength: {
            params: 2,
            message: "Por favor indique un prefijo",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        pattern: {
            message: "Formato no válido para el prefijo",
            params: /^\+[0-9]{1,3}$/,
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.MobilePhoneNumber = ko.observable().extend({
        pattern: {
            message: "Formato no válido para el teléfono móvil",
            params: /^[6|7]{1}([\d]{2}[-]*){3}[\d]{2}$/,
            onlyIf: function () {
                return self.validateNow() && self.MobilePhonePrefix().indexOf("+34") >= 0;
            }
        },
        NoRepeatNumber: {
            message: "Formato no válido para el teléfono móvil",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });

    this.Legal = ko.observable();
    this.ApplicantType = ko.observable(applicantType);
    this.RequestId = ko.observable();
    this.RequestApplicantType = ko.observable();
    this.Product = ko.observable();
    this.ProductTypeId = ko.observable();
    this.InformationRight = ko.observable('true').extend({
        required: {
            message: "Por favor indique si desea recibir información",
            onlyIf: function () {
                return self.validateNow()
                    && (self.ProductTypeId() == ProductTypeEnum.PLANES || self.ProductTypeId() == ProductTypeEnum.EPSV)
                    && self.RequestApplicantType() == RequestApplicantTypeEnum.TITULAR;
            }
        }
    });
    this.SignatureType = ko.observable();
    this.Minor = ko.observable(false);
    this.SpecialRequestApplicantType = ko.observable();
    this.SpecialRequestApplicantTypeEnabled = ko.observable(true);
    this.SalesChannel = ko.observable().extend({
        required: {
            message: "Por favor seleccione un canal",
            onlyIf: function () {
                return self.validateNow()
                    && self.RequestApplicantType() == RequestApplicantTypeEnum.TITULAR;
            }
        }
    });
    this.MainApplicantPhonePrefix = ko.observable();

    self.SpecialRequestApplicantType.subscribe(function (newValue) {
        if (newValue != undefined) {
            self.RequestApplicantType(newValue.id);
        } else {
            self.RequestApplicantType(RequestApplicantTypeEnum.TITULAR);
        }
    });

    self.DNI.subscribe(function (newValue) {
        if (self.ApplicantType() == ApplicantTypeEnum.FISICA) {
            self.DNI(Utils.Paddy(newValue, 9));
        }
        self.DNI(self.DNI().toUpperCase());
    });

    self.ApplicantType.subscribe(function (newValue) {
        if (newValue != "3") {
            self.MobilePhonePrefix("+34");
        } else {
            self.MobilePhonePrefix(self.MainApplicantPhonePrefix());
        }
    });

    self.MobilePhonePrefix.subscribe(function (newValue) {
        if (self.ApplicantType() == "3") {
            self.MainApplicantPhonePrefix(newValue);
        }
    });

    this.FullName = ko.pureComputed(function () {
        if (self.ApplicantType() == ApplicantTypeEnum.FISICA || self.ApplicantType() == ApplicantTypeEnum.FISICAEXTRANJERA)
            return (self.Name() == null ? '' : self.Name().charAt(0).toUpperCase() + self.Name().slice(1) + " ") +
                (self.FirstSurname() == null ? '' : self.FirstSurname().charAt(0).toUpperCase() + self.FirstSurname().slice(1) + " ") +
                (self.SecondSurname() == null ? '' : self.SecondSurname().charAt(0).toUpperCase() + self.SecondSurname().slice(1))
        if (self.ApplicantType() == ApplicantTypeEnum.JURIDICA)
            return self.Name();
    }, this);

    this.TransferPartNumAmount = ko.observable();

    this.errors = ko.validation.group(this);

    this.ViewModelToJSON = ko.pureComputed(function () {
        var data = {
            LifeCicleOk: sessionStorage.getItem('lifeCicleOK') == null ? null : JSON.parse(sessionStorage.getItem('lifeCicleOK')),
            DNI: self.DNI(),
            IDDocumentType: Utils.GetDocumentType(self.DNI(), 1),
            Name: self.Name(),
            FirstSurname: self.FirstSurname(),
            SecondSurname: self.SecondSurname(),
            Email: self.Email(),
            MobilePhoneNumber: self.MobilePhoneNumber() != undefined && self.MobilePhoneNumber() != "" ? self.MobilePhonePrefix() + self.MobilePhoneNumber() : null,
            Legal: self.Legal(),
            ApplicantType: 1,
            RequestApplicantType: self.RequestApplicantType(),
            IdInitialProduct: self.Product(),
            RequestId: self.RequestId(),
            InformationRight: self.InformationRight()
        };
        return data;
    }, this);

    this.IsValid = function (minor) {
        self.Minor(minor);
        self.validateNow(true);
        if (self.errors().length === 0) {
            return true;
        } else {
            self.errors.showAllMessages();
            window.scrollError();
            GMT.PushEventErrorArray(PageEnum.DATOS_BASICOS_TITULAR, 'error', self.errors());
            return false;
        }
    };

    this.CreateBasicData = function (scope) {
        if (scope == null)
            return true;

        self.validateNow(true);
        if (self.errors().length === 0 && (scope.CurrentStep == "BasicData")) {
            scope.CreateBasicData();
        } else {
            self.errors.showAllMessages();
            GMT.PushEventErrorArray(PageEnum.DATOS_BASICOS_TITULAR, 'error', self.errors());
            window.scrollError();
        }
    };
};

var PersonalData = function (applicantType, ProductInit) {
    var self = this;
    this.validateNow = ko.observable(false);
    this.ProductInit = ko.observable(ProductInit);

    this.RequestApplicantType = ko.observable();

    var birthDay = null;
    if (sessionStorage.getItem('birthday') && (!vm || vm.CurrentType() == RequestApplicantTypeEnum.TITULAR)) {
        birthDay = moment(sessionStorage.getItem('birthday'), 'YYYY-MM-DD', true);
        $('#personaldata-birthday-day,#personaldata-birthday-month,#personaldata-birthday-year').prop('readonly', true);
    }

    this.Birthday = ko.observable(new CustomDate(birthDay)).extend({
        RequiredCustomDate: {
            message: "Por favor indique su fecha de nacimiento",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        Birthday: {
            message: "La fecha de nacimiento no es correcta",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        OlderThan: {
            params: {
                age: 18
            },
            message: "La persona debe ser mayor de edad",
            onlyIf: function () {
                return self.validateNow() &&
                    (self.RequestApplicantType() == RequestApplicantTypeEnum.AUTORIZADO
                        || self.RequestApplicantType() == RequestApplicantTypeEnum.TUTOR
                        || self.ProductInit().ProductTypeId() == ProductTypeEnum.ASESORAMIENTOS
                    )
            }
        },
        customdate: {
            message: "La fecha de nacimiento no es correcta",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.BornPlace = ko.observable().extend({
        required: {
            message: "Por favor indique su lugar de nacimiento",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        pattern: {
            message: "Caracteres no permitidos",
            params: /^[a-zA-ZñÑáéíóúÁÉÍÓÚäëïöüàª '.çÇ-]+$/,
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.IsResident = ko.observable('false');
    this.IDDocumentIsPermanent = ko.observable(false);
    this.IDDocumentExpirationDate = ko.observable(new CustomDate()).extend({
        RequiredCustomDate: {
            message: "Por favor indique la fecha de expiración del DNI / NIF / PASAPORTE",
            onlyIf: function () {
                return self.validateNow() && self.ShowDocumentExpirationDate();
            }
        },
        ExpirationCustomDate: {
            message: "El DNI / NIF / PASAPORTE está caducado o ha indicado una fecha incorrecta",
            onlyIf: function () {
                return self.validateNow() && self.ShowDocumentExpirationDate();
            }
        },
        customdate: {
            message: "El DNI / NIF / PASAPORTE está caducado o ha indicado una fecha incorrecta",
            onlyIf: function () {
                return self.validateNow() && self.ShowDocumentExpirationDate();
            }
        }
    });
    this.PhonePrefix = ko.observable("+34").extend({
        minLength: {
            params: 2,
            message: "Por favor indique un prefijo",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        pattern: {
            message: "Formato no válido para el prefijo",
            params: /^\+[0-9]{1,3}$/,
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.PhoneNumber = ko.observable().extend({
        NoRepeatNumber: {
            message: "Formato no válido para el teléfono",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.Nationality = ko.observable().extend({
        required: {
            message: "Por favor indique su nacionalidad",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.Country = ko.observable().extend({
        required: {
            message: "Por favor indique su país",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.Gender = ko.observable().extend({
        required: {
            message: "Por favor indique su sexo",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });

    this.ApplicantType = ko.observable(applicantType);
    this.MainApplicantPhonePrefix = ko.observable();

    self.Birthday().Year.subscribe(function (newValue) {
        if (self.Birthday().getAge() < 65) {
            self.IDDocumentIsPermanent(false);
        }
    });

    self.ApplicantType.subscribe(function (newValue) {
        if (newValue != "3") {
            self.PhonePrefix("+34");
        } else {
            self.PhonePrefix(self.MainApplicantPhonePrefix());
        }
    });

    self.PhonePrefix.subscribe(function (newValue) {
        if (self.ApplicantType() == "3") {
            self.MainApplicantPhonePrefix(newValue);
        }
    });

    this.GenderName = ko.computed(function () {
        if (self.Gender() != null)
            return self.Gender().valor;
    }, this);

    this.CountryName = ko.computed(function () {
        if (self.Country() != null)
            return self.Country().valor;
    }, this);

    this.NationalityName = ko.computed(function () {
        if (self.Nationality() != null)
            return self.Nationality().valor;
    }, this);

    this.ShowPermanentValidity = ko.computed(function () {
        var age = self.Birthday().getAge();
        return age >= 65 && self.ApplicantType() == ApplicantTypeEnum.FISICA
    }, this);

    this.ShowDocumentExpirationDate = ko.pureComputed(function () {
        return ((self.IDDocumentIsPermanent() == false) || (self.IDDocumentIsPermanent() == null) && self.ApplicantType() == ApplicantTypeEnum.FISICA);
    }, this);

    this.ViewModelToJSON = ko.pureComputed(function () {
        var data = {
            Birthday: self.Birthday().parseString(),
            Gender: self.Gender().id,
            Nacionality: self.Nationality().id,
            Country: self.Country().id,
            BornPlace: self.BornPlace(),
            IsResident: self.IsResident(),
            IDDocumentExpirationDate: self.IDDocumentExpirationDate().DateIsNull() ? null : self.IDDocumentExpirationDate().parseString(),
            IDDocumentIsPermanent: self.IDDocumentIsPermanent(),
            PhoneNumber: self.PhoneNumber()
        };
        return data;
    }, this);

    this.errors = ko.validation.group(this);

    this.IsValid = function (_RequestApplicantType) {
        self.RequestApplicantType(_RequestApplicantType);
        self.validateNow(true);
        if (self.errors().length === 0) {
            return true;
        } else {
            self.errors.showAllMessages();
            window.scrollError();
            GMT.PushEventErrorArray(PageEnum.DATOS_PERSONALES_TITULAR, 'error', self.errors());
            return false;
        }
    };

    this.CreatePersonalData = function (scope) {
        self.validateNow(true);
        if (self.errors().length === 0) {
            scope.goToNextStep();
        } else {
            self.errors.showAllMessages();
            window.scrollError();
            GMT.PushEventErrorArray(PageEnum.DATOS_PERSONALES_TITULAR, 'error', self.errors());
        }
    };
};

var ContactData = function () {
    var self = this;

    this.PostalAddress = ko.observable(new Address("PostalAddress"));
    this.FiscalAddress = ko.observable(new Address("FiscalAddress"));
    this.ShowPostalAddress = ko.observable(false);

    this.CreateContactData = function (scope) {
        var isresident = scope.MainApplicant().ApplicantPersonalData().IsResident();
        var ok = self.FiscalAddress().IsValidAddress(isresident);

        if (self.ShowPostalAddress()) {
            ok = self.PostalAddress().IsValidAddress(isresident) && ok;
        }
        else {
            var address = Utils.CloneAddress(self.FiscalAddress());
            address.AddressTypeId('PostalAddress');
            self.PostalAddress(address);
        }

        if (ok) {

            if (self.ShowPostalAddress())
                GMT.PushEvent(PageEnum.DIRECCION_CONTACTO_TITULAR, 'direccion fiscal', 'Mi dirección postal es distinta a mi dirección fiscal');

            var raType = scope.MainApplicant().ApplicantBasicData().RequestApplicantType();
            if (raType == RequestApplicantTypeEnum.HEREDERO || raType == RequestApplicantTypeEnum.DONACION) {
                scope.CheckApplicantQuestions(function () {
                    scope.goToNextStep();
                });
            }
            else {
                scope.goToNextStep();
            }
        }
    };

    this.GetFiscalAddressToJSON = ko.pureComputed(function () {
        var data = [];
        var fiscaldata = {
            Viatype: self.FiscalAddress().ViaType(),
            Name: self.FiscalAddress().Street(),
            Number: self.FiscalAddress().StreetNumber(),
            Floor: self.FiscalAddress().Floor(),
            Door: self.FiscalAddress().Door(),
            PostalCode: self.FiscalAddress().PostalCode(),
            City: self.FiscalAddress().City(),
            Province: self.FiscalAddress().Province(),
            IdCountry: self.FiscalAddress().CountryId(),
            CountryType: 3,
            AddressType: "FiscalAddress",
            Stairs: self.FiscalAddress().Stairs(),
            AddressExtension: self.FiscalAddress().AddressExtension()
        }

        data = [fiscaldata];

        return data;
    }, this);

    this.GetFiscalAddressInString = ko.pureComputed(function () {
        var countryname = $.grep(vm.CountryList(), function (c) {
            return c.Key == self.FiscalAddress().CountryId();
        })[0].Name;
        return self.FiscalAddress().ViaType() + ' ' + self.FiscalAddress().Street() + ' ' + self.FiscalAddress().StreetNumber() + ' ' + self.FiscalAddress().Floor() + ' ' +
            self.FiscalAddress().Door() + ' ' + self.FiscalAddress().PostalCode() + ' ' + self.FiscalAddress().City() + ' ' + self.FiscalAddress().Province() + ' ' + countryname;

    }, this);

    this.ViewModelToJSON = ko.pureComputed(function () {
        var data = [];

        var postaldata = {
            Viatype: self.PostalAddress().ViaType(),
            Name: self.PostalAddress().Street(),
            Number: self.PostalAddress().StreetNumber(),
            Floor: self.PostalAddress().Floor(),
            Door: self.PostalAddress().Door(),
            PostalCode: self.PostalAddress().PostalCode(),
            City: self.PostalAddress().City(),
            Province: self.PostalAddress().Province(),
            IdCountry: self.PostalAddress().CountryId(),
            CountryType: 3,
            AddressType: "PostalAddress",
            Stairs: self.PostalAddress().Stairs(),
            AddressExtension: self.PostalAddress().AddressExtension()
        };

        var fiscaldata = {
            Viatype: self.FiscalAddress().ViaType(),
            Name: self.FiscalAddress().Street(),
            Number: self.FiscalAddress().StreetNumber(),
            Floor: self.FiscalAddress().Floor(),
            Door: self.FiscalAddress().Door(),
            PostalCode: self.FiscalAddress().PostalCode(),
            City: self.FiscalAddress().City(),
            Province: self.FiscalAddress().Province(),
            IdCountry: self.FiscalAddress().CountryId(),
            CountryType: 3,
            AddressType: "FiscalAddress",
            Stairs: self.FiscalAddress().Stairs(),
            AddressExtension: self.FiscalAddress().AddressExtension()
        };

        if (self.ShowPostalAddress()) {
            data = [
                postaldata,
                fiscaldata
            ];

        } else {
            data = [
                fiscaldata
            ];
        }

        return data;
    }, this);
};

var Address = function (addressType) {

    var self = this;

    this.validateNow = ko.observable(false);
    this.ValidateEPSVPostalCode = ko.observable(false);
    this.ValidateResident = ko.observable(false);
    this.AddressTypeId = ko.observable(addressType);
    this.FullAddress = ko.observable();
    this.ViaType = ko.observable().extend({
        required: {
            message: "Por favor indique el tipo de vía",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.Street = ko.observable().extend({
        required: {
            message: "Por favor indique la calle",
            onlyIf: function () {
                return self.validateNow();
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
        }
    });
    this.StreetNumber = ko.observable().extend({
        required: {
            message: "Por favor indique el número",
            onlyIf: function () {
                return self.validateNow();
            }
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
            message: "Por favor indique la ciudad",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });

    this.CountryId = ko.observable().extend({
        required: {
            message: "Por favor indique el país",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        notEqual: {
            message: "La dirección fiscal no puede ser una dirección de España",
            params: "1",
            onlyIf: function () {
                return self.validateNow() && self.AddressTypeId() == "FiscalAddress" && !self.IsResident();
            }
        },
        equal: {
            message: "La dirección fiscal debe ser una dirección de España",
            params: "1",
            onlyIf: function () {
                return self.validateNow() && self.AddressTypeId() == "FiscalAddress" && self.IsResident();
            }
        }
    });
    this.Province = ko.observable().extend({
        required: {
            message: "Por favor indique la provincia",
            onlyIf: function () {
                return self.validateNow() && self.CountryId() == 1
            },
        }
    });
    this.IsResident = ko.observable(false);

    this.errors = ko.validation.group(this);

    this.IsValidAddress = function (isresident) {
        self.IsResident(isresident == "true");
        self.validateNow(true);
        if (self.errors().length === 0) {
            return true;
        }
        else {
            self.errors.showAllMessages();
            window.scrollError();
            GMT.PushEventErrorArray(PageEnum.DIRECCION_CONTACTO_TITULAR, 'error', self.errors());
            return false;
        }
    };

    this.FullAddressString = ko.computed(function () {
        var fulladdress = '';

        if (self.ViaType() != undefined) {
            fulladdress = MasterData.getViaTypeNameById(self.ViaType()) + ' '
                + self.Street() + ' '
                + self.StreetNumber() + ' '
                + (self.Floor() == null ? '' : self.Floor()) + ' '
                + (self.Door() == null ? '' : self.Door()) + ' '
                + self.City() + ' '
                + MasterData.getCountryNameById(self.CountryId());
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
    };

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

var Applicant = function (ProductInit, applicantType) {

    var self = this;

    this.validateNow = ko.observable(false);

    this.Product = ko.observable(ProductInit);
    this.Id = ko.observable();
    this.IsDifferentAddress = ko.observable(false);
    this.IsSameAddress = ko.observable(false);
    this.ApplicantBasicData = ko.observable(new BasicData(applicantType));
    this.ApplicantPersonalData = ko.observable(new PersonalData(applicantType, ProductInit));
    this.ApplicantContactData = ko.observable(new ContactData());
    this.ApplicantOperationData = ko.observable(new OperationData(self.Product()));
    this.ApplicantRefundAccountNumberData = ko.observable(new RefundAccountNumberData());
    this.Test = ko.observableArray(); //TODO: review
    this.PdfDocumentData = ko.observable(new PdfDocumentData());
    this.IsTutorFromCoowner = ko.observable(false);
    this.IsOlderThan18 = ko.computed(function () {
        return self.ApplicantPersonalData().Birthday().getAge() >= 18;
    }, this);
    this.errors = ko.validation.group(this);
    this.GDPR = ko.observable(false);
    this.ApplicantType = ko.observable(applicantType);

    this.KnowledgeTest = ko.observable();
    this.ConvenienceTest = ko.observable();
    this.ConvenienceFirstTest = ko.observable();
    this.ConvenienceSecondTest = ko.observable();
    this.ConvenienceTestList = ko.observableArray();

    this.IsValid = function (validateAddress) {
        var BasicDataOk = self.ApplicantBasicData().IsValid(!self.IsOlderThan18());
        var PersonalDataOk = self.ApplicantPersonalData().IsValid(self.ApplicantBasicData().RequestApplicantType());
        var ContactDataOk = validateAddress ? self.ApplicantContactData().FiscalAddress().IsValidAddress(self.ApplicantPersonalData().IsResident()) : true;
        return BasicDataOk && PersonalDataOk && ContactDataOk;
    };

    this.RequestApplicantType = ko.computed(function () {
        var type = "";

        try {
            if (self.ApplicantBasicData().RequestApplicantType() != undefined)
                type = RequestApplicantTypeEnum.properties[self.ApplicantBasicData().RequestApplicantType()].name;
        } catch (err) {
            return "";
        }

        return type;
    }, this);

    this.ValidateApplicantTest = function (_TestType) {
        var ok = true;

        if (_TestType == 1) {
            ok = self.KnowledgeTest().IsOk();
        } else {
            var testIndex = _TestType - 2;
            var test = self.ConvenienceTestList()[testIndex];
            return test.IsOk();
        }

        return ok;
    };

    this.ApplicantHasTest = function (_TestType, convenienceTestRequirement) {
        _TestType = _TestType == TestTypeEnum.CONVENIENCIA_SECOND ? TestTypeEnum.CONVENIENCIA : _TestType;
        convenienceTestRequirement = convenienceTestRequirement == undefined ? true : convenienceTestRequirement;
        var hastest;
        hastest = self.Test().some(function (elem) {
            return elem.TestType() == _TestType;
        });
        if (!convenienceTestRequirement && (_TestType == TestTypeEnum.CONVENIENCIA_SECOND || _TestType == TestTypeEnum.CONVENIENCIA)) {
            hastest = false;
        }
        return hastest;
    };

    this.GetApplicantTestAnswers = function () {
        var values = [];

        if (self.ApplicantHasTest(1)) {
            values = values.concat(self.KnowledgeTest().getQuestionsAnswer(true));
        }

        if (self.ApplicantHasTest(2)) {
            self.ConvenienceTestList().forEach(function (test) {
                if (!test.SkipTest())
                    values = values.concat(test.getQuestionsAnswer(true));
            });
        }

        return values;
    };

    this.getApplicantDataForSaveRequest = function () {
        var applicantRequestData = {

            "BasicData": self.ApplicantBasicData().ViewModelToJSON(),

            "PersonalData": self.ApplicantPersonalData().ViewModelToJSON(),

            "ContactData": self.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TITULAR ? self.ApplicantContactData().ViewModelToJSON() : self.ApplicantContactData().GetFiscalAddressToJSON(),

            "Answers": self.GetApplicantTestAnswers()
        };
        return applicantRequestData;
    };

    this.AllowTestEdit = ko.computed(function () {
        var ok = false;
        return ok;
    }, this);

    self.ApplicantType.subscribe(function (newValue) {
        self.ApplicantBasicData().ApplicantType(newValue);
        self.ApplicantPersonalData().ApplicantType(newValue);
    });

    this.GetCurrentConvenienceTest = function (testType) {
        var currentTest;
        if (testType > 1) {
            currentTest = self.ConvenienceTestList()[testType - 2];
        }
        return currentTest;
    }

};

var Question = function (_IdQuestion, _Question, _QuestionLabel, _QuestionOrder, _TestType, _AllowMultipleAnswers, _AllowNoAnswer, _QuestionGroup, _ApplicantType, _RequestType, _Answers, _ErrorMessage, _ToolTip, _QuestionType, _Family, _SubFamilyProductId) {
    var self = this;
    this.validateNow = ko.observable(false);
    this.IdQuestion = ko.observable(_IdQuestion);
    this.Question = ko.observable(_Question);
    this.QuestionLabel = ko.observable(_QuestionLabel);
    this.QuestionOrder = ko.observable(_QuestionOrder);
    this.TestType = ko.observable(_TestType);
    this.SelectedAnswer = ko.observable(0);
    this.TypeCheck = ko.observable(_AllowMultipleAnswers);
    this.TypeSelect = ko.observable(!_AllowMultipleAnswers);
    this.QuestionGroup = ko.observable(_QuestionGroup);
    this.QuestionVisible = ko.observable(true);
    this.Answers = ko.observableArray(_Answers);
    this.AnswerText = ko.observable();
    this.ApplicantType = ko.observable(_ApplicantType);
    this.RequestType = ko.observable(_RequestType);
    this.AllowNoAnswer = ko.observable(_AllowNoAnswer);
    this.QuestionType = ko.observable(_QuestionType);
    this.ErrorMessage = ko.observable(_ErrorMessage);
    this.Family = ko.observable(_Family);
    this.SubFamilyProductId = ko.observable(_SubFamilyProductId);
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
    this.ToolTip = ko.observable(_ToolTip);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        if (self.AllowNoAnswer == false) {
            ok = self.SelectedAnswer() != undefined && self.SelectedAnswer() != 0;
        }
        self.questionOK(ok);
        return ok;
    }

    this.answerIndex = ko.computed(function () {
        var indexQuestion = self.Answers().indexOf(self.SelectedAnswer());
        return indexQuestion;
    }, this);

    this.showRadioQuestion = ko.computed(function () {
        var idQuestion = self.IdQuestion(), showRadioQuestion = false;
        if (idQuestion && [207, 208, 209, 210, 211, 212, 213].includes(idQuestion)) {
            showRadioQuestion = true;
        }

        return showRadioQuestion;
    }, this);

    this.showSelectQuestion = ko.computed(function () {
        var idQuestion = self.IdQuestion(), showSelectQuestion = false;
        if (idQuestion && [214, 215, 216, 217, 218, 219, 220].includes(idQuestion)) {
            showSelectQuestion = true;
        }

        return showSelectQuestion;
    }, this);

    this.showInputQuestion = ko.computed(function () {
        var idQuestion = self.IdQuestion(), showInputQuestion = false;
        if (idQuestion && [221, 222, 223, 224, 225, 226, 227].includes(idQuestion)) {
            showInputQuestion = true;
        }

        return showInputQuestion;
    }, this);

    this.showAdditionalInputQuestion = ko.computed(function () {
        var idQuestion = self.IdQuestion(), showAdditionalInputQuestion = false;
        if (idQuestion && [290, 292, 294, 296, 298, 300].includes(idQuestion)) {
            showAdditionalInputQuestion = true;
        }

        return showAdditionalInputQuestion;
    }, this);

    this.showAdditionalCheckboxQuestion = ko.computed(function () {
        var idQuestion = self.IdQuestion(), showAdditionalCheckboxQuestion = false;
        if (idQuestion && [289, 291, 293, 295, 297, 299].includes(idQuestion)) {
            showAdditionalCheckboxQuestion = true;
        }

        return showAdditionalCheckboxQuestion;
    }, this);

    this.Checked = ko.observable(false);
};

var Answer = function (_Answer, _IdAnswer, _IdQuestion, _DependentQuestion, _ExtendedAnswer, _NotMultiAnswer, _Type, _NoAnswer = false) {
    var self = this;
    this.Answer = ko.observable(_Answer);
    this.IdAnswer = ko.observable(_IdAnswer);
    this.Checked = ko.observable(false);
    this.IdQuestion = ko.observable(_IdQuestion);
    this.DependentQuestion = ko.observable(_DependentQuestion);
    this.ExtendedAnswer = ko.observable(_ExtendedAnswer);
    this.NotMultiAnswer = ko.observable(_NotMultiAnswer);
    this.VisibleExtendedAnswer = ko.observable(false);
    this.TextExtendedAnswer = ko.observable();
    this.Type = ko.observable(_Type);
    this.NoAnswer = ko.observable(_NoAnswer);
};

var ProductData = function (ProductTypes) {
    SetCleaveClass();
    var self = this;
    this.ProductType = ko.observable();
    this.Product = ko.observable();
    this.ProductTypeList = ko.observableArray(ProductTypes);

    this.ProfitabilityDisclaimer = ko.observable();
    this.ProfitabilityDate = ko.observable();
    this.ProfitabilityDateFIL = ko.observable();

    this.validateNow = ko.observable(false);
    this.LifeCicleAge = ko.observable(null);

    this.ProductType.subscribe(function (newValue) {
        if (newValue == ProductTypeEnum.ASESORAMIENTOS.toString()) {
            self.Product(ProductEnum.ASESORAMIENTO.toString());
        }
    });

    this.LifeCicleDate = ko.observable(new CustomDate()).extend({
        RequiredCustomDate: {
            message: "Por favor indique su fecha de nacimiento",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        Birthday: {
            message: "La fecha de nacimiento no es correcta",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        customdate: {
            message: "La fecha de nacimiento no es correcta",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });

    this.LifeCicleClick = function (scope, event) {
        if (scope == null)
            return true;

        self.validateNow(true);
        var toshowid = $(event.delegateTarget).data('relative');

        if (self.LifeCicleDate.isValid()) {
            sessionStorage.setItem('birthday', self.LifeCicleDate().parseString());

            var age = self.LifeCicleDate().getAge();
            self.LifeCicleAge(age);
            $('#' + toshowid).show();
            try {
                window.scrollWindow(toshowid);
            } catch (e) { }
            self.Product(null);
            $('[data-from-age]').each(function () {
                var fromAux = parseInt($(this).data('from-age'));
                var toAux = parseInt($(this).data('to-age'));
                if (fromAux <= age && age < toAux) {
                    var productId = $(this).find('input[type="radio"]').val();
                    self.Product(productId);
                }
            })
        } else {
            sessionStorage.setItem('lifeCicleOK', null);
            self.Product(null);
            $('#' + toshowid).hide();
            window.scrollError();
            return false;
        }
    };

    this.ResetAge = function (scope, event) {
        if (scope == null || (typeof scope.Id === 'function' && scope.Id() == ProductTypeEnum.ASESORAMIENTOS.toString()))
            return true;

        sessionStorage.removeItem('birthday');
        self.Product(null);
        $('[id^="product-content"]').hide();
        self.LifeCicleAge(null);
        sessionStorage.setItem('lifeCicleOK', null);
    };

    this.Accept = function (scope, event) {
        if (scope == null)
            return true;

        this.ResetAge(scope, event);
        sessionStorage.setItem('lifeCicleOK', true);
    };

    this.Deny = function (scope, event) {
        if (scope == null)
            return true;

        this.ResetAge(scope, event);
        sessionStorage.setItem('lifeCicleOK', false);
    };
};

var Product = function (_Id, _ProductTypeId, _Name, _Description, _Profitability, _ProfitabilityDateText, _IdOperation, _AdultMax, _AdultMin, _MinorMax, _MinorMin, _DisabledMax, _DisabledMin, _Iban, _fromAge, _toAge, _complex, _rdcode, _family, _employeeMax, _employeeMin, _subFamilyProductId) {
    var self = this;
    this.Id = ko.observable(_Id);
    this.ProductTypeId = ko.observable(_ProductTypeId);
    this.Name = ko.observable(_Name);
    this.Description = ko.observable(_Description);
    this.Profitability = ko.observable(_Profitability);
    this.ProfitabilityDateText = ko.observable(_ProfitabilityDateText);
    this.IdOperation = ko.observable(_IdOperation);
    this.AdultMax = ko.observable(_AdultMax);
    this.AdultMin = ko.observable(_AdultMin);
    this.MinorMax = ko.observable(_MinorMax);
    this.MinorMin = ko.observable(_MinorMin);
    this.DisabledMax = ko.observable(_DisabledMax);
    this.DisabledMin = ko.observable(_DisabledMin);
    this.Iban = ko.observable(_Iban);
    this.ProductOperationList = ko.observableArray();
    this.FromAge = ko.observable(_fromAge);
    this.ToAge = ko.observable(_toAge);
    this.ComplexProduct = ko.observable(_complex);
    this.RDCode = ko.observable(_rdcode);
    this.Family = ko.observable(_family);
    this.EmployeeMax = ko.observable(_employeeMax);
    this.EmployeeMin = ko.observable(_employeeMin);
    this.SubFamilyProductId = ko.observable(_subFamilyProductId)

    this.ProductHeader = ko.computed(function () {
        var header = "Configura tu inversión en el ";
        if (self.ProductTypeId() == ProductTypeEnum.PLANES || self.ProductTypeId() == ProductTypeEnum.EPSV)
            return header + "plan de pensiones " + self.Name();

        if (self.ProductTypeId() == ProductTypeEnum.FONDOS || self.ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE)
            return header + "fondo " + self.Name();
    }, this);

    this.ProductExtendedHeader = ko.computed(function () {
        var desc = '';
        switch (self.ProductTypeId()) {
            case ProductTypeEnum.PLANES:
                desc = "A continuación necesitamos conocer el importe que vas a destinar a tu inversión. Puedes realizar tu primera aportación a través de una transferencia. También si tienes planes de pensiones en otras entidades, puedes traspasarlos al Plan de pensiones " + self.Name() + " que has seleccionado.";
                break;
            case ProductTypeEnum.FONDOS:
            case ProductTypeEnum.INVERSIONLIBRE:
                {
                    if (self.Family() == 12) {
                        desc = "Puedes realizar tu inversión a través de una suscripción mediante una transferencia bancaria.";
                    } else {
                        desc = "Puedes realizar tu inversión a través de una suscripción mediante una transferencia bancaria o a través de un traspaso de posiciones existentes en fondos de inversión  de otras entidades";
                    }
                }
                break;
            case ProductTypeEnum.EPSV:
                desc = "A continuación necesitamos conocer el importe que vas a destinar a tu inversión. Puedes realizar tu primera aportación a través de una transferencia. También si tienes EPSV en otras entidades, puedes traspasarlas a " + self.Name() + " que has seleccionado.";
                break;
        }
        return desc;
    }, this);

    this.IbanExtendedHeader = ko.computed(function () {
        var desc = '';
        switch (self.ProductTypeId()) {
            case ProductTypeEnum.PLANES:
                desc = "Esta cuenta es necesaria para realizar suscripciones o aportaciones y futuros reembolsos o prestaciones.";
                break;
            case ProductTypeEnum.FONDOS:
            case ProductTypeEnum.INVERSIONLIBRE:
                {
                    //if (self.Family() == 12) {
                    //    desc = "Esta cuenta es necesaria para que puedas realizar futuros reembolsos. Sólo la utilizaremos en el caso de que reembolses parcial o totalmente cualquiera de los productos contratados.";
                    //} else {
                    //    desc = "Esta cuenta es necesaria para que puedas realizar futuros reembolsos. Sólo la utilizaremos en el caso de que reembolses parcial o totalmente cualquiera de los productos contratados.";
                    //}
                    desc = "Esta cuenta es necesaria para realizar suscripciones o aportaciones y futuros reembolsos o prestaciones.";

                }
                break;
            case ProductTypeEnum.EPSV:
                desc = "Esta cuenta es necesaria para realizar suscripciones o aportaciones y futuros reembolsos o prestaciones.";
                break;
        }
        return desc;
    }, this);

    this.ViewModelToJSON = ko.pureComputed(function () {
        var data = {
            "IdProduct": self.Id(),
            "Operations":
                []
        };

        for (var j = 0; j < self.ProductOperationList().length; j++) {
            data.Operations.push(self.ProductOperationList()[j].ViewModelToJSON());
        };

        return data;
    }, this);

    this.AllowAddOperation = ko.computed(function () {
        var allow = (self.ProductTypeId() == ProductTypeEnum.FONDOS || self.ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE) ? self.ProductOperationList().length == 0 : self.ProductOperationList().length < 16;
        return allow;
    }, this);
};

var RefundAccountNumberData = function () {
    var self = this;

    this.validateNow = ko.observable(false);

    this.defaultIBAN = ko.observable("");
    this.btnNextBlocked = ko.observable(true);
    this.checkUseOperationIBAN = ko.observable(true);
    this.AccountNumberAcceptanceDate = ko.observable();
    this.acceptRefundIban = ko.observable().extend({
        equal: {
            params: true,
            message: "Debe marcar esta casilla para poder continuar"
        }
    });

    this.AccountNumber = ko.observable().extend({
        required: {
            message: "Por favor indique el IBAN",
        },
        // En extranjero esta validacion de IBAN esta eliminada, para aceptar cualquier IBAN, incluso de los paises que no siguen esa normativa
        //AccountNumber: {
        //    message: "El IBAN no es válido"
        //}
    });

    self.AccountNumber.subscribe(function (newValue) {
        if ((self.AccountNumber() && self.AccountNumber() != "") && (self.defaultIBAN() && self.defaultIBAN() != "")) {
            if (newValue.toUpperCase().replace(/\s/g, "") == self.defaultIBAN().toUpperCase().replace(/\s/g, "")) {
                self.checkUseOperationIBAN(true);
            } else {
                self.checkUseOperationIBAN(false);
            }
        }

        self.checkBlockedNextButton();
    });

    self.acceptRefundIban.subscribe(function (newValue) {
        self.checkBlockedNextButton();
        if (newValue) {
            self.AccountNumberAcceptanceDate(new Date().toISOString());
        }
        else {
            self.AccountNumberAcceptanceDate(null);
        }
    });

    self.checkUseOperationIBAN.subscribe(function (newValue) {
        if (newValue) {
            self.AccountNumber(self.defaultIBAN());
        } else {
            if ((self.AccountNumber() && self.AccountNumber() != "") && (self.defaultIBAN() && self.defaultIBAN() != "")) {
                if (self.AccountNumber().toUpperCase().replace(/\s/g, "") != self.defaultIBAN().toUpperCase().replace(/\s/g, "")) {
                    self.AccountNumber(); //¿Este metodo solo obtiene el valor de AccountNumber, no hace nada, deberia borrarse?                    
                } else {
                    self.AccountNumber('');
                }
            }
        }
        self.checkBlockedNextButton();
    });

    this.checkBlockedNextButton = function () {
        //usado cuando se modifican alguno de los 3 campos del formulario
        //bloquea del boton de continuar si no se han superado las validaciones, el IBAN no es correcto o no se ha marcado la casilla de aceptar
        //pero no avanza al siguiente step como el metodo CreateRefundAccountNumberData
        self.btnNextBlocked(true);
        self.validateNow(true);

        if (self.errors().length === 0) {
            self.btnNextBlocked(false);
        }
    };
    this.blockUnblockNextButton = function (valor) {
        self.btnNextBlocked(valor);
    };

    this.CreateRefundAccountNumberData = function (scope, event) {
        //click en boton de continuar
        self.blockUnblockNextButton(true);
        var ok = self.IsValidAccountNumberFormFields();

        if (ok) {
            GMT.PushEvent(PageEnum.NUMERO_IBAN_REEMBOLSO);
            $(event.target).addClass('loading');
            $(event.target).addClass('disabled');
            scope.goToNextStep(function () {
                self.blockUnblockNextButton(false);
                $(event.target).removeClass('loading');
                $(event.target).removeClass('disabled');
            });
        }
    };

    this.IsValidAccountNumberFormFields = function () {
        //Valicacion del clicke en boton continuar
        self.validateNow(true);
        if (self.errors().length === 0) {
            return true;
        }
        else {
            self.errors.showAllMessages();
            window.scrollError();
            GMT.PushEventErrorArray(PageEnum.NUMERO_IBAN_REEMBOLSO, 'error', self.errors());
            return false;
        }
    };

    this.errors = ko.validation.group(this);

    this.ViewModelToJSON = ko.pureComputed(function () {
        var accountdata = {
            AccountNumber: self.AccountNumber()
        };

        return accountdata;
    }, this);
};

var ProductType = function (_Id, _Name, _Description, _Products) {
    var self = this;
    this.Id = ko.observable(_Id);
    this.Name = ko.observable(_Name);
    this.Description = ko.observable(_Description);
    this.Products = ko.observableArray(_Products);

    this.svgfile = ko.computed(function () {
        var file = '';
        switch (self.Id()) {
            case 1:
                file = SvgFileEnum.PLAN;
                break;
            case 2:
            case 3:
            case 5:
                file = SvgFileEnum.FONDO;
                break;
            case 4:
                file = SvgFileEnum.EPSV;
                break;
        }
        return file;
    }, this);
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




/* Tests */

var KnowledgeTest = function (applicant) {
    var self = this;

    this.confirmaQuestion = ko.observable(new ConfirmQuestion());
    this.fiscalQuestion = ko.observable(new FiscalResidenceQuestion(applicant.ApplicantContactData().FiscalAddress().CountryId(), applicant.ApplicantBasicData().ApplicantType() == ApplicantTypeEnum.FISICAEXTRANJERA ? applicant.ApplicantBasicData().DNI() : ''));
    this.secondResidenceQuestion = ko.observable(new SecondCountryQuestion(applicant.ApplicantContactData().FiscalAddress().CountryId() != 1, applicant.ApplicantBasicData().ApplicantType() == ApplicantTypeEnum.FISICAEXTRANJERA ? applicant.ApplicantBasicData().DNI() : ''));
    this.usaSecurityNumberQuestion = ko.observable(new SsnQuestion());
    this.occupationQuestion = ko.observable(new OccupationQuestion());
    this.sectorQuestion = ko.observable(new SectorQuestion());
    this.cargoQuestion = ko.observable(new CargoQuestion());
    this.publicQuestion = ko.observable(new PublicPositionQuestion());
    this.ongQuestion = ko.observable(new OngQuestion());
    this.originQuestion = ko.observable(new OriginMoneyQuestion());
    this.annualQuestion = ko.observable(new AnnualIncomeQuestion());
    this.prpQuestion = ko.observable(new PrpQuestion());

    this.IsOk = function () {
        var ok = true;

        self.confirmaQuestion().validate();
        self.fiscalQuestion().validate();
        self.secondResidenceQuestion().validate(self.fiscalQuestion());
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

        self.tagQuestionValidation();

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

    this.tagQuestionValidation = function () {
        if (!self.confirmaQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.confirmaQuestion().errors()); }
        //TODO
        //if (!self.fiscalQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.confirmaQuestion().errors()); }
        //if (!self.secondResidenceQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.confirmaQuestion().errors()); }
        if (!self.occupationQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.occupationQuestion().errors()); }
        if (!self.sectorQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.sectorQuestion().errors()); }
        if (!self.publicQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.publicQuestion().errors()); }
        if (!self.ongQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.ongQuestion().errors()); }
        if (!self.originQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.originQuestion().errors()); }
        if (!self.annualQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.annualQuestion().errors()); }
        if (self.visiblePrp() && !self.prpQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.prpQuestion().errors()); }
        if (self.visibleCargo() && !self.cargoQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.cargoQuestion().errors()); }
    };

};

var KnowledgeTestRepresentative = function (applicant) {
    var self = this;

    this.confirmaQuestion = ko.observable(new ConfirmQuestion());
    this.fiscalQuestion = ko.observable(new FiscalResidenceQuestion(applicant.ApplicantContactData().FiscalAddress().CountryId(), applicant.ApplicantBasicData().ApplicantType() == ApplicantTypeEnum.FISICAEXTRANJERA ? applicant.ApplicantBasicData().DNI() : ''));
    this.secondResidenceQuestion = ko.observable(new SecondCountryQuestion(applicant.ApplicantContactData().FiscalAddress().CountryId() != 1, applicant.ApplicantBasicData().ApplicantType() == ApplicantTypeEnum.FISICAEXTRANJERA ? applicant.ApplicantBasicData().DNI() : ''));
    this.usaSecurityNumberQuestion = ko.observable(new SsnQuestion());
    this.occupationQuestion = ko.observable(new OccupationQuestion());
    this.sectorQuestion = ko.observable(new SectorQuestion());
    this.cargoQuestion = ko.observable(new CargoQuestion());
    this.publicQuestion = ko.observable(new PublicPositionQuestion());
    this.ongQuestion = ko.observable(new OngQuestion());
    this.originQuestion = ko.observable(new OriginMoneyQuestion());
    this.annualQuestion = ko.observable(new AnnualIncomeQuestion());
    this.prpQuestion = ko.observable(new PrpQuestion());

    this.IsOk = function () {
        var ok = true;

        self.fiscalQuestion().validate();
        self.secondResidenceQuestion().validate(self.fiscalQuestion());
        self.publicQuestion().validate();
        self.ongQuestion().validate();

        if (self.visiblePrp())
            self.prpQuestion().validate();

        ok = self.fiscalQuestion().questionIsFullOk()
            && self.secondResidenceQuestion().questionIsFullOk()
            && self.publicQuestion().questionOK()
            && self.ongQuestion().questionOK()
            && (self.visiblePrp() ? self.prpQuestion().questionOK() : true);

        self.tagQuestionValidation();

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

    this.tagQuestionValidation = function () {
        //TODO
        //if (!self.fiscalQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.confirmaQuestion().errors()); }
        //if (!self.secondResidenceQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.confirmaQuestion().errors()); }
        if (!self.publicQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.publicQuestion().errors()); }
        if (!self.ongQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.ongQuestion().errors()); }
        if (self.visiblePrp() && !self.prpQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.prpQuestion().errors()); }
    };

};

var KnowledgeTestTutor = function (applicant) {
    var self = this;

    this.confirmaQuestion = ko.observable(new ConfirmQuestion());
    this.fiscalQuestion = ko.observable(new FiscalResidenceQuestion(applicant.ApplicantContactData().FiscalAddress().CountryId(), applicant.ApplicantBasicData().ApplicantType() == ApplicantTypeEnum.FISICAEXTRANJERA ? applicant.ApplicantBasicData().DNI() : ''));
    this.secondResidenceQuestion = ko.observable(new SecondCountryQuestion(applicant.ApplicantContactData().FiscalAddress().CountryId() != 1, applicant.ApplicantBasicData().ApplicantType() == ApplicantTypeEnum.FISICAEXTRANJERA ? applicant.ApplicantBasicData().DNI() : ''));
    this.usaSecurityNumberQuestion = ko.observable(new SsnQuestion());
    this.occupationQuestion = ko.observable(new OccupationQuestion());
    this.sectorQuestion = ko.observable(new SectorQuestion());
    this.cargoQuestion = ko.observable(new CargoQuestion());
    this.publicQuestion = ko.observable(new PublicPositionQuestion());
    this.ongQuestion = ko.observable(new OngQuestion());
    this.originQuestion = ko.observable(new OriginMoneyQuestion());
    this.annualQuestion = ko.observable(new AnnualIncomeQuestion());
    this.prpQuestion = ko.observable(new PrpQuestion());

    this.IsOk = function () {
        var ok = true;

        self.fiscalQuestion().validate();
        self.secondResidenceQuestion().validate(self.fiscalQuestion());
        self.publicQuestion().validate();
        self.ongQuestion().validate();
        self.occupationQuestion().validate();
        self.sectorQuestion().validate();

        if (self.visibleCargo())
            self.cargoQuestion().validate();

        if (self.visiblePrp())
            self.prpQuestion().validate();

        ok = self.fiscalQuestion().questionIsFullOk()
            && self.secondResidenceQuestion().questionIsFullOk()
            && self.publicQuestion().questionOK()
            && self.ongQuestion().questionOK()
            && self.occupationQuestion().questionOK()
            && self.sectorQuestion().questionOK()
            && (self.visibleCargo() ? self.cargoQuestion().questionOK() : true)
            && (self.visiblePrp() ? self.prpQuestion().questionOK() : true);

        self.tagQuestionValidation();

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
            self.visibleCargo() ? self.cargoQuestion().getQuestionsAnswer() : [],
            self.visiblePrp() ? self.prpQuestion().getQuestionsAnswer() : []
        );

        return questionanswers;
    };

    this.tagQuestionValidation = function () {
        //TODO
        //if (!self.fiscalQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.confirmaQuestion().errors()); }
        //if (!self.secondResidenceQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.confirmaQuestion().errors()); }
        if (!self.occupationQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.occupationQuestion().errors()); }
        if (!self.sectorQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.sectorQuestion().errors()); }
        if (!self.publicQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.publicQuestion().errors()); }
        if (!self.ongQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.ongQuestion().errors()); }
        if (self.visiblePrp() && !self.prpQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.prpQuestion().errors()); }
        if (self.visibleCargo() && !self.cargoQuestion().questionOK()) { GMT.PushEventErrorArray(PageEnum.CONOCIMIENTO, 'error', self.cargoQuestion().errors()); }
    };

};

var ConvenienceTest = function (family, complexityDegree, isComplex, isAltaCrii) {
    var self = this;
    IsProductComplex = isComplex;
    var IsAltaCrii = isAltaCrii;
    this.experiencequestions = ko.observableArray();
    this.subexperiencequestions = ko.observableArray();
    this.formationquestions = ko.observableArray();
    this.productquestions = ko.observableArray();
    this.specificquestions = ko.observableArray();
    this.additionalexperiencequestions = ko.observableArray();
    this.additionalformationquestions = ko.observableArray();
    this.NoCovenienceConfirmQuestion = ko.observable();
    this.SaveKnowledgeAnswers = ko.observable(false);
    this.Family = ko.observable(family);
    this.ComplexityDegree = ko.observable(complexityDegree);
    this.ConvenienceResult = ko.observable();
    this.SkipTest = ko.observable(false);
    this.HideGenericQuestions = ko.observable(false);
    this.IsComplex = ko.observable(isComplex);
    this.showRadioQuestion = ko.observable(false);
    this.showInputQuestion = ko.observable(false);
    this.showSelectQuestion = ko.observable(false);
    this.subExperienceInputQuestion = ko.observable();
    this.SaveSubExperienceAnswers = ko.observable(false);
    this.showAdditionalCheckboxQuestion = ko.observable(false);
    this.showAdditionalInputQuestion = ko.observable(false);
    this.additionalExperienceInputQuestion = ko.observable();
    this.additionalFormationInputQuestion = ko.observable();
    this.hiddenAnswerQuestions = ko.observableArray();
    this.SaveAdditionalExperienceAnswer = ko.observable(false);
    this.SaveAdditionalFormationAnswer = ko.observable(false);
    this.IsProductComplex = ko.observable(isComplex);
    this.IsAltaCrii = ko.observable(isAltaCrii);
    this.SaveOperationAnswers = ko.observable(false);
    this.NoAnswerConfirmQuestion = ko.observable();
    this.UnansweredQuestions = ko.observable(true);
    this.showConfirmQuestion = ko.observable(false);

    this.Init = function () {

        var questions = MasterData.ConvenienceQuestions().filter(function (question) { return question.Family() == self.Family() });

        questions.forEach(function (q) {
            var hiddenAnswers = q.Answers().filter(function (answer) { return answer.NoAnswer() == true });
            if (hiddenAnswers) {
                var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, hiddenAnswers, q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
                self.hiddenAnswerQuestions.push(question);
            }
        });

        var experiencelist = questions.filter(function (question) { return question.QuestionType() == "convenience.experience"; });
        experiencelist.forEach(function (q) {
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers().filter(function (answer) { return answer.NoAnswer() == false }), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.experiencequestions.push(question);
        });

        if (self.IsAltaCrii() && self.IsProductComplex()) {
            var additionalexperiencelist = questions.filter(function (question) { return question.QuestionType() == "convenience.additionalexperiencecomplex"; });
            additionalexperiencelist.forEach(function (q) {
                if ([296, 298, 300].includes(q.IdQuestion())) {
                    var answerid = q.Answers()[0].IdAnswer();
                    self.additionalExperienceInputQuestion(new AdditionalInputQuestion(q.IdQuestion(), q.ToolTip(), answerid, q.AllowNoAnswer()));
                }
                var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers(), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
                self.additionalexperiencequestions.push(question);
            });
        }

        var subexperiencelist = questions.filter(function (question) { return question.QuestionType() == "convenience.subexperience"; });
        subexperiencelist.forEach(function (q) {
            if ([221, 222, 223, 224, 225, 226, 227].includes(q.IdQuestion())) {
                var answerid = q.Answers()[0].IdAnswer();
                self.subExperienceInputQuestion(new SubExperienceInputQuestion(q.IdQuestion(), q.ToolTip(), answerid, q.AllowNoAnswer()));
            }
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers().filter(function (answer) { return answer.NoAnswer() == false }), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.subexperiencequestions.push(question);
        });

        var formationlist = questions.filter(function (question) { return question.QuestionType() == "convenience.formation"; });
        formationlist.forEach(function (q) {
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers().filter(function (answer) { return answer.NoAnswer() == false }), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.formationquestions.push(question);
        });

        if (self.IsAltaCrii() && self.IsProductComplex()) {
            var additionalformationlist = questions.filter(function (question) { return question.QuestionType() == "convenience.additionalformationcomplex"; });
            additionalformationlist.forEach(function (q) {
                if ([290, 292, 294].includes(q.IdQuestion())) {
                    var answerid = q.Answers()[0].IdAnswer();
                    self.additionalFormationInputQuestion(new AdditionalInputQuestion(q.IdQuestion(), q.ToolTip(), answerid, q.AllowNoAnswer()));
                }
                var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers(), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
                self.additionalformationquestions.push(question);
            });
        }

        var productlist = questions.filter(function (question) { return question.QuestionType() == "convenience.operation" || question.QuestionType() == "convenience.operationcomplex"; });
        productlist.forEach(function (q) {
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers().filter(function (answer) { return answer.NoAnswer() == false }), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.productquestions.push(question);
        });

        var specificslist = questions.filter(function (question) { return question.QuestionType() == "convenience.knowledge" || question.QuestionType() == "convenience.knowledgecomplex"; });
        specificslist.forEach(function (q) {
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers().filter(function (answer) { return answer.NoAnswer() == false }), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.specificquestions.push(question);
        });

        var handwrittenquestion = questions.find(function (question) { return question.QuestionType() == "convenience.notconvenient" });
        if (handwrittenquestion != undefined) {
            var answerid = handwrittenquestion.Answers()[0].IdAnswer();
            self.NoCovenienceConfirmQuestion(new ConfirmComplexityQuestion(handwrittenquestion.IdQuestion(), handwrittenquestion.ToolTip(), answerid));
        }

        var handwrittennoanswerquestion = questions.find(function (question) { return question.QuestionType() == "convenience.notcalculatedconvenience" });
        if (handwrittennoanswerquestion != undefined) {
            var answerid = handwrittennoanswerquestion.Answers()[0].IdAnswer();
            self.NoAnswerConfirmQuestion(new ConfirmComplexityQuestion(handwrittennoanswerquestion.IdQuestion(), handwrittennoanswerquestion.ToolTip(), answerid));
        }

    };

    this.IsOk = function () {

        var ok = true, oksubexp = true, okform = true, okadditionalexp = true, okadittionalformation = true;
        var validateText = self.ConvenienceResult() != undefined && !self.ConvenienceResult() && self.IsComplex();

        self.experiencequestions().forEach(function (question) {
            question.validate();
        });

        self.formationquestions().forEach(function (question) {
            question.validate();
        });

        self.productquestions().forEach(function (question) {
            question.validate();
        });

        var validateadditionalexpq = $('.tl-additionalexp-cont').is(":visible");
        var validateadditionalexpqchecked = $('input#f-conveniencia-additionalexp-checkbox').is(":checked");

        if (validateadditionalexpq && validateadditionalexpqchecked && self.IsAltaCrii() && self.IsProductComplex()) {
            self.additionalExperienceInputQuestion().validate();
        }

        var validateadditionalformationq = $('.tl-additionalformation-cont').is(":visible");
        var validateadditionalformationchecked = $('input#f-conveniencia-additionalformation-checkbox').is(":checked");

        if (validateadditionalformationq && validateadditionalformationchecked && self.IsAltaCrii() && self.IsProductComplex()) {
            self.additionalFormationInputQuestion().validate();
        }

        var validatesubexperienceq = $('li.tl-subexp-cont').is(":visible");

        if (validatesubexperienceq) {
            self.subexperiencequestions().forEach(function (question) {
                if ([221, 222, 223, 224, 225, 226, 227].includes(question.IdQuestion())) {

                    self.subExperienceInputQuestion().validate();
                } else {
                    question.validate();
                }
            });
        }

        var validateq = $('#tl-financieros-cont').is(":visible");

        if (validateq) {
            self.specificquestions().forEach(function (question) {
                question.validate();
            });
        }

        var validateoq = $('li.f-conveniencia-operaciones-element').is(":visible");

        if (validateText) {
            if (self.UnansweredQuestions()) {
                self.NoAnswerConfirmQuestion().validate();
            } else {
                self.NoCovenienceConfirmQuestion().validate();
            }
        } else {
            self.SaveOperationAnswers(validateoq);
            self.SaveKnowledgeAnswers(validateq);
            self.SaveSubExperienceAnswers(validatesubexperienceq);
            self.SaveAdditionalExperienceAnswer(validateadditionalexpq && validateadditionalexpqchecked && self.IsAltaCrii() && self.IsProductComplex());
            self.SaveAdditionalFormationAnswer(validateadditionalformationq && validateadditionalformationchecked && self.IsAltaCrii() && self.IsProductComplex());
        }



        ok = self.experiencequestions().every(function (question) {
            return question.questionOK();
        });

        if (validatesubexperienceq) {
            oksubexp = self.subexperiencequestions().every(function (question) {
                if ([221, 222, 223, 224, 225, 226, 227].includes(question.IdQuestion())) {

                    return self.subExperienceInputQuestion().questionOK();
                }
                return question.questionOK();
            });
        }

        if (validateadditionalexpq && validateadditionalexpqchecked) {
            okadditionalexp = self.additionalExperienceInputQuestion().questionOK();
        }

        if (validateadditionalformationq && validateadditionalformationchecked) {
            okadittionalformation = self.additionalFormationInputQuestion().questionOK();
        }

        okform = self.formationquestions().every(function (question) {
            return question.questionOK();
        });

        if (validateoq) {
            ok = ok && self.productquestions().every(function (question) {
                return question.questionOK();
            });
        }

        if (validateq) {
            ok = ok && self.specificquestions().every(function (question) {
                return question.questionOK();
            });
        }

        if (self.showConfirmQuestion() && validateText) {
            if (self.UnansweredQuestions()) {
                ok = ok && self.NoAnswerConfirmQuestion().questionOK()
            } else {
                ok = ok && self.NoCovenienceConfirmQuestion().questionOK()
            }
        }

        return ok && oksubexp && okform && okadditionalexp && okadittionalformation;
    };

    this.getQuestionsAnswer = function (tosave) {
        var questionanswers = [];
        var unansweredQuestions = self.UnansweredQuestions();

        self.experiencequestions().forEach(function (question) {
            if (question.SelectedAnswer()) {
                unansweredQuestions = false;
                questionanswers.push(
                    { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer().IdAnswer(), "OtherAnswer": "" }
                );
            } else {
                var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                unansweredQuestions = true;
                // Insert NoAnswer question
                questionanswers.push(
                    { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "OtherAnswer": "" }
                );
            }
        });

        var subexperienceq = self.SaveSubExperienceAnswers();

        if (subexperienceq && self.subexperiencequestions().length) {
            self.subexperiencequestions().forEach(function (question) {
                if ([207, 208, 209, 210, 211, 212, 213].includes(question.IdQuestion())) {
                    if (question.SelectedAnswer()) {
                        unansweredQuestions = false;
                        questionanswers.push(
                            { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer(), "OtherAnswer": "" }
                        );
                    } else {
                        var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                        unansweredQuestions = true;
                        // Insert NoAnswer question
                        questionanswers.push(
                            { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "OtherAnswer": "" }
                        );
                    }
                } else if ([221, 222, 223, 224, 225, 226, 227].includes(question.IdQuestion())) {
                    if (self.subExperienceInputQuestion().value()) {
                        unansweredQuestions = false;
                        questionanswers.push(
                            { "idQuestion": self.subExperienceInputQuestion().id(), "idAnswer": self.subExperienceInputQuestion().answerId(), "OtherAnswer": self.subExperienceInputQuestion().value() }
                        );
                    } else {
                        var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                        unansweredQuestions = true;
                        // Insert NoAnswer question
                        questionanswers.push(
                            { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "OtherAnswer": "" }
                        );
                    }
                } else {
                    if (question.SelectedAnswer()) {
                        unansweredQuestions = false;
                        questionanswers.push(
                            { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer().IdAnswer(), "OtherAnswer": "" }
                        );
                    } else {
                        var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                        unansweredQuestions = true;
                        // Insert NoAnswer question
                        questionanswers.push(
                            { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "OtherAnswer": "" }
                        );
                    }
                }
            });
        }

        self.formationquestions().forEach(function (question) {
            if (question.SelectedAnswer()) {
                unansweredQuestions = false;
                questionanswers.push(
                    { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer().IdAnswer(), "OtherAnswer": "" }
                );
            } else {
                var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                unansweredQuestions = true;
                // Insert NoAnswer question
                questionanswers.push(
                    { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "OtherAnswer": "" }
                );
            }
        });
        var validateoperationsq = self.SaveOperationAnswers();

        if (validateoperationsq && self.productquestions().length) {
            self.productquestions().forEach(function (question) {
                if (question.SelectedAnswer()) {
                    unansweredQuestions = false;
                    questionanswers.push(
                        { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer(), "OtherAnswer": "" }
                    );
                } else {
                    var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                    unansweredQuestions = true;
                    // Insert NoAnswer question
                    questionanswers.push(
                        { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "OtherAnswer": "" }
                    );
                }
            });
        }

        var validateadditionalexpq = self.SaveAdditionalExperienceAnswer();

        if (self.IsAltaCrii() && validateadditionalexpq && self.IsProductComplex()) {
            questionanswers.push(
                { "idQuestion": self.additionalExperienceInputQuestion().id(), "idAnswer": self.additionalExperienceInputQuestion().answerId(), "OtherAnswer": self.additionalExperienceInputQuestion().value() }
            );
        }

        var validateadditionalformationq = self.SaveAdditionalFormationAnswer();

        if (self.IsAltaCrii() && validateadditionalformationq && self.IsProductComplex()) {
            questionanswers.push(
                { "idQuestion": self.additionalFormationInputQuestion().id(), "idAnswer": self.additionalFormationInputQuestion().answerId(), "OtherAnswer": self.additionalFormationInputQuestion().value() }
            );
        }

        var validateq = self.SaveKnowledgeAnswers();
        if (validateq) {
            self.specificquestions().forEach(function (question) {
                if (question.SelectedAnswer()) {
                    unansweredQuestions = false;
                    questionanswers.push(
                        { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer(), "OtherAnswer": "" }
                    );
                } else {
                    var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                    unansweredQuestions = true;
                    // Insert NoAnswer question
                    questionanswers.push(
                        { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "OtherAnswer": "" }
                    );
                }
            });
        }

        if (self.ConvenienceResult() != undefined && !self.ConvenienceResult() && tosave && self.IsComplex() && !unansweredQuestions) {
            questionanswers.push(
                { "idQuestion": self.NoCovenienceConfirmQuestion().id(), "idAnswer": self.NoCovenienceConfirmQuestion().answerId(), "OtherAnswer": self.NoCovenienceConfirmQuestion().value() }
            );
        }

        if (!self.ConvenienceResult() && tosave && self.IsComplex() && unansweredQuestions) {
            questionanswers.push(
                { "idQuestion": self.NoAnswerConfirmQuestion().id(), "idAnswer": self.NoAnswerConfirmQuestion().answerId(), "OtherAnswer": self.NoAnswerConfirmQuestion().value() }
            );
        }

        self.UnansweredQuestions(unansweredQuestions);
        return questionanswers;
    };

    this.AutoCompleteCommonQuestionsFromPreviousTest = function (test) {
        // 1. Obtiene las posiciones de las respuestas seleccionadas en el test anterior para las preguntas de "experiencia" y "formación"
        var indexExperienceAnswer = test.experiencequestions()[0].Answers().indexOf(test.experiencequestions()[0].SelectedAnswer());
        var indexFormationAnswer = test.formationquestions()[0].Answers().indexOf(test.formationquestions()[0].SelectedAnswer());

        // 2. Obtiene el índice de "experiencia" actual:
        var indexExperience = Number($('select[id=f-conveniencia-exp]').attr("data-answerindex"));

        // 3. Si el índice de "experiencia" es 2 (respuesta C), copia todas las respuesta de "subexperiencia" del test anterior al actual:
        if (test.subexperiencequestions() && indexExperience == 2) {
            var indexSubExperienceAnswer1 = test.subexperiencequestions()[0].Answers().map(e => e.IdAnswer()).indexOf(test.subexperiencequestions()[0].SelectedAnswer());
            var indexSubExperienceAnswer2 = test.subexperiencequestions()[1].Answers().indexOf(test.subexperiencequestions()[1].SelectedAnswer());

            var subExperienceAnswer1 = self.subexperiencequestions()[0].Answers()[indexSubExperienceAnswer1].IdAnswer();
            var subExperienceAnswer2 = self.subexperiencequestions()[1].Answers()[indexSubExperienceAnswer2];
            var subExperienceAnswer3 = test.subExperienceInputQuestion().value()

            self.subexperiencequestions()[0].SelectedAnswer(subExperienceAnswer1);
            self.subexperiencequestions()[1].SelectedAnswer(subExperienceAnswer2);
            self.subExperienceInputQuestion().value(subExperienceAnswer3);

            self.showRadioQuestion(true);
            self.showSelectQuestion(true);
            self.showInputQuestion(true);
        }

        // 4. Establece respuestas generales o principales de "experiencia" y "formación":
        var experienceAnswer = self.experiencequestions()[0].Answers()[indexExperienceAnswer];
        var formationAnswer = self.formationquestions()[0].Answers()[indexFormationAnswer];
        self.experiencequestions()[0].SelectedAnswer(experienceAnswer);
        self.formationquestions()[0].SelectedAnswer(formationAnswer);

        // 5. Oculta preguntas genéricas:
        self.HideGenericQuestions(true);

        $().manageknowledgequestionobserver('.tl-subexp-cont', function () {
            $().manageknowledgequestion()
        });
    }
};

var ConvenienceTestInfra = function (family, complexityDegree, isComplex, isEmployee, isAltaCrii, productId, productMinAmount, subFamilyProductId) {
    var self = this;
    var IsProductComplex = isComplex;
    var IsAltaCrii = isAltaCrii;
    this.experiencequestions = ko.observableArray();
    this.subexperiencequestions = ko.observableArray();
    this.formationquestions = ko.observableArray();
    this.productquestions = ko.observableArray();
    this.specificquestions = ko.observableArray();
    this.NoCovenienceConfirmQuestion = ko.observable();
    this.SaveKnowledgeAnswers = ko.observable(false);
    this.Family = ko.observable(family);
    this.ComplexityDegree = ko.observable(complexityDegree);
    this.ConvenienceResult = ko.observable();
    this.SkipTest = ko.observable(false);
    this.HideGenericQuestions = ko.observable(false);
    this.IsComplex = ko.observable(true);
    this.showRadioQuestion = ko.observable(false);
    this.showInputQuestion = ko.observable(false);
    this.showSelectQuestion = ko.observable(false);
    this.subExperienceInputQuestion = ko.observable();
    this.SaveSubExperienceAnswers = ko.observable(false);
    this.showAdditionalCheckboxQuestion = ko.observable(false);
    this.showAdditionalInputQuestion = ko.observable(false);
    this.additionalExperienceInputQuestion = ko.observable();
    this.additionalFormationInputQuestion = ko.observable();
    this.hiddenAnswerQuestions = ko.observableArray();
    this.SaveAdditionalExperienceAnswer = ko.observable(false);
    this.SaveAdditionalFormationAnswer = ko.observable(false);
    this.IsProductComplex = ko.observable(isComplex);
    this.additionalexperiencequestions = ko.observableArray();
    this.additionalformationquestions = ko.observableArray();
    this.IsAltaCrii = ko.observable(isAltaCrii);
    this.IsEmployee = ko.observable(isEmployee);
    this.InfraMinAmount = ko.observable();
    this.employeeconfirmationquestions = ko.observableArray();
    this.SaveEmployeeConfirmation = ko.observable(false);
    this.NoAnswerConfirmQuestion = ko.observable();
    this.UnansweredQuestions = ko.observable(true);
    this.SubFamilyProductId = ko.observable(subFamilyProductId);
    this.showConfirmQuestion = ko.observable(false);

    this.Init = function () {

        var generalQuestions = MasterData.ConvenienceQuestions().filter(function (question) { return question.Family() == self.Family() && (question.SubFamilyProductId() == undefined || question.SubFamilyProductId() == self.SubFamilyProductId()) });
        var specificQuestions = MasterData.ConvenienceQuestions().filter(function (question) { return question.Family() == self.Family() && question.SubFamilyProductId() == self.SubFamilyProductId() });

        var questions = generalQuestions;

        if (specificQuestions) {
            specificQuestions.forEach(function (specificQuestion) {
                if (!questions.some(function (question) { return question.IdQuestion() === specificQuestion.IdQuestion(); })) {
                    questions.push(specificQuestion);
                }
            });
        }

        var minAmount = productMinAmount;

        if (productId == 25) {
            minAmount = self.IsEmployee() === true ? "6.000" : minAmount;
        }

        self.InfraMinAmount(minAmount.toLocaleString('es-ES'));

        var experiencelist = questions.filter(function (question) { return question.QuestionType() == "convenience.experience" });

        questions.forEach(function (q) {
            var hiddenAnswers = q.Answers().filter(function (answer) { return answer.NoAnswer() == true });
            if (hiddenAnswers) {
                var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, hiddenAnswers, q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
                self.hiddenAnswerQuestions.push(question);
            }
        });

        experiencelist.forEach(function (q) {
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers().filter(function (answer) { return answer.NoAnswer() == false }), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.experiencequestions.push(question);
        });

        var additionalexperiencelist = questions.filter(function (question) { return question.QuestionType() == "convenience.additionalexperiencecomplex"; });
        additionalexperiencelist.forEach(function (q) {
            if ([296, 298, 300].includes(q.IdQuestion())) {
                var answerid = q.Answers()[0].IdAnswer();
                self.additionalExperienceInputQuestion(new AdditionalInputQuestion(q.IdQuestion(), q.ToolTip(), answerid, q.AllowNoAnswer()));
            }
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers(), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.additionalexperiencequestions.push(question);
        });

        var subexperiencelist = questions.filter(function (question) { return question.QuestionType() == "convenience.subexperience"; });
        subexperiencelist.forEach(function (q) {
            if ([221, 222, 223, 224, 225, 226, 227].includes(q.IdQuestion())) {
                var answerid = q.Answers()[0].IdAnswer();
                self.subExperienceInputQuestion(new SubExperienceInputQuestion(q.IdQuestion(), q.ToolTip(), answerid, q.AllowNoAnswer()));
            }
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers().filter(function (answer) { return answer.NoAnswer() == false }), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.subexperiencequestions.push(question);
        });

        var formationlist = questions.filter(function (question) { return question.QuestionType() == "convenience.formation"; });
        formationlist.forEach(function (q) {
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers().filter(function (answer) { return answer.NoAnswer() == false }), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.formationquestions.push(question);
        });

        var additionalformationlist = questions.filter(function (question) { return question.QuestionType() == "convenience.additionalformationcomplex"; });
        additionalformationlist.forEach(function (q) {
            if ([290, 292, 294].includes(q.IdQuestion())) {
                var answerid = q.Answers()[0].IdAnswer();
                self.additionalFormationInputQuestion(new AdditionalInputQuestion(q.IdQuestion(), q.ToolTip(), answerid, q.AllowNoAnswer()));
            }
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers(), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.additionalformationquestions.push(question);
        });

        var productlist = questions.filter(function (question) { return question.QuestionType() == "convenience.experiencecomplex"; });
        productlist.forEach(function (q) {
            if (q.IdQuestion() === 280 || q.IdQuestion() === 319 || q.IdQuestion() === 321) {
                var updatedQuestion = q.Question().replace('{Value}', self.InfraMinAmount());
                q.Question(updatedQuestion);
            }
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers().filter(function (answer) { return answer.NoAnswer() == false }), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.productquestions.push(question);
        });

        var specificslist = questions.filter(function (question) { return question.QuestionType() == "convenience.notconvenientcomplex"; });
        specificslist.forEach(function (q) {
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers().filter(function (answer) { return answer.NoAnswer() == false }), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.specificquestions.push(question);
        });

        var handwrittenquestion = questions.find(function (question) { return question.QuestionType() == "convenience.notconvenient" });
        if (handwrittenquestion != undefined) {
            var answerid = handwrittenquestion.Answers()[0].IdAnswer();
            self.NoCovenienceConfirmQuestion(new ConfirmComplexityQuestion(handwrittenquestion.IdQuestion(), handwrittenquestion.ToolTip(), answerid));
        }

        var handwrittennoanswerquestion = questions.find(function (question) { return question.QuestionType() == "convenience.notcalculatedconvenience" });
        if (handwrittennoanswerquestion != undefined) {
            var answerid = handwrittennoanswerquestion.Answers()[0].IdAnswer();
            self.NoAnswerConfirmQuestion(new ConfirmComplexityQuestion(handwrittennoanswerquestion.IdQuestion(), handwrittennoanswerquestion.ToolTip(), answerid));
        }

        var employeeconfirmationlist = questions.filter(function (question) { return question.QuestionType() == "convenience.employeeconfirmationcomplex"; });
        employeeconfirmationlist.forEach(function (q) {
            var question = new Question(q.IdQuestion(), q.Question(), q.QuestionLabel(), q.QuestionOrder(), q.TestType(), false, q.AllowNoAnswer(), q.QuestionGroup(), 1, 1, q.Answers().filter(function (answer) { return answer.NoAnswer() == false }), q.ErrorMessage(), q.ToolTip(), q.QuestionType(), self.Family());
            self.employeeconfirmationquestions.push(question);
        });
    }

    this.IsOk = function () {

        var ok = true, oksubexp = true, okform = true, okadditionalexp = true, okadittionalformation = true;
        var validateText = self.ConvenienceResult() != undefined && !self.ConvenienceResult() && self.IsComplex();

        self.experiencequestions().forEach(function (question) {
            question.validate();
        });

        self.formationquestions().forEach(function (question) {
            question.validate();
        });

        self.productquestions().forEach(function (question) {
            question.validate();
        });

        var validateadditionalexpq = $('.tl-additionalexp-cont').is(":visible");
        var validateadditionalexpqchecked = $('input#f-conveniencia-additionalexp-checkbox').is(":checked");

        if (validateadditionalexpq && validateadditionalexpqchecked) {
            self.additionalExperienceInputQuestion().validate();
        }

        var validateadditionalformationq = $('.tl-additionalformation-cont').is(":visible");
        var validateadditionalformationchecked = $('input#f-conveniencia-additionalformation-checkbox').is(":checked");

        if (validateadditionalformationq && validateadditionalformationchecked) {
            self.additionalFormationInputQuestion().validate();
        }

        var validatesubexperienceq = $('li.tl-subexp-cont').is(":visible");

        if (validatesubexperienceq) {
            self.subexperiencequestions().forEach(function (question) {
                if ([221, 222, 223, 224, 225, 226, 227].includes(question.IdQuestion())) {

                    self.subExperienceInputQuestion().validate();
                } else {
                    question.validate();
                }
            });
        }

        var validateq = $('#tl-financieros-cont').is(":visible");
        var radioInfraOperationAnswers = {};
        $('input:radio[class=operaciones-infra]').each(function () {
            var val = $(this).data('answer');
            if ($(this).is(':checked') && val != undefined && val.toLowerCase() == 'sí') {
                radioInfraOperationAnswers[$(this).attr('id')] = true;
            }
        });

        var answersCount = 0;
        $.each(radioInfraOperationAnswers, function () {
            answersCount++;
        });

        if (validateq) {
            self.specificquestions().forEach(function (question) {
                question.validate();
            });
        }

        if (validateText) {
            if (self.UnansweredQuestions()) {
                self.NoAnswerConfirmQuestion().validate();
            } else {
                self.NoCovenienceConfirmQuestion().validate();
            }
        } else {
            self.SaveSubExperienceAnswers(validatesubexperienceq);
            self.SaveKnowledgeAnswers(validateq);
            self.SaveAdditionalExperienceAnswer(validateadditionalexpq && validateadditionalexpqchecked);
            self.SaveAdditionalFormationAnswer(validateadditionalformationq && validateadditionalformationchecked);
            self.SaveEmployeeConfirmation(self.IsEmployee() === true);
        }

        ok = self.experiencequestions().every(function (question) {
            return question.questionOK();
        });



        if (validatesubexperienceq) {
            oksubexp = self.subexperiencequestions().every(function (question) {
                if ([221, 222, 223, 224, 225, 226, 227].includes(question.IdQuestion())) {

                    return self.subExperienceInputQuestion().questionOK();
                }
                return question.questionOK();
            });
        }

        if (validateadditionalexpq && validateadditionalexpqchecked) {
            okadditionalexp = self.additionalExperienceInputQuestion().questionOK();
        }

        if (validateadditionalformationq && validateadditionalformationchecked) {
            okadittionalformation = self.additionalFormationInputQuestion().questionOK();
        }

        okform = self.formationquestions().every(function (question) {
            return question.questionOK();
        });

        ok = ok && self.productquestions().every(function (question) {
            return question.questionOK();
        });

        if (validateq) {
            ok = ok && self.specificquestions().every(function (question) {
                return question.questionOK();
            });
        }

        if (self.showConfirmQuestion() && validateText) {
            if (self.UnansweredQuestions()) {
                ok = ok && self.NoAnswerConfirmQuestion().questionOK()
            } else {
                ok = ok && self.NoCovenienceConfirmQuestion().questionOK()
            }
        }
        return ok && oksubexp && okform && okadditionalexp && okadittionalformation;
    };

    this.getQuestionsAnswer = function (tosave) {
        var questionanswers = [];
        var unansweredQuestions = self.UnansweredQuestions();

        self.experiencequestions().forEach(function (question) {
            if (question.SelectedAnswer()) {
                unansweredQuestions = false;
                questionanswers.push(
                    { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer().IdAnswer(), "answer": question.SelectedAnswer().Answer(), "OtherAnswer": "" }
                );
            } else {
                var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                unansweredQuestions = true;
                // Insert NoAnswer question
                questionanswers.push(
                    { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "answer": hiddenAnswerQuestion.Answers()[0].Answer(), "OtherAnswer": "" }
                );
            }
        });

        var subexperienceq = self.SaveSubExperienceAnswers();

        if (subexperienceq && self.subexperiencequestions().length) {
            self.subexperiencequestions().forEach(function (question) {
                if ([207, 208, 209, 210, 211, 212, 213].includes(question.IdQuestion())) {
                    if (question.SelectedAnswer()) {
                        unansweredQuestions = false;
                        questionanswers.push(
                            { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer(), "answer": question.SelectedAnswer(), "OtherAnswer": "" }
                        );
                    } else {
                        var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                        unansweredQuestions = true;
                        // Insert NoAnswer question
                        questionanswers.push(
                            { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "answer": hiddenAnswerQuestion.Answers()[0].Answer(), "OtherAnswer": "" }
                        );
                    }
                } else if ([221, 222, 223, 224, 225, 226, 227].includes(question.IdQuestion())) {
                    if (self.subExperienceInputQuestion().value()) {
                        unansweredQuestions = false;
                        questionanswers.push(
                            { "idQuestion": self.subExperienceInputQuestion().id(), "idAnswer": self.subExperienceInputQuestion().answerId(), "answer": self.subExperienceInputQuestion().value(), "OtherAnswer": self.subExperienceInputQuestion().value() }
                        );
                    } else {
                        var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                        unansweredQuestions = true;
                        // Insert NoAnswer question
                        questionanswers.push(
                            { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "answer": hiddenAnswerQuestion.Answers()[0].Answer(), "OtherAnswer": "" }
                        );
                    }
                } else {
                    if (question.SelectedAnswer()) {
                        unansweredQuestions = false;
                        questionanswers.push(
                            { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer().IdAnswer(), "answer": question.SelectedAnswer().Answer(), "OtherAnswer": "" }
                        );
                    } else {
                        var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                        unansweredQuestions = true;
                        // Insert NoAnswer question
                        questionanswers.push(
                            { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "answer": hiddenAnswerQuestion.Answers()[0].Answer(), "OtherAnswer": "" }
                        );
                    }
                }
            });
        }

        self.formationquestions().forEach(function (question) {
            if (question.SelectedAnswer()) {
                unansweredQuestions = false;
                questionanswers.push(
                    { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer().IdAnswer(), "answer": question.SelectedAnswer().Answer(), "OtherAnswer": "" }
                );
            } else {
                var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                unansweredQuestions = true;
                // Insert NoAnswer question
                questionanswers.push(
                    { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "answer": hiddenAnswerQuestion.Answers()[0].Answer(), "OtherAnswer": "" }
                );
            }
        });

        self.productquestions().forEach(function (question) {
            if (question.SelectedAnswer()) {
                unansweredQuestions = false;
                questionanswers.push(
                    { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer(), "answer": question.SelectedAnswer(), "OtherAnswer": "" }
                );
            } else {
                var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                unansweredQuestions = true;
                // Insert NoAnswer question
                questionanswers.push(
                    { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "answer": hiddenAnswerQuestion.Answers()[0].Answer(), "OtherAnswer": "" }
                );
            }
        });

        var validateadditionalexpq = self.SaveAdditionalExperienceAnswer();

        if (validateadditionalexpq) {
            questionanswers.push(
                { "idQuestion": self.additionalExperienceInputQuestion().id(), "idAnswer": self.additionalExperienceInputQuestion().answerId(), "answer": self.additionalExperienceInputQuestion().value(), "OtherAnswer": self.additionalExperienceInputQuestion().value() }
            );
        }

        var validateadditionalformationq = self.SaveAdditionalFormationAnswer();

        if (validateadditionalformationq) {
            questionanswers.push(
                { "idQuestion": self.additionalFormationInputQuestion().id(), "idAnswer": self.additionalFormationInputQuestion().answerId(), "answer": self.additionalExperienceInputQuestion().value(), "OtherAnswer": self.additionalFormationInputQuestion().value() }
            );
        }

        var validateq = self.SaveKnowledgeAnswers();
        if (validateq) {
            self.specificquestions().forEach(function (question) {
                if (question.SelectedAnswer()) {
                    unansweredQuestions = false;
                    questionanswers.push(
                        { "idQuestion": question.IdQuestion(), "idAnswer": question.SelectedAnswer(), "answer": question.SelectedAnswer(), "OtherAnswer": "" }
                    );
                } else {
                    var hiddenAnswerQuestion = self.hiddenAnswerQuestions().find(function (q) { return q.IdQuestion() == question.IdQuestion() });
                    unansweredQuestions = true;
                    // Insert NoAnswer question
                    questionanswers.push(
                        { "idQuestion": hiddenAnswerQuestion.IdQuestion(), "idAnswer": hiddenAnswerQuestion.Answers()[0].IdAnswer(), "answer": hiddenAnswerQuestion.Answers()[0].Answer(), "OtherAnswer": "" }
                    );
                }
            });
        }

        if (self.ConvenienceResult() != undefined && !self.ConvenienceResult() && tosave && !self.UnansweredQuestions()) {
            questionanswers.push(
                { "idQuestion": self.NoCovenienceConfirmQuestion().id(), "idAnswer": self.NoCovenienceConfirmQuestion().answerId(), "answer": self.NoCovenienceConfirmQuestion().value(), "OtherAnswer": self.NoCovenienceConfirmQuestion().value() }
            );
        }

        if (!self.ConvenienceResult() && tosave && self.UnansweredQuestions()) {
            questionanswers.push(
                { "idQuestion": self.NoAnswerConfirmQuestion().id(), "idAnswer": self.NoAnswerConfirmQuestion().answerId(), "answer": self.NoAnswerConfirmQuestion().value(), "OtherAnswer": self.NoAnswerConfirmQuestion().value() }
            );
        }

        var validateecq = self.SaveEmployeeConfirmation();
        self.employeeconfirmationquestions().forEach(function (question) {
            if (question.IdQuestion() == 301) {
                if (validateecq) {
                    questionanswers.push(
                        { "idQuestion": question.IdQuestion(), "idAnswer": question.Answers()[0].IdAnswer(), "answer": question.Answers()[0].Answer(), "OtherAnswer": "" }
                    );
                } else {
                    questionanswers.push(
                        { "idQuestion": question.IdQuestion(), "idAnswer": question.Answers()[1].IdAnswer(), "answer": question.Answers()[1].Answer(), "OtherAnswer": "" }
                    );
                }
            }
        });

        var hasEmptyAnswers = questionanswers.some(function (question) {
            return question.answer === "Sin respuesta" || question.answer === "";
        });
        // Si hay al menos una pregunta con answer "Sin Respuesta" o vacía, establecer unansweredQuestions en true
        if (hasEmptyAnswers) {
            unansweredQuestions = true;
        }
        self.UnansweredQuestions(unansweredQuestions);
        return questionanswers;
    };

    this.AutoCompleteCommonQuestionsFromPreviousTest = function (test) {
        var indexExperienceAnswer = test.experiencequestions()[0].Answers().indexOf(test.experiencequestions()[0].SelectedAnswer());
        var indexFormationAnswer = test.formationquestions()[0].Answers().indexOf(test.formationquestions()[0].SelectedAnswer());
        var indexExperience = Number($('select[id=f-conveniencia-exp]').attr("data-answerindex"));
        if (test.subexperiencequestions() && indexExperience == 2) {
            var indexSubExperienceAnswer1, indexSubExperienceAnswer2, indexSubExperienceAnswer3;
            var inputVal = $('#f-conveniencia-subexp-input').val();

            indexSubExperienceAnswer1 = test.subexperiencequestions()[0].Answers().map(e => e.IdAnswer()).indexOf(test.subexperiencequestions()[0].SelectedAnswer());
            indexSubExperienceAnswer2 = test.subexperiencequestions()[1].Answers().indexOf(test.subexperiencequestions()[1].SelectedAnswer());
            indexSubExperienceAnswer3 = test.subexperiencequestions()[2].Answers().indexOf(test.subexperiencequestions()[2].Answers()[0]);
            var subExperienceAnswer1 = self.subexperiencequestions()[0].Answers()[indexSubExperienceAnswer1].IdAnswer();
            var subExperienceAnswer2 = self.subexperiencequestions()[1].Answers()[indexSubExperienceAnswer2];
            var subExperienceAnswer3 = self.subexperiencequestions()[2].Answers()[indexSubExperienceAnswer3];
            self.subexperiencequestions()[0].SelectedAnswer(subExperienceAnswer1);
            self.subexperiencequestions()[1].SelectedAnswer(subExperienceAnswer2);
            self.subExperienceInputQuestion(new SubExperienceInputQuestion(
                subExperienceAnswer3.IdQuestion(),
                test.subexperiencequestions()[2].ToolTip(),
                subExperienceAnswer3.IdAnswer()));
            self.subExperienceInputQuestion().value(inputVal);
            self.showRadioQuestion(true);
            self.showInputQuestion(true);
            self.showSelectQuestion(true);
        }

        var experienceAnswer = self.experiencequestions()[0].Answers()[indexExperienceAnswer];
        var formationAnswer = self.formationquestions()[0].Answers()[indexFormationAnswer];

        self.experiencequestions()[0].SelectedAnswer(experienceAnswer);
        self.formationquestions()[0].SelectedAnswer(formationAnswer);
        self.HideGenericQuestions(true);
    }
};

/* Knowledge test questions */

/* Confirm question */

var ConfirmQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 29; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 29; }).ErrorMessage());
    this.validateNow = ko.observable(false);
    this.id = ko.observable(29);
    this.checked = ko.observable(false);
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
var FiscalResidenceQuestion = function (fiscalCountry, passport) {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 34; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 34; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 34; }).QuestionLabel());
    this.id = ko.observable(34);
    this.value = ko.observable(MasterData.CountryList().find(function (a) { return a.id == fiscalCountry; }));
    this.countryName = ko.observable(self.value().valor);
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

    //Error messages subquestions
    this.ErrorMessageDocumentNumber = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 36; }).Question());
    this.ErrorMessageDocumentType = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 35; }).Question());
    this.ErrorMessageExpirationDate = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 37; }).Question());
    this.ErrorMessageDocumentIdentification = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 38; }).Question());

    //subquestions
    this.DocumentNnumber = ko.observable(new TextQuestion(36, self.ErrorMessageDocumentNumber()));
    this.DocumentType = ko.observable(new ComboQuestion(35, [
        new ComboAnswer(244, 'DNI/Equivalente'),
        new ComboAnswer(245, 'Pasaporte'),
        new ComboAnswer(246, 'Tarjeta de identificación expedida por autoridades del país de la UE o EEE.', false, 'UE: Unión Europea EEE: Espacio Económico Europeo', 1)],
        self.ErrorMessageDocumentType())
    );
    this.DocumentExpirationDate = ko.observable(new TextDateQuestion(37, self.ErrorMessageExpirationDate()));
    this.DocumentIdentification = ko.observable(new TextQuestion(38, self.ErrorMessageDocumentIdentification()));

    self.DocumentType().value.subscribe(function (newValue) {
        if (newValue.id() == 245) {
            self.DocumentNnumber().value(passport);
        } else {
            self.DocumentNnumber().value('');
        }
    });

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        if (self.value() == null) {
            ok = false;
            self.questionOK(false);
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
                questions.push({ "idQuestion": self.DocumentExpirationDate().id(), "idAnswer": 1, "OtherAnswer": self.DocumentExpirationDate().value().parseString() });
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

var SecondCountryQuestion = function (enabled, passport) {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 39; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 39; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 39; }).QuestionLabel());
    this.id = ko.observable(39);
    this.value = ko.observable();
    this.enabled = ko.observable(enabled);
    this.validateNow = ko.observable(false);
    this.questionOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: 'El segundo país de residencia fiscal no puede ser igual al país de residencia fiscal. Cumplimente este campo solo en caso de tener segundo país de residencia fiscal',
                onlyIf: function () {
                    return self.validateNow();
                }
            }
        });
    this.errors = ko.validation.group(this);
    this.questionIsFullOk = ko.observable(true);

    //Error messages subquestions
    this.ErrorMessageDocumentNumber = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 41; }).Question());
    this.ErrorMessageDocumentType = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 40; }).Question());
    this.ErrorMessageExpirationDate = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 42; }).Question());
    this.ErrorMessageDocumentIdentification = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 43; }).Question());

    //subquestions
    this.SecondDocumentNumber = ko.observable(new TextQuestion(41, self.ErrorMessageDocumentNumber()));
    this.SecondDocumentType = ko.observable(new ComboQuestion(40, [
        new ComboAnswer(86, 'DNI/Equivalente'),
        new ComboAnswer(87, 'Pasaporte'),
        new ComboAnswer(88, 'Tarjeta de identificación expedida por autoridades del país de la UE o EEE.', false, 'UE: Unión Europea EEE: Espacio Económico Europeo', 1)],
        self.ErrorMessageDocumentType())
    );
    this.SecondDocumentExpirationDate = ko.observable(new TextDateQuestion(42, self.ErrorMessageExpirationDate()));
    this.SecondDocumentIdentification = ko.observable(new TextQuestion(43, self.ErrorMessageDocumentIdentification()));

    this.selected = ko.computed(function () {
        return self.value() != null;
    }, this);

    self.SecondDocumentType().value.subscribe(function (newValue) {
        if (newValue.id() == 87) {
            self.SecondDocumentNumber().value(passport);
        } else {
            self.SecondDocumentNumber().value('');
        }
    });

    this.validate = function (firstCountry) {
        var ok = true;
        self.validateNow(true);

        if (self.value() != null) {
            self.SecondDocumentNumber().validateNow(true);
            self.SecondDocumentType().validateNow(true);
            self.SecondDocumentExpirationDate().validateNow(true);
            self.SecondDocumentIdentification().validateNow(true);

            self.questionOK(
                self.value().id != firstCountry.value().id
            );

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
                && self.SecondDocumentIdentification().questionOK()
                && self.questionOK();
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
            questions.push({ "idQuestion": self.SecondDocumentExpirationDate().id(), "idAnswer": 1, "OtherAnswer": self.SecondDocumentExpirationDate().value().parseString() });
            questions.push({ "idQuestion": self.SecondDocumentIdentification().id(), "idAnswer": 1, "OtherAnswer": self.SecondDocumentIdentification().value() });
        }

        return questions;
    };
};

/* EEUU SSN question */

var SsnQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 44; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 44; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 44; }).QuestionLabel());
    this.id = ko.observable(44);
    this.value = ko.observable();
    this.label = ko.observable();

    this.getQuestionsAnswer = function () {
        var questions = [];
        if (self.value() != null && self.value().trim().length > 0) {
            var ssn = {
                "idQuestion": self.id(), "idAnswer": "1", "OtherAnswer": self.value()
            };
            questions.push(ssn);
        }

        return questions;
    };
};

/* Ocupation question */

var OccupationQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 45; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 45; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 45; }).QuestionLabel());
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

        if (ok) { window.setDatalayerItem('situacionLaboral', self.value().label()); }

        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];
        var occupation = {
            "idQuestion": self.id(), "idAnswer": self.value().id(), "OtherAnswer": ""
        };
        questions.push(occupation);

        return questions;
    };

};

/* Sector question */

var SectorQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 46; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 46; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 46; }).QuestionLabel());
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
                new SectorAnswer(1037, 'Asociaciones/Sindicatos/Organizaciones sin ánimo de lucro/Órdenes religiosas'),
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

var CargoQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 47; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 47; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 47; }).QuestionLabel());
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
};

/* Public person question */

var PublicPositionQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 48; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 48; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 48; }).QuestionLabel());
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
        return self.value() != undefined;
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

};

/* ONG question */

var OngQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 50; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 50; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 50; }).QuestionLabel());
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
        return self.value() != undefined;
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
};

/* Origin money question */

var OriginMoneyQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 51; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 51; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 51; }).QuestionLabel());
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
};

/* Annual income question*/

var AnnualIncomeQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 52; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 52; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 52; }).QuestionLabel());
    this.validateNow = ko.observable(false);
    this.id = ko.observable(52);
    this.answers = ko.observableArray([
        new CheckAnswer(225, 'Entre 0 € y 40.000€', false),
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
};

/* Prp question*/

var PrpQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 49; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 49; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 49; }).QuestionLabel());
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
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).QuestionLabel());
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
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).QuestionLabel());
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

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.value() != null;
        self.questionOK(ok);
        return ok;
    };
};

var ComboQuestion = function (questionid, options, errormessage) {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).QuestionLabel());
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

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.value() != null;
        self.questionOK(ok);
        return ok;
    };

};

var RadioQuestion = function (questionid, options, errormessage) {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).QuestionLabel());
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

    this.validate = function () {
        var ok = true;
        self.validateNow(true);
        ok = self.value() != null;
        self.questionOK(ok);
        return ok;
    };
}

var RadioAnswer = function (answerid, answerlabel, answerisextended, tooltip, sup) {
    var self = this;
    this.id = ko.observable(answerid);
    this.label = ko.observable(answerlabel);
    this.value = ko.observable();
    this.isExtended = ko.observable(answerisextended);
    this.extendedAnswer = ko.observable();
    this.tooltip = ko.observable(tooltip);
    this.sup = ko.observable(sup);
};

var SubExperienceInputQuestion = function (questionid, validationtext, answerid, _AllowNoAnswer) {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).QuestionLabel());
    this.validateNow = ko.observable(false);
    this.id = ko.observable(questionid);
    this.value = ko.observable();
    this.ValidationText = ko.observable(validationtext);
    this.answerId = ko.observable(answerid);
    this.AllowNoAnswer = ko.observable(_AllowNoAnswer);
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
        if (self.AllowNoAnswer == false) {
            ok = self.value() != null && self.value() != '';
        }
        self.questionOK(ok);
        return ok;
    };
};

var AdditionalInputQuestion = function (questionid, validationtext, answerid, _AllowNoAnswer) {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).QuestionLabel());
    this.validateNow = ko.observable(false);
    this.id = ko.observable(questionid);
    this.value = ko.observable();
    this.ValidationText = ko.observable(validationtext);
    this.answerId = ko.observable(answerid);
    this.AllowNoAnswer = ko.observable(_AllowNoAnswer);
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
        ok = self.value() != null && self.value() != '';
        self.questionOK(ok);
        return ok;
    };
};


var ConfirmComplexityQuestion = function (questionid, validationtext, answerid) {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === questionid; }).QuestionLabel());
    this.validateNow = ko.observable(false);
    this.id = ko.observable(questionid);
    this.value = ko.observable();
    this.ValidationText = ko.observable(validationtext);
    this.answerId = ko.observable(answerid);
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
        ok = self.value() != null && self.value() == self.ValidationText();
        self.questionOK(ok);
        return ok;
    };
};
