function Utils() { };

$(document).ready(function () {
    window.bstapp = {
        requestPermission: function () { console.log('requestPermission'); },
        requestCameraPermission: function () { console.log('requestCameraPermission'); },
        requestDocumentPermission: function () { console.log('requestDocumentPermission'); },
        newUser: function () { console.log('newUser'); }
    };
});

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

Utils.generateUUID = function () {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();; //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

//TODO: Eliminar --Servicio
Utils.compareObjects = function (o1, o2) {
    for (var p in o1) {
        if (o1.hasOwnProperty(p)) {
            if (o1[p] !== o2[p]) {
                return false;
            }
        }
    }
    for (var p in o2) {
        if (o2.hasOwnProperty(p)) {
            if (o1[p] !== o2[p]) {
                return false;
            }
        }
    }
    return true;
}

Utils.parseDate = function (input) {
    //parse a date in yyyy-mm-dd format
    if (!isNaN(Date.parse(input))) {
        var parts = input.match(/(\d+)/g);

        for (var i = 0; i < parts.length; i++) {
            if (!Utils.IsDecimalValidHigherThan(parts[i], 0)) {
                return null;
            }
        }
        var d = new Date(parts[0], parts[1] - 1, parts[2]);

        return d;
    }
}

Utils.calculateAge = function (birthday) {
    var birthdayDate = Utils.parseDate(birthday);
    if (!birthdayDate) return (new Date()).getUTCFullYear() - 1970;
    var birth_day = birthdayDate.getDate();
    var birth_month = birthdayDate.getMonth();
    var birth_year = birthdayDate.getFullYear();

    var today_date = new Date();
    var today_year = today_date.getFullYear();
    var today_month = today_date.getMonth();
    var today_day = today_date.getDate();
    var age = today_year - birth_year;

    if (today_month < birth_month) {
        age--;
    }
    if ((birth_month == today_month) && (today_day < birth_day)) {
        age--;
    }
    return age;
}

Utils.dateIsValid = function (input) {
    return Utils.parseDate(input) != null;
}

Utils.maxLengthCheck = function (object) {
    if (object.value.length > object.maxLength)
        object.value = object.value.slice(0, object.maxLength)
}

Utils.maxValueCheck = function (object) {
    if (object.value > object.max)
        object.value = object.value.slice(0, object.value.length - 1);

    try { Utils.maxLengthCheck(object); } catch (err) { };
}

Utils.ChangePhoneLength = function (object) {
    var prefix = object.value;
    var inputphoneid = $('#mobile-phone-prefix').parent().find('.inputphone')[0].id;
    var inputphone = $('#' + inputphoneid);
    if (prefix == "+34") {
        inputphone.attr('maxLength', '9');
    } else {
        inputphone.attr('maxLength', '15');
    }
    Utils.maxLengthCheck(inputphone[0]);
}

Utils.isNumeric = function (evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

Utils.validateDNI = function (dni) {
    if (dni) {
        var numero, letra;
        var expresion_regular_dni = /^[XYZKLT]?\d{5,8}[A-Z]$/;

        dni = dni.toUpperCase();

        if (expresion_regular_dni.test(dni) === true) {
            numero = dni.substr(0, dni.length - 1);
            numero = numero.replace('L', 0);
            numero = numero.replace('T', 0);
            numero = numero.replace('X', 0);
            numero = numero.replace('Y', 1);
            numero = numero.replace('Z', 2);
            numero = numero.replace('K', 0);
            numero = numero % 23;
            var letr = dni.substr(dni.length - 1, 1);
            letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
            letra = letra.substring(numero, numero + 1);
            if (letra != letr) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    return false;
};

//VALIDACIÓN RESTAURADA A PETICIÓN QUE NO FUNCIONA CON CIFS ANTIGUOS
Utils.ValidateCIF = function (cif) {
    if (!cif || cif.length !== 9) {
        return false;
    }

    var letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    var digits = cif.substr(1, cif.length - 2);
    var letter = cif.substr(0, 1);
    var control = cif.substr(cif.length - 1);
    var sum = 0;
    var i;
    var digit;

    if (!letter.match(/[A-Z]/)) {
        return false;
    }

    for (i = 0; i < digits.length; ++i) {
        digit = parseInt(digits[i]);

        if (isNaN(digit)) {
            return false;
        }

        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit = parseInt(digit / 10) + (digit % 10);
            }

            sum += digit;
        } else {
            sum += digit;
        }
    }

    sum %= 10;
    if (sum !== 0) {
        digit = 10 - sum;
    } else {
        digit = sum;
    }

    if (letter.match(/[ABEH]/)) {
        return String(digit) === control;
    }
    if (letter.match(/[NPQRSW]/)) {
        return letters[digit] === control;
    }

    return String(digit) === control || letters[digit] === control;
};


Utils.GetDocumentType = function (doc, applicanttype) {
    var firstchar;
    var documenttype;
    if (applicanttype == 1 && doc != null) {
        firstchar = doc.substr(0, 1);
        var isValidDoc = Utils.validateDNI(doc);
        if ((firstchar.toUpperCase() == 'X' || firstchar.toUpperCase() == 'Y' || firstchar.toUpperCase() == 'Z') && isValidDoc) {
            documenttype = 'NIE';
        }
        else if (firstchar.toUpperCase() == 'K' && isValidDoc) {
            documenttype = 'NIF';
        }
        else {
            return isValidDoc ? 'DNI' : 'PAS';
        }
    }
    return documenttype;
};

Utils.ValidateIBAN = function (IBAN) {

    //Se pasa a Mayusculas
    IBAN = IBAN.toUpperCase();
    //Se quita los blancos de principio y final.
    IBAN = IBAN.trim();//trim(IBAN);
    IBAN = IBAN.replace(/\s/g, ""); //Y se quita los espacios en blanco dentro de la cadena

    var letra1, letra2, num1, num2;
    var isbanaux;
    var numeroSustitucion;
    //La longitud debe ser siempre de 24 caracteres
    if (IBAN.length != 24) {
        return false;
    }

    // Se coge las primeras dos letras y se pasan a números
    letra1 = IBAN.substring(0, 1);
    letra2 = IBAN.substring(1, 2);
    num1 = Utils.getnumIBAN(letra1);
    num2 = Utils.getnumIBAN(letra2);
    //Se sustituye las letras por números.
    isbanaux = String(num1) + String(num2) + IBAN.substring(2);
    // Se mueve los 6 primeros caracteres al final de la cadena.
    isbanaux = isbanaux.substring(6) + isbanaux.substring(0, 6);

    //Se calcula el resto, llamando a la función modulo97, definida más abajo
    var resto = Utils.modulo97(isbanaux);
    if (resto == 1) {
        return true;
    } else {
        return false;
    }
}

Utils.ValidateIBANIsResident = function (IBAN) {
    var startsWithLetters = /^[a-zA-Z]/.test(IBAN);

    if (!startsWithLetters) {
        return false;
    } else if (startsWithLetters && IBAN.length > 36) {
        return false;
    } else if (startsWithLetters && IBAN.length <= 36) {
        //Comprobación si es residente en España. En jurídicas este valor es siempre true
        var IsResident = vm.MainApplicant().ApplicantPersonalData().IsResident();
        //Comprobación del tipo de applicant para caso de jurídicas
        var applicantType = vm.MainApplicant().ApplicantBasicData().ApplicantType();
        //Resultado booleano de validación IBAN internacional y Español
        var isInternationalVal = Utils.InternationalValidationIban(IBAN);
        //Se pasa a Mayusculas
        IBAN = IBAN.toUpperCase();
        //Se quita los blancos de principio y final.
        IBAN = IBAN.trim();//trim(IBAN);
        IBAN = IBAN.replace(/\s/g, ""); //Y se quita los espacios en blanco dentro de la cadena

        var letra1, letra2, num1, num2;

        // Se coge las primeras dos letras y se pasan a números (cualquier letra, permite cualquier país)
        letra1 = IBAN.substring(0, 1);
        letra2 = IBAN.substring(1, 2);

        var isbanaux;
        //La longitud debe ser siempre menor de 36 caracteres

        //Caso particular: en jurídica el flag isResident es siempre true. Usamos tipo de applicant para tratar su validación
        if (isInternationalVal && applicantType == ApplicantTypeEnum.JURIDICA) {
            return true;
            //Validación de IBAN internacionales (incluídos IBAN españoles): Sólo aplica cuando se elige no residente
        } else if (IsResident == "false") {
            //No resindentes: sólo aceptados IBAN extranjeros menores de 30 dígitos y españoles iguales a 24 dígitos              
            if ((isInternationalVal) && (letra1 != 'E' && letra2 != 'S')) {
                return true;
            } else if ((isInternationalVal) && (letra1 == 'E' && letra2 == 'S') && (IBAN.length == 24)) {
                return true;
            } else if ((isInternationalVal) && (letra1 == 'E' && letra2 == 'S') && (IBAN.length != 24)) {
                return false;
            } else {
                return false;
            }
        } else if (IsResident == "true" && IBAN.length == 24 && (applicantType != ApplicantTypeEnum.JURIDICA)) {

            if ((IsResident == "true") && (letra1 == 'E' && letra2 == 'S')) {
                num1 = Utils.getnumIBAN(letra1);
                num2 = Utils.getnumIBAN(letra2);
            }
            //Se sustituye las letras por números.
            isbanaux = String(num1) + String(num2) + IBAN.substring(2);
            // Se mueve los 6 primeros caracteres al final de la cadena.
            isbanaux = isbanaux.substring(6) + isbanaux.substring(0, 6);
            //Se calcula el resto, llamando a la función modulo97, definida más abajo
            var resto = Utils.modulo97(isbanaux);
            if (resto == 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

Utils.ValidatePercentageAmount = function (percentAmount) {
    var regExpres = /^[0-9]{1,2}(([,][0-9]{1,2})|([,]{1}))?$/;
    if (regExpres.test(percentAmount)) {
        return true;
    }
    return false;
}

Utils.modulo97 = function (iban) {
    var parts = Math.ceil(iban.length / 7);
    var remainer = "";

    for (var i = 1; i <= parts; i++) {
        remainer = String(parseFloat(remainer + iban.substr((i - 1) * 7, 7)) % 97);
    }

    return remainer;
}

Utils.InternationalValidationIban = function (iban) {
    var rearrange =
        iban.substring(4, iban.length)
        + iban.substring(0, 4);
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    var alphaMap = {};
    var number = [];

    alphabet.forEach((iban, index) => {
        alphaMap[iban] = index + 10;
    });

    rearrange.split('').forEach((iban, index) => {
        number[index] = alphaMap[iban] || iban;
    });
    number = number.join('');

    var resto = Utils.InternationalVariableModulo(number, 97);
    if (resto == 1) {
        return true;
    } else {
        return false;
    }
}

Utils.InternationalVariableModulo = function (iban, divider) {
    var tmpResto = "";
    var i, r;
    for (i = 0; i < iban.length; i++) {
        tmpResto += iban.charAt(i);
        r = tmpResto % divider;
        tmpResto = r.toString();
    }
    return tmpResto / 1;
}

Utils.getnumIBAN = function (letra) {
    var ls_letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return ls_letras.search(letra) + 10;
}

Utils.calcISINCheck = function (code) {
    var conv = '';
    var digits = '';
    var sd = 0;
    // convert letters
    for (var i = 0; i < code.length; i++) {
        var c = code.charCodeAt(i);
        conv += (c > 57) ? (c - 55).toString() : code[i]
    }
    // group by odd and even, multiply digits from group containing rightmost character by 2
    for (var i = 0; i < conv.length; i++) {
        digits += (parseInt(conv[i]) * ((i % 2) == (conv.length % 2 != 0 ? 0 : 1) ? 2 : 1)).toString();
    }
    // sum all digits
    for (var i = 0; i < digits.length; i++) {
        sd += parseInt(digits[i]);
    }
    // subtract mod 10 of the sum from 10, return mod 10 of result 
    return (10 - (sd % 10)) % 10;
}

Utils.isValidISIN = function (isin) {
    // basic pattern
    var regex = /^(AD|AE|AF|AG|AI|AL|AM|AO|AQ|AR|AS|AT|AU|AW|AX|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BJ|BL|BM|BN|BO|BQ|BR|BS|BT|BV|BW|BY|BZ|CA|CC|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|CR|CU|CV|CW|CX|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EE|EG|EH|ER|ES|ET|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GF|GG|GH|GI|GL|GM|GN|GP|GQ|GR|GS|GT|GU|GW|GY|HK|HM|HN|HR|HT|HU|ID|IE|IL|IM|IN|IO|IQ|IR|IS|IT|JE|JM|JO|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MF|MG|MH|MK|ML|MM|MN|MO|MP|MQ|MR|MS|MT|MU|MV|MW|MX|MY|MZ|NA|NC|NE|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|PA|PE|PF|PG|PH|PK|PL|PM|PN|PR|PS|PT|PW|PY|QA|RE|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SH|SI|SJ|SK|SL|SM|SN|SO|SR|SS|ST|SV|SX|SY|SZ|TC|TD|TF|TG|TH|TJ|TK|TL|TM|TN|TO|TR|TT|TV|TW|TZ|UA|UG|UM|US|UY|UZ|VA|VC|VE|VG|VI|VN|VU|WF|WS|YE|YT|ZA|ZM|ZW)([0-9A-Z]{9})([0-9])$/;
    var match = regex.exec(isin);
    if (match) {
        if (match.length != 4) return false;
        // validate the check digit
        return (match[3] == Utils.calcISINCheck(match[1] + match[2]));
    }
    return false;
}

Utils.CloneApplicant = function (applicant) {
    var applicantclone = new Applicant(applicant.Product(), applicant.ApplicantBasicData().Assisted());

    applicantclone.Id(applicant.Id());

    applicantclone.IsDifferentAddress(applicant.IsDifferentAddress());

    applicantclone.ApplicantBasicData().Name(applicant.ApplicantBasicData().Name());
    applicantclone.ApplicantBasicData().FirstSurname(applicant.ApplicantBasicData().FirstSurname());
    applicantclone.ApplicantBasicData().SecondSurname(applicant.ApplicantBasicData().SecondSurname());
    applicantclone.ApplicantBasicData().DNI(applicant.ApplicantBasicData().DNI());
    applicantclone.ApplicantBasicData().ApplicantType(applicant.ApplicantBasicData().ApplicantType());
    applicantclone.ApplicantBasicData().RequestApplicantType(applicant.ApplicantBasicData().RequestApplicantType());
    applicantclone.ApplicantBasicData().Email(applicant.ApplicantBasicData().Email());
    applicantclone.ApplicantBasicData().MobilePhoneNumber(applicant.ApplicantBasicData().MobilePhoneNumber());
    applicantclone.ApplicantBasicData().SignatureType(applicant.ApplicantBasicData().SignatureType());

    applicantclone.ApplicantPersonalData().Birthday(applicant.ApplicantPersonalData().Birthday());
    applicantclone.ApplicantPersonalData().Gender(applicant.ApplicantPersonalData().Gender());
    applicantclone.ApplicantPersonalData().IDDocumentIsPermanent(applicant.ApplicantPersonalData().IDDocumentIsPermanent());
    applicantclone.ApplicantPersonalData().IDDocumentExpirationDate(applicant.ApplicantPersonalData().IDDocumentExpirationDate());
    applicantclone.ApplicantPersonalData().Nationality(applicant.ApplicantPersonalData().Nationality());
    applicantclone.ApplicantPersonalData().Country(applicant.ApplicantPersonalData().Country());
    applicantclone.ApplicantPersonalData().IsResident(applicant.ApplicantPersonalData().IsResident());
    applicantclone.ApplicantPersonalData().PhoneNumber(applicant.ApplicantPersonalData().PhoneNumber());
    applicantclone.ApplicantPersonalData().BornPlace(applicant.ApplicantPersonalData().BornPlace());

    applicantclone.ApplicantContactData().FiscalAddress().AddressTypeId(applicant.ApplicantContactData().FiscalAddress().AddressTypeId());
    applicantclone.ApplicantContactData().FiscalAddress().FullAddress(applicant.ApplicantContactData().FiscalAddress().FullAddress());
    applicantclone.ApplicantContactData().FiscalAddress().ViaType(applicant.ApplicantContactData().FiscalAddress().ViaType());
    applicantclone.ApplicantContactData().FiscalAddress().Street(applicant.ApplicantContactData().FiscalAddress().Street());
    applicantclone.ApplicantContactData().FiscalAddress().StreetNumber(applicant.ApplicantContactData().FiscalAddress().StreetNumber());
    applicantclone.ApplicantContactData().FiscalAddress().Stairs(applicant.ApplicantContactData().FiscalAddress().Stairs());
    applicantclone.ApplicantContactData().FiscalAddress().Floor(applicant.ApplicantContactData().FiscalAddress().Floor());
    applicantclone.ApplicantContactData().FiscalAddress().Door(applicant.ApplicantContactData().FiscalAddress().Door());
    applicantclone.ApplicantContactData().FiscalAddress().AddressExtension(applicant.ApplicantContactData().FiscalAddress().AddressExtension());
    applicantclone.ApplicantContactData().FiscalAddress().PostalCode(applicant.ApplicantContactData().FiscalAddress().PostalCode());
    applicantclone.ApplicantContactData().FiscalAddress().City(applicant.ApplicantContactData().FiscalAddress().City());
    applicantclone.ApplicantContactData().FiscalAddress().Province(applicant.ApplicantContactData().FiscalAddress().Province());
    applicantclone.ApplicantContactData().FiscalAddress().CountryId(applicant.ApplicantContactData().FiscalAddress().CountryId());

    applicantclone.Test(applicant.Test());
    //applicantclone.Test([]);

    return applicantclone;
};

Utils.GetMainApplicant = function (Product, ApplicantType, RequestApplicantType, assisted, deliveryOptionsHidden) {
    var applicant = new Applicant(Product, assisted, deliveryOptionsHidden);
    applicant.ApplicantBasicData().Product(Product.Id());
    applicant.ApplicantBasicData().ApplicantType(ApplicantType);
    applicant.ApplicantBasicData().RequestApplicantType(RequestApplicantType);
    return applicant;
};

Utils.CloneAddress = function (address) {
    var addressclone = new Address(address.AddressTypeId());
    addressclone.FullAddress(address.FullAddress());
    addressclone.ViaType(address.ViaType());
    addressclone.Street(address.Street());
    addressclone.StreetNumber(address.StreetNumber());
    addressclone.Stairs(address.Stairs());
    addressclone.Floor(address.Floor());
    addressclone.Door(address.Door());
    addressclone.AddressExtension(address.AddressExtension());
    addressclone.PostalCode(address.PostalCode());
    addressclone.City(address.City());
    addressclone.Province(address.Province());
    addressclone.CountryId(address.CountryId());
    return addressclone;
}

Utils.ClearInputFile = function () {
    sessionStorage.removeItem('DniUpload');

    $('#documentationdelivery-id').attr('data-extrainputs', 'documentationdelivery-idfiles02');
    $('#documentationdelivery-idfiles-label').attr('for', 'documentationdelivery-idfiles01');
    $('#documentationdelivery-idfiles-label').removeClass('hidden');
    $("#documentationdelivery-idfiles02").remove();

    $('#documentationdelivery-id-custom').attr('data-extrainputs', 'documentationdelivery-idfiles02-custom');
    $('#documentationdelivery-idfiles-label-custom').attr('for', 'documentationdelivery-idfiles01-custom');
    $('#documentationdelivery-idfiles-label-custom').removeClass('hidden');
    $("#documentationdelivery-idfiles02-custom").val('');
    $("#documentationdelivery-idfiles02-custom").remove();

    $('.upload_list').empty();
    $('.upload_data').removeClass('hidden');
    $('.upload_data').addClass('hidden');

    $("#documentationdelivery-idfiles01").val('');
    $("#documentationdelivery-idfiles01-custom").val('');
    $("#documentationdelivery02-idfiles01").val('');

    $('#documentationdelivery02-idfiles-label').removeClass('hidden');
};

Utils.GetBase64 = function (file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();

        if (file.type.match(/image.*/)) {
            var img = new Image();
            var img64;

            img.onload = function (evt) {
                var cvs = document.createElement('canvas');
                var aspectRatio = 1024 / img.width;
                cvs.width = 1024;
                cvs.height = this.height * aspectRatio;

                //calculamos la calidad de la imagen para enviar imagenes de 1MB
                var ctx = cvs.getContext("2d").drawImage(img, 0, 0, 1024, img.height * aspectRatio);

                setTimeout(function () {
                    var base64imageData = cvs.toDataURL('image/jpeg');
                    resolve(base64imageData);
                }, 100);
            }

            // Read in the image file as a data URL.
            img.src = URL.createObjectURL(file);
        } else {
            reader.readAsDataURL(file);
            reader.onload = function () {
                img64 = reader.result;
                resolve(img64);
            };
        }
    });
};

Utils.GetDocuments = function (data) {
    var DocumentList = [];

    $.each(data, function (i, item) {
        var _pdfdocument = new PdfDocumentData();
        _pdfdocument.Dni(data[i].Dni);
        _pdfdocument.OtpsToken(data[i].OtpsToken);
        _pdfdocument.OtpsTokensSigner(data[i].OtpsTokensSigner);
        _pdfdocument.ElectronicSignatureServiceVersion(data[i].ElectronicSignatureServiceVersion);
        _pdfdocument.AccessToken(data[i].AccessToken);
        _pdfdocument.OtpsId(data[i].OtpsId);

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

Utils.Paddy = function (n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}

Utils.ProcessDNI = function (value) {
    return Utils.Paddy(value.trim(), 9).toUpperCase()
}

Utils.GetMobileAppData = function () {
    var userAgent = window.navigator.userAgent
    var MobileAppData = { AppVersion: null, OperativeSystem: null, Manufacturer: null, OperativeSystemVersion: null }
    if (userAgent !== null && (userAgent.indexOf("bstapp") != -1 || userAgent.indexOf("bestinver") != -1)) {
        var mobileDataString = "";

        if (userAgent.indexOf("bstapp") != -1) {
            mobileDataString = userAgent.substring(userAgent.indexOf("bstapp"), (userAgent.length));
        } else {
            mobileDataString = userAgent.substring(userAgent.indexOf("bestinver"), (userAgent.length));
        }
        
        var mobileDataElements = mobileDataString.split(";");

        if (mobileDataElements.length >= 1) {
            MobileAppData.AppVersion = mobileDataElements[0];
        }
        if (mobileDataElements.length >= 2) {
            MobileAppData.OperativeSystem = mobileDataElements[1];
        }
        if (mobileDataElements.length >= 3) {
            MobileAppData.Manufacturer = mobileDataElements[2];
        }
        if (mobileDataElements.length >= 4) {
            MobileAppData.OperativeSystemVersion = mobileDataElements[3];
        }
    }
    return MobileAppData
}


var _LegalModalContent = null;

Utils.LoadLegalModalContent = function () {
    if (_LegalModalContent) {
        return new Promise(function (resolve, reject) {
            resolve(_LegalModalContent);
        });
    } else {
        var result = Request.GetLegalModalContent();
        _LegalModalContent = result;
        return result;
    }
}

Utils.GetMobileOS = function () {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        if (/bstapp/i.test(userAgent)) {
            return "AndroidApp";
        }
        return "Others";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        if (/bstapp/i.test(userAgent)) {
            return "IOsApp";
        }
        return "Others";
    }

    if (/bstapp/i.test(userAgent)) {
        return "BstApp";
    }

    return "Others";
}

Utils.CheckSignatureVisible = function (scope) {
    var check = scope;
    var parent = scope.parentElement.parentElement;
    var allchecked = true;

    var textToLog = '';
    var checked = '';
    if (scope.labels != undefined) {
        var textToLog = scope.labels[0].innerText;
    } else {
        var textToLog = $('label[for=' + scope.id + ']').closest('div').text().trim();
    }

    if ($(check).is(":checked")) {
        checked = "check";
    } else {
        checked = "vacio";
    }

    if (GMT != undefined) GMT.PushEventText(checked, 'confirmacion lectura', textToLog);

    $('#' + parent.id).find(':checkbox').each(function () {
        allchecked = allchecked && $(this).is(":checked");
    });

    if (allchecked) {
        if (GMT == undefined) {
            var GMT = new GoogleTagManager();
        }
        GMT.Push(PageEnum.FIRMA_DOCUMENTOS_PIN);
        $('#signature-sms').css('display', 'block');
        $('#GDPR-Online-Acceptation-content').css('display', 'block');
    } else {
        $('#signature-sms').css('display', 'none');
        $('#GDPR-Online-Acceptation-content').css('display', 'none');
    }

};

Utils.SendGdprCheckAnalitics = function (check, number, isModal) {
    var checked = '';

    if ($(check).is(":checked")) {
        checked = "check";
    } else {
        checked = "uncheck";
    }

    if (GMT != undefined) GMT.PushEvent(
        (isModal
            ? PageEnum.ENVIO_DOCUMENTACION + '/modal'
            : PageEnum.FIRMA_DOCUMENTOS_PIN),
        'gdpr ' + number + ' alta', checked);
};

Utils.FormatIBAN = function (iban) {
    var format_iban = '';
    if (iban.length <= 36) {
        return iban;
    }
    return iban.slice(0, 4) + ' ' + iban.slice(4, 8) + ' ' + iban.slice(8, 12) + ' ' + iban.slice(12, 14) + ' ' + iban.slice(14, 24);
}

Utils.IsDecimalValid = function (val) {
    try {
        if (val.toString().trim() == "")
            return false;

        var val_format_1 = val.toString().replaceAll('.', '');
        var val_format_2 = val_format_1.toString().replaceAll(',', '.');
        return !isNaN(val_format_2);
    } catch (e) {
        return false;
    }
}

Utils.IsDecimalValidHigherThan = function (val, valcompare) {
    if (Utils.IsDecimalValid(val)) {
        var val_format_1 = val.toString().replaceAll('.', '');
        var val_format_2 = val_format_1.toString().replaceAll(',', '.');
        return parseFloat(val_format_2) > valcompare;
    } else {
        return false;
    }
}

Utils.GetDecimalValue = function (val) {
    if (Utils.IsDecimalValid(val)) {
        var val_format_1 = val.toString().replaceAll('.', '');
        var val_format_2 = val_format_1.toString().replaceAll(',', '.');
        return parseFloat(val_format_2);
    }
}

Utils.IsNullOrzeroDecimal = function (val) {
    if (Utils.IsDecimalValid(val)) {
        var val_format_1 = val.toString().replaceAll('.', '');
        var val_format_2 = val_format_1.toString().replaceAll(',', '.');
        return parseFloat(val_format_2) == parseFloat('0');
    } else {
        return true;
    }
}

Utils.IsNational = function (isin) {
    var national = true;

    if (isin == undefined || isin.trim() == "")
        return false;

    var isinpre = isin.substring(0, 2);
    if (isinpre.toUpperCase() == 'ES')
        national = true;
    else
        national = false;

    return national;
}

Utils.ValidateScanDNI = function () {
    var scanDniOptions = $(".hideDNILimit").map(function () { return $(this).is(":visible"); }).get();
    var validate = scanDniOptions.some(function (elem) { return elem; }) && scanDniOptions.length > 0;
    return validate;
};

ko.observableArray.fn.pushAll = function (valuesToPush) {
    var underlyingArray = this();
    this.valueWillMutate();
    ko.utils.arrayPushAll(underlyingArray, valuesToPush);
    this.valueHasMutated();
    return this;  //optional
};
ko.bindingHandlers.customtext = {
    update: function (element, valueAccessor, allBindings) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);

        $(element).text(valueUnwrapped);
    }
};

ko.bindingHandlers['readonly'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (!value && element.readOnly)
            element.readOnly = false;
        else if (value && !element.readOnly)
            element.readOnly = true;
    }
};

navigator.sayswho = (function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

window.onerror = function (errorMsg, url, lineNumber) {
    console.log(errorMsg, url);
    //try {
    //    $.ajax({
    //        url: errorConfig.API_Log_Error,
    //        type: 'Post',
    //        data: {
    //            Browser: navigator.sayswho,
    //            Exception: encodeURI(errorMsg),
    //            LineNumber: lineNumber,
    //            Url: url ? url : location.href,
    //            RequestId: Utils.GetRequestId()
    //        }
    //    });
    //} catch (e) {
    //    console.log(e);
    //}
};

window.customDebug = function (message, url) {
    console.log(message, url);
    //try {
    //    $.ajax({
    //        url: errorConfig.API_Log_Debug,
    //        type: 'Post',
    //        data: {
    //            Browser: navigator.sayswho,
    //            Message: encodeURI(message),
    //            Url: url ? url : location.href,
    //            RequestId: Utils.GetRequestId()
    //        }
    //    });
    //} catch (e) {
    //    console.log(e);
    //}
};

window.customError = onerror;

$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
    //try {
    //    var exception = jqxhr.responseText;
    //    $.ajax({
    //        url: errorConfig.API_Log_Error,
    //        type: 'Post',
    //        data: {
    //            Browser: navigator.sayswho,
    //            Exception: encodeURI(exception),
    //            LineNumber: '',
    //            Url: settings.url,
    //            RequestId: Utils.GetRequestId()
    //        }
    //    });
    //} catch (e) {
    //    console.log(e);
    //}
});

$.ajaxSetup({
    beforeSend: function (xhr) {
        xhr.setRequestHeader("RequestID", Utils.GetRequestId());
    }
});

window.setDatalayerItem = function (item, value) {
    try {
        var datalayer = JSON.parse(sessionStorage.getItem('array_datalayer'));
        datalayer[item] = value;
        sessionStorage.setItem('array_datalayer', JSON.stringify(datalayer));
    } catch (e) {
        console.log(e);
    }
};

window.getDatalayerItem = function (item) {
    var value = '';
    try {
        var datalayer = JSON.parse(sessionStorage.getItem('array_datalayer'));
        value = datalayer[item];
    } catch (e) {
        console.log(e);
    }
    return value;
};

window.setDatalayerProfile = function (value) {
    var profile = '';
    switch (value) {
        case 2:
            profile = 'co';
            break;
        case 3:
            profile = 'au';
            break;
        case 4:
            profile = 'be';
            break;
        case 5:
            profile = 'tu';
            break;
    }
    try {
        var datalayer = JSON.parse(sessionStorage.getItem('array_datalayer'));
        datalayer['perfiles'] = datalayer['perfiles'] + profile + ';';
        sessionStorage.setItem('array_datalayer', JSON.stringify(datalayer));
    } catch (e) { };
}

window.googleTagManagerCall = function (tp) {
    if (GMT == undefined)
        return true;

    var id = $(tp).attr('data-eventname');
    switch (id) {
        case 'Dirección fiscal':
        case 'Dirección postal':
            GMT.PushEvent(PageEnum.DIRECCION_CONTACTO_TITULAR, 'icono de ayuda', id);
            break;
        case 'cotitular':
            GMT.PushEvent(PageEnum.COTITULARES, 'icono de ayuda', id);
            break;
        case 'coheredero':
            GMT.PushEvent(PageEnum.COHEREDEROS, 'icono de ayuda', id);
            break;
        case 'usufructuario':
            GMT.PushEvent(PageEnum.USUFRUCTUARIOS, 'icono de ayuda', id);
            break;
        case 'autorizado':
            GMT.PushEvent(PageEnum.AUTORIZADOS, 'icono de ayuda', id);
            break;
        case 'tipo de operacion':
            GMT.PushEvent(PageEnum.TIPO_OPERACION, 'icono de ayuda', id);
            break;
    }
}

window.SetCleaveClass = function () {

    Cleave.prototype.updateValueState = function () {
        var owner = this;

        if (!owner.element) {
            return;
        }

        var endPos = owner.element.selectionEnd;
        var oldValue = owner.element.value;

        // fix Android browser type="text" input field
        // cursor not jumping issue
        if (owner.isAndroid) {
            window.setTimeout(function () {
                owner.element.value = owner.properties.result;
                owner.setCurrentSelection(endPos, oldValue);
            }, 1);

            return;
        }

        owner.element.value = owner.properties.result;
        owner.setCurrentSelection(endPos, oldValue);
        $(owner.element).trigger("change");
    };

    $('.input-decimal-2').toArray().forEach(function (field) {
        new Cleave(field, {
            numeral: true,
            numeralDecimalScale: 2,
            numeralDecimalMark: ',',
            delimiter: '.'
        });
    });

    $('.input-decimal-6').toArray().forEach(function (field) {
        new Cleave(field, {
            numeral: true,
            numeralDecimalScale: 6,
            numeralDecimalMark: ',',
            delimiter: '.'
        });
    });

    $('.input-iban').toArray().forEach(function (field) {
        new Cleave(field, {
            uppercase: true,
            blocks: [4, 4, 4, 2, 22],
            delimiter: ' '
        });
    });

    $('.input-iban-extranjero').toArray().forEach(function (field) {
        new Cleave(field, {
            uppercase: true,
            blocks: [100],
        });
    });

    $('.input-isin').toArray().forEach(function (field) {
        new Cleave(field, {
            uppercase: true,
            blocks: [12]
        });
    });

    $('.input-integer-2').toArray().forEach(function (field) {
        new Cleave(field, {
            blocks: [2]
        });
    });

    $('.input-integer-4').toArray().forEach(function (field) {
        new Cleave(field, {
            blocks: [4]
        });
    });

    $('.input-integer-5').toArray().forEach(function (field) {
        new Cleave(field, {
            blocks: [5]
        });
    });

    $('.input-phone').toArray().forEach(function (field) {
        new Cleave(field, {
            blocks: [9]
        });
    });

    $('.input-integer-20').toArray().forEach(function (field) {
        new Cleave(field, {
            blocks: [20]
        });
    });

    $(".numonly").on("keypress", function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /[0-9]|\./;
        if (!regex.test(key) && evt.keyCode != 8 && evt.keyCode != 9) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    });

    $(".numonly").on("input propertychange", function (obj) {
        var m = $(this)[0].max;
        var v = $(this).val();
        if (parseInt(v) > parseInt(m))
            $(this).val($(this).val().slice(0, $(this).val().length - 1)).trigger('change');
    });

    $(".numonly").on("blur", function (obj) {
        var m = $(this)[0].min;
        var v = $(this).val();
        if (parseInt(v) < parseInt(m)) {
            $(this).val('');
        }
    });

    $(".birthyear").on("blur", function (obj) {
        var currentdate = moment();
        var currentyear = parseInt(currentdate.year());
        var v = $(this).val();
        if (parseInt(v) > currentyear) {
            $(this).val('');
        }
    });

    $('.input-tel-prefix').toArray().forEach(function (field) {
        new Cleave(field, {
            prefix: '+',
            delimiter: '',
            blocks: [1, 3],
            uppercase: true
        });
    });

    var maxphonelength = 20;
    var maxspanishlength = 9;
    $(".input-tel-prefix").on("input propertychange", function (obj) {
        var prefix = $(this).val();
        var maxlength = maxspanishlength;
        var input = $(this).parent().find('.inputphone');

        if (prefix != "+34") {
            maxlength = maxphonelength;
            maxlength -= prefix.length;
        }
        input.attr('maxLength', maxlength);

        if (parseInt(input.val().length) > parseInt(input.attr('maxLength'))) {
            //input.val(input.val().slice(0, input.attr('maxLength')));
            input.val("");
        }
    });

    $(".inputphone").on("input propertychange", function (obj) {
        var phone = $(this);
        var prefix = $(this).parent().find('.input-tel-prefix').val();
        var maxlength = maxspanishlength;

        if (prefix != "+34") {
            maxlength = maxphonelength;
            maxlength -= prefix.length;
        }
        phone.attr('maxLength', maxlength);

        if (parseInt(phone.val().length) > parseInt(phone.attr('maxLength'))) {
            phone.val(phone.val().slice(0, phone.attr('maxLength')));
        }
    });
};

var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".pdf"];
Utils.ValidateInputFileExtension = function (arrInputs) {
    for (var i = 0; i < arrInputs.length; i++) {
        var oInput = arrInputs[i];
        if (oInput.type == "file") {
            var sFileName = oInput.value;
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }
                if (!blnValid) {
                    return false;
                }
            }
        }
    }
    return true;
}

