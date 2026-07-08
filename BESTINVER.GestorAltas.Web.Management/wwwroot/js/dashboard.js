var lockedTable = null;
var pendingTable = null;
var signAlertsTable = null;
var pbcAlertsTable = null;
var incidenceAlertsTable = null;
var pendingdni = null;
var postaltable = null;

$(document).ready(function () {

    $.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
        console.log(message);
        $("#" + settings.sTableId).after("<div class='alert alert-danger' role='alert'><span class='badge badge-danger'>Se ha producido un error al cargar los datos</span></div>");
        $("#" + settings.sTableId + "_length").hide();
    };

    lockedTable = loadLockedTableBehavior();
    pendingTable = loadPendingTableBehavior();
    signAlertsTable = loadSignAlertsTableBehavior();
    pbcAlertsTable = loadPBCAlertsTableBehavior();
    incidenceAlertsTable = loadIncidenceAlertsTableBehavior();
    pendingdni = loadDniPendingTableBehavior();
    postaltable = loadPostalTableBehavior();

    //Se oculta la leyenda de resitros mostrados para este dashboard
    $('#pending-document-list_wrapper .row').last().hide();
});

function loadLockedTableBehavior() {
    lockedTable = $('#locked-list').DataTable({
        responsive: true,
        "bServerSide": true,
        "sAjaxSource": routeConfig.Dashboard_LoadLockedREquestTable,
        "bProcessing": true,
        fixedColumns: true,
        filter: false,
        "order": [[2, 'desc']],
        "columnDefs": [
            { "visible": false, "targets": 0 },
            { className: "text-center", "targets": [4, 5, 6, -1] },
            {
                "targets": 2,
                "render": function (data) { return formatDateTime(data); }
            },
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-info btn-sm'><span class='fas fa-info'></span> Atender</button>"
            },
            {
                "targets": [0, 1, 5, 6, 7, 8],
                "orderable": false
            }],
        "language": {
            "url": dataTableLang
        }
    });

    $('#locked-list tbody').on('click', 'button', function () {
        var data = lockedTable.row($(this).parents('tr')).data();
        console.log(data[2] + "'Request is: " + data[0]);
        window.location.href = routeConfig.Details_Index + "?requestID=" + data[0];
    });

    return lockedTable;
}

function loadPendingTableBehavior() {
    pendingTable = $('#pending-list').DataTable({
        responsive: true,
        "bServerSide": true,
        "sAjaxSource": routeConfig.Dashboard_LoadPendingRequestTable,
        "bProcessing": true,
        "bPaginate": true,
        fixedColumns: true,
        "order": [[2, 'desc']],
        filter: false,
        "columnDefs": [
            { "visible": false, "targets": 0 },
            { className: "text-center", "targets": [4, 5, 6, -1] },
            {
                "targets": 2,
                "render": function (data) { return formatDateTime(data); }
            },
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-info btn-sm'><span class='fas fa-info'></span> Consultar</button>"
            },
            {
                "targets": [0, 1, 5, 6, 7, 8],
                "orderable": false
            }]
    });

    $('#pending-list tbody').on('click', 'button', function () {
        var data = pendingTable.row($(this).parents('tr')).data();
        console.log(data[2] + "'Request is: " + data[0]);
        window.location.href = routeConfig.Details_Index + "?requestID=" + data[0];
    });

    return pendingTable;
}

function loadSignAlertsTableBehavior() {
    signAlertsTable = $('#sign-alerts-list').DataTable({
        responsive: true,
        "bServerSide": true,
        "sAjaxSource": routeConfig.Dashboard_LoadSignAlertsRequestTable,
        "bProcessing": true,
        "bPaginate": true,
        fixedColumns: true,
        filter: false,
        "columnDefs": [
            { "visible": false, "targets": 0 },
            { className: "text-center", "targets": [4, 5, 6, -1] },
            {
                "targets": 2,
                "render": function (data) { return formatDateTime(data); }
            },
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-info btn-sm'><span class='fas fa-info'></span> Consultar</button>"
            },
            {
                "targets": [0, 1, 5, 6, 7, 8],
                "orderable": false
            }]
    });

    $('#sign-alerts-list tbody').on('click', 'button', function () {
        var data = signAlertsTable.row($(this).parents('tr')).data();
        console.log(data[2] + "'Request is: " + data[0]);
        window.location.href = routeConfig.Details_Index + "?requestID=" + data[0];
    });

    return signAlertsTable;
}

