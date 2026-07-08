var eventTemplateControl = "EventList";
var templateControl = "TemplateList";
var firstRun = false;
var rows_selected = [];
var client_selected = [];
var table = null;
var dataList = [];
var allClients = [];
var errorGeneratedDocuments = [];
var excludedClients = [];
var countClients = 0;
var selectedClients = [];
var executionId = 0;
var checkAllClientsFill = false;

$(document).ready(function () {
    loadFilters();
});

//#region General

function fillDropDownList(controlId, list) {
    cleanDropDownList(controlId);
    var select = document.getElementById(controlId);
    if (select != null && select != undefined) {
        list.forEach(function(marketer) {
            var option = document.createElement("option");
            option.value = marketer.value;
            option.innerHTML = marketer.text;
            select.appendChild(option);
        });
    }
}

function cleanDropDownList(controlId) {
    var select = document.getElementById(controlId);
    var options = select.getElementsByTagName('option');
    $(options).each(function (index, option) {
        if (option.value != '') {
            select.removeChild(option);
        }
    });
}

function getProductSelected() {
    var idProduct = $('#ProductList').val();
    var productName = getName("ProductList");

    return {
        productId: idProduct,
        productName: productName
    };
}

function getTemplateSelected() {
    var idTemplate = $('#TemplateList').val();
    var templateName = getName("TemplateList");

    return {
        templateId: idTemplate,
        templateName: templateName
    };
}

function getName(controlId) {
    return $("#" + controlId + " [value='" + $('#' + controlId + '').val() + "']").text();
}

function callbackError(error) {
    alert("Error al realizar la llamada.");
}

function llamadaAjax(url, type, parameters, callback, errorCallback) {
    $.ajax({
        type: type,
        url: url,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(parameters),
        success: function (result) {
            callback(result);
        },
        error: function (error) {
            errorCallback(error);
        }
    });
}

function loadDropDownList(controlId, templates) {
    cleanDropDownList(controlId);
    var select = document.getElementById(controlId);
    templates.forEach(function(template) {
        var option = document.createElement("option");
        option.value = template.value;
        option.innerHTML = template.text;
        select.appendChild(option);
    });
}

function cleanDropDownList(controlId) {
    var select = document.getElementById(controlId);
    if (select != null && select != undefined) {
        var options = select.getElementsByTagName('option');
        $(options).each(function (index, option) {
            if (option.value != '') {
                select.removeChild(option);
            }
        });
    }
}

function enableButton(buttonId) {
    $("#" + buttonId).removeAttr("disabled");
}

function disableButton(buttonId) {
    $("#" + buttonId).prop("disabled", true);
}

function getFilters() {
    return {
        ProductId: $("#ProductList").val(),
        TemplateId: $("#TemplateList").val(),
        EventTemplateId: $("#EventList").val(),
        NIF: $("#NifNiePasaporte").val(),
        NameSurname: $("#NameSurname").val(),
        MarketerId: $("#MarketerList").val(),
        Segment: $("#Segment").val(),
    };
}

function RemoveFilters() {
    $("#NifNiePasaporte").val("");
    $("#NameSurname").val("");
    $("#Segment").val("");
    $("#MarketerList").val("");
}

function ShowModal(id) {
    $("#" + id).modal({ backdrop: 'static', keyboard: false });
}

function HideModal(id) {
    $("#" + id).modal('hide');
}

//#endregion

//#region Filters

$('#ProductList').on('change', function () {
    var product = getProductSelected();
    if (product.productId == "") {
        disableButton("btnLoadData");
        disableButton("btnRemoveFilters");
        cleanDropDownList(templateControl);
    } else {
        loadTemplates(product.productId, product.productName);
    }
});

$('#TemplateList').on('change', function () {
    var template = getTemplateSelected();
    if (template.templateId == "") {
        disableButton("btnLoadData");
        disableButton("btnRemoveFilters");
        cleanDropDownList(eventTemplateControl);
    } else {
        loadEventsTemplates(template.templateId);
    }
});

$('#EventList').on('change', function () {
    if ($('#EventList').val() == "") {
        disableButton("btnLoadData");
        disableButton("btnRemoveFilters");
    }
    else {
        enableButton("btnLoadData");
        enableButton("btnRemoveFilters");
    }
});

