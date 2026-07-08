'use strict';

var NumFormatLocale = new Intl.NumberFormat("es-ES");

var Master = new MasterDataModel(ApplicantTypeEnum.JURIDICA, 0, 0);

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
    this.MobileData = Utils.GetMobileAppData();
    var isBstapp = this.MobileData.AppVersion && (this.MobileData.AppVersion.indexOf("bstapp") != -1 || this.MobileData.AppVersion.indexOf("bestinver") != -1);
    this.name = _name;
    this.url = _url;
    if (isBstapp) {
        this.linkhtml = "<a href='" + _url + "#bstapp' title='Ver documento' class='link brown darken pdf'><span>Ver documento</span></a>";
    }
    else {
        this.linkhtml = "<a href='" + _url + "' title='Ver documento' class='link brown darken iframeLightbox pdf'><span>Ver documento</span></a>";
    }


    this.EventPdf = function () {
        GMT.PushEventNoPageName('descarga pdf', self.name);
        if (isBstapp) {
            window.location.href = _url + '#bstapp'
        }
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
    this.ProductOperationModel = ko.observableArray();
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
        validation: {
            validator: function (val) {
                var doValidation = false;

                if (self.validateNow() && self.IsMobilePhoneOk() == 'false')
                    doValidation = true;

                if (doValidation) {
                    var patt = /^([0-9])\1+$/;
                    var result = patt.test(val);
                    return !result;
                }

                return true;
            },
            message: 'Formato no válido para el teléfono móvil'
        }
    });
    this.ApplicantName = ko.observable(name);
    this.ApplicantDni = ko.observable(dni);
    this.RequestApplicantType = ko.observable(type);
    this.OldMobile = '';
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
            MobilePhone: self.MobilePhone() != null ? self.MobilePhonePrefix() + self.MobilePhone() : "",
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
                return self.validateNow() && self.IdDocumentSignatureType() == 2;
            }
        }
    });
    this.ApplicantPhones = ko.observableArray([]);
    this.ManualAssisted = ko.observable(false);
    this.IsOtherProductFCR = ko.observable(false);
    this.errors = ko.validation.group(this);

    self.IdDocumentSignatureType.subscribe(function (newValue) {
        if (newValue == 1) {
            self.IdSendingWay(5);
        } else {
            self.IdSendingWay(null);
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
            if (self.IdDocumentSignatureType() == 2) {
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
        }
    };
};

var DocumentsData = function () {
    var self = this;

    this.validateNow = ko.observable(false);
    this.IdSendingWay = ko.observable().extend({
        required: {
            message: "Por favor indique un modo de envío",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.RequestId = ko.observable();
    this.ScanDni = ko.observable(false).extend({
        required: {
            message: "Por favor seleccione una opcion de envío",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.Dni = ko.observable();
    this.MzdData = ko.observable();
    this.ListaOtherApplicants = ko.observable();
    this.IsReversoDni = ko.observable(false);
    this.FileName = ko.observable('');
    this.CIFSociedad = ko.observable().extend({
        required: {
            message: "Por favor adjunte el CIF de la sociedad " + supportedFormat,
            onlyIf: function () {
                return self.validateNow() && self.IdSendingWay() == 1 && !self.IsUploading();
            }
        }
    });
    this.EscriturasCertificado = ko.observable().extend({
        required: {
            message: "Por favor adjunte las escrituras de constitución o certificado de titularidad real " + supportedLargeFormat,
            onlyIf: function () {
                return self.validateNow() && self.IdSendingWay() == 1 && !self.IsUploading();
            }
        }
    });
    this.PoderesApoderados = ko.observable().extend({
        required: {
            message: "Por favor adjunte una copia de los poderes de los apoderados " + supportedFormat,
            onlyIf: function () {
                return self.validateNow() && self.IdSendingWay() == 1 && !self.IsUploading();
            }
        }
    });
    this.DNIsPersonasFisicas = ko.observableArray().extend({
        required: {
            message: "Por favor adjunte una copia de los DNI de las personas físicas " + supportedFormat,
            onlyIf: function () {
                return self.validateNow() && self.IdSendingWay() == 1 && !self.IsUploading();
            }
        }
    });

    this.DNIsPersonasFisicasLength = function (dni) {
        var msg = "";
        if (self.validateNow() && self.IdSendingWay() == 1 && !self.IsUploading()) {
            if (self.DNIsPersonasFisicas().length > 0) {
                if (ko.utils.arrayIndexOf(self.DNIsPersonasFisicas(), dni) < 0) {
                    msg = "Por favor adjunte una copia del DNI (" + dni + ")" + supportedFormat;
                }
            }
            else {
                msg = "Por favor adjunte una copia del DNI (" + dni + ")" + supportedFormat;
            }
            if (msg != "") {
                if (ko.utils.arrayIndexOf(self.errors(), msg) < 0) {
                    self.errors().push(msg);
                }
            }
            return msg;
        }
        return msg;
    };

    this.DNIsPersonasFisicasNumeros = ko.observable();

    this.errors = ko.validation.group(this);

    this.IsUploading = ko.observable(false);

    this.IsValid = function () {
        self.validateNow(true);
        if (self.errors().length === 0) {
            self.validateNow(false);
            return true;
        } else {
            self.errors.showAllMessages();
            window.scrollError();
            return false;
        }
    };

    this.ViewModelToJSON = ko.pureComputed(function () {
        var data = {
            RequestId: self.RequestId(),
            DNI: self.Dni(),
            MzdData: self.MzdData(),
            IdSendingWay: self.IdSendingWay(),
            CIFSociedad: self.CIFSociedad(),
            EscriturasCertificado: self.EscriturasCertificado(),
            PoderesApoderados: self.PoderesApoderados(),
            DNIsPersonasFisicas: self.DNIsPersonasFisicas(),
            DNIPersonaFisicaNumero: self.DNIsPersonasFisicasNumeros(),
            IsReversoDni: self.IsReversoDni(),
            FileName: self.FileName(),
            AltaJuridica: true
        };
        return data;
    }, this);

    this.CreateDocumentsData = function (scope) {
        scope.CreateDocumentsData();
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
    this.ProductName = ko.pureComputed(function () {
        return self.Product().Name();
    }, this);
    this.AmountTextError = ko.observable();
    this.Amount = ko.observable('').extend({
        validation: {
            validator: function (val) {
                var doValidation = false;

                if (self.validateNow() && self.IdOperationType() == 1)
                    doValidation = true;

                if (self.validateNow() && (self.IdOperationType() == 2 || self.IdOperationType() == 4) && Utils.IsNullOrzeroDecimal(self.MonthlyAmount()))  //(isNaN(self.MonthlyAmount()) || self.MonthlyAmount() == 0)
                    doValidation = true;

                if (doValidation) {
                    return Utils.IsDecimalValidHigherThan(val, 0);
                }

                return true;
            },
            message: 'Por favor indique el importe'
        },

        AmountRange: ko.computed(function () {
            return {
                params: {
                    min: self.MinAmount(),
                    max: self.MaxAmount(),
                    validate: (
                        (self.validateNow() && (self.IdOperationType() == 2 || self.IdOperationType() == 1 || self.IdOperationType() == 4) && Utils.IsDecimalValidHigherThan(self.Amount(), 0))
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
                return self.validateNow() && (self.IdOperationType() == 2) || (self.IdOperationType() == 1);
            }
        }
    });
    this.FondoType = ko.observable('true').extend({
        required: {
            message: "Por favor indique un tipo de fondo",
            onlyIf: function () {
                return self.validateNow() && self.IdOperationType() == 3 && self.Product().ProductTypeId() != 1;
            }
        }
    });
    this.PlanName = ko.observable().extend({
        validation: {
            validator: function (val) {
                var doValidation = self.validateNow() && self.IdOperationType() == 3 && (self.Product().ProductTypeId() == 1 || self.Product().ProductTypeId() == 4);

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
                return self.validateNow() && self.IdOperationType() == 3 && (self.Product().ProductTypeId() == 1);
            }
        }
    });
    this.FondoName = ko.observable().extend({
        validation: {
            validator: function (val) {
                var doValidation = self.validateNow() && self.IdOperationType() == 3 && (self.Product().ProductTypeId() == 2 || self.Product().ProductTypeId() == 3) && self.FondoType() == 'true';

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
                return self.validateNow() && self.IdOperationType() == 3 && (self.Product().ProductTypeId() == 2 || self.Product().ProductTypeId() == 3);
            }
        }
    });
    this.FondoISIN = ko.observable().extend({
        required: {
            message: "Por favor indique el ISIN",
            onlyIf: function () {
                return self.validateNow() && self.IdOperationType() == 3 && (self.Product().ProductTypeId() == 2 || self.Product().ProductTypeId() == 3);
            }
        },
        ISIN: {
            message: "El ISIN no es válido",
            onlyIf: function () {
                return self.validateNow() && self.IdOperationType() == 3 && (self.Product().ProductTypeId() == 2 || self.Product().ProductTypeId() == 3);
            }
        }
    });
    this.ManagerCode = ko.observable().extend({
        required: {
            message: 'Por favor indique la comercializadora',
            onlyIf: function () {
                return self.validateNow() && self.IdOperationType() == 3 && (self.Product().ProductTypeId() == 2 || self.Product().ProductTypeId() == 3)
                    && self.FondoType() == 'false';
            }
        }
    });
    this.ManagerName = ko.observable().extend({
        validation: {
            validator: function (val) {
                var doValidation = self.validateNow() && self.IdOperationType() == 3 && (self.Product().ProductTypeId() == 2 || self.Product().ProductTypeId() == 3) && self.FondoType() == 'false';

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
                    validate: (self.validateNow() && (self.IdOperationType() == 2 || self.IdOperationType() == 4) && Utils.IsDecimalValidHigherThan(self.MonthlyAmount(), 0)),
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
                return self.validateNow() && (self.IdOperationType() == 2 || self.IdOperationType() == 4) && Utils.IsDecimalValidHigherThan(self.MonthlyAmount(), 0); //!isNaN(self.MonthlyAmount()) && self.MonthlyAmount() > 0
            }
        },
        IBAN: {
            message: "El IBAN no es válido",
            onlyIf: function () {
                return self.validateNow() && (self.IdOperationType() == 2 || self.IdOperationType() == 4) && Utils.IsDecimalValidHigherThan(self.MonthlyAmount(), 0); //!isNaN(self.MonthlyAmount()) && self.MonthlyAmount() > 0
            }
        }
    });
    this.TotalAmount = ko.observable().extend({
        validation: {
            validator: function (val) {
                var doValidation = false;

                if (self.validateNow() && (self.IdOperationType() == 2 || self.IdOperationType() == 4) && Utils.IsDecimalValidHigherThan(self.MonthlyAmount(), 0) && Utils.IsDecimalValidHigherThan(self.Amount(), 0))
                    doValidation = true;

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
        validation: {
            validator: function (val) {
                var doValidation = false;

                if (self.validateNow() && self.IdOperationType() == 3 && self.selectedTransferType().id == 3)
                    doValidation = true;

                if (doValidation) {
                    return Utils.IsDecimalValidHigherThan(val, 0);
                }

                return true;
            },
            message: 'Por favor indique el número de participaciones'
        }
    });
    this.TransferAmount = ko.observable().extend({
        validation: {
            validator: function (val) {
                var doValidation = false;

                if (self.validateNow() && self.IdOperationType() == 3 && self.selectedTransferType().id == 2)
                    doValidation = true;

                if (doValidation) {
                    return Utils.IsDecimalValidHigherThan(val, 0);
                }

                return true;
            },
            message: 'Por favor indique el importe'
        },

        AmountRange: ko.computed(function () {
            return {
                params: {
                    min: self.MinAmount(),
                    max: 0,
                    validate: (
                        self.validateNow() && self.IdOperationType() == 3 && self.selectedTransferType().id == 2
                    ),
                    includeMin: self.MinAmount() > 0,
                    includeMax: false
                }
            };
        })
    });
    this.PayerName = ko.observable();
    this.DisableSuscribe = ko.observable(false);

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
        self.InitializeOperation();
    });

    self.Amount.subscribe(function (newValue) {
        if (self.Product().ProductTypeId() == 1) {
            if (!Utils.IsDecimalValid(newValue)) {
                self.MinMonthlyAmount(100);
            } else {
                if (Utils.IsDecimalValidHigherThan(newValue, 0)) {
                    self.MinMonthlyAmount(50);
                } else {
                    self.MinMonthlyAmount(100);
                }
            }
        }
    });

    self.MonthlyAmount.subscribe(function (newValue) {
        if (self.Product().ProductTypeId() == 1) {
            if (!Utils.IsDecimalValid(newValue)) {
                self.MinMonthlyAmount(100);
            } else {
                if (Utils.IsDecimalValidHigherThan(newValue, 0)) {
                    self.MinMonthlyAmount(50);
                } else {
                    self.MinMonthlyAmount(100);
                }
            }
        }
    });

    self.FondoName.subscribe(function (newvalue) {
        //Comprobar que el nombre que ha introducido corresponde con el código
        var previousname = $('#contracttype-externaltransfer-fundname-previous').val();
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
            self.TransferAmount('');
            self.PayerName('');
        }
    };

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
            AmountRangeText += 'Importe mínimo sólo domiciliación: 100€. Importe mínimo domiciliación con además aportación: 50€. ';
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
        self.ClearCodes();
        self.SetAmountValidValues(false, scope.MainApplicant().ApplicantBasicData().RequestApplicantType() == 10);
        self.validateNow(true);
        if (self.errors().length === 0) {
            self.ChangeOperationType();
            return true;
        } else {
            self.errors.showAllMessages();
            window.scrollError();
            return false;
        }
    };

    this.ChangeOperationType = function () {
        self.DisableSuscribe(true);
        switch (self.IdOperationType()) {
            case '2':
                if (Utils.IsDecimalValidHigherThan(self.MonthlyAmount(), 0)) {
                    self.IdOperationType('4');
                }
                break;
            case '3':
                break;

            case '4':
                if (!Utils.IsDecimalValid(self.MonthlyAmount())) {
                    self.IdOperationType('2');
                }
                break;
        }
        self.DisableSuscribe(false);
    };

    this.ViewModelToJSON = ko.pureComputed(function () {
        var _amount;

        switch (self.IdOperationType()) {
            case '1':
            case '2':
                _amount = self.Amount() == null ? '' : self.Amount().toString().replaceAll('.', '');
                break;
            case '3':
                self.IdWayToPay(null);
                switch (self.selectedTransferType().id) {
                    case 2:
                        _amount = self.TransferAmount() == null ? '' : self.TransferAmount().toString().replaceAll('.', '');
                        break;
                    case 3:
                        _amount = self.TransferPartNumAmount() == null ? '' : self.TransferPartNumAmount().toString().replaceAll('.', '');
                        break;
                }
                break;
            case '4':
                self.IdWayToPay(null);
                break;
        }

        var data = {
            IdOperationType: self.IdOperationType(),
            Amount: _amount,
            IdWayToPay: self.IdOperationType() == '3' || self.IdOperationType() == '4' ? null : self.IdWayToPay(),
            FondoType: self.FondoType(),
            FondoName: self.FondoName(),
            FondoCode: self.FondoCode(),
            FondoISIN: self.FondoISIN(),
            ManagerCode: self.ManagerCode(),
            ManagerName: self.ManagerName(),
            PlanName: self.PlanName(),
            PlanCode: self.PlanCode(),
            IdTransferType: self.selectedTransferType().id,
            IdProduct: self.Product().Id(),
            ParticipantAccount: self.ParticipantAccount(),
            Before2007: self.Before2007(),
            After2007: self.After2007(),
            MonthlyAmount: self.MonthlyAmount() == null ? '' : self.MonthlyAmount().toString().replaceAll('.', ''),
            IBAN: self.IBAN(),
            PayerName: self.PayerName(),
            IsEmployee: self.IsEmployee()
        };
        return data;
    }, this);

    this.OperationTypeName = ko.pureComputed(function () {
        var type;
        switch (self.IdOperationType()) {
            case "1":
                type = "Suscripción";
                break;
            case "2":
                type = "Aportación";
                break;
            case "3":
                type = "Traspaso";
                break;
            case "4":
                type = "Recibo";
                break;
        }
        return type;
    }, this);

    this.TransferTypeName = ko.pureComputed(function () {
        var type;
        switch (self.IdWayToPay()) {
            case "1":
                type = "Transferencia";
                break;
            case "2":
                type = "Cheque";
                break;
        }
        return type;
    }, this);

    this.AmountToString = ko.pureComputed(function () {
        var _amount = '';

        if (self.IdOperationType() == 1 || self.IdOperationType() == 2) {
            _amount = self.TransferTypeName();
            if (Utils.IsDecimalValidHigherThan(self.Amount(), 0)) {
                _amount = _amount + '/' + self.Amount() + '€';
            }
        }

        if (self.IdOperationType() == 3 && self.selectedTransferType().id == 1) {
            _amount = 'Traspaso Total';
        }

        if (self.IdOperationType() == 3 && self.selectedTransferType().id == 2) {
            _amount = 'Traspaso Parcial' + '/' + self.TransferAmount() + '€';
        }

        if (self.IdOperationType() == 3 && self.selectedTransferType().id == 3) {
            _amount = 'Traspaso Parcial por participaciones' + '/' + self.TransferPartNumAmount();
        }

        if (self.IdOperationType() == 4) {
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

var BasicData = function (_assisted) {
    var self = this;
    this.validateNow = ko.observable(false);
    this.ApplicantType = ko.observable();

    this.Name = ko.observable().extend({
        required: {
            message: function () {
                return self.ApplicantType() == 2 ? "Por favor indique su denominación social" : "Por favor indique su nombre"
            },
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
            params: /^[0-9a-zA-ZäëïöüÄËÏÖÜñÑáéíóúÁÉÍÓÚäëïöüàª '.,¡!&´çÇ-]+$/,
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
                return self.validateNow() && self.ApplicantType() == 1;
            }
        },
        CIF: {
            message: "El CIF no es válido",
            onlyIf: function () {
                return self.validateNow() && self.ApplicantType() == 2;
            }
        }
    });
    this.PhoneNumber = ko.observable().extend({
        pattern: {
            message: "Formato no válido para el teléfono fijo",
            params: /^[8|9]{1}([\d]{2}[-]*){3}[\d]{2}$/,
            onlyIf: function () {
                return self.validateNow() && self.PhoneNumberPrefix().indexOf("+34") >= 0;
            }
        },
        validation: {
            validator: function (val) {
                var doValidation = false;

                if (self.validateNow())
                    doValidation = true;

                if (doValidation) {
                    var patt = /^([0-9])\1+$/;
                    var result = patt.test(val);
                    return !result;
                }

                return true;
            },
            message: 'Formato no válido para el teléfono'
        }
    });
    this.PhoneNumberPrefix = ko.observable("+34").extend({
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
    this.Email = ko.observable().extend({
        required: {
            message: "Por favor indique su email",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        email: {
            message: "Formato no válido para el email",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });

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
        required: {
            message: "Por favor indique el teléfono móvil",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        pattern: {
            message: "Formato no válido para el teléfono móvil",
            params: /^[6|7]{1}([\d]{2}[-]*){3}[\d]{2}$/,
            onlyIf: function () {
                return self.validateNow() && self.MobilePhonePrefix().indexOf("+34") >= 0;
            }
        },
        validation: {
            validator: function (val) {
                var doValidation = false;

                if (self.validateNow())
                    doValidation = true;

                if (doValidation) {
                    var patt = /^([0-9])\1+$/;
                    var result = patt.test(val);
                    return !result;
                }

                return true;
            },
            message: 'Formato no válido para el teléfono móvil'
        }
    });
    this.Fax = ko.observable().extend({
        pattern: {
            message: "Formato no válido para el número de fax",
            params: /^[\d]{9}$/,
            onlyIf: function () {
                return self.validateNow() && self.FaxPrefix().indexOf("+34") >= 0;
            }
        }
    });
    this.FaxPrefix = ko.observable("+34").extend({
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
    this.Legal = ko.observable();

    this.IDDocumentType = ko.observable();
    this.RequestId = ko.observable();
    this.Product = ko.observable();
    this.ProductTypeId = ko.observable();
    this.InformationRight = ko.observable('true').extend({
        required: {
            message: "Por favor indique si desea recibir información",
            onlyIf: function () {
                return self.validateNow() && (self.ProductTypeId() == 1 || self.ProductTypeId() == 4) && self.RequestApplicantType() == 1;
            }
        }
    });
    this.SignatureType = ko.observable();
    this.Minor = ko.observable(false);
    this.Assisted = ko.observable(_assisted);
    this.SpecialRequestApplicantType = ko.observable();
    this.SpecialRequestApplicantTypeEnabled = ko.observable(true);
    this.SalesChannel = ko.observable().extend({
        required: {
            message: "Por favor seleccione un canal",
            onlyIf: function () {
                return self.validateNow() && self.Assisted() && self.RequestApplicantType() == 1;
            }
        }
    });

    self.SpecialRequestApplicantType.subscribe(function (newValue) {
        if (newValue != undefined) {
            self.RequestApplicantType(newValue.id);
        } else {
            self.RequestApplicantType(1);
        }
    });

    self.DNI.subscribe(function (newValue) {
        self.DNI(Utils.ProcessDNI(newValue));
    });

    this.RequestApplicantType = ko.observable();

    this.FirstSurname = ko.observable().extend({
        required: {
            message: "Por favor indique su primer apellido",
            onlyIf: function () {
                return self.validateNow() && self.ApplicantType() == 1;
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
    this.EmailCrii = ko.observable().extend({
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

    this.FullName = ko.pureComputed(function () {
        if (self.ApplicantType() == ApplicantTypeEnum.FISICA)
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
            Name: self.Name(),
            DNI: self.DNI(),
            PhoneNumber: self.PhoneNumber() != null ? self.PhoneNumberPrefix() + self.PhoneNumber() : "",
            Email: self.Email(),
            MobilePhoneNumber: self.MobilePhoneNumber() != null ? self.MobilePhonePrefix() + self.MobilePhoneNumber() : "",
            Fax: self.Fax() != null ? self.FaxPrefix() + self.Fax() : "",
            Legal: self.Legal(),
            IDDocumentType: self.IDDocumentType() === 'PAS' ? 'PAS' : ((self.ApplicantType() == 1) ? Utils.GetDocumentType(self.DNI(), 1) : 'CIF'),
            FirstSurname: self.FirstSurname(),
            SecondSurname: self.SecondSurname(),
            ApplicantType: self.ApplicantType(),
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
            window.scrollError();
        }
    };
};

var PersonalData = function () {
    var self = this;
    this.validateNow = ko.observable(false);

    this.RequestApplicantType = ko.observable();

    this.Birthday = ko.observable(new CustomDate()).extend({
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
        validation: {
            validator: function (val) {
                var doValidation = false;

                if (self.validateNow() && (self.RequestApplicantType() == RequestApplicantTypeEnum.AUTORIZADO || self.RequestApplicantType() == RequestApplicantTypeEnum.BENEFICIARIO || self.RequestApplicantType() == RequestApplicantTypeEnum.TUTOR || self.RequestApplicantType() == RequestApplicantTypeEnum.APODERADO))
                    doValidation = true;

                if (doValidation) {
                    return (self.Birthday().getAge() >= 18);
                }

                return true;
            },
            message: 'La persona debe ser mayor de edad'
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
            params: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\sçÇ]+$/,
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.IsResident = ko.observable('true').extend({
        required: {
            message: "Por favor indique si es residente",
            onlyIf: function () {
                return self.validateNow();
            }
        }
    });
    this.IDDocumentIsPermanent = ko.observable();
    this.IDDocumentExpirationDate = ko.observable(new CustomDate()).extend({
        RequiredCustomDate: {
            message: "Por favor indique la fecha de expiración del DNI/NIE",
            onlyIf: function () {
                return self.validateNow() && self.ShowDocumentExpirationDate();
            }
        },
        ExpirationCustomDate: {
            message: "El DNI / NIF está caducado o ha indicado una fecha incorrecta",
            onlyIf: function () {
                return self.validateNow() && self.ShowDocumentExpirationDate();
            }
        },
        customdate: {
            message: "El DNI / NIF está caducado o ha indicado una fecha incorrecta",
            onlyIf: function () {
                return self.validateNow() && self.ShowDocumentExpirationDate();
            }
        }
    });
    this.PhoneNumberPrefix = ko.observable("+34").extend({
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
        pattern: {
            message: "Formato no válido para el teléfono",
            params: /^[8|9]{1}([\d]{2}[-]*){3}[\d]{2}$/,
            onlyIf: function () {
                return self.validateNow() && self.IsResident() == "true" && self.PhoneNumberPrefix().indexOf("+34") >= 0;
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
    this.SignPermission = ko.observable('true');
    this.CompanyPercentage = ko.observable(0.0);
    this.FiscalCountry = ko.observable();
    this.FiscalNumber = ko.observable();
    this.UsaFiscalNumber = ko.observable();

    self.Birthday().Year.subscribe(function (newValue) {
        if (self.Birthday().getAge() < 65) {
            self.IDDocumentIsPermanent(false);
        }
    });

    this.ShowPermanentValidity = ko.computed(function () {
        var age = self.Birthday().getAge();
        return age >= 65
    }, this);

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

    this.ViewModelToJSON = ko.pureComputed(function () {
        var data = {
            Birthday: self.Birthday().DateIsNull() ? null : self.Birthday().parseString(),
            Gender: self.Gender() == null ? "1" : self.Gender().id,
            Nacionality: self.Nationality() == null ? null : self.Nationality().id,
            Country: self.Country() == null ? null : self.Country().id,
            BornPlace: self.BornPlace(),
            IsResident: self.IsResident(),
            IDDocumentExpirationDate: self.IDDocumentExpirationDate().DateIsNull() ? null : self.IDDocumentExpirationDate().parseString(),
            IDDocumentIsPermanent: self.IDDocumentIsPermanent(),
            PhoneNumber: self.PhoneNumber() != null ? self.PhoneNumberPrefix() + self.PhoneNumber() : "",
            CompanyPercentage: self.CompanyPercentage(),
            FiscalCountry: self.FiscalCountry() != undefined ? self.FiscalCountry().id : null,
            FiscalNumber: self.FiscalNumber(),
            UsaFiscalNumber: self.UsaFiscalNumber()
        };
        return data;
    }, this);

    this.ShowDocumentExpirationDate = ko.pureComputed(function () {
        return (self.IDDocumentIsPermanent() == false) || (self.IDDocumentIsPermanent() == null);
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
        }
    };
};

var ContactData = function () {
    var self = this;

    this.PostalAddress = ko.observable(new Address("PostalAddress"));
    this.FiscalAddress = ko.observable(new Address("FiscalAddress"));
    this.ShowPostalAddress = ko.observable(false);

    this.CreateContactData = function (scope) {
        var ok = self.FiscalAddress().IsValidAddress();

        if (self.ShowPostalAddress()) {
            ok = self.PostalAddress().IsValidAddress() && ok;
        }
        else {
            var address = Utils.CloneAddress(self.FiscalAddress());
            address.AddressTypeId('PostalAddress');
            self.PostalAddress(address);
        }

        if (ok) {
            var raType = scope.MainApplicant().ApplicantBasicData().RequestApplicantType();
            if (raType == 8 || raType == 9) {
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
            PostalCode: Utils.Paddy(self.FiscalAddress().PostalCode(), 5),
            City: self.FiscalAddress().City(),
            Province: self.FiscalAddress().Province(),
            IdCountry: self.FiscalAddress().CountryId(),
            CountryType: 3,
            AddressType: "FiscalAddress",
            Stairs: self.FiscalAddress().Stairs(),
            AddressExtension: self.FiscalAddress().AddressExtension()
        };

        data = [fiscaldata];

        return data;
    }, this);

    this.GetFiscalAddressInString = ko.pureComputed(function () {
        var countryname = MasterData.getCountryNameById(self.FiscalAddress().CountryId());
        var result = MasterData.getViaTypeNameById(self.FiscalAddress().ViaType()) + ' ' + self.FiscalAddress().Street();
        if (self.FiscalAddress().StreetNumber())
            result += ' ' + self.FiscalAddress().StreetNumber() + ',';
        if (self.FiscalAddress().Floor())
            result += ' ' + self.FiscalAddress().Floor() + ',';
        if (self.FiscalAddress().Door())
            result += ' ' + self.FiscalAddress().Door() + ',';

        result += ' ' + Utils.Paddy(self.FiscalAddress().PostalCode(), 5) + ' ' + self.FiscalAddress().City() + ' ' + self.FiscalAddress().Province() + ' ' + countryname;

        return result;
    }, this);

    this.ViewModelToJSON = ko.pureComputed(function () {
        var data = [];

        var postaldata = {
            Viatype: self.PostalAddress().ViaType(),
            Name: self.PostalAddress().Street(),
            Number: self.PostalAddress().StreetNumber(),
            Floor: self.PostalAddress().Floor(),
            Door: self.PostalAddress().Door(),
            PostalCode: Utils.Paddy(self.PostalAddress().PostalCode(), 5),
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
            PostalCode: Utils.Paddy(self.FiscalAddress().PostalCode(), 5),
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
            message: "Por favor indique el tipo de vía"
        }
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

var Applicant = function (ProductInit, assisted) {
    var self = this;

    this.validateNow = ko.observable(false);

    this.Product = ko.observable(ProductInit);
    this.Id = ko.observable();
    this.IsDifferentAddress = ko.observable(false);
    this.IsSameAddress = ko.observable(false);
    this.ApplicantBasicData = ko.observable(new BasicData(assisted));
    this.ApplicantPersonalData = ko.observable(new PersonalData());
    this.ApplicantContactData = ko.observable(new ContactData());
    this.ApplicantOperationData = ko.observable(new OperationData(self.Product()));
    this.ApplicantRefundAccountNumberData = ko.observable(new RefundAccountNumberData());
    this.Test = ko.observableArray();
    this.PdfDocumentData = ko.observable(new PdfDocumentData());
    this.Assisted = ko.observable(assisted);

    this.IsOlderThan18 = ko.computed(function () {
        return self.ApplicantPersonalData().Birthday().getAge() >= 18;
    }, this);

    this.errors = ko.validation.group(this);

    this.KnowledgeTest = ko.observable();
    this.ConvenienceTest = ko.observable();

    this.ConvenienceFirstTest = ko.observable();
    this.ConvenienceSecondTest = ko.observable();
    this.ConvenienceTestList = ko.observableArray();

    this.IsValid = function (validateAddress) {
        var BasicDataOk = self.ApplicantBasicData().IsValid(!self.IsOlderThan18());
        var PersonalDataOk = self.ApplicantPersonalData().IsValid(self.ApplicantBasicData().RequestApplicantType());
        var ContactDataOk = validateAddress ? self.ApplicantContactData().FiscalAddress().IsValidAddress() : true;
        return BasicDataOk && PersonalDataOk && ContactDataOk;
    };
    this.ApplicantType = ko.computed(function () {
        var type;
        switch (self.ApplicantBasicData().RequestApplicantType()) {
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
        }
        return type;
    }, this);

    this.ValidateQuestion = function (_TestType) {
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

    this.GetApplicantTestAnswers = function () {
        var values = [];

        if (self.ApplicantHasTest(1)) {
            values = values.concat(self.KnowledgeTest().getQuestionsAnswer(true));
        }

        if (self.ApplicantHasTest(1)) {
            self.ConvenienceTestList().forEach(function (test) {
                if (!test.SkipTest())
                    values = values.concat(test.getQuestionsAnswer(true));
            });
        }



        return values;
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

    this.getApplicantDataForSaveRequest = function () {
        var applicantRequestData = {
            "BasicData": self.ApplicantBasicData().ViewModelToJSON(),

            "PersonalData": self.ApplicantPersonalData().ViewModelToJSON(),

            "ContactData": self.ApplicantBasicData().RequestApplicantType() == 1 ? self.ApplicantContactData().ViewModelToJSON() : self.ApplicantContactData().GetFiscalAddressToJSON(),

            "Answers": self.GetApplicantTestAnswers()
        };
        return applicantRequestData;
    };

    this.AllowTestEdit = ko.computed(function () {
        var ok = false;
        return ok;
    }, this);

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
            validation: {
                validator: function (val) {
                    var _valid = true;
                    if (self.validateNow()) {
                        if (val == false) {
                            _valid = false

                            if (self.IsExcluded())
                                _valid = true;
                        }
                    }

                    return _valid;
                },
                message: self.ErrorMessage()
            }
        });
    this.ToolTip = ko.observable(_ToolTip);
    this.TypeOwners = ko.computed(function () { return self.IdQuestion() == 10 || self.IdQuestion() == 12; }, this);
    this.TypeAdmins = ko.computed(function () { return self.IdQuestion() == 11 || self.IdQuestion() == 13; }, this);
    this.Owners = ko.observableArray(new Array());
    this.IsAddingOwner = ko.observable(false);
    this.BeginAddOwner = function (scope, question) {
        self.OwnerToAdd(new Owner(self.Owners().length, "", "", "", "", "", "", "", self.TypeOwners(), self.Owners(), scope.listaOtherApplicants(), scope.CurrentEditApplicant().ApplicantBasicData().Assisted()));
        ko.utils.arrayForEach(self.CurrentTest(), function (question, index) {
            question.IsAddingOwner(false);
        });
        self.IsAddingOwner(true);
        window.scrollWindow('ownerToAdd-' + self.IdQuestion());
    };
    this.CancelAddOwner = function () {
        self.IsAddingOwner(false);
        window.scrollWindow('question-' + self.IdQuestion());
    };
    this.AddOwner = function () {
        if (!self.OwnerToAdd().IsOk()) {
            return;
        }
        var newOwner = new Owner(self.OwnerToAdd().Id(),
            self.OwnerToAdd().Name(),
            self.OwnerToAdd().FirstSurname(),
            self.OwnerToAdd().SecondSurname(),
            self.OwnerToAdd().DNI(),
            self.OwnerToAdd().MobilePhone(),
            self.OwnerToAdd().Email(),
            self.OwnerToAdd().Percentage(),
            self.TypeOwners());
        newOwner.MobilePhonePrefix(self.OwnerToAdd().MobilePhonePrefix());
        newOwner.Birthday(self.OwnerToAdd().Birthday());
        newOwner.Country(self.OwnerToAdd().Country());
        newOwner.Nationality(self.OwnerToAdd().Nationality());
        newOwner.BornPlace(self.OwnerToAdd().BornPlace());
        newOwner.IDDocumentIsPermanent(self.OwnerToAdd().IDDocumentIsPermanent());
        newOwner.IDDocumentExpirationDate(self.OwnerToAdd().IDDocumentExpirationDate());
        self.Owners().push(newOwner);
        self.Owners.valueHasMutated();
        self.IsAddingOwner(false);

        window.scrollWindow('question-' + self.IdQuestion());
        //Se rellena como respuesta "Otros" para trazar información en servidor
        var answerOther = ko.utils.arrayFirst(self.Answers(), function (a) { return a.IdAnswer() == IdAnswerTypeEnum.OTROS; });
        if (self.HasOwners() && (answerOther == null || !answerOther.Checked())) {
            if (answerOther == null) {
                answerOther = new Answer("", IdAnswerTypeEnum.OTROS, self.IdQuestion(), "", "", "", "");
                self.Answers().push(answerOther);
            }
            answerOther.Checked(true);
        }
    };
    this.RemoveOwner = function (owner) {
        self.Owners.remove(owner);
        if (!self.HasOwners()) {
            var answerOther = ko.utils.arrayFirst(self.Answers(), function (a) { return a.IdAnswer() == IdAnswerTypeEnum.OTROS; });
            if (answerOther == null)
                self.Answers([]);
            else
                answerOther.Checked(false);
        }
    };
    this.OwnerToAdd = ko.observable(new Owner("", "", "", "", "", "", "", ""));
    this.CanAddOwner = ko.computed(function () {
        var totalPercentage = 0;
        ko.utils.arrayForEach(self.Owners(), function (o, index) { totalPercentage += parseInt(o.Percentage() == "" ? 0 : o.Percentage()); });
        return (self.Owners().length < 4 && totalPercentage <= 75); //El porcentaje total máximo para permitir añdir son 75 puesto que el mínimo a introducir son 25
    }, this);
    this.HasOwners = ko.computed(function () {
        return (self.Owners().length > 0);
    }, this);
    this.QuestionsToExclude = ko.computed(function () {
        //TODO: Llevar lógica de tipos a BBDD ¿¿??
        var questionsToExclude = [];
        if (self.IdQuestion() == 10)
            questionsToExclude = [11, 12, 13];
        if (self.IdQuestion() == 11)
            questionsToExclude = [10, 12, 13];
        if (self.IdQuestion() == 12)
            questionsToExclude = [10, 11, 13];
        if (self.IdQuestion() == 13)
            questionsToExclude = [10, 11, 12];
        return questionsToExclude;
    }, this);
    this.CurrentTest = ko.observableArray([]);
    this.IsExcluded = ko.computed(function () {
        var isExcluded = false;
        ko.utils.arrayForEach(self.CurrentTest(), function (question, index) {
            if (self.QuestionsToExclude().indexOf(question.IdQuestion()) != -1) {
                if (question.HasOwners())
                    isExcluded = true;
            }
        });
        return isExcluded;
    }, this);
    this.IsVisibleSociedadONG = ko.computed(function () {
        if (self.ApplicantType() != ApplicantTypeEnum.JURIDICA || (self.IdQuestion() != 10 && self.IdQuestion() != 11 && self.IdQuestion() != 12 && self.IdQuestion() != 13))
            return true;
        if ((!self.TypeOwners() && !self.TypeAdmins()) || !self.CurrentTest()[0]) return false;
        if (self.CurrentTest()[0].SelectedAnswer() != null && self.CurrentTest()[0].SelectedAnswer() != 0) {
            if ((self.IdQuestion() == 10 || self.IdQuestion() == 11) && self.CurrentTest()[0].SelectedAnswer().IdAnswer() == IdAnswerTypeEnum.SOCIEDAD_COMUNIDAD)
                return true;
            if ((self.IdQuestion() == 12 || self.IdQuestion() == 13) && self.CurrentTest()[0].SelectedAnswer().IdAnswer() == IdAnswerTypeEnum.FUNDACION_ONG_RELIGIOSA)
                return true;
        }
        else return true;
        return false;
    }, this);
    this.errors = ko.validation.group(this);

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

var PersonAnswer = function (_Name, _Email, _DNI, _Percent, _MobilePhoneNumber) {
    this.Name = ko.observable(_Name);
    this.DNI = ko.observable(_DNI);
    this.Email = ko.observable(_Email);
    this.Percent = ko.observable(_Percent);
    this.MobilePhoneNumber = ko.observable(_MobilePhoneNumber);

    this.AnswerFilled = function () {
        return (this.Name() != '' || this.DNI() != '' || this.Email() != '' || this.Name() != '' || this.MobilePhoneNumber() != '');
    };
};

var ProductData = function (ProductTypes) {
    var self = this;
    this.ProductType = ko.observable();
    this.Product = ko.observable();
    this.ProductTypeList = ko.observableArray(ProductTypes);

    this.ProductType.subscribe(function (newValue) {
        if (newValue == ProductTypeEnum.ASESORAMIENTOS.toString()) {
            self.Product(ProductEnum.ASESORAMIENTO.toString());
        }
    });
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
        if (self.ProductTypeId() == 1 || self.ProductTypeId() == 4)
            return header + "plan de pensiones " + self.Name();

        if (self.ProductTypeId() == 2 || self.ProductTypeId() == 3)
            return header + "fondo " + self.Name();
    }, this);

    this.ProductExtendedName = ko.computed(function () {
        if (self.ProductTypeId() == 1 || self.ProductTypeId() == 4)
            return "Plan de pensiones " + self.Name();

        if (self.ProductTypeId() == 2 || self.ProductTypeId() == 3)
            return "Fondo " + self.Name();
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
                        desc = "Puedes realizar tu inversión a través de una suscripción mediante  una transferencia bancaria.";
                    } else {
                        desc = "Puedes realizar tu inversión a través de una suscripción mediante  una transferencia bancaria o a través de un traspaso de posiciones existentes en fondos de inversión  de otras entidades";
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
        AccountNumber: {
            message: "El IBAN no es válido"
        }
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

var Owner = function (_Id, _Name, _FirstSurname, _SecondSurname, _DNI, _Percentage, _PercentageRequired, _OtherOwners, _OtherApplicants, _assisted) {
    var self = this;
    this.validateNow = ko.observable(false);
    this.Assisted = ko.observable(_assisted);
    this.Id = ko.observable(_Id);
    this.OtherOwners = ko.observableArray(_OtherOwners);
    this.OtherApplicants = ko.observableArray(_OtherApplicants);
    this.Name = ko.observable(_Name).extend({
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
    this.BornPlace = ko.observable(_Name).extend({
        required: {
            params: true,
            message: "Por favor indique el lugar de nacimiento",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta();
            }
        }
    });
    this.FirstSurname = ko.observable(_FirstSurname).extend({
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
    this.SecondSurname = ko.observable(_SecondSurname).extend({
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
    this.DNI = ko.observable(_DNI).extend({
        required: {
            params: true,
            message: "Por favor indique el NIF",
            onlyIf: function () {
                return self.validateNow();
            }
        },
        DNI: {
            message: "El documento de identidad no es válido",
            onlyIf: function () {
                return self.validateNow() && self.DocumentType() != undefined && self.DocumentType().id == 'DNI';
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
    this.FiscalAddress = ko.observable(new Address("FiscalAddress"));
    this.ShowAddressInfo = ko.observable(true);
    this.SameTitularAddress = ko.observable(false);
    this.ValidateExta = ko.observable(true);
    this.errors = ko.validation.group(this);

    this.IsOk = function (isActiveCompany) {
        self.ValidateExta(!isActiveCompany);
        var ok = false;
        self.validateNow(true);

        if (self.errors().length === 0) {
            ok = true;
        } else {
            self.errors.showAllMessages();
            window.scrollError();
            ok = false;
        }

        if (isActiveCompany) {
            self.ShowAddressInfo(false);
            self.SameTitularAddress(true);
        } else {
            if (self.ShowAddressInfo() && !self.SameTitularAddress()) {
                self.FiscalAddress().ValidateResident('juridic');
                ok = ok && self.FiscalAddress().IsValidAddress();
            }
        }

        return ok;

    };
    this.Birthday = ko.observable(new CustomDate()).extend({
        RequiredCustomDate: {
            message: "Por favor indique su fecha de nacimiento",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta();
            }
        },
        Birthday: {
            message: "La fecha de nacimiento no es correcta",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta();
            }
        },
        OlderThan: {
            params: {
                age: 18
            },
            message: "La persona debe ser mayor de edad",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta();
            }
        },
        customdate: {
            message: "La fecha de nacimiento no es correcta",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta();
            }
        }
    });
    this.Nationality = ko.observable().extend({
        required: {
            message: "Por favor indique su nacionalidad",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta();
            }
        }
    });
    this.Country = ko.observable().extend({
        required: {
            message: "Por favor indique su país",
            onlyIf: function () {
                return self.validateNow() && self.ValidateExta();
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
                return self.validateNow();
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
                return self.validateNow() && self.ShowDocumentExpirationDate() && self.ValidateExta();
            }
        },
        ExpirationCustomDate: {
            message: "El DNI / NIF está caducado o ha indicado una fecha incorrecta",
            onlyIf: function () {
                return self.validateNow() && self.ShowDocumentExpirationDate() && self.ValidateExta();
            }
        },
        customdate: {
            message: "El DNI / NIF está caducado o ha indicado una fecha incorrecta",
            onlyIf: function () {
                return self.validateNow() && self.ShowDocumentExpirationDate() && self.ValidateExta();
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
            self.DocumentType(MasterData.ApplicantDocumentTypes()[0]);
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

/* Tests */

var KnowledgeTest = function (applicant) {
    var self = this;

    this.companyTypeQuestion = ko.observable(new ComboQuestion(74, [
        new ComboAnswer(242, 'Sociedad o Comunidad de Bienes'),
        new ComboAnswer(243, ' Fundación, ONG, Entidad Religiosa o Asociación')],
        'Debe responder a la pregunta: Indica el tipo de entidad:')
    );
    this.investmentOwnerQuestion = ko.observable(new InvestmentOwnerQuestion());

    this.percentageCountryQuestion = ko.observable(new PercentageCountryQuestion());
    this.ssnQuestion = ko.observable(new SsnQuestion(59));
    this.fatcaCrsQuestion = ko.observable(new FatcaCrsQuestion());
    this.sectorQuestion = ko.observable(new SectorQuestion());
    this.sectorFinantialQuestion = ko.observable(new SectorFinantialQuestion());

    this.realOwnerQuestion = ko.observable(new RealOwnerQuestion());
    this.adminOwnerQuestion = ko.observable(new AdminQuestion());
    this.patronOwnerQuestion = ko.observable(new PatronQuestion());
    this.representationOwnerQuestion = ko.observable(new RepresentativeQuestion());

    this.annualAmountQuestion = ko.observable(new AnnualAmountQuestion());
    this.annualBenefitQuestion = ko.observable(new AnnualBenefitQuestion());
    this.fundsVolumeQuestion = ko.observable(new FundsVolumeQuestion());
    this.activeQuestion = ko.observable(new ActiveQuestion());
    this.employeesQuestion = ko.observable(new EmployeesQuestion());

    this.visibleOwnerSociety = ko.computed(function () {
        return self.companyTypeQuestion().value() != undefined && self.companyTypeQuestion().value().id() == 242;
    }, this);

    this.visibleOwnerFundation = ko.computed(function () {
        return self.companyTypeQuestion().value() != undefined && self.companyTypeQuestion().value().id() == 243;
    }, this);

    this.allowContinue = ko.computed(function () {
        return self.companyTypeQuestion().value() != undefined;
    }, this);

    this.fiscalQuestion = ko.observable(new FiscalResidenceQuestion(applicant.ApplicantContactData().FiscalAddress().CountryId()));
    this.secondResidenceQuestion = ko.observable(new SecondCountryQuestion(applicant.ApplicantContactData().FiscalAddress().CountryId() != 1));
    this.publicQuestion = ko.observable(new PublicPositionQuestion());
    this.ongQuestion = ko.observable(new OngQuestion());
    this.prpQuestion = ko.observable(new PrpQuestion());

    this.visiblePrp = ko.computed(function () {
        var answer = this.publicQuestion().value();
        return answer != undefined && answer.id() === 136;
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
            var cif = vm.MainApplicant().ApplicantBasicData().DNI();
            var name = vm.MainApplicant().ApplicantBasicData().Name();
            var fiscalCountry = vm.MainApplicant().ApplicantContactData().FiscalAddress().CountryId();
            var answer = self.sectorQuestion().getSelectedAnswer().id();
            var percentageCountry = self.percentageCountryQuestion().value().id;

            Request.AskForRequiredRealOwner(fiscalCountry, percentageCountry, cif, name, answer, function (result) {
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
};

var KnowledgeTestRepresentative = function (applicant) {
    var self = this;

    this.companyTypeQuestion = ko.observable(new ComboQuestion(74, [
        new ComboAnswer(242, 'Sociedad o Comunidad de Bienes'),
        new ComboAnswer(243, ' Fundación, ONG, Entidad Religiosa o Asociación')],
        'Debe responder a la pregunta: Indica el tipo de entidad:')
    );
    this.investmentOwnerQuestion = ko.observable(new InvestmentOwnerQuestion());
    this.percentageCountryQuestion = ko.observable(new PercentageCountryQuestion());
    this.ssnQuestion = ko.observable(new SsnQuestion(44));
    this.fatcaCrsQuestion = ko.observable(new FatcaCrsQuestion());
    this.sectorQuestion = ko.observable(new SectorQuestion());

    this.realOwnerQuestion = ko.observable(new RealOwnerQuestion());
    this.adminOwnerQuestion = ko.observable(new AdminQuestion());
    this.patronOwnerQuestion = ko.observable(new PatronQuestion());
    this.representationOwnerQuestion = ko.observable(new RepresentativeQuestion());

    this.annualAmountQuestion = ko.observable(new AnnualAmountQuestion());
    this.annualBenefitQuestion = ko.observable(new AnnualBenefitQuestion());
    this.fundsVolumeQuestion = ko.observable(new FundsVolumeQuestion());
    this.activeQuestion = ko.observable(new ActiveQuestion());
    this.employeesQuestion = ko.observable(new EmployeesQuestion());

    this.visibleOwnerSociety = ko.computed(function () {
        return self.companyTypeQuestion().value() != undefined && self.companyTypeQuestion().value().id() == 242;
    }, this);

    this.visibleOwnerFundation = ko.computed(function () {
        return self.companyTypeQuestion().value() != undefined && self.companyTypeQuestion().value().id() == 243;
    }, this);

    this.allowContinue = ko.computed(function () {
        return self.companyTypeQuestion().value() != undefined;
    }, this);

    this.fiscalQuestion = ko.observable(new FiscalResidenceQuestion(applicant.ApplicantContactData().FiscalAddress().CountryId()));
    this.secondResidenceQuestion = ko.observable(new SecondCountryQuestion());
    this.publicQuestion = ko.observable(new PublicPositionQuestion());
    this.ongQuestion = ko.observable(new OngQuestion());
    this.prpQuestion = ko.observable(new PrpQuestion());

    this.visiblePrp = ko.computed(function () {
        var answer = this.publicQuestion().value();
        return answer != undefined && answer.id() === 136;
    }, this);

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

        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questionanswers = [];
        questionanswers = questionanswers.concat(
            self.fiscalQuestion().getQuestionsAnswer(),
            self.secondResidenceQuestion().getQuestionsAnswer(),
            self.ssnQuestion().getQuestionsAnswer(),
            self.publicQuestion().getQuestionsAnswer(),
            self.ongQuestion().getQuestionsAnswer(),
            self.visiblePrp() ? self.prpQuestion().getQuestionsAnswer() : []
        );

        return questionanswers;
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
    }

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
    };
};

/* -- Juridic main applicant  --  */

/* Investment owner question */

var InvestmentOwnerQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 53; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 53; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 53; }).QuestionLabel());
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
};

/* Fiscal residence country question */

var FiscalResidenceCountryQuestion = function () {
    var self = this;
    this.validateNow = ko.observable(false);
    this.id = ko.observable(56);
    this.value = ko.observable();
};

/* Fiscal residence number question */

var FiscalResidenceNumberQuestion = function () {
    var self = this;
    this.validateNow = ko.observable(false);
    this.id = ko.observable(57);
    this.value = ko.observable();
};

/* Country percentage question */

var PercentageCountryQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 58; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 58; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 58; }).QuestionLabel());
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
};

/* SSN question */

var SsnQuestion = function (id) {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === id; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === id; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === id; }).QuestionLabel());
    this.id = ko.observable(id);
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

/* Fatca / Crs question */

var FatcaCrsQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 60; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 60; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 60; }).QuestionLabel());
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

/* Sector question */

var SectorQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 61; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 61; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 61; }).QuestionLabel());
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
};

var SectorFinantialQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 61; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 61; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 61; }).QuestionLabel());
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
};

var SectorAnswer = function (answerid, answerlabel, answersubsectors, isextended, tooltip, sup, checked) {
    var self = this;
    this.id = ko.observable(answerid);
    this.label = ko.observable(answerlabel);
    this.checked = ko.observable(checked);
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

/* Owners question */

var RealOwnerQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 70; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 70; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 70; }).QuestionLabel());
    this.validateNow = ko.observable(false);
    this.id = ko.observable(70);
    this.owners = ko.observableArray([]);
    this.IsAddingOwner = ko.observable(false);
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

    this.BeginAddOwner = function (scope, question) {
        self.OwnerToAdd(new Owner(self.owners().length, "", "", "", "", "", true, self.owners(), scope.listaOtherApplicants(), scope.CurrentEditApplicant().ApplicantBasicData().Assisted()));

        scope.CurrentKnowledgeTest().adminOwnerQuestion().IsAddingOwner(false);

        self.IsAddingOwner(true);
        window.scrollWindow('add-real-owner');
        bindAutocomplete();
        initAutocomplete();
        window.SetCleaveClass();
    };

    this.CancelAddOwner = function () {
        self.IsAddingOwner(false);
        window.scrollWindow('real-owner');
    };

    this.AddOwner = function () {
        if (!self.OwnerToAdd().IsOk(vm.isActiveCompany())) {
            return;
        }
        var newOwner = new Owner(self.OwnerToAdd().Id(),
            self.OwnerToAdd().Name(),
            self.OwnerToAdd().FirstSurname(),
            self.OwnerToAdd().SecondSurname(),
            self.OwnerToAdd().DNI(),
            self.OwnerToAdd().Percentage(),
            true);
        newOwner.Birthday(self.OwnerToAdd().Birthday());
        newOwner.Country(self.OwnerToAdd().Country());
        newOwner.Nationality(self.OwnerToAdd().Nationality());
        newOwner.BornPlace(self.OwnerToAdd().BornPlace());
        newOwner.IDDocumentIsPermanent(self.OwnerToAdd().IDDocumentIsPermanent());
        newOwner.IDDocumentExpirationDate(self.OwnerToAdd().IDDocumentExpirationDate());
        newOwner.FiscalCountry(self.OwnerToAdd().FiscalCountry());
        newOwner.FiscalNumber(self.OwnerToAdd().FiscalNumber());
        newOwner.UsaFiscalNumber(self.OwnerToAdd().UsaFiscalNumber());
        newOwner.DocumentType(self.OwnerToAdd().DocumentType());
        newOwner.FiscalAddress(self.OwnerToAdd().FiscalAddress());
        newOwner.ShowAddressInfo(self.OwnerToAdd().ShowAddressInfo());
        newOwner.SameTitularAddress(self.OwnerToAdd().SameTitularAddress());
        self.owners().push(newOwner);
        self.owners.valueHasMutated();
        self.IsAddingOwner(false);

        window.scrollWindow('real-owner');
    };

    this.RemoveOwner = function (owner) {
        self.owners.remove(owner);
    };

    this.OwnerToAdd = ko.observable(new Owner("", "", "", "", "", ""));

    this.CanAddOwner = ko.computed(function () {
        var totalPercentage = 0;
        ko.utils.arrayForEach(self.owners(), function (o, index) { totalPercentage += parseInt(o.Percentage() == "" ? 0 : o.Percentage()); });
        return self.owners().length < 4 && totalPercentage <= 75; //El porcentaje total máximo para permitir añdir son 75 puesto que el mínimo a introducir son 25
    }, this);

    this.HasOwners = ko.computed(function () {
        return self.owners().length > 0;
    }, this);

    this.IsExcluded = ko.computed(function () {
        var isExcluded = false;
        isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().adminOwnerQuestion().HasOwners();
        return isExcluded;
    }, this);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var entityType = vm.CurrentKnowledgeTest() == undefined ? 0 : vm.CurrentKnowledgeTest().companyTypeQuestion().value() != undefined ? vm.CurrentKnowledgeTest().companyTypeQuestion().value().id() : 0;
        var isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().adminOwnerQuestion().HasOwners();

        if (entityType == 242 && !isExcluded) {
            ok = self.HasOwners();
        }

        self.questionOK(ok);
        return ok;
    };
};

var AdminQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 71; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 71; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 71; }).QuestionLabel());
    this.validateNow = ko.observable(false);
    this.id = ko.observable(71);
    this.owners = ko.observableArray([]);
    this.IsAddingOwner = ko.observable(false);
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

    this.BeginAddOwner = function (scope, question) {
        self.OwnerToAdd(new Owner(self.owners().length, "", "", "", "", "", false, self.owners(), scope.listaOtherApplicants(), scope.CurrentEditApplicant().ApplicantBasicData().Assisted()));

        scope.CurrentKnowledgeTest().realOwnerQuestion().IsAddingOwner(false);

        self.IsAddingOwner(true);
        window.scrollWindow('add-admin-owner');
        bindAutocomplete();
        initAutocomplete();
        window.SetCleaveClass();
    };

    this.CancelAddOwner = function () {
        self.IsAddingOwner(false);
        window.scrollWindow('admin-owner');
    };

    this.AddOwner = function () {
        if (!self.OwnerToAdd().IsOk(vm.isActiveCompany())) {
            return;
        }
        var newOwner = new Owner(self.OwnerToAdd().Id(),
            self.OwnerToAdd().Name(),
            self.OwnerToAdd().FirstSurname(),
            self.OwnerToAdd().SecondSurname(),
            self.OwnerToAdd().DNI(),
            self.OwnerToAdd().Percentage(),
            false
        );
        newOwner.Birthday(self.OwnerToAdd().Birthday());
        newOwner.Country(self.OwnerToAdd().Country());
        newOwner.Nationality(self.OwnerToAdd().Nationality());
        newOwner.BornPlace(self.OwnerToAdd().BornPlace());
        newOwner.IDDocumentIsPermanent(self.OwnerToAdd().IDDocumentIsPermanent());
        newOwner.IDDocumentExpirationDate(self.OwnerToAdd().IDDocumentExpirationDate());
        newOwner.FiscalCountry(self.OwnerToAdd().FiscalCountry());
        newOwner.FiscalNumber(self.OwnerToAdd().FiscalNumber());
        newOwner.UsaFiscalNumber(self.OwnerToAdd().UsaFiscalNumber());
        newOwner.DocumentType(self.OwnerToAdd().DocumentType());
        newOwner.FiscalAddress(self.OwnerToAdd().FiscalAddress());
        newOwner.ShowAddressInfo(self.OwnerToAdd().ShowAddressInfo());
        newOwner.SameTitularAddress(self.OwnerToAdd().SameTitularAddress());
        self.owners().push(newOwner);
        self.owners.valueHasMutated();
        self.IsAddingOwner(false);

        window.scrollWindow('admin-owner');
    };

    this.RemoveOwner = function (owner) {
        self.owners.remove(owner);
    };

    this.OwnerToAdd = ko.observable(new Owner("", "", "", "", "", ""));

    this.CanAddOwner = ko.computed(function () {
        var totalPercentage = 0;
        ko.utils.arrayForEach(self.owners(), function (o, index) { totalPercentage += parseInt(o.Percentage() == "" ? 0 : o.Percentage()); });
        return self.owners().length < 4 && totalPercentage <= 75; //El porcentaje total máximo para permitir añdir son 75 puesto que el mínimo a introducir son 25
    }, this);

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
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 72; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 72; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 72; }).QuestionLabel());
    this.validateNow = ko.observable(false);
    this.id = ko.observable(72);
    this.owners = ko.observableArray([]);
    this.IsAddingOwner = ko.observable(false);
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

    this.BeginAddOwner = function (scope, question) {
        self.OwnerToAdd(new Owner(self.owners().length, "", "", "", "", "", true, self.owners(), scope.listaOtherApplicants(), scope.CurrentEditApplicant().ApplicantBasicData().Assisted()));

        scope.CurrentKnowledgeTest().representationOwnerQuestion().IsAddingOwner(false);

        self.IsAddingOwner(true);
        window.scrollWindow('add-patron-owner');
        bindAutocomplete();
        initAutocomplete();
        window.SetCleaveClass();
    };

    this.CancelAddOwner = function () {
        self.IsAddingOwner(false);
        window.scrollWindow('patron-owner');
    };

    this.AddOwner = function () {
        if (!self.OwnerToAdd().IsOk(vm.isActiveCompany())) {
            return;
        }
        var newOwner = new Owner(self.OwnerToAdd().Id(),
            self.OwnerToAdd().Name(),
            self.OwnerToAdd().FirstSurname(),
            self.OwnerToAdd().SecondSurname(),
            self.OwnerToAdd().DNI(),
            self.OwnerToAdd().Percentage(),
            true
        );
        newOwner.Birthday(self.OwnerToAdd().Birthday());
        newOwner.Country(self.OwnerToAdd().Country());
        newOwner.Nationality(self.OwnerToAdd().Nationality());
        newOwner.BornPlace(self.OwnerToAdd().BornPlace());
        newOwner.IDDocumentIsPermanent(self.OwnerToAdd().IDDocumentIsPermanent());
        newOwner.IDDocumentExpirationDate(self.OwnerToAdd().IDDocumentExpirationDate());
        newOwner.FiscalCountry(self.OwnerToAdd().FiscalCountry());
        newOwner.FiscalNumber(self.OwnerToAdd().FiscalNumber());
        newOwner.UsaFiscalNumber(self.OwnerToAdd().UsaFiscalNumber());
        newOwner.DocumentType(self.OwnerToAdd().DocumentType());
        newOwner.FiscalAddress(self.OwnerToAdd().FiscalAddress());
        newOwner.ShowAddressInfo(self.OwnerToAdd().ShowAddressInfo());
        newOwner.SameTitularAddress(self.OwnerToAdd().SameTitularAddress());
        self.owners().push(newOwner);
        self.owners.valueHasMutated();
        self.IsAddingOwner(false);

        window.scrollWindow('patron-owner');
    };

    this.RemoveOwner = function (owner) {
        self.owners.remove(owner);
    };

    this.OwnerToAdd = ko.observable(new Owner("", "", "", "", "", ""));

    this.CanAddOwner = ko.computed(function () {
        var totalPercentage = 0;
        ko.utils.arrayForEach(self.owners(), function (o, index) { totalPercentage += parseInt(o.Percentage() == "" ? 0 : o.Percentage()); });
        return self.owners().length < 4 && totalPercentage <= 75; //El porcentaje total máximo para permitir añdir son 75 puesto que el mínimo a introducir son 25
    }, this);

    this.HasOwners = ko.computed(function () {
        return self.owners().length > 0;
    }, this);

    this.IsExcluded = ko.computed(function () {
        var isExcluded = false;
        isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().representationOwnerQuestion().HasOwners();
        return isExcluded;
    }, this);

    this.validate = function () {
        var ok = true;
        self.validateNow(true);

        var entityType = vm.CurrentKnowledgeTest() == undefined ? 0 : vm.CurrentKnowledgeTest().companyTypeQuestion().value() != undefined ? vm.CurrentKnowledgeTest().companyTypeQuestion().value().id() : 0;
        var isExcluded = vm.CurrentKnowledgeTest() == undefined ? false : vm.CurrentKnowledgeTest().representationOwnerQuestion().HasOwners();

        if (entityType == 243 && !isExcluded) {
            ok = self.HasOwners();
        }

        self.questionOK(ok);
        return ok;
    };
};

var RepresentativeQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 73; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 73; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 73; }).QuestionLabel());
    this.validateNow = ko.observable(false);
    this.id = ko.observable(73);
    this.owners = ko.observableArray([]);
    this.IsAddingOwner = ko.observable(false);
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

    this.BeginAddOwner = function (scope, question) {
        self.OwnerToAdd(new Owner(self.owners().length, "", "", "", "", "", false, self.owners(), scope.listaOtherApplicants(), scope.CurrentEditApplicant().ApplicantBasicData().Assisted()));

        scope.CurrentKnowledgeTest().patronOwnerQuestion().IsAddingOwner(false);

        self.IsAddingOwner(true);
        window.scrollWindow('add-representative-owner');
        bindAutocomplete();
        initAutocomplete();
        window.SetCleaveClass();
    };

    this.CancelAddOwner = function () {
        self.IsAddingOwner(false);
        window.scrollWindow('representative-owner');
    };

    this.AddOwner = function () {
        if (!self.OwnerToAdd().IsOk(vm.isActiveCompany())) {
            return;
        }
        var newOwner = new Owner(self.OwnerToAdd().Id(),
            self.OwnerToAdd().Name(),
            self.OwnerToAdd().FirstSurname(),
            self.OwnerToAdd().SecondSurname(),
            self.OwnerToAdd().DNI(),
            self.OwnerToAdd().Percentage(),
            false
        );
        newOwner.Birthday(self.OwnerToAdd().Birthday());
        newOwner.Country(self.OwnerToAdd().Country());
        newOwner.Nationality(self.OwnerToAdd().Nationality());
        newOwner.BornPlace(self.OwnerToAdd().BornPlace());
        newOwner.IDDocumentIsPermanent(self.OwnerToAdd().IDDocumentIsPermanent());
        newOwner.IDDocumentExpirationDate(self.OwnerToAdd().IDDocumentExpirationDate());
        newOwner.FiscalCountry(self.OwnerToAdd().FiscalCountry());
        newOwner.FiscalNumber(self.OwnerToAdd().FiscalNumber());
        newOwner.UsaFiscalNumber(self.OwnerToAdd().UsaFiscalNumber());
        newOwner.DocumentType(self.OwnerToAdd().DocumentType());
        newOwner.FiscalAddress(self.OwnerToAdd().FiscalAddress());
        newOwner.ShowAddressInfo(self.OwnerToAdd().ShowAddressInfo());
        newOwner.SameTitularAddress(self.OwnerToAdd().SameTitularAddress());
        self.owners().push(newOwner);
        self.owners.valueHasMutated();
        self.IsAddingOwner(false);

        window.scrollWindow('representative-owner');
    };

    this.RemoveOwner = function (owner) {
        self.owners.remove(owner);
    };

    this.OwnerToAdd = ko.observable(new Owner("", "", "", "", "", ""));

    this.CanAddOwner = ko.computed(function () {
        var totalPercentage = 0;
        ko.utils.arrayForEach(self.owners(), function (o, index) { totalPercentage += parseInt(o.Percentage() == "" ? 0 : o.Percentage()); });
        return self.owners().length < 4 && totalPercentage <= 75; //El porcentaje total máximo para permitir añdir son 75 puesto que el mínimo a introducir son 25
    }, this);

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

/* Annual amount question */

var AnnualAmountQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 63; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 63; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 63; }).QuestionLabel());
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
};

/* Annual benefit question */

var AnnualBenefitQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 64; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 64; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 64; }).QuestionLabel());
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
};

/* Funds question */

var FundsVolumeQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 65; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 65; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 65; }).QuestionLabel());
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
};

