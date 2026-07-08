function LogRocketHelper() { };

LogRocketHelper.valuesObfuscate = [
    "DNI", "Name", "FirstSurname", "SecondSurname","Email", "MobilePhoneNumber",
    "Id", "IdRequest", "ParentRequestID", "Username", "AgentShippingMail", "PhoneNumber", "Fax", "RdCode",
    "FiscalNumber", "UsaFiscalNumber", "PostalCode", "Province", "City", "Number", "PayerName", "IBAN", "AccountNumber",
    "MonthlyAmount", "Amount", "ParticipantAccount", "MobilePhone", "Mail", "ApplicantId", "AnversoDni",
    "ReversoDni", "LibroFamilia", "CIFSociedad", "EscriturasCertificado", "PoderesApoderados", "ElectronicIDRequestId",
    "DNIPersonaFisicaNumero", "DNIsPersonasFisicas", "Responsible", "RDIdCuenta", "Cif", "OrganizationName", "UserName",
    "requestID", "RequestId"
];

LogRocketHelper.responseSanitizer = function (response, urlApi, obfuscationValue) {
    if (response.url.toLowerCase().indexOf(urlApi) !== -1 && typeof response.body == "string") {
        try {
            var jsonBody = JSON.parse(response.body)
            response.body = LogRocketHelper.iterateJsonBody(jsonBody, obfuscationValue)
        } catch (Exception) {
            return response
        }
    }
    return response;
}

LogRocketHelper.iterateJsonBody = function(jsonBody, obfuscationValue){
    Object.entries(jsonBody).forEach(function (element) {
        if (element[1] != null && typeof (element[1]) === "object") {
            jsonBody[element] = LogRocketHelper.iterateJsonBody(element[1], obfuscationValue)
        } else {
            if (LogRocketHelper.valuesObfuscate.includes(element[0])) {
                jsonBody[element[0]] = obfuscationValue
            }
        }
    });

    return jsonBody;
}