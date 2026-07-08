var MasterDataModel = function (ApplicantTypeId, ProductId, ProductTypeId) {
    var self = this;

    this.NationalityList = ko.observableArray();
    this.GenderList = ko.observableArray();
    this.ViaTypeList = ko.observableArray();
    this.CountryList = ko.observableArray();
    this.ForeignCountryList = ko.observableArray();
    this.OperationTypeList = ko.observableArray();
    this.TransferTypeListFondo = ko.observableArray([{ id: 1, valor: 'Traspaso total' }, { id: 2, valor: 'Traspaso por un importe' }, { id: 3, valor: 'Traspaso por un número de participaciones' }]);
    this.TransferTypeListPlan = ko.observableArray([{ id: 1, valor: 'Traspaso total' }, { id: 2, valor: 'Traspaso por un importe' }, { id: 3, valor: 'Traspaso por un número de participaciones' }, { id: 4, valor: 'Traspaso por porcentaje de participaciones' }]);
    this.SignatureTypeList = ko.observableArray();
    this.SendingWayList = ko.observableArray();
    this.ReceivingWayList = ko.observableArray();
    this.DocumentSendingWayList = ko.observableArray();
    this.ProductList = ko.observableArray();
    this.ProductTypeList = ko.observableArray();
    this.ProvinceList = ko.observableArray();
    this.MonthsList = ko.observableArray([{ id: 1, valor: 'Enero' }, { id: 2, valor: 'Febrero' }, { id: 3, valor: 'Marzo' }, { id: 4, valor: 'Abril' }, { id: 5, valor: 'Mayo' }, { id: 6, valor: 'Junio' }, { id: 7, valor: 'Julio' }, { id: 8, valor: 'Agosto' }, { id: 9, valor: 'Septiembre' }, { id: 10, valor: 'Octubre' }, { id: 11, valor: 'Noviembre' }, { id: 12, valor: 'Diciembre' }]);
    this.PeriodicityList = ko.observableArray([{ id: 1, valor: 'Mensual' }, { id: 2, valor: 'Trimestral' }, { id: 3, valor: 'Semestral' }, { id: 4, valor: 'Anual' }]);
    this.MonthsRangeList = ko.observableArray();
    this.ApplicantDocumentTypes = ko.observableArray([{ id: 'DNI', valor: 'DNI' }/*, { id: 'PAS', valor: 'Pasaporte' }*/]);
    this.QuestionCollection = ko.observableArray();
    this.ConvenienceQuestionNonComplexCollection = ko.observableArray();
    this.ConvenienceQuestionComplexCollection = ko.observableArray();

    this.ConvenienceQuestions = ko.observableArray();

    this.getQuestionCollection = function () {
        var promise = new Promise(function (resolve, reject) {
            $.getJSON(apiConfig.API_Master_GetQuestions, function (data) {
                var obj = jQuery.parseJSON(JSON.stringify(data));
                $.each(obj, function (i, item) {
                    var dtjson = obj[i].Answers;
                    var answers = [];
                    if (dtjson != null) {
                        $.each(dtjson, function (j, item) {
                            answers.push(new Answer(dtjson[j].Answer, dtjson[j].IdAnswer, obj[i].IdQuestion, dtjson[j].DependentQuestion, dtjson[j].ExtendedAnswer, dtjson[j].NotMultiAnswer, dtjson[j].Type));
                        });
                    }

                    var question = new Question(obj[i].IdQuestion, obj[i].Question, obj[i].QuestionLabel, obj[i].QuestionOrder, obj[i].TestType, obj[i].AllowMultipleAnswers, obj[i].AllowNoAnswer, obj[i].QuestionGroup, 1, 1, answers, obj[i].ErrorMessage, obj[i].ToolTip);

                    self.QuestionCollection.push(question);
                });
                resolve(true);
            }).fail(function () {
                resolve(false);
            });
        });
        return promise;
    };

    this.setProvinces = function (provinces) {
        self.ProvinceList.pushAll($.map(provinces, function (item) {
            return new Valor(Utils.Paddy(item.id.toString(), 2, "0"), item.valor);
        }));
    };

    this.getProvinceByName = function (name) {
        var provinces =
            $.grep(self.ProvinceList(), function (e) {
                return e.valor.toUpperCase() == name.toUpperCase();
            });
        return provinces[0];
    };

    this.setNationality = function (nationalities) {
        self.NationalityList.pushAll($.map(nationalities, function (item) {
            return new Valor(item.id, item.valor);
        }));
    };

    this.setGender = function (genders) {
        self.GenderList.pushAll($.map(genders, function (item) {
            return new Valor(item.id, item.valor);
        }));
    };

    this.setViaType = function (viaTypes) {
        self.ViaTypeList.pushAll($.map(viaTypes, function (item) {
            return new Valor(item.id, item.valor);
        }));
    };

    this.setCountry = function (countries) {
        self.CountryList.pushAll($.map(countries, function (item) {
            return new Valor(item.id, item.valor);
        }));

        var foreigncountries = self.CountryList().filter(function (elem) {
            if (elem.id != 1) {
                return new Valor(elem.id, elem.valor);
            }
        })

        self.ForeignCountryList(foreigncountries);
    };

    this.setSignatureType = function (signatureTypes) {
        self.SignatureTypeList.pushAll($.map(signatureTypes, function (item) {
            var desc = item.id == DocumentSignatureTypeEnum.DIGITAL ?
                "Completa ahora tu solicitud realizando la firma de todos los documentos de forma rápida y sencilla con tu teléfono móvil"
                : "Completa tu solicitud firmando de forma manuscrita los documentos";
            return new Valor(item.id, item.valor, desc);
        }));
    };

    this.setSendingWay = function (sendingways) {
        self.SendingWayList.pushAll($.map(sendingways, function (item) {
            return new Valor(item.id, item.valor);
        }));
    };

    this.setReceivingWay = function (receivingways) {
        self.ReceivingWayList.pushAll($.map(receivingways, function (item) {
            return new Valor(item.id, item.valor);
        }));
    };

    this.setDocumentSendingWay = function (sendingways) {
        self.DocumentSendingWayList.pushAll($.map(sendingways, function (item) {
            return new Valor(item.id, item.valor);
        }));
    };

    this.getOperationType = function () {
        var promise = new Promise(function (resolve, reject) {
            $.getJSON(apiConfig.API_Master_GetOperationByProductAndApplicantType, { productType: ProductTypeId, applicantType: ApplicantTypeId }, function (data) {
                var obj = jQuery.parseJSON(JSON.stringify(data));
                self.OperationTypeList.pushAll($.map(obj, function (item) {
                    var desc = '';
                    var tooltip = '';
                    var svgfile = '';
                    if (item.id == OperationTypeEnum.SUSCRIPCION) {
                        desc = "Realiza tu primera suscripción al Fondo a través de una transferencia.";
                        tooltip = "Para hacer tu primera suscripción solo necesitamos conocer el importe de tu inversión. A final del proceso te indicaremos el número de cuenta al que tendrás que hacer la transferencia por ese importe.";
                        svgfile = SvgFileEnum.SUBSCRIPTION;
                    }
                    if (item.id == OperationTypeEnum.APORTACION) {
                        switch (ProductTypeId) {
                            case ProductTypeEnum.PLANES:
                                desc = "Realiza tu primera aportación al Plan a través de una transferencia.";
                                break;
                            case ProductTypeEnum.EPSV:
                                desc = "Realiza tu primera aportación a la EPSV a través de una transferencia.";
                                break;
                        }
                        tooltip = "Para hacer tu primera aportación solo necesitamos conocer el importe de tu inversión. A final del proceso te indicaremos el número de cuenta al que tendrás que hacer la transferencia por ese importe.";
                        svgfile = SvgFileEnum.SUBSCRIPTION;
                    }
                    if (item.id == OperationTypeEnum.TRASPASO) {
                        switch (ProductTypeId) {
                            case ProductTypeEnum.PLANES:
                                desc = "Traspasa los Planes que tienes en otras entidades.";
                                tooltip = "Si tienes planes de pensiones en otras entidades puedes traspasarlos al plan de pensiones que has elegido. Te pediremos que nos indiques el nombre del plan que tienes en otra entidad para realizar tu traspaso."
                                break;
                            case ProductTypeEnum.FONDOS:
                            case ProductTypeEnum.INVERSIONLIBRE:
                                desc = "Traspasa tus Fondos desde otra entidad.";
                                tooltip = "Si tienes fondos en otras entidades puedes traspasarlos al fondo que has elegido. Te pediremos que nos indiques el nombre del fondo que tienes en otra entidad para realizar tu traspaso.";
                                break;
                            case ProductTypeEnum.EPSV:
                                desc = "Traspasa las EPSV que tienes en otras entidades.";
                                tooltip = "Si tienes EPSV en otras entidades puedes traspasarlos al EPSV que has elegido. Te pediremos que nos indiques el nombre de la EPSV que tienes en otra entidad para realizar tu traspaso.";
                                break;
                        }
                        svgfile = SvgFileEnum.TRANSFER;
                    }
                    return new Valor(item.id, item.valor, desc, tooltip, svgfile);
                }));
                resolve(true);
            }).fail(function () {
                resolve(false);
            });
        });
        return promise;
    };

    this.UpdateOperationTypeList = function (_ProductFamilyId, _ProductTypeId, _resident) {
        var scope = self;
        return new Promise(function (resolve, reject) {
            $.getJSON(apiConfig.API_Master_GetOperationByProductAndApplicantType, { productType: _ProductTypeId, applicantType: ApplicantTypeId }, function (data) {
                var obj = jQuery.parseJSON(JSON.stringify(data));
                scope.OperationTypeList.removeAll();

                scope.OperationTypeList.pushAll($.map(obj, function (item) {
                    var desc = '';
                    var tooltip = '';
                    var svgfile = '';
                    if (item.id == OperationTypeEnum.SUSCRIPCION) {
                        desc = "Realiza tu primera suscripción al Fondo a través de una transferencia.";
                        tooltip = "Para hacer tu primera suscripción solo necesitamos conocer el importe de tu inversión. A final del proceso te indicaremos el número de cuenta al que tendrás que hacer la transferencia por ese importe.";
                        svgfile = SvgFileEnum.SUBSCRIPTION;
                    }
                    if (item.id == OperationTypeEnum.APORTACION) {
                        switch (_ProductTypeId) {
                            case ProductTypeEnum.PLANES:
                                desc = "Realiza tu primera aportación al Plan a través de una transferencia.";
                                break;
                            case ProductTypeEnum.EPSV:
                                desc = "Realiza tu primera aportación a la EPSV a través de una transferencia.";
                                break;
                        }
                        tooltip = "Para hacer tu primera aportación solo necesitamos conocer el importe de tu inversión. A final del proceso te indicaremos el número de cuenta al que tendrás que hacer la transferencia por ese importe.";
                        svgfile = SvgFileEnum.SUBSCRIPTION;
                    }
                    if (item.id == OperationTypeEnum.TRASPASO) {
                        switch (_ProductTypeId) {
                            case ProductTypeEnum.PLANES:
                                desc = "Traspasa los Planes que tienes en otras entidades.";
                                tooltip = "Si tienes planes de pensiones en otras entidades puedes traspasarlos al plan de pensiones que has elegido. Te pediremos que nos indiques el nombre del plan que tienes en otra entidad para realizar tu traspaso."
                                break;
                            case ProductTypeEnum.FONDOS:
                            case ProductTypeEnum.INVERSIONLIBRE:
                                desc = "Traspasa tus Fondos desde otra entidad.";
                                tooltip = "Si tienes fondos en otras entidades puedes traspasarlos al fondo que has elegido. Te pediremos que nos indiques el nombre del fondo que tienes en otra entidad para realizar tu traspaso.";
                                break;
                            case ProductTypeEnum.EPSV:
                                desc = "Traspasa las EPSV que tienes en otras entidades.";
                                tooltip = "Si tienes EPSV en otras entidades puedes traspasarlos al EPSV que has elegido. Te pediremos que nos indiques el nombre de la EPSV que tienes en otra entidad para realizar tu traspaso.";
                                break;
                        }
                        svgfile = SvgFileEnum.TRANSFER;
                    }
                    if ((_ProductTypeId == ProductTypeEnum.FONDOS || _ProductTypeId == ProductTypeEnum.INVERSIONLIBRE) && !_resident) {
                        if (item.id != OperationTypeEnum.TRASPASO) { return new Valor(item.id, item.valor, desc, tooltip, svgfile);}
                    } else {
                        if (_ProductFamilyId == 12) {
                            if (item.id != OperationTypeEnum.TRASPASO) { return new Valor(item.id, item.valor, desc, tooltip, svgfile);}
                        } else {
                            return new Valor(item.id, item.valor, desc, tooltip, svgfile);
                        }
                    }
                }));
                resolve(true);
            }).fail(function () {
                resolve(false);
            })
        })
    };

    this.setProductList = function (products) {
        var promise = new Promise(function (resolve, reject) {
            self.ProductList.pushAll($.map(products, function (item) {
                return new Product(item.Id, item.ProductTypeId, item.Name, item.Description, item.Profitability, item.ProfitabilityDateText, item.IdOperation, item.AdultMax, item.AdultMin, item.MinorMax, item.MinorMin, item.DisabledMax, item.DisabledMin, item.IBAN, item.FromAge, item.ToAge, item.ComplexProduct, item.RDCode, item.Family, item.EmployeeMax, item.EmployeeMin, item.SubFamilyProductId);
            }));
            resolve(true);
        })
        return promise;
    };

    this.setProductTypeList = function (types, excludeFIL) {
        var promise = new Promise(function (resolve, reject) {
            types.forEach(function (item) {
                var ProductsByType = (
                    $.grep(self.ProductList(), function (e) {
                        //el bestvalue y el hedge value found se quita cuando es alta pública
                        //if (!excludeFIL || (e.Id() != 8 && e.Id() != 9))
                        return e.ProductTypeId() == item.Id;
                    })
                );
                if (ProductsByType.length > 0) {
                    self.ProductTypeList.push(new ProductType(item.Id, item.Name, item.Description, ProductsByType));
                }
            });
            resolve(true);
        })
        return promise;
    };

    this.getProductById = function (id) {
        var found = self.ProductList().find(function (elem) {
            return elem.Id() == id;
        });

        return found;
    };

    this.getCountryNameById = function (id) {
        var found = self.CountryList().find(function (elem) {
            return elem.id == id;
        });

        if (found == undefined)
            return '';

        return found.valor;
    };

    this.getViaTypeNameById = function (id) {
        var found = self.ViaTypeList().find(function (elem) {
            return elem.id == id;
        });

        if (found == undefined)
            return '';

        return found.valor;
    };

    this.getQuestions = function (_ApplicantType, _RequestApplicantType, _fondo, _older) {
        var promise = new Promise(function (resolve, reject) {
            var questions = [];

            $.getJSON(apiConfig.API_Master_GetQuestionsByApplicantTypeAndRequestApplicantType, { requestApplicantType: _RequestApplicantType, applicantType: _ApplicantType }, function (data) {
                var obj = jQuery.parseJSON(JSON.stringify(data));
                $.each(obj, function (i, item) {
                    var dtjson = obj[i].Answers;
                    var answers = [];
                    if (dtjson != null) {
                        $.each(dtjson, function (j, item) {
                            answers.push(new Answer(dtjson[j].Answer, dtjson[j].IdAnswer, obj[i].IdQuestion, dtjson[j].DependentQuestion, dtjson[j].ExtendedAnswer, dtjson[j].NotMultiAnswer, dtjson[j].Type));
                        });
                    }

                    var question = new Question(obj[i].IdQuestion, obj[i].Question, obj[i].QuestionLabel, obj[i].QuestionOrder, obj[i].TestType, obj[i].AllowMultipleAnswers, obj[i].AllowNoAnswer, obj[i].QuestionGroup, _ApplicantType, _RequestApplicantType, answers);

                    if (obj[i].TestType === TestTypeEnum.CONOCIMIENTO) {
                        questions.push(question);
                    }
                    else {
                        if (_fondo) {
                            if (_older) {
                                questions.push(question);
                            }
                        }
                    }
                });
                resolve(questions);
            }).fail(function () {
                resolve(questions);
            });
        });
        return promise;
    };

    this.getQuestionsSync = function (_ApplicantType, _RequestApplicantType, _fondo, _older, callback) {

        var targetUrl = apiConfig.API_Master_GetQuestionsByApplicantTypeAndRequestApplicantType + "?requestApplicantType=" + _RequestApplicantType + "&applicantType=" + _ApplicantType;
        var questions = [];

        $.ajax({
            url: targetUrl,
            type: "GET",
            async: false,
            dataType: "json"
        }).done(function (data, textStatus, xhr) {
            var obj = jQuery.parseJSON(JSON.stringify(data));
            $.each(obj, function (i, item) {
                var dtjson = obj[i].Answers;
                var answers = [];
                if (dtjson != null) {
                    $.each(dtjson, function (j, item) {
                        answers.push(new Answer(dtjson[j].Answer, dtjson[j].IdAnswer, obj[i].IdQuestion, dtjson[j].DependentQuestion, dtjson[j].ExtendedAnswer, dtjson[j].NotMultiAnswer, dtjson[j].Type));
                    });
                }

                var question = new Question(obj[i].IdQuestion, obj[i].Question, obj[i].QuestionLabel, obj[i].QuestionOrder, obj[i].TestType, obj[i].AllowMultipleAnswers, obj[i].AllowNoAnswer, obj[i].QuestionGroup, _ApplicantType, _RequestApplicantType, answers)

                if (obj[i].TestType == TestTypeEnum.CONOCIMIENTO) {
                    questions.push(question);
                }
                else {
                    if (_fondo) {
                        if (_older) {
                            questions.push(question);
                        }
                    }
                }
            });
            callback(questions);
        }).fail(function (data, textStatus, xhr) {
            callback(questions);
        });

    };

    this.getQuestionsByProductSync = function (product, family, callback) {

        var targetUrl = apiConfig.API_Master_GetQuestionsByProduct + "?product=" + product;
        var questions = [];

        $.ajax({
            url: targetUrl,
            type: "GET",
            async: false,
            dataType: "json"
        }).done(function (data, textStatus, xhr) {

            var obj = jQuery.parseJSON(JSON.stringify(data));
            var questionlist = obj.filter(function (q) { return q.TestType == 7 });
            var numQuestions = questionlist.length;

            $.each(questionlist, function (i, item) {
                var dtjson = questionlist[i].Answers;
                var answers = [];
                if (dtjson != null) {
                    $.each(dtjson, function (j, item) {
                        answers.push(new Answer(dtjson[j].Answer, dtjson[j].IdAnswer, questionlist[i].IdQuestion, dtjson[j].DependentQuestion, dtjson[j].ExtendedAnswer, dtjson[j].NotMultiAnswer, dtjson[j].Type, dtjson[j].NoAnswer));
                    });
                }

                var question = new Question(questionlist[i].IdQuestion, questionlist[i].Question, questionlist[i].QuestionLabel, questionlist[i].QuestionOrder, 2, questionlist[i].AllowMultipleAnswers, questionlist[i].AllowNoAnswer, questionlist[i].QuestionGroup, 1, 1, answers, questionlist[i].ErrorMessage, questionlist[i].ToolTip, questionlist[i].Type, family, questionlist[i].SubFamilyProductId)
                questions.push(question);

                if (numQuestions > 4) {
                    self.addConvenienceQuestion(question, self.ConvenienceQuestionComplexCollection());
                } else {
                    self.addConvenienceQuestion(question, self.ConvenienceQuestionNonComplexCollection());
                }

                self.addConvenienceQuestion(question, self.ConvenienceQuestions());

            });
            callback(questions);
        }).fail(function (data, textStatus, xhr) {
            callback(questions);
        });
    };

    this.setMonthsRange = function () {
        var currentday = moment().date();
        var initialmonth = 0;
        var totalmonth = 0;

        if (currentday >= 24) {
            initialmonth = moment().month() + 2;
            totalmonth = 10;
        } else {
            initialmonth = moment().month() + 1;
            totalmonth = 11;
        }

        var initarray = self.MonthsList.slice(initialmonth, 12);
        var finalarray = self.MonthsList.slice(0, totalmonth - initarray.length);

        var months = initarray.concat(finalarray);

        self.MonthsRangeList(months);
    };

    this.addConvenienceQuestion = function (question, collection) {
        var exists = collection.some(function (item) {
            return item.IdQuestion() == question.IdQuestion();
        });

        if (!exists) {
            collection.push(question);
        }
    }
};

