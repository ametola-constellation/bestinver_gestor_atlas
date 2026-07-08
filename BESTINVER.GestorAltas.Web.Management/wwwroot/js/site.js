Object.defineProperty(Object.prototype, "getProp", {
    value: function (prop) {
        var key, self = this;
        for (key in self) {
            if (key.toLowerCase() === prop.toLowerCase()) {
                return self[key];
            }
        }
    },
    enumerable: false
});

Object.defineProperty(Object.prototype, "setProp", {
    value: function (prop, val) {
        var key, self = this;
        var found = false;
        if (Object.keys(self).length > 0) {
            for (key in self) {
                if (key.toLowerCase() === prop.toLowerCase()) {
                    found = true;
                    self[key] = val;
                    break;
                }
            }
        }

        if (!found) {
            self[prop] = val;
        }

        return val;
    },
    enumerable: false
});

String.prototype.includes = function (search, start) {
    'use strict';

    if (search instanceof RegExp) {
        throw TypeError('first argument must not be a RegExp');
    }
    if (start === undefined) { start = 0; }
    return this.indexOf(search, start) !== -1;
};

Object.defineProperty(Array.prototype, 'find', {
    value: function (predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return kValue.
            var kValue = o[k];
            if (predicate.call(thisArg, kValue, k, o)) {
                return kValue;
            }
            // e. Increase k by 1.
            k++;
        }

        // 7. Return undefined.
        return undefined;
    },
    configurable: true,
    writable: true
});

function setCustomFileInputName() {
    $('.custom-file-input').on('change', function () {
        var fileName = $(this).val().split('\\').pop();
        var label = $(this).siblings('.custom-file-label');

        if (label.data('default-title') === undefined) {
            label.data('default-title', label.html());
        }

        if (fileName === '') {
            label.removeClass("selected").html(label.data('default-title'));
        } else {
            label.addClass("selected").html(fileName);
        }
    });
}

$(document).ready(function () {
    $("#selectLanguage select").change(function () {
        var form = $(this).parent().parent();

        var actionUrl = form.attr('action');
        var dataToSend = form.serializeIncludeDisabled();

        $.post(actionUrl, dataToSend).done(function (data) {
            if (data) {
                window.location.reload();
            }
        });
    });
    setCustomFileInputName();

    //$.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
    //    console.log(message);
    //    $("#" + settings.sTableId).after("<div class='alert alert-danger' role='alert'><span class='badge badge-danger'>Se ha producido un error al cargar los datos</span></div>");
    //    $("#" + settings.sTableId + "_length").hide();
    //};
});

$(document).change(function () {
    setCustomFileInputName();
});

(function () {
    jQuery.validator.addMethod("extension", function (value, element, param) {
        param = typeof param === "string" ? param.replace(/,/g, '|').replace('.', '') : "png|jpe?g|gif";
        return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
    });
}());
var spinnerKey = 'font-spinner';
var buttonInactive = function (button) {
    var spinner = '<i id="' + spinnerKey + '" class="fas fa-spin fa-spinner"></i>';

    button.prop("disabled", true);

    button.prepend(spinner);
};

var buttonActive = function (button) {
    button.prop("disabled", false);
    $('#' + spinnerKey).remove();
};

function ajaxModal(modalButton, initPostData, postEvent) {
    var placeholderElement = $('#modal-placeholder');
    placeholderElement.html('');

    var showModal = function () {
        placeholderElement.find('.modal').modal('show');
        if (postEvent) {
            $('button[data-save="modal"]').on('click', function (event) {
                event.preventDefault();
                var saveButton = $(this);
                var form = saveButton.parents('.modal').find('form');
                if (form && $(form).validate().form()) {
                    var actionUrl = form.attr('action');
                    var dataToSend = form.serializeIncludeDisabled();

                    buttonInactive(saveButton);
                    $.post(actionUrl, dataToSend).done(function (data) {
                        postEvent(data);
                        if ($.parseHTML(data).length === 0 && form.validate()) {
                            hideModal();
                        }
                        var newBody = $('.modal-body', data);

                        placeholderElement.find('.modal-body').replaceWith(newBody);
                    }).always(function () {
                        buttonActive(saveButton);
                    });
                }
            });
        }
    };

    var hideModal = function () {
        placeholderElement.find('.modal').modal('hide');
    };

    var url = $(modalButton).attr('formaction');

    if (initPostData) {
        buttonInactive($(modalButton));
        $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(initPostData),
            contentType: 'application/json',
            success: function (data) {
                placeholderElement.html(data);
                showModal();
            }
        }).always(function () {
            buttonActive($(modalButton));
        });
    } else {
        $(modalButton).on('click', function (event) {
            event.preventDefault();

            if (url) {
                buttonInactive($(modalButton));
                $.get(url).done(function (data) {
                    placeholderElement.html(data);
                    showModal();
                }).always(function () {
                    buttonActive($(modalButton));
                });
            }
        });
    }
}

function setCookie(key, value) {
    document.cookie = key + "=" + value + ";";
}

setCookie('TimezoneOffset', -new Date().getTimezoneOffset());

$(document).ready(function () {
    setCleaveClasses();
});

function setCleaveClasses() {
    $('.input-decimal-2').toArray().forEach(function (field) {
        new Cleave(field, {
            numeral: true,
            numeralDecimalScale: 2,
            numeralDecimalMark: ',',
            numeralThousandsGroupStyle: 'none'
        });
    });
    $('.input-datetime').toArray().forEach(function (field) {
        new Cleave(field, {
            date: true,
            datePattern: ['d', 'm', 'Y']
        });
    });
}

