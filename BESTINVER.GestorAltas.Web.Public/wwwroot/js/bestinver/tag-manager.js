var daysOfWeek = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo"
];

var array_datalayer = {
    event: "",
    tipoProducto: "",
    producto: "",
    tipoOperacion: "",
    importeOperacion: "",
    datosTraspaso: "",
    tipoUsuario: "",
    nacionalidadPais: "",
    paisNacimiento: "",
    nacionalidad: "",
    residente: "",
    nacimiento: "",
    codigoPostal: "",
    sexo: "",
    direccion: "",
    tipoDireccion: "",
    pais: "",
    provincia: "",
    ciudad: "",
    perfiles: "",
    tipoFirma: "",
    enviarFirmaManual: "",
    opcionesEnvio: "",
    idLeadCorto: "",
    pagename: "",
    modoWeb: "",
    idioma: "",
    hora: "",
    dia: "",
    tipoDiaSemana: "",
    fechaPublicacion: "",
    paginaNoEncontrada: "",
    tipoPagina: "",
    contenido1: "",
    contenido2: "",
    contenido3: "",
    contenido4: "",
    contenido5: "",
    contenido6: "",
    articuloTags: "",
    situacionLaboral: "",
    terminoBusqueda: "",
    eventCategory: "",
    eventAction: "",
    eventLabel: "",
    canal: "",
    appInfo: "",
};

sessionStorage.setItem('array_datalayer', JSON.stringify(array_datalayer));

var PageEnum = {
    EMPIEZA_A_INVERTIR: 'P0.empieza a invertir',
    EMPIEZA_A_INVERTIR_SELECCION: 'P1.seleccion/P1.1.seleccion',
    EMPIEZA_A_INVERTIR_PRODUCTO_SELECCIONADO: 'P1.seleccion/P1.2.producto seleccionado',
    DATOS_BASICOS_TITULAR: 'P2.datos personales/P2.1.datos basicos titular',
    DATOS_PERSONALES_TITULAR: 'P2.datos personales/P2.2.datos personales titular',
    DIRECCION_CONTACTO_TITULAR: 'P2.datos personales/P2.3.direccion contacto titular',
    COTITULARES: 'P2.datos personales/P2.4.cotitulares',
    COHEREDEROS: 'P2.datos personales/P2.4.1.cotitulares',
    USUFRUCTUARIOS: 'P2.datos personales/P2.4.2.usufructuarios',
    AUTORIZADOS: 'P2.datos personales/P2.5.autorizados',
    BENEFICIARIOS: 'P2.datos personales/P2.6.beneficiarios',
    TUTORES: 'P2.datos personales/P2.7.tutores',
    TIPO_OPERACION: 'P3.configurar inversion/P3.1.tipo operacion',
    APORTACION: 'P3.configurar inversion/P3.1.1.aportacion',
    SUSCRIPCION: 'P3.configurar inversion/P3.1.2.suscripcion',
    TRASPASO: 'P3.configurar inversion/P3.1.3.traspaso',
    RECIBO: 'P3.configurar inversion/P3.1.4.recibo',
    NUMERO_IBAN_REEMBOLSO: 'P3.configurar inversion/P3.1.5.número de IBAN reembolso',
    CONOCIMIENTO: 'P4.test cliente/P4.1.conocimiento',
    CONVENIENCIA: 'P4.test cliente/P4.2.conveniencia',
    SELECCION_FIRMA: 'P5.firma envio documentacion/P5.1.seleccion firma',
    FIRMA_ELECTRONICA: 'P5.firma envio documentacion/P5.1.seleccion firma/P5.1.1.firma electronica',
    FIRMA_MANUAL: 'P5.firma envio documentacion/P5.1.seleccion firma/P5.1.2.firma manual',
    FIRMA_DOCUMENTOS: 'P5.firma envio documentacion/P5.2.firma documentos',
    FIRMA_DOCUMENTOS_PIN: 'P5.firma envio documentacion/P5.2.firma documentos/P5.2.1.validacion pin firma',
    ENVIO_DOCUMENTACION: 'P5.firma envio documentacion/P5.3.envio documentos',
    ESCANEAR: 'P5.firma envio documentacion/P5.3.envio documentos/P5.3.1.escanear',
    OTRAS_OPCIONES: 'P5.firma envio documentacion/P5.3.envio documentos/P5.3.2.otras opciones',
    FINALIZAR: 'P6.finalizacion correcta',
    ERROR: 'P7.error proceso'
};