var OperationTypeEnum = {
    SUSCRIPCION: 1,
    APORTACION: 2,
    TRASPASO: 3,
    RECIBO: 4,
    HERENCIA: 5,
    DONACION: 6,
    ASESORAMIENTO: 11,

    properties:
    {
        1: { name: "Suscripción", value: 1 },
        2: { name: "Aportación", value: 2 },
        3: { name: "Traspaso", value: 3 },
        4: { name: "Recibo", value: 4 },
        5: { name: "Herencia", value: 5 },
        6: { name: "Donación", value: 6 },
        11: { name: "Asesoramiento", value: 11 }
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

var ProductEnum = {
    ASESORAMIENTO: 36,

    properties:
    {
        5: { name: "asesoramiento", value: 36 },
    }
};

var TransferTypeEnum = {
    TOTAL: 1,
    PARCIAL: 2,
    PARTICIPACIONES: 3,
    PORCENTAJE: 4,

    properties:
    {
        1: { name: "traspaso total", value: 1 },
        2: { name: "traspaso parcial importe", value: 2 },
        3: { name: "traspaso parcial participaciones", value: 3 },
        4: { name: "traspaso parcial porcentaje", value: 4 }
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

var ApplicantTypeEnum = {
    FISICA: 1,
    JURIDICA: 2,
    FISICAEXTRANJERA: 3,

    properties:
    {
        1: { name: "Persona física", value: 1 },
        2: { name: "Persona jurídica", value: 2 },
        3: { name: "Persona física extranjera", value: 3 }
    }
};

var TestTypeEnum = {
    CONOCIMIENTO: 1,
    CONVENIENCIA: 2,
    CONVENIENCIA_SECOND: 3,

    properties:
    {
        1: { name: "Test de conocimiento", value: 1 },
        2: { name: "Test de conveniencia", value: 2 },
        3: { name: "Test de conveniencia", value: 3 }
    }
};

var IdAnswerTypeEnum = {
    OTROS: 26,
    SOCIEDAD_COMUNIDAD: 83,
    FUNDACION_ONG_RELIGIOSA: 84,

    properties:
    {
        26: { name: "Respuesta Otros", value: 26 },
        83: { name: "Respuesta Sociedad o Comunidad de Bienes", value: 83 },
        84: { name: "Respuesta Fundación, ONG, Entidad Religiosa o Asociación", value: 84 }
    }
};

var DocumentSendingWayEnum = {
    ADJUNTAR: 1,
    CORREO: 2,
    MENSAJERO: 3,
    EMAIL: 4,
    FIRMA_ONLINE: 5,

    properties:
    {
        1: { name: "Adjuntar documentación", value: 1 },
        2: { name: "Correo postal", value: 2 },
        3: { name: "Solicitar mensajero", value: 3 },
        4: { name: "Email", value: 4 },
        5: { name: "Firma online", value: 5 }
    }
};

var DocumentSignatureTypeEnum = {
    DIGITAL: 1,
    MANUSCRITA: 2,

    properties:
    {
        1: { name: "Firma digital", value: 1 },
        2: { name: "Firma manuscrita", value: 2 }
    }
};

var WayToPayEnum = {
    TRANSFERENCIA: 1,
    CHEQUE: 2,

    properties:
    {
        1: { name: "Transferencia", value: 1 },
        2: { name: "cheque", value: 2 }
    }
};

var GenderEnum = {
    HOMBRE: 1,
    MUJER: 2,

    properties:
    {
        1: { name: "Hombre", value: 1 },
        2: { name: "Mujer", value: 2 }
    }
};

var EPSVPostalCodesPrefixEnum = {
    VIZCAYA: "48",
    ALAVA: "01",
    GUIPUZCOA: "20",

    properties:
    {
        48: { name: "Vizcaya", value: 48 },
        0o1: { name: "Álava", value: 0o1 },
        20: { name: "Guipúzcoa", value: 20 },
    }
};