$('#btnClearClients').on('click', function () {
    bootbox.confirm("Se va a perder toda la selección", function (result) {
        if (result) {
            client_selected = [];
            $('#client-count').text(client_selected.length == 0 ? '' : client_selected.length);
            $('#btnClearClients').hide();
            loadSearchResultsTable(event);
        }
    });
});

function loadFilters() {
    loadMarketer();
}

function loadMarketer() {
    var url = 'Communications/GetDistributor';
    llamadaAjax(url, "GET", null, callbackLoadMarketer, callbackError);
}

function callbackLoadMarketer(marketers) {
    fillDropDownList("MarketerList", marketers);
}

function loadTemplates(productId, productName) {
    var url = 'Communications/GetTemplatesCommunications?productName=' + productName + '&productId=' + productId;
    llamadaAjax(url, "GET", null, callbackloadTemplates, callbackError);
}

function callbackloadTemplates(result) {
    loadDropDownList("TemplateList", result);
}

function callbackLoadEvents(result) {
    loadDropDownList("EventList", result);
}

function loadEventsTemplates(templateId) {
    var url = 'Communications/GetEventsTemplate?templateId=' + templateId;
    llamadaAjax(url, "GET", null, callbackLoadEvents, callbackError);
}

//#endregion

//#region DataTable

window.columnsTableClients = [
    {
        "data": "0",
        "autoWidth": true,
        "orderable": false,
        "render": function (data, type, full, meta) {
            var result = "<div class='row'>";

            result = "<div class='col-md-4'><input type='checkbox' id='checkbox_" + full[0] + "_" + full[5] + "'></span></div>";

            return result + "</div>";
        },
    },//Checkbox
    { "data": "1", "autoWidth": true, "orderable": true },//NIF
    { "data": "2", "autoWidth": true, "orderable": false },//Name Surname
    { "data": "3", "autoWidth": true, "orderable": false },//Id Account
    { "data": "4", "autoWidth": true, "orderable": false },//Marketer
    { "data": "5", "autoWidth": true, "orderable": false },//Segment
    {
        "orderable": false,
        "render": function (data, type, full, meta) {
            var result = "<div class='row'>";
            result = "<div class='col-md-4'><button type='button' class='btn btn-info btn-sm RepreShowDoc' title='Previsualizar' onclick='previewPDF(" + full[0] + ", " + full[3] + ")'><span class='fas fa-file-alt'></span></button></div>";

            return result + "</div>";
        },
    }
]

function fixDatatableStyles() {
    $('ul.pagination li').removeClass("paginate_button");
}

function loadSearchResultsTable(event) {
    event.preventDefault();

    checkAllClientsFill = false; 
    firstRun = false;

    if ($("#ProductList").val() == "" || $("#TemplateList").val() == "" || $("#EventList").val() == "") {
        toastr.error('No se puede cargar los datos debido a que alguno de los filtros obligatorios están vacios.', '', { timeOut: 3000 });
        return;
    }

    $("#searchLoader").show();
    $("#searchResult").hide();
    $("#LinkSharedFolder").hide();
    disableButton("btnGenerateDocuments");

    getAllDataTable();
    
    if ($.fn.dataTable.isDataTable('#client-list')) {
        table.destroy();
        table = getTable();
    } else {
        table = getTable();
    }

    $('#filterForm .dt-buttons a').attr("role", "button");
    $('#filterForm .dt-buttons a').prepend("<span class='fas fa-download-alt'></span>");
}

function getAllDataTable() {
    var url = 'Communications/GetAllClients?productId=' + $("#ProductList").val() + '&templateId=' + $("#TemplateList").val() + '&eventId=' + $("#EventList").val() + '&nifNiePasaporte=' + $("#NifNiePasaporte").val() + '&nameSurname=' + $("#NameSurname").val() + '&marketerId=' + $("#MarketerList").val() + '&segment=' + $("#Segment").val();
    llamadaAjax(url, "GET", null, callbackGetAllDataTable, callbackError);
}

function callbackGetAllDataTable(result) {
    allClients = result;
    getAccountIds(result);
    checkAllClientsFill = true;
}

function getAccountIds(clientList) {
    excludedClients = [];
    for (var i = 0; i < clientList.length; i++) {
        excludedClients.push(clientList[i].idAccount);
    }
}

