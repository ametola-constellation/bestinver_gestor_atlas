$(document).ready(function () {
    $('#question-list').prepend("<div class='alert alert-primary' role='alert'>Procesando...</strong></div>");
    loadQuestions();
});

var IdRequestStatus = $('#IdRequestStatusHidden').val();

function loadQuestions() {
    var requestId = $('#Id').val();
    var errorTag = "<div class='alert alert-danger' role='alert'>Había un error por favor contacte con un administrador.</strong></div>";
    $.ajax({
        url: routeConfig.Details_GetApplicantTest + "?requestId=" + requestId,
        type: 'GET',
        success: function (response) {
            $('#question-list').empty();
            drawApplicant(response);
            loadQuestionEdit();
        },
        failure: function (response) {
            $('#question-list').empty(); $('#question-list').prepend(errorTag);
            console.err(response);
        },
        error: function (response) {
            $('#question-list').empty();
            $('#question-list').prepend(errorTag);
            console.error(response);
        }
    });
}

function drawApplicant(data) {
    if (data && data.length > 0) {
        $.each(data, function (index, item) {
            if (item.questions.length > 0) {
                var completeName = item.user.name + (item.user.firstSurname == undefined ? '' : ' ' + item.user.firstSurname) + (item.user.secondSurname == undefined ? '' : ' ' + item.user.secondSurname);
                $('#question-list').append("<li><h3 class='badge badge-secondary'>" + completeName + "</h3>" + drawQuestions(item) + "</li>");
            }
        });
    }
    else {
        $('#question-list').prepend("<div class='alert alert-primary' role='alert'>Esta solicitud todavía <strong>no tiene test</strong> asociado.</div>");
    }
    var obj = $(this);
}

function prependData(table, tableHeaderName, user, questions) {
    table.html += "<thead><tr>" +
        "<th colspan = 3>" + tableHeaderName + "</th>" +
        "</tr><tr><th>Pregunta</th><th colspan = 2>Respuesta</th></tr></thead>";

    $.each(questions, function (jindex, item) {
        table.html += "<tr data-question=" + item.question.Id + " data-applicant=" + user.DNI + ">";

        table.html += "<td>" + item.question.text + "</td>";

        if (item.allowEdit === true && (IdRequestStatus == 2 || IdRequestStatus == 9 || IdRequestStatus == 20)) {
            table.html += "<td>" + item.answer + "</td>";
            table.html += "<td>" + "<button type='button' class='btn btn-info btn-sm answertest'" + "data-question=" + item.question.id + " data-applicant=" + user.dni + "><span class='fas fa-file-signature'></span> Editar</button>" + "</td>";
        } else {
            table.html += "<td colspan = 2>" + item.answer + "</td>";
        }

        table.html += "</tr>";
    });
}
function drawQuestions(item) {
    var questions = item.questions;
    var user = item.user;
    if (questions && questions.length > 0) {
        var testTypes = Object.freeze({
            otros: undefined || 0,
            conocimiento: 1,
            Conveniencia: 2,
            FATCA: 3
        });

        var table = { html: "<div class='alert alert-primary'><table class='table table-bordered'>" };

        $.each(Object.keys(testTypes), function (i, item) {
            var tests = [];
            var testSelector = testTypes[item];

            var testName = testSelector === testTypes.otros ? 'Test' : 'Test de ' + item;
            tests = $.grep(questions, function (q) {
                if (testSelector === 1) {
                    return q.question.testType === testSelector || q.question.testType === 4;
                } else {
                    return q.question.testType === testSelector;
                }
            });
            if (tests.length > 0) {
                prependData(table, testName, user, tests);
            }
        });

        table.html += "</tbody></table>";
        table.html += "</div>";
        return table.html;
    }
    else {
        $('#question-list').prepend("<div class='alert alert-primary' role='alert'>Esta solicitud todavía <strong>no tiene test</strong> asociado.</div>");
    }
}

function loadQuestionEdit() {
    var requestId = $('#Id').val();

    $('.answertest').on('click', function (e) {
        e.preventDefault();

        var ApplicantId = $(this).data('applicant');
        var QuestionId = $(this).data('question');

        var url = $('#questionModal').data('url');

        url = url + "/" + ApplicantId + "/" + QuestionId;

        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(managementRequestModel),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#questionModal').html(data);
                $('#questionModal').modal('show');
                loadValidations();
            },
            error: function (error) {
                toastr.error(error.statusText, 'Se ha producido un error al cargar la pregunta', { timeOut: 3000 });
            }
        });
    });
}