function loadIncidenceAlertsTableBehavior() {
    incidenceAlertsTable = $('#incidence-alerts-list').DataTable({
        responsive: true,
        "bServerSide": true,
        "sAjaxSource": routeConfig.Dashboard_LoadIncidenceAlertsRequestTable,
        "bProcessing": true,
        "bPaginate": true,
        fixedColumns: true,
        "order": [[2, 'desc']],
        filter: false,
        "columnDefs": [
            { "visible": false, "targets": 0 },
            { className: "text-center", "targets": [4, 5, 6, -1] },
            {
                "targets": 2,
                "render": function (data) { return formatDateTime(data); }
            },
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-info btn-sm'><span class='fas fa-info'></span> Consultar</button>"
            },
            {
                "targets": [0, 1, 5, 6, 7, 8],
                "orderable": false
            }]
    });

    $('#incidence-alerts-list tbody').on('click', 'button', function () {
        var data = incidenceAlertsTable.row($(this).parents('tr')).data();
        console.log(data[2] + "'Request is: " + data[0]);
        window.location.href = routeConfig.Details_Index + "?requestID=" + data[0];
    });

    return incidenceAlertsTable;
}

function loadPBCAlertsTableBehavior() {
    pbcAlertsTable = $('#pbc-alerts-list').DataTable({
        responsive: true,
        "bServerSide": true,
        "sAjaxSource": routeConfig.Dashboard_LoadPBCAlertsRequestTable,
        "bProcessing": true,
        "bPaginate": true,
        fixedColumns: true,
        "order": [[2, 'desc']],
        filter: false,
        "columnDefs": [
            { "visible": false, "targets": 0 },
            { className: "text-center", "targets": [4, 5, 6, -1] },
            {
                "targets": 2,
                "render": function (data) { return formatDateTime(data); }
            },
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-info btn-sm'><span class='fas fa-info'></span> Consultar</button>"
            },
            {
                "targets": [0, 1, 5, 6, 7, 8],
                "orderable": false
            }]
    });

    $('#pbc-alerts-list tbody').on('click', 'button', function () {
        var data = pbcAlertsTable.row($(this).parents('tr')).data();
        console.log(data[2] + "'Request is: " + data[0]);
        window.location.href = routeConfig.Details_Index + "?requestID=" + data[0];
    });

    return pbcAlertsTable;
}

function loadDniPendingTableBehavior() {
    pendingdni = $('#pending-document-list').DataTable({
        responsive: true,
        "bServerSide": true,
        "sAjaxSource": routeConfig.Dashboard_LoadDniPendingSolveRequestTable,
        "bProcessing": true,
        "bPaginate": true,
        fixedColumns: true,
        "order": [[2, 'desc']],
        filter: false,
        "columnDefs": [
            { "visible": false, "targets": 0 },
            { className: "text-center", "targets": [4, 5, 6, -1] },
            {
                "targets": 2,
                "render": function (data) { return formatDateTime(data); }
            },
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-info btn-sm'><span class='fas fa-info'></span> Consultar</button>"
            },
            {
                "targets": [0, 1, 5, 6, 7, 8, 9],
                "orderable": false
            }]
    });

    $('#pending-document-list tbody').on('click', 'button', function () {
        var data = pendingdni.row($(this).parents('tr')).data();
        console.log(data[2] + "'Request is: " + data[0]);
        window.location.href = routeConfig.Details_Index + "?requestID=" + data[0];
    });

    return pendingdni;
}

function loadPostalTableBehavior() {
    postaltable = $('#postal-document-list').DataTable({
        responsive: true,
        "bServerSide": true,
        "sAjaxSource": routeConfig.Dashboard_PostalRequestTable,
        "bProcessing": true,
        "bPaginate": true,
        fixedColumns: true,
        "order": [[2, 'desc']],
        filter: false,
        "columnDefs": [
            { "visible": false, "targets": 0 },
            { className: "text-center", "targets": [4, 5, 6, -1] },
            {
                "targets": 2,
                "render": function (data) { return formatDateTime(data); }
            },
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-info btn-sm'><span class='fas fa-info'></span> Consultar</button>"
            },
            {
                "targets": [0, 1, 5, 6, 7, 8, 9],
                "orderable": false
            }]
    });

    $('#postal-document-list tbody').on('click', 'button', function () {
        var data = postaltable.row($(this).parents('tr')).data();
        console.log(data[2] + "'Request is: " + data[0]);
        window.location.href = routeConfig.Details_Index + "?requestID=" + data[0];
    });

    return postaltable;
}