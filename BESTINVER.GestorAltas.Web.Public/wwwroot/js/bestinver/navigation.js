function Navigation() { };

Navigation.NextStep = function (_currentstep, _nextstep) {

    if (_nextstep) {
        location.hash = '#' + _nextstep;
    }
    Navigation.ShowNextStep(_nextstep);
    window.clearScrollError();
}

Navigation.NextStepAuto = function () {
    var currentStepOrder = vm.StepsOrder.indexOf(vm.CurrentStep);
    Navigation.NextStep(vm.CurrentStep, vm.StepsOrder[currentStepOrder + 1]);
}

Navigation.ShowNextStep = function (_nextstep) {

    if (timeoutcheck && _nextstep != 'Success' && _nextstep != 'Error') {
        customDebug(vm.RequestId() + ": Timeout", _nextstep);
        location.href = timeouturl;
        return;
    }

    $(".form_steps-list_element").addClass('hidden').removeClass('complete');
    $(".form_steps-list_element [id$='-content']").addClass('hidden');
    $(".form_steps-list_element [id$='buttons-content']").removeClass('hidden');
    $('.registration_inner').addClass('hidden');

    var dataStep = _nextstep;
    switch (_nextstep) {
        case 'BasicData':
            $('#personal-data-content').removeClass('hidden');
            $('#basicdata-content-head').prevAll().removeClass('hidden').addClass('complete');
            $('#basicdata-content-head').removeClass('hidden');
            $('#basicdata-content').removeClass('hidden');
            if (GMT != undefined) {
                // -
                GMT.PushPersistedDigitalData();
                // -
            }
            break;

        case 'PersonalData':
            window.bstapp.newUser()
            $('#personal-data-content').removeClass('hidden');
            $('#personaldata-content-head').prevAll().removeClass('hidden').addClass('complete');
            $('#personaldata-content-head').removeClass('hidden');
            $('#personaldata-content').removeClass('hidden');
            window.scrollWindow('basicdata-content-head');
            if (GMT != undefined) {
                GMT.Push(PageEnum.DATOS_PERSONALES_TITULAR);
                sessionStorage.setItem("PageEnum", PageEnum.DATOS_PERSONALES_TITULAR);
            }
            break;

        case 'ContactData':
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#personal-data-content').removeClass('hidden');
            $('#personaldata-address-content-head').prevAll().removeClass('hidden').addClass('complete');
            $('#personaldata-address-content-head').removeClass('hidden');
            $('#contactdata-content').removeClass('hidden');
            $('#personaldata-address-content').removeClass('hidden');
            Utils.scrollWindow('personaldata-content-head', -90);
            if (GMT != undefined) GMT.Push(PageEnum.DIRECCION_CONTACTO_TITULAR);
            sessionStorage.setItem("PageEnum", PageEnum.DIRECCION_CONTACTO_TITULAR);
            break;

        case 'CoownerData':
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#personal-data-content').removeClass('hidden');
            $('#cotitular-content-head').prevAll().removeClass('hidden').addClass('complete');
            $('#cotitular-content-head').removeClass('hidden');
            $('#cotitular-content').removeClass('hidden');
            window.scrollWindow('personaldata-address-content-head');
            sessionStorage.setItem("PageEnum", PageEnum.COTITULARES);
            break;

        case 'CoInheritorData':
            if (GMT != undefined) GMT.PushEventContinuar();           
            $('#personal-data-content').removeClass('hidden');
            $('#coheredero-content-head').prevAll().removeClass('hidden').addClass('complete');
            $('#coheredero-content-head').removeClass('hidden');
            $('#coheredero-content').removeClass('hidden');
            $('#cotitular-content-head').removeClass('complete').addClass('hidden');
            $('#autorizado-content-head').removeClass('complete').addClass('hidden');
            window.scrollWindow('personaldata-address-content-head');
            sessionStorage.setItem("PageEnum", PageEnum.COHEREDEROS);
            break;

        case 'UsufructuaryData':
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#personal-data-content').removeClass('hidden');
            $('#usufructuario-content-head').prevAll().removeClass('hidden').addClass('complete');
            $('#usufructuario-content-head').removeClass('hidden');
            $('#usufructuario-content').removeClass('hidden');
            $('#cotitular-content-head').removeClass('complete').addClass('hidden');
            $('#autorizado-content-head').removeClass('complete').addClass('hidden');
            window.scrollWindow('personaldata-address-content-head');
            sessionStorage.setItem("PageEnum", PageEnum.USUFRUCTUARIOS);
            break;

        case 'AgentData':
            $('#personal-data-content').removeClass('hidden');
            $('#apoderado-content').removeClass('hidden');
            $('#apoderado-content-head').prevAll().removeClass('hidden').addClass('complete');
            $('#apoderado-content-head').removeClass('hidden');
            Utils.scrollWindow('apoderado-content-head', -90);
            break;

        case 'AuthorizedData':
            $('#personal-data-content').removeClass('hidden');
            $('#autorizado-content-head').prevAll().removeClass('hidden').addClass('complete');
            vm.HideSpecificProductTabs();
            $('#autorizado-content-head').removeClass('hidden');
            $('#autorizado-content').removeClass('hidden');
            window.scrollWindow('personaldata-address-content-head');
            sessionStorage.setItem("PageEnum", PageEnum.AUTORIZADOS);
            break;

        case 'TutorData':
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#personal-data-content').removeClass('hidden');
            $('#tutor-content-head').prevAll().removeClass('hidden').addClass('complete');
            vm.HideSpecificProductTabs();
            $('#tutor-content-head').removeClass('hidden');
            $('#tutor-content').removeClass('hidden');
            if (vm.MainApplicant().ApplicantBasicData().RequestApplicantType() == RequestApplicantTypeEnum.DONACION) {
                $('#autorizado-content-head').removeClass('complete').addClass('hidden');
            }
            window.scrollWindow('personaldata-address-content-head');
            sessionStorage.setItem("PageEnum", PageEnum.TUTORES);
            break;

        case 'BeneficiaryData':
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#personal-data-content').removeClass('hidden');
            $('#beneficiario-content-head').prevAll().removeClass('hidden').addClass('complete');
            vm.HideSpecificProductTabs();
            $('#beneficiario-content-head').removeClass('hidden');
            $('#beneficiario-content').removeClass('hidden');
            window.scrollWindow('personaldata-address-content-head');
            sessionStorage.setItem("PageEnum", PageEnum.BENEFICIARIOS);
            break;

        case 'OperationData':
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#save-refund-button').css('display', 'none');
            $('#save-operation-button').css('display', '');
            $('#investment-content').removeClass('hidden');          
            $('#operationtype-data-content').removeClass('hidden');
            $('#operationtype-content-head').prevAll().removeClass('hidden').addClass('complete');
            vm.HideSpecificProductTabs();
            $('#operationtype-content-head').removeClass('hidden');
            $('#operationtype-content').removeClass('hidden');          
            $(window).scrollTop(0);
            sessionStorage.setItem("PageEnum", PageEnum.TIPO_OPERACION);
            break;

        case 'OperationIbanData':
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#save-operation-button').css('display', 'none');
            $('#save-refund-button').css('display', '');
            $('#investment-content').removeClass('hidden');
            $('#operationtype-data-content').removeClass('hidden');
            $('#iban-content-head').prevAll().removeClass('hidden').addClass('complete');
            vm.HideSpecificProductTabs();
            $('#iban-content-head').removeClass('hidden');
            $('#iban-content').removeClass('hidden');           
            $(window).scrollTop(0);
            sessionStorage.setItem("PageEnum", PageEnum.NUMERO_IBAN_REEMBOLSO);
            break;
     
        case 'OperationIbanAssistedData':
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#save-operation-button').css('display', 'none');
            $('#save-refund-button').css('display', '');
            $('#investment-iban-content').removeClass('hidden');
            $('#operationtype-data-content').removeClass('hidden');           
            $('#iban-content-head').removeClass('hidden');
            $('#iban-content-head').prevAll().removeClass('hidden').addClass('complete');
            vm.HideSpecificProductTabs();
            $('#iban-content-head').removeClass('hidden');
            $('#iban-content').removeClass('hidden');           
            $(window).scrollTop(0);
            sessionStorage.setItem("PageEnum", PageEnum.NUMERO_IBAN_REEMBOLSO);
            break;

        case 'SignatureData':
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#documents-content').removeClass('hidden');
            $('#signature-content-head').removeClass('hidden');
            $('#signature-content').removeClass('hidden');
            $(window).scrollTop(0);
            if (GMT != undefined) GMT.Push(PageEnum.SELECCION_FIRMA);
            sessionStorage.setItem("PageEnum", PageEnum.SELECCION_FIRMA);
            break;

        case 'SignatureDocumentData':
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#documents-content').removeClass('hidden');
            $('#signature-document-content-head').removeClass('hidden');
            $('#signature-document-content').removeClass('hidden');
            $('#documentationdelivery-others-content').removeClass('hidden');
            //window.scrollWindow('signature-document-content-head');
            $(window).scrollTop(0);
            if (GMT != undefined) GMT.Push(PageEnum.FIRMA_DOCUMENTOS);
            sessionStorage.setItem("PageEnum", PageEnum.FIRMA_DOCUMENTOS);
            break;

        case 'DocumentData':            
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#documents-content').removeClass('hidden');
            $('#applicant-document-content-head').removeClass('hidden');
            $('#applicant-document-content').removeClass('hidden');

            if (vm.MainApplicant().ApplicantBasicData().ApplicantType() == ApplicantTypeEnum.JURIDICA || vm.MainApplicant().ApplicantBasicData().ApplicantType() == ApplicantTypeEnum.FISICAEXTRANJERA) {
                $('#documentationdelivery-others-content').removeClass('hidden'); 
                $('#documentationdelivery-device-content').removeClass('hidden');
            }

            if (vm.MainApplicant().ApplicantBasicData().ApplicantType() == ApplicantTypeEnum.FISICA && vm.MainApplicant().DeliveryOptionsHidden()) {
                $('#documentationdelivery-others-content').removeClass('hidden');
            }

            //Utils.scrollWindow('applicant-document-content-head', -90);
            $(window).scrollTop(0);
            if (GMT != undefined) GMT.Push(PageEnum.ENVIO_DOCUMENTACION);
            sessionStorage.setItem("PageEnum", PageEnum.ENVIO_DOCUMENTACION);
            break;

        case "Success":
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#success-content').removeClass('hidden');
            $('#success-content-head').removeClass('hidden');
            $('#success-content-view').removeClass('hidden');
            $(window).scrollTop(0);
            if (GMT != undefined) GMT.Push(PageEnum.FINALIZAR);
            sessionStorage.setItem("PageEnum", PageEnum.FINALIZAR);
            break;

        case "Error":
            if (GMT != undefined) GMT.PushEventContinuar();
            $('#error-content').removeClass('hidden');
            $(window).scrollTop(0);
            if (GMT != undefined) GMT.Push(PageEnum.ERROR);
            sessionStorage.setItem("PageEnum", PageEnum.ERROR);
            break;
        default:         
            if (_nextstep.indexOf('TestData') == 0) {
                var substep = _nextstep.split('-')[0];
                var testType = substep.substr(substep.length - 1);

                if (GMT != undefined) GMT.PushEventContinuar();
                $('#test-content').removeClass('hidden');
                if (GMT != undefined) GMT.Push(testType == 1 ? PageEnum.CONOCIMIENTO : PageEnum.CONVENIENCIA);
                sessionStorage.setItem("PageEnum", (testType == 1 ? PageEnum.CONOCIMIENTO : PageEnum.CONVENIENCIA));
                dataStep = 'TestData';
                vm.ShowApplicantTest(testType, _nextstep.split('-')[1]);
                if (testType > 1) {
                    Utils.scrollWindow('convenience-form-title', -100);
                } else {
                    Utils.scrollWindow('header-applicant-test', -100);
                }

                

                var radioAnswers = {};
                $('.f-conveniencia-operaciones-element input[type="radio"]').each(function () {
                    var val = $(this).data('answer');
                    if ($(this).is(':checked') && val != undefined && val.toLowerCase() == 'no') {
                        radioAnswers[$(this).attr('id')] = true;
                    }
                });

                //if ($('.f-conveniencia-operaciones-element input[type="radio"]:checked').length >= 2) {
                //    $('#tl-financieros-cont').show();
                //}
            }
    }
    Navigation.SetProcessTracker($('[data-step^="' + dataStep + '"]').data('circle'), $('[data-step^="' + dataStep + '"]').data('progress'));
    vm.CurrentStep = _nextstep;
    window.SetCleaveClass();
}