/* Active question */

var ActiveQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 66; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 66; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 66; }).QuestionLabel());
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
};

/* Employees question */

var EmployeesQuestion = function () {
    var self = this;
    this.questionText = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 67; }).Question());
    this.ErrorMessage = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 67; }).ErrorMessage());
    this.questionLabel = ko.observable(MasterData.QuestionCollection().find(function (question) { return question.IdQuestion() === 67; }).QuestionLabel());
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
};

/* -- Reprensentatives applicants -- */

/* fiscal residence question */
var FiscalResidenceQuestion = function (fiscalCountry) {
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
                questions.push({ "idQuestion": self.DocumentExpirationDate().id(), "idAnswer": "", "OtherAnswer": self.DocumentExpirationDate().value().parseString() });
                questions.push({ "idQuestion": self.DocumentIdentification().id(), "idAnswer": "", "OtherAnswer": self.DocumentIdentification().value() });
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
            questions.push({ "idQuestion": self.SecondDocumentExpirationDate().id(), "idAnswer": "", "OtherAnswer": self.SecondDocumentExpirationDate().value().parseString() });
            questions.push({ "idQuestion": self.SecondDocumentIdentification().id(), "idAnswer": "", "OtherAnswer": self.SecondDocumentIdentification().value() });
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

var ComboAnswer = function (answerid, answerlabel, answerisextended) {
    var self = this;
    this.id = ko.observable(answerid);
    this.label = ko.observable(answerlabel);
    this.value = ko.observable();
    this.isExtended = ko.observable(answerisextended);
    this.extendedAnswer = ko.observable();
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
    this.ErrorMessage = ko.observable("");
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
    this.ErrorMessage = ko.observable("");
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

        ok = self.value() != undefined;

        self.questionOK(ok);
        return ok;
    };

    this.getQuestionsAnswer = function () {
        var questions = [];

        questions.push({ "idQuestion": self.id(), "idAnswer": self.value().id(), "OtherAnswer": "" });

        return questions;
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
        var userInputValue = self.value() != null ? self.value() : '';
        userInputValue = userInputValue.substr(userInputValue.length - 1) == '.' ? userInputValue : userInputValue + '.';
        ok = Utils.CompareNormalizedString(userInputValue, self.ValidationText());
        self.questionOK(ok);
        return ok;
    };
};
