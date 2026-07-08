'use strict';

var OperationTypeEnum = {
    APORTACION: 2,
    SUSCRIPCION: 1,
    TRASPASO: 3,
    RECIBO: 4,

    properties:
    {
        1: { name: "Suscripción", value: 1 },
        2: { name: "Aportación", value: 2 },
        3: { name: "Traspaso", value: 3 },
        4: { name: "Recibo", value: 4 }
    }
};

var ProductTypeEnum = {
    PLANES: 1,
    FONDOS: 2,
    INVERSIONLIBRE: 3,
    EPSV: 4,
    ASESORAMIENTOS: 5,

    properties:
    {
        1: { name: "planes de pension", value: 1 },
        2: { name: "fondos de inversion", value: 2 },
        3: { name: "fondos de inversion libre", value: 3 },
        4: { name: "epsv", value: 4 },
        5: { name: "asesoramientos", value: 5 },
    }
};

var TransferTypeEnum = {
    TOTAL: 1,
    PARCIAL: 2,
    PARTICIPACIONES: 3,

    properties:
    {
        1: { name: "traspaso total", value: 1 },
        2: { name: "traspaso parcial importe", value: 2 },
        3: { name: "traspaso parcial participaciones", value: 3 }
    }
};

ko.validation.registerExtenders();
ko.validation.init({
    insertMessages: false,
    decorateElement: true,
    errorClass: 'error_message'
});

