function loadDifferentCotitularPostalAddressButtonBehavior() {
    if ($('#cotitularFiscalAddressData #DifferentPostalAddress').is(":checked")) {
        $('.rowCotitularPostalAddress').show();
    }
    else {
        $('.rowCotitularPostalAddress').hide();
    }

    $('#cotitularFiscalAddressData #DifferentPostalAddress').change(function () {
        if ($(this).is(":checked")) {
            $('.rowCotitularPostalAddress').show();
        }
        else {
            $('.rowCotitularPostalAddress').hide();
        }
    });
}

$(document).ready(function () {
    loadDifferentCotitularPostalAddressButtonBehavior();
});

function setValidateExpiredDataCoowner() {
    $('#txtIDDocumentExpirationDateCoowner').toggleClass('greatherThanToday');
}