Utils.ParseFloatWithComma = function (stringNumber) {
    var number = stringNumber.toString().replace(",", ".");
    return parseFloat(number);
};

// Creamos función para hacer scroll a la ID recibida
Utils.scrollWindow = function (id, offset) {

    if (!offset) offset = -50;
    var $element = jQuery('#' + id),
        $header = jQuery('.module-registration-header.fixed'),
        headerHeight = 0;

    if ($header !== undefined && $header.length > 0) {
        headerHeight = $header.height();
    }

    var posY = $element.offset().top - headerHeight + offset;

    jQuery('html, body').animate({
        scrollTop: posY
    }, 400);
}

Utils.GetOperationText = function (product, operation, requestType = false) {

    var txt = '';
    var documentText = 'número de tu DNI';

    if (requestType) {
        documentText = 'número del CIF';
    }

    switch (operation.IdOperationType()) {
        case '1':
            if (operation.IdWayToPay() == 1) {
                txt = 'Tienes que realizar una transferencia bancaria a favor de '
                    + product.Name()
                    + ' por ' + operation.Amount() + '€'
                    + ' al número de cuenta ' + Utils.FormatIBAN(product.Iban())
                    + ' indicando en el concepto de la misma el '
                    + documentText
                    + '. Nos pondremos en contacto contigo para confirmarte que hemos recibido el importe de la transferencia.';
            }

            if (operation.IdWayToPay() == 2) {
                txt = 'Envía un cheque nominativo indicando como beneficiario a '
                    + product.Name() + ' por el importe de '
                    + operation.Amount();
            }
            break;
        case '2':
        case '4':
            if (operation.IdWayToPay() == null) {
                txt = '';
            } else {
                if (operation.IdWayToPay() == 1) {
                    txt = 'Tienes que realizar una transferencia bancaria a favor de '
                        + product.Name()
                        + ' por ' + operation.Amount() + '€'
                        + ' al número de cuenta ' + Utils.FormatIBAN(product.Iban())
                        + ' indicando en el concepto de la misma el ' + documentText
                        + '. Nos pondremos en contacto contigo para confirmarte que hemos recibido el importe de la transferencia.';
                }

                if (operation.IdWayToPay() == 2) {
                    txt = 'Envía un cheque nominativo indicando como beneficiario a '
                        + product.Name() + ' por el importe de '
                        + operation.Amount() + '€';
                }
            }
            break;
        case '3':
            txt = 'Nos pondremos en contacto contigo para confirmarte que tu orden de traspaso se ha ejecutado de forma correcta.';
            break;
    }

    return txt;
}
Utils.GetRequestId = function () {
    try {
        return vm.RequestId();
    } catch (e) {
        return "";
    }
}

