$(document).ready(function () {
    loadSearchTable();
    approveApplicantButtonBehavior();
});

function approveApplicantButtonBehavior() {
    ajaxModal($('button[data-target="#approve-applicant-modal"]'), null, function (data) {
        if (data.result === true) {
            toastr.success('Se han aprobado los cotitulares correctamente', '', { timeOut: 3000 });
            window.location.reload();
        } else if (data === false) {
            toastr.error('Se ha producido un error al aprobar los cotitulares', '', { timeOut: 3000 });
        }
    });
}

function loadSearchTable() {
    var targetButton = $('#cotitulares-list tbody tr:first td').length - 1;
    var cotitularesTable = $('#cotitulares-list').DataTable({
        "bServerSide": false,
        "bFilter": false,
        "bLengthChange": false,
        "bInfo": false,
        "bProcessing": false,
        fixedColumns: true,
        "columnDefs": [
            { className: "text-center", "targets": [4, 5] },
            {
                "targets": targetButton,
                "data": null,
                "defaultContent": "<button type='button' class='btn btn-warning btn-sm'><span class='fas fa-info'></span> Consultar</button>"
            }]
    });

    $('#cotitulares-list tbody').on('click', 'button', function (e) {
        e.preventDefault();

        var data = cotitularesTable.row($(this).parents('tr')).data();

        var url = $('#cotitularModal').data('url');
        url = url + "/" + data[0];

        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(managementRequestModel),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#cotitularModal').html(data);
                $('#cotitularModal').modal('show');

                jQuery.validator.addMethod("uniquemobilephone", function (value, element, param) {
                    value = value.replace("+34", "");
                    var phones = $(element).data('val-applicanttype') == 1 ? $("#invalidPhonesArray").val() : $("#cotitularInvalidPhonesArray").val();
                    if (phones != undefined || phones != "") {
                        var phonesArray = phones.split(";");
                        var exists = phonesArray.indexOf(value);
                        return exists < 0;
                    } else {
                        return true;
                    }
                });
                jQuery.validator.unobtrusive.adapters.addBool("uniquemobilephone");
            },
            error: function (error) {
                toastr.error(error.statusText, 'Se ha producido un error al procesar la solicitud', { timeOut: 3000 });
            }
        });
    });
}

function fixDatatableStyles() {
    $('ul.pagination li').removeClass("paginate_button");
}