var MobileData = null;

var GoogleTagManager = function (_producttype, _product) {
    var self = this;
    this.ProductType = _producttype;
    this.Product = _product;
    this.txt = _producttype + ":" + _product;
    this.Asynchronous = false;

    this.getDeviceChannel = function (mobileAppData) {
        var isBstapp = this.getIsMobileAppVersion(mobileAppData)
        return isBstapp ? 'app' : ''
    }

    this.getAppInfoData = function (mobileAppData) {
        var isBstapp = this.getIsMobileAppVersion(mobileAppData)
        return isBstapp ?
            mobileAppData.AppVersion + ';' + mobileAppData.OperativeSystem + ';' + mobileAppData.Manufacturer + ';' + mobileAppData.OperativeSystemVersion : ''
    }

    this.getIsMobileAppVersion = function (mobileAppData) {
        return mobileAppData.AppVersion ? mobileAppData.AppVersion.includes('bstapp') : false
    }

    this.GetDataLayerArrayByPageName = function (pagename) {
        this.MobileData = Utils.GetMobileAppData();

        var array = {
            event: "pageview",
            tipoProducto: self.ProductType,
            producto: self.Product,
            tipoOperacion: "",
            importeOperacion: "",
            datosTraspaso: "",
            tipoUsuario: "",
            nacionalidadPais: "",
            paisNacimiento: "",
            nacionalidad: "",
            residente: "",
            nacimiento: "",
            codigoPostal: "",
            sexo: "",
            direccion: "",
            tipoDireccion: "",
            pais: "",
            provincia: "",
            ciudad: "",
            perfiles: "",
            tipoFirma: "",
            enviarFirmaManual: "",
            opcionesEnvio: "",
            idLeadCorto: self.Asynchronous === true ? window.getDatalayerItem('idLeadCorto') : "",
            pagename: "formulario alta/" + this.txt + "/" + pagename + (self.Asynchronous === true ? "/recuperacion de firma" : ""),
            modoWeb: sessionStorage.getItem('device'),
            idioma: 'es',
            hora: moment().format('HH:mm:ss'),
            dia: daysOfWeek[moment().day() - 1],
            tipoDiaSemana: moment().day() < 6 ? "week" : "weekend",
            fechaPublicacion: "",
            paginaNoEncontrada: "",
            tipoPagina: "contratacion",
            contenido1: "area publica",
            contenido2: "contratacion",
            contenido3: pagename.split("/")[0],
            contenido4: pagename.split("/").length > 1 ? pagename.split("/")[1] : "",
            contenido5: pagename.split("/").length > 2 ? pagename.split("/")[2] : "",
            contenido6: "",
            articuloTags: "",
            situacionLaboral: "",
            terminoBusqueda: "",
            eventCategory: "",
            eventAction: "",
            eventLabel: "",
            canal: this.getDeviceChannel(this.MobileData),
            appInfo: this.getAppInfoData(this.MobileData),
        };

        switch (pagename) {
            case PageEnum.DATOS_BASICOS_TITULAR:
                break;

            case PageEnum.DATOS_PERSONALES_TITULAR:
                array["idLeadCorto"] = sessionStorage.getItem('requestid');
                break;

            case PageEnum.DIRECCION_CONTACTO_TITULAR:
                array["tipoUsuario"] = 'titular';
                array["nacionalidadPais"] = window.getDatalayerItem('country').substring(0, 2).toLowerCase()
                    + "-" + window.getDatalayerItem('nationality').substring(0, 2).toLowerCase()
                    + "-" + window.getDatalayerItem('residente');
                array["nacimiento"] = window.getDatalayerItem('nacimiento');
                array["sexo"] = window.getDatalayerItem('sexo');
                array["paisNacimiento"] = window.getDatalayerItem('country').substring(0, 2).toLowerCase();
                array["residente"] = window.getDatalayerItem('residente');
                array["nacionalidad"] = window.getDatalayerItem('nationality').substring(0, 2).toLowerCase();
                break;

            case PageEnum.COTITULARES:
            case PageEnum.BENEFICIARIOS:
                array["tipoUsuario"] = 'titular';
                array["nacionalidadPais"] = window.getDatalayerItem('country').substring(0, 2).toLowerCase()
                    + '-' + window.getDatalayerItem('nationality').substring(0, 2).toLowerCase()
                    + '-' + window.getDatalayerItem('residente');
                array["nacimiento"] = window.getDatalayerItem('nacimiento');
                array["sexo"] = window.getDatalayerItem('sexo');
                array["codigoPostal"] = window.getDatalayerItem('codigoPostal');
                array["direccion"] = 'postal:' + window.getDatalayerItem('country').toLowerCase()
                    + ':' + window.getDatalayerItem('province').toLowerCase()
                    + ':' + window.getDatalayerItem('city').toLowerCase();
                array["tipoDireccion"] = 'postal';
                array["pais"] = window.getDatalayerItem('country').toLowerCase();
                array["provincia"] = window.getDatalayerItem('province') != undefined ? window.getDatalayerItem('province').toLowerCase() : "";
                array["ciudad"] = window.getDatalayerItem('city').toLowerCase();
                array["paisNacimiento"] = window.getDatalayerItem('country').substring(0, 2).toLowerCase();
                array["nacionalidad"] = window.getDatalayerItem('nationality').substring(0, 2).toLowerCase();
                array["residente"] = window.getDatalayerItem('residente');
                break;

            case PageEnum.CONOCIMIENTO:
                array["tipoOperacion"] = window.getDatalayerItem('tipoOperacion');
                array["importeOperacion"] = window.getDatalayerItem('importeOperacion');
                array["datosTraspaso"] = window.getDatalayerItem('tipoOperacion') == OperationTypeEnum.properties[3].name ?
                    window.getDatalayerItem('fundtype')
                    + ':' + window.getDatalayerItem('transfertype')
                    + ':' + window.getDatalayerItem('fundname')
                    + ':' + window.getDatalayerItem('participantaccount') : '';
                array["perfiles"] = window.getDatalayerItem('perfiles');
                break;

            case PageEnum.FIRMA_ELECTRONICA:
            case PageEnum.FIRMA_MANUAL:
                array["tipoOperacion"] = window.getDatalayerItem('tipoOperacion');
                array["importeOperacion"] = window.getDatalayerItem('importeOperacion');
                array["situacionLaboral"] = window.getDatalayerItem('situacionLaboral').toLowerCase();
                array["tipoFirma"] = window.getDatalayerItem('tipoFirma');
                array["perfiles"] = window.getDatalayerItem('perfiles');
                break;

            case PageEnum.CONVENIENCIA:
            case PageEnum.SELECCION_FIRMA:
            case PageEnum.FIRMA_DOCUMENTOS_PIN:
            case PageEnum.ENVIO_DOCUMENTACION:
            case PageEnum.ESCANEAR:
            case PageEnum.OTRAS_OPCIONES:
                array["tipoOperacion"] = window.getDatalayerItem('tipoOperacion');
                array["importeOperacion"] = window.getDatalayerItem('importeOperacion');
                array["situacionLaboral"] = window.getDatalayerItem('situacionLaboral').toLowerCase();
                array["perfiles"] = window.getDatalayerItem('perfiles');
                break;

            case PageEnum.FIRMA_DOCUMENTOS:
                array["tipoOperacion"] = window.getDatalayerItem('tipoOperacion');
                array["importeOperacion"] = window.getDatalayerItem('importeOperacion');
                array["situacionLaboral"] = window.getDatalayerItem('situacionLaboral').toLowerCase();
                array["perfiles"] = window.getDatalayerItem('perfiles');
                break;

            case PageEnum.FINALIZAR:
                array["tipoOperacion"] = window.getDatalayerItem('tipoOperacion');
                array["importeOperacion"] = window.getDatalayerItem('importeOperacion');
                array["perfiles"] = window.getDatalayerItem('perfiles');
                array["enviarFirmaManual"] = window.getDatalayerItem('enviarFirmaManual');
                array["opcionesEnvio"] = window.getDatalayerItem('opcionesEnvio');
                array["situacionLaboral"] = window.getDatalayerItem('situacionLaboral').toLowerCase();
                break;
        }

        if (self.Asynchronous === true) {
            if (array["contenido4"] === "") {
                array["contenido4"] = "recuperacion de firma";
            } else {
                if (array["contenido5"] === "") {
                    array["contenido5"] = "recuperacion de firma";
                } else {
                    if (array["contenido6"] === "") {
                        array["contenido6"] = "recuperacion de firma";
                    }
                }
            }
        }

        return array;
    };

    this.GetDataLayerArrayByPageNameApplicant = function (pagename, applicant) {
        this.MobileData = Utils.GetMobileAppData();

        var array = {
            event: "pageview",
            tipoProducto: self.ProductType,
            producto: self.Product,
            tipoOperacion: "",
            importeOperacion: "",
            datosTraspaso: "",
            tipoUsuario: "",
            nacionalidadPais: "",
            paisNacimiento: "",
            nacionalidad: "",
            residente: window.getDatalayerItem('residente'),
            nacimiento: "",
            codigoPostal: "",
            sexo: "",
            direccion: "",
            tipoDireccion: "postal",
            pais: "",
            provincia: "",
            ciudad: "",
            perfiles: "",
            tipoFirma: "",
            enviarFirmaManual: "",
            opcionesEnvio: "",
            idLeadCorto: "", //sessionStorage.getItem('requestid'),
            pagename: "formulario alta/" + this.txt + "/" + pagename,
            modoWeb: sessionStorage.getItem('device'),
            idioma: "es",
            hora: moment().format('HH:mm:ss'),
            dia: daysOfWeek[moment().day() - 1],
            tipoDiaSemana: moment().day() < 6 ? "week" : "weekend",
            fechaPublicacion: "",
            paginaNoEncontrada: "",
            tipoPagina: "contratacion",
            contenido1: "area publica",
            contenido2: "contratacion",
            contenido3: pagename.split("/")[0],
            contenido4: pagename.split("/")[1],
            contenido5: "",
            contenido6: "",
            articuloTags: "",
            situacionLaboral: "",
            terminoBusqueda: "",
            eventCategory: "",
            eventAction: "",
            eventLabel: "",
            canal: self.getDeviceChannel(this.MobileData),
            appInfo: self.getAppInfoData(this.MobileData),
        };

        array["tipoUsuario"] = applicant["tipoUsuario"];
        array["nacionalidadPais"] = applicant["nacionalidadPais"];
        array["nacimiento"] = applicant["nacimiento"];
        array["codigoPostal"] = applicant["codigoPostal"];
        array["sexo"] = applicant["sexo"];
        array["direccion"] = applicant["direccion"];
        array["tipoFirma"] = applicant["tipoFirma"];

        array["paisNacimiento"] = applicant["paisNacimiento"];
        array["nacionalidad"] = applicant["nacionalidad"];
        array["pais"] = applicant["pais"];
        array["provincia"] = applicant["provincia"];
        array["ciudad"] = applicant["ciudad"];


        if (pagename == PageEnum.TIPO_OPERACION) {
            array["perfiles"] = window.getDatalayerItem('perfiles');
        }

        return array;
    };

    this.GetDataLayerArrayByOperationType = function (operationtype, producttype, product) {
        this.MobileData = Utils.GetMobileAppData();

        var pagename;
        switch (OperationTypeEnum.properties[operationtype].value) {
            case 1:
                pagename = PageEnum.SUSCRIPCION;
                break;
            case 2:
                pagename = PageEnum.APORTACION;
                break;
            case 3:
                pagename = PageEnum.TRASPASO;
                break;
            case 4:
                pagename = PageEnum.RECIBO;
                break;
        }

        var txtoperation = producttype + ":" + product;

        var array = {
            event: "pageview",
            tipoProducto: self.ProductType,
            producto: self.Product,
            tipoOperacion: window.getDatalayerItem('tipoOperacion'),
            importeOperacion: "",
            datosTraspaso: "",
            tipoUsuario: "",
            nacionalidadPais: "",
            paisNacimiento: "",
            nacionalidad: "",
            residente: "",
            nacimiento: "",
            codigoPostal: "",
            sexo: "",
            direccion: "",
            tipoDireccion: "",
            pais: "",
            provincia: "",
            ciudad: "",
            perfiles: window.getDatalayerItem('perfiles'),
            tipoFirma: "",
            enviarFirmaManual: "",
            opcionesEnvio: "",
            idLeadCorto: "", //sessionStorage.getItem('requestid'),
            pagename: "formulario alta/" + txtoperation + "/" + pagename,
            modoWeb: sessionStorage.getItem('device'),
            idioma: "es",
            hora: moment().format('HH:mm:ss'),
            dia: daysOfWeek[moment().day() - 1],
            tipoDiaSemana: moment().day() < 6 ? "week" : "weekend",
            fechaPublicacion: "",
            paginaNoEncontrada: "",
            tipoPagina: "contratacion",
            contenido1: "area publica",
            contenido2: "contratacion",
            contenido3: pagename.split("/")[0],
            contenido4: "p3.1.tipo operacion",
            contenido5: pagename.split("/")[1],
            contenido6: "",
            articuloTags: "",
            situacionLaboral: "",
            terminoBusqueda: "",
            eventCategory: "",
            eventAction: "",
            eventLabel: "",
            canal: self.getDeviceChannel(this.MobileData),
            appInfo: self.getAppInfoData(this.MobileData),
        };

        return array;
    };

    this.Push = function (pagename) {
        try {
            var arr = this.GetDataLayerArrayByPageName(pagename);
            window.DigitalData.push(arr);
        } catch (e) {
            console.log(e);
        }
    };

    this.PushPersistedDigitalData = function () {
        try {
            var persistedDigitalData = JSON.parse(sessionStorage.getItem('gmtDigitalDataPersisted'));
            window.DigitalData.push(persistedDigitalData[0])
            setTimeout(() => {
                persistedDigitalData.shift();
                persistedDigitalData.forEach(element => window.DigitalData.push(element));
                this.Push(PageEnum.DATOS_BASICOS_TITULAR);
                sessionStorage.setItem("PageEnum", PageEnum.DATOS_BASICOS_TITULAR);
            }, 1500);
        } catch (e) {
            console.log(e);
        }
    };

    this.PushByApplicant = function (pagename, applicant) {
        try {
            var arr = this.GetDataLayerArrayByPageNameApplicant(pagename, applicant);
            window.DigitalData.push(arr);
        } catch (e) {
            console.log(e);
        }
    };

    this.PushByOperationType = function (operationtype, producttype, product) {
        try {
            var arr = this.GetDataLayerArrayByOperationType(operationtype, producttype, product);
            window.DigitalData.push(arr);
        } catch (e) {
            console.log(e);
        }
    };

    this.PushByProductType = function (pagename, producttype) {
        this.MobileData = Utils.GetMobileAppData();
        var producttypename = ProductTypeEnum.properties[producttype].name;
        var dData = {
            event: "pageview",
            tipoProducto: producttypename,
            producto: "",
            tipoOperacion: "",
            importeOperacion: "",
            datosTraspaso: "",
            tipoUsuario: "",
            nacionalidadPais: "",
            paisNacimiento: "",
            nacionalidad: "",
            residente: "",
            nacimiento: "",
            codigoPostal: "",
            sexo: "",
            direccion: "",
            pais: "",
            provincia: "",
            ciudad: "",
            perfiles: "",
            tipoFirma: "",
            enviarFirmaManual: "",
            opcionesEnvio: "",
            idLeadCorto: "",
            pagename: "formulario alta/" + producttypename + "/" + pagename,
            modoWeb: sessionStorage.getItem('device'),
            idioma: "es",
            hora: moment().format('HH:mm:ss'),
            dia: daysOfWeek[moment().day() - 1],
            tipoDiaSemana: moment().day() < 6 ? "week" : "weekend",
            fechaPublicacion: "",
            paginaNoEncontrada: "",
            tipoPagina: "contratacion",
            contenido1: "area publica",
            contenido2: "contratacion",
            contenido3: pagename.split("/")[0],
            contenido4: pagename.split("/").length > 1 ? pagename.split("/")[1] : "",
            contenido5: "",
            contenido6: "",
            articuloTags: "",
            situacionLaboral: "",
            terminoBusqueda: "",
            eventCategory: "",
            eventAction: "",
            eventLabel: "",
            canal: self.getDeviceChannel(this.MobileData),
            appInfo: self.getAppInfoData(this.MobileData),
        };
        try {
            window.DigitalData.push(dData);
            window.DigitalDataPersisted.push(dData);
        } catch (e) {
            console.log(e);
        }
    };

    this.PushEventNoPageName = function (eventCategory, eventAction) {
        var AsynchronousText = "";
        if (self.Asynchronous === true)
            AsynchronousText = "/recuperacion de firma";

        var pagename = sessionStorage.getItem("PageEnum");
        window.DigitalData.push({
            "event": "event",
            "eventCategory": eventCategory,
            "eventAction": eventAction,
            "eventLabel": this.Product != undefined ? "formulario alta/" + this.txt + "/" + pagename + AsynchronousText : "formulario alta/" + pagename + AsynchronousText
        });
    };

    this.PushEvent = function (pagename, eventCategory, eventAction, eventLabel) {
        var AsynchronousText = "";
        if (self.Asynchronous === true)
            AsynchronousText = "/recuperacion de firma";
        window.DigitalData.push({
            "event": "event",
            "eventCategory": eventCategory,
            "eventAction": eventAction,
            "eventLabel": eventLabel == undefined ? "formulario alta/" + this.txt + "/" + pagename + AsynchronousText : eventLabel + AsynchronousText
        });
    };

    this.PushEventContinuar = function () {
        var pagename = sessionStorage.getItem("PageEnum");
        var dData = {
            "event": "event",
            "eventCategory": "continuar",
            "eventAction": pagename,
            "eventLabel": ""
        };

        window.DigitalData.push(dData);
        window.DigitalDataPersisted.push(dData);
    };

    this.PushEventText = function (text, eventCategory, eventAction) {
        var AsynchronousText = "";
        if (self.Asynchronous === true)
            AsynchronousText = "/recuperacion de firma";
        window.DigitalData.push({
            "event": "event",
            "eventCategory": eventCategory,
            "eventAction": eventAction,
            "eventLabel": text + AsynchronousText
        });
    };

    this.PushEventErrorArray = function (pagename, eventCategory, errors) {
        var AsynchronousText = "";
        if (self.Asynchronous === true)
            AsynchronousText = "/recuperacion de firma";
        errors.forEach(function (e) {
            window.DigitalData.push({
                "event": "event",
                "eventCategory": eventCategory,
                "eventAction": e,
                "eventLabel": "formulario alta/" + self.txt + "/" + pagename + AsynchronousText
            });
        });
    };
};