Utils.GetRemediacionId = function () {
    try {
        return vm.remediacionId();
    } catch (e) {
        return "";
    }
}

Utils.isNullOrEmpty = function (val) {
    return (!val || val == undefined || val == "" || val.length == 0);
}

Utils.isNullOrEmptyOrSpace = function (val) {
    if (!Utils.isNullOrEmpty(val)) {
        val = val.toString().trim();
        return val == "";
    } else {
        return true;
    }
}

Utils.getMomentDate = function (pday, pmonth, pyear) {
    var day = pday != undefined ? Utils.Paddy(pday, 2) : 0;
    var month = pmonth != undefined ? Utils.Paddy(pmonth, 2) : 0;
    var year = pyear != undefined ? Utils.Paddy(pyear, 4) : 0;
    var datestring = year + "-" + month + "-" + day;
    var date = moment(datestring, 'YYYY-MM-DD', true);

    return date;
}

Utils.GetMainApplicantForeign = function (Product, ApplicantType, RequestApplicantType) {
    var applicant = new Applicant(Product, ApplicantType);
    applicant.ApplicantBasicData().Product(Product.Id());
    applicant.ApplicantBasicData().ApplicantType(ApplicantType);
    applicant.ApplicantBasicData().RequestApplicantType(RequestApplicantType);
    return applicant;
}