function manageOtherAnswerCombo() {

    var obj = $(this);

    var posibleExtendedAnswers = obj[0].getAttribute('data-posibleextendedanswers');
    var arrayAnswers = posibleExtendedAnswers.split(',');
    var extended = arrayAnswers.indexOf(obj.val()) >= 0;

    var elem = 'divextendedanswer';
    var elemtext = 'txtcomboextendedanswer';

    if (extended) {
        $('#' + elem).removeClass('hidden').addClass('block');
        $('#' + elemtext).prop('required', true);
    }
    else {
        $('#' + elem).removeClass('block').addClass('hidden');
        $('#' + elemtext).val('');
        $('#' + elemtext).prop('required', false);
    }
}

function manageOtherAnswerComboPublic() {
    var obj = $(this);
    var questionid = obj[0].getAttribute('data-questionid');
    var combo = obj.val();
    var askforPRP = obj[0].getAttribute('data-AskForPrpQuestion');

    if (questionid == 48 && combo == 136) {
        $('#divextendedanswer').removeClass('hidden').addClass('block');
        $('#txtcomboextendedanswerEntidad').prop('required', true);
        $('#txtcomboextendedanswerDepartamento').prop('required', true);
        $('#txtcomboextendedanswerCargo').prop('required', true);
        if (askforPRP == 'true') { $('#question-prp-div').show();}
    } else {
        $('#divextendedanswer').removeClass('block').addClass('hidden');

        $('#txtcomboextendedanswerEntidad').prop('required', false);
        $('#txtcomboextendedanswerEntidad').val('');

        $('#txtcomboextendedanswerDepartamento').prop('required', false);
        $('#txtcomboextendedanswerDepartamento').val('');

        $('#txtcomboextendedanswerCargo').prop('required', false);
        $('#txtcomboextendedanswerCargo').val('');

        if (askforPRP == 'true') { $('#question-prp-div').hide(); }
    }
}

function manageOtherAnswerComboOng() {
    var obj = $(this);
    var questionid = obj[0].getAttribute('data-questionid');
    var combo = obj.val();

    if (questionid == 50 && combo == 138) {
        $('#divextendedanswer').removeClass('hidden').addClass('block');
        $('#txtcomboextendedanswerEntidad').prop('required', true);
        $('#txtcomboextendedanswerCargo').prop('required', true);
    } else {
        $('#divextendedanswer').removeClass('block').addClass('hidden');

        $('#txtcomboextendedanswerEntidad').prop('required', false);
        $('#txtcomboextendedanswerEntidad').val('');

        $('#txtcomboextendedanswerCargo').prop('required', false);
        $('#txtcomboextendedanswerCargo').val('');
    }
}

function manageOtherAnswerComboCargo() {
    var obj = $(this);
    var questionid = obj[0].getAttribute('data-questionid');
    var combo = obj.val();
    if (questionid == 47 && (combo == 118 || combo == 119 || combo == 120 || combo == 121 || combo == 122)) {
        $('#divextendedanswer').removeClass('hidden').addClass('block');
        $('#txtcomboextendedanswer').prop('required', true);
    } else {
        $('#divextendedanswer').removeClass('block').addClass('hidden');
        $('#txtcomboextendedanswer').val('');
        $('#txtcomboextendedanswer').prop('required', false);
    }
}

function manageOtherAnswerPRP() {
    var obj = $(this);
    var answerid = obj[0].getAttribute('data-answerid');
    var div = '#divextendedanswer' + answerid.toString();
    var input = '#checkextendedanswer' + answerid.toString();
    var extended = obj[0].getAttribute('data-extendedanswer') == 'true';
    var checked = obj[0].checked;

    if (extended) {
        if (checked) {
            $(div).removeClass('hidden').addClass('block');
            $(input).prop('required', true);
        }
        else {
            $(div).removeClass('block').addClass('hidden');
            $(input).val('');
            $(input).prop('required', false);
        }
    } else {
        $(div).removeClass('block').addClass('hidden');
        $(input).val('');
        $(input).prop('required', false);
    }
}

function manageOriginCombo() {
    var obj = $(this);
    var selected = obj.val();
    var answerid = obj[0].getAttribute('data-answerid');
    var elem = 'divextendedanswer' + answerid;
    var elemtext = 'checkextendedanswer' + answerid;

    if (selected == 116 || selected == 81) {
        $('#divextendedanswer').removeClass('hidden').addClass('block');
        $('#txtcomboextendedanswer').prop('required', true);
    } else {
        $('#divextendedanswer').removeClass('block').addClass('hidden');
        $('#txtcomboextendedanswer').val('');
        $('#txtcomboextendedanswer').prop('required', false);
    }
}

function manageOtherAnswerCheck() {
    var obj = $(this);
    var extended = obj[0].getAttribute('data-extendedanswer') == 'true';
    var answerid = obj[0].getAttribute('data-answerid');
    var elem = 'divextendedanswer' + answerid;
    var elemtext = 'checkextendedanswer' + answerid;
    var checked = obj[0].checked;

    if (extended) {
        if (checked) {
            $('#' + elem).removeClass('hidden').addClass('block');
            $('#' + elemtext).prop('required', true);
        } else {
            $('#' + elem).removeClass('block').addClass('hidden');
            $('#' + elemtext).val('');
            $('#' + elemtext).prop('required', false);
        }
    }
    else {
        $('#' + elem).removeClass('block').addClass('hidden');
        $('#' + elemtext).val('');
        $('#' + elemtext).prop('required', false);
    }
}