function getTable() {
    var formData = $('#filterForm').serializeArray();
    
    rows_selected = [];
    table = $('#client-list').DataTable({
        pageLength: 10,
        lengthMenu: [10, 25, 50],
        bServerSide: true,
        sAjaxSource: routeConfig.ClientsCommunications_LoadDataTable,
        sServerMethod: "POST",
        fnServerParams: function (aoData) {
            aoData.push({ 'name': 'ProductIdSelected', 'value': $("#ProductList").val() });
            aoData.push({ 'name': 'TemplateIdSelected', 'value': $("#TemplateList").val() });
            aoData.push({ 'name': 'EventIdSelected', 'value': $("#EventList").val() });
            aoData.push({ 'name': 'NifNiePasaporte', 'value': $("#NifNiePasaporte").val() });
            aoData.push({ 'name': 'NameSurname', 'value': $("#NameSurname").val() });
            aoData.push({ 'name': 'MarketerIdSelected', 'value': $("#MarketerList").val() });
            aoData.push({ 'name': 'Segment', 'value': $("#Segment").val() });
        },
        bProcessing: true,
        fixedColumns: true,
        order: [[1, 'desc']],
        filter: false,

        "columns": columnsTableClients,

        "drawCallback": function (settings) {    
            if (settings.aoData.length == 0) {
                disableButton("btnGenerateDocuments");
            }
            else {
                enableButton("btnGenerateDocuments");
            }
        }
    });

    $('#client-list').on('draw.dt', function () {
        $("[id^=checkbox_]").each(function (index, chkbox) {
            if (firstRun && client_selected.length > 0) {
                var id = $(chkbox).attr("id");
                id = id.substr("checkbox_".length);
                id = id.substr(0, id.indexOf("_"));
                var selected = client_selected.filter(function(x) {
                    return parseInt(x.id, 10) == parseInt(id, 10);
                });
                console.log("Id: " + id + " - Selected: " + selected);
                if (selected == null || selected == undefined || selected == "") {
                    $(chkbox).removeAttr("checked");
                }
                else {
                    $(chkbox).attr("checked", "checked");
                }
            }
        });
    });

    if (!firstRun) {        

        $('#client-list tbody').on('click', 'input[type="checkbox"]', function (e) {
            var $row = $(this).closest('tr');

            // Get row data
            var data = table.row($row).data();

            // Get row Id
            var rowId = data[0];

            // Determine whether row Id is in the list of selected row IDs
            var index = $.inArray(rowId, rows_selected);

            // If checkbox is checked and row Id is not in list of selected row IDs
            if (this.checked && index === -1) {
                rows_selected.push(rowId);
                // Otherwise, if checkbox is not checked and row Id is in list of selected row IDs
            } else if (!this.checked && index !== -1) {
                rows_selected.splice(index, 1);
            }

            var filters = getFilters();
            var objData = {
                eventTemplateId: filters.EventTemplateId,
                id: data[0],
                idAccount: data[3],
                marketer: data[4],
                marketerId: 0,
                nameSurname: data[2],
                nif: data[1],
                productId: filters.ProductId,
                segment: data[5],
                templateId: filters.TemplateId
            };

            if (this.checked) {
                $($row).find("input:checkbox").first().attr("checked", "checked");
                $row.addClass('selected');
                AddClientDataToProccess(objData);
            } else {
                $($row).find("input:checkbox").first().removeAttr("checked");
                $row.removeClass('selected');
                RemoveClientDataToProccess(objData);
            }

            // Update state of "Select all" control
            updateDataTableSelectAllCtrl(table);

            // Prevent click event from propagating to parent
            e.stopPropagation();
        });

        // Handle click on "Select all" control
        $('thead input[name="select_all"]', table.table().container()).on('click', function (e) {
            if (this.checked) {
                $('#client-list tbody input[type="checkbox"]:not(:checked)').trigger('click');
                allClients.forEach(function (data) {
                    setTimeout(function () { AddClientDataToProccess(data); }, 100);
                });
            } else {
                $('#client-list tbody input[type="checkbox"]:checked').trigger('click');
                allClients.forEach(function (data) {
                    setTimeout(function () { RemoveClientDataToProccess(data); }, 100);
                });
            }


            // Prevent click event from propagating to parent
            e.stopPropagation();
        });

        table.on('draw', function () {
            // Update state of "Select all" control
            updateDataTableSelectAllCtrl(table);
        });


        table.on('xhr', function (e, settings, json) {
            var intervalId = setInterval(function () {
                if (checkAllClientsFill == true) {
                    $("#searchResult").show();
                    $("#searchLoader").hide();
                    window.clearInterval(intervalId);
                }
            }, 1000);
        });
        console.log("!firstRun");
    }

    firstRun = true;

    return table;
}