Utils.CloneApplicantForeign = function (applicant) {
    var applicantclone = new Applicant(applicant.Product(), applicant.ApplicantBasicData().ApplicantType());

    applicantclone.Id(applicant.Id());

    applicantclone.IsDifferentAddress(applicant.IsDifferentAddress());

    applicantclone.ApplicantBasicData().Name(applicant.ApplicantBasicData().Name());
    applicantclone.ApplicantBasicData().FirstSurname(applicant.ApplicantBasicData().FirstSurname());
    applicantclone.ApplicantBasicData().SecondSurname(applicant.ApplicantBasicData().SecondSurname());
    applicantclone.ApplicantBasicData().DNI(applicant.ApplicantBasicData().DNI());
    applicantclone.ApplicantBasicData().ApplicantType(applicant.ApplicantBasicData().ApplicantType());
    applicantclone.ApplicantBasicData().RequestApplicantType(applicant.ApplicantBasicData().RequestApplicantType());
    applicantclone.ApplicantBasicData().Email(applicant.ApplicantBasicData().Email());
    applicantclone.ApplicantBasicData().MobilePhoneNumber(applicant.ApplicantBasicData().MobilePhoneNumber());
    applicantclone.ApplicantBasicData().SignatureType(applicant.ApplicantBasicData().SignatureType());

    applicantclone.ApplicantPersonalData().Birthday(applicant.ApplicantPersonalData().Birthday());
    applicantclone.ApplicantPersonalData().Gender(applicant.ApplicantPersonalData().Gender());
    applicantclone.ApplicantPersonalData().IDDocumentIsPermanent(applicant.ApplicantPersonalData().IDDocumentIsPermanent());
    applicantclone.ApplicantPersonalData().IDDocumentExpirationDate(applicant.ApplicantPersonalData().IDDocumentExpirationDate());
    applicantclone.ApplicantPersonalData().Nationality(applicant.ApplicantPersonalData().Nationality());
    applicantclone.ApplicantPersonalData().Country(applicant.ApplicantPersonalData().Country());
    applicantclone.ApplicantPersonalData().IsResident(applicant.ApplicantPersonalData().IsResident());
    applicantclone.ApplicantPersonalData().PhoneNumber(applicant.ApplicantPersonalData().PhoneNumber());
    applicantclone.ApplicantPersonalData().BornPlace(applicant.ApplicantPersonalData().BornPlace());
    applicantclone.ApplicantPersonalData().ApplicantType(applicant.ApplicantPersonalData().ApplicantType());

    applicantclone.ApplicantContactData().FiscalAddress().AddressTypeId(applicant.ApplicantContactData().FiscalAddress().AddressTypeId());
    applicantclone.ApplicantContactData().FiscalAddress().FullAddress(applicant.ApplicantContactData().FiscalAddress().FullAddress());
    applicantclone.ApplicantContactData().FiscalAddress().ViaType(applicant.ApplicantContactData().FiscalAddress().ViaType());
    applicantclone.ApplicantContactData().FiscalAddress().Street(applicant.ApplicantContactData().FiscalAddress().Street());
    applicantclone.ApplicantContactData().FiscalAddress().StreetNumber(applicant.ApplicantContactData().FiscalAddress().StreetNumber());
    applicantclone.ApplicantContactData().FiscalAddress().Stairs(applicant.ApplicantContactData().FiscalAddress().Stairs());
    applicantclone.ApplicantContactData().FiscalAddress().Floor(applicant.ApplicantContactData().FiscalAddress().Floor());
    applicantclone.ApplicantContactData().FiscalAddress().Door(applicant.ApplicantContactData().FiscalAddress().Door());
    applicantclone.ApplicantContactData().FiscalAddress().AddressExtension(applicant.ApplicantContactData().FiscalAddress().AddressExtension());
    applicantclone.ApplicantContactData().FiscalAddress().PostalCode(applicant.ApplicantContactData().FiscalAddress().PostalCode());
    applicantclone.ApplicantContactData().FiscalAddress().City(applicant.ApplicantContactData().FiscalAddress().City());
    applicantclone.ApplicantContactData().FiscalAddress().Province(applicant.ApplicantContactData().FiscalAddress().Province());
    applicantclone.ApplicantContactData().FiscalAddress().CountryId(applicant.ApplicantContactData().FiscalAddress().CountryId());

    applicantclone.Test(applicant.Test());

    return applicantclone;
}

Utils.getNormalizeString = function (val) {
    const acentos = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
    return val.split('').map(function (letra) {
        return acentos[letra] || letra;
    }).join('').toString().toLowerCase();
}

Utils.CompareNormalizedString = function (val, compareVal) {
    return Utils.getNormalizeString(val) == Utils.getNormalizeString(compareVal);
}