function manageSecondCountry() {
    var obj = $(this);
    var country = obj.val();

    if (country == 1 || country == '') {
        $('#second-country-subquestion').hide();
        $('#second-country-subquestion :input').prop('required', false);
    } else {
        $('#second-country-subquestion').show();
        $('#second-country-subquestion :input').prop('required', true);
    }
}

function manageFactaCheck() {
    var obj = $(this);
    var checked = obj[0].checked;

    if (checked) {
        $('#checkextendedanswer-1').prop('required', true);
        $('#checkextendedanswer-2').prop('required', true);
    } else {
        $('#checkextendedanswer-1').prop('required', false);
        $('#checkextendedanswer-2').prop('required', false);
    }
}

function loadValidations() {
    $.validator.setDefaults({ ignore: null });

    //Validate required check answers
    $.validator.addMethod("requiredcheck", function (value, element, param) {
        var type = param[1];
        var divName = param[2];
        var alloMultiple = param[3] == 'true';
        var isHidden = $('#' + divName).is(':hidden');

        if (isHidden) { return true;}

        if (type == 3) {
            var elementsChecked = $('#' + divName + ' input[type=checkbox]:checked').length;

            if (alloMultiple) {
                return elementsChecked > 0;
            } else {
                return elementsChecked == 1;
            }
        } else {
            return true;
        }
    });

    $.validator.unobtrusive.adapters.add('requiredcheck',
        ['type', 'container', 'multiple'],
        function (options) {
            var containerName = options.params['container'];
            var element = $('#' + containerName)[0];
            options.rules['requiredcheck'] = [element, options.params['type'], options.params['container'], options.params['multiple']];
            options.messages['requiredcheck'] = options.message;
        });

    //Validate required extended check answers
    $.validator.addMethod("requiredextendedcheck", function (value, element, param) {
        var divName = param[1];
        var elementsChecked = $('#' + divName + ' input[type=checkbox]:checked').length;
        if (elementsChecked == 0) {
            return true;
        } else {
            if (element.value == undefined || element.value.trim() == '') {
                return false;
            }
        }
        return true;
    });

    $.validator.unobtrusive.adapters.add('requiredextendedcheck',
        ['container', 'answerid'],
        function (options) {
            var elementId = options.params['answerid'];
            var element = $('#checkextendedanswer' + elementId)[0];
            options.rules['requiredextendedcheck'] = [element, options.params['container']];
            options.messages['requiredextendedcheck'] = options.message;
        });

    //Validate answers checks multilevel
    $.validator.addMethod("requiredmultiplecheck", function (value, element, param) {

        var divName = param[1];
        var elementsChecked = $('#' + divName + ' input[type=checkbox]:checked');

        if (elementsChecked.length == 0) {
            return false;
        } else {
            var checkname = elementsChecked[0].id;
            var checkparent = $('#' + checkname).data("checkparent");
            var numchilds = $('#' + checkname).data("childs");
            var checkanswerdid = $('#' + checkname).data("answerid");

            if (elementsChecked.length == 1) {
                if (checkparent == 0) {
                    return numchilds == 0;
                } else {
                    return false;
                }
            } else {
                if (elementsChecked.length == 2) {
                    var childname = elementsChecked[1].id;
                    var childparent = $('#' + childname).data("checkparent");
                    return childparent == checkanswerdid;
                } else {
                    return false;
                }
            }
        }
    });

    $.validator.unobtrusive.adapters.add('requiredmultiplecheck',
        ['container'],
        function (options) {
            var containerName = options.params['container'];
            var element = $('#' + containerName)[0];
            options.rules['requiredmultiplecheck'] = [element, options.params['container']];
            options.messages['requiredmultiplecheck'] = options.message;
        });








    //Validate second fiscal country
    $.validator.addMethod("differentfiscalcountry", function (value, element, param) {
        return value != param[0];
    });

    $.validator.unobtrusive.adapters.add('differentfiscalcountry',
        ['fiscalcountry'],
        function (options) {
            options.rules['differentfiscalcountry'] = [options.params['fiscalcountry']];
            options.messages['differentfiscalcountry'] = options.message;
    });


    //Validate expiration date
    $.validator.addMethod("expirationdate", function (value, element, param) {
        var ok = true;

        if (value == "") {
            ok = false;
        } else {
            var momentdate = getDate(value);
            var currentdate = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD', true);
            ok = momentdate.isValid() && currentdate.isBefore(momentdate);
        }
        return ok;
    });
    $.validator.unobtrusive.adapters.addBool("expirationdate");
}