Navigation.UpdateCircles = function () {
    var $circles = jQuery('.circle_complete');

    $circles.each(function () {

        var $circle = jQuery(this),
            radius = $circle.attr('r'),
            $li = $circle.closest('.module_list-element'),
            perc = $li.attr('data-perc'),
            $number = $li.find('.number-data'),
            zero,
            newOffset,
            opacity,
            clase = $li.attr('class');

        zero = Math.PI * radius * 2;
        newOffset = zero - (zero * (perc / 100));

        opacity = (.3 + (.7 * (Number(perc) / 100)));

        $circle.css('stroke-dashoffset', newOffset);
        $number.css('opacity', opacity);

    });

};

Navigation.EditData = function (step, scope, currentstep) {
    location.hash = '#' + currentstep;
}

Navigation.SetProcessTracker = function (progressItem, perc) {

    $('.module_list-element').removeClass('active').removeClass('complete').addClass('inactive');


    if (progressItem > 1) {
        var currentProgress = 1;
        while (currentProgress < progressItem) {
            $('.module_list-element').each(function () {
                var elem = $(this);
                if (elem.is('#progress-' + currentProgress)) {
                    elem.attr('data-perc', 100).addClass('complete').removeClass('inactive').addClass('active');
                }
            })
            currentProgress++;
        }
        Navigation.UpdateCircles();
    }

    $('.module_list-element').each(function () {
        var elem = $(this);

        if (elem.is('#progress-' + progressItem)) {

            elem.removeClass('inactive').addClass('active');

            if (perc < 100) {
                elem.attr('data-perc', perc);
                Navigation.UpdateCircles();
            }

            if (perc >= 100) {
                elem.attr('data-perc', 100);
                Navigation.UpdateCircles();
            }
        }
    })

}

