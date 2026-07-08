function LoadDataMock(altCommand, selectedUser = -1) {
    var URLactual = window.location.href;
    console.log("Mock: ", URLactual);
    if (altCommand) {
        if (URLactual.includes("fisica")) {
            window.launchAjax(URLactual.split('fisica')[0] + "popup/popup-user-picker.html");
        }
        if (URLactual.includes("extranjero")) {
            window.launchAjax(URLactual.split('extranjero')[0] + "popup/popup-user-picker.html");
        }
        if (URLactual.includes("juridica")) {
            window.launchAjax(URLactual.split('juridica')[0] + "popup/popup-user-picker.html");
        }
    } else {
        if (selectedUser == -1) {
            var uCookie = getDebuggerCookie();
            if (uCookie != null && uCookie != '') {
                selectedUser = parseInt(uCookie);
            }
            else {
                selectedUser == 0;
            }
        }


        if (URLactual.includes("#BasicData")) {
            if (URLactual.includes("juridica")) {
                loadSelectedUserData('BasicDataJuridica', selectedUser);
            } else {
                loadSelectedUserData('BasicData', selectedUser);
            }
            scrollToElement('#footer');
        }

        if (URLactual.includes("#PersonalData")) {
            loadSelectedUserData('PersonalData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#ContactData")) {
            loadSelectedUserData('ContactData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#CoownerData")) {
            loadSelectedUserData('CoownerData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#AuthorizedData")) {
            loadSelectedUserData('AuthorizedData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#AgentData")) {
            loadSelectedUserData('AgentData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#BeneficiaryData")) {
            loadSelectedUserData('BeneficiaryData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#CoInheritorData")) {
            loadSelectedUserData('CoInheritorData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#UsufructuaryData")) {
            loadSelectedUserData('UsufructuaryData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#TutorData")) {
            loadSelectedUserData('TutorData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#OperationData")) {
            loadSelectedUserData('OperationData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#OperationIbanData")) {
            loadSelectedUserData('OperationIbanData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#OperationIbanAssistedData")) {
            loadSelectedUserData('OperationIbanAssistedData', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.includes("#TestData1")) {
            if (URLactual.includes("juridica")) {
                loadSelectedUserData('TestData1Juridica', selectedUser);
            } else if (URLactual.includes("extranjero")) {
                loadSelectedUserData('TestData1Extranjero', selectedUser);
            } else {
                loadSelectedUserData('TestData1', selectedUser);
            }
            scrollToElement('#footer');
        }

        if (URLactual.includes("#TestData2")) {
            //loadSelectedUserData('TestData2', selectedUser);
            scrollToElement('#footer');
        }

        if (URLactual.endsWith('/fisica')) {
            window.launchAjax(URLactual.replace('fisica', '') + "popup/popup-document-view.html");
        }
    }
}

function scrollToElement(elementId) {
    $([document.documentElement, document.body]).animate({
        scrollTop: $(elementId).offset().top
    }, 800);
}

function loadSelectedUserData(step, user) {
    var userData = mockedUsers[user];
    if (!userData) {
        userData = mockedUsers[0];
    }

    switch (step) {
        case 'BasicData':
            $('#basicdata-name').val(userData.name).trigger('change');
            $('#basicdata-first-surname').val(userData.firstSurname).trigger('change');
            $('#basicdata-second-surname').val(userData.secondSurname).trigger('change');
            $('#basicdata-email').val(userData.email).trigger('change');
            $('#basicdata-mobile-phone').val(userData.mobilePhone).trigger('change');
            $('#basicdata-dni').val(rand_dni()).trigger('change');
            $('#basicdata-legal').trigger('click');

            SelectByText('#channel-picker', 'Presencial');
            break;
        case 'BasicDataJuridica':
            $('#basicdata-name').val(mockedCorporation.name).trigger('change');
            $('#basicdata-email').val(mockedCorporation.email).trigger('change');
            $('#basicdata-mobile-phone').val(mockedCorporation.mobilePhone).trigger('change');
            $('#basicdata-dni').val(rand_cif_sa()).trigger('change');
            $('#basicdata-legal').trigger('click');

            SelectByText('#channel-picker', 'Presencial');
            break;
        case 'PersonalData':
            $('#personaldata-birthday-day').val(userData.birth.day).trigger('change');
            $('#personaldata-birthday-month').val(userData.birth.month).trigger('change');
            $('#personaldata-birthday-year').val(userData.birth.year).trigger('change');

            SelectByText('#personaldata-genre', userData.genre);
            SelectByText('#personaldata-country', userData.country);
            SelectByText('#personaldata-nationality', userData.nationality);

            if (userData.foreigner) {
                $('#personaldata-spain-residence-false').trigger('click');
            }

            $('#personaldata-birthday-place').val(userData.birth.place).trigger('change');
            $('#personaldata-expiration-day').val(userData.expiration.day).trigger('change');
            $('#personaldata-expiration-month').val(userData.expiration.month).trigger('change');
            $('#personaldata-expiration-year').val(userData.expiration.year).trigger('change');
            break;
        case 'ContactData':
            SelectByText('.autocompleteVia', 'Acera');
            $('#street').val('Calle').trigger('change');
            $('#street-number').val('1').trigger('change');
            $('#stairs').val('esc').trigger('change');
            $('#floor').val('1').trigger('change');
            $('#door').val('1').trigger('change');
            $('#postalcode').val(userData.postalCode).trigger('change');
            $('#city').val(userData.city).trigger('change');
            if (!userData.foreigner) {
                $('#province').val(userData.province).trigger('change');
            }
            SelectByText('#country', userData.country);
            break;
        case 'CoownerData':
        case 'AuthorizedData':
        case 'BeneficiaryData':
        case 'CoInheritorData':
        case 'UsufructuaryData':
        case 'TutorData':
        case 'AgentData':
            $('#personaldata-coowner-name').val(userData.name).trigger('change');
            $('#personaldata-coowner-surname').val(userData.firstSurname).trigger('change');
            $('#personaldata-coowner-secondsurname').val(userData.secondSurname).trigger('change');
            $('#personaldata-coowner-birthday-day').val(userData.birth.day).trigger('change');
            $('#personaldata-coowner-birthday-month').val(userData.birth.month).trigger('change');
            $('#personaldata-coowner-birthday-year').val(userData.birth.year).trigger('change');
            SelectByText('#personaldata-coowner-sex', userData.genre);
            $('#personaldata-coowner-dni').val(rand_dni()).trigger('change');
            $('#personaldata-coownner-expiration-day').val(userData.expiration.day).trigger('change');
            $('#personaldata-coownner-expiration-month').val(userData.expiration.month).trigger('change');
            $('#personaldata-coownner-expiration-year').val(userData.expiration.year).trigger('change');
            SelectByText('#personaldata-coowner-country', userData.country);
            SelectByText('#personaldata-coowner-nationality', userData.nationality);
            if (userData.foreigner) {
                $('#personaldata-spain-residence-false').trigger('click');
            }
            // $('#personaldata-birthday-place').val(userData.birth.place).trigger('change');
            // Se ha usado la función de knockout para la ciudad de nacimiento ya que knockout no actualizaba el cambio de valor y trigger a traves de javascript
            vm.CurrentEditApplicant().ApplicantPersonalData().BornPlace(userData.birth.place);

            $('#personaldata-coowner-email').val(userData.email).trigger('change');
            $('#personadata-coowner-mobilephone').val(userData.mobilePhone).trigger('change');
            $('#fiscaladdress-check-2').trigger('click');
            $('#fiscaladdress-check-6').trigger('click');            
            break;
        case 'OperationData':
            $('#operation-type-1').trigger('click');
            $('#operation-type-2').trigger('click');
            setTimeout(function () {
                $('#operation-type-1').trigger('click');
                $('#operation-type-2').trigger('click');
                $('#suscripcion-paymenttype-transfer').trigger('click');
                $('#suscripcion-amount').val('150').trigger('change');
                $('#aportacion-amount').val('150').trigger('change');
            }, 1000);
            break;
        case 'OperationIbanData':
        case 'OperationIbanAssistedData':
            if (userData.foreigner) {
                $('#refund-iban-input').val('DE89370400440532013000').trigger('change');
                $('#accept-refund-iban-check').trigger('click');
            } else {
                $('#refund-iban-input').val('ES7500654255101893600574').trigger('change');
                $('#accept-refund-iban-check').trigger('click');
            }
            break;
        case 'TestData1':
            $('#confirm-check').trigger('click');
            SelectByText('#occupation-type', 'Desempleado');
            $('#sector-answer145').trigger('click');
            SelectByText('#cargo-select', 'Autónomo');
            SelectByText('#is-public-person', 'No');
            SelectByText('#is-ong-person', 'No');
            $('#origin-answer109').trigger('click');
            $('#annual-answer225').trigger('click');
            break;
        case 'TestData1Extranjero':
            $('#confirm-check').trigger('click');
            SelectByText('#fiscal-residence-type', 'DNI/Equivalente');
            $('#fiscal-residence-expiration-day').val(userData.expiration.day).trigger('change');
            $('#fiscal-residence-expiration-month').val(userData.expiration.month).trigger('change');
            $('#fiscal-residence-expiration-year').val(userData.expiration.year).trigger('change');
            $('#fiscal-residence-identification').val('X1X1X1X1').trigger('change');
            SelectByText('#occupation-type', 'Desempleado');
            $('#sector-answer145').trigger('click');
            SelectByText('#cargo-select', 'Autónomo');
            SelectByText('#is-public-person', 'No');
            SelectByText('#is-ong-person', 'No');
            $('#origin-answer109').trigger('click');
            $('#annual-answer225').trigger('click');
            break;
        case 'TestData1Juridica':
            SelectByText('#entity-type', 'Sociedad o Comunidad de Bienes');
            $('#investment-owner124').trigger('click');
            SelectByText('#percentage-country', 'España');
            $('sector-answer174').trigger('click');
            $('#fatca-answer127').trigger('click');
            $('#fatca-subanswer1045').trigger('click');
            $('#annual-answer193').trigger('click');
            $('#annual-answer197').trigger('click');
            $('#annual-answer201').trigger('click');
            $('#annual-answer229').trigger('click');
            $('#annual-answer205').trigger('click');
            $('#real-owner .plus').trigger('click');
            setTimeout(function () {
                $('#personaldata-coowner-nif-real-owner').val(rand_dni()).trigger('change');
                $('#personaldata-coowner-name-real-owner').val(userData.name).trigger('change');
                $('#personaldata-coowner-first-surname-real-owner').val(userData.name).trigger('change');
                $('#personaldata-coowner-second-surname-real-owner').val(userData.name).trigger('change');
                $('#personaldata-coowner-percentage-real-owner').val('25').trigger('change');
                $("div#real-owner a[title='Continuar']")
            }, 1000);
            SelectByText('#is-public-person', 'No');
            SelectByText('#is-ong-person', 'No');
            break;
        case 'TestData2':
            SelectByText('#f-conveniencia-exp', 'a) Mi trabajo no está relacionado profesionalmente con Mercados de Valores.');
            SelectByText('#f-conveniencia-exp', 'a) Sin estudios o no consta.');
            $('input[name="f-conveniencia-operaciones"]')[0].click();
            break;
        default:
            console.log('Mocked step not implemented: ', step);
    }
}

function SelectByText(id, text) {
    $(id + " option").filter(function () {
        //may want to use $.trim in here
        return $(this).text() == text;
    }).prop('selected', true).trigger('change');
}


function formatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

function charDNI(dni) {
    var chain = "TRWAGMYFPDXBNJZSQVHLCKET";
    var pos = dni % 23;
    var letter = chain.substring(pos, pos + 1);
    return letter;
}

function rand_dni() {
    var num = Math.floor((Math.random() * 100000000));
    var sNum = formatNumberLength(num, 8);
    return sNum + charDNI(sNum);
}

function rand_cif_sa() {
    var number = formatNumberLength(Math.floor(Math.random() * 10000000), 7);
    var evenSum = 0;
    var oddSum = 0;

    for (var i = 0; i < number.length; i++) {
        var digit = parseInt(number.charAt(i));
        if ((i + 1) % 2 === 0) {
            evenSum += digit;
        } else {
            var doubled = digit * 2;
            oddSum += Math.floor(doubled / 10) + (doubled % 10);
        }
    }

    var total = evenSum + oddSum;
    var controlDigit = (10 - (total % 10)) % 10;

    return 'A' + number + controlDigit;
}

var mockedCorporation = { name: 'PruebasJuridica', email: 'rnaval+cld@bestinver.es', mobilePhone: '636314942' }
var mockedUsers = [
    { id: '0', name: 'Roberto', firstSurname: 'PrimerApellido', secondSurname: '', email: 'rnaval+cld@encamina.com', mobilePhone: '636314942', foreigner: false, genre: 'Hombre', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2027', } },
    { id: '1', name: 'Victor', firstSurname: 'PrimerApellido', secondSurname: '', email: 'vlainez@encamina.com', mobilePhone: '630856379', foreigner: false, genre: 'Hombre', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2027', } },
    { id: '2', name: 'Maite', firstSurname: 'PrimerApellido', secondSurname: '', email: 'rnaval@encamina.com', mobilePhone: '645836697', foreigner: false, genre: 'Mujer', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2027', } },
    { id: '3', name: 'Monica', firstSurname: 'PrimerApellido', secondSurname: '', email: 'rnaval@encamina.com', mobilePhone: '645836697', foreigner: false, genre: 'Mujer', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2027', } },
    { id: '4', name: 'Cristina', firstSurname: 'PrimerApellido', secondSurname: '', email: 'cpueyo@encamina.com', mobilePhone: '657376791', foreigner: false, genre: 'Mujer', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2050', } },   
    { id: '5', name: 'Jake', firstSurname: 'Muller', secondSurname: 'Extranjero', email: 'test@encamina.com', mobilePhone: '666666666', foreigner: true, genre: 'Hombre', country: 'Alemania', nationality: 'Alemana', province: '', city: 'Munich', postalCode: 80331, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2027', } },
    { id: '6', name: 'Andres', firstSurname: 'PrimerApellido', secondSurname: '', email: 'agil@encamina.com', mobilePhone: '678657780', foreigner: false, genre: 'Hombre', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2027', } },
    { id: '7', name: 'Carlos', firstSurname: 'PrimerApellido', secondSurname: '', email: 'ccampayo@encamina.com', mobilePhone: '691416672', foreigner: false, genre: 'Hombre', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2027', } },
    { id: '8', name: 'Anna', firstSurname: 'PrimerApellido', secondSurname: '', email: 'ablyumina@encamina.com', mobilePhone: '685863888', foreigner: false, genre: 'Mujer', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2027', } },
    { id: '9', name: 'David', firstSurname: 'PrimerApellido', secondSurname: '', email: 'dduyn@encamina.com', mobilePhone: '628685787', foreigner: false, genre: 'Hombre', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2050', } },
    { id: '10', name: 'Juan', firstSurname: 'PrimerApellido', secondSurname: '', email: 'jromero@encamina.com', mobilePhone: '605094107', foreigner: false, genre: 'Hombre', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2050', } },
    { id: '11', name: 'Julio', firstSurname: 'PrimerApellido', secondSurname: '', email: 'jpalacios+cld@encamina.com', mobilePhone: '664411639', foreigner: false, genre: 'Hombre', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2050', } },
    { id: '12', name: 'Diego', firstSurname: 'PrimerApellido', secondSurname: '', email: 'dcrespo+cld@encamina.com', mobilePhone: '695223213', foreigner: false, genre: 'Hombre', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2050', } },
    { id: '13', name: 'Ivan', firstSurname: 'PrimerApellido', secondSurname: '', email: 'igonzalo+cld@encamina.com', mobilePhone: '683506152', foreigner: false, genre: 'Hombre', country: 'España', nationality: 'Española', province: 'Madrid', city: 'Madrid', postalCode: 28015, birth: { day: '01', month: '01', year: '1995', place: 'Madrid' }, expiration: { day: '01', month: '01', year: '2050', } },
];

const cookieDebuggerName = 'dbggrGA';

function setDebuggerCookie(value) {
    var days = 30;
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = cookieDebuggerName + "=" + (value || "") + expires + "; path=/";
}
function getDebuggerCookie() {
    var nameEQ = cookieDebuggerName + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseDebuggerCookie() {
    document.cookie = cookieDebuggerName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
