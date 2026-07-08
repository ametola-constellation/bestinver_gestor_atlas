
function mobilecheck() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

var isMobile = mobilecheck();


$(function () {

    if (!isMobile) {
        $(document).on('mouseover', '[data-tltooltip]', function () {
            var tooltext = $(this).data('tltooltip');
            var toolElement = $('.tl-tooltip-cont');
            if (tooltext) {
                $('.tl-tooltip-cont p').text(tooltext);
                toolElement.css('display', 'block');
                var elementTop = $(this).offset().top;
                var toolHeight = toolElement.height();
                toolElement.css('top', (elementTop - toolHeight - 100));
            }
        });

        $(document).on('mouseout', '[data-tltooltip]', function () {
            $('.tl-tooltip-cont').css('display', 'none');
            $('.tl-tooltip-cont p').text('');
        });
    }

    $(document).on('change', '.f-conveniencia-operaciones-element input[type="radio"]', function () {
        if (IsProductComplex && IsAltaCrii) {
            manageknowledgequestioncomplex(true);
        } else {
            manageknowledgequestion(true);
        }
    });

    $(document).on('change', 'select[name=f-conveniencia-exp]', function () {
        if (IsProductComplex && IsAltaCrii) {
            manageknowledgequestioncomplex();
        } else {
            manageknowledgequestion();
        }
    });

    $(document).on('change', 'select[name=f-conveniencia-formation]', function () {
        if (IsProductComplex && IsAltaCrii) {
            manageknowledgequestioncomplex();
        } else {
            manageknowledgequestion();
        }
    });

    $(document).on('change', '.tl-subexp-cont select', function () {
        if (IsProductComplex && IsAltaCrii) {
            manageknowledgequestioncomplex();
        } else {
            manageknowledgequestion();
        }
    });

    $(document).on('change', '.tl-subexp-cont input:radio', function () {
        if (IsProductComplex && IsAltaCrii) {
            manageknowledgequestioncomplex();
        } else {
            manageknowledgequestion();
        }
    });

    $(document).on('change', '.complex input:checkbox[id=f-conveniencia-additionalexp-checkbox]', function () {
        if (IsProductComplex && IsAltaCrii) {
            manageknowledgequestioncomplex();
        } else {
            manageknowledgequestion();
        }
    });

    $(document).on('change', '.complex input:checkbox[id=f-conveniencia-additionalformation-checkbox]', function () {
        if (IsProductComplex && IsAltaCrii) {
            manageknowledgequestioncomplex();
        } else {
            manageknowledgequestion();
        }
    });


    // FCR

    $(document).on('change', 'input:radio[class=operaciones-infra]', function () {
        manageknowledgequestionInfra(true);
    });

    $(document).on('change', 'select[name=f-conveniencia-exp-infra]', function () {
        manageknowledgequestionInfra();
    });

    $(document).on('change', '.tl-subexp-cont.infra select', function () {
        manageknowledgequestionInfra();
    });


    $(document).on('change', '.tl-subexp-cont.infra input:radio', function () {
        manageknowledgequestionInfra();
    });


    $(document).on('change', '.infra select[id=f-conveniencia-formation]', function () {
        manageknowledgequestionInfra();
    });

    $(document).on('change', '.infra input:checkbox[id=f-conveniencia-additionalexp-checkbox]', function () {
        manageknowledgequestionInfra();
    });

    $(document).on('change', '.infra input:checkbox[id=f-conveniencia-additionalformation-checkbox]', function () {
        manageknowledgequestionInfra();
    });

    $.fn.manageknowledgequestionobserver = function (selector, callback) {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if ($(selector).is(mutation.addedNodes)) {
                    observer.disconnect();
                    callback();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    $.fn.manageknowledgequestion = function () {
        if (IsProductComplex && IsAltaCrii) {
            manageknowledgequestioncomplex();
        } else {
            manageknowledgequestion();
        }
    };

    function manageknowledgequestionInfra(castScroll = false) {
        var indexExperience, indexFormation, indexSubExperience, additionalexpqchecked, additionalformationqchecked;
        indexExperience = Number($('select[id=f-conveniencia-exp]').attr("data-answerindex"));
        indexFormation = Number($('select[id=f-conveniencia-formation]').attr("data-answerindex"));
        indexSubExperience = Number($('.tl-subexp-cont select').attr("data-answerindex"));
        additionalexpqchecked = $('input#f-conveniencia-additionalexp-checkbox').is(":checked") && $('.tl-additionalexp-cont').is(":visible");
        additionalformationqchecked = $('input#f-conveniencia-additionalformation-checkbox').is(":checked") && $('.tl-additionalformation-cont').is(":visible");

        var operationsRadioAnswersYes = [], operationsRadioAnswersNo = [], subExperienceRadioAnswer = [];

        $('input:radio[class=operaciones-infra]').each(function () {
            var val = $(this).data('answer');
            if ($(this).is(':checked') && val != undefined && val.toLowerCase() == 'no') {
                operationsRadioAnswersNo.push(val.toLowerCase());
            }
            if ($(this).is(':checked') && val != undefined && val.toLowerCase() == 'sí') {
                operationsRadioAnswersYes.push(val.toLowerCase());
            }
        });

        $('.tl-subexp-cont  input[type="radio"]').each(function () {
            var val = $(this).data('answer');
            if ($(this).is(':checked') && val != undefined && val.toLowerCase() == 'sí') {
                subExperienceRadioAnswer.push(val.toLowerCase());
            }
        });

        // Additional
        if (indexExperience == 2 && (indexFormation == 2 || indexFormation == 3)) {
            if (indexSubExperience != 12 && subExperienceRadioAnswer.length >= 1) {
                $('li.tl-additionalformation-cont').fadeIn(300, function () {
                    $(this).css('opacity', 1)
                });
            } else {
                $('li.tl-additionalformation-cont').fadeOut(300);
            }
        } else {
            $('li.tl-additionalformation-cont').fadeOut(300);
        }

        if (operationsRadioAnswersYes.length >= 1) {
            $('li.tl-additionalexp-cont').fadeIn(300, function () {
                $(this).css('opacity', 1)
            });
        } else {
            $('li.tl-additionalexp-cont').fadeOut(300);
        }

        /*var showFinancieros = additionalformationqchecked == true && additionalexpqchecked == false && (operationsRadioAnswersNo.length >= 2 || operationsRadioAnswersYes.length >= 1)*/
        var showFinancieros = true

        if (indexExperience == 2) {
            $('li.tl-subexp-cont').fadeIn();
        } else if (indexExperience <= 1) {
            $('li.tl-subexp-cont').fadeOut();
        }

        if ($('input:radio[class=operaciones-infra]').length && showFinancieros) {
            $('#tl-financieros-cont').fadeIn(300);
            //if (castScroll && $('#tl-financieros-cont').is(':hidden')) {
            //    //if (!$('#fundnames-question').val()) {
            //    //    $('#tl-financieros-cont').fadeIn(300);
            //    //    $("html, body").animate({ scrollTop: $('#fundnames-question-container').offset().top - 100 }, 500);
            //    //} else {
            //    $('#tl-financieros-cont').fadeIn(300);
            ////    }
            //} else {
            //    $('#tl-financieros-cont').fadeIn(300);
            //}
        } else {
            $('#tl-financieros-cont').fadeOut(300);
        }
    }

    function manageknowledgequestion(castScroll) {
        var indexExperience, indexFormation;
        indexExperience = Number($('select[id=f-conveniencia-exp]').attr("data-answerindex"));
        indexFormation = Number($('select[id=f-conveniencia-formation]').attr("data-answerindex"));
        var indexSubExperience = Number($('.tl-subexp-cont select').attr("data-answerindex"));

        var radioAnswers = [], subExperienceRadioAnswer = [];
        var complexAnswer = false;


        $('.tl-subexp-cont  input[type="radio"]').each(function () {
            var val = $(this).data('answer');
            if ($(this).is(':checked') && val != undefined) {
                subExperienceRadioAnswer.push(val.toLowerCase());
            }
        });

        // Show product questions
        //var showOperations = true;
        //if (indexExperience == 2 && (indexFormation == 2 || indexFormation == 3)) {
        //    if (indexSubExperience != 12 && subExperienceRadioAnswer.length >= 1) {
        //        showOperations = true;
        //        $('li.f-conveniencia-operaciones-element').fadeOut(300);
        //    } else {
        //        showOperations = true;
        //        $('li.f-conveniencia-operaciones-element').fadeIn(300, function () {
        //            $(this).css('opacity', 1)
        //        });
        //    }
        //} else {
        //    showOperations = true;
        //    $('li.f-conveniencia-operaciones-element').fadeIn(300, function () {
        //        $(this).css('opacity', 1)
        //    });
        //}

        $('.f-conveniencia-operaciones-element input[type="radio"]').each(function () {
            var val = $(this).data('answer');
            if ($(this).is(':checked') && val != undefined && val.toLowerCase() == 'no') {
                radioAnswers.push(val.toLowerCase());
            }

            var complexVal = $(this).data('complex');
            if (complexVal && $(this).is(':checked')) {
                complexAnswer = true;
            }
        });

        
        var operationsChecked = $('.f-conveniencia-operaciones-element input[type="radio"]:checked').length >= 2

        if (indexExperience == 2) {
            
            $('li.tl-subexp-cont').fadeIn(300, function () {
                $(this).css('opacity', 1)
            });
        } else if (indexExperience <= 1) {
            $('li.tl-subexp-cont').fadeOut(300);
        }
   /*     var showFinancieros = operationsChecked && radioAnswers.length >= 2 && showOperations;*/
        var showFinancieros = true

        if ($('.f-conveniencia-operaciones-element input[type="radio"]').length) {
            if (showFinancieros) {
                if (castScroll && $('#tl-financieros-cont').is(':hidden')) {
                    $('#tl-financieros-cont').fadeIn(300);
                    $("html, body").animate({ scrollTop: $('#tl-financieros-cont').offset().top - 100 }, 500);
                } else {
                    $('#tl-financieros-cont').fadeIn(300);
                }
            } else {
                $('#tl-financieros-cont').fadeOut(300);
            }
        }
    }

    function manageknowledgequestioncomplex(castScroll) {
        var indexExperience, indexFormation, indexSubExperience, additionalexpqchecked, additionalformationqchecked;
        indexExperience = Number($('select[id=f-conveniencia-exp]').attr("data-answerindex"));
        indexFormation = Number($('select[id=f-conveniencia-formation]').attr("data-answerindex"));
        indexSubExperience = Number($('.tl-subexp-cont select').attr("data-answerindex"));
        additionalexpqchecked = $('input#f-conveniencia-additionalexp-checkbox').is(":checked") && $('.tl-additionalexp-cont').is(":visible");
        additionalformationqchecked = $('input#f-conveniencia-additionalformation-checkbox').is(":checked") && $('.tl-additionalformation-cont').is(":visible");

        var operationsRadioAnswersYes = [], operationsRadioAnswersNo = [], subExperienceRadioAnswer = [];
        var complexAnswer = false;

        $('.tl-subexp-cont  input[type="radio"]').each(function () {
            var val = $(this).data('answer');
            if ($(this).is(':checked') && val != undefined && val.toLowerCase() == 'sí') {
                subExperienceRadioAnswer.push(val.toLowerCase());
            }
        });

        // Operations
        $('.f-conveniencia-operaciones-element input[type="radio"]').each(function () {
            var val = $(this).data('answer');
            if ($(this).is(':checked') && val != undefined && val.toLowerCase() == 'sí') {
                operationsRadioAnswersYes.push(val.toLowerCase());
            }

            if ($(this).is(':checked') && val != undefined && val.toLowerCase() == 'no') {
                operationsRadioAnswersNo.push(val.toLowerCase());
            }

            var complexVal = $(this).data('complex');
            if (complexVal && $(this).is(':checked')) {
                complexAnswer = true;
            }
        });

        // Experience
        if (indexExperience == 2) {
            $('li.tl-subexp-cont').fadeIn(300, function () {
                $(this).css('opacity', 1)
            });
        } else if (indexExperience <= 1) {
            $('li.tl-subexp-cont').fadeOut(300);
        }

        // Additional
        if (indexExperience == 2 && (indexFormation == 2 || indexFormation == 3)) {
            if (indexSubExperience != 12 && subExperienceRadioAnswer.length >= 1) {
                $('li.tl-additionalformation-cont').fadeIn(300, function () {
                    $(this).css('opacity', 1)
                });
            } else {
                $('li.tl-additionalformation-cont').fadeOut(300);
            }
        } else {
            $('li.tl-additionalformation-cont').fadeOut(300);
        }

        if (operationsRadioAnswersYes.length >= 1) {
            $('li.tl-additionalexp-cont').fadeIn(300, function () {
                $(this).css('opacity', 1)
            });
        } else {
            $('li.tl-additionalexp-cont').fadeOut(300);
        }

        /*var showFinancieros = additionalformationqchecked == true && additionalexpqchecked == false && (operationsRadioAnswersNo.length >= 2 || operationsRadioAnswersYes.length >= 1)*/
        var showFinancieros = true

        // Financieros/Product Questions
        if (showFinancieros && $('.f-conveniencia-operaciones-element input[type="radio"]').length) {
            if (castScroll && $('#tl-financieros-cont').is(':hidden')) {
                $('#tl-financieros-cont').fadeIn(300);
                $("html, body").animate({ scrollTop: $('#tl-financieros-cont').offset().top - 100 }, 500);
            } else {
                $('#tl-financieros-cont').fadeIn(300);
            }
        } else {
            $('#tl-financieros-cont').fadeOut(300);
        }
    }
});