Navigation.goToPrevioustStep = function (currentStep) {
    var currentStepOrder = vm.StepsOrder.indexOf(currentStep) + 1;
    if (currentStepOrder > -1) {
        if (disabledBackStates.indexOf(vm.CurrentStep) == -1) {
            vm.CheckMinor();
            if ((currentStepOrder == 6 || currentStepOrder == 7) && currentStep == "OperationIbanData") {
                vm.CheckApplicantType(vm.StepsOrder[(currentStepOrder > 0) ? currentStepOrder - 2 : 0]);
                Navigation.ShowNextStep("OperationData");
            } else {
                vm.CheckApplicantType(vm.StepsOrder[(currentStepOrder > 0) ? currentStepOrder - 1 : 0]);
                Navigation.ShowNextStep(currentStep);
            }
        } else { 
            location.hash = '#' + vm.CurrentStep; //restauramos el hash para no navegar
        }
        if (vm.CurrentType() == 5) {
            var tutors = (
                $.grep(vm.listaOtherApplicants(), function (e) {
                    return e.ApplicantBasicData().RequestApplicantType() == 5;
                })
            );

            if (tutors.length == 0) {
                vm.radioSelectedOptionValue('S');
            } else {
                vm.radioSelectedOptionValue('N');
            }
        } else {
            vm.radioSelectedOptionValue('N');
        }
    }
};

Navigation.DisableReload = false;
$(window).on('hashchange', function () {
    if (location.hash) {
        var _currentHash = location.hash.split('#')[1];
        if (_currentHash != '') {
            if (vm.StepsOrder.indexOf(_currentHash) < vm.StepsOrder.indexOf(vm.CurrentStep)) {
                Navigation.DisableReload = false;
                Navigation.goToPrevioustStep(_currentHash);
            } else if (vm.StepsOrder.indexOf(_currentHash) > vm.StepsOrder.indexOf(vm.CurrentStep)) {
                if (Navigation.DisableReload) {
                    Navigation.DisableReload = false;
                } else {
                    vm.goToNextStep(function () {
                        Navigation.DisableReload = false;
                    }, function () {
                        Navigation.DisableReload = false;
                        history.back();
                    });
                }
            } else {
                if (Navigation.DisableReload) {
                    Navigation.DisableReload = false;
                } else {
                    Navigation.ShowNextStep(vm.CurrentStep);
                }
            }
        }
    }
});
var disabledBackStates = ["SignatureData", "SignatureDocumentData", "DocumentData", "Success", "Error"];
//var disabledBackStates = [];


