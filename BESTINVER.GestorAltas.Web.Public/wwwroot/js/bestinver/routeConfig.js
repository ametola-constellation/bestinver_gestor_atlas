var routeConfig = {
    GA_Register_PhysicalPersons_PersonalData: sitePreffix + "/fisica/PersonalDataView",
    GA_Register_JuridicPersons_PersonalData: sitePreffix + "/juridica/PersonalDataView",
    GA_Register_ForeignPersons_PersonalData: sitePreffix + "/extranjero/PersonalDataView",
    GA_Register_PopPup_popup_contact: sitePreffix + "/popup/popup-contact.html",
    GA_Register_PopPup_popup_hedge_value: sitePreffix + "/popup/popup-hedge-value.html",
    GA_Register_PopPup_popup_help: sitePreffix + "/popup/popup-help.html",
    GA_Register_PopPup_popup_legal: sitePreffix + "/popup/popup-legal.html",
    GA_Register_PopPup_popup_cta_access: sitePreffix + "/popup/popup-general-cta-access.html",
    GA_Register_PopPup_popup_alta_juridica: sitePreffix + "/popup/popup-alta-juridica.html",
    GA_Register_PopPup_popup_gdpr: sitePreffix + "/popup/popup-gdpr.html",
    GA_Register_PopPup_popup_test_remediation_finished: sitePreffix + "/popup/popup-test-remediation-finished.html"
};

var apiConfig = {
    API_Master_GetOperationByProductAndApplicantType: sitePreffix + "/Master/GetOperationTypes",
    API_Master_GetQuestionsByApplicantTypeAndRequestApplicantType: sitePreffix + "/Master/GetQuestions",
    API_Master_FundsData: sitePreffix + "/Master/FundsData",
    API_Master_PlansData: sitePreffix + "/Master/PlansData",
    API_Master_IsinData: sitePreffix + "/Master/IsinData",
    API_Master_ComsData: sitePreffix + "/Master/ComsData",
    API_Master_FundDetail: sitePreffix + "/Master/FundDetail",
    API_Master_GetQuestions: sitePreffix + "/Master/GetAllQuestions",
    API_Master_GetQuestionsByProduct: sitePreffix + "/Master/GetQuestionsByProduct",
    

    API_Register_SaveApplicantBasicData: sitePreffix + "/Register/SaveApplicantBasicData",
    API_Register_SaveRequestData: sitePreffix + "/Register/SaveRequestData",
    API_Register_SaveSignatureData: sitePreffix + "/Register/SaveSignatureData",
    API_Register_RestoreSignatureProcess: sitePreffix + "/Register/RestoreSignatureProcess",
    API_Register_SaveDNIData: sitePreffix + "/Register/SaveDNIData",
    API_Register_SendHelpMail: sitePreffix + "/Register/SendHelpMail",
    API_Register_CompleteProcess: sitePreffix + "/Register/CompleteProcess",
    API_Register_SendDocumentProcess: sitePreffix + "/Register/SendDocumentProcess",
    API_Register_SetApplicantGDPR: sitePreffix + "/Register/SetApplicantGDPR",
    API_Register_MoveTonextStatus: sitePreffix + "/Register/MoveToNextStatus",
    API_Register_SetApplicantSignDate: sitePreffix + "/Register/SetApplicantSignDate", 
    API_Register_CheckConvenience: sitePreffix + "/Register/CheckConvenience", 
    API_Register_CheckConvenienceExistingApplicant: sitePreffix + "/Register/CheckConvenienceExistingApplicant",

    API_Juridica_SaveApplicantBasicData: sitePreffix + "/Juridica/SaveApplicantBasicData",
    API_Juridica_SaveRequestData: sitePreffix + "/Juridica/SaveRequestData",
    API_Juridica_SaveSignatureData: sitePreffix + "/Juridica/SaveSignatureData",
    API_Juridica_RestoreSignatureProcess: sitePreffix + "/Juridica/RestoreSignatureProcess",
    API_Juridica_SaveDNIData: sitePreffix + "/Juridica/SaveDNIData",
    API_Juridica_SendHelpMail: sitePreffix + "/Juridica/SendHelpMail",
    API_Juridica_LegalModalContent: sitePreffix + "/Juridica/LegalModalContent",
    API_Juridica_CompleteProcess: sitePreffix + "/Juridica/CompleteProcess",
    API_Juridica_AskForRequiredRealOwner: sitePreffix + "/Juridica/AskForRequiredRealOwner",
    API_Juridica_Remediation_AskForRequiredRealOwner: sitePreffix + "/Remediacion/AskForRequiredRealOwner",
    API_Juridica_CheckConvenience: sitePreffix + "/Juridica/CheckConvenience", 

    API_Extranjero_SaveDNIData: sitePreffix + "/Extranjero/SaveDNIData",
};

var errorConfig = {
    API_Log_Error: sitePreffix + "/Error/LogError",
    API_Log_Debug: sitePreffix + "/Error/LogDebug"
};