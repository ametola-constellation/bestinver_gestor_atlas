var AlertStatusEnum = {
    Aceptada: 1,
    Denegada: 2
};

$(document).ready(function () {
    loadAlertTableBehavior();
});

function loadAlertTableBehavior() {
    var alertTable = $('#alerts-list').DataTable({
        responsive: true,
        "bServerSide": false,
        "bFilter": false,
        "bLengthChange": false,
        "bInfo": false,
        "bProcessing": false,
        fixedColumns: true
    });

    $('#alerts-list tbody').on('click', 'button', function (e) {
        e.preventDefault();
        var tr = $(this).parents('tr');
        var alertID = tr.data('type-id');
        var alert = $.grep(requestAlertModel, function (e, i) {
            return parseInt(e.Id) === parseInt(alertID);
        })[0];

        var modalButton = this;
        ajaxModal(modalButton, alert, function (data) {
            if (data.result === true) {
                toastr.success('<strong>Completado!</strong> Solicitud modificada', '', { timeOut: 3000 });
                window.location.reload();
            } else if (data.result === false) {
                toastr.error('No se pudo realizar la acción', '', { timeOut: 3000 });
            } else {
                toastr.warning('No se pudo realizar la acción', 'La solicitud ya está resuelta', { timeOut: 3000 });
            }
        });
    });

    return alertTable;
}