function updateDataTableSelectAllCtrl(table) {
    var $table = table.table().node();
    var $chkbox_all = $('tbody input[type="checkbox"]', $table);
    var $chkbox_checked = $('tbody input[type="checkbox"]:checked', $table);
    var chkbox_select_all = $('thead input[name="select_all"]', $table).get(0);

    // If none of the checkboxes are checked
    if ($chkbox_checked.length === 0) {
        chkbox_select_all.checked = false;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }

        // If all of the checkboxes are checked
    } else if ($chkbox_checked.length === $chkbox_all.length) {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }

        // If some of the checkboxes are checked
    } else {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = true;
        }
    }
}

function AddClientDataToProccess(data) {
    var exists = client_selected.some(
        function (elem) {
            return parseInt(elem.id, 10) === parseInt(data.id, 10) && parseInt(elem.idAccount, 10) === parseInt(data.idAccount, 10);
        }
    );
    
    if (!exists) {
        client_selected.push(data);
        $('#client-count').text(client_selected.length == 0 ? '' : client_selected.length);
        $("#btnClearClients").show();
    }

    var index = excludedClients.indexOf(parseInt(data.idAccount, 10));
    if (index > -1) {
        excludedClients.splice(index, 1);
    }
}

function RemoveClientDataToProccess(data) {
    var found = client_selected.find(
        function (elem) {
            return parseInt(elem.id, 10) === parseInt(data.id, 10) && parseInt(elem.idAccount, 10) === parseInt(data.idAccount, 10);
        }
    );
    
    if (found != undefined) {
        var index = client_selected.indexOf(found);
        client_selected.splice(index, 1);
        $('#client-count').text(client_selected.length == 0 ? '' : client_selected.length);
        if (client_selected.length == 0) {
            $("#btnClearClients").hide();
        }

        excludedClients.push(found.idAccount);
    }
}

//#endregion

//#region Generate documents

function GenerateDocuments() {
    dataList = client_selected;
    $("#LinkSharedFolder").hide();
    var maxClientsToGenerateDocuments = $("#MaxClientsToGenerate").val();
    if (dataList.length > maxClientsToGenerateDocuments) {
        toastr.error('No se puede superar el número máximo de clientes (' + maxClientsToGenerateDocuments + ') para generar documentos.', '', { timeOut: 3000 });
        return;
    }
    if (dataList.length == 0) {
        toastr.error('Se debe seleccionar al menos un cliente para generar las comunicaciones.', '', { timeOut: 3000 });
        return;
    }
    var checkFilterAndSelected = true;
    dataList.forEach(function (data) {
        var filtered = allClients.filter(function (value) {
            return parseInt(value.id, 10) == parseInt(data.id, 10) && parseInt(value.idAccount, 10) === parseInt(data.idAccount, 10);
        });
        if (filtered == null || filtered.length == 0) {
            checkFilterAndSelected = false;
            
        }
    });
    if (checkFilterAndSelected == false) {
        toastr.error('Los clientes seleccionados no coinciden con los filtros realizados.', '', { timeOut: 3000 });
        return;
    }
    $("#DocumentsGeneratedModal .modal-footer .btn-default").hide();
    document.getElementById("DocumentsGeneratedInfo").innerHTML = "Inicializando proceso de generación de comunicaciones...";
    ShowModal("DocumentsGeneratedModal");
    var url = 'Communications/InitializeGenerateDocuments';
    var template = getTemplateSelected();
    var parameters = "?idEvent=" + $("#EventList").val() + "&idProduct=" + $("#ProductList").val() + "&idDistributor=" + $("#MarketerList").val() + "&segment=" + $("#Segment").val() + "&excludedClients=" + getExcludedClients() + "&documentNumber=" + $("#NifNiePasaporte").val() + "&completeName=" + $("#NameSurname").val() + "&templateId=" + template.templateId;
    llamadaAjax(url + parameters, "POST", null, callbackInitializeGenerateDocuments, errorCallbackInitializeGenerateDocuments);
}

function callbackInitializeGenerateDocuments(result) {
    if (result.returnValue == 0) {
        dataList.forEach(function (element) {
            selectedClients.push(element);
        });
        document.getElementById("DocumentsGeneratedInfo").innerHTML = "Generando " + countClients + " de " + dataList.length + " documento(s).";
        
        errorGeneratedDocuments = [];
        executionId = result.idExecution;
        GenerateDocument();
    }
    else {
        $("#DocumentsGeneratedModal .modal-footer .btn-default").show();
        toastr.error(result.returnMessage, '', { timeOut: 3000 });
    }
}