jQuery.validator.addMethod("validDNI", function (value, element) {
    var dni = value;
    if (dni) {
        var numero, varra;
        var expresion_regular_dni = /^[XYZK]?\d{5,8}[A-Z]$/;

        dni = dni.toUpperCase();

        if (expresion_regular_dni.test(dni) === true) {
            numero = dni.substr(0, dni.length - 1);
            numero = numero.replace('X', 0);
            numero = numero.replace('Y', 1);
            numero = numero.replace('Z', 2);
            numero = numero.replace('K', 0);
            numero = numero % 23;
            var varraDni = dni.substr(dni.length - 1, 1);
            varra = 'TRWAGMYFPDXBNJZSQVHLCKET';
            varra = varra.substring(numero, numero + 1);
            if (varra !== varraDni) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    return false;
}, "Por favor, introduce un dni válido");

jQuery.validator.addMethod("greatherThanToday", function (value, element) {
    if (value === undefined)
        return true;

    var dateparts = value.split('/');

    var dia = dateparts[0];
    var month = dateparts[1];
    var year = dateparts[2];

    return new Date() < new Date(year, parseInt(month) - 1, dia);
}, "La fecha tiene que es mayor que la actual");

jQuery.validator.addMethod("minorOnly", function (value, element) {
    if (value === undefined)
        return true;

    var dateparts = value.split('/');

    var dia = dateparts[0];
    var month = dateparts[1];
    var year = dateparts[2];

    return diff_years(new Date(), new Date(year, parseInt(month) - 1, dia)) < 18;
}, "La fecha de un menor no puede transformarse en la fecha de un adulto");

jQuery.validator.addMethod("adultOnly", function (value, element) {
    if (value === undefined)
        return true;

    var dateparts = value.split('/');

    var dia = dateparts[0];
    var month = dateparts[1];
    var year = dateparts[2];

    return diff_years(new Date(), new Date(year, parseInt(month) - 1, dia)) >= 18;
}, "La fecha de un adulto no puede transformarse en la fecha de un menor");

jQuery.validator.addMethod('require-one', function (value) {
    return jQuery('.form-check-input:checked').length > 0;
}, "Selecione al menos una respuesta");

function diff_years(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 86400;
    return Math.abs(Math.round(diff / 365.25));
}

jQuery.validator.addMethod("uniquePhone", function (value, element) {
    if (value === undefined)
        return true;

    var currentDNI = $(element.form).find('.dni').val();
    var currentBirthday = $(element.form).find('.birthday').val();
    var date = moment(currentBirthday, 'DD/MM/YYYY', true);
    var age = moment().diff(date, 'years');

    if (!currentDNI)
        currentDNI = $(element).data('dni');

    if (IsCIF(currentDNI) || age < 18)
        return true;

    var mobiles = [];
    $('.phone').each(function () {
        var mdate = $(this).find('.birthday').text();
        var mage = mdate !== "" ? moment().diff(mdate, 'years') : 0;

        if (!IsCIF($(this).find('.dni').text()) && mage >= 18) {
            mobiles.push({
                dni: $(this).find('.dni').text(),
                mobile: $(this).find('.mobile').text()
            });
        }
    });

    var repeatedItem = $.grep(mobiles, function (m) {
        return removePrefix(m.mobile) === removePrefix(value);
    });

    if (repeatedItem !== undefined && repeatedItem.length > 0 && repeatedItem[0].dni !== currentDNI)
        return false;

    return true;
}, "No se puede repetir un número de móvil");

function removePrefix(value) {
    if (value.indexOf('34') === 0) {
        value = value.replace('34', '');
    }
    if (value.indexOf('+34') === 0) {
        value = value.replace('+34', '');
    }
    return value;
}

function IsCIF(value) {
    var iscif = false;
    var firstchar = value.substr(0, 1);

    if (isNaN(firstchar)) {
        iscif = true;
    }

    return iscif;
}

jQuery.extend(jQuery.validator.methods, {
    min: function (value, element) {
        if (!value)
            return true;

        var val = parseFloat(value.replace(',', '.'));
        return val >= parseFloat(element.min);
    }
});

jQuery.extend(jQuery.validator.methods, {
    max: function (value, element) {
        if (!value)
            return true;

        var val = parseFloat(value.replace(',', '.'));
        return val <= parseFloat(element.max);
    }
});

function Utils() { }
Utils.parseDate = function (input) {
    var parts = input.split('/');

    var d = new Date(parts[2], parts[1] - 1, parts[0]);

    return d;
};

Utils.parseDateAspNet = function (str) {
    return new Date(parseInt(str.replace('/Date(', '').replace(')/', '')));
};

function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

Date.prototype.toISOStringIsUTC = function () {
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        '.' + (this.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
};

$.fn.serializeIncludeDisabled = function () {
    var disabled = this.find(":input:disabled").removeAttr("disabled");
    var serialized = this.serialize();
    disabled.attr("disabled", "disabled");
    return serialized;
};

$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
    if (jqxhr.status == 401) {
        window.location = routePrefix + "/home/index";
    }
});

function formatDateTime(data) {
    if (!data) return '';
    var utcDate = new Date(data);
    var date = utcDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return date;
}


