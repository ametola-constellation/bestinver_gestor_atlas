var table = null;

$(document).ready(function () {
    loadButtonsBehavior();
    $("#searchResult").hide();
});

function loadSearchResultsTable(event) {
    event.preventDefault();
    $("#searchLoader").show();
    $("#searchResult").hide();
    
    if ($.fn.dataTable.isDataTable('#request-list')) {
        table.destroy();
        table = getTable();
    } else {
        table = getTable();
    }
    
    $('#filterForm .dt-buttons a').attr("role", "button");
    $('#filterForm .dt-buttons a').prepend("<span class='fas fa-download-alt'></span>");
}

function getTable() {
    var formData = $('#filterForm').serializeArray();
    if (formData) {
        table = $('#request-list').DataTable({
            responsive: true,
            pageLength: 25,
            lengthMenu: [10, 25, 50],
            bServerSide: true,
            sAjaxSource: routeConfig.Search_LoadDataTable,
            sServerMethod: "POST",
            fnServerParams: function (aoData) {
                var lastname = "";
                var getByName = function (a) { return a.name === formData[i].name; };
                for (var i = 0; i < formData.length; i++) {
                    var avoidarray = formData[i].name.includes('[');
                    var multiplevalues = $.grep(formData, getByName).length > 1;
                    var allow = !avoidarray && lastname !== formData[i].name;

                    if (allow) {
                        if (multiplevalues) {
                            var values = $.grep(formData, getByName);
                            var array = values.map(function (x) { return x.value; });
                            aoData.push({ 'name': formData[i].name, 'value': array });
                        } else {
                            aoData.push(formData[i]);
                        }
                    }
                    lastname = formData[i].name;
                }
            },
            bProcessing: true,
            rowCallback: function (nRow, aData, iDisplayIndex) {
                var url = routeConfig.Details_Index + "?requestID=" + aData[0];
                var template = "<a href='#URL#'>Consultar</a>";
                template = template.replace("#URL#", url);

                var typeDropdown = document.querySelector('[name="Type"]');
                if (typeDropdown!=null && typeDropdown.value === "2") {
                    var sendToRdButton = "<button class='btn btn-sm btn-primary ml-2' onclick='sendToRD(\"" + aData[0] + "\")'>Enviar a Operaciones</button>";
                    template += sendToRdButton;
                }

                $('td:eq(7)', nRow).html(template).css({"text-align": "center"});

                return nRow;
            },
            fixedColumns: true,
            order: [[1, 'desc']],
            filter: false,
            "columns": [
                { "data": "1", "autoWidth": true, "orderable": false },
                {
                    "data": "2", "autoWidth": true, "orderable": true,
                    "render": function (data) { return formatDateTime(data); }
                },
                { "data": "3", "autoWidth": true, "orderable": true },
                { "data": "4", "autoWidth": true, "orderable": true },
                { "data": "5", "autoWidth": true, "orderable": false },
                { "data": "6", "autoWidth": true, "orderable": false },
                { "data": "7", "autoWidth": true, "orderable": false },
                { "autoWidth": true, "orderable": false }
            ]
        });
    }

    table.on('xhr', function (e, settings, json) {
        $("#searchResult").show();
        $("#searchLoader").hide();
    });
    return table;
}

function loadButtonsBehavior() {
    $('#btnClearFilter').on('click', function () {
        $('#filterForm input').val('');
        $.each($('#filterForm select').not('.controlType'), function () {
            $(this).find('option:eq(0)').prop('selected', true);
        });
    });
}

function fixDatatableStyles() {
    $('ul.pagination li').removeClass("paginate_button");
}

function sendToRD(requestId) {
    var changeRequestStatusModel = {
        RequestId: requestId
    };

    var button = event.target;
    button.disabled = true;

    $.ajax({
        url: routeConfig.Details_SendToRD,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(changeRequestStatusModel),
        success: function (response) {
            if (response.result) {
                toastr.success('Solicitud enviada a Operaciones con éxito.');
            } else {
                toastr.info('Hubo un problema al enviar la solicitud a Operaciones.');
            }
        },
        error: function () {
            toastr.error('Error al intentar enviar la solicitud a Operaciones.', '', { timeOut: 3000 });
        },
        complete: function () {
            button.disabled = false;
        }
    });
}