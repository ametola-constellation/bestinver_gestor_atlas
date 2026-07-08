var autocompleteRefs = [];
var currentAutocompleteIndex;


function initAutocomplete() {
    autocompleteRefs = [];
    var autocompletes = $(".autocomplete");

    for (var i = 0; i < autocompletes.length; i++) {
        try {
            autocompleteRefs[i] = new google.maps.places.Autocomplete($(autocompletes).get(i), { types: ['address'] });
            autocompleteRefs[i].addListener('place_changed', fillInAddress);
        } catch (e) { }
    }
}

function getAddressTypeSelectorMapping(addressType) {
    switch (addressType) {
        case 'street_number':
            return ".autocompleteNumber";
        case 'route':
            return ".autocompleteStreet";
        case 'country':
            return ".autocompleteCountry";
        case 'administrative_area_level_2':
            return ".autocompleteProvince";
        case 'locality':
            return ".autocompleteCity";
        case 'postal_code':
            return ".autocompletePostalCode";
        default:
            return "";
    }
}


// Update a select depending on the option text
function updateSelect(selector, texto) {
    var t = texto.toUpperCase();

    $(selector + " option").each(function () {
        var optionText = $(this).text().toUpperCase();
        if (t == optionText || (t.indexOf(optionText) > -1)) {
            $(selector).val($(this).val()).trigger('change');
            return;
        }
    });
}


function updateInput(selector, texto) {
    $(selector).val(texto).trigger("change");
}


// Autocomplete form fields with data retrieved from Google maps API
function fillInAddress() {
    var currentParentSelector = $('.autocomplete:eq(' + currentAutocompleteIndex + ')').parent().parent();
    $(currentParentSelector).find('input').val('');
    $(currentParentSelector).find('select').val('');

    var place = autocompleteRefs[currentAutocompleteIndex].getPlace();
    if (place) {
        if (place.address_components) {
            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                var selector = getAddressTypeSelectorMapping(addressType);
                if (selector !== "") {
                    selector += ":eq(" + currentAutocompleteIndex + ")";
                    if ($(selector).is("input")) {
                        if (selector.indexOf(".autocompleteStreet") == -1) {
                            updateInput(selector, place.address_components[i].long_name);
                        }
                        else { // Update Street and Via type in case of selector ==  autocompleteStreet                                
                            try {
                                var fullStreet = place.address_components[i].long_name;
                                var via = fullStreet.slice(0, fullStreet.indexOf(' '));
                                var street = fullStreet.slice(fullStreet.indexOf(' ') + 1);

                                var match = ko.utils.arrayFirst(MasterData.ViaTypeList(), function (item) {
                                    return item.valor === via;
                                });

                                if (!match) {
                                    via = "Calle";
                                    street = fullStreet;
                                }


                                updateSelect(".autocompleteVia:eq(" + currentAutocompleteIndex + ")", via);
                                updateInput(selector, street);
                            }
                            catch (err) {
                                alert("Error al establecer la calle y el número. Hágalo de forma manaul.");
                            }
                        }
                    }
                    else if ($(selector).is("select")) {
                        updateSelect(selector, place.address_components[i].long_name);
                    }
                }
            }
        }
    }
}


function bindAutocomplete() {

    $(".autocomplete").each(function (index, element) {
        $(element).on('focus', function () {
            currentAutocompleteIndex = index;
        });
    });
}


$(document).ready(function () {
    bindAutocomplete();
});