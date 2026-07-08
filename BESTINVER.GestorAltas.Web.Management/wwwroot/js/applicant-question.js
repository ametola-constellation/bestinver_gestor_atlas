$(document).ready(function () {
    loadQuestion();
});

function loadQuestion() {
    var idSolicitud = $('#IDSolicitud').val();

    var table = $('#cotitulares-list').DataTable({
        "bServerSide": false,
        "bFilter": false,
        "bLengthChange": false,
        "bInfo": false,
        "bProcessing": false,
        fixedColumns: true,
        "aoColumns": [
            {
                "sName": "NIF",
                "bSearchable": false,
                "bSortable": false
            },
            {
                "sName": "RequestStartDate",
                "bSearchable": false,
                "bSortable": false
            },
            {
                "sName": "Name",
                "bSearchable": false,
                "bSortable": false
            },
            {
                "sName": "TipoCotitularidad",
                "bSearchable": false,
                "bSortable": false
            },
            {
                "sName": "ShowRecord",
                "bSearchable": false,
                "bSortable": false
            }
        ],
        "columnDefs": [
            { className: "text-center", "targets": [3, 4] },
            {
                "targets": 4,
                "data": null,
                "defaultContent": "<button type='button' class='btn btn-warning btn-sm'><span class='fas fa-info'></span> Consultar</button>"
            }]
    });

    $('#cotitulares-list tbody').on('click', 'button', function (e) {
        e.preventDefault();

        var data = table.row($(this).parents('tr')).data();
        console.log(data[2] + "'Request is: " + data[0]);

        var url = $('#cotitularModal').data('url');
        url = url + "?IDCotitular=" + data[0] + "&IDSolicitud=" + idSolicitud;
        $.get(url, function (data) {
            $('#cotitularModal').html(data);
            $('#cotitularModal').modal('show');
            setCleaveClasses();
        });
    });

    return table;
}