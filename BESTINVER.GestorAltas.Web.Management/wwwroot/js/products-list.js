$(document).ready(function () {
    loadProductTableBehavior();
    //loadOperationTableBehavior();
});

function loadProductTableBehavior() {
    $('#products-list').DataTable({
        //responsive: true,
        "bServerSide": false,
        "bFilter": false,
        "bLengthChange": false,
        "bInfo": false,
        "bProcessing": false,
        fixedColumns: true,
        "aoColumns": [
            {
                "sName": "Name",
                "bSearchable": false,
                "bSortable": false
            }
        ]
    });
}

function loadOperationTableBehavior(){
    $('.operation').each(function (index, element) {
        var elementid = element.id;
        $('#' + elementid).DataTable({
            responsive: true
        });
    });
}