function DeleteTemplate() {
    event.preventDefault();
    var templateName = $('#TemplateList option:selected').text();
    var productName = getProductName();
    var productId = $('#ProductList').val();
    var url = '/TemplateMaintenanceCommunications/DeleteTemplate?templateName=' + templateName + '&productName=' + productName + '&productId=' + productId;

    $.ajax({
        type: "DELETE",
        url: url,
        success: function (result) {
            if (result) {
                $('#TemplateList option:selected').remove();
                if ($('#TemplateList').val() == '') { disabledOrEnableButtons(true); }
                cleanFields();
            }
            else { alert("Error al borrar plantilla") }
        },
        error: function () {
            alert("Error al realizar la llamada")
        }
    });
}


$(document).ready(function () {

    $('#btnConfirmDeleteTemplate').on('click', function (e) {
        e.preventDefault();
        $('#CancelOperationModal').modal('show');
    });



    $('#ConfirmCancelOperation').on('click', function (e) {
        e.preventDefault();
        DeleteTemplate();
        $('#CancelOperationModal').modal('hide');
    });

});


$(document).ready(function () {
    
});

function DownloadTemplate() {
    event.preventDefault();
    var templateName = $('#TemplateList option:selected').text();
    var productName = getProductName();
    var url = '/TemplateMaintenanceCommunications/DownloadTemplate?templateName=' + templateName + '&productName=' + productName;



    $.ajax({
        type: "GET",
        url: url,
        success: function (text) {
            var downloadLink = document.createElement('a');

            downloadLink.href = 'data:application/pdf;base64,' + text;
            downloadLink.download = templateName;
            downloadLink.click();
        }, error: function (error) {
            alert("Error al realizar la llamada.");
        }
    });
}

$('#ProductList').on('change', function () {
    cleanFields();
    var idProduct = $('#ProductList').val();
    var productName = getProductName();
    document.getElementById("ProductSelectedControl").value = idProduct;
    document.getElementById("ProductNameSelectedControl").value = productName;
    if (idProduct == "") {
        cleanTemplatesDropDownList();
    } else {
        loadTemplates(idProduct, productName);
    }
});

function getProductName() {
    return $("#ProductList [value='" + $('#ProductList').val() + "']").text();
}

$('#TemplateList').on('change', function () {
    loadFieldsTemplate();
});

function loadTemplates(productId, productName) {
    var url = 'TemplateMaintenanceCommunications/GetTemplates?productName=' + productName + '&productId=' + productId;
    $.ajax({
        type: "GET",
        url: url,
        success: function (result) {
            loadTemplatesDropDownList(result);
        },
        error: function () {
            alert("Error al realizar la llamada.");
        }
    });
}

function loadTemplatesDropDownList(templates) {
    cleanTemplatesDropDownList();
    var select = document.getElementById("TemplateList");
    templates.forEach(function(template) {
        var option = document.createElement("option");
        option.value = template.value;
        option.innerHTML = template.text;
        select.appendChild(option);
    });
}

function cleanTemplatesDropDownList() {
    var select = document.getElementById("TemplateList");
    var options = select.getElementsByTagName('option');
    $(options).each(function(index, option) {
        if (option.value != '') {
            select.removeChild(option);
        }
    });
}

function disabledOrEnableButtons(disabled) {
    $('#btnDownload').prop('disabled', disabled);
    $('#btnTemplateTest').prop('disabled', disabled);
    $('#btnConfirmDeleteTemplate').prop('disabled', disabled);
}

function loadFieldsTemplate() {
    if ($('#TemplateList').val() != '') {

        disabledOrEnableButtons(false);

        var productName = getProductName();
        var templateName = $('#TemplateList option:selected').text();
        var url = '/TemplateMaintenanceCommunications/GetTemplateFields?templateName=' + templateName + '&productName=' + productName;
        console.info(url);
        $.ajax({
            type: "GET",
            url: url,
            success: function (result) {
                if (result) {
                    var tbody = document.getElementById("fieldsbody");
                    tbody.innerHTML = null;

                    $.each($(result), function (index, field) {
                        var row = tbody.insertRow();
                        var name = row.insertCell(0);
                        var type = row.insertCell(1);
                        var value = row.insertCell(2);
                        name.innerHTML = field.name;
                        var input = getValue(field.type, field.value, field.name);
                        value.appendChild(input);
                        type.innerHTML = field.type.substring(field.type.lastIndexOf('_') + 1, field.type.length);
                    });

                }
                else { alert("Error al recuperar plantilla") }
            },
            error: function () {
                alert("Error al realizar la llamada")
            }
        });
    }
    else {
        disabledOrEnableButtons(true);
        var tbody = document.getElementById("fieldsbody");
        tbody.innerHTML = null;
    }
}

function cleanFields() {
    var tbody = document.getElementById("fieldsbody");
    tbody.innerHTML = null;
}

function getValue(type, value, name) {
    var input = document.createElement("input");

    switch (type) {
        case "FIELD_TYPE_CHECKBOX":
            input.type = "checkbox";
            if (value == '') value = 'Yes';
            input.checked = value == 'Yes';
            break;
        case "FIELD_TYPE_LIST":
            break;
        case "FIELD_TYPE_NONE":
            break;
        case "FIELD_TYPE_PUSHBUTTON":
            break;
        case "FIELD_TYPE_RADIOBUTTON":
            input.type = "radio";
            input.value = value == 'Yes' ? 1 : 0;
            break;
        case "FIELD_TYPE_SIGNATURE":
            break;
        case "FIELD_TYPE_TEXT":
            input.type = "text";
            if (value == '') value = name;
            input.value = value;
            break;
        default:
            break;

    }
    return input;
}


function TestTemplate() {

    var tbl = $('#templatefields tr:has(td)').map(function (i, v) {
        var $td = $('td', this);
        var value;
        switch ($td.eq(1).text()) {
            case "CHECKBOX":
                value = $td.eq(2).children().is(":checked") ? "Yes" : "No"
                break;
            case "LIST":
                break;
            case "NONE":
                break;
            case "PUSHBUTTON":
                break;
            case "RADIOBUTTON":
                break;
            case "SIGNATURE":
                break;
            case "TEXT":
                value = $td.eq(2).children().val()
                break;
            default:
                break;
        }


        return {
            id: ++i,
            name: $td.eq(0).text(),
            type: "FIELD_TYPE_" + $td.eq(1).text(),
            value: value
        }
    }).get();

    var templateName = $('#TemplateList option:selected').text();
    var productName = getProductName();
    var url = '/TemplateMaintenanceCommunications/FillTemplate?templateName=' + templateName + '&productName=' + productName;



    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(tbl),
        contentType: 'application/json; charset=utf-8',
        success: function (text) {
            var downloadLink = document.createElement('a');

            downloadLink.href = 'data:application/pdf;base64,' + text;
            downloadLink.download = templateName;
            downloadLink.click();
        }
    });
}

$('#InUploadFile').on('change', function () {
    if ($('#InUploadFile').val() != '') {
        $('#UploadFile').prop('disabled', false);
    }
    else {
        $('#UploadFile').prop('disabled', true);
    }
});


$('#UploadFile').on('click', function () {
    $('#UploadFile').addClass('disabled');
    $('#spinner').removeClass('hide');
});










