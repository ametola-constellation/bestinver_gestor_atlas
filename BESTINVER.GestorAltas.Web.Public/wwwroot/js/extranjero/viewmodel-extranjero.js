'use strict';

ko.validation.init({
    insertMessages: false,
    decorateElement: true,
    errorClass: 'error_message',
    grouping: { deep: true, observable: true }
});

ko.observableArray.fn.distinct = function (prop) {
    var target = this;
    target.index = {};
    target.index[prop] = ko.observable({});

    ko.computed(function () {
        var propIndex = {};

        ko.utils.arrayForEach(target(), function (item) {
            var key = ko.utils.unwrapObservable(item[prop]);
            if (key) {
                propIndex[key] = propIndex[key] || [];
                propIndex[key].push(item);
            }
        });

        target.index[prop](propIndex);
    });

    return target;
};

var ViewModel = function (ApplicantInit, ProductInit) {
    var Self = this;

    this.titleStep2 = ko.observable('Realiza tu inversión');
    this.dataProgressStep2 = ko.observable('50');
    this.Product = ko.observable(ProductInit);

    this.CurrentProduct = ko.observable(Self.Product());
    this.ErrorMessage = ko.observable();
    this.ProductModel = ko.observable();
    this.MainApplicant = ko.observable(ApplicantInit);
    this.listaOtherApplicants = ko.observableArray([]).distinct('RequestApplicantType');
    this.listaOtherApplicantsHasConvenienceTest = ko.observableArray([]).distinct('ApplicantType');
    this.CurrentApplicant = ko.observable(ApplicantInit);
    this.CurrentTypeTest = ko.observable(1);
    this.CurrentType = ko.observable(2);
    this.CurrentEditApplicant = ko.observable(Self.MainApplicant());
    this.ApplicantIsEditing = ko.observable(false);
    this.Operation = ko.observable();
    this.listaOtherProducts = ko.observableArray([Self.Product()]);
    this.CurrentEditOperation = ko.observable(new OperationData(Self.Product()));
    this.OperationIsEditing = ko.observable(false);
    this.ProductIsEditing = ko.observable(false);
    this.ApplicantCloned = ko.observable();
    this.OperationCloned = ko.observable();
    this.radioSelectedOptionValue = ko.observable("N");
    this.radioNIFNIESelectedOptionValue = ko.observable("N");
    this.SignatureData = ko.observable(new SignatureData());
    this.DniData = ko.observable(new DniData());
    this.MainApplicantDocumentSendingWay = ko.observable();
    this.MainApplicantScanDni = ko.observable();
    this.UserCRII = ko.observable();
    this.ManagedByCommercial = ko.observable();
    this.SignatureType = ko.observable('1');
    this.RequestId = ko.observable();
    this.validateNow = ko.observable(false);
    this.RefundAccountNumber = ko.observable("");
    this.IsFCRFlag = ko.observable(false);
    this.IsOtherProductFCR = ko.observable(false);
    this.IsRubricaeEventsAttached = ko.observable(false);
    this.OperationOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: "Ya ha introducido una operación de mismo tipo",
                onlyIf: function () {
                    return Self.validateNow();
                }
            }
        });
    this.OperationAmountOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: "El total de los importes de las aportaciones no puede superar el máximo por producto",
                onlyIf: function () {
                    return Self.validateNow();
                }
            }
        });
    this.OperationReciboAmountOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: "El importe mínimo de una operación de recibo debe ser mayor o igual a 100€",
                onlyIf: function () {
                    return Self.validateNow();
                }
            }
        });

    this.ListOperationOK = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: "Debe incluir al menos una operación",
                onlyIf: function () {
                    return Self.validateNow();
                }
            }
        });
    this.TutorOk = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: "Debe incluir al menos un tutor",
                onlyIf: function () {
                    return Self.validateNow();
                }
            }
        });
    this.ApplicantOk = ko.observable(true).extend(
        {
            equal: {
                params: true,
                message: "Ya existe una persona con ese documento de identidad o teléfono móvil",
                onlyIf: function () {
                    return Self.validateNow();
                }
            }
        });

    Self.ApplicantCountryOkError = ko.observable();
    this.ApplicantCountryOk = ko.observable(true).extend(
        {
            validation: {
                validator: function (val) {
                    var _valid = true;
                    if (Self.validateNow()) {
                        if (val == false) {
                            _valid = false;
                        }
                    }
                    return _valid;
                },
                message: function () {
                    return Self.ApplicantCountryOkError();
                }
            }
        });

    this.AltaCrii = ko.observable(false);
    this.RequestApplicantTypeEnum = ["Cotitular", "Autorizado", "Tutor", "Apoderado", "Representante", "Heredero", "Beneficiario Donación", "Minusválido", "Heredero y Tutor", "Coheredero", "Coheredero y Tutor", "Usufructuario y Tutor"];
    this.ExistsTutors = ko.observableArray([]);
    this.errors = ko.validation.group(this);
    this.CurrentTutor = ko.observable();

    this.CurrentKnowledgeTest = ko.observable();
    this.CurrentConvenienceTest = ko.observable();
    this.CurrentConvenienceSecondTest = ko.observable();

    Self.CurrentEditOperation.subscribe(function (op) {
        if (op) {
            op.IBAN.subscribe(function (newvalue) {
                if (newvalue && newvalue != '') {
                    Self.MainApplicant().ApplicantRefundAccountNumberData().defaultIBAN(newvalue);
                    Self.MainApplicant().ApplicantRefundAccountNumberData().AccountNumber(newvalue);
                }
            });
        }
    });

    Self.MainApplicant().ApplicantPersonalData().Gender.subscribe(function (newValue) {
        if (newValue.id == GenderEnum.HOMBRE) {
            window.setDatalayerItem('sexo', 'hombre');
        } else {
            window.setDatalayerItem('sexo', 'mujer');
        }
    });

    Self.MainApplicant().ApplicantPersonalData().Birthday().Year.subscribe(function (newValue) {
        window.setDatalayerItem('nacimiento', newValue);
    });

    Self.MainApplicant().ApplicantPersonalData().Nationality.subscribe(function (newValue) {
        if (newValue != undefined)
            window.setDatalayerItem('nationality', newValue.valor.toLowerCase());
    });

    Self.MainApplicant().ApplicantPersonalData().Country.subscribe(function (newValue) {
        if (newValue != undefined)
            window.setDatalayerItem('country', newValue.valor.toLowerCase());
    });

    Self.MainApplicant().ApplicantPersonalData().IsResident.subscribe(function (newValue) {
        window.setDatalayerItem('residente', newValue == 'true' ? 'si' : 'no');
        if (newValue == 'true') {
            Self.MainApplicant().ApplicantPersonalData().PhonePrefix("+34");
            $("#personadata-phone-prefix").trigger("propertychange");
        }
    });

    Self.MainApplicant().ApplicantBasicData().DNI.subscribe(function (newValue) {
        window.setDatalayerItem('dni', newValue);
    });

    Self.MainApplicant().ApplicantBasicData().Email.subscribe(function (newValue) {
        window.setDatalayerItem('email', newValue);
    });

    Self.MainApplicant().ApplicantBasicData().MobilePhoneNumber.subscribe(function (newValue) {
        window.setDatalayerItem('mobilephone', newValue);
    });

    Self.MainApplicant().ApplicantPersonalData().PhoneNumber.subscribe(function (newValue) {
        window.setDatalayerItem('phone', newValue);
    });

    Self.MainApplicant().ApplicantContactData().FiscalAddress().Province.subscribe(function (newValue) {
        window.setDatalayerItem('province', newValue);
    });

    Self.MainApplicant().ApplicantContactData().FiscalAddress().City.subscribe(function (newValue) {
        window.setDatalayerItem('city', newValue);
    });

    Self.MainApplicant().ApplicantContactData().FiscalAddress().CountryId.subscribe(function (newValue) {
        var country = MasterData.getViaTypeNameById(newValue).toLowerCase();
        window.setDatalayerItem('addresscountry', country);
    });

    Self.MainApplicant().ApplicantContactData().FiscalAddress().PostalCode.subscribe(function (newValue) {
        window.setDatalayerItem('codigoPostal', newValue);
    });

    Self.MainApplicant().ApplicantBasicData().MobilePhonePrefix.subscribe(function (newValue) {
        Self.MainApplicant().ApplicantPersonalData().PhonePrefix(newValue);
    });

    this.ProductSuscriptionTransferContent = ko.computed(function () {
        var ProductName = Self.Product() ? Self.Product().Name() : "";

        if (Self.Product() && (Self.Product().Id() == 30 || Self.Product().Id() == 32)) {
            return "Al seleccionar suscripción al Fondo de Inversión por transferencia deberás realizar transferencias bancarias a favor de " + ProductName
                + " cuando se reciban las llamadas de capital que realice el Fondo de acorde a lo establecido en el Acuerdo de suscripción y en el Reglamento, hasta llegar al importe total de tu capital comprometido."
        }
        return "Al seleccionar una suscripción al Fondo de Inversión por transferencia deberás realizar una transferencia bancaria en favor de " + ProductName
            + " con el importe seleccionado en la cuenta que se te indicará tras completar con éxito el proceso de contratación."
    }, Self);

    this.SI = ko.computed(
        {
            read: function () {
                if (this.radioSelectedOptionValue() == "S") {
                    Self.BeginCreateApplicant();
                }
            },
            write: function (value) {
                if (value)
                    this.radioSelectedOptionValue("S");
            }
        }
        , this);
    this.NO = ko.computed(
        {
            read: function () {
                if (this.radioSelectedOptionValue() == "N") {
                    Self.ApplicantIsEditing(false);
                }
            },
            write: function (value) {
                if (value)
                    this.radioSelectedOptionValue("N");
            }
        }
        , this);

    this.SpecialRequestApplicantType = ko.observableArray();
    this.SalesChannelList = ko.observableArray([
        new Valor(1, "Presencial"),
        new Valor(2, "telefónica")
    ]);

    this.SaveApplicant = function () {
        $('#personal-data-content').block({ message: null });
        if (Self.Operation() == 'I') {
            Self.CreateApplicant();
        } else {
            Self.UpdateApplicant();
        }
        $('#personal-data-content').unblock({ message: null });
    };

    this.BeginCreateApplicant = function () {
        window.setDatalayerProfile(Self.CurrentType());
        Self.Operation('I');
        var applicant = new Applicant(Self.Product(), "3");
        applicant.Id(Utils.generateUUID());

        if (Self.ManualAssisted()) {
            applicant.ApplicantBasicData().EmailCrii(Self.MainApplicant().ApplicantBasicData().EmailCrii());
            applicant.ApplicantBasicData().EmailCriiEnabled(Self.MainApplicant().ApplicantBasicData().EmailCriiEnabled());
        }
        applicant.ApplicantBasicData().RequestApplicantType(Self.CurrentType());
        applicant.ApplicantBasicData().ApplicantType("3");
        applicant.ApplicantPersonalData().IsResident('false');
        applicant.ApplicantBasicData().MobilePhonePrefix(Self.MainApplicant().ApplicantBasicData().MobilePhonePrefix());
        applicant.ApplicantPersonalData().PhonePrefix(Self.MainApplicant().ApplicantPersonalData().PhonePrefix());
        Self.CurrentEditApplicant(applicant);

        Self.CurrentEditApplicant().IsSameAddress.subscribe(function (newValue) {
            if (newValue) {
                Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress(Utils.CloneAddress(Self.MainApplicant().ApplicantContactData().FiscalAddress()));
            } else {
                Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress(new Address("FiscalAddress"));
            }
            bindAutocomplete();
            initAutocomplete();
        });

        Self.CurrentEditApplicant().ApplicantType.subscribe(function (newValue) {
            if (newValue == ApplicantTypeEnum.FISICAEXTRANJERA) {
                Self.CurrentEditApplicant().ApplicantPersonalData().IsResident('false');
                Self.CurrentEditApplicant().ApplicantPersonalData().IDDocumentIsPermanent(false);
            }
        });

        bindAutocomplete();
        initAutocomplete();
        Self.ApplicantIsEditing(true);
        window.SetCleaveClass();
    };

    this.ManualAssisted = ko.computed(function () {
        return (Self.MainApplicant().ApplicantBasicData().EmailCrii() != undefined && Self.MainApplicant().ApplicantBasicData().EmailCrii() != '') || (Self.MainApplicant().ApplicantBasicData().MobilePhoneNumber() == undefined || Self.MainApplicant().ApplicantBasicData().MobilePhoneNumber() == '');
    }, Self);

    this.IsOtherProductFCR = ko.computed(function () {
        return (Self.listaOtherProducts().some(product => (product.Id() == 25) && product.Family() == 12));
    }, Self);

    this.GetApplicantsByType = ko.computed(function () {
        var filterlist = Self.listaOtherApplicants().filter(function (elem) {
            return elem.ApplicantBasicData().RequestApplicantType() == Self.CurrentType()
        });
        return filterlist;
    }, Self);

    this.BeginUpdateApplicant = function (scope) {
        Self.Operation('U');
        Self.ApplicantCloned(Utils.CloneApplicantForeign(scope));
        Self.ApplicantIsEditing(true);
        Self.CurrentEditApplicant(scope);

        window.SetCleaveClass();
    };

    this.AddExistsTutor = function () {
        var found = Self.listaOtherApplicants().find(function (elem) {
            return elem.ApplicantBasicData().DNI() == Self.CurrentTutor();
        });

        if (found == undefined) {
            found = (Self.MainApplicant().ApplicantBasicData().DNI() == Self.CurrentTutor()) ? Self.MainApplicant() : undefined;
        }

        if (found != undefined && !Self.listaOtherApplicants().some(function (elem) { return (elem.ApplicantBasicData().DNI() == found.ApplicantBasicData().DNI() && elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TUTOR) })) {
            var app = Utils.CloneApplicantForeign(found);
            app.ApplicantBasicData().RequestApplicantType(RequestApplicantTypeEnum.TUTOR);
            app.IsTutorFromCoowner(true);
            Self.ApplicantOk(true);
            Self.listaOtherApplicants.push(app);
            Self.ApplicantIsEditing(false);
            Self.radioSelectedOptionValue("N");
            Self.CheckAmountValidValue();
            Self.CurrentEditApplicant(app);
        }
    };

    this.AddCoownerAsTutor = function (a) {
        if ((a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULAR
            || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TITULAR
            || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.DONACION
            || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO
            || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COHEREDERO
            || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.USUFRUCTUARIO)
            && !Self.ExistsTutors().some(function (elem) { return elem.id == a.ApplicantBasicData().DNI() })
            && a.IsOlderThan18()) {
            var app = new Valor(a.ApplicantBasicData().DNI(), a.ApplicantBasicData().FullName());
            Self.ExistsTutors.push(app);
        }
    }

    this.UpdateCoownerAsTutor = function (a) {
        //Lo insertamos en la lista de posibles tutores por si no existiera
        Self.AddCoownerAsTutor(a);

        var found = Self.listaOtherApplicants().find(function (elem) {
            return elem.Id() == a.Id() && elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TUTOR;
        });

        if (found != undefined) {
            if (found.IsOlderThan18()) {
                var app = Utils.CloneApplicantForeign(a);
                Self.listaOtherApplicants.remove(found);
                app.ApplicantBasicData().RequestApplicantType(RequestApplicantTypeEnum.TUTOR);
                app.IsTutorFromCoowner(true);
                Self.listaOtherApplicants.push(app);

                Self.ExistsTutors().forEach(function (ap) {
                    if (ap.id == found.ApplicantBasicData().DNI()) {
                        var i = Self.ExistsTutors().indexOf(ap);
                        Self.ExistsTutors()[i].valor = found.ApplicantBasicData().FullName();
                    }
                });
            } else {
                Self.listaOtherApplicants.remove(found);

                var found2 = Self.ExistsTutors().find(function (elem) {
                    return elem.id == a.ApplicantBasicData().DNI();
                });

                if (found2 != undefined) {
                    Self.ExistsTutors.remove(found2);
                }
            }
        } else {
            var found2 = Self.ExistsTutors().find(function (elem) {
                return elem.id == a.ApplicantBasicData().DNI();
            });

            if (found2 != undefined) {
                var index2 = Self.ExistsTutors().indexOf(found2);

                if (a.IsOlderThan18()) {
                    Self.ExistsTutors().forEach(function (ap) {
                        if (ap.id == a.ApplicantBasicData().DNI()) {
                            Self.ExistsTutors()[index2].valor = a.ApplicantBasicData().FullName();
                        }
                    });
                } else {
                    Self.ExistsTutors.remove(found2);
                }

            }
        }
    };

    this.AddTitularAsTutor = function (a) {
        var found = Self.ExistsTutors().find(function (elem) {
            return elem.id == a.ApplicantBasicData().DNI();
        });

        if (found != undefined) {
            Self.UpdateCoownerAsTutor(a);
        } else {
            Self.AddCoownerAsTutor(a);
        }
    };

    this.RemoveCoownerAsTutor = function (a) {
        var found = Self.ExistsTutors().find(function (elem) {
            return elem.id == a.ApplicantBasicData().DNI();
        });

        if (Self.ExistsTutors().indexOf(found) > -1) {
            Self.ExistsTutors.remove(found);
        }

        var tutor = Self.listaOtherApplicants().find(function (elem) {
            return elem.Id() == a.Id();
        });

        if (Self.listaOtherApplicants().indexOf(tutor) > -1) {
            Self.listaOtherApplicants.remove(tutor);
        }
    }

    this.ValidateAddressCotitular = function () {
        var ok = true;
        if (Self.CurrentEditApplicant().IsSameAddress()) {
            var isresident = Self.CurrentEditApplicant().ApplicantPersonalData().IsResident() == 'true';
            var titularCountry = Self.MainApplicant().ApplicantContactData().FiscalAddress().CountryId();

            if (isresident && titularCountry != 1) {
                Self.ApplicantCountryOkError('No puede indicar una dirección fiscal distinta de España porque el titular no es residente en el país. Si su dirección fiscal no se ubica en España, por favor, en el paso anterior marque no residente.');
                ok = false;
            }
            if (!isresident && titularCountry == 1) {
                Self.ApplicantCountryOkError('No puede indicar una dirección fiscal en España. Si su dirección fiscal se ubica en España, por favor, en el paso anterior marque residente.');
                ok = false;
            }
        }
        return ok;
    };

    this.UpdateApplicant = function () {
        Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress().ValidateResident(
            Self.CurrentEditApplicant().ApplicantPersonalData().IsResident() == 'true'
        );
        Self.validateNow(true);

        if (!Self.ValidateAddressCotitular()) {
            Self.ApplicantCountryOk(false);
        } else {
            Self.ApplicantCountryOk(true);
            if (Self.CurrentEditApplicant().IsValid(!Self.CurrentEditApplicant().IsSameAddress())) {
                if (Self.CheckDocumentApplicants() && Self.CheckPhoneApplicants()) {
                    if (Self.CurrentEditApplicant().IsSameAddress()) {
                        Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress(Self.MainApplicant().ApplicantContactData().FiscalAddress());
                    }
                    Self.ApplicantOk(true);
                    Self.ApplicantIsEditing(false);
                    Self.radioSelectedOptionValue("N");
                    Self.GetApplicantsByType();
                    Self.CheckAmountValidValue();

                    if (Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULAR) {
                        Self.UpdateCoownerAsTutor(Self.CurrentEditApplicant());
                    }
                    window.scrollWindow('other-applicant-title-' + Self.CurrentType());
                } else {
                    Self.ApplicantOk(false);
                }
            }
        }
    };

    this.CreateApplicant = function () {
        Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress().ValidateResident(
            Self.CurrentEditApplicant().ApplicantPersonalData().IsResident() == 'true'
        );
        Self.validateNow(true);

        if (!Self.ValidateAddressCotitular()) {
            Self.ApplicantCountryOk(false);
        } else {
            Self.ApplicantCountryOk(true);
            if (Self.CurrentEditApplicant().IsValid(!Self.CurrentEditApplicant().IsSameAddress())) {
                if (Self.CheckDocumentApplicants() && Self.CheckPhoneApplicants()) {
                    if (Self.CurrentEditApplicant().IsSameAddress()) {
                        Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress(Self.MainApplicant().ApplicantContactData().FiscalAddress());
                    }

                    Self.ApplicantOk(true);
                    Self.listaOtherApplicants.push(Self.CurrentEditApplicant());
                    Self.ApplicantIsEditing(false);
                    Self.radioSelectedOptionValue("N");
                    Self.CheckAmountValidValue();

                    Self.AddCoownerAsTutor(Self.CurrentEditApplicant());

                    switch (Self.CurrentType()) {
                        case 2:
                            GMT.PushEvent(PageEnum.COTITULARES, 'anadir', 'cotitular');
                            if (Self.CurrentEditApplicant().IsSameAddress())
                                GMT.PushEvent(PageEnum.COTITULARES, 'direccion fiscal', 'Los datos de la dirección fiscal son los mismos que los del titular');
                            break;
                        case 3:
                            GMT.PushEvent(PageEnum.AUTORIZADOS, 'anadir', 'autorizado');
                            if (Self.CurrentEditApplicant().IsSameAddress())
                                GMT.PushEvent(PageEnum.AUTORIZADOS, 'direccion fiscal', 'Los datos de la dirección fiscal son los mismos que los del titular');
                            break;
                        case 4:
                            GMT.PushEvent(PageEnum.BENEFICIARIOS, 'anadir', 'beneficiario');
                            if (Self.CurrentEditApplicant().IsSameAddress())
                                GMT.PushEvent(PageEnum.BENEFICIARIOS, 'direccion fiscal', 'Los datos de la dirección fiscal son los mismos que los del titular');
                            break;
                        case 5:
                            GMT.PushEvent(PageEnum.TUTORES, 'anadir', 'tutor');
                            if (Self.CurrentEditApplicant().IsSameAddress())
                                GMT.PushEvent(PageEnum.TUTORES, 'direccion fiscal', 'Los datos de la dirección fiscal son los mismos que los del titular');
                            break;
                        case 23:
                            GMT.PushEvent(PageEnum.USUFRUCTUARIOS, 'anadir', 'Usufructuario');
                            if (Self.CurrentEditApplicant().IsSameAddress())
                                GMT.PushEvent(PageEnum.USUFRUCTUARIOS, 'direccion fiscal', 'Los datos de la dirección fiscal son los mismos que los del titular');
                            break;
                        case 25:
                            GMT.PushEvent(PageEnum.COHEREDEROS, 'anadir', 'coheredero');
                            if (Self.CurrentEditApplicant().IsSameAddress())
                                GMT.PushEvent(PageEnum.COHEREDEROS, 'direccion fiscal', 'Los datos de la dirección fiscal son los mismos que los del titular');
                            break;
                    }
                    window.scrollWindow('other-applicant-title-' + Self.CurrentType());
                } else {
                    Self.ApplicantOk(false);
                }
            }
        }
    };

    this.BeginCreateOperation = function (scope) {
        MasterData.UpdateOperationTypeList(scope.Family(), scope.ProductTypeId(), Self.MainApplicant().ApplicantPersonalData().IsResident() == 'true').then(function (result) {
            if (result) {
                var transfers = Self.CurrentProduct().ProductOperationList().some(function (elem) { return elem.IdOperationType() == OperationTypeEnum.TRASPASO });
                Self.Operation('I');
                Self.CurrentProduct(scope);
                Self.Product(scope);
                var operation = new OperationData(scope);
                if (transfers) operation.MinMonthlyAmountWithNoAportacion(50);
                operation.SetAmountValidValues(Self.CheckAllTitularMinors(), Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.MINUSVALIDO);
                Self.CurrentEditOperation(operation);
                Self.OperationIsEditing(true);
                InitInvestmentAutocomplete(scope.ProductTypeId());
                window.SetCleaveClass();
            }
        });
    };

    this.CreateOperation = function () {
        Self.validateNow(true);
        if (Self.CurrentEditOperation().ValidateOperation(Self)) {
            if (Self.ValidateOperationList()) {
                Self.CurrentProduct().ProductOperationList.push(Self.CurrentEditOperation());
                Self.CheckReciboAportacion();
                Self.OperationIsEditing(false);
            }
        }
    };

    this.DeleteOperation = function (scope) {
        Self.CurrentProduct(scope.Product());
        Self.Operation('D');
        Self.CurrentProduct().ProductOperationList.remove(scope);
    };

    this.CancelOperation = function (scope) {
        Self.validateNow(false);
        Self.OperationOK(true);
        Self.ListOperationOK(true);
        Self.OperationIsEditing(false);
    };

    this.DeleteApplicant = function (scope) {

        if (Self.CurrentType() == RequestApplicantTypeEnum.TUTOR && Self.GetApplicantsByType().length == 1) {
            Self.radioSelectedOptionValue('S');
        }

        Self.Operation('D');
        Self.listaOtherApplicants.remove(scope);

        if (scope.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULAR) {
            Self.RemoveCoownerAsTutor(scope);
        }
    };

    this.CancelApplicant = function (scope) {
        if (Self.CurrentType() == RequestApplicantTypeEnum.TUTOR && Self.GetApplicantsByType().length == 0) {
            Self.radioSelectedOptionValue('S');
        } else {
            Self.listaOtherApplicants.replace(Self.CurrentEditApplicant(), Self.ApplicantCloned());
            Self.ApplicantIsEditing(false);
            Self.validateNow(false);
            Self.radioSelectedOptionValue('N');
        }
    };

    this.ApplicantListVisible = ko.computed(function () {
        return Self.GetApplicantsByType().length > 0;
    }, this);

    this.CheckReciboAportacion = function () {
        if (Self.CurrentEditOperation().IdOperationType() == OperationTypeEnum.RECIBO) {
            if (Utils.IsDecimalValid(Self.CurrentEditOperation().Amount())) {
                var operation = new OperationData(Self.CurrentEditOperation().Product());
                operation.selectedTransferType(Self.CurrentEditOperation().selectedTransferType());
                operation.IdOperationType('2');
                operation.Amount(Self.CurrentEditOperation().Amount());
                operation.MonthlyAmount('');
                operation.IBAN('');
                operation.IdWayToPay(Self.CurrentEditOperation().IdWayToPay());
                Self.CurrentProduct().ProductOperationList.push(operation);
            }
        }
    };

    //Create operation data for only one operation-product
    this.CreateOperationData = function (item, event) {
        $(event.target).addClass('disabled');
        $(event.target).addClass('loading');
        var ok = Self.CurrentEditOperation().ValidateOperation(Self);
        if (ok) {
            Self.CurrentProduct().ProductOperationList.splice(0, Self.CurrentProduct().ProductOperationList().length)
            Self.CurrentProduct().ProductOperationList.push(Self.CurrentEditOperation());
            Self.CheckReciboAportacion();

            Self.goToNextStep(function () {
                $(event.target).removeClass('loading');
                $(event.target).removeClass('disabled');
            });
        } else {
            $(event.target).removeClass('loading');
            $(event.target).removeClass('disabled');
        }
    };

    //Create operation data for multiple operation-product
    this.CreateListOperationData = function (item, event) {
        $(event.target).addClass('loading');
        Self.validateNow(true);

        if (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO || Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.DONACION) {
            Self.CreateEmptyOperations();
            Self.goToNextStep(function () {
                $(event.target).removeClass('loading');
            });
        } else {
            var ok = Self.CheckOperations();
            if (ok) {
                //Self.ListOperationOK(true);
                Self.goToNextStep(function () {
                    $(event.target).removeClass('loading');
                });
            } else {
                $(event.target).removeClass('loading');
                //Self.ListOperationOK(false);
            }
        }
    };

    this.CreateEmptyOperations = function () {
        Self.listaOtherProducts().forEach(function (p) {
            var op = new OperationData(p);
            var idOperationType;

            if (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO) {
                idOperationType = OperationTypeEnum.HERENCIA;
            } else {
                idOperationType = OperationTypeEnum.DONACION;
            }

            op.IdOperationType(idOperationType);
            p.ProductOperationList.push(op);
        });
    };

    this.CreateEmptyOperationAdviceProduct = function () {        
        if (Self.Product().ProductTypeId() == ProductTypeEnum.ASESORAMIENTOS) {
            Self.listaOtherProducts().forEach(function (p) {
                if (p.ProductOperationList.length == 0) {
                    var op = new OperationData(p);
                    op.IdOperationType(OperationTypeEnum.ASESORAMIENTO);
                    p.ProductOperationList.push(op);
                }
            });
        }
    };

    this.GetTest = function (scope) {
        Self.CurrentApplicant(scope);
        Self.CurrentKnowledgeTest(scope.KnowledgeTest());
        Self.CurrentConvenienceTest(scope.ConvenienceFirstTest());
        Self.CurrentConvenienceSecondTest(scope.ConvenienceSecondTest());
        window.SetCleaveClass();
    };

    this.EditTest = function (scope) {
        if (scope.ApplicantHasTest(Self.CurrentTypeTest())) {
            Self.CurrentApplicant(scope);
            Self.CurrentKnowledgeTest(scope.KnowledgeTest());
            Self.CurrentConvenienceTest(scope.ConvenienceFirstTest());
            Self.CurrentConvenienceSecondTest(scope.ConvenienceSecondTest());
        } else {
            if (Self.CurrentTypeTest() == TestTypeEnum.CONVENIENCIA) {
                if (scope.ApplicantHasTest(TestTypeEnum.CONOCIMIENTO)) {
                    Self.CurrentTypeTest(TestTypeEnum.CONOCIMIENTO);
                    Self.CurrentApplicant(scope);
                    Self.CurrentKnowledgeTest(scope.KnowledgeTest());
                    Self.CurrentConvenienceTest(scope.ConvenienceFirstTest());
                    Self.CurrentConvenienceSecondTest(scope.ConvenienceSecondTest());
                }
            }
        }
    };

    this.SetCurrentApplicant = function (scope) {
        Self.CurrentApplicant(scope);
    };

    this.TestHeader = ko.computed(function () {
        var header = "";
        if (Self.CurrentTypeTest() == TestTypeEnum.CONOCIMIENTO) {
            header = "Test de conocimiento para " + Self.CurrentApplicant().ApplicantBasicData().FullName();
        } else {
            header = "Test de conveniencia para " + Self.CurrentApplicant().ApplicantBasicData().FullName();
        }
        return header;
    }, this);

    this.CurrentApplicantSignatureTitle = ko.computed(function () {
        return 'Documentos personales del ' + Self.CurrentEditApplicant().RequestApplicantType() + ' ' + Self.CurrentEditApplicant().ApplicantBasicData().FullName();
    }, this);

    this.CurrentApplicantSendingDocumentTitle = ko.computed(function () {
        return 'Adjuntar documentos del ' + Self.CurrentEditApplicant().RequestApplicantType() + ' ' + Self.CurrentEditApplicant().ApplicantBasicData().FullName() + ' en formato JPG o PDF';
    }, this);

    this.BeginCreateProduct = function () {
        Self.Operation('I');
        Self.ProductIsEditing(true);
        Self.ProductModel().LifeCicleDate(new CustomDate(vm.MainApplicant().ApplicantPersonalData().Birthday().getDate()));
        Self.ClearProductSelecction();
    };

    this.CreateProduct = function () {
        var ExistProduct = Self.listaOtherProducts().some(function (elem) {
            return elem.Id() == Self.ProductModel().Product();
        });
        if (!ExistProduct) {
            Self.listaOtherProducts.push(MasterData.getProductById(Self.ProductModel().Product()));
            Self.ProductIsEditing(false);
        } else {
            Self.ProductIsEditing(false);
        }
        Self.ClearProductSelecction();
    };

    this.DeleteProduct = function (scope) {
        Self.listaOtherProducts.remove(scope);
    };

    this.CancelProduct = function () {
        Self.ProductIsEditing(false);
        Self.ClearProductSelecction();
    };

    this.ClearProductSelecction = function () {
        Self.ProductModel().Product("");
        Self.ProductModel().ProductType("");
        $('[id^=product-content-]').each(function () {
            $(this).hide();
        });
    }

    this.ValidateOperationList = function () {
        var ok = true;
        var operationtype = Self.CurrentEditOperation().IdOperationType();

        var sameoperationtype = Self.CurrentProduct().ProductOperationList().some(function (elem) {
            return elem.IdOperationType() == operationtype && operationtype != OperationTypeEnum.TRASPASO
        });

        ok = !sameoperationtype;

        if (ok) {
            Self.OperationOK(true);
        } else {
            Self.OperationOK(false);
        }

        if ((Self.CurrentProduct().ProductTypeId() == ProductTypeEnum.PLANES) && ok) {
            var samedoproducttype = Self.listaOtherProducts().filter(function (elem) {
                return elem.ProductTypeId() == ProductTypeEnum.PLANES || elem.ProductTypeId() == ProductTypeEnum.EPSV;
            });

            var totalamount = 0;
            samedoproducttype.forEach(function (p) {
                p.ProductOperationList().forEach(function (op) {
                    if (op.IdOperationType() == OperationTypeEnum.APORTACION) {
                        totalamount += Utils.GetDecimalValue(op.Amount());
                    }
                });
            });

            var max = 8000;
            if (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.MINUSVALIDO) {
                max = 24250;
            }

            if (Utils.GetDecimalValue(totalamount) + Utils.GetDecimalValue(Self.CurrentEditOperation().Amount()) > max) {
                ok = false;
                Self.OperationAmountOK(false);
            } else {
                Self.OperationAmountOK(true);
            }

        } else {
            Self.OperationAmountOK(true);
        }

        return ok;
    }

    this.CurrentStep = "BasicData";
    this.StepsOrder = [];

    this.SetSteps = function () {
        if (Self.MainApplicant().ApplicantBasicData().ApplicantType() == ApplicantTypeEnum.FISICAEXTRANJERA) {
            Self.StepsOrder = [
                "BasicData",
                "PersonalData",
                "ContactData",
                "CoownerData",
                "AuthorizedData",
                "BeneficiaryData",
                "TutorData",
                "OperationData",
                "OperationIbanAssistedData",
                "TestData",
                "SignatureData",
                "SignatureDocumentData",
                "DocumentData",
                "Success",
                "Error"
            ];
        } else {
            Self.StepsOrder = [
                "BasicData",
                "ContactData",
                "AgentData",
                "InvestmentData",
                "Error"
            ];
        }
    };

    this.RemoveStep = function (step) {
        var index = this.StepsOrder.indexOf(step);
        if (index > 0) {
            this.StepsOrder.splice(index, 1);
        }
    };

    this.InsertStep = function (step, _index) {
        var index = this.StepsOrder.indexOf(step);
        if (index < 0) {
            this.StepsOrder.splice(_index, 0, step);
        }
    };

    this.SetStepsOrder = function () {
        if (this.Product().ProductTypeId() == ProductTypeEnum.FONDOS || this.Product().ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE) {
            this.RemoveStep('BeneficiaryData');
        }

        if (this.Product().ProductTypeId() == ProductTypeEnum.PLANES || this.Product().ProductTypeId() == ProductTypeEnum.EPSV) {
            this.RemoveStep('CoownerData');
            this.RemoveStep('AuthorizedData');
            this.RemoveStep('CoInheritorData');
            this.RemoveStep('UsufructuaryData');
            this.RemoveStep('TestData2');
        }
    };

    this.SetStepsTransferOrigin = function () {
        if ((Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO)) {
            Self.StepsOrder = [
                "BasicData",
                "PersonalData",
                "ContactData",
                "CoownerData",
                "AuthorizedData",
                "BeneficiaryData",
                "CoInheritorData",
                "UsufructuaryData",
                "TutorData",
                "OperationData",
                "OperationIbanAssistedData",
                "TestData1",
                "TestData2",
                "SignatureData",
                "SignatureDocumentData",
                "DocumentData",
                "Success",
                "Error"
            ];
        }
        if ((Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO)
            && (this.Product().ProductTypeId() == ProductTypeEnum.PLANES || this.Product().ProductTypeId() == ProductTypeEnum.EPSV)) {
            this.RemoveStep('CoownerData');
            this.RemoveStep('AuthorizedData');
            this.RemoveStep('CoInheritorData');
            this.RemoveStep('UsufructuaryData');
            this.RemoveStep('TestData2');
        }
        if ((Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO)
            && (this.Product().ProductTypeId() == ProductTypeEnum.FONDOS || this.Product().ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE)) {
            this.RemoveStep('CoownerData');
            this.RemoveStep('AuthorizedData');
            this.RemoveStep('BeneficiaryData');
        }
        else if (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.DONACION) {
            Self.StepsOrder = [
                "BasicData",
                "PersonalData",
                "ContactData",
                "BeneficiaryData",
                "CoownerData",
                "TutorData",
                "OperationData",
                "OperationIbanAssistedData",
                "TestData1",
                "TestData2",
                "SignatureData",
                "SignatureDocumentData",
                "DocumentData",
                "Success",
                "Error"
            ];
        }
        else if (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.MINUSVALIDO) {
            Self.StepsOrder = [
                "BasicData",
                "PersonalData",
                "ContactData",
                "BeneficiaryData",
                "TutorData",
                "OperationData",
                "OperationIbanAssistedData",
                "TestData1",
                "TestData2",
                "SignatureData",
                "SignatureDocumentData",
                "DocumentData",
                "Success",
                "Error"
            ];

            var types = Self.ProductModel().ProductTypeList().filter(function (elem) {
                return elem.Id() == ProductTypeEnum.PLANES || elem.Id() == ProductTypeEnum.EPSV
            })

            Self.ProductModel().ProductTypeList(types);
        }

        Self.SetStepsOrder();
    };

    this.SetStepsAdviceProducts = function () {
        Self.StepsOrder = [
            "BasicData",
            "PersonalData",
            "ContactData",
            "TutorData",
            "OperationIbanAssistedData",
            "TestData1",
            "SignatureData",
            "SignatureDocumentData",
            "DocumentData",
            "Success",
            "Error"
        ];

        Self.SetStepsOrder();
    }

    this.Init = function (crii, usercrii, mailcrii, ProductTypeList) {
        if (crii.toString() == 'false') {
            var operation = new OperationData(Self.CurrentProduct());
            Self.CurrentEditOperation(operation);
            Self.OperationIsEditing(true);
        }
        if (Self.CurrentProduct().ProductTypeId() == ProductTypeEnum.EPSV) {
            Self.MainApplicant().ApplicantContactData().PostalAddress().ValidateEPSVPostalCode(false);
            Self.MainApplicant().ApplicantContactData().FiscalAddress().ValidateEPSVPostalCode(true);
        }

        if (Self.CurrentProduct().ProductTypeId() == ProductTypeEnum.PLANES || Self.CurrentProduct().ProductTypeId() == ProductTypeEnum.EPSV) {
            Self.SpecialRequestApplicantType([
                new Valor(RequestApplicantTypeEnum.HEREDERO, "El solicitante es Heredero o Nudo Propietario"),
                new Valor(RequestApplicantTypeEnum.DONACION, "El solicitante está en un proceso de Donación"),
                new Valor(RequestApplicantTypeEnum.MINUSVALIDO, "Titular Minusválido")
            ]);
        } else {
            Self.SpecialRequestApplicantType([
                new Valor(RequestApplicantTypeEnum.HEREDERO, "El solicitante es Heredero o Nudo Propietario"),
                new Valor(RequestApplicantTypeEnum.DONACION, "El solicitante está en un proceso de Donación")
            ]);
        }

        Self.ProductModel(new ProductData(ProductTypeList));
        Self.ProductModel().ProfitabilityDisclaimer(sessionStorage.getItem("ProfitabilityDisclaimer"));
        Self.ProductModel().ProfitabilityDate(sessionStorage.getItem("ProfitabilityDate"));
        Self.ProductModel().ProfitabilityDateFIL(sessionStorage.getItem("ProfitabilityDateFIL"));
        Self.AltaCrii(crii.toString() == 'true');
        Self.UserCRII(usercrii);
        Self.MainApplicant().ApplicantBasicData().EmailCrii(mailcrii);
        if (Self.Product().ProductTypeId() == ProductTypeEnum.ASESORAMIENTOS) {
            Self.MainApplicant().ApplicantBasicData().EmailCriiEnabled(false);
            Self.MainApplicant().ApplicantBasicData().SpecialRequestApplicantTypeEnabled(false);
            Self.titleStep2('Cuenta asociada');
            Self.dataProgressStep2(0);
            Self.SignatureData().ShowSendingWays(false);
            Self.SignatureData().IdSendingWay(DocumentSendingWayEnum.ADJUNTAR);
        }
        Self.MainApplicant().ApplicantBasicData().ProductTypeId(Self.CurrentProduct().ProductTypeId());
        Self.MainApplicant().Id(Utils.generateUUID());
        Self.SetSteps();
        Self.SetStepsOrder();
        Self.IsFCRFlag(((Self.CurrentProduct().Id() == 25) && Self.CurrentProduct().Family() == 12 && crii.toString() == 'true'));
    };

    this.HideSpecificProductTabs = function () {
        if ((this.Product().ProductTypeId() == ProductTypeEnum.PLANES || this.Product().ProductTypeId() == ProductTypeEnum.EPSV)
            && Self.MainApplicant().ApplicantBasicData().RequestApplicantType() != RequestApplicantTypeEnum.HEREDERO) {
            $('#cotitular-content-head, #autorizado-content-head, #coheredero-content-head, #usufructuario-content-head').addClass('hidden');
        }
        else if ((this.Product().ProductTypeId() == ProductTypeEnum.PLANES || this.Product().ProductTypeId() == ProductTypeEnum.EPSV)
            && Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO) {
            $('#cotitular-content-head, #autorizado-content-head, #coheredero-content-head, #usufructuario-content-head').addClass('hidden');
        }
        else if ((this.Product().ProductTypeId() == ProductTypeEnum.FONDOS || this.Product().ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE)
            && (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO)) {
            $('#cotitular-content-head').removeClass('complete').addClass('hidden');
            $('#autorizado-content-head').removeClass('complete').addClass('hidden');
            $('#beneficiario-content-head').removeClass('complete').addClass('hidden');
        }
        else if (this.Product().ProductTypeId() == ProductTypeEnum.FONDOS && Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO) {
            $('#cotitular-content-head').removeClass('complete').addClass('hidden');
            $('#autorizado-content-head').removeClass('complete').addClass('hidden');
            $('#beneficiario-content-head').removeClass('complete').addClass('hidden');
        }
        else if ((this.Product().ProductTypeId() == ProductTypeEnum.FONDOS) && (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() != RequestApplicantTypeEnum.HEREDERO)
            && (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() != RequestApplicantTypeEnum.BENEFICIARIO)) {
            $('#coheredero-content-head, #usufructuario-content-head, #beneficiario-content-head').removeClass('complete').addClass('hidden');
        }
        else if (this.Product().ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE && Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.DONACION) {
            $('#coheredero-content-head, #usufructuario-content-head, #beneficiario-content-head').removeClass('complete').addClass('hidden');
        }
        else if (this.Product().ProductTypeId() == ProductTypeEnum.ASESORAMIENTOS) {
            $('#beneficiario-content-head, #operationtype-content-head').removeClass('complete').addClass('hidden');
        }
        else {
            $('#beneficiario-content-head').addClass('hidden');
        }
    }

    this.AvoidTutorQuestions = function (applicant) {

        if (applicant.ApplicantBasicData().RequestApplicantType() != RequestApplicantTypeEnum.TUTOR) {
            return false;
        }

        var cotitulartutor = Self.listaOtherApplicants().some(function (elem) { return (elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULAR && elem.Id() == applicant.Id()) });

        var tutorTitular = (Self.MainApplicant().ApplicantBasicData().DNI().toUpperCase() == applicant.ApplicantBasicData().DNI().toUpperCase());

        return (cotitulartutor || tutorTitular);
    };

    this.CheckDocumentApplicants = function () {
        var titulardni = Self.MainApplicant().ApplicantBasicData().DNI();
        var currentdni = Self.CurrentEditApplicant().ApplicantBasicData().DNI();
        var currentid = Self.CurrentEditApplicant().Id();
        var dniok = true;

        if (titulardni == currentdni) {
            dniok = false;
        }

        var samedni = Self.listaOtherApplicants().some(function (elem) {
            return (elem.ApplicantBasicData().DNI() == currentdni
                && elem.Id() != currentid)
        });

        if (samedni) {
            dniok = false;
        }

        return dniok;
    }

    this.CheckPhoneApplicants = function () {
        return true;
    }

    this.CheckMinor = function () {
        var minors = Self.listaOtherApplicants().some(function (elem) {
            return !elem.IsOlderThan18() && (
                elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TITULAR
                || elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULAR
                || elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COHEREDERO
                || elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.USUFRUCTUARIO
                || elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.MINUSVALIDO
            )
        });

        if (minors || !Self.MainApplicant().IsOlderThan18()) {
            if (this.Product().ProductTypeId() == ProductTypeEnum.FONDOS || this.Product().ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE) {

                if (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.DONACION) {
                    this.InsertStep('TutorData', 4);

                } else if (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO) {
                    this.InsertStep('TutorData', 5);

                } else
                    this.InsertStep('TutorData', 5);
                //this.InsertStep('TutorData', 5);
            }

            else if (this.Product().ProductTypeId() == ProductTypeEnum.PLANES || this.Product().ProductTypeId() == ProductTypeEnum.EPSV) {
                //if ((Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.MINUSVALIDO)
                //    || (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO)) {
                //    this.InsertStep('TutorData', 4);
                //}
                //else {
                //    this.InsertStep('TutorData', 4);
                //}
                this.InsertStep('TutorData', 4);
            }
        } else {
            this.RemoveStep('TutorData');
            //Si no hay menores hay que eliminar a los tutores de la lista de partícipes
            var elementstoremove = [];
            Self.listaOtherApplicants().forEach(function (a) {
                if (a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TUTOR) {
                    elementstoremove.push(Self.listaOtherApplicants.indexOf(a));
                }
            });
            elementstoremove.forEach(function (i) {
                Self.listaOtherApplicants.splice(i, 1);
            });
        }
    };

    this.CheckTutor = function () {
        Self.validateNow(true);
        var tutor = Self.listaOtherApplicants().some(function (elem) {
            return elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TUTOR
        });

        var minor = Self.listaOtherApplicants().some(function (elem) {
            return !elem.IsOlderThan18()
        }) || !Self.MainApplicant().IsOlderThan18();

        if (this.StepsOrder.indexOf("TutorData") > 0 && !tutor && Self.CurrentStep == "TutorData" && minor) {
            Self.TutorOk(false);
            return false;
        } else {
            Self.TutorOk(true);
            return true;
        }
    }

    this.CheckOperations = function () {

        var ok = true;

        var NoOperations = Self.listaOtherProducts().some(function (elem) {
            return elem.ProductOperationList().length == 0;
        });

        if (Self.CurrentStep == "OperationData" && NoOperations) {
            ok = false;
            Self.ListOperationOK(false);
            Self.OperationReciboAmountOK(true);
        } else {
            Self.ListOperationOK(true);
        }

        if (Self.CurrentStep == "OperationData" && ok) {
            Self.listaOtherProducts().forEach(function (p) {
                var traspasos = p.ProductOperationList().some(function (elem) { return elem.IdOperationType() == OperationTypeEnum.TRASPASO });
                var aportaciones = p.ProductOperationList().some(function (elem) { return elem.IdOperationType() == OperationTypeEnum.APORTACION });
                var recibos = p.ProductOperationList().some(function (elem) { return elem.IdOperationType() == OperationTypeEnum.RECIBO });

                if (!traspasos && !aportaciones && recibos && ok) {
                    var rec = p.ProductOperationList().find(function (elem) { return elem.IdOperationType() == OperationTypeEnum.RECIBO });
                    var value = Utils.GetDecimalValue(rec.MonthlyAmount());
                    if (value < 100) {
                        Self.OperationReciboAmountOK(false);
                        ok = false;
                    } else {
                        Self.OperationReciboAmountOK(true);
                    }
                } else {
                    Self.OperationReciboAmountOK(true);
                }
            });
        }

        return ok;
    };

    this.SetComplexityProducts = function (callback) {
        Self.listaOtherProducts().forEach(function (p) {
            if (p.ProductTypeId() == ProductTypeEnum.FONDOS || p.ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE) {
                MasterData.getQuestionsByProductSync(p.RDCode(), p.Family(), function (questions) {
                    var isComplexProduct = false;
                    if (questions.length) {
                        isComplexProduct = questions.every((x) => x.Family() >= 10);
                    }
                    p.ComplexProduct(isComplexProduct);
                });
            } else {
                p.ComplexProduct(false);
            }
        });
        callback();
    };

    this.CheckApplicantQuestions = function (callback) {
        var fondo = Self.listaOtherProducts().some(function (elem) {
            return elem.ProductTypeId() == ProductTypeEnum.FONDOS || elem.ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE;
        });

        var p = MasterData.getQuestions(1,
            Self.MainApplicant().ApplicantBasicData().RequestApplicantType(),
            fondo,
            Self.MainApplicant().IsOlderThan18()
        );

        var knowledgeTestSteps = [];
        var convenienceTestSteps = [];
        var indexToInsertSteps;
        var convenienceTestRequirement;

        p.then(function (result) {
            var indexsTodelete = [];

            $.map(Self.StepsOrder, function (val, i) {
                if (val.indexOf('TestData') != -1)
                    indexsTodelete.push(i);
            });

            var indexTest1 = Math.min.apply(null, indexsTodelete);
            indexToInsertSteps = indexTest1;
            Self.StepsOrder.splice(indexTest1, indexsTodelete.length);

            //TODO: Eliminar
            Self.MainApplicant().Test(result);
            //TODO

            Self.MainApplicant().KnowledgeTest(new KnowledgeTest(Self.MainApplicant()));
            Self.SetConvenienceTest(Self.MainApplicant());

            var mainApplicantTests = Self.GetTestStepsByApplicant(Self.MainApplicant());
            mainApplicantTests[0].forEach(function (step) { knowledgeTestSteps.push(step); });
            mainApplicantTests[1].forEach(function (step) { convenienceTestSteps.push(step); });

            Self.listaOtherApplicants().forEach(function (a, index) {
                if (!Self.AvoidTutorQuestions(a)) {
                    MasterData.getQuestionsSync(1, a.ApplicantBasicData().RequestApplicantType(), fondo, a.IsOlderThan18(), function (result) {
                        var fundOnlyProducts = Self.listaOtherProducts().filter(function (product) {
                            if (product.ProductTypeId() == ProductTypeEnum.FONDOS || product.ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE
                                || product.ProductTypeId() == ProductTypeEnum.PLANES || product.ProductTypeId() == ProductTypeEnum.EPSV) {
                                return true;
                            }
                            return false;
                        });

                        var maxProductType = Math.max.apply(null, fundOnlyProducts.map(function (product) {
                            return product.ProductTypeId();

                        }));

                        var productToCheck;
                        fundOnlyProducts.forEach(function (product) {
                            if (product.ProductTypeId() == maxProductType) {
                                productToCheck = product.RDCode();
                            }
                        });

                        Request.CheckConvenienceExistingApplicant(a.ApplicantBasicData().DNI(), productToCheck, function (data) {

                            convenienceTestRequirement = (data.ConvenientResponse.requireConvenienceTest == true && a.IsOlderThan18() == true) ? true : false;

                            //TODO: Eliminar
                            a.Test(result);
                            //TODO

                            if (a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULAR
                                || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULARYTUTOR
                                || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TITULARYTUTOR
                                || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDEROYTUTOR
                                || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COHEREDERO
                                || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COHEREDEROYTUTOR) {
                                a.KnowledgeTest(new KnowledgeTest(a));
                                if (convenienceTestRequirement != false || convenienceTestRequirement === undefined) {
                                    Self.SetConvenienceTest(a);
                                }
                            }

                            if (a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.AUTORIZADO
                                || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.BENEFICIARIO) {
                                a.KnowledgeTest(new KnowledgeTestRepresentative(a));
                                if (convenienceTestRequirement != false || convenienceTestRequirement === undefined) {
                                    Self.SetConvenienceTest(a);
                                }
                            }

                            if (a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TUTOR
                                || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.USUFRUCTUARIOANDTUTOR) {
                                a.KnowledgeTest(new KnowledgeTestTutor(a));
                                if (convenienceTestRequirement != false || convenienceTestRequirement === undefined) {
                                    Self.SetConvenienceTest(a);
                                }
                            }

                            if (a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.DONACION
                                || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO
                                || a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.MINUSVALIDO) {
                                a.KnowledgeTest(new KnowledgeTest(a));
                                if (convenienceTestRequirement != false || convenienceTestRequirement === undefined) {
                                    Self.SetConvenienceTest(a);
                                }
                            }

                            var applicantTests = Self.GetTestStepsByApplicant(a, convenienceTestRequirement);
                            applicantTests[0].forEach(function (step) { knowledgeTestSteps.push(step); });

                            if (convenienceTestRequirement != false || convenienceTestRequirement === undefined) {
                                applicantTests[1].forEach(function (step) { convenienceTestSteps.push(step); });
                            }

                            if (index === Self.listaOtherApplicants().length - 1) {
                                knowledgeTestSteps.forEach(function (step) {
                                    Self.StepsOrder.splice(indexToInsertSteps, 0, step);
                                    indexToInsertSteps++;
                                });

                                convenienceTestSteps.forEach(function (step) {
                                    Self.StepsOrder.splice(indexToInsertSteps, 0, step);
                                    indexToInsertSteps++;
                                });
                            }
                        });
                    });
                }
            });

            knowledgeTestSteps.forEach(function (step) {
                if (!Self.StepsOrder.includes(step)) {
                    Self.StepsOrder.splice(indexToInsertSteps, 0, step);
                    indexToInsertSteps++;
                }
            });

            convenienceTestSteps.forEach(function (step) {
                if (!Self.StepsOrder.includes(step)) {
                    Self.StepsOrder.splice(indexToInsertSteps, 0, step);
                    indexToInsertSteps++;
                }
            });

            if (!knowledgeTestSteps || knowledgeTestSteps.length === 0) {
                var text = "El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es<br/><br/>Muchas gracias.";
                Self.ErrorMessage(text);
                Self.StepsOrder.splice(indexToInsertSteps, 0, 'Error');
            }

            if (callback) {
                callback(result);
            }
        });
    };

    this.GetTestStepsByApplicant = function (applicant, convenienceTestRequirement) {
        var steps = [[], []];
        if (applicant.ApplicantHasTest(TestTypeEnum.CONOCIMIENTO, convenienceTestRequirement)) {
            steps[0].push('TestData1-' + applicant.ApplicantBasicData().DNI() + applicant.ApplicantBasicData().RequestApplicantType());
        }

        var convenienceIxdex = 2;
        if (applicant.ApplicantHasTest(TestTypeEnum.CONVENIENCIA, convenienceTestRequirement) && (convenienceTestRequirement != false || convenienceTestRequirement === undefined)) {
            applicant.ConvenienceTestList().forEach(function (test) {
                steps[1].push('TestData' + convenienceIxdex + "-" + applicant.ApplicantBasicData().DNI() + applicant.ApplicantBasicData().RequestApplicantType());
                convenienceIxdex++;
            });
        }

        return steps;
    }

    this.GroupingProductTypes = function () {
        var listaProductos = Self.listaOtherProducts().filter(function (p) {
            return p.ProductTypeId() == ProductTypeEnum.FONDOS || p.ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE
        });

        var types = listaProductos.map(function (item) {
            return item.ComplexProduct();
        }).filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });

        return types;
    };

    this.GroupingProductFamilies = function () {
        var listaProductos = Self.listaOtherProducts().filter(function (p) {
            return p.ProductTypeId() == ProductTypeEnum.FONDOS || p.ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE
        });

        var types = listaProductos.map(function (item) {
            return item.Family();
        }).filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });

        return types;
    };

    this.SetConvenienceTest = function (applicant) {
        applicant.ConvenienceTestList([]);
        var families = Self.GroupingProductFamilies();
        var orderFamilies = families.sort(function (a, b) { return b - a });
        var isAltaCrii = Self.AltaCrii();

        orderFamilies.forEach(function (family) {
            var currentProduct;

            var productIsComplex = Self.listaOtherProducts().find(function (product) {
                if (product.Family() == family) {
                    currentProduct = product
                }
                return product.Family() == family;
            }).ComplexProduct();
            var minAmount;
            var minor = vm.CheckAllTitularMinors();

            if (minor) {
                minAmount = currentProduct.MinorMin();
            } else {
                minAmount = currentProduct.AdultMin();
            }

            var isEmployee = Self.CurrentEditOperation().IsEmployee();
            var newConveniencetest = (family != 12) ? new ConvenienceTest(family, family, productIsComplex, isAltaCrii)
                : new ConvenienceTestInfra(family, family, productIsComplex, isEmployee, isAltaCrii, currentProduct.Id(), minAmount, currentProduct.SubFamilyProductId());
            newConveniencetest.Init();
            applicant.ConvenienceTestList().push(newConveniencetest);
        });
    };

    this.CheckApplicantType = function (nextstep) {
        switch (nextstep) {
            case "CoownerData":
                Self.CurrentType(RequestApplicantTypeEnum.COTITULAR);
                break;
            case "CoInheritorData":
                Self.CurrentType(RequestApplicantTypeEnum.COHEREDERO);
                break;
            case "AuthorizedData":
                Self.CurrentType(RequestApplicantTypeEnum.AUTORIZADO);
                break;
            case "UsufructuaryData":
                Self.CurrentType(RequestApplicantTypeEnum.USUFRUCTUARIO);
                break;
            case "HeirAndTutorData":
                Self.CurrentType(RequestApplicantTypeEnum.HEREDEROYTUTOR);
                break;
            case "CoInheritorAndTutorData":
                Self.CurrentType(RequestApplicantTypeEnum.COHEREDEROYTUTOR);
                break;
            case "UsufructuaryAndTutorData":
                Self.CurrentType(RequestApplicantTypeEnum.USUFRUCTUARIOYTUTOR);
                break;
            case "TutorData":
                Self.CurrentType(RequestApplicantTypeEnum.TUTOR);
                break;
            case "BeneficiaryData":
                Self.CurrentType(RequestApplicantTypeEnum.BENEFICIARIO);
                break;
            case "AgentData":
                Self.CurrentType(6);
                break;
            default:
                Self.CurrentType(Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType());
                break;
        }
    };

    this.CheckSignatureType = function () {
        //Si no es firma online termina el proceso
        if (Self.CurrentStep == "SignatureData" && Self.SignatureData().IdDocumentSignatureType() == DocumentSignatureTypeEnum.MANUSCRITA) {
            Self.CurrentStep = "Success";
        }
    };

    this.CheckAmountValidValue = function () {
        var allminors = Self.CheckAllTitularMinors();
        Self.CurrentEditOperation().SetAmountValidValues(allminors, Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.MINUSVALIDO);
    };

    this.CheckAllTitularMinors = function () {
        var minors = true;

        var cotitulares = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.COTITULAR);

        if (cotitulares.length > 0) {
            var minors = cotitulares.every(function (elem) {
                return !elem.IsOlderThan18();
            });
        }

        return minors && !Self.MainApplicant().IsOlderThan18();
    }

    this.CheckResidentSpain = function () {
        if (Self.CurrentStep == 'PersonalData') {
            if (Self.MainApplicant().ApplicantPersonalData().IsResident() == 'true') {
                Self.MainApplicant().ApplicantContactData().FiscalAddress().ValidateResident(true);
            } else {
                Self.MainApplicant().ApplicantContactData().FiscalAddress().ValidateResident(false);
            }
        }
    };

    this.GetApplicantsByRequestApplicantType = function (RequestApplicantType) {
        var applicants = Self.listaOtherApplicants().filter(function (elem) {
            return elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantType
        });

        return applicants;
    };

    this.SetPerfiles = function () {
        var perfiles = '';
        var coowners = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.COTITULAR);
        var coInheritors = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.COHEREDERO);
        var usufructuaries = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.USUFRUCTUARIO);
        var heirAndTutors = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.HEREDEROYTUTOR);
        var coInheritorsAndTutors = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.COHEREDEROYTUTOR);
        var usufructuariesAndTutor = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.USUFRUCTUARIOYTUTOR);
        var authorized = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.AUTORIZADO);
        var beneficiaries = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.BENEFICIARIO);
        var tutors = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.TUTOR);

        if (coowners.length > 0) {
            perfiles = perfiles + "co;";
        }
        if (coInheritors.length > 0) {
            perfiles = perfiles + "ow;";
        }
        if (usufructuaries.length > 0) {
            perfiles = perfiles + "us;";
        }
        if (heirAndTutors.length > 0) {
            perfiles = perfiles + "ht;";
        }
        if (coInheritorsAndTutors.length > 0) {
            perfiles = perfiles + "ot;";
        }
        if (usufructuariesAndTutor.length > 0) {
            perfiles = perfiles + "ut;";
        }
        if (authorized.length > 0) {
            perfiles = perfiles + "au;";
        }
        if (beneficiaries.length > 0) {
            perfiles = perfiles + "be;";
        }
        if (tutors.length > 0) {
            perfiles = perfiles + "tu;";
        }

        if (perfiles != '') {
            perfiles = perfiles.slice(0, -1);
        }

        window.setDatalayerItem('perfiles', perfiles);
    };

    this.TaggApplicant = function (currentstep, previuousstep) {

        var array_datalayer_applicant = {
            tipoUsuario: "",
            nacionalidadPais: "",
            nacimiento: "",
            codigoPostal: "",
            sexo: "",
            direccion: "",
            tipoFirma: "",
            pais: "",
            provincia: "",
            ciudad: "",
            paisNacimiento: "",
            nacionalidad: ""
        };

        switch (currentstep) {

            case "CoownerData":
                GMT.Push(PageEnum.COTITULARES);
                break;

            case "CoInheritorData":
                GMT.Push(PageEnum.COHEREDEROS);
                break;

            case "UsufructuaryData":
                GMT.Push(PageEnum.USUFRUCTUARIOS);
                break;


            case "AuthorizedData":
                array_datalayer_applicant["tipoUsuario"] = "cotitular";
                array_datalayer_applicant["tipoFirma"] = Self.SignatureType() == '1' ? 'Operaciones: Indistinta' : 'Operaciones: Conjunta';
                var coowners = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.COTITULAR);
                coowners.forEach(function (a) {
                    array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"]
                        + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                        + '-' + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                        + '-' + (a.ApplicantPersonalData().IsResident() == 'true' ? 'si' : 'no')
                        + ';';

                    array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"]
                        + a.ApplicantPersonalData().Birthday().Year()
                        + ';';

                    array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"] +
                        (!a.IsDifferentAddress() ? '' : a.ApplicantContactData().FiscalAddress().PostalCode())
                        + ';';

                    array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"]
                        + a.ApplicantPersonalData().Gender().id == 1 ? 'hombre;' : 'mujer;';

                    array_datalayer_applicant["direccion"] = !a.IsDifferentAddress() ? '' :
                        'fiscal:' + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                        + ':' + a.ApplicantContactData().FiscalAddress().Province().toLowerCase()
                        + ':' + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                        + ';';

                    array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"]
                        + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                        + ';';

                    array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"]
                        + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                        + ';';

                    array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"]
                        + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                        + ';';

                    array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"]
                        + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                        + ';';
                });
                array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"].slice(0, -1);
                array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"].slice(0, -1);
                array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"].slice(0, -1);
                array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"].slice(0, -1);
                array_datalayer_applicant["direccion"] = array_datalayer_applicant["direccion"].slice(0, -1);
                array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"].slice(0, -1);
                array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"].slice(0, -1);
                array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"].slice(0, -1);
                array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"].slice(0, -1);
                array_datalayer_applicant["tipoDireccion"] = "fiscal";
                GMT.PushByApplicant(PageEnum.AUTORIZADOS, array_datalayer_applicant);
                break;

            case "BeneficiaryData":
                GMT.Push(PageEnum.BENEFICIARIOS);
                break;

            case "TutorData":
                switch (previuousstep) {
                    case "AuthorizedData":
                        array_datalayer_applicant["tipoUsuario"] = "autorizado";
                        var authorized = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.AUTORIZADO);
                        authorized.forEach(function (a) {
                            array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"]
                                + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                                + '-' + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                                + '-' + (a.ApplicantPersonalData().IsResident() == 'true' ? 'si' : 'no')
                                + ';';

                            array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"]
                                + a.ApplicantPersonalData().Birthday().Year()
                                + ';';

                            array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"] +
                                (!a.IsDifferentAddress() ? '' : a.ApplicantContactData().FiscalAddress().PostalCode())
                                + ';';

                            array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"]
                                + a.ApplicantPersonalData().Gender().id == 1 ? 'hombre;' : 'mujer;';

                            array_datalayer_applicant["direccion"] = !a.IsDifferentAddress() ? '' :
                                'fiscal:' + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                                + ':' + a.ApplicantContactData().FiscalAddress().Province().toLowerCase()
                                + ':' + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                                + ';';

                            array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"]
                                + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                                + ';';

                            array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"]
                                + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                                + ';';

                            array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"]
                                + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                                + ';';

                            array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"]
                                + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                                + ';';
                        });
                        array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"].slice(0, -1);
                        array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"].slice(0, -1);
                        array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"].slice(0, -1);
                        array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"].slice(0, -1);
                        array_datalayer_applicant["direccion"] = array_datalayer_applicant["direccion"].slice(0, -1);
                        array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"].slice(0, -1);
                        array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"].slice(0, -1);
                        array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"].slice(0, -1);
                        array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"].slice(0, -1);
                        array_datalayer_applicant["tipoDireccion"] = "fiscal";
                        GMT.PushByApplicant(PageEnum.TUTORES, array_datalayer_applicant);
                        break;

                    case "BeneficiaryData":
                        array_datalayer_applicant["tipoUsuario"] = "beneficiario";
                        var beneficiaries = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.BENEFICIARIO);
                        beneficiaries.forEach(function (a) {
                            array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"]
                                + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                                + '-' + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                                + '-' + (a.ApplicantPersonalData().IsResident() == 'true' ? 'si' : 'no')
                                + ';';

                            array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"]
                                + a.ApplicantPersonalData().Birthday().Year()
                                + ';';

                            array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"] +
                                (!a.IsDifferentAddress() ? '' : a.ApplicantContactData().FiscalAddress().PostalCode())
                                + ';';

                            array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"]
                                + a.ApplicantPersonalData().Gender().id == 1 ? 'hombre;' : 'mujer;';

                            array_datalayer_applicant["direccion"] = !a.IsDifferentAddress() ? '' :
                                'fiscal:' + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                                + ':' + a.ApplicantContactData().FiscalAddress().Province().toLowerCase()
                                + ':' + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                                + ';';

                            array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"]
                                + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                                + ';';

                            array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"]
                                + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                                + ';';

                            array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"]
                                + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                                + ';';

                            array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"]
                                + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                                + ';';
                        });
                        array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"].slice(0, -1);
                        array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"].slice(0, -1);
                        array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"].slice(0, -1);
                        array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"].slice(0, -1);
                        array_datalayer_applicant["direccion"] = array_datalayer_applicant["direccion"].slice(0, -1);
                        array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"].slice(0, -1);
                        array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"].slice(0, -1);
                        array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"].slice(0, -1);
                        array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"].slice(0, -1);
                        array_datalayer_applicant["tipoDireccion"] = "fiscal";
                        GMT.PushByApplicant(PageEnum.TUTORES, array_datalayer_applicant);
                        break;

                    case "UsufructuaryData":
                        array_datalayer_applicant["tipoUsuario"] = "usufructuario";
                }
                break;

            case "OperationData":

                Self.SetPerfiles();

                switch (previuousstep) {

                    case "TutorData":
                        array_datalayer_applicant["tipoUsuario"] = "tutor";
                        var tutors = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.TUTOR);
                        tutors.forEach(function (a) {
                            array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"]
                                + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                                + '-' + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                                + '-' + (a.ApplicantPersonalData().IsResident() == 'true' ? 'si' : 'no')
                                + ';';

                            array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"]
                                + a.ApplicantPersonalData().Birthday().Year()
                                + ';';

                            array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"] +
                                (!a.IsDifferentAddress() ? '' : a.ApplicantContactData().FiscalAddress().PostalCode())
                                + ';';

                            array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"]
                                + a.ApplicantPersonalData().Gender().id == 1 ? 'hombre;' : 'mujer;';

                            array_datalayer_applicant["direccion"] = !a.IsDifferentAddress() ? '' :
                                'fiscal:' + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                                + ':' + a.ApplicantContactData().FiscalAddress().Province().toLowerCase()
                                + ':' + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                                + ';';

                            array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"]
                                + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                                + ';';

                            array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"]
                                + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                                + ';';

                            array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"]
                                + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                                + ';';

                            array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"]
                                + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                                + ';';
                        });
                        array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"].slice(0, -1);
                        array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"].slice(0, -1);
                        array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"].slice(0, -1);
                        array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"].slice(0, -1);
                        array_datalayer_applicant["direccion"] = array_datalayer_applicant["direccion"].slice(0, -1);
                        array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"].slice(0, -1);
                        array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"].slice(0, -1);
                        array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"].slice(0, -1);
                        array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"].slice(0, -1);
                        array_datalayer_applicant["tipoDireccion"] = "fiscal";
                        GMT.PushByApplicant(PageEnum.TIPO_OPERACION, array_datalayer_applicant);
                        break;

                    case "BeneficiaryData":
                        array_datalayer_applicant["tipoUsuario"] = "beneficiario";
                        var beneficiaries = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.BENEFICIARIO);
                        beneficiaries.forEach(function (a) {
                            array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"]
                                + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                                + '-' + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                                + '-' + (a.ApplicantPersonalData().IsResident() == 'true' ? 'si' : 'no')
                                + ';';

                            array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"]
                                + a.ApplicantPersonalData().Birthday().Year()
                                + ';';

                            array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"] +
                                (!a.IsDifferentAddress() ? '' : a.ApplicantContactData().FiscalAddress().PostalCode())
                                + ';';

                            array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"]
                                + a.ApplicantPersonalData().Gender().id == 1 ? 'hombre;' : 'mujer;';

                            array_datalayer_applicant["direccion"] = !a.IsDifferentAddress() ? '' :
                                'fiscal:' + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                                + ':' + a.ApplicantContactData().FiscalAddress().Province().toLowerCase()
                                + ':' + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                                + ';';

                            array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"]
                                + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                                + ';';

                            array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"]
                                + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                                + ';';

                            array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"]
                                + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                                + ';';

                            array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"]
                                + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                                + ';';
                        });
                        array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"].slice(0, -1);
                        array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"].slice(0, -1);
                        array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"].slice(0, -1);
                        array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"].slice(0, -1);
                        array_datalayer_applicant["direccion"] = array_datalayer_applicant["direccion"].slice(0, -1);
                        array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"].slice(0, -1);
                        array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"].slice(0, -1);
                        array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"].slice(0, -1);
                        array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"].slice(0, -1);
                        array_datalayer_applicant["tipoDireccion"] = "fiscal";
                        GMT.PushByApplicant(PageEnum.TIPO_OPERACION, array_datalayer_applicant);
                        break;

                    case "AuthorizedData":
                        array_datalayer_applicant["tipoUsuario"] = "autorizado";
                        var authorized = Self.GetApplicantsByRequestApplicantType(RequestApplicantTypeEnum.AUTORIZADO);
                        authorized.forEach(function (a) {
                            array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"]
                                + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                                + '-' + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                                + '-' + (a.ApplicantPersonalData().IsResident() == 'true' ? 'si' : 'no')
                                + ';';

                            array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"]
                                + a.ApplicantPersonalData().Birthday().Year()
                                + ';';

                            array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"] +
                                (!a.IsDifferentAddress() ? '' : a.ApplicantContactData().FiscalAddress().PostalCode())
                                + ';';

                            array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"]
                                + a.ApplicantPersonalData().Gender().id == 1 ? 'hombre;' : 'mujer;';

                            array_datalayer_applicant["direccion"] = !a.IsDifferentAddress() ? '' :
                                'fiscal:' + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                                + ':' + a.ApplicantContactData().FiscalAddress().Province().toLowerCase()
                                + ':' + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                                + ';';

                            array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"]
                                + MasterData.getCountryNameById(a.ApplicantContactData().FiscalAddress().CountryId()).toLowerCase()
                                + ';';

                            array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"]
                                + a.ApplicantContactData().FiscalAddress().City().toLowerCase()
                                + ';';

                            array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"]
                                + a.ApplicantPersonalData().Country().valor.substring(0, 2).toLowerCase()
                                + ';';

                            array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"]
                                + a.ApplicantPersonalData().Nationality().valor.substring(0, 2).toLowerCase()
                                + ';';
                        });
                        array_datalayer_applicant["nacionalidadPais"] = array_datalayer_applicant["nacionalidadPais"].slice(0, -1);
                        array_datalayer_applicant["nacimiento"] = array_datalayer_applicant["nacimiento"].slice(0, -1);
                        array_datalayer_applicant["codigoPostal"] = array_datalayer_applicant["codigoPostal"].slice(0, -1);
                        array_datalayer_applicant["sexo"] = array_datalayer_applicant["sexo"].slice(0, -1);
                        array_datalayer_applicant["direccion"] = array_datalayer_applicant["direccion"].slice(0, -1);
                        array_datalayer_applicant["pais"] = array_datalayer_applicant["pais"].slice(0, -1);
                        array_datalayer_applicant["ciudad"] = array_datalayer_applicant["ciudad"].slice(0, -1);
                        array_datalayer_applicant["paisNacimiento"] = array_datalayer_applicant["paisNacimiento"].slice(0, -1);
                        array_datalayer_applicant["nacionalidad"] = array_datalayer_applicant["nacionalidad"].slice(0, -1);
                        array_datalayer_applicant["tipoDireccion"] = "fiscal";
                        GMT.PushByApplicant(PageEnum.TIPO_OPERACION, array_datalayer_applicant);
                        break;
                }
                break;
        }
    };

    this.CheckCoownersProductTypes = function () {
        var cotitulares = Self.listaOtherApplicants().some(function (elem) { return elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULAR });

        if (cotitulares) {
            var types = Self.ProductModel().ProductTypeList().filter(function (elem) {
                return elem.Id() == ProductTypeEnum.FONDOS || elem.Id() == ProductTypeEnum.INVERSIONLIBRE
            });

            Self.ProductModel().ProductTypeList(types);

            var productsnofp = Self.listaOtherProducts().filter(function (elem) {
                return elem.ProductTypeId() == ProductTypeEnum.FONDOS ||
                    elem.ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE
            });

            Self.listaOtherProducts(productsnofp);

        } else {
            if (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() != RequestApplicantTypeEnum.HEREDERO
                && Self.MainApplicant().ApplicantBasicData().RequestApplicantType() != RequestApplicantTypeEnum.DONACION
                && Self.MainApplicant().ApplicantBasicData().RequestApplicantType() != RequestApplicantTypeEnum.MINUSVALIDO) {

                Self.ProductModel().ProductTypeList(MasterData.ProductTypeList());
            }
        }
    };

    this.goToNextStep = function (callback, notValidCallback) {
        Self.CheckSignatureType();
        Self.CheckResidentSpain();

        Navigation.DisableReload = true;

        var currentStepOrder = this.StepsOrder.indexOf(this.CurrentStep);
        var previousStep = this.StepsOrder[(currentStepOrder > 0) ? currentStepOrder - 1 : 0];

        if (currentStepOrder < (this.StepsOrder.length - 1)) {

            if ((this.StepsOrder[currentStepOrder + 1] == 'OperationData' && Self.AltaCrii())
                || (this.StepsOrder[currentStepOrder + 1] == 'OperationIbanAssistedData' && Self.AltaCrii())) {
                Self.CheckCoownersProductTypes();
            }

            Self.TaggApplicant(this.StepsOrder[currentStepOrder + 1], this.StepsOrder[currentStepOrder]);

            if (!Self.CheckTutor()) {
                if (typeof notValidCallback === 'function' && notValidCallback) {
                    notValidCallback();
                }
            }

            this.CheckMinor();

            if (this.StepsOrder[currentStepOrder] == 'ContactData') {
                Self.AddTitularAsTutor(Self.MainApplicant());
            }

            if (this.StepsOrder[currentStepOrder] == 'PersonalData') {

                MasterData.UpdateOperationTypeList(Self.Product().Family(), Self.Product().ProductTypeId(), Self.MainApplicant().ApplicantPersonalData().IsResident() == 'true').then(function (result) {
                    if (result) {
                        if (Self.MainApplicant().ApplicantPersonalData().IsResident() == 'false') {
                            Self.listaOtherProducts().forEach(function (p) {
                                if (p.ProductTypeId() == ProductTypeEnum.FONDOS || p.ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE) {
                                    var operationstoremove = [];

                                    p.ProductOperationList().forEach(function (op) {
                                        if (op.IdOperationType() == OperationTypeEnum.TRASPASO) {
                                            operationstoremove.push(op);
                                            Self.CurrentEditOperation(new OperationData(Self.Product()));
                                            InitInvestmentAutocomplete(p.ProductTypeId());
                                            window.SetCleaveClass();
                                            Self.CheckAmountValidValue();
                                        }
                                    });

                                    operationstoremove.forEach(function (i) {
                                        p.ProductOperationList.splice(i, 1);
                                    });
                                }
                            });
                        }
                    }
                });

                Self.CheckAmountValidValue();
            }

            Self.CheckApplicantType(this.StepsOrder[currentStepOrder + 1]);

            if (Self.CurrentType() == RequestApplicantTypeEnum.TUTOR) {
                var tutors = Self.listaOtherApplicants().some(function (elem) {
                    return elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TUTOR
                });

                if (!tutors) {
                    Self.radioSelectedOptionValue('S');
                } else {
                    Self.radioSelectedOptionValue('N');
                }
            } else {
                Self.radioSelectedOptionValue('N');
            }

            if (this.CurrentStep == 'OperationData' || this.CurrentStep == 'OperationIbanAssistedData') {
                var _this = this;
                this.SetComplexityProducts(function () {
                    _this.CheckApplicantQuestions(function () {
                        Navigation.NextStep(_this.CurrentStep, _this.StepsOrder[currentStepOrder + 1]);
                        if (typeof callback === 'function' && callback) {
                            callback();
                        }
                    });
                })
            } else {
                if (this.CurrentStep.indexOf('TestData') == 0 && !Self.CurrentApplicant().ValidateApplicantTest(Self.CurrentTypeTest())) {
                    window.scrollError();
                    if (typeof notValidCallback === 'function' && notValidCallback) {
                        notValidCallback();
                    }
                } else {
                    if (Self.CheckConvenience()) {
                        var nextStep = this.StepsOrder[currentStepOrder + 1];
                        if (nextStep == 'SignatureData') {
                            Self.CreateRequestData();
                        }
                        else {
                            Navigation.NextStep(this.CurrentStep, nextStep);
                            if (typeof callback === 'function' && callback) {
                                callback();
                            }
                        }
                    }
                }
            }
        }

        customDebug(vm.RequestId(), this.StepsOrder[currentStepOrder + 1]);
    };

    this.CheckConvenience = function (step) {
        var convenienceResult = false;
        var allowcontinue = true;
        var productToCheck;
        var substep = Self.CurrentStep.split('-')[0];
        var testType = substep.substr(substep.length - 1);
        var families = Self.GroupingProductFamilies();

        if (!isNaN(testType) && testType > 1) {
            if (families.length == 1) {

                var family = families[0];
                productToCheck = Self.listaOtherProducts().find(function (product) {
                    return product.Family() == family;
                });

                Request.CheckConvenience(productToCheck.RDCode(), Self.CurrentConvenienceTest().getQuestionsAnswer(false), function (result) {
                    convenienceResult = result;
                });

                if (Self.CurrentConvenienceTest().IsComplex() && convenienceResult == false) {
                    if (Self.CurrentConvenienceTest().ConvenienceResult() == undefined || Self.CurrentConvenienceTest().ConvenienceResult() == true) {
                        Self.CurrentConvenienceTest().showConfirmQuestion(true)
                        allowcontinue = false;
                    } else {
                        allowcontinue = true;
                    }
                }

                if (Self.CurrentConvenienceTest().IsComplex() && convenienceResult == undefined) {
                    if (Self.CurrentConvenienceTest().ConvenienceResult() == undefined || Self.CurrentConvenienceTest().ConvenienceResult() == true) {
                        Self.CurrentConvenienceTest().showConfirmQuestion(true);
                        convenienceResult = false
                        allowcontinue = false;
                    } else {
                        allowcontinue = true;
                    }
                }

                Self.CurrentConvenienceTest().ConvenienceResult(convenienceResult);

            } else {
                var currentFamily = Self.CurrentConvenienceTest().Family();
                productToCheck = Self.listaOtherProducts().find(function (product) {
                    return product.Family() == currentFamily;
                });

                Request.CheckConvenience(productToCheck.RDCode(), Self.CurrentConvenienceTest().getQuestionsAnswer(false), function (result) {
                    convenienceResult = result;
                });

                if (convenienceResult) {
                    //Eliminar el resto de tests, ya que el más restrictivo ya es conveniente
                    Self.CurrentApplicant().ConvenienceTestList().forEach(function (test) {
                        if (test.Family() < currentFamily)
                            test.SkipTest(true);
                    });

                    var dni = Self.CurrentStep.split('-')[1].slice(0, -1);
                    var stepsToRemove = [];
                    var stepIndex = Self.StepsOrder.indexOf(Self.CurrentStep) + 1;
                    for (var i = stepIndex; i < Self.StepsOrder.length; i++) {
                        if (Self.StepsOrder[i].indexOf(dni) >= 0) {
                            stepsToRemove.push(i);
                        }
                    }
                    Self.StepsOrder.splice(stepIndex, stepsToRemove.length);
                    allowcontinue = true;
                } else {
                    //Pedimos la confirmación de que el usuario entiende el resultado de la conveniencia en caso de ser producto complejo
                    if (Self.CurrentConvenienceTest().IsComplex() && convenienceResult == false) {
                        if (Self.CurrentConvenienceTest().ConvenienceResult() == undefined || Self.CurrentConvenienceTest().ConvenienceResult() == true) {
                            Self.CurrentConvenienceTest().showConfirmQuestion(true);
                            convenienceResult = false
                            allowcontinue = false;
                        } else {
                            allowcontinue = true;
                        }
                    }

                    if (Self.CurrentConvenienceTest().IsComplex() && convenienceResult == undefined) {
                        if (Self.CurrentConvenienceTest().ConvenienceResult() == undefined || Self.CurrentConvenienceTest().ConvenienceResult() == true) {
                            Self.CurrentConvenienceTest().showConfirmQuestion(true);
                            convenienceResult = false
                            allowcontinue = false;
                        } else {
                            allowcontinue = true;
                        }
                    }

                    //Añadir tests que hayamos podido eliminar previamente
                    var index = Self.StepsOrder.indexOf(Self.CurrentStep);
                    Self.CurrentApplicant().ConvenienceTestList().forEach(function (test) {
                        if (test.Family() < currentFamily && test.SkipTest()) {
                            test.SkipTest(false);
                            index++;
                            testType++;
                            Self.StepsOrder.splice(index, 0, "TestData" + testType + "-" + Self.CurrentStep.split('-')[1]);
                        }
                    });

                    Self.CurrentApplicant().ConvenienceTestList().forEach(function (test) {
                        if (test.Family() != currentFamily)
                            test.AutoCompleteCommonQuestionsFromPreviousTest(Self.CurrentConvenienceTest());
                    });

                    Self.CurrentConvenienceTest().ConvenienceResult(convenienceResult);
                }
            }
        }
        return allowcontinue;
    };

    this.ShowCurrentStep = function (_currentStep, callback) {
        Self.CheckSignatureType();
        Self.CheckResidentSpain();

        var currentStepOrder = this.StepsOrder.indexOf(_currentStep);
        var previousStep = this.StepsOrder[(currentStepOrder > 0) ? currentStepOrder - 1 : 0];

        if (previousStep.indexOf('TestData') == 0 && !Self.CurrentApplicant().ValidateApplicantTest(Self.CurrentTypeTest())) {
            window.scrollError();
        } else {
            this.CurrentStep = _currentStep;

            currentStepOrder = this.StepsOrder.indexOf(this.CurrentStep);
            previousStep = this.StepsOrder[(currentStepOrder > 0) ? currentStepOrder - 1 : 0];

            if (currentStepOrder < (this.StepsOrder.length - 1)) {

                Self.TaggApplicant(this.StepsOrder[currentStepOrder + 1], this.StepsOrder[currentStepOrder]);

                if (!Self.CheckTutor()) {
                    return false;
                }

                this.CheckMinor();

                if (this.StepsOrder[currentStepOrder] == 'PersonalData') {
                    this.CheckAmountValidValue();
                }

                Self.CheckApplicantType(this.StepsOrder[currentStepOrder + 1]);

                if (Self.CurrentType() == RequestApplicantTypeEnum.TUTOR) {
                    var tutors = Self.listaOtherApplicants().some(function (elem) {
                        return elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TUTOR
                    });

                    if (!tutors) {
                        Self.radioSelectedOptionValue('S');
                    } else {
                        Self.radioSelectedOptionValue('N');
                    }
                } else {
                    Self.radioSelectedOptionValue('N');
                }

                var nextStep = this.StepsOrder[currentStepOrder + 1];
                Navigation.ShowNextStep(this.CurrentStep, nextStep);
                if (typeof callback === 'function' && callback) {
                    callback();
                }
            }
        }
    };

    this.ShowApplicantTest = function (testType, dni) {
        Self.CurrentTypeTest(testType);
        if (Self.MainApplicant().ApplicantBasicData().DNI().toUpperCase() + Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == dni.toUpperCase()) {
            Self.SetApplicantTest(Self.MainApplicant(), testType);
        } else {
            var applicant = Self.listaOtherApplicants().find(function (elem) {
                return elem.ApplicantBasicData().DNI().toUpperCase() + elem.ApplicantBasicData().RequestApplicantType() == dni.toUpperCase()
            });
            Self.SetApplicantTest(applicant, testType);
        }
    };

    this.SetApplicantTest = function (applicant, testType) {
        Self.CurrentApplicant(applicant);
        Self.CurrentKnowledgeTest(applicant.KnowledgeTest());

        // Obtenemos el test anterior antes de cambiar al nuevo
        var previousConvenienceTest = Self.CurrentConvenienceTest();

        // Cambiamos al nuevo test
        Self.CurrentConvenienceTest(applicant.GetCurrentConvenienceTest(testType));

        // Si existe un test anterior y el actual no es el mismo, copiar respuestas comunes
        if (previousConvenienceTest &&
            Self.CurrentConvenienceTest() &&
            previousConvenienceTest.Family() !== Self.CurrentConvenienceTest().Family()) {

            // Ejecutar la copia después de un breve delay para asegurar que la UI esté lista
            setTimeout(function () {
                Self.CurrentConvenienceTest().AutoCompleteCommonQuestionsFromPreviousTest(previousConvenienceTest);

                // Forzar actualización de la UI de Knockout
                Self.CurrentConvenienceTest.valueHasMutated();
            }, 100);
        }

        Self.CurrentConvenienceSecondTest(Self.CurrentApplicant().ConvenienceSecondTest());

        window.SetCleaveClass();
    };

    this.goToPrevioustStep = function () {
        if (Self.CurrentStep.indexOf('TestData2') == 0) {
            if (Self.CurrentConvenienceTest().IsComplex()) {
                Self.CurrentConvenienceTest().ConvenienceResult(undefined);
                Self.CurrentConvenienceTest().NoCovenienceConfirmQuestion().questionOK(true);
            }
        }
        history.back();
    };

    this.FillSignatureDataMobiles = function () {
        if (Self.MainApplicant().ApplicantBasicData().MobilePhoneNumber() != ''
            && Self.MainApplicant().ApplicantBasicData().MobilePhoneNumber() != undefined
            && Self.MainApplicant().IsOlderThan18()) {
            var mb = new SignatureDataConfirmPhone(Self.MainApplicant().ApplicantBasicData().MobilePhonePrefix(),
                Self.MainApplicant().ApplicantBasicData().MobilePhoneNumber(),
                Self.MainApplicant().ApplicantBasicData().FullName(),
                Self.MainApplicant().ApplicantBasicData().DNI(),
                Self.MainApplicant().ApplicantBasicData().RequestApplicantType()
            );
            mb.OldMobile = Self.MainApplicant().ApplicantBasicData().MobilePhoneNumber();
            mb.OldPrefix = Self.MainApplicant().ApplicantBasicData().MobilePhonePrefix();
            Self.SignatureData().ApplicantPhones.push(mb);
        }

        Self.listaOtherApplicants().forEach(function (a) {
            if (a.ApplicantBasicData().MobilePhoneNumber() != ''
                && a.ApplicantBasicData().MobilePhoneNumber() != undefined
                && a.ApplicantBasicData().RequestApplicantType() != RequestApplicantTypeEnum.BENEFICIARIO
                && a.IsOlderThan18()) {
                var mb = new SignatureDataConfirmPhone(a.ApplicantBasicData().MobilePhonePrefix(),
                    a.ApplicantBasicData().MobilePhoneNumber(),
                    a.ApplicantBasicData().FullName(),
                    a.ApplicantBasicData().DNI(),
                    a.ApplicantBasicData().RequestApplicantType()
                );
                mb.OldMobile = a.ApplicantBasicData().MobilePhoneNumber();
                mb.OldPrefix = a.ApplicantBasicData().MobilePhonePrefix();
                Self.SignatureData().ApplicantPhones.push(mb);
            }
        });
    };

    this.UpdateApplicantMobilePhone = function () {
        Self.SignatureData().ApplicantPhones().forEach(function (a) {
            if (a.IsMobilePhoneOk() == 'false') {
                var mobile = a.MobilePhone();
                if (a.RequestApplicantType() == RequestApplicantTypeEnum.TITULAR
                    || a.RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO
                    || a.RequestApplicantType() == RequestApplicantTypeEnum.MINUSVALIDO
                    || a.RequestApplicantType() == RequestApplicantTypeEnum.DONACION
                    || a.RequestApplicantType() == RequestApplicantTypeEnum.TITULARYTUTOR) {
                    Self.MainApplicant().ApplicantBasicData().MobilePhoneNumber(mobile);
                } else {
                    var applicant = Self.listaOtherApplicants().find(function (elem) {
                        return elem.ApplicantBasicData().DNI().toUpperCase() == a.ApplicantDni().toUpperCase()
                    });
                    applicant.ApplicantBasicData().MobilePhoneNumber(mobile);
                }
            }
        });
    };

    this.GetJsonRequestData = function () {
        var titulartutor = false;
        var elementstoremove = [];
        Self.listaOtherApplicants().forEach(function (a) {
            var rolDobleTutor = Self.listaOtherApplicants().some(function (elem) {
                return ((elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULAR
                    || elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COHEREDERO
                    || elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.USUFRUCTUARIO)
                    && elem.Id() == a.Id())
            });

            if (a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TUTOR && rolDobleTutor) {
                elementstoremove.push(new Valor(a.Id(), a.ApplicantBasicData().RequestApplicantType()));
            }

            if (a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TUTOR && a.Id() == Self.MainApplicant().Id()) {
                elementstoremove.push(new Valor(a.Id(), a.ApplicantBasicData().RequestApplicantType()));
                titulartutor = true;
            }
        });

        elementstoremove.forEach(function (a) {
            var found = Self.listaOtherApplicants().find(function (elem) {
                return elem.Id() == a.id && elem.ApplicantBasicData().RequestApplicantType() == a.valor;
            });

            if (found != undefined) {
                var index = Self.listaOtherApplicants.indexOf(found);
                Self.listaOtherApplicants.splice(index, 1);
                Self.listaOtherApplicants().forEach(function (c) {
                    if (c.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULAR && c.Id() == a.id) {
                        c.ApplicantBasicData().RequestApplicantType(RequestApplicantTypeEnum.COTITULARYTUTOR);
                    }
                    else if (c.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COHEREDERO && c.Id() == a.id) {
                        c.ApplicantBasicData().RequestApplicantType(RequestApplicantTypeEnum.COHEREDEROYTUTOR);
                    }
                    else if (c.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.USUFRUCTUARIO && c.Id() == a.id) {
                        c.ApplicantBasicData().RequestApplicantType(RequestApplicantTypeEnum.USUFRUCTUARIOYTUTOR);
                        //Movemos el test del applicant tutor al applicant usufructurario porque el usufructurario no tiene su propio test, lo rellena como tutor.
                        //Al unificar roles, es el applicant de usufructuario el que se queda y el de tutor el que se elimina. Si no se copia se pierde.
                        c.Test(found.Test());
                        c.KnowledgeTest(found.KnowledgeTest());
                        c.ConvenienceTestList(found.ConvenienceTestList());
                    }
                });
            }
        });

        if (titulartutor) {
            if (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO) {
                Self.MainApplicant().ApplicantBasicData().RequestApplicantType(RequestApplicantTypeEnum.HEREDEROYTUTOR);
            }
            else {
                Self.MainApplicant().ApplicantBasicData().RequestApplicantType(RequestApplicantTypeEnum.TITULARYTUTOR);
            }
        }

        Self.FillSignatureDataMobiles();

        if (Self.ManualAssisted()) {
            Self.SignatureData().IdDocumentSignatureType(2);
            Self.SignatureData().ManualAssisted(true);
        } else if (!Self.ManualAssisted() && (Self.IsFCRFlag() == true || Self.IsOtherProductFCR() == true)) {
            Self.SignatureData().IdDocumentSignatureType(2);
            Self.SignatureData().ManualAssisted(false);
        }

        var data = {
            "Applicants": [
                Self.MainApplicant().getApplicantDataForSaveRequest()
            ],

            "OperationData": []
            ,
            "RefundAccountNumber": Self.MainApplicant().ApplicantRefundAccountNumberData().AccountNumber(),
            "AccountNumberAcceptanceDate": Self.MainApplicant().ApplicantRefundAccountNumberData().AccountNumberAcceptanceDate(),
            "SignatureType": Self.SignatureType(),
            "requestID": Self.RequestId(),
            "UserName": Self.UserCRII()
        };

        var otherApplicantsData = Self.listaOtherApplicants();
        var SetSignatureType = true;
        otherApplicantsData.forEach(function (a) {
            if (a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULAR && SetSignatureType) {
                a.ApplicantBasicData().SignatureType(Self.SignatureType());
                SetSignatureType = false;
            }
            data.Applicants.push(a.getApplicantDataForSaveRequest());
        });

        var productslist = Self.listaOtherProducts();
        productslist.forEach(function (p) {
            data.OperationData.push(p.ViewModelToJSON());
        });

        return data;
    };

    this.GetOperationText = function (product, operation) {
        var txt = '';

        if (operation.IdOperationType() == OperationTypeEnum.SUSCRIPCION) {
            if (operation.IdWayToPay() == WayToPayEnum.TRANSFERENCIA) {
                txt = 'Tienes que realizar una transferencia bancaria a favor de '
                    + product.Name()
                    + ' por ' + operation.Amount() + '€'
                    + ' al número de cuenta ' + Utils.FormatIBAN(product.Iban())
                    + ' indicando en el concepto de la misma el número de tu DNI. Nos pondremos en contacto contigo para confirmarte que hemos recibido el importe de la transferencia.';
            }

            if (operation.IdWayToPay() == WayToPayEnum.CHEQUE) {
                txt = 'Envía un cheque nominativo indicando como beneficiario a '
                    + product.Name() + ' por el importe de '
                    + operation.Amount();
            }
        }

        if (operation.IdOperationType() == OperationTypeEnum.APORTACION || operation.IdOperationType() == OperationTypeEnum.RECIBO) {
            if (operation.IdWayToPay() == null) {
                txt = '';
            } else {
                if (operation.IdWayToPay() == WayToPayEnum.TRANSFERENCIA) {
                    txt = 'Tienes que realizar una transferencia bancaria a favor de '
                        + product.Name()
                        + ' por ' + operation.Amount() + '€'
                        + ' al número de cuenta ' + Utils.FormatIBAN(product.Iban())
                        + ' indicando en el concepto de la misma el número de tu DNI. Nos pondremos en contacto contigo para confirmarte que hemos recibido el importe de la transferencia.';
                }

                if (operation.IdWayToPay() == WayToPayEnum.CHEQUE) {
                    txt = 'Envía un cheque nominativo indicando como beneficiario a '
                        + product.Name() + ' por el importe de '
                        + operation.Amount() + '€';
                }
            }
        }

        if (operation.IdOperationType() == OperationTypeEnum.TRASPASO) {
            txt = 'Nos pondremos en contacto contigo para confirmarte que tu orden de traspaso se ha ejecutado de forma correcta.';
        }

        return txt;
    }

    this.SuccessTextOperation = ko.computed(function () {

        var textoperationlist = [];
        var existstransfer = false;

        Self.listaOtherProducts().forEach(function (p) {
            p.ProductOperationList().forEach(function (op) {
                if (op.IdOperationType() == OperationTypeEnum.TRASPASO) {
                    if (!existstransfer) {
                        existstransfer = true;
                        var txt = Self.GetOperationText(p, op);
                        if (txt != '') {
                            textoperationlist.push(new Valor(1, txt));
                        }
                    }
                } else {
                    var txt = Self.GetOperationText(p, op);
                    if (txt != '') {
                        textoperationlist.push(new Valor(1, txt));
                    }
                }
            });
        });

        return textoperationlist;

    }, this);

    this.SuccessTextSignature = ko.computed(function () {
        var txt = '';

        if (Self.SignatureData().IdDocumentSignatureType() == DocumentSignatureTypeEnum.DIGITAL) {

            if (Self.MainApplicantScanDni() == 'true') {
                txt = '';
            } else {
                switch (parseInt(Self.MainApplicantDocumentSendingWay())) {
                    case DocumentSendingWayEnum.ADJUNTAR:
                        txt = '';
                        break;
                    case DocumentSendingWayEnum.CORREO:
                        txt = 'Una vez que nos hayas enviado la copia del documento de identidad a C/ Juan de Mena 8, 1ª planta (28.014 Madrid), nos pondremos en contacto contigo para confirmarte que hemos recibido correctamente tu documento.';
                        break;
                    case DocumentSendingWayEnum.MENSAJERO:
                        txt = 'Ponte en contacto con nosotros para solicitar un mensajero que recoja tu copia del documento de identidad en la dirección que nos indiques. Llámanos al 900 878 280 o solicítalo a través del chat on-line.';
                        break;
                    case DocumentSendingWayEnum.EMAIL:
                        txt = 'Envíanos tu documento de identidad al e-mail bestinver@bestinver.es';
                        break;
                }
            }
        } else {
            switch (parseInt(Self.SignatureData().IdSendingWay())) {
                case DocumentSendingWayEnum.ADJUNTAR:
                    txt = 'Imprime y firma los documentos que has descargado. Haz también una copia de tu documento de identidad. Solicítanos un mensajero gratuito que recoja los contratos firmados y la copia de tus documentos, puedes llamarnos al 900 878 280';
                    break;
                case DocumentSendingWayEnum.CORREO:
                    txt = 'En breve te enviaremos la documentación que tienes que firmar a la dirección postal que nos has indicado. Una vez que la recibas, encontrarás la instrucciones para devolvernos la documentación firmada junto con copia de tu documento de identidad';
                    break;
            }
        }

        if (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDERO
            || Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.DONACION
            || Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.MINUSVALIDO) {
            txt = 'Muchas gracias por completar el proceso de alta, el Equipo de Relación con el Inversor contactará contigo para indicarte los próximos pasos a seguir.<br/><br/>Si lo deseas,  puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es';
        }

        return txt;

    }, this);

    this.GetNextApplicantSignature = function (include_minors) {
        var applicant;

        if (Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TITULAR) {
            for (var i = 0; i < Self.listaOtherApplicants().length; i++) {
                if ((Self.listaOtherApplicants()[i].IsOlderThan18() || include_minors)
                    && (Self.listaOtherApplicants()[i].ApplicantBasicData().RequestApplicantType() != RequestApplicantTypeEnum.BENEFICIARIO)) {
                    applicant = Self.listaOtherApplicants()[i];
                    break;
                }
            }
        } else {
            var index = Self.listaOtherApplicants().indexOf(Self.CurrentEditApplicant()) + 1;
            for (var i = index; i < Self.listaOtherApplicants().length; i++) {
                if ((Self.listaOtherApplicants()[i].IsOlderThan18() || include_minors)
                    && (Self.listaOtherApplicants()[i].ApplicantBasicData().RequestApplicantType() != RequestApplicantTypeEnum.BENEFICIARIO)) {
                    applicant = Self.listaOtherApplicants()[i];
                    break;
                }
            }
        }

        return applicant;
    };

    this.CreateRequestData = function () {
        Request.CreateRequestData(Self);
        Self.CurrentEditApplicant(Self.MainApplicant());
        Self.InitDocumentApplicant(Self.MainApplicant());
    };

    this.CreateBasicData = function () {
        GMT.PushEventContinuar();
        if (Self.Product().ProductTypeId() == ProductTypeEnum.ASESORAMIENTOS) {
            Self.SetStepsAdviceProducts();
        }
        else {
            Self.SetStepsTransferOrigin();
        }    
        Request.CreateBasicData(Self);
        Self.SignatureData().RequestId(Self.MainApplicant().ApplicantBasicData().RequestId());
        $('#basicdata-dni').attr('readonly', true);
    };

    this.CreateDniData = function () {
        if (Self.DniData().IdSendingWay() == DocumentSendingWayEnum.ADJUNTAR) {

            var inputs = $('#documentationdelivery-id input:file');
            var extensionsok = Utils.ValidateInputFileExtension(inputs);
            var adjuntos = 0;
            for (var j = 0; j < inputs.length; j++) {
                if (inputs[j].files.length > 0) {
                    adjuntos += 1;
                }
            }

            if (adjuntos >= 1) {
                if (adjuntos == 1) {
                    var file = inputs[0].files[0] != undefined ? inputs[0].files[0] : inputs[1].files[0];
                    Utils.GetBase64(file).then(function (result) {
                        Self.DniData().DNIAnversoBase64(result);
                        if (!extensionsok) {
                            Self.DniData().DocumentExtensionOK(false);
                            Self.SaveDniData();
                        } else {
                            Self.DniData().DocumentExtensionOK(true);
                            Self.CheckLibroFamilia();
                        }
                    });
                }

                if (adjuntos == 2) {
                    Utils.GetBase64(inputs[0].files[0]).then(function (result) {
                        Self.DniData().DNIAnversoBase64(result);
                        Utils.GetBase64(inputs[1].files[0]).then(function (result2) {
                            Self.DniData().DNIReversoBase64(result2);
                            if (!extensionsok) {
                                Self.DniData().DocumentExtensionOK(false);
                                Self.SaveDniData();
                            } else {
                                Self.DniData().DocumentExtensionOK(true);
                                Self.CheckLibroFamilia();
                            }
                        });

                    });
                }
            }
            else {
                Self.SaveDniData();
            }
        } else {
            Self.SaveDniData();
        }
    };

    this.CheckLibroFamilia = function (callback) {
        //Comprobamos si se ha adjuntado libro de familia
        if (!Self.CurrentEditApplicant().IsOlderThan18()) {
            var librofamilainput = $('#documentationdelivery02-id input:file');
            var extensionsok = Utils.ValidateInputFileExtension(librofamilainput);
            var libros = 0;
            for (var j = 0; j < librofamilainput.length; j++) {
                if (librofamilainput[j].files.length > 0) {
                    libros += 1;
                }
            }

            if (libros == 1) {
                Utils.GetBase64(librofamilainput[0].files[0]).then(function (result) {
                    Self.DniData().LibroFamilia(result);
                    if (!extensionsok) {
                        Self.DniData().DocumentExtensionOK(false);
                        Self.SaveDniData();
                    } else {
                        Self.DniData().DocumentExtensionOK(true);
                        Self.SaveDniData();
                    }
                });
            } else {
                Self.SaveDniData();
            }
        } else {
            Self.SaveDniData();
        }
    }

    this.SaveDniData_Complete = function (result) {
        if (result) {
            if (Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TITULAR) {
                Self.MainApplicantDocumentSendingWay(Self.DniData().IdSendingWay());
                Self.MainApplicantScanDni(Self.DniData().ScanDni());
            }
            var applicant = Self.GetNextApplicantSignature(true);
            if (applicant != null) {
                Utils.ClearInputFile();
                Self.InitDocumentApplicant(applicant);
                Self.CurrentEditApplicant(applicant);

                $("#applicant-document-view").show();
            }
            else {
                Self.CompleteProcess();
                Self.goToNextStep();
            }
        }
        else {
            var txt = '';
            switch (Self.DniData().IdSendingWay()) {
                case DocumentSendingWayEnum.ADJUNTAR:
                    txt = 'No hemos podido recibir correctamente tu documento de identidad, nos pondremos en contacto contigo para indicarte cómo puedes enviárnoslo. Te recordamos que puedes enviárnoslo al email bestinver@bestinver.es indicando en el asunto tu documento o solicítanos un mensajero gratuito a través del teléfono 900 878 280.';
                    break;
                case DocumentSendingWayEnum.CORREO:
                    txt = 'No hemos podido recibir correctamente tu documento de identidad, nos pondremos en contacto contigo para indicarte cómo puedes enviárnoslo. Te recordamos que puedes enviárnoslo al email bestinver@bestinver.es indicando en el asunto tu documento o solicítanos un mensajero gratuito a través del teléfono 900 878 280.';
                    break;
                case DocumentSendingWayEnum.MENSAJERO:
                    txt = 'Se ha producido un error, nos pondremos en contacto contigo para indicarte cómo puedes enviarnos tu documento de identidad.';
                    break;
                case DocumentSendingWayEnum.EMAIL:
                    txt = 'Se ha producido un error, nos pondremos en contacto contigo para indicarte cómo puedes enviarnos tu documento de identidad.';
                    break;
            }
            Self.ErrorMessage(txt);
            Navigation.NextStep(Self.CurrentStep, 'Error');
            GMT.PushEvent(PageEnum.ENVIO_DOCUMENTACION, 'error', txt);
        }
    };

    this.SaveDniData = function () {
        if (Self.DniData().IsValid()) {
            var result = Request.SaveDniData(Self.DniData(), Self.SaveDniData_Complete);
        }
    };

    this.CreateSignatureData = function () {

        if (Self.SignatureData().IdDocumentSignatureType() == DocumentSignatureTypeEnum.MANUSCRITA) {
            if (Self.SignatureData().GDPR_Group()) {
                Self.SetGDPRAllApplicants(Self.SignatureData().GDPR_Group());
            } else {
                window.launchAjax(routeConfig.GA_Register_PopPup_popup_gdpr);
            }
        }

        Self.UpdateApplicantMobilePhone();
        Request.CreateSignatureData(Self);

    };

    this.SetGDPRAllApplicants = function (gdpr) {
        Self.SetGDPRApplicants(Self.MainApplicant().ApplicantBasicData().DNI(), gdpr);
        Self.listaOtherApplicants().forEach(function (ap) {
            Self.SetGDPRApplicants(ap.ApplicantBasicData().DNI(), gdpr);
        });
    };

    this.SignatureApplicant = function () {
        var applicant = Self.GetNextApplicantSignature(false);
        if (applicant != null) {
            $('#success-signature').toggleClass('hidden');
            Self.CurrentEditApplicant(applicant);
            Self.InitSignApplicantDocument();
            if (applicant.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.BENEFICIARIO
                || applicant.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.AUTORIZADO) {
                $('#signature-sms').css('display', 'block');
                $('#GDPR-Online-Acceptation-content').css('display', 'block');
                GMT.Push(PageEnum.FIRMA_DOCUMENTOS_PIN);
            }
        } else {
            Self.DniData().validateNow(false);
            Self.CurrentEditApplicant(Self.MainApplicant());
            Self.DniData().ScanDni("false");
            //Request.MoveToNextStatus(Self.RequestId());
            Self.goToNextStep();
        }
    };

    this.SetApplicantDocuments = function (docs) {

        var filterlist = docs.filter(function (elem) {
            return elem.Dni().toUpperCase() == Self.MainApplicant().ApplicantBasicData().DNI().toUpperCase()
        });

        if (filterlist.length == 1) {
            Self.CurrentEditApplicant(Self.MainApplicant());
            Self.MainApplicant().PdfDocumentData(filterlist[0]);
            Self.InitSignApplicantDocument();
        };

        //Guardar documentos del restos de cotitulares/autorizados/beneficiarios/tutores
        Self.listaOtherApplicants().forEach(function (ap) {
            var filterlist = docs.filter(function (elem) {
                return elem.Dni().toUpperCase() == ap.ApplicantBasicData().DNI().toUpperCase()
            });

            if (filterlist.length == 1) {
                ap.PdfDocumentData(filterlist[0]);
            };
        });
    };

    this.InitDocumentApplicant = function (applicant) {
        Self.DniData().Dni(applicant.ApplicantBasicData().DNI());
        Self.DniData().RequestId(Self.MainApplicant().ApplicantBasicData().RequestId());
        Self.DniData().DNIAnversoBase64('');
        Self.DniData().DNIReversoBase64('');
        Self.DniData().MzdData('');
        Self.DniData().LibroFamilia('');
        Self.DniData().IdSendingWay(null);
        Self.DniData().ScanDni(null);
        Self.DniData().ElectronicIDRequestId('');
        Self.DniData().ScanDni("false");
    };

    this.InitSignApplicantDocument = function () {
        if (Self.CurrentEditApplicant().PdfDocumentData().ElectronicSignatureServiceVersion() === 3) {
            var bstSO = document.createElement('bst-sign-otp');
            bstSO.setAttribute('url-signature-issuer', urlSignatureIssuerApi);
            bstSO.setAttribute('id-signature', Self.CurrentEditApplicant().PdfDocumentData().OtpsToken());
            bstSO.setAttribute('locale', 'es');
            bstSO.setAttribute('show-no-present-link', 'false');
            bstSO.setAttribute('show-resend-otp-link', 'false');
            bstSO.setAttribute('text-button', 'Firmar');
            bstSO.setAttribute('text-placeholder', 'Introduce el PIN recibido por SMS');


            // Añadir el div al inicio de rOtps                     
            var containerBestinverOTP = document.getElementById('validarBestinverOTP-form');
            containerBestinverOTP.appendChild(bstSO);
            containerBestinverOTP.style.display = 'block';


            bstSO.addEventListener('otpSignOK', (data) => {
                console.log('otpSignOK event fired', data);
                Self.handdleBestinverOtpOk(data);
            })
            bstSO.addEventListener('otpNotPresent', (data) => {
                console.log('otpNotPresent event fired', data);
            })
            bstSO.addEventListener('otpComponentLoaded', (data) => {
                console.log('otpComponentLoaded event fired', data);
            })
            bstSO.addEventListener('otpSignKO', (data) => {
                console.log('otpSignKO event fired', data);
            })
            bstSO.addEventListener('otpCancelled', (data) => {
                console.log('otpCancelled event fired', data);
                Self.handdleRubricaeOtpExpired(data);
            })
            bstSO.addEventListener('otpExpired', (data) => {
                console.log('otpExpired event fired', data);
                Self.handdleRubricaeOtpExpired(data);
            })
            bstSO.addEventListener('otpRequestCode', (data) => {
                console.log('otpRequestCode event fired', data);
            })
            bstSO.addEventListener('otpError', (data) => {
                console.log('otpError event fired', data);
            })
        } else if (Self.CurrentEditApplicant().PdfDocumentData().ElectronicSignatureServiceVersion() === 2) {
            var rOtps = document.createElement('r-otps');
            rOtps.setAttribute('oid', Self.CurrentEditApplicant().PdfDocumentData().OtpsToken());
            rOtps.setAttribute('sid', Self.CurrentEditApplicant().PdfDocumentData().OtpsTokensSigner());
            rOtps.setAttribute('token', Self.CurrentEditApplicant().PdfDocumentData().AccessToken());
            rOtps.setAttribute('showdocument', 'false');
            rOtps.setAttribute('automaticdownload', 'false');
            rOtps.setAttribute('textbutton', 'Firmar');
            rOtps.setAttribute('textplaceholder', 'Introduce el PIN recibido por SMS');

            // Crear el div con el subtitle antes de pintar el componente
            Self.showRubricaeSubtitle();

            // Añadir el div al inicio de rOtps                        
            document.getElementById('validarRubricaeOTP-form').appendChild(rOtps);


            if (Self.IsRubricaeEventsAttached() === false) {
                Self.IsRubricaeEventsAttached(true);
                window.addEventListener("signedEvent", function (event) {
                    if (!event.origin) {
                        Self.handdleRubricaeEventSigned(event);
                    }
                });

                window.addEventListener("loadedEvent", function (event) {
                    if (!event.origin) {
                        Self.handdleRubricaeEventLoaded(event);
                    }
                });
            }
        }
    };

    this.handdleBestinverOtpOk = function (data) {
        customDebug('Bestinver.OtpOk', data);
        var containerBestinverOTP = document.getElementById('validarBestinverOTP-form');
        containerBestinverOTP.style.display = 'none';

        Self.SendGDPRAnalitics(Self.CurrentEditApplicant().GDPR1(), Self.CurrentEditApplicant().GDPR2(), Self.CurrentEditApplicant().GDPR3());
        if (Self.CurrentEditApplicant().GDPR1() === false || Self.CurrentEditApplicant().GDPR2() === false || Self.CurrentEditApplicant().GDPR3() === false) {
            window.launchAjax(routeConfig.GA_Register_PopPup_popup_gdpr);
        } else {
            Self.SetGDPRApplicants(Self.CurrentEditApplicant().ApplicantBasicData().DNI(), Self.CurrentEditApplicant().GDPR1(), Self.CurrentEditApplicant().GDPR2(), Self.CurrentEditApplicant().GDPR3());
        }

        // Informar fecha de la firma en base de datos
        Request.SetApplicantSignDate(Self.RequestId, Self.CurrentEditApplicant().ApplicantBasicData().DNI());

        customDebug(vm.RequestId(), 'Bestinver.Signed');
        GMT.PushEvent(PageEnum.FIRMA_DOCUMENTOS_PIN, 'confirmacion firma', 'electronica');

        $('#success-signature').toggleClass('hidden');

        setTimeout(function () {
            $('#signature-document-content').unblock({ message: null });
            Self.SignatureApplicant();
            $(window).scrollTop(0);
        }, 1000);
    }

    this.handdleBestinverOtpExpired = function (data) {
        customDebug('Bestinver.Expired', data);

        $('#contact-signature').toggleClass('hidden');
        setTimeout(function () {
            GMT.PushEvent(PageEnum.FIRMA_DOCUMENTOS_PIN, 'error', 'EventCode: MaxAttempts');
        }, 1000); 
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
            subtitle.textContent = 'Al introducir el código recibido por SMS, que sustituye a mi firma manuscrita, confirmo que he recibido, leído y aceptado la documentación anterior.';
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
                        $('#signature-document-content').block({ message: null });
                    }
                });
                $('#ro-otp-input').on("input", function () {
                    if ($('#ro-otp-input').val() === '') {
                        Self.showErrorSignApplicantDocument('OTP VACIO');
                    } else {
                        Self.showErrorSignApplicantDocument('');
                    }
                });

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
        $('#signature-document-content').unblock({ message: null });

        //HACK: Eliminar la clase loading del botón ya que en casos muy rápidos como OTP Vacío se ejecuta antes "EventSigned" que el "click" del boton que asociamos en "EventLoaded"
        setTimeout(function () {
            $('#ro-button').removeClass('loading');
            $('#signature-document-content').unblock({ message: null });
        }, 2000);

        // Lógica a ejecutar si la firma es correcta
        if (signed) {
            Self.handdleRubricaeOtpOk(eventCode);
        } else if (eventCode != 1) {
            var codeSign = document.getElementById('ro-otp-input').value;
            if (codeSign.trim() == '') {
                Self.handdleRubricaeOtpEmpty(eventCode);
            } else {
                Self.handdleRubricaeOtpExpired(eventCode);
            }
        }
        else {
            Self.handdleRubricaeOtpKo(eventCode);
        }
    }
    this.handdleRubricaeOtpOk = function (eventCode) {
        // Lógica a ejecutar si la firma es correcta
        Self.hideRubricaeSubtitle();

        Self.SendGDPRAnalitics(Self.CurrentEditApplicant().GDPR1(), Self.CurrentEditApplicant().GDPR2(), Self.CurrentEditApplicant().GDPR3());
        if (Self.CurrentEditApplicant().GDPR1() === false || Self.CurrentEditApplicant().GDPR2() === false || Self.CurrentEditApplicant().GDPR3() === false) {
            window.launchAjax(routeConfig.GA_Register_PopPup_popup_gdpr);
        } else {
            Self.SetGDPRApplicants(Self.CurrentEditApplicant().ApplicantBasicData().DNI(), Self.CurrentEditApplicant().GDPR1(), Self.CurrentEditApplicant().GDPR2(), Self.CurrentEditApplicant().GDPR3());
        }

        // Informar fecha de la firma en base de datos
        Request.SetApplicantSignDate(Self.RequestId, Self.CurrentEditApplicant().ApplicantBasicData().DNI());

        customDebug(vm.RequestId(), 'Rubricae.Signed');
        $('#success-signature').toggleClass('hidden');
        GMT.PushEvent(PageEnum.FIRMA_DOCUMENTOS_PIN, 'confirmacion firma', 'electronica');
        setTimeout(function () {
            $('#signature-document-content').unblock({ message: null });
            customDebug(eventCode, 'Rubricae.Signed Self.SignatureApplicant();');
            Self.SignatureApplicant();
            $(window).scrollTop(0);
        }, 1000);
    }

    this.handdleRubricaeOtpExpired = function (eventCode) {
        customDebug('Event Code ' + eventCode, 'Rubricae.Error');

        Self.showErrorSignApplicantDocument('Se ha superado el número máximo de intentos erróneos.');

        $('#contact-signature').toggleClass('hidden');

        setTimeout(function () {
            GMT.PushEvent(PageEnum.FIRMA_DOCUMENTOS_PIN, 'error', 'Event Code ' + eventCode);
        }, 1000);
    }

    this.handdleRubricaeOtpEmpty = function (eventCode) {
        customDebug('Event Code ' + eventCode, 'Rubricae.Pin Vacío');
        if (document.getElementById('errorRubricaeSignature')) {
            Self.showErrorSignApplicantDocument('OTP INVÁLIDO');
        }
    }
    this.handdleRubricaeOtpKo = function (eventCode) {
        if (document.getElementById('ro-otp-input').value == '') {
            customDebug('Event Code ' + eventCode, 'Rubricae.Pin Vacío');
            if (document.getElementById('errorRubricaeSignature')) {
                Self.showErrorSignApplicantDocument('OTP VACÍO');
            }
        }
        else {
            customDebug('Event Code ' + eventCode, 'Rubricae.Pin Incorrecto');
            Self.showErrorSignApplicantDocument('PIN INCORRECTO');
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
    this.CompleteProcess = function () {
        Request.CompleteProcess(Self.MainApplicant().ApplicantBasicData().RequestId());
    };

    this.SetGDPRApplicants = function (dni, gdpr) {
        var data = {
            "DNI": dni,
            "GDPR": gdpr
        };

        Request.SetGDPR(data);
    };

    this.AcceptRefundIbanText = ko.computed(function () {
        var filterlist = Self.listaOtherApplicants().filter(function (elem) {
            return elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULAR ||
                elem.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULARYTUTOR;
        });

        if (filterlist.length === 0) {
            return "Declaro ser el titular de la cuenta proporcionada, domiciliada en una entidad bancaria de la Unión Europea o en un tercer país equivalente reconocido por la Comisión Europea. En caso de realizar operaciones desde otra cuenta, informaré a BESTINVER enviando un certificado de titularidad.";
        }
        else {
            return "Declaramos ser los titulares de la cuenta proporcionada, domiciliada en una entidad bancaria de la Unión Europea o en un tercer país equivalente reconocido por la Comisión Europea. En caso de realizar operaciones desde otra cuenta, informaremos a BESTINVER enviando un certificado de titularidad.";
        }

    }, this);

};

var SelectProductViewModel = function (ProductTypes, disclaimer) {
    var self = this;
    this.ProductModel = ko.observable(new ProductData(ProductTypes));
    this.ErrorMessage = ko.observable();

    this.Init = function (ProductTypePredef) {
        self.ProductModel().ProfitabilityDisclaimer(sessionStorage.getItem("ProfitabilityDisclaimer"));
        self.ProductModel().ProfitabilityDate(sessionStorage.getItem("ProfitabilityDate"));
        self.ProductModel().ProfitabilityDateFIL(sessionStorage.getItem("ProfitabilityDateFIL"));

        if (ProductTypePredef != undefined)
            $("#product-type" + ProductTypePredef).click();
    };

    self.ProductModel().ProductType.subscribe(function (newValue) {
        GMT.PushByProductType(PageEnum.EMPIEZA_A_INVERTIR_PRODUCTO_SELECCIONADO, newValue);
        sessionStorage.setItem("PageEnum", PageEnum.EMPIEZA_A_INVERTIR_PRODUCTO_SELECCIONADO);
    });

    this.GoToPersonalDataView = function () {
        if (self.ProductModel().Product() == null) {
            self.ErrorMessage('Debe seleccionar un producto');
        } else {
            var button = $('#btn-select-product');
            button.toggleClass('loading');
            $('#select-product-content').block({ message: null });
            self.ErrorMessage('');
            sessionStorage.setItem('currentproduct', self.ProductModel().Product());
            GMT.PushEventContinuar();
            if (GMT != undefined && sessionStorage) {
                var digitalDataArray = JSON.stringify(window.DigitalDataPersisted);
                sessionStorage.setItem('gmtDigitalDataPersisted', digitalDataArray);
            }
            var url = routeConfig.GA_Register_ForeignPersons_PersonalData + "/" + btoa("ProductId=" + self.ProductModel().Product());
            location.href = url;
        }
    };
};

var RecoverySignatureViewModel = function () {
    var Self = this;
    this.CurrentEditApplicant = ko.observable(new Applicant());
    this.PdfDocumentData = ko.observable(new PdfDocumentData());
    this.DniDataView = ko.observable(new DniData());
    this.Product = ko.observable(new Product());
    this.CompleteName = ko.observable();
    this.ErrorMessage = ko.observable();
    this.SuccessMessage = ko.observable("Tu firma se ha procesado correctamente");
    this.RequestId = ko.observable();
    this.listaOtherApplicants = ko.observableArray([]).distinct('RequestApplicantType');
    this.CurrentEditApplicantFullName = ko.observable();
    this.SignatureData = ko.observable(new SignatureData());
    this.IsRubricaeEventsAttached = ko.observable(false);
    this.Signed = ko.observable(false);

    this.Init = function (RequestId, docs, productType, minors, Birthday) {
        Self.PdfDocumentData(docs);
        Self.InitSignApplicantDocument();
        Self.DniDataView().Dni(Self.PdfDocumentData().Dni());
        Self.DniDataView().RequestId(RequestId);
        Self.DniDataView().MoveStatus(false);
        Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType(Self.PdfDocumentData().RequestApplicantType());
        Self.Product().ProductTypeId(productType);
        Self.RequestId(RequestId);
        Self.CurrentEditApplicantFullName(Self.PdfDocumentData().CompleteName());
        Self.CurrentEditApplicant().ApplicantBasicData().DNI(Self.PdfDocumentData().Dni());

        var date = moment(Birthday, 'YYYY-MM-DD', true);
        var custombirthday = new CustomDate(date);
        Self.CurrentEditApplicant().ApplicantPersonalData().Birthday(custombirthday);

        if (minors != undefined) {
            $.each(minors, function (i, item) {
                var applicant = new Applicant();
                applicant.ApplicantBasicData().Name(minors[i].BasicData.Name);
                applicant.ApplicantBasicData().DNI(minors[i].BasicData.DNI);
                applicant.ApplicantBasicData().FirstSurname(minors[i].BasicData.FirstSurname);
                applicant.ApplicantBasicData().SecondSurname(minors[i].BasicData.SecondSurname);
                applicant.ApplicantBasicData().RequestApplicantType(minors[i].BasicData.RequestApplicantType);
                Self.listaOtherApplicants.push(applicant);
            });
        }

        if (Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.BENEFICIARIO
            || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.AUTORIZADO) {
            $('#signature-sms').css('display', 'block');
        }

        Self.DniDataView().ScanDni("false");
    };

    this.InitDocumentApplicant = function (applicant) {
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        Self.DniDataView().Dni(applicant.ApplicantBasicData().DNI());
        Self.DniDataView().RequestId(Self.RequestId());
        Self.DniDataView().DNIAnversoBase64('');
        Self.DniDataView().DNIReversoBase64('');
        Self.DniDataView().MzdData('');
        Self.DniDataView().LibroFamilia('');
        Self.DniDataView().IdSendingWay(null);
        Self.DniDataView().ScanDni(null);
        Self.DniDataView().ScanDni("false");
    };

    this.IsTutor = function () {
        return Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TUTOR
            || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULARYTUTOR
            || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TITULARYTUTOR
            || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDEROYTUTOR
            || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COHEREDEROYTUTOR
            || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.USUFRUCTUARIOYTUTOR;
    }

    this.GetNextApplicantSignature = function (include_minors) {
        var applicant;

        if (Self.IsTutor()) {
            if (Self.listaOtherApplicants().length > 0) {
                for (var i = 0; i < Self.listaOtherApplicants().length; i++) {
                    if ((Self.listaOtherApplicants()[i].IsOlderThan18() || include_minors)) {
                        applicant = Self.listaOtherApplicants()[i];
                        break;
                    }
                }
            }
        } else {
            var index = Self.listaOtherApplicants().indexOf(Self.CurrentEditApplicant()) + 1;
            for (var i = index; i < Self.listaOtherApplicants().length; i++) {
                applicant = Self.listaOtherApplicants()[i];
            }
        }

        return applicant;
    };

    this.InitSignApplicantDocument = function () {
        if (Self.PdfDocumentData().ElectronicSignatureServiceVersion() === 3) {
            var bstSO = document.createElement('bst-sign-otp');
            bstSO.setAttribute('url-signature-issuer', urlSignatureIssuerApi);
            bstSO.setAttribute('id-signature', Self.PdfDocumentData().OtpsToken());
            bstSO.setAttribute('locale', 'es');
            bstSO.setAttribute('show-no-present-link', 'false');
            bstSO.setAttribute('show-resend-otp-link', 'false');
            bstSO.setAttribute('text-button', 'Firmar');
            bstSO.setAttribute('text-placeholder', 'Introduce el PIN recibido por SMS');


            // Añadir el div al inicio de rOtps                     
            var containerBestinverOTP = document.getElementById('validarBestinverOTP-form');
            containerBestinverOTP.appendChild(bstSO);
            containerBestinverOTP.style.display = 'block';


            bstSO.addEventListener('otpSignOK', (data) => {
                console.log('otpSignOK event fired', data);
                Self.handdleBestinverOtpOk(data);
            })
            bstSO.addEventListener('otpNotPresent', (data) => {
                console.log('otpNotPresent event fired', data);
            })
            bstSO.addEventListener('otpComponentLoaded', (data) => {
                console.log('otpComponentLoaded event fired', data);
            })
            bstSO.addEventListener('otpSignKO', (data) => {
                console.log('otpSignKO event fired', data);
            })
            bstSO.addEventListener('otpCancelled', (data) => {
                console.log('otpCancelled event fired', data);
                Self.handdleBestinverOtpExpired(data);
            })
            bstSO.addEventListener('otpExpired', (data) => {
                console.log('otpExpired event fired', data);
                Self.handdleBestinverOtpExpired(data);
            })
            bstSO.addEventListener('otpRequestCode', (data) => {
                console.log('otpRequestCode event fired', data);
            })
            bstSO.addEventListener('otpError', (data) => {
                console.log('otpError event fired', data);
            })
        } else if (Self.PdfDocumentData().ElectronicSignatureServiceVersion() === 2) {

            var rOtps = document.createElement('r-otps');
            rOtps.setAttribute('oid', Self.PdfDocumentData().OtpsToken());
            rOtps.setAttribute('sid', Self.PdfDocumentData().OtpsTokensSigner());
            rOtps.setAttribute('token', Self.PdfDocumentData().AccessToken());
            rOtps.setAttribute('showdocument', 'false');
            rOtps.setAttribute('automaticdownload', 'false');
            rOtps.setAttribute('textbutton', 'Firmar');
            rOtps.setAttribute('textplaceholder', 'Introduce el PIN recibido por SMS');

            // Crear el div con el subtitle antes de pintar el componente
            Self.showRubricaeSubtitle();

            // Añadir el div al inicio de rOtps                        
            document.getElementById('validarRubricaeOTP-form').appendChild(rOtps);


            if (Self.IsRubricaeEventsAttached() === false) {
                Self.IsRubricaeEventsAttached(true);
                window.addEventListener("signedEvent", function (event) {
                    if (!event.origin) {
                        Self.handdleRubricaeEventSigned(event);
                    }
                });

                window.addEventListener("loadedEvent", function (event) {
                    if (!event.origin) {
                        Self.handdleRubricaeEventLoaded(event);
                    }
                });
            }
        }
    };

    this.handdleBestinverOtpOk = function (data) {
        customDebug('Bestinver.OtpOk', data);
        var containerBestinverOTP = document.getElementById('validarBestinverOTP-form');
        containerBestinverOTP.style.display = 'none';

        // Informar fecha de la firma en base de datos
        Request.SetApplicantSignDate(Self.RequestId, Self.CurrentEditApplicant().ApplicantBasicData().DNI());

        customDebug(vm.RequestId(), 'Bestinver.onOtpOK');
        GMT.PushEvent(PageEnum.FIRMA_DOCUMENTOS_PIN, 'confirmacion firma', 'electronica');

        $('#success-signature').toggleClass('hidden');

        setTimeout(function () {
            $('#signature-document-content-head').toggleClass('complete');
            $('#signature-document-content').toggleClass('hidden');
            $('#applicant-document-content-head').toggleClass('hidden');
            $('#applicant-document-content').toggleClass('hidden');
            GMT.Push(PageEnum.ENVIO_DOCUMENTACION);
        }, 1000);
    }

    this.handdleBestinverOtpExpired = function (data) {
        customDebug('Bestinver.Expired', data);

        $('#contact-signature').toggleClass('hidden');
        setTimeout(function () {
            GMT.PushEvent(PageEnum.FIRMA_DOCUMENTOS_PIN, 'error', 'EventCode: MaxAttempts');
        }, 1000);      
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
            subtitle.textContent = 'Al introducir el código recibido por SMS, que sustituye a mi firma manuscrita, confirmo que he recibido, leído y aceptado la documentación anterior.';
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

        if (event.detail && !event.detail.loaded) {
            Self.showErrorSignApplicantDocument('El código para firmar la documentación ha expirado o se ha superado el número máximo de intentos erróneos.');

            $('#contact-signature').toggleClass('hidden');
        }

        //HACK: Esperar a que se cargue el componente de firma ya que aunque se ejecute el evento de eventloadded aun no se han cargado los elementos
        const intervalId = setInterval(() => {
            if ($('#ro-button').length > 0 && $('#ro-otp-input').length > 0) {
                $('#ro-button').click(function (e) {
                    if ($('#ro-otp-input').val() !== '') {
                        $('#ro-button').addClass('loading');
                        $('#signature-document-content').block({ message: null });
                    }
                });
                $('#ro-otp-input').on("input", function () {
                    if ($('#ro-otp-input').val() === '') {
                        Self.showErrorSignApplicantDocument('OTP VACIO');
                    } else {
                        Self.showErrorSignApplicantDocument('');
                    }
                });

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
        $('#signature-document-content').unblock({ message: null });

        //HACK: Eliminar la clase loading del botón ya que en casos muy rápidos como OTP Vacío se ejecuta antes "EventSigned" que el "click" del boton que asociamos en "EventLoaded"
        setTimeout(function () {
            $('#ro-button').removeClass('loading');
            $('#signature-document-content').unblock({ message: null });
        }, 2000);

        // Lógica a ejecutar si la firma es correcta
        if (signed) {
            Self.handdleRubricaeOtpOk(eventCode);
        } else if (eventCode != 1) {
            var codeSign = document.getElementById('ro-otp-input').value;
            if (codeSign.trim() == '') {
                Self.handdleRubricaeOtpEmpty(eventCode);
            } else {
                Self.handdleRubricaeOtpExpired(eventCode);
            }
        }
        else {
            Self.handdleRubricaeOtpKo(eventCode);
        }
    }

    this.handdleRubricaeOtpOk = function (eventCode) {
        Self.hideRubricaeSubtitle();

        // Informar fecha de la firma en base de datos
        Request.SetApplicantSignDate(Self.RequestId, Self.CurrentEditApplicant().ApplicantBasicData().DNI());

        customDebug(vm.RequestId(), 'otpSecure.onOtpOK');
        $('#success-signature').toggleClass('hidden');
        GMT.PushEvent(PageEnum.FIRMA_DOCUMENTOS_PIN, 'confirmacion firma', 'electronica');

        setTimeout(function () {
            $('#signature-document-content-head').toggleClass('complete');
            $('#signature-document-content').toggleClass('hidden');
            $('#applicant-document-content-head').toggleClass('hidden');
            $('#applicant-document-content').toggleClass('hidden');
            GMT.Push(PageEnum.ENVIO_DOCUMENTACION);
        }, 1000);
    }

    this.handdleRubricaeOtpExpired = function (eventCode) {
        //Error de firma diferente a OTP incorrecto
        customDebug('Event Code ' + eventCode, 'Rubricae.Error');

        Self.showErrorSignApplicantDocument('Se ha superado el número máximo de intentos erróneos.');

        $('#contact-signature').toggleClass('hidden');
        setTimeout(function () {
            GMT.PushEvent(PageEnum.FIRMA_DOCUMENTOS_PIN, 'error', 'Event Code: ' + eventCode);
        }, 1000);
    }

    this.handdleRubricaeOtpKo = function (eventCode) {
        if (document.getElementById('ro-otp-input').value == '') {
            customDebug('Event Code ' + eventCode, 'Rubricae.Pin Vacío');
            if (document.getElementById('errorRubricaeSignature')) {
                Self.showErrorSignApplicantDocument('OTP VACÍO');
            }
        }
        else {
            customDebug('Event Code ' + eventCode, 'Rubricae.Pin Incorrecto');
            Self.showErrorSignApplicantDocument('PIN INCORRECTO');
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

    this.CreateDniData = function () {
        if (Self.DniDataView().IdSendingWay() == DocumentSendingWayEnum.ADJUNTAR) {
            var inputs = $('#documentationdelivery-id input:file');
            var extensionsok = Utils.ValidateInputFileExtension(inputs);
            var adjuntos = 0;
            for (var j = 0; j < inputs.length; j++) {
                if (inputs[j].files.length > 0) {
                    adjuntos += 1;
                }
            }

            if (adjuntos >= 1) {
                if (adjuntos == 1) {
                    var file = inputs[0].files[0] != undefined ? inputs[0].files[0] : inputs[1].files[0];
                    Utils.GetBase64(file).then(function (result) {
                        Self.DniDataView().DNIAnversoBase64(result);
                        if (!extensionsok) {
                            Self.DniDataView().DocumentExtensionOK(false);
                            Self.SaveDniData();
                        } else {
                            Self.DniDataView().DocumentExtensionOK(true);
                            Self.CheckLibroFamilia();
                        }
                    });
                }

                if (adjuntos == 2) {
                    Utils.GetBase64(inputs[0].files[0]).then(function (result) {
                        Self.DniDataView().DNIAnversoBase64(result);
                        Utils.GetBase64(inputs[1].files[0]).then(function (result2) {
                            Self.DniDataView().DNIReversoBase64(result2);
                            if (!extensionsok) {
                                Self.DniDataView().DocumentExtensionOK(false);
                                Self.SaveDniData();
                            } else {
                                Self.DniDataView().DocumentExtensionOK(true);
                                Self.CheckLibroFamilia();
                            }
                        });
                    });
                }
            }
            else {
                Self.SaveDniData();
            }
        }
        else {
            Self.SaveDniData();
        }
    };

    this.SetGDPRApplicants = function (dni, gdpr1, gdpr2, gdpr3) {
        var data = {
            "DNI": dni,
            "GDPR1": gdpr1,
            "GDPR2": gdpr2,
            "GDPR3": gdpr3
        };

        Request.SetGDPR(data);
    };

    this.CheckLibroFamilia = function (callback) {
        //Comprobamos si se ha adjuntado libro de familia
        if (!Self.IsTutor()) {
            var librofamilainput = $('#documentationdelivery02-id input:file');
            var extensionsok = Utils.ValidateInputFileExtension(librofamilainput);
            var libros = 0;
            for (var j = 0; j < librofamilainput.length; j++) {
                if (librofamilainput[j].files.length > 0) {
                    libros += 1;
                }
            }

            if (libros == 1) {
                Utils.GetBase64(librofamilainput[0].files[0]).then(function (result) {
                    Self.DniDataView().LibroFamilia(result);
                    if (!extensionsok) {
                        Self.DniDataView().DocumentExtensionOK(false);
                        Self.SaveDniData();
                    } else {
                        Self.DniDataView().DocumentExtensionOK(true);
                        Self.SaveDniData();
                    }
                });
            } else {
                Self.SaveDniData();
            }
        } else {
            Self.SaveDniData();
        }
    }

    this.SaveDniData = function () {
        if (Self.DniDataView().IsValid()) {            
            Request.SaveDniData(Self.DniDataView(), Self.SaveDniData_Complete);
        }
    };

    this.SaveDniData_Complete = function (result) {
        if (result) {
            var applicant = Self.GetNextApplicantSignature(true);
            if (applicant != null) {
                Utils.ClearInputFile();
                Self.InitDocumentApplicant(applicant);
                Self.CurrentEditApplicant(applicant);
                if (applicant.ApplicantBasicData().Name() && applicant.ApplicantBasicData().FirstSurname() && applicant.ApplicantBasicData().SecondSurname()) {
                    Self.CurrentEditApplicantFullName(applicant.ApplicantBasicData().Name() + " " + applicant.ApplicantBasicData().FirstSurname() + " " + applicant.ApplicantBasicData().SecondSurname());
                } else {
                    Self.CurrentEditApplicantFullName(applicant.ApplicantBasicData().Name() + " " + applicant.ApplicantBasicData().FirstSurname());
                }

                $("#applicant-document-view").show();
            }
            else {
                $('#documents-content').toggleClass('hidden');
                $('#success-content').toggleClass('hidden');
                $('#success-content-head').removeClass('hidden');
                $('#success-content-view').removeClass('hidden');
                GMT.Push(PageEnum.FINALIZAR);
                Request.CompleteProcess(Self.DniDataView().RequestId());
            }
        } else {
            Self.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es<br/><br/>Muchas gracias.')
            $('#documents-content').toggleClass('hidden');
            $('#error-content').toggleClass('hidden');
        }
    };

    this.CurrentApplicantSignatureTitle = ko.computed(function () {
        return 'Documentos personales de ' + Self.CurrentEditApplicantFullName();
    }, this);

    this.CurrentApplicantSendingDocumentTitle = ko.computed(function () {
        return 'Adjuntar documentos de ' + Self.CurrentEditApplicantFullName() + ' en formato JPG o PDF';
    }, this);
};

var SendDocumentViewModel = function () {
    var Self = this;
    this.CurrentEditApplicant = ko.observable(new Applicant());
    this.DniDataView = ko.observable(new DniData());
    this.Product = ko.observable(new Product());
    this.CompleteName = ko.observable();
    this.IsMinor = ko.observable(false);
    this.ErrorMessage = ko.observable();
    this.SuccessMessage = ko.observable("Sus documentos se han procesado correctamente");
    this.RequestId = ko.observable();
    this.listaOtherApplicants = ko.observableArray([]).distinct('RequestApplicantType');
    this.CurrentEditApplicantFullName = ko.observable();

    this.Init = function (RequestId, AplicantDni, ApplicantName, IsMinor, Birthday, minors, RequestApplicantType) {
        Self.DniDataView().Dni(AplicantDni);
        Self.DniDataView().RequestId(RequestId);
        Self.DniDataView().MoveStatus(false);
        Self.CompleteName(ApplicantName);
        Self.IsMinor(IsMinor);
        Self.RequestId(RequestId);
        Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType(RequestApplicantType);
        Self.CurrentEditApplicantFullName(ApplicantName);
        Self.CurrentEditApplicant().ApplicantBasicData().DNI(AplicantDni);

        var date = moment(Birthday, 'YYYY-MM-DD', true);
        var custombirthday = new CustomDate(date);
        Self.CurrentEditApplicant().ApplicantPersonalData().Birthday(custombirthday);

        if (minors != undefined) {
            $.each(minors, function (i, item) {
                var applicant = new Applicant();
                applicant.ApplicantBasicData().Name(minors[i].BasicData.Name);
                applicant.ApplicantBasicData().DNI(minors[i].BasicData.DNI);
                applicant.ApplicantBasicData().FirstSurname(minors[i].BasicData.FirstSurname);
                applicant.ApplicantBasicData().SecondSurname(minors[i].BasicData.SecondSurname);
                applicant.ApplicantBasicData().RequestApplicantType(minors[i].BasicData.RequestApplicantType);
                Self.listaOtherApplicants.push(applicant);
            });
        }

        Self.DniDataView().ScanDni("false");
    };

    this.InitDocumentApplicant = function (applicant) {
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        Self.DniDataView().Dni(applicant.ApplicantBasicData().DNI());
        Self.DniDataView().RequestId(Self.RequestId());
        Self.DniDataView().DNIAnversoBase64('');
        Self.DniDataView().DNIReversoBase64('');
        Self.DniDataView().MzdData('');
        Self.DniDataView().LibroFamilia('');
        Self.DniDataView().IdSendingWay(null);
        Self.DniDataView().ScanDni(null);
        Self.DniDataView().ScanDni("false");
    };

    this.IsTutor = function () {
        return Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TUTOR
            || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COTITULARYTUTOR
            || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.TITULARYTUTOR
            || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.HEREDEROYTUTOR
            || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.COHEREDEROYTUTOR
            || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.USUFRUCTUARIOYTUTOR;
    };

    this.GetNextApplicantSignature = function () {
        var applicant;

        if (Self.IsTutor()) {
            if (Self.listaOtherApplicants().length > 0) {
                applicant = Self.listaOtherApplicants()[0];
            }
        } else {
            var index = Self.listaOtherApplicants().indexOf(Self.CurrentEditApplicant()) + 1;
            for (var i = index; i < Self.listaOtherApplicants().length; i++) {
                applicant = Self.listaOtherApplicants()[i];
            }
        }

        return applicant;
    };

    this.CreateDniData = function () {
        if (Self.DniDataView().IdSendingWay() == DocumentSendingWayEnum.ADJUNTAR) {
            var inputs = $('#documentationdelivery-id input:file');
            var extensionsok = Utils.ValidateInputFileExtension(inputs);
            var adjuntos = 0;
            for (var j = 0; j < inputs.length; j++) {
                if (inputs[j].files.length > 0) {
                    adjuntos += 1;
                }
            }

            if (adjuntos >= 1) {
                if (adjuntos == 1) {
                    var file = inputs[0].files[0] != undefined ? inputs[0].files[0] : inputs[1].files[0];
                    Utils.GetBase64(file).then(function (result) {
                        Self.DniDataView().DNIAnversoBase64(result);
                        if (!extensionsok) {
                            Self.DniDataView().DocumentExtensionOK(false);
                            Self.SaveDniData();
                        } else {
                            Self.DniDataView().DocumentExtensionOK(true);
                            Self.CheckLibroFamilia();
                        }
                    });
                }

                if (adjuntos == 2) {
                    Utils.GetBase64(inputs[0].files[0]).then(function (result) {
                        Self.DniDataView().DNIAnversoBase64(result);
                        Utils.GetBase64(inputs[1].files[0]).then(function (result2) {
                            Self.DniDataView().DNIReversoBase64(result2);
                            if (!extensionsok) {
                                Self.DniDataView().DocumentExtensionOK(false);
                                Self.SaveDniData();
                            } else {
                                Self.DniDataView().DocumentExtensionOK(true);
                                Self.CheckLibroFamilia();
                            }
                        });
                    });
                }
            }
            else {
                Self.SaveDniData();
            }
        }
        else {
            Self.SaveDniData();
        }
    };

    this.SaveDniData = function () {
        if (Self.DniDataView().IsValid()) {
            Request.SaveDniData(Self.DniDataView(), Self.SaveDniData_Complete);
        }
    }

    this.CheckLibroFamilia = function (callback) {
        //Comprobamos si se ha adjuntado libro de familia
        if (Self.IsMinor()) {
            var librofamilainput = $('#documentationdelivery02-id input:file');
            var extensionsok = Utils.ValidateInputFileExtension(librofamilainput);
            var libros = 0;
            for (var j = 0; j < librofamilainput.length; j++) {
                if (librofamilainput[j].files.length > 0) {
                    libros += 1;
                }
            }

            if (libros == 1) {
                Utils.GetBase64(librofamilainput[0].files[0]).then(function (result) {
                    Self.DniDataView().LibroFamilia(result);
                    if (!extensionsok) {
                        Self.DniDataView().DocumentExtensionOK(false);
                        Self.SaveDniData();
                    } else {
                        Self.DniDataView().DocumentExtensionOK(true);
                        Self.SaveDniData();
                    }
                });
            } else {
                Self.SaveDniData();
            }
        } else {
            Self.SaveDniData();
        }
    }

    this.SaveDniData_Complete = function (result) {
        if (result) {
            var applicant = Self.GetNextApplicantSignature();
            if (applicant != null) {
                Utils.ClearInputFile();
                Self.InitDocumentApplicant(applicant);
                Self.CurrentEditApplicant(applicant);
                Self.CurrentEditApplicantFullName(applicant.ApplicantBasicData().Name() + " " + applicant.ApplicantBasicData().FirstSurname() + " " + applicant.ApplicantBasicData().SecondSurname());

                $("#applicant-document-view").show();
            }
            else {
                $('#documents-content').toggleClass('hidden');
                $('#success-content').toggleClass('hidden');
                $('#success-content-head').removeClass('hidden');
                $('#success-content-view').removeClass('hidden');
                Request.CompleteProcess(Self.DniDataView().RequestId());
            }
        } else {
            Self.ErrorMessage('El equipo de Relación con el Inversor de Bestinver contactará contigo para continuar con el proceso de alta.<br/><br/>Si lo prefieres, puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es<br/><br/>Muchas gracias.')
            $('#documents-content').toggleClass('hidden');
            $('#error-content').toggleClass('hidden');
        }
    };

    this.CurrentApplicantSignatureTitle = ko.computed(function () {
        return 'Documentos personales de ' + Self.CurrentEditApplicantFullName();
    }, this);

    this.CurrentApplicantSendingDocumentTitle = ko.computed(function () {
        return 'Adjuntar documentos de ' + Self.CurrentEditApplicantFullName() + ' en formato JPG o PDF';
    }, this);
}