ko.observableArray.fn.distinct = function (prop) {
    var target = this;
    target.index = {};
    target.index[prop] = ko.observable({});

    ko.computed(function () {
        //rebuild index
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
    this.ProductName = ko.pureComputed(function () {
        var name = Self.Product().Name();
        var element = $('#' + name)[0];
        ko.cleanNode(element);
        return Self.Product().Name();
    }, this);
    this.MainApplicant = ko.observable(ApplicantInit);
    this.listaOtherApplicants = ko.observableArray([]).distinct('ApplicantType');
    this.listaOtherApplicantsHasConvenienceTest = ko.observableArray([]).distinct('ApplicantType');
    this.CurrentApplicant = ko.observable(ApplicantInit);
    this.CurrentTypeTest = ko.observable(1);
    this.CurrentType = ko.observable(2);
    this.CurrentEditApplicant = ko.observable(Self.MainApplicant());
    this.ApplicantIsEditing = ko.observable(false);
    this.Operation = ko.observable();
    this.listaOtherOperations = ko.observableArray([]);
    this.listaOtherProducts = ko.observableArray([Self.Product()]);
    this.CurrentEditOperation = ko.observable(new OperationData(Self.Product()));
    this.OperationIsEditing = ko.observable(false);
    this.ProductIsEditing = ko.observable(false);
    this.ProductAddingOperations = ko.observable(false);
    this.ApplicantCloned = ko.observable();
    this.OperationCloned = ko.observable();
    this.radioSelectedOptionValue = ko.observable("N");
    this.radioSelectedOptionEnabled = ko.observable(true);
    this.SignatureData = ko.observable(new SignatureData());
    this.DocumentsData = ko.observable(new DocumentsData());
    this.MainApplicantDocumentSendingWay = ko.observable();
    this.MainApplicantScanDni = ko.observable();
    this.UserCRII = ko.observable();
    this.SalesChannel = ko.observable();
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
            validation: {
                validator: function (val) {
                    var _valid = true;
                    if (Self.validateNow()) {

                        if (val == false) {
                            _valid = false
                        }

                    }

                    return _valid;

                },
                message: 'Ya ha introducido una operación de mismo tipo'
            }
        });
    this.OperationAmountOK = ko.observable(true).extend(
        {
            validation: {
                validator: function (val) {
                    var _valid = true;
                    if (Self.validateNow()) {

                        if (val == false) {
                            _valid = false
                        }

                    }

                    return _valid;

                },
                message: 'El total de los importes de las aportaciones no puede superar el máximo por producto'
            }
        });
    this.ListOperationOK = ko.observable(true).extend(
        {
            validation: {
                validator: function (val) {
                    var _valid = true;
                    if (Self.validateNow()) {

                        if (val == false) {
                            _valid = false
                        }

                    }

                    return _valid;

                },
                message: 'Debe incluir al menos una operación'
            }
        });
    this.ApplicantOk = ko.observable(true).extend(
        {
            validation: {
                validator: function (val) {
                    var _valid = true;
                    if (Self.validateNow()) {

                        if (val == false) {
                            _valid = false
                        }

                    }

                    return _valid;

                },
                message: 'Ya existe una persona con ese documento de identidad o teléfono móvil'
            }
        });
    this.ApplicantExistsBD = ko.observable(true).extend(
        {
            validation: {
                validator: function (val) {
                    var _valid = true;
                    if (Self.validateNow()) {

                        if (val == false) {
                            _valid = false
                        }

                    }

                    return _valid;

                },
                message: 'Ya existe una persona con ese documento de identidad con un proceso de solicitud abierto'
            }
        });
    this.DocumentList = ko.observableArray();
    this.AltaCrii = ko.observable(false);
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

    this.RequestApplicantTypeEnum = ["Cotitular", "Autorizado", "Apoderado", "Representante", "Heredero", "Beneficiario Donación", "Minusválido", "Titular Real", "Titular Real y Apoderado"];

    this.errors = ko.validation.group(this);

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

    this.SaveApplicant = function () {
        if (Self.Operation() == 'I') {
            Self.CreateApplicant();
        } else {
            Self.UpdateApplicant();
        }
    };

    this.BeginCreateApplicant = function () {
        window.setDatalayerProfile(Self.CurrentType());
        Self.Operation('I');
        var applicant = new Applicant(Self.Product(), Self.ManualAssisted());
        if (Self.ManualAssisted()) {
            applicant.ApplicantBasicData().EmailCrii(Self.MainApplicant().ApplicantBasicData().EmailCrii());
            applicant.ApplicantBasicData().EmailCriiEnabled(Self.MainApplicant().ApplicantBasicData().EmailCriiEnabled());
        }
        applicant.ApplicantBasicData().RequestApplicantType(Self.CurrentType());
        applicant.ApplicantBasicData().ApplicantType(1);
        applicant.ApplicantPersonalData().IsResident('true');
        Self.CurrentEditApplicant(applicant);

        Self.CurrentEditApplicant().ApplicantPersonalData().IsResident.subscribe(function (newValue) {
            if (newValue == 'true') {
                Self.CurrentEditApplicant().ApplicantBasicData().MobilePhonePrefix("+34");
                Self.CurrentEditApplicant().ApplicantBasicData().PhoneNumberPrefix("+34");
                $("#mobileprefix" + Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType()).trigger("propertychange");
                $("#phoneprefix" + Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType()).trigger("propertychange");
            }
        });

        Self.CurrentEditApplicant().IsSameAddress.subscribe(function (newValue) {
            if (newValue) {
                Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress(Utils.CloneAddress(Self.MainApplicant().ApplicantContactData().FiscalAddress()));
            } else {
                Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress(new Address("FiscalAddress"));
            }
            bindAutocomplete();
            initAutocomplete();
        });

        bindAutocomplete();
        initAutocomplete();
        Self.ApplicantIsEditing(true);
        window.SetCleaveClass();
    };

    this.GetApplicantsByType = ko.computed(function () {
        var filterlist = Self.listaOtherApplicants().filter(function (elem) {
            return elem.ApplicantBasicData().RequestApplicantType() == Self.CurrentType()
        });
        return filterlist;
    }, Self);

    this.ManualAssisted = ko.computed(function () {             
        return (Self.MainApplicant().ApplicantBasicData().EmailCrii() != undefined && Self.MainApplicant().ApplicantBasicData().EmailCrii() != '');          
    }, Self);

    this.IsOtherProductFCR = ko.computed(function () {     
        return (Self.listaOtherProducts().some(product => product.Id() == 25));
    }, Self);

    this.BeginUpdateApplicant = function (scope) {
        Self.Operation('U');
        Self.ApplicantCloned(Utils.CloneApplicant(scope));
        Self.ApplicantIsEditing(true);
        Self.CurrentEditApplicant(scope);

        Self.CurrentEditApplicant().ApplicantPersonalData().IsResident.subscribe(function (newValue) {
            if (newValue == 'true') {
                Self.CurrentEditApplicant().ApplicantBasicData().MobilePhonePrefix("+34");
                Self.CurrentEditApplicant().ApplicantBasicData().PhonePrefix("+34");
                $("#mobileprefix" + Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType()).trigger("propertychange");
                $("#phoneprefix" + Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType()).trigger("propertychange");
            }
        });
    }

    this.ValidateAddressApoderado = function () {
        var ok = true;
        if (Self.CurrentEditApplicant().IsSameAddress()) {
            var isresident = Self.CurrentEditApplicant().ApplicantPersonalData().IsResident() == 'true';
            var titularCountry = Self.MainApplicant().ApplicantContactData().FiscalAddress().CountryId();

            if (isresident && titularCountry != 1) {
                Self.ApplicantCountryOkError('No puede indicar una dirección fiscal distinta de España. Si su dirección fiscal no se ubica en España, por favor, en el paso anterior marque no residente.');
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

        if (!Self.ValidateAddressApoderado()) {
            Self.ApplicantCountryOk(false);
        } else {
            Self.ApplicantCountryOk(true);
            if (Self.CurrentEditApplicant().IsValid(!Self.CurrentEditApplicant().IsSameAddress())) {
                $('#personal-data-content').block({ message: null });
                if (Self.CheckDocumentApplicants() && Self.CheckPhoneApplicants()) {
                    if (Self.CurrentEditApplicant().IsSameAddress()) {
                        Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress(Self.MainApplicant().ApplicantContactData().FiscalAddress());
                    }
                    Self.ApplicantOk(true);
                    Self.ApplicantIsEditing(false);
                    Self.radioSelectedOptionValue("N");
                    Self.GetApplicantsByType();
                    Self.CheckAmountValidValue();
                    Utils.scrollWindow('apoderado-content-head', -90);
                } else {
                    Self.ApplicantOk(false);
                }
                $('#personal-data-content').unblock({ message: null });
            }
        }
    };

    this.CreateApplicant = function () {
        Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress().ValidateResident(
            Self.CurrentEditApplicant().ApplicantPersonalData().IsResident() == 'true'
        );
        Self.validateNow(true);

        if (!Self.ValidateAddressApoderado()) {
            Self.ApplicantCountryOk(false);
        } else {
            Self.ApplicantCountryOk(true);
            if (Self.CurrentEditApplicant().IsValid(!Self.CurrentEditApplicant().IsSameAddress())) {
                $('#personal-data-content').block({ message: null });
                if (Self.CheckDocumentApplicants() && Self.CheckPhoneApplicants()) {
                    if (Self.CurrentEditApplicant().IsSameAddress()) {
                        Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress(Self.MainApplicant().ApplicantContactData().FiscalAddress());
                    }

                    Self.ApplicantOk(true);
                    Self.listaOtherApplicants.push(Self.CurrentEditApplicant());
                    Self.ApplicantIsEditing(false);
                    Self.radioSelectedOptionValue("N");
                    Self.CheckAmountValidValue();
                    Utils.scrollWindow('apoderado-content-head', -90);
                } else {
                    Self.ApplicantOk(false);
                }
                $('#personal-data-content').unblock({ message: null });
            }
        }
    };

    this.BeginCreateOperation = function (scope) {
        MasterData.UpdateOperationTypeList(scope.Family(), scope.ProductTypeId(), scope.Family()).then(function (result) {
            if (result) {
                Self.Operation('I');
                Self.CurrentProduct(scope);
                Self.Product(scope);
                var operation = new OperationData(scope);
                operation.SetAmountValidValues(false, Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == 10);
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
                Self.listaOtherOperations.push(Self.CurrentEditOperation());
                Self.CurrentProduct().ProductOperationList.push(Self.CurrentEditOperation());
                Self.OperationIsEditing(false);
                Self.ProductAddingOperations(false);
            }
        }
    };

    this.BeginUpdateOperation = function (scope) {
        Self.Operation('U');
        Self.OperationCloned(Utils.CloneOperation(scope));
        Self.OperationIsEditing(true);
        Self.CurrentEditOperation(scope);
    };

    this.UpdateOperation = function () {
        Self.OperationIsEditing(false);
        Self.ProductAddingOperations(false);
    };

    this.DeleteOperation = function (scope) {
        Self.CurrentProduct(scope.Product());
        Self.Operation('D');
        Self.listaOtherOperations.remove(scope);
        Self.CurrentProduct().ProductOperationList.remove(scope);
    };

    this.CancelOperation = function (scope) {
        Self.validateNow(false);
        Self.OperationOK(true);
        Self.ListOperationOK(true);
        Self.listaOtherOperations.replace(Self.CurrentEditOperation(), Self.OperationCloned());
        Self.OperationIsEditing(false);
        Self.ProductAddingOperations(false);
    };

    this.DeleteApplicant = function (scope) {
        if (Self.CurrentType() == 6 && Self.GetApplicantsByType().length == 1) {
            Self.radioSelectedOptionValue('S');
        }

        Self.Operation('D');
        Self.listaOtherApplicants.remove(scope);
    };

    // Nueva función para limpiar campos sin cerrar el formulario
    this.ResetApplicantFields = function () {
        // Crear un nuevo aplicante vacío con los valores por defecto
        var emptyApplicant = new Applicant(Self.Product(), Self.ManualAssisted());
        if (Self.ManualAssisted()) {
            emptyApplicant.ApplicantBasicData().EmailCrii(Self.MainApplicant().ApplicantBasicData().EmailCrii());
            emptyApplicant.ApplicantBasicData().EmailCriiEnabled(Self.MainApplicant().ApplicantBasicData().EmailCriiEnabled());
        }
        emptyApplicant.ApplicantBasicData().RequestApplicantType(Self.CurrentType());
        emptyApplicant.ApplicantBasicData().ApplicantType(1);
        emptyApplicant.ApplicantPersonalData().IsResident('true');
        emptyApplicant.ApplicantBasicData().MobilePhonePrefix("+34");
        emptyApplicant.ApplicantBasicData().PhoneNumberPrefix("+34");
        // Mantener las suscripciones si existen
        if (Self.CurrentEditApplicant().ApplicantPersonalData().IsResident.subscribe) {
            emptyApplicant.ApplicantPersonalData().IsResident.subscribe(function (newValue) {
                if (newValue == 'true') {
                    emptyApplicant.ApplicantBasicData().MobilePhonePrefix("+34");
                    emptyApplicant.ApplicantBasicData().PhoneNumberPrefix("+34");
                    $("#mobileprefix" + emptyApplicant.ApplicantBasicData().RequestApplicantType()).trigger("propertychange");
                    $("#phoneprefix" + emptyApplicant.ApplicantBasicData().RequestApplicantType()).trigger("propertychange");
                }
            });
        }

        if (Self.CurrentEditApplicant().IsSameAddress && Self.CurrentEditApplicant().IsSameAddress.subscribe) {
            emptyApplicant.IsSameAddress.subscribe(function (newValue) {
                if (newValue) {
                    emptyApplicant.ApplicantContactData().FiscalAddress(Utils.CloneAddress(Self.MainApplicant().ApplicantContactData().FiscalAddress()));
                } else {
                    emptyApplicant.ApplicantContactData().FiscalAddress(new Address("FiscalAddress"));
                }
                bindAutocomplete();
                initAutocomplete();
            });
        }
        // Reemplazar el applicant actual con el vacío
        Self.CurrentEditApplicant(emptyApplicant);
        // Limpiar errores de validación
        Self.validateNow(false);
        Self.ApplicantOk(true);
        Self.ApplicantCountryOk(true);
        // Limpiar mensajes de validación
        if (Self.errors && Self.errors.showAllMessages) {
            Self.errors.showAllMessages(false);
        }
        // Reinicializar autocomplete si es necesario
        if (typeof bindAutocomplete === 'function') {
            bindAutocomplete();
        }
        if (typeof initAutocomplete === 'function') {
            initAutocomplete();
        }
        // Reinicializar clases Cleave si es necesario
        if (typeof window.SetCleaveClass === 'function') {
            window.SetCleaveClass();
        }
    };

    this.CancelApplicant = function (scope) {
        if (Self.CurrentType() == 6 && Self.GetApplicantsByType().length == 0) {
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

    this.CanAddApoderados = ko.computed(function () {
        var apoderados = ko.utils.arrayFilter(Self.listaOtherApplicants(), function (a) { return a.ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.APODERADO; });
        return Self.CurrentApplicant().Assisted() || !Self.CurrentApplicant().Assisted() && apoderados.length < 2;
    }, this);

    //Create operation data for only one operation-product
    this.CreateOperationData = function (item, event) {
        $(event.target).addClass('disabled');
        $(event.target).addClass('loading');
        var ok = Self.CurrentEditOperation().ValidateOperation(Self);
        if (ok) {
            Self.CurrentProduct().ProductOperationList.splice(0, Self.CurrentProduct().ProductOperationList().length)
            Self.CurrentProduct().ProductOperationList.push(Self.CurrentEditOperation());
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
        var button = $('#continue-operation-data');
        button.addClass('loading');

        Self.validateNow(true);
        var ok = Self.CheckOperations();
        if (ok) {
            Self.ListOperationOK(true);
            Self.goToNextStep(function () {
                button.removeClass('loading');
            });
        } else {
            button.removeClass('loading');
            Self.ListOperationOK(false);
        }
    };

    this.GetTest = function (scope) {
        Self.CurrentApplicant(scope);
        Self.CurrentKnowledgeTest(scope.KnowledgeTest());
        Self.CurrentConvenienceTest(scope.ConvenienceFirstTest());
        Self.CurrentConvenienceSecondTest(scope.ConvenienceSecondTest());
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
        return 'Documentos personales del ' + Self.CurrentEditApplicant().ApplicantType() + ' ' + Self.CurrentEditApplicant().ApplicantBasicData().Name();
    }, this);

    this.CurrentApplicantSendingDocumentTitle = ko.computed(function () {
        return 'Adjuntar documentos del ' + Self.CurrentEditApplicant().ApplicantType() + ' ' + Self.CurrentEditApplicant().ApplicantBasicData().Name() + supportedFormat;
    }, this);

    this.ViewDocuments = function (scope) {
        Self.CurrentEditApplicant(scope);
    };

    this.BeginCreateProduct = function () {
        Self.Operation('I');
        Self.ProductIsEditing(true);
        Self.ClearProductSelecction();
    };

    this.CreateProduct = function () {
        var ExistProduct = Self.listaOtherProducts().some(Self.ExistsProduct);
        if (!ExistProduct) {
            Self.listaOtherProducts.push(MasterData.getProductById(Self.ProductModel().Product()));
            Self.ProductIsEditing(false);
        } else {
            Self.ProductIsEditing(false);
        }
        Self.ClearProductSelecction();
    };

    this.DeleteProduct = function (scope) {
        Self.Operation('D');
        Self.listaOtherProducts.remove(scope);
    };

    this.CancelProduct = function () {
        Self.ProductIsEditing(false);
        Self.ClearProductSelecction();
    };

    this.ClearProductSelecction = function () {
        Self.ProductModel().Product("");
        Self.ProductModel().ProductType("");
        // Limpiar selecciones de radio buttons
        $('input[name="typeproduct"]').prop('checked', false);
        $('input[name^="product-type"]').prop('checked', false);
        $('[id^=product-content-]').each(function () {
            $(this).hide();
        });
    };

    this.ExistsProduct = function (product) {
        return product.Id() == Self.ProductModel().Product();
    };

    this.AllowAddOperation = ko.computed(function () {
        return Self.CurrentProduct().ProductOperationList().length < 1;
    }, this);

    this.AllowAddProduct = ko.computed(function () {
        return true;
    }, this);

    this.ValidateOperationList = function () {
        var ok = true;
        var operationtype = Self.CurrentEditOperation().IdOperationType();

        Self.CurrentProduct().ProductOperationList().forEach(function (op) {
            if (op.IdOperationType() == operationtype && operationtype != '3') {
                ok = false;
                Self.OperationOK(false);
            }
        });

        if (ok) {
            Self.OperationOK(true);
        }

        return ok;
    }

    //navegación
    this.CurrentStep = "BasicData";
    this.StepsOrder = [];

    this.SetSteps = function () {
        if (Self.Product().ProductTypeId() == ProductTypeEnum.ASESORAMIENTOS) {
            Self.StepsOrder = [
                "BasicData",
                "ContactData",
                "AgentData",
                "OperationIbanAssistedData",
                "TestData",
                "SignatureData",
                "DocumentData",
                "Success",
                "Error"
            ];
        }
        else {
            Self.StepsOrder = [
                "BasicData",
                "ContactData",
                "AgentData",
                "OperationData",
                "OperationIbanAssistedData",
                "TestData",
                "SignatureData",
                "DocumentData",
                "Success",
                "Error"
            ];
        }
    };

    this.ChangueCurrentStep = function (step) {
        Self.CurrentStep = step;
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

    this.Init = function (crii, usercrii, mailcrii, ProductTypeList) {
        if (crii.toString() == 'false') {
            var operation = new OperationData(Self.CurrentProduct());
            Self.CurrentEditOperation(operation);
            Self.OperationIsEditing(true);
        }
        if (Self.CurrentProduct().ProductTypeId() == 4) {
            Self.MainApplicant().ApplicantContactData().PostalAddress().ValidateEPSVPostalCode(false);
            Self.MainApplicant().ApplicantContactData().FiscalAddress().ValidateEPSVPostalCode(true);
        }

        if (Self.CurrentProduct().ProductTypeId() == 1 || Self.CurrentProduct().ProductTypeId() == 4) {
            Self.SpecialRequestApplicantType([
                new Valor(8, "El solicitante es Heredero o Nudo Propietario"),
                new Valor(9, "El solicitante está en un proceso de Donación"),
                new Valor(10, "Titular Minusválido")
            ]);
        } else {
            Self.SpecialRequestApplicantType([
                new Valor(8, "El solicitante es Heredero o Nudo Propietario"),
                new Valor(9, "El solicitante está en un proceso de Donación")
            ]);
        }

        Self.ProductModel(new ProductData(ProductTypeList));
        Self.AltaCrii(crii.toString() == 'true');
        Self.UserCRII(usercrii);
        Self.MainApplicant().ApplicantBasicData().EmailCrii(mailcrii);
        if (Self.Product().ProductTypeId() == ProductTypeEnum.ASESORAMIENTOS) {
            Self.MainApplicant().ApplicantBasicData().EmailCriiEnabled(false);
            Self.MainApplicant().ApplicantBasicData().SpecialRequestApplicantTypeEnabled(false);
            Self.titleStep2('Cuenta asociada');
            Self.dataProgressStep2(0);
        }
        Self.MainApplicant().ApplicantBasicData().ProductTypeId(Self.CurrentProduct().ProductTypeId());
        Self.SetSteps();
        Self.IsFCRFlag((Self.CurrentProduct().Id() == 25 && crii.toString() == 'true'));        
    };
 
    this.ExistsSameDocument = function (applicant) {
        return (applicant.ApplicantBasicData().DNI().toUpperCase() == Self.CurrentEditApplicant().ApplicantBasicData().DNI().toUpperCase()
            &&
            applicant != Self.CurrentEditApplicant()
        );
    };

    this.ExistsSameMobile = function (applicant) {
        return (applicant.ApplicantBasicData().MobilePhoneNumber() == Self.CurrentEditApplicant().ApplicantBasicData().MobilePhoneNumber()
            &&
            applicant != Self.CurrentEditApplicant()
        );
    };

    this.ExistsProductWithNoOperations = function (product) {
        return product.ProductOperationList().length == 0;
    };

    this.ExistsFondo = function (product) {
        return product.ProductTypeId() == 2 || product.ProductTypeId() == 3;
    };

    this.IsMinor = function (applicant) {
        return !applicant.IsOlderThan18();
    };

    this.HideSpecificProductTabs = function () {
        if (this.Product().ProductTypeId() == ProductTypeEnum.PLANES) {
            $('#cotitular-content-head, #autorizado-content-head').addClass('hidden');
        } else if (this.Product().ProductTypeId() == ProductTypeEnum.ASESORAMIENTOS) {
            $('#beneficiario-content-head, #operationtype-content-head').removeClass('complete').addClass('hidden');
        } else {
            $('#beneficiario-content-head').addClass('hidden');
        }
    };

    this.CheckDocumentApplicants = function () {
        if (Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == 5) {
            //Si es tutor puede coincidir con un cotitular siempre que el cotitular sea mayor de edad
            var samedocumentlist =
                ko.utils.arrayFilter(Self.listaOtherApplicants(), function (a) {
                    return (a.ApplicantBasicData().RequestApplicantType() == 2 && !a.IsOlderThan18()
                        && a.ApplicantBasicData().DNI().toUpperCase() == Self.CurrentEditApplicant().ApplicantBasicData().DNI().toUpperCase()
                        && a != Self.CurrentEditApplicant()) ||
                        (a.ApplicantBasicData().RequestApplicantType() != 2
                            && a.ApplicantBasicData().DNI().toUpperCase() == Self.CurrentEditApplicant().ApplicantBasicData().DNI().toUpperCase()
                            && a != Self.CurrentEditApplicant());
                });

            var titular_ok = Self.CurrentEditApplicant().ApplicantBasicData().DNI() != Self.MainApplicant().ApplicantBasicData().DNI();
            return samedocumentlist.length == 0 && titular_ok;
        } else {
            var samedocument_titular = Self.CurrentEditApplicant().ApplicantBasicData().DNI().toUpperCase() == Self.MainApplicant().ApplicantBasicData().DNI().toUpperCase();
            var samedocument_others = Self.listaOtherApplicants().some(this.ExistsSameDocument);
            return !samedocument_titular && !samedocument_others;
        }
    };

    this.CheckPhoneApplicants = function () {
        return true;
    }

    this.CheckOperations = function () {
        var NoOperations = Self.listaOtherProducts().some(this.ExistsProductWithNoOperations);
        if (Self.CurrentStep == "OperationData" && NoOperations) {
            return false;
        } else {
            return true;
        }
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

        var p = MasterData.getQuestions(Self.MainApplicant().ApplicantBasicData().ApplicantType(),
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

            var mainApplicantTests = Self.GetTestStepsByApplicant(Self.MainApplicant());
            mainApplicantTests[0].forEach(function (step) { knowledgeTestSteps.push(step); });
            mainApplicantTests[1].forEach(function (step) { convenienceTestSteps.push(step); });

            Self.listaOtherApplicants().forEach(function (a, index) {
                MasterData.getQuestionsSync(1, a.ApplicantBasicData().RequestApplicantType(), fondo, a.IsOlderThan18(), function (result) {
                    var fundOnlyProducts = Self.listaOtherProducts().filter(function (product) {
                        if (product.ProductTypeId() == ProductTypeEnum.FONDOS || product.ProductTypeId() == ProductTypeEnum.INVERSIONLIBRE) {
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

                        a.KnowledgeTest(new KnowledgeTestRepresentative(a));
                        if (convenienceTestRequirement != false || convenienceTestRequirement === undefined) {
                            Self.SetConvenienceTest(a);
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

    this.IsConvenienceTest = function () {
        return Self.listaOtherProducts().some(Self.ExistsFondo);
    };

    this.CheckApplicantType = function (nextstep) {
        switch (nextstep) {
            case "CoownerData":
                Self.CurrentType(2);
                break;
            case "AuthorizedData":
                Self.CurrentType(3);
                break;
            case "TutorData":
                Self.CurrentType(5);
                break;
            case "BeneficiaryData":
                Self.CurrentType(4);
                break;
            case "AgentData":
                Self.CurrentType(6);
                break;
        }
    };

    this.CheckAmountValidValue = function () {
        Self.CurrentEditOperation().SetAmountValidValues(false, Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == 10);
    };

    this.CheckResidentSpain = function () {
        Self.CurrentEditApplicant().ApplicantContactData().FiscalAddress().ValidateResident('juridic');
    };

    this.GetApplicantsByRequestApplicantType = function (RequestApplicantType) {
        var applicants = (
            $.grep(Self.listaOtherApplicants(), function (e) {
                return e.ApplicantBasicData().RequestApplicantType() == RequestApplicantType;
            })
        );
        return applicants;
    }

    this.SetPerfiles = function () {
        var perfiles = '';
        var coowners = Self.GetApplicantsByRequestApplicantType(2);
        var authorized = Self.GetApplicantsByRequestApplicantType(3);
        var beneficiaries = Self.GetApplicantsByRequestApplicantType(4);
        var tutors = Self.GetApplicantsByRequestApplicantType(5);
        var apoderados = Self.GetApplicantsByRequestApplicantType(6);

        if (coowners.length > 0) {
            perfiles = perfiles + "co;";
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
        if (apoderados.length > 0) {
            perfiles = perfiles + "ap;";
        }

        if (perfiles != '') {
            perfiles = perfiles.slice(0, -1);
        }

        window.setDatalayerItem('perfiles', perfiles);
    };

    this.goToNextStep = function (callback, notValidCallback) {
        Self.CheckResidentSpain();

        Navigation.DisableReload = true;

        var currentStepOrder = this.StepsOrder.indexOf(this.CurrentStep);
        var previousStep = this.StepsOrder[(currentStepOrder > 0) ? currentStepOrder - 1 : 0];

        if (currentStepOrder < (this.StepsOrder.length - 1)) {

            if (this.StepsOrder[currentStepOrder] == 'PersonalData') {
                this.CheckAmountValidValue();
            }

            Self.CheckApplicantType(this.StepsOrder[currentStepOrder + 1]);
            Self.radioSelectedOptionValue('N');

            if (this.CurrentStep == 'OperationData' || this.CurrentStep == 'OperationIbanAssistedData') {
                var _this = this;
                this.SetComplexityProducts(function () {
                    _this.CheckApplicantQuestions(function () {
                        Navigation.NextStep(_this.CurrentStep, _this.StepsOrder[currentStepOrder + 1]);
                        if (typeof callback === 'function' && callback) {
                            callback();
                        }
                    });
                });
            } else {
                if (this.CurrentStep.indexOf('TestData') == 0 && !Self.CurrentApplicant().ValidateQuestion(Self.CurrentTypeTest())) {
                    window.scrollError();
                    if (typeof notValidCallback === 'function' && notValidCallback) {
                        notValidCallback();
                    }
                } else {

                    if (this.CurrentStep.indexOf('TestData1-' + Self.MainApplicant().ApplicantBasicData().DNI() + "1") == 0) {
                        Self.UpdateStepsByFinantialQuestion();
                    }

                    if (Self.CheckConvenience()) {
                        var nextStep = this.StepsOrder[currentStepOrder + 1];

                        if (nextStep == "AgentData") {
                            if (Self.GetApplicantsByType().length == 0) {
                                Self.radioSelectedOptionValue('S');
                                Self.radioSelectedOptionEnabled(false);
                            }
                        }

                        if (nextStep == 'SignatureData') {
                            Self.CreateRequestData();
                        } else if (nextStep == 'Success' &&
                            (
                                Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == '8' ||
                                Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == '9' ||
                                Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == '10'
                            )
                        ) {
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
        Self.CheckResidentSpain();

        var currentStepOrder = this.StepsOrder.indexOf(_currentStep);
        var previousStep = this.StepsOrder[(currentStepOrder > 0) ? currentStepOrder - 1 : 0];

        if (previousStep.indexOf('TestData') == 0 && !Self.CurrentApplicant().ValidateQuestion(Self.CurrentTypeTest())) {
            window.scrollError();
        } else {
            this.CurrentStep = _currentStep;

            currentStepOrder = this.StepsOrder.indexOf(this.CurrentStep);
            previousStep = this.StepsOrder[(currentStepOrder > 0) ? currentStepOrder - 1 : 0];

            if (currentStepOrder < (this.StepsOrder.length - 1)) {

                if (this.StepsOrder[currentStepOrder] == 'PersonalData') {
                    this.CheckAmountValidValue();
                }

                Self.CheckApplicantType(this.StepsOrder[currentStepOrder + 1]);
                Self.radioSelectedOptionValue('N');

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
        if (Self.CurrentStep.indexOf('TestData') == 0) {
            var substep = Self.CurrentStep.split('-')[0];
            var testType = substep.substr(substep.length - 1);
            if (testType > 1) {
                if (Self.CurrentConvenienceTest().IsComplex()) {
                    Self.CurrentConvenienceTest().ConvenienceResult(undefined);
                    Self.CurrentConvenienceTest().NoCovenienceConfirmQuestion().questionOK(true);
                }
            }
        }
        history.back();
    };

    this.CheckMinor = function () {
        //En jurídicas no hay que comprobar existencia de menores
    };

    this.FillSignatureDataMobiles = function () {

        Self.listaOtherApplicants().forEach(function (a) {
            if (a.ApplicantBasicData().MobilePhoneNumber() != ''
                && a.ApplicantBasicData().MobilePhoneNumber() != undefined
                && a.ApplicantBasicData().RequestApplicantType() != 4
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

    this.ManageOwner = function (owner, type) {
        var isApoderado = false;
        Self.listaOtherApplicants().forEach(function (a) {
            if (a.ApplicantBasicData().DNI() == owner.DNI()) {
                isApoderado = true;

                switch (type) {
                    case RequestApplicantTypeEnum.TITULARREAL:
                        {
                            a.ApplicantBasicData().RequestApplicantType(RequestApplicantTypeEnum.TITULARREALANDAPODERADO);
                            a.ApplicantPersonalData().CompanyPercentage(owner.Percentage());
                            break;
                        }

                    case RequestApplicantTypeEnum.ADMINISTRADOR:
                        {
                            a.ApplicantBasicData().RequestApplicantType(RequestApplicantTypeEnum.APODERADOYADMINISTRADOR);
                            break;
                        }

                    case RequestApplicantTypeEnum.PATRONO:
                        {
                            a.ApplicantBasicData().RequestApplicantType(RequestApplicantTypeEnum.PATRONOYAPODERADO);
                            a.ApplicantPersonalData().CompanyPercentage(owner.Percentage());
                            break;
                        }

                    case RequestApplicantTypeEnum.ORGANOREPRESENTACION:
                        {
                            a.ApplicantBasicData().RequestApplicantType(RequestApplicantTypeEnum.ORGANOREPRESENTACIONYAPODERADO);
                            break;
                        }
                }
            }
        });

        if (!isApoderado) {
            var applicant = new Applicant(Self.CurrentApplicant().Product(), Self.CurrentApplicant().Assisted());

            applicant.ApplicantBasicData().ApplicantType(ApplicantTypeEnum.FISICA);
            applicant.ApplicantBasicData().DNI(owner.DNI());
            applicant.ApplicantBasicData().Name(owner.Name());
            applicant.ApplicantBasicData().FirstSurname(owner.FirstSurname());
            applicant.ApplicantBasicData().SecondSurname(owner.SecondSurname());
            applicant.ApplicantPersonalData().Country(owner.Country());
            applicant.ApplicantPersonalData().BornPlace(owner.BornPlace());
            applicant.ApplicantPersonalData().Nationality(owner.Nationality());
            applicant.ApplicantPersonalData().Birthday(owner.Birthday());
            applicant.ApplicantPersonalData().IDDocumentExpirationDate(owner.IDDocumentExpirationDate());
            applicant.ApplicantPersonalData().IDDocumentIsPermanent(owner.IDDocumentIsPermanent());
            applicant.ApplicantBasicData().RequestApplicantType(type);
            applicant.ApplicantPersonalData().CompanyPercentage(Utils.GetDecimalValue(owner.Percentage()));
            applicant.ApplicantBasicData().IDDocumentType(owner.DocumentType());
            applicant.ApplicantPersonalData().FiscalCountry(owner.FiscalCountry());
            applicant.ApplicantPersonalData().FiscalNumber(owner.FiscalNumber());
            applicant.ApplicantPersonalData().UsaFiscalNumber(owner.UsaFiscalNumber());
            applicant.ApplicantBasicData().IDDocumentType(owner.DocumentType().id);

            if (owner.ShowAddressInfo() && !owner.SameTitularAddress()) {
                applicant.ApplicantContactData(new ContactData());
                applicant.ApplicantContactData().FiscalAddress(owner.FiscalAddress());
            } else {
                applicant.ApplicantContactData(Self.CurrentApplicant().ApplicantContactData());
            }

            var country = applicant.ApplicantContactData().FiscalAddress().CountryId();

            applicant.ApplicantPersonalData().IsResident(country == 1);

            Self.listaOtherApplicants.push(applicant);
        }

    };

    this.GetJsonRequestData = function () {

        var mainKnowledgeTest = Self.MainApplicant().KnowledgeTest();
        var companyType = mainKnowledgeTest.companyTypeQuestion().value().id();
        var isFinantial = mainKnowledgeTest.fatcaCrsQuestion().isFinantialAnswer();
       
        if (!isFinantial) {
            if (companyType == 242) {
                mainKnowledgeTest.realOwnerQuestion().owners().forEach(function (o) {
                    Self.ManageOwner(o, RequestApplicantTypeEnum.TITULARREAL);
                });

                mainKnowledgeTest.adminOwnerQuestion().owners().forEach(function (o) {
                    Self.ManageOwner(o, RequestApplicantTypeEnum.ADMINISTRADOR);
                });
            } else {
                mainKnowledgeTest.patronOwnerQuestion().owners().forEach(function (o) {
                    Self.ManageOwner(o, RequestApplicantTypeEnum.PATRONO);
                });

                mainKnowledgeTest.representationOwnerQuestion().owners().forEach(function (o) {
                    Self.ManageOwner(o, RequestApplicantTypeEnum.ORGANOREPRESENTACION);
                });
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
            "RefundAccountNumber": Self.MainApplicant().ApplicantRefundAccountNumberData().AccountNumber(),
            "AccountNumberAcceptanceDate": Self.MainApplicant().ApplicantRefundAccountNumberData().AccountNumberAcceptanceDate(),
            "OperationData": [],
            "requestID": Self.RequestId(),
            "SignatureType": Self.SignatureType(),
            "UserName": Self.UserCRII()
        };

        var otherApplicantsData = Self.listaOtherApplicants();
        var SetSignatureType = true;
        otherApplicantsData.forEach(function (a) {          
            if (a.ApplicantBasicData().RequestApplicantType() == 2 && SetSignatureType) {
                a.ApplicantBasicData().SignatureType(Self.SignatureType());
                SetSignatureType = false;
            }
            var applicantdata = a.getApplicantDataForSaveRequest();
            if (applicantdata.PersonalData.Country == undefined || applicantdata.PersonalData.Country == null) { applicantdata.PersonalData.Country = 1; }
            if (applicantdata.PersonalData.Nacionality == undefined || applicantdata.PersonalData.Nacionality == null) { applicantdata.PersonalData.Nacionality = 1; }
            data.Applicants.push(applicantdata);
        });

        var productslist = Self.listaOtherProducts();
        productslist.forEach(function (p) {
            data.OperationData.push(p.ViewModelToJSON());
        });

        return data;
    };

    this.SuccessTextOperation = ko.computed(function () {

        var textoperationlist = [];
        var existstransfer = false;

        Self.listaOtherProducts().forEach(function (p) {
            p.ProductOperationList().forEach(function (op) {
                if (op.IdOperationType() == '3') {
                    if (!existstransfer) {
                        existstransfer = true;
                        var txt = Utils.GetOperationText(p, op, true);
                        if (txt != '') {
                            textoperationlist.push(new Valor(1, txt));
                        }
                    }
                } else {
                    var txt = Utils.GetOperationText(p, op, true);
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

        if (Self.SignatureData().IdDocumentSignatureType() == 1) {

            if (Self.MainApplicantScanDni() == 'true') {
                txt = '';
            } else {
                switch (parseInt(Self.MainApplicantDocumentSendingWay())) {
                    case 1:
                        txt = '';
                        break;
                    case 2:
                        txt = 'Una vez que nos hayas enviado la copia del documento de identidad a C/ Juan de Mena 8, 1ª planta (28.014 Madrid), nos pondremos en contacto contigo para confirmarte que hemos recibido correctamente tu documento.';
                        break;
                    case 3:
                        txt = 'Ponte en contacto con nosotros para solicitar un mensajero que recoja tu copia del documento de identidad en la dirección que nos indiques. Llámanos al 900 878 280 o solicítalo a través del chat on-line.';
                        break;
                    case 4:
                        txt = 'Envíanos tu documento de identidad al e-mail bestinver@bestinver.es';
                        break;
                }
            }
        } else {
            switch (parseInt(Self.SignatureData().IdSendingWay())) {
                case 1:
                    txt = 'Imprime y firma los documentos que has descargado. Haz también una copia de tu documento de identidad. Solicítanos un mensajero gratuito que recoja los contratos firmados y la copia de tus documentos, puedes llamarnos al 900 878 280';
                    break;
                case 2:
                    txt = 'En breve te enviaremos la documentación que tienes que firmar a la dirección postal que nos has indicado. Una vez que la recibas, encontrarás la instrucciones para devolvernos la documentación firmada junto con copia de tu documento de identidad';
                    break;
            }
        }

        if (Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == 8 || Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == 9 || Self.MainApplicant().ApplicantBasicData().RequestApplicantType() == 10) {
            txt = 'Muchas gracias por completar el proceso de alta, el Equipo de Relación con el Inversor contactará contigo para indicarte los próximos pasos a seguir.<br/><br/>Si lo deseas,  puedes ponerte en contacto con nosotros a través del teléfono 900 878 280 o del correo electrónico bestinver@bestinver.es';
        }

        return txt;

    }, this);

    this.MessageToEmail = function () {
        var messagearray = [];
        var existstransfer = false;
        Self.listaOtherProducts().forEach(function (p) {
            p.ProductOperationList().forEach(function (op) {
                if (op.IdOperationType() == '3') {
                    if (!existstransfer) {
                        existstransfer = true;
                        var txt = Utils.GetOperationText(p, op, true);
                        if (txt != '') {
                            messagearray.push(txt);
                        }
                    }
                } else {
                    var txt = Utils.GetOperationText(p, op, true);
                    if (txt != '') {
                        messagearray.push(txt);
                    }
                }
            });
        });
        messagearray.push(Self.SuccessTextSignature());

        Request.CompleteProcess(Self.MainApplicant().ApplicantBasicData().RequestId(), messagearray, Self.DocumentsData().IdSendingWay());
    };

    this.GetNextApplicantSignature = function (include_minors) {
        var applicant;

        if (Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == 1) {
            for (var i = 0; i < Self.listaOtherApplicants().length; i++) {
                if ((Self.listaOtherApplicants()[i].IsOlderThan18() || include_minors)
                    && (Self.listaOtherApplicants()[i].ApplicantBasicData().RequestApplicantType() != 4)) {
                    applicant = Self.listaOtherApplicants()[i];
                    break;
                }
            }
        } else {
            var index = Self.listaOtherApplicants().indexOf(Self.CurrentEditApplicant()) + 1;
            for (var i = index; i < Self.listaOtherApplicants().length; i++) {
                if ((Self.listaOtherApplicants()[i].IsOlderThan18() || include_minors)
                    && (Self.listaOtherApplicants()[i].ApplicantBasicData().RequestApplicantType() != 4)) {
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
        //Self.SetStepsTransferOrigin();
        Request.CreateBasicData(Self);
        Self.SignatureData().RequestId(Self.MainApplicant().ApplicantBasicData().RequestId());
        $('#basicdata-dni').attr('readonly', true);
    };

    this.CreateDocumentsData = function () {
        if (Self.DocumentsData().IdSendingWay() == 1) {
            var requiredDocuments = [
                { "Id": "1", "Title": "Copia CIF sociedad", "Property": "CIFSociedad", "IsArray": "false", "MaxFileSize": "false" },
                { "Id": "2", "Title": "Copia de escrituras de constitución o certificado de titularidad real", "Property": "EscriturasCertificado", "IsArray": "true", "MaxFileSize": "true" },
                { "Id": "3", "Title": "Copia de los poderes de los apoderados", "Property": "PoderesApoderados", "IsArray": "true", "MaxFileSize": "true" }
            ];
            ko.utils.arrayForEach(Self.listaOtherApplicants(), function (applicant, index) {
                var elem = { "Id": "4" + index, "Title": "Copia del DNI de " + applicant.ApplicantBasicData().Name(), "Property": "DNIsPersonasFisicas", "IsArray": "true", "IsDNI": "true", "Item": applicant.ApplicantBasicData().DNI(), "MaxFileSize": "false" };
                requiredDocuments.push(elem);
            });

            var inputsList = [];
            var hasFiles = [];
            ko.utils.arrayForEach(requiredDocuments, function (doc, index) {                
                //Initialize
                if (doc.IsArray != "true")
                    Self.DocumentsData()[doc.Property]('');
                else
                    Self.DocumentsData()[doc.Property]([]);

                var inputs = $('#documentationdelivery-id' + doc.Id + ' input:file');
                if (inputs.length > 0)
                    hasFiles[parseInt(doc.Id) - 1] = false;                
                for (var j = 0; j < inputs.length; j++) {
                    if (inputs[j].files.length > 0) {
                        var inputFile = inputs[j].files[0];
                        var inputFileType = inputFile.type.split("/")[0];

                        if (inputFileType == "application") {
                            inputFileType = inputFile.type.split("/")[1];
                        }
                        if (inputFileType == '') {
                            inputFileType = inputFile.name.substr(inputFile.name.lastIndexOf('.') + 1);
                        }
                        var fileSize = doc.MaxFileSize == "true" ? maxLargeFileUploadSize : maxFileUploadSize;
                        var hasValidFile = ((inputFileType == "pdf" && inputs[j].files[0].size <= fileSize) || inputFileType == "image");
                        if (hasValidFile) {
                            hasFiles[parseInt(doc.Id) - 1] = doc;
                            var dataFile = new Object();
                            dataFile.doc = doc;
                            dataFile.files = inputs[j].files;
                            inputsList = inputsList.concat(dataFile);
                        }
                        else {
                            hasFiles[parseInt(doc.Id) - 1] = false;
                        }
                    }
                }                
            });


            if (hasFiles.length == 0 || ko.utils.arrayFirst(hasFiles, function (hf) { return hf == false; }) != null) {
                for (var j = 0; j < hasFiles.length; j++) {
                    if (hasFiles[j]) {
                        var doc = hasFiles[j];
                        //Setear valor ok
                        if (doc.IsArray != "true")
                            Self.DocumentsData()[doc.Property]('ok');
                        else {
                            Self.DocumentsData()[doc.Property]().push(doc.Item || 'ok');
                            Self.DocumentsData()[doc.Property].valueHasMutated();
                        }
                    }
                }
                Self.DocumentsData().IsValid();
                return;
            }
            else {
                //Subida secuencial de documentos... 
                $('#save-applicant-document-data').addClass('loading');
                $('#applicant-document-content').block({ message: null });
                Self.DocumentsData().IsUploading(true);
                Self.SaveSequential(0, requiredDocuments, inputsList, Self.SaveSequential);
            }
        } else {
            if (Self.DocumentsData().IsValid())
                Self.SaveDocumentsData();
        }
    };
    this.IdDocDNI = 0;
    this.LastIdDNI = 0;
    this.NumeroPoderes = 0;
    this.NumeroEscritura = 0;

    this.SaveSequential = function (idDoc, requiredDocuments, inputsList, callback) {

        var currentInput = inputsList[idDoc];
        var doc = currentInput != null ? currentInput.doc : null;
        if (doc == null) {
            Self.SaveDocumentsData_Complete(true);
            return;
        }
        if (doc.IsArray != "true")
            Self.DocumentsData()[doc.Property]('');
        else
            Self.DocumentsData()[doc.Property]([]);

        Utils.GetBase64(inputsList[idDoc].files[0]).then(function (result) {                       
            //result cotiene el base64 del fichero

            if (doc.IsArray != "true") {
                //Cuando no es un array
                //Esto agrega una propiedad 'dinamica' al objeto que va a enviar al backend
                //cuyo nombre es doc.Property (CIFSociedad, PoderesApoderados, EscriturasCertificado, DNIsPersonasFisicas)
                //cuyo valor es el fichero en base64                
                Self.DocumentsData()[doc.Property](result);                 
            }
            else {                
                if (doc.IsDNI == "true") {
                    //Cuando es un array de DNIs
                    //Esto agrega una propiedad 'dinamica' al objeto que va a enviar al backend
                    //cuyo nombre es doc.Property (CIFSociedad, PoderesApoderados, EscriturasCertificado, DNIsPersonasFisicas)
                    //y cuyo valor ya es un array al que le agrega un unico elemento con el base 64 del fichero

                    if (Self.LastIdDNI != doc.Id) {
                        Self.IdDocDNI = 0;
                        Self.LastIdDNI = doc.Id;
                    }
                    var objArray = Self.DocumentsData()[doc.Property]();
                    var objArrayNumeros = Self.DocumentsData()[doc.Property + "Numeros"];

                    objArray.push(result);
                    objArrayNumeros(doc.Item);
                    Self.DocumentsData().IsReversoDni(Self.IdDocDNI % 2 != 0);
                    Self.IdDocDNI++;
                }
                else {
                    //Cuando es un array de Escrituras o poderes
                    //Esto agrega una propiedad 'dinamica' al objeto que va a enviar al backend
                    //cuyo nombre es doc.Property (CIFSociedad, PoderesApoderados, EscriturasCertificado, DNIsPersonasFisicas)
                    //y cuyo valor ya es un array al que le agrega un unico elemento con el base 64 del fichero
                    Self.DocumentsData()[doc.Property]().push(result);

                }

                switch (doc.Property) {
                    case "CIFSociedad": Self.DocumentsData().FileName("CIF"); break;
                    case "PoderesApoderados": Self.NumeroPoderes++; Self.DocumentsData().FileName("Poder-" + Self.NumeroPoderes); break;
                    case "EscriturasCertificado": Self.NumeroEscritura++; Self.DocumentsData().FileName("Escritura-" + Self.NumeroEscritura);  break;
                    default: Self.DocumentsData().FileName("");
                }               

                //Forzamos que kockout se entere de que el objeto a sido modificado a la fuerza
                //Saltandose el ciclo de vida del propio kockout
                Self.DocumentsData()[doc.Property].valueHasMutated(); 
            }
            result = null;

            Self.SaveDocumentsData(function (resulOk) {
                if (!resulOk) {
                    Self.ErrorMessage("Se ha producido un error en el envío sequencial de documentación.");
                    Navigation.NextStep(Self.CurrentStep, 'Error');
                }
                else {
                    if (doc.IsArray != "true")
                        Self.DocumentsData()[doc.Property]('');
                    else
                        Self.DocumentsData()[doc.Property]([]);

                    if (callback) {
                        callback(++idDoc, requiredDocuments, inputsList, Self.SaveSequential);
                    }
                }
            });
        });
    };

    this.SaveDocumentsData_Complete = function (result) {
        if (result) {
            sessionStorage.removeItem('DniAnverso');
            sessionStorage.removeItem('DniReverso');
            sessionStorage.removeItem('MzdData');
            Self.MessageToEmail();
            Self.goToNextStep();
        }
        else {
            var txt = '';

            switch (Self.DocumentsData().IdSendingWay()) {
                case "1":
                    txt = 'No hemos podido recibir correctamente tu documento de identidad, nos pondremos en contacto contigo para indicarte cómo puedes enviárnoslo. Te recordamos que puedes enviárnoslo al email bestinver@bestinver.es indicando en el asunto tu documento o solicítanos un mensajero gratuito a través del teléfono 900 878 280.';
                    break;
                case "2":
                    txt = 'No hemos podido recibir correctamente tu documento de identidad, nos pondremos en contacto contigo para indicarte cómo puedes enviárnoslo. Te recordamos que puedes enviárnoslo al email bestinver@bestinver.es indicando en el asunto tu documento o solicítanos un mensajero gratuito a través del teléfono 900 878 280.';
                    break;
                case "3":
                    txt = 'Se ha producido un error, nos pondremos en contacto contigo para indicarte cómo puedes enviarnos tu documento de identidad.';
                    break;
                case "4":
                    txt = 'Se ha producido un error, nos pondremos en contacto contigo para indicarte cómo puedes enviarnos tu documento de identidad.';
                    break;
            }

            sessionStorage.removeItem('DniAnverso');
            sessionStorage.removeItem('DniReverso');
            sessionStorage.removeItem('MzdData');
            Self.ErrorMessage(txt);
            Navigation.NextStep(Self.CurrentStep, 'Error');
        }
    };

    this.SaveDocumentsData = function (callback) {
        if (callback == null) {
            Request.SaveDniData(Self.DocumentsData(), this.SaveDocumentsData_Complete);
        }
        else {
            Request.SaveDniData(Self.DocumentsData(), callback);
        }
    };

    this.CreateSignatureData = function () {
        Self.UpdateApplicantMobilePhone();
        Request.CreateSignatureData(Self);
    };

    this.SignatureApplicant = function () {
        var applicant = Self.GetNextApplicantSignature(false);
        if (applicant != null) {
            $('#success-signature').toggleClass('hidden');
            Self.CurrentEditApplicant(applicant);
            Self.InitSignApplicantDocument();
            if (applicant.ApplicantBasicData().RequestApplicantType() == 4 || applicant.ApplicantBasicData().RequestApplicantType() == 3) {
                $('#signature-sms').css('display', 'block');
            }
        } else {
            Self.DocumentsData().validateNow(false);
            Self.CurrentEditApplicant(Self.MainApplicant());
            Self.goToNextStep();
        }
    };

    this.SetApplicantDocuments = function (docs) {

        //Guardar documentos de la sociedad
        var filterlist = (
            $.grep(docs, function (e) {
                return e.Dni().toUpperCase() == Self.MainApplicant().ApplicantBasicData().DNI().toUpperCase()
            })
        );

        if (filterlist.length == 1) {
            Self.CurrentEditApplicant(Self.MainApplicant());
            Self.MainApplicant().PdfDocumentData(filterlist[0]);
            Self.InitSignApplicantDocument();
        };

        //Guardar documentos del restos de cotitulares/autorizados/beneficiarios/tutores
        ko.utils.arrayForEach(Self.listaOtherApplicants(), function (_applicant) {

            var filterlist = (
                $.grep(docs, function (e) {
                    return e.Dni().toUpperCase() == _applicant.ApplicantBasicData().DNI().toUpperCase()
                })
            );

            if (filterlist.length == 1) {
                _applicant.PdfDocumentData(filterlist[0]);
            };
        });
    };

    this.InitDocumentApplicant = function (applicant) {
        Self.DocumentsData().RequestId(Self.MainApplicant().ApplicantBasicData().RequestId());
        Self.DocumentsData().MzdData('');
        Self.DocumentsData().Dni(applicant.ApplicantBasicData().DNI());
        Self.DocumentsData().IdSendingWay(1);
        Self.DocumentsData().ListaOtherApplicants(Self.listaOtherApplicants());
        $('.unlimited_upload').click(function (evt) {
            var numfiles = parseInt(evt.currentTarget.parentNode.getAttribute("data-extrainputs").split(",").length);
            if (numfiles >= 4) return;

            var newId = parseInt(evt.currentTarget.parentNode.getAttribute("data-extrainputs").split(",").slice(-1)[0].replace("documentationdelivery-idfiles", ""));
            newId++;
            var newAttributeValue = evt.currentTarget.parentNode.getAttribute("data-extrainputs") + ",documentationdelivery-idfiles" + newId;
            evt.currentTarget.parentNode.setAttribute("data-extrainputs", newAttributeValue);
        });
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
        }
        else if (Self.CurrentEditApplicant().PdfDocumentData().ElectronicSignatureServiceVersion() === 2) {

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

        customDebug(vm.RequestId(), 'Bestinver.Signed');

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
        Self.hideRubricaeSubtitle();

        customDebug(vm.RequestId(), 'Rubricae.Signed');
        $('#success-signature').toggleClass('hidden');

        setTimeout(function () {
            $('#signature-document-content').unblock({ message: null });
            Self.SignatureApplicant();
            $(window).scrollTop(0);
        }, 1000);
    }

    this.handdleRubricaeOtpExpired = function (eventCode, description) {
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



    this.isActiveCompany = ko.computed(function () {
        var isActive = Self.CurrentKnowledgeTest() == undefined ? false : Self.CurrentKnowledgeTest().fatcaCrsQuestion().isActiveAnswer();
        return isActive;
    }, this);

    this.isFinantialCompany = ko.computed(function () {
        var isFinantial = Self.MainApplicant().KnowledgeTest() == undefined ? false : Self.MainApplicant().KnowledgeTest().fatcaCrsQuestion().isFinantialAnswer();
        return isFinantial;
    }, this);

    this.UpdateStepsByFinantialQuestion = function () {
        var isFinantial = Self.MainApplicant().KnowledgeTest() == undefined ? false : Self.MainApplicant().KnowledgeTest().fatcaCrsQuestion().isFinantialAnswer();

        if (Self.CurrentStep.indexOf('TestData') == 0) {
            if (isFinantial) {
                //Eliminar tests de conveniencia
                Self.listaOtherApplicants().forEach(function (a) {
                    a.ConvenienceTestList().forEach(function (test) {
                        test.SkipTest(true);
                    });
                });

                var stepsToRemove = [];
                for (var i = 0; i < Self.StepsOrder.length; i++) {
                    var step = Self.StepsOrder[i];
                    if (step.indexOf('TestData') == 0) {
                        var substep = step.split('-')[0];
                        var testType = substep.substr(substep.length - 1);

                        if (Number(testType) > 1) {
                            stepsToRemove.push(i);
                        }
                    }
                }
                if (stepsToRemove.length > 0) {
                    Self.StepsOrder.splice(stepsToRemove[0], stepsToRemove.length);
                }

            }
            else {
                //añadir test de conveniencia
                var knowledgesteps = Self.StepsOrder.filter(function (step) {
                    return step.indexOf('TestData1') == 0
                });

                var lastknowledgeelement = knowledgesteps[knowledgesteps.length - 1];
                var index = Self.StepsOrder.indexOf(lastknowledgeelement) + 1;

                Self.listaOtherApplicants().forEach(function (a) {
                    var testType = 2;
                    a.ConvenienceTestList().forEach(function (test) {
                        test.SkipTest(false);
                        var indexToAdd = Self.StepsOrder.indexOf('TestData' + testType + "-" + a.ApplicantBasicData().DNI() + a.ApplicantBasicData().RequestApplicantType());
                        if (indexToAdd < 0) {
                            Self.StepsOrder.splice(index, 0, "TestData" + testType + "-" + a.ApplicantBasicData().DNI() + a.ApplicantBasicData().RequestApplicantType());
                            index++;
                            testType++;
                        }
                    });
                    var testType = 2;
                });
            }
        }
    }

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

var SelectProductViewModel = function (ProductTypes) {
    var Self = this;
    this.ProductModel = ko.observable(new ProductData(ProductTypes));
    this.ErrorMessage = ko.observable();

    this.Init = function (ProductTypePredef) {
        if (ProductTypePredef != undefined)
            $("#product-type" + ProductTypePredef).click();
    };

    this.GoToPersonalDataView = function () {
        if (Self.ProductModel().Product() == null) {
            Self.ErrorMessage('Debe seleccionar un producto');
        } else {
            var button = $('#btn-select-product');
            button.toggleClass('loading');
            $('#select-product-content').block({ message: null });
            Self.ErrorMessage('');
            sessionStorage.setItem('currentproduct', Self.ProductModel().Product());
            var url = routeConfig.GA_Register_JuridicPersons_PersonalData + "/" + btoa("ProductId=" + Self.ProductModel().Product());
            location.href = url;
        }
    };
};

var RecoverySignatureViewModel = function () {
    var Self = this;
    this.CurrentEditApplicant = ko.observable(new Applicant());
    this.PdfDocumentData = ko.observable(new PdfDocumentData());
    this.DocumentsDataView = ko.observable(new DocumentsData());
    this.Product = ko.observable(new Product());
    this.ErrorMessage = ko.observable();
    this.SignatureData = ko.observable(new SignatureData());
    this.IsRubricaeEventsAttached = ko.observable(false);
    this.Signed = ko.observable(false);

    this.Init = function (RequestId, docs, productType) {
        Self.PdfDocumentData(docs);
        Self.InitSignApplicantDocument();
        Self.DocumentsDataView().Dni(Self.PdfDocumentData().Dni());
        Self.DocumentsDataView().RequestId(RequestId);
        Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType(Self.PdfDocumentData().RequestApplicantType());
        Self.Product().ProductTypeId(productType);
        if (Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == 4 || Self.CurrentEditApplicant().ApplicantBasicData().RequestApplicantType() == 3) {
            $('#signature-sms').css('display', 'block');
        }
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
        }
        else if (Self.PdfDocumentData().ElectronicSignatureServiceVersion() === 2) {
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

        $('#success-signature').toggleClass('hidden');

        setTimeout(function () {
            $('#signature-document-content-head').toggleClass('complete');
            $('#signature-document-content').toggleClass('hidden');
            $('#success-content').toggleClass('hidden');
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

        customDebug('Event Code ' + eventCode, 'Rubricae.onOtpOK');
        $('#success-signature').toggleClass('hidden');
        setTimeout(function () {
            $('#signature-document-content-head').toggleClass('complete');
            $('#signature-document-content').toggleClass('hidden');
            $('#success-content').toggleClass('hidden');
        }, 1000);
    }

    this.handdleRubricaeOtpExpired = function (eventCode, description) {
        customDebug('Event Code ' + eventCode, 'Rubricae.Error');

        Self.showErrorSignApplicantDocument('Se ha superado el número máximo de intentos erróneos.');

        $('#contact-signature').toggleClass('hidden');
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

    this.SetGDPRApplicants = function (dni, gdpr1, gdpr2, gdpr3) {
        var data = {
            "DNI": dni,
            "GDPR1": gdpr1,
            "GDPR2": gdpr2,
            "GDPR3": gdpr3
        };

        Request.SetGDPR(data);
    };

    this.SuccessTextOperation = ko.computed(function () {

        var textoperationlist = [];
        var existstransfer = false;

        if (Self.PdfDocumentData().ProductOperationModel().Operations == undefined) return;

        ko.utils.arrayForEach(Self.PdfDocumentData().ProductOperationModel().Operations, function (op) {
            var product = new Product();
            product.Name(Self.PdfDocumentData().ProductOperationModel().ProductName);
            product.Iban(op.IBAN || "");
            product.ProductTypeId(Self.PdfDocumentData().ProductOperationModel().ProductType);
            var operation = new OperationData(product);
            operation.IdWayToPay(op.IdWayToPay);
            operation.IdOperationType(op.IdOperationType + "");
            operation.Amount(op.Amount);

            if (op.IdOperationType == '3') {
                if (!existstransfer) {
                    existstransfer = true;
                    var txt = Utils.GetOperationText(product, operation, true);
                    if (txt != '') {
                        textoperationlist.push(new Valor(1, txt));
                    }
                }
            } else {
                var txt = Utils.GetOperationText(product, operation, true);
                if (txt != '') {
                    textoperationlist.push(new Valor(1, txt));
                }
            }
        });

        return textoperationlist;

    }, this);
};