function errorCallbackInitializeGenerateDocuments(error) {
    $("#DocumentsGeneratedModal .modal-footer .btn-default").show();
    toastr.error('Se ha producido un error al generar los documentos.', '', { timeOut: 3000 });
}

function GenerateDocument() {
    if (selectedClients.length > 0) {
        countClients++;
        document.getElementById("DocumentsGeneratedInfo").innerHTML = "Generando " + countClients + " de " + dataList.length + " documento(s).";
        var client = getNextClientSelected();
        var clientId = client.id;
        var accountId = client.idAccount;
        var documentNumber = client.nif;
        var url = 'Communications/GenerateDocuments?clientId=' + clientId + '&templateId=' + $("#TemplateList").val() + '&eventId=' + $("#EventList").val() + '&templateName=' + getTemplateSelected().templateName + '&productId=' + $("#ProductList").val() + '&productName=' + getProductSelected().productName + '&executionId=' + executionId + '&accountId=' + accountId + '&documentNumber=' + documentNumber;
        llamadaAjax(url, "POST", null, callbackGenerateDocuments, errorCallbackGenerateDocuments);
    }
    else {
        var filesGenerated = parseInt(dataList.length, 10) - parseInt(errorGeneratedDocuments.length, 10);
        // Actualizar tablas de logs.
        var url = 'Communications/UpdateInfoGenerated?idExecution=' + executionId + '&numDocsGenerated=' + filesGenerated + "&numClientsSelected=" + client_selected.length;
        llamadaAjax(url, "POST", null, callbackUpdateInfoGenerated, errorCallbackUpdateInfoGenerated);

        // Mostrar ventana modal indicando el resultado de la generación de ficheros.
        document.getElementById("DocumentsGeneratedInfo").innerHTML = "Se han generado " + filesGenerated + " documentos.";
        $("#DocumentsGeneratedModal .modal-footer .btn-default").show();
        $("#LinkSharedFolder").show();
        countClients = 0;
    }
}

function callbackUpdateInfoGenerated(result) {

}

function errorCallbackUpdateInfoGenerated(error) {
    if (error.status == 200) { return; }
    toastr.error('Se ha producido un error al actualizar la información.', '', { timeOut: 3000 });
}

function getNextClientSelected() {
    var clientId = selectedClients[0];
    selectedClients.splice(0, 1);
    return clientId;
}

function callbackGenerateDocuments(result) {
    if (result.generated == false) {
        errorGeneratedDocuments.push(result.errorMessage);
    }
    GenerateDocument();
}

function errorCallbackGenerateDocuments(error) {
    toastr.error('Se ha producido un error al generar los documentos.', '', { timeOut: 3000 });
    errorGeneratedDocuments.push(error);
    GenerateDocument();
}

function getExcludedClients() {
    return excludedClients.join("|");
}

function previewPDF(clientId, accountId) {
    var product = getProductSelected();
    var template = getTemplateSelected();
    var row = $("[id^=checkbox_" + clientId + "_]").parents("tr");
    var documentNumber = $(row).find("td")[1].innerHTML;
    var url = "./Communications/PreviewTemplate?clientId=" + clientId + "&accountId=" + accountId + "&eventId=" + $("#EventList").val() + "&productId=" + product.productId + "&documentNumber=" + documentNumber + "&productName=" + product.productName + "&templateId=" + template.templateId + "&templateName=" + template.templateName + "&distributorId=" + $("#MarketerList").val() + "&segment=" + $("#Segment").val();
    downloadFile(url, "GET", callbackPreviewPDF, callbackErrorPreviewPDF);
}

function callbackPreviewPDF(text) {
    var downloadLink = document.createElement('a');

    downloadLink.href = 'data:application/pdf;base64,' + text;
    downloadLink.download = getTemplateSelected().templateName;
    downloadLink.click();
}

function callbackErrorPreviewPDF(error) {
    toastr.error('Se ha producido un error al genera el documento.', '', { timeOut: 3000 });
}

function downloadFile(url, type, callback, callbackError) {
    $.ajax({
        type: type,
        url: url,
        success: function (text) {
            callback(text);
        }, error: function (error) {
            callbackError(error);
        }
    });
}

//#endregion Generate documents