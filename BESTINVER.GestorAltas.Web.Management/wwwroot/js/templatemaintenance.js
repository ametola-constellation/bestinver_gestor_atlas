function DeleteTemplate() {
    event.preventDefault();
    var templateName = $('#TemplateList option:selected').val();
    var url = '/TemplateMaintenance/DeleteTemplate?templateName=';

    $.ajax({
        type: "DELETE",
        url: url + templateName,
        success: function (result) {
            if (result) {
                $('#TemplateList option:selected').remove();
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
    loadFieldsTemplate();
});

function DownloadTemplate() {
    event.preventDefault();
    var templateName = $('#TemplateList option:selected').val();
    var url = '/TemplateMaintenance/DownloadTemplate?templateName=';



    $.ajax({
        type: "GET",
        url: url + templateName,
        success: function (text) {
            var downloadLink = document.createElement('a');

            downloadLink.href = 'data:application/pdf;base64,' + text;
            downloadLink.download = templateName;
            downloadLink.click();
        }
    });
}

$('select').on('change', function () {
    loadFieldsTemplate();
});

function loadFieldsTemplate() {
    if ($('select').val() != '') {

        $('#btnDownload').prop('disabled', false);
        $('#btnTemplateTest').prop('disabled', false);
        $('#btnConfirmDeleteTemplate').prop('disabled', false);

        var templateName = $('#TemplateList option:selected').val();
        var url = '/TemplateMaintenance/GetTemplateFields?templateName=';

        $.ajax({
            type: "GET",
            url: url + templateName,
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
        $('#btnDownload').prop('disabled', true);
        $('#btnTemplateTest').prop('disabled', true);
        $('#btnConfirmDeleteTemplate').prop('disabled', true);
        var tbody = document.getElementById("fieldsbody");
        tbody.innerHTML = null;
    }
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

    var templateName = $('#TemplateList option:selected').val();
    var url = '/TemplateMaintenance/FillTemplate?templateName=';



    $.ajax({
        type: "POST",
        url: url + templateName,
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









   
