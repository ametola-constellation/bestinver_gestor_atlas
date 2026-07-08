using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
using BestInver.WebPrivada.Shared.Models.Microservices.Products.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Representatives;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Shared;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Documents;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Middleware.MiddleOffice;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Response;
using BESTINVER.GestorAltas.Domain.Extensions;
using BESTINVER.GestorAltas.Domain.Interfaces;
using BESTINVER.GestorAltas.Exceptions;
using BESTINVER.GestorAltas.MicroservicesProxy.Enums;
using BESTINVER.GestorAltas.MicroservicesProxy.Exceptions;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using BESTINVER.GestorAltas.MicroservicesProxy.Services.Validators;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Models.Applicants;
using BESTINVER.GestorAltas.Web.Models.Requests;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ConvenientResponse = BESTINVER.GestorAltas.Web.Models.Tests.ConvenientResponse;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class RegisterService : IRegisterService
    {
        protected readonly IApplicantService applicantservice;
        protected readonly ISignUpService singupService;
        protected readonly IAppSettings appSettings;
        protected readonly ICustomersService customersService;
        protected readonly IAlertService alertService;
        protected readonly IRequestService requestService;
        protected readonly ITestService testService;
        protected readonly IMapper mapper;
        protected readonly ISignaturesService signaturesService;
        protected readonly ISendMailService sendMailService;
        protected readonly ISignUpService signUpService;
        protected readonly IAmlService amlService;
        protected readonly IProductService productService;
        protected readonly ISharedService sharedService;
        protected readonly IRepresentativesService representativeService;
        protected readonly ILogger<RegisterService> logger;

        public RegisterService(
            IApplicantService applicantservice,
            ISignUpService singupService,
            IAppSettings appSettings,
            ICustomersService customersService,
            IAlertService alertService,
            IRequestService requestService,
            ITestService testService,
            IMapper mapper,
            ISignaturesService signaturesService,
            ISendMailService sendMailService,
            ISignUpService signUpService,
            IAmlService amlService,
            IProductService productService,
            ISharedService sharedService,
            IRepresentativesService representativesService,
            ILogger<RegisterService> logger
            )
        {
            this.applicantservice = applicantservice;
            this.singupService = singupService;
            this.appSettings = appSettings;
            this.customersService = customersService;
            this.alertService = alertService;
            this.requestService = requestService;
            this.testService = testService;
            this.mapper = mapper;
            this.signaturesService = signaturesService;
            this.sendMailService = sendMailService;
            this.signUpService = signUpService;
            this.amlService = amlService;
            this.productService = productService;
            this.sharedService = sharedService;
            this.representativeService = representativesService;
            this.logger = logger;
        }

        #region Public methods

        public async Task<Request> SaveBasicData(SignUpApplicant applicantData, RequestData requestData)
        {
            Request returnValue = null;
            Exception ex = null;

            requestData.RequestId = requestData.RequestId.HasValue && requestData.RequestId.Value != Guid.Empty ? requestData.RequestId.Value : Guid.NewGuid();
            requestData.IdRequest = $"{DateTime.UtcNow:yyyyMMdd}-{applicantData.BasicData.Dni}-001";
            requestData.RequestStartDate = DateTime.UtcNow;
            requestData.ParentRequestId = requestData.RequestId;

            applicantData.PersonalData = new SignUpRequestApplicantPersonalData
            {
                Gender = (int)GenderType.Hombre
            };

            var newApplicantRole = new RequestApplicant
            {
                Applicant = new Applicant
                {
                    DNI = applicantData.BasicData.Dni
                },
                ApplicantRoleType = new ApplicantRole
                {
                    Id = applicantData.BasicData.RequestApplicantType
                },
                LifeCicleOk = applicantData.BasicData.LifeCicleOk,
                SentDni = false
            };

            applicantData.ApplicantRole = [
                new SignUpApplicantRole
                {
                    IdApplicant = applicantData.BasicData.Dni,
                    RequestApplicantType = applicantData.BasicData.RequestApplicantType,
                    RequestId = requestData.RequestId.Value
                }
            ];

            IEnumerable<IRegisterValidator> validators = await CreateValidators(applicantData, requestData.RequestId.Value).ConfigureAwait(false);
            List<Alert> alerts = [];
            bool abortRequest = false;
            RegisterValidateResult requestResult = null;
            Request requestToContinue;

            foreach (IRegisterValidator validator in validators)
            {
                var resultValidator = validator.Validate();

                if (validator.GetType() == typeof(RegisterValidateRequestHolder))
                {
                    requestResult = resultValidator;
                }

                if (resultValidator.alerts != null && resultValidator.alerts.Any())
                    alerts.AddRange(resultValidator.alerts);

                if (resultValidator.customException != null)
                {
                    if (resultValidator.customException.GetType() == typeof(RequestForbiddenException))
                    {
                        ex = resultValidator.customException;
                    }
                    else if (requestData.IdInitialProduct != (int)ProductNames.ADVICE_PRODUCT)
                    {
                        throw resultValidator.customException;
                    }
                }

                abortRequest = abortRequest || resultValidator.blockRegister;
            }

            if (requestResult != null)
            {
                switch (requestResult.requestResult)
                {
                    case RegisterValidationRequestResult.NewRequest:
                        {
                            var app = await applicantservice.GetApplicantByDNI(applicantData.BasicData.Dni).ConfigureAwait(false);
                            if (app == null)
                            {
                                try
                                {
                                    await applicantservice.Insert(applicantData).ConfigureAwait(false);
                                }
                                catch (Exception exc)
                                {
                                    var saveBasicDataException = new SaveBasicDataException($"SaveBasicData error: {exc.GetBaseException().Message}");
                                    var basicDataJson = JsonConvert.SerializeObject(applicantData.BasicData);
                                    logger.LogError(saveBasicDataException, "Exception save basic data: {Message} | BasicData: {BasicDataJson}", saveBasicDataException.Message, basicDataJson);
                                    logger.LogError(exc, "Exception save basic data: {Message} | BasicData: {BasicDataJson}", saveBasicDataException.Message, basicDataJson);//Añado una excepción nueva para tener todo el registro de la excepción y mantengo la antigua para no perder la información de la excepción original
                                    throw saveBasicDataException;
                                }
                            }
                            var result = await singupService.InsertRequest(requestData).ConfigureAwait(false);
                            await requestService.InsertApplicantRole(newApplicantRole, result.Id).ConfigureAwait(false);
                            await InitRequestStatus(result.Id).ConfigureAwait(false);
                            returnValue = result;
                            break;
                        }
                    case RegisterValidationRequestResult.ContinueRequest:
                        {
                            requestToContinue = requestResult.requestToContinue;
                            requestToContinue.Username = requestData.Username;
                            requestToContinue.IdSalesChannel = requestData.IdSalesChannel;
                            requestToContinue.ManagedByCommercial = requestData.ManagedByCommercial;
                            requestToContinue.AgentShippingMail = requestData.AgentShippingMail;
                            requestToContinue.RequestStartDate = DateTime.UtcNow;
                            requestToContinue.utm_campaign = requestData.UtmCampaign;
                            requestToContinue.utm_content = requestData.UtmContent;
                            requestToContinue.utm_medium = requestData.UtmMedium;
                            requestToContinue.utm_source = requestData.UtmSource;
                            requestToContinue.utm_term = requestData.UtmTerm;
                            requestToContinue.IdInitialProduct = requestData.IdInitialProduct;

                            await requestService.UpdateRequest(requestToContinue).ConfigureAwait(false);

                            //Actualizar datos del applicant por si han cambiado
                            var app = await applicantservice.GetApplicantByDNI(applicantData.BasicData.Dni).ConfigureAwait(false);
                            if (app != null)
                            {
                                await applicantservice.Update(applicantData).ConfigureAwait(false);
                            }

                            returnValue = requestToContinue;
                            break;
                        }
                    case RegisterValidationRequestResult.RenewRequest:
                        {
                            var requestCount = requestResult.requestToContinue.IdRequest.Split('-')[2]?.ToString();
                            if (Int32.TryParse(requestCount, out int count))
                            {
                                count++;
                                requestCount = $"{DateTime.UtcNow:yyyyMMdd}-{applicantData.BasicData.Dni}-{count:000}";
                                requestData.IdRequest = requestCount;
                            }

                            requestData.ParentRequestId = requestResult.ParentRequestId == Guid.Empty ? requestData.ParentRequestId : requestResult.ParentRequestId;
                            var result = await singupService.InsertRequest(requestData).ConfigureAwait(false);
                            await requestService.InsertApplicantRole(newApplicantRole, result.Id).ConfigureAwait(false);
                            await InitRequestStatus(result.Id).ConfigureAwait(false);

                            //Actualizar datos del applicant por si han cambiado
                            var app = await applicantservice.GetApplicantByDNI(applicantData.BasicData.Dni).ConfigureAwait(false);
                            if (app != null)
                            {
                                await applicantservice.Update(applicantData).ConfigureAwait(false);
                            }

                            returnValue = result;
                            break;
                        }
                    case RegisterValidationRequestResult.Abort:
                        {
                            break;
                        }
                }

                if (alerts.Count > 0)
                {
                    await alertService.Create(alerts).ConfigureAwait(false);
                }
            }

            if (ex != null)
            {
                throw ex;
            }

            return returnValue;
        }

        public async Task<bool> SaveRequestFullData(RequestFullData model)
        {
            var request = await requestService.GetRequest(model.RequestId.Value).ConfigureAwait(false);
            request.IdRequestSignature = model.SignatureType;
            request.IsEmployee = model.IsEmployee;
            request.AccountNumber = model.AccountNumber.Replace(" ", string.Empty);
            request.AccountNumberAcceptanceDate = model.AccountNumberAcceptanceDate;

            var requestOperation = model.OperationData.FirstOrDefault();
            var amount = requestOperation?.Operation?.FirstOrDefault()?.Amount;
            var fundtype = await productService.GetProductOperationClass(requestOperation.ProductId, amount, model.IsEmployee);

            request.IdFoundType = string.IsNullOrEmpty(fundtype) ? null : fundtype;

            await requestService.UpdateRequest(request).ConfigureAwait(false);
            await InsertRequestStatus(model.RequestId.Value, (int)RequestStatusEnum.PendingSignature).ConfigureAwait(false);

            List<Alert> alerts = [];
            Dictionary<string, IEnumerable<RegisterValidateResult>> validatorResultByApplicant = [];

            var applicantsToValidate = model.Applicants.Where(a => a.BasicData.RequestApplicantType != (int)ApplicantRoleType.Titular
                && a.BasicData.RequestApplicantType != (int)ApplicantRoleType.Heredero
                && a.BasicData.RequestApplicantType != (int)ApplicantRoleType.BeneficiarioDonacion
                && a.BasicData.RequestApplicantType != (int)ApplicantRoleType.Minusvalido
                && a.BasicData.RequestApplicantType != (int)ApplicantRoleType.TitularAndTutor
                && a.BasicData.RequestApplicantType != (int)ApplicantRoleType.HerederoAndTutor);

            var titularDni = model.Applicants.FirstOrDefault(a => a.BasicData.RequestApplicantType == (int)ApplicantRoleType.Titular
                || a.BasicData.RequestApplicantType == (int)ApplicantRoleType.Heredero
                || a.BasicData.RequestApplicantType == (int)ApplicantRoleType.BeneficiarioDonacion
                || a.BasicData.RequestApplicantType == (int)ApplicantRoleType.Minusvalido
                || a.BasicData.RequestApplicantType == (int)ApplicantRoleType.TitularAndTutor
                || a.BasicData.RequestApplicantType == (int)ApplicantRoleType.HerederoAndTutor).BasicData.Dni;

            var titular = await applicantservice.GetApplicantByDNI(titularDni).ConfigureAwait(false);

            var validatorByApplicant = await GetValidatorsByApplicants(applicantsToValidate, model.RequestId.Value).ConfigureAwait(false);

            List<SignUpApplicant> applicantsToUpdate = [titular];
            List<Task> tasks = [];
            List<Exception> exceptions = [];
            List<Test> test = [];

            foreach (var applicantValidator in validatorByApplicant)
            {
                List<RegisterValidateResult> resultList = [];
                foreach (var validator in applicantValidator.Value)
                {
                    var resultValidator = validator.Validate();

                    if (resultValidator.alerts != null && resultValidator.alerts.Any())
                        await alertService.Create(alerts).ConfigureAwait(false);

                    resultList.Add(resultValidator);

                    if (resultValidator.customException != null)
                    {
                        exceptions.Add(resultValidator.customException);
                    }

                    if (validator.GetType() == typeof(RequestValidateApplicant))
                    {
                        var applicant = ((RequestValidateApplicant)validator).GetApplicant();
                        if (applicant != null)
                            applicantsToUpdate.Add(applicant);
                    }
                }
                validatorResultByApplicant.Add(applicantValidator.Key, resultList);
            }

            if (exceptions.Count > 0)
            {
                await InsertRequestStatus(model.RequestId.Value, (int)RequestStatusEnum.Locked).ConfigureAwait(false);
                throw exceptions.FirstOrDefault();
            }

            foreach (var app in model.Applicants)
            {
                bool hasToSign = app.BasicData.ApplicantType != (int)PersonTypeEnum.Juridica && (app.BasicData.RequestApplicantType != (int)ApplicantRoleType.Beneficiario && app.PersonalData.Birthday.HasValue && !app.PersonalData.Birthday.IsMinor());
                var newApplicantRole = new RequestApplicant
                {
                    Applicant = new Applicant
                    {
                        DNI = app.BasicData.Dni
                    },
                    ApplicantRoleType = new ApplicantRole
                    {
                        Id = app.BasicData.RequestApplicantType
                    },
                    LifeCicleOk = app.BasicData.LifeCicleOk,
                    SentDni = false,
                    Percentage = app.ApplicantRole.FirstOrDefault().Percentage,
                    HasToSign = hasToSign
                };

                var validateResult = validatorResultByApplicant.FirstOrDefault(v => v.Key == app.BasicData.Dni);
                RegisterValidateResult applicantResult = validateResult.Value != null ? validateResult.Value.FirstOrDefault(v => v.registerValidationType == RegisterValidationType.Applicant) : new RegisterValidateResult
                {
                    applicantResult = RegisterValidationApplicantResult.Update,
                    applicantRoleResult = RegisterValidationApplicantRoleResult.Update
                };

                switch (applicantResult.applicantResult)
                {
                    case RegisterValidationApplicantResult.Add:
                        {
                            await applicantservice.Insert(app).ConfigureAwait(false);
                            break;
                        }

                    case RegisterValidationApplicantResult.Update:
                        {
                            tasks.Add(applicantservice.Update(app));
                            break;
                        }
                }

                if (applicantResult.applicantRoleResult == RegisterValidationApplicantRoleResult.Add)
                {
                    tasks.Add(requestService.InsertApplicantRole(newApplicantRole, model.RequestId.Value));
                }
                else if (applicantResult.applicantRoleResult == RegisterValidationApplicantRoleResult.Update)
                {
                    tasks.Add(requestService.UpdateApplicantRole(newApplicantRole, model.RequestId.Value));
                }

                await applicantservice.DeleteApplicantCountry(app.BasicData.Dni).ConfigureAwait(false);
                await applicantservice.DeleteApplicantDocument(app.BasicData.Dni).ConfigureAwait(false);

                foreach (var question in app.QuestionAnswers)
                {
                    var questionAnswer = new Test
                    {
                        Answer = new TestAnswer
                        {
                            Id = question.IdAnswer,
                            OtherAnswer = question.OtherAnswer
                        },
                        Question = new TestQuestion
                        {
                            Id = question.IdQuestion
                        },
                        RequestId = request.Id,
                        User = new TestUser
                        {
                            DNI = app.BasicData.Dni
                        }
                    };

                    test.Add(questionAnswer);
                }

                foreach (var country in app.Countries)
                {
                    tasks.Add(applicantservice.SetApplicantCountries(new BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.CountryInfo
                    {
                        CountryId = country.CountryId,
                        CountryTypeId = country.CountryTypeId
                    }, app.BasicData.Dni));
                }

                foreach (var document in app.ApplicantIDDocuments)
                {
                    tasks.Add(applicantservice.SetApplicantDocument(new BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.IdDocumentInfo
                    {
                        Id = document.DocumentID,
                        Number = document.DocumentNumber,
                        ExpirationDate = document.ExpirationDate
                    }, app.BasicData.Dni));
                }
            }

            foreach (var prodOperation in model.OperationData)
            {
                foreach (var operation in prodOperation.Operation)
                {
                    var op = mapper.Map<RequestOperation>(operation);

                    var requestProductOperation = new RequestProductOperation
                    {
                        Operation = op,
                        Product = new RequestProduct
                        {
                            Id = prodOperation.ProductId
                        }
                    };
                    tasks.Add(requestService.InsertRequestOperation(requestProductOperation, model.RequestId.Value));
                }
            }

            await Task.WhenAll(tasks).ConfigureAwait(false);

            if (test.Count > 0 && test.FirstOrDefault().RequestId.ToString() != null
                && test.FirstOrDefault().RequestId.ToString() != string.Empty)
            {
                await testService.ResetApplicantTest(test).ConfigureAwait(false);
            }

            await signUpService.CheckConveniencia(model.RequestId.Value).ConfigureAwait(false);

            List<Task> requestfinalTasks = [];
            var amlAlerts = amlService.CheckForAmlAlerts(model.RequestId.Value);
            requestfinalTasks.Add(amlAlerts);
            requestfinalTasks.Add(CheckProductAlert(model.OperationData, model.RequestId.Value, model.Username, titularDni));
            requestfinalTasks.Add(requestService.ValidateUniqueMobile(model.RequestId.Value));
            requestfinalTasks.Add(requestService.ValidateSameMobile(model.RequestId.Value));
            requestfinalTasks.Add(CheckBlockingSignature(model.RequestId.Value));

            await Task.WhenAll(requestfinalTasks).ConfigureAwait(false);

            var requestFinal = await requestService.GetRequest(model.RequestId.Value).ConfigureAwait(false);

            int[] alertabloqueables;
            bool existAlert = false;
            bool isJuridic = model.Applicants.Any(a => a.BasicData.ApplicantType == (int)PersonTypeEnum.Juridica);

            bool isRestrictedCountry = model.Applicants.Any(a => a.Countries.Any(c => (c.CountryTypeId == (int)CountryType.Nationality && appSettings.RestrictedCountriesIds.Contains(c.CountryId))
            || (c.CountryTypeId == (int)CountryType.Birth && appSettings.RestrictedCountriesIds.Contains(c.CountryId))
            || (c.CountryTypeId == (int)CountryType.MainResidence && appSettings.RestrictedCountriesIds.Contains(c.CountryId))
            || (c.CountryTypeId == (int)CountryType.SecondaryResidence && appSettings.RestrictedCountriesIds.Contains(c.CountryId))
            || (c.CountryTypeId == (int)CountryType.MostProfitableCountry && appSettings.RestrictedCountriesIds.Contains(c.CountryId)))
            || (a.QuestionAnswers.Any(q => (q.IdQuestion == 34 && appSettings.RestrictedCountriesIds.Contains(q.IdAnswer)) || (q.IdQuestion == 39 && appSettings.RestrictedCountriesIds.Contains(q.IdAnswer)))));

            if (isJuridic)
            {
                var alertList = new List<Alert>
                {
                    new() {
                        AlertType = new AlertType
                        {
                            Id = (int)AlertTypes.AlertaPendienteValidarJuridico
                        },
                        BeginDate = DateTime.UtcNow,
                        Details = "Alerta pendiente de validar por jurídico",
                        RequestId = model.RequestId
                    },
                    new() {
                        AlertType = new AlertType
                        {
                            Id = (int)AlertTypes.AlertaDNI
                        },
                        BeginDate = DateTime.UtcNow.AddSeconds(5),
                        Details = "Alerta pendiente validar documentación",
                        RequestId = model.RequestId
                    }
                };

                await alertService.Create(alertList).ConfigureAwait(false);

                alertabloqueables = [(int)RequestAlertTypes.AlertaPBC, (int)RequestAlertTypes.AlertaPendienteValidarJuridico, (int)RequestAlertTypes.AlertaDNI];
            }
            else
            {
                alertabloqueables = [(int)RequestAlertTypes.AlertaPBC, (int)RequestAlertTypes.AlertaProducto, (int)RequestAlertTypes.AlertaErrorAria, (int)RequestAlertTypes.AlertaFirmaBloqueada, (int)RequestAlertTypes.AlertaMovilDuplicado, (int)RequestAlertTypes.AlertaDatosPersonales];
            }

            if (requestFinal.Alerts.Any(a => alertabloqueables.Contains(a.AlertType.Id)) || isJuridic)
            {
                await InsertRequestStatus(model.RequestId.Value, (int)RequestStatusEnum.Locked).ConfigureAwait(false);
                existAlert = true;
            }

            if (isRestrictedCountry)
            {
                throw new AccountException("Debido a la situación actual, el Grupo Bestinver se ve obligado a limitar la operativa por la web. Por favor, póngase en contacto con nosotros en el siguiente número de teléfono 900 878 280");
            }

            if (existAlert && !isJuridic)
            {
                if (requestFinal.Alerts.Any(a => a.AlertType.Id == (int)RequestAlertTypes.AlertaFirmaBloqueada))
                    throw new BlockSignatureException();

                throw new InvalidOperationException("Muchas gracias por completar el proceso de alta. El equipo de Relación con el Inversor se pondrá en contacto con usted para indicarle  los siguientes pasos a seguir.");
            }

            return true;
        }

        public async Task<SignedDocumentData> SaveSignatureData(RequestFullData model, bool generateDoc = true)
        {
            var requestID = model.RequestId.Value;
            SignedDocumentData docs = new();


            Request request = await requestService.GetRequest(requestID).ConfigureAwait(false);

            request.RequestDocumentGroup = new RequestDocumentGroup
            {
                DocumentSignatureTypeId = model.requestDocumentGroup.DocumentSignatureTypeId,
                SendingWayId = model.requestDocumentGroup.SendingWayId
            };

            await requestService.UpdateRequest(request).ConfigureAwait(false);

            if (generateDoc)
            {
                Request result = await requestService.GetRequest(requestID).ConfigureAwait(false);

                var signUpRequest = new SignRequest
                {
                    Request = result,
                    ManagedByCommercial = model.ManagedByCommercial ?? false
                };

                docs = await signaturesService.GetEcerticDocuments(signUpRequest).ConfigureAwait(false);
            }

            if (model.requestDocumentGroup.DocumentSignatureTypeId != (int)DocumentSignatureType.Digital &&
                 request.Product?.ProductType?.Id != (int)ProductTypeMOEnum.Asesoramiento)
            {
                var alert = new Alert
                {
                    RequestId = model.RequestId,
                    AlertType = new AlertType
                    {
                        Id = (int)AlertTypes.AlertaEnvioDocumentacion
                    },
                    BeginDate = DateTime.UtcNow,
                    Details = model.requestDocumentGroup.SendingWayId == (int)SendingWayType.Adjuntar_Doc ? "El cliente ha solicitado descargar e imprimir los documentos." : "El cliente ha solicitado los documentos para la firma por envío postal."
                };
                await alertService.Create(alert).ConfigureAwait(false);
            }

            return docs;
        }

        public async Task<ChangeRequestStatusModelResponse> ChangeRequestStatus(ChangeRequestStatusModel model)
        {
            var statusList = new List<RequestStatus>();
            var showPendingSignaturePopUp = false;

            var request = await requestService.GetRequest(model.RequestId).ConfigureAwait(false);

            if (request != null)
            {
                var status = request.Status.OrderByDescending(r => r.StartDate).FirstOrDefault();
                var digitalDocumentSignature = request.RequestDocumentGroup != null && (request.RequestDocumentGroup.DocumentSignatureTypeId == (int)DocumentSignatureType.Digital);
                bool isSigned = request.Applicants.Any(a => a.HasToSign.GetValueOrDefault(false) && a.SignDate.HasValue) || request.Representatives.Any(r => r.SignDate.HasValue);

                if (status != null && (status.IdStatus == (int)RequestStatusEnum.PendingSignature) && digitalDocumentSignature)
                {
                    if (isSigned && !model.NoRestrictions)
                    {
                        showPendingSignaturePopUp = true;
                        return new ChangeRequestStatusModelResponse { StatusList = statusList, ShowPendingSignaturePopUp = showPendingSignaturePopUp };
                    }
                    else
                    {
                        request.RequestDocumentGroup.SendingWayId = (int)SendingWayType.Adjuntar_Doc;
                        request.RequestDocumentGroup.DocumentSignatureTypeId = (int)DocumentSignatureType.Manuscrita;
                        showPendingSignaturePopUp = true;

                        await requestService.UpdateRequest(request).ConfigureAwait(false);
                    }
                }

                statusList = GetNextStatusList(request, model.Comments, model.Responsible, model.NoRestrictions, model.FromManagement).ToList();
                await requestService.Add(statusList).ConfigureAwait(false);
            }

            return new ChangeRequestStatusModelResponse { StatusList = statusList, ShowPendingSignaturePopUp = showPendingSignaturePopUp };
        }

        public async Task SendToMailteckIfDigital(Guid requestId)
        {
            var request = await requestService.GetRequest(requestId).ConfigureAwait(false);
            if (request.RequestDocumentGroup.DocumentSignatureTypeId == (int)DocumentSignatureType.Digital && request.Product.RepresentativeSign == true && request.Product.BatchSignTypes.IdBatchSignType == (int)EProductBatchType.DigitalSignRepresentatives && request.TransactionId == null)
            {
                bool resul = await this.representativeService.SendToMailTeck(request.Id);
                if (!resul)
                    throw new Exception("Ha habido un error en el proceso. Contacte con el Administrador");
            }
        }
        public async Task<Alert> CreateAlert(Alert alert)
        {
            var request = await requestService.GetRequest(alert.RequestId.Value).ConfigureAwait(false);
            bool insertalert = true;
            var currentStatus = request.Status.OrderByDescending(r => r.StartDate).FirstOrDefault();

            var alerts = request.Alerts.Where(a => a.AlertType.Id == alert.AlertType.Id && a.Details == alert.Details).ToList();

            if (alerts.Any(a => a.EndDate == null))
            {
                insertalert = false;
            }

            if (insertalert)
            {
                var alertList = request.Alerts.ToList();
                alertList.Add(alert);
                request.Alerts = alertList;
                var newStatus = UpdateRequestStatus(request);
                alert = await alertService.Create(alert).ConfigureAwait(false);

                if (currentStatus.IdStatus != newStatus.IdStatus)
                {
                    List<RequestStatus> status = [newStatus];
                    await requestService.Add(status).ConfigureAwait(false);
                }
            }
            return alert;
        }

        public async Task SolveAlert(Alert alert)
        {
            //Se busca la alerta para mantener la fecha de inicio en caso de que ya exista y no se actualice.
            var existingAlerts = await alertService.Search(new RequestAlertMOSearch { IdRequest = alert.RequestId });
            var existingAlert = existingAlerts.Items.FirstOrDefault(a => a.Id == alert.Id);
            if (existingAlert != null && existingAlert.BeginDate.HasValue)
            {
                alert.BeginDate = existingAlert.BeginDate;
            }

            await alertService.Update(alert).ConfigureAwait(false);
            var request = await requestService.GetRequest(alert.RequestId.Value).ConfigureAwait(false);
            var currentStatus = request.Status.OrderByDescending(r => r.StartDate).FirstOrDefault();

            if (alert.Status == AlertStatus.Denied)
            {
                var cancelStatus = new RequestStatus
                {
                    IdRequest = request.Id,
                    Responsible = alert.Responsible,
                    Comments = alert.Comments,
                    IdStatus = (int)RequestStatusEnum.Canceled,
                    StartDate = DateTime.UtcNow
                };
                List<RequestStatus> status = [cancelStatus];
                await requestService.Add(status).ConfigureAwait(false);
            }
            else
            {
                var newStatus = UpdateRequestStatus(request);
                if (currentStatus.IdStatus != newStatus.IdStatus && alert.AlertType.Id != (int)AlertTypes.AlertaDNI)
                {
                    List<RequestStatus> status = [newStatus];
                    await requestService.Add(status).ConfigureAwait(false);
                }
            }

            var alerts = await alertService.Search(new BestInver.WebPrivada.Shared.Models.Middleware.MiddleOffice.RequestAlertMOSearch { IdRequest = alert.RequestId }).ConfigureAwait(false);
            bool hasMorePBCAlerts = alerts.Items.Any(a => a.AlertType.Id == (int)AlertTypes.AlertaPBC && !a.EndDate.HasValue);
            bool isJuridicRequest = request.Applicants.Any(a => a.Applicant.ApplicantType.Id == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Juridica);

            if (alert.AlertType.Id == (int)AlertTypes.AlertaPBC && !hasMorePBCAlerts && !isJuridicRequest)
            {
                await sendMailService.SendUnlockpbcalertMail(request.Id);
            }

            if (alert.AlertType.Id == (int)AlertTypes.AlertaPendienteValidarJuridico)
            {
                await CreatePendingDocumentGenerationAlert(alert.RequestId.Value);
            }
        }

        private async Task CreatePendingDocumentGenerationAlert(Guid requestId)
        {
            var alert = new Alert
            {
                RequestId = requestId,
                AlertType = new AlertType
                {
                    Id = (int)AlertTypes.AlertaPendienteGenerarDocumentacion
                },
                BeginDate = DateTime.UtcNow,
                Details = "Alerta pendiente de generar documentación"
            };
            await alertService.Create(alert);
        }

        public async Task<SignedDocumentData> GenerateJuridicDoc(RequestDocumentGroup documentGroup, Guid requestId)
        {
            Request request = await requestService.GetRequest(requestId).ConfigureAwait(false);

            var signUpRequest = new SignRequest
            {
                Request = request,
                Asynchronous = documentGroup.SendingWayId == (int)SendingWayType.FirmaOnline
            };

            if (documentGroup.SendingWayId != (int)SendingWayType.FirmaOnline &&
                request.Product?.ProductType?.Id != (int)ProductTypeMOEnum.Asesoramiento)
            {
                var alert = new Alert
                {
                    RequestId = requestId,
                    AlertType = new AlertType
                    {
                        Id = (int)AlertTypes.AlertaEnvioDocumentacion
                    },
                    BeginDate = DateTime.UtcNow,
                    Details = documentGroup.SendingWayId == (int)SendingWayType.Adjuntar_Doc ? "El cliente ha solicitado descargar e imprimir los documentos." : "El cliente ha solicitado los documentos para la firma por envío postal."
                };
                await alertService.Create(alert).ConfigureAwait(false);
            }

            if (request.RequestDocumentGroup == null)
            {
                request.RequestDocumentGroup = new RequestDocumentGroup
                {
                    DocumentSignatureTypeId = documentGroup.DocumentSignatureTypeId,
                    SendingWayId = documentGroup.SendingWayId
                };
            }
            else
            {
                request.RequestDocumentGroup.DocumentSignatureTypeId = documentGroup.DocumentSignatureTypeId;
                request.RequestDocumentGroup.SendingWayId = documentGroup.SendingWayId;
            }

            await requestService.UpdateRequest(request).ConfigureAwait(false);

            var alertPdteDocumentacion = request.Alerts?.FirstOrDefault(a => a.AlertType.Id == (int)AlertTypes.AlertaPendienteGenerarDocumentacion && !a.EndDate.HasValue);
            if (alertPdteDocumentacion != null)
            {
                alertPdteDocumentacion.Responsible = request.Username;
                alertPdteDocumentacion.Comments = "Documentación generada";
                alertPdteDocumentacion.Status = AlertStatus.Accepted;
                alertPdteDocumentacion.EndDate = DateTime.UtcNow;

                //PRJ-3625: Se cambia el SolveAlert por el Update directamente para evitar que se genere un nuevo status.
                await alertService.Update(alertPdteDocumentacion).ConfigureAwait(false);
            }

            signUpRequest.Request = await requestService.GetRequest(requestId).ConfigureAwait(false);
            signUpRequest.Request.AgentShippingMail = documentGroup.SendingWayId == (int)SendingWayType.FirmaOnline ? null : signUpRequest.Request.AgentShippingMail;
            signUpRequest.Request.Username = documentGroup.SendingWayId == (int)SendingWayType.FirmaOnline ? null : signUpRequest.Request.Username;

            if (signUpRequest.Request.IdSalesChannel == (int)SalesChannelType.WebPrivada)
            {
                var appLogged = signUpRequest.Request.Applicants.FirstOrDefault(a => a.IsWpLoggedUser == true);
                if (appLogged != null)
                {
                    signUpRequest.CustomerId = appLogged.Applicant.RdCode;
                }
            }

            SignedDocumentData docs = await signaturesService.GetEcerticDocuments(signUpRequest).ConfigureAwait(false);

            return docs;
        }

        public Task<SignedDocumentData> GenerateDoc(RequestDocumentGroup documentGroup, Guid requestId)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> SaveDni(DNIData model)
        {
            bool resSaveDni = false;
            string alertMessage = string.Empty;
            var request = await requestService.GetRequest(model.RequestId).ConfigureAwait(false);

            if (request.Applicants.FirstOrDefault(a => a.ApplicantRoleType.EsTitular()).Applicant.IDDocumentType == "PAS")
            {
                return await SavePassports(model);
            }

            if (model.IdSendingWay != (int)SendingWayType.Adjuntar_Doc && model.IdSendingWay != 0)
            {
                switch (model.IdSendingWay)
                {
                    case (int)SendingWayType.CorreoElectronico:
                        {
                            alertMessage = "Correo Electrónico";
                            break;
                        }
                    case (int)SendingWayType.EnviarCorreoPostal:
                        {
                            alertMessage = "Correo Postal";
                            break;
                        }
                    case (int)SendingWayType.Mensajero:
                        {
                            alertMessage = "Mensajero Gratuito";
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }

                var alert = new Alert
                {
                    RequestId = model.RequestId,
                    AlertType = new AlertType
                    {
                        Id = (int)AlertTypes.AlertaDNI
                    },
                    BeginDate = DateTime.UtcNow,
                    Details = alertMessage
                };
                await alertService.Create(alert).ConfigureAwait(false);
            }
            else
            {
                model.AltaJuridica = request.Applicants.Any(a => a.Applicant.ApplicantType.Id == (int)PersonTypeEnum.Juridica);

                alertMessage = $"Necesidad de solicitud manual del DNI: {model.DNI}.";
                string frontDNI = model.AnversoDni;
                string backDNI = model.ReversoDni;

                if (string.IsNullOrEmpty(frontDNI))
                {
                    var alert = new Alert
                    {
                        RequestId = model.RequestId,
                        AlertType = new AlertType
                        {
                            Id = (int)AlertTypes.AlertaDNI
                        },
                        BeginDate = DateTime.UtcNow,
                        Details = alertMessage
                    };
                    await alertService.Create(alert).ConfigureAwait(false);
                    return false;
                }

                if (!model.AltaJuridica)
                {
                    var documData = new DocumentData
                    {
                        RequestId = model.RequestId,
                        DocumentNumber = model.DNI,
                        AnversoDni = frontDNI,
                        ReversoDni = backDNI
                    };

                    resSaveDni = await signaturesService.SendIdDocumentToEcertic(documData).ConfigureAwait(false);

                    await SetApplicantDocumentSent(model).ConfigureAwait(false);

                    if (!string.IsNullOrEmpty(model.LibroFamilia))
                    {
                        var documDataLibro = new DocumentData
                        {
                            OtrosDocumentos = model.LibroFamilia,
                            RequestId = model.RequestId,
                            DocumentNumber = model.DNI
                        };
                        await signaturesService.SendIdDocumentToEcertic(documDataLibro).ConfigureAwait(false);
                    }
                }
            }

            return resSaveDni;
        }

        public async Task<bool> SavePassports(DNIData model)
        {
            string alertMessage = string.Empty;

            if (model.IdSendingWay != (int)SendingWayType.Adjuntar_Doc && model.IdSendingWay != 0)
            {
                switch (model.IdSendingWay)
                {
                    case (int)SendingWayType.CorreoElectronico:
                        {
                            alertMessage = "Correo Electrónico";
                            break;
                        }
                    case (int)SendingWayType.EnviarCorreoPostal:
                        {
                            alertMessage = "Correo Postal";
                            break;
                        }
                    case (int)SendingWayType.Mensajero:
                        {
                            alertMessage = "Mensajero Gratuito";
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }

                var alert = new Alert
                {
                    RequestId = model.RequestId,
                    AlertType = new AlertType
                    {
                        Id = (int)AlertTypes.AlertaDNI
                    },
                    BeginDate = DateTime.UtcNow,
                    Details = alertMessage
                };
                await alertService.Create(alert).ConfigureAwait(false);
            }
            else
            {
                var request = await requestService.GetRequest(model.RequestId).ConfigureAwait(false);
                bool isPassportDocument = request.Applicants.FirstOrDefault(a => a.Applicant.DNI == model.DNI)?.Applicant.IDDocumentType == "PAS";
                var titular = request.Applicants.Where(a => a.ApplicantRoleType.EsTitular())?.FirstOrDefault();

                var sftpModelFisica = new AltasSftp
                {
                    RequestId = model.RequestId,
                    Dni = model.DNI,
                    ReversoDni = isPassportDocument ? "" : model.ReversoDni,
                    AnversoDni = isPassportDocument ? "" : model.AnversoDni,
                    AnversoPasaporte = isPassportDocument ? model.AnversoDni : "",
                    ReversoPasaporte = isPassportDocument ? model.ReversoDni : "",
                    Pasaporte = isPassportDocument ? model.DNI : "",
                    LibrodeFamilia = string.IsNullOrEmpty(model.LibroFamilia) ? "" : model.LibroFamilia
                };

                await singupService.UploadDocumentToDocuware(sftpModelFisica).ConfigureAwait(false);

                await SetApplicantDocumentSent(model).ConfigureAwait(false);

            }

            return true;
        }

        public async Task<bool> SaveJuridicDocuments(DNIData model)
        {
            string alertMessage = string.Empty;

            if (model.IdSendingWay != (int)SendingWayType.Adjuntar_Doc && model.IdSendingWay != 0)
            {
                switch (model.IdSendingWay)
                {
                    case (int)SendingWayType.CorreoElectronico:
                        alertMessage = "Correo Electrónico";
                        break;

                    case (int)SendingWayType.EnviarCorreoPostal:
                        alertMessage = "Correo Postal";
                        break;

                    case (int)SendingWayType.Mensajero:
                        alertMessage = "Mensajero Gratuito";
                        break;

                    default:
                        break;
                }

                var alert = new Alert
                {
                    RequestId = model.RequestId,
                    AlertType = new AlertType
                    {
                        Id = (int)AlertTypes.AlertaDNI
                    },
                    BeginDate = DateTime.UtcNow,
                    Details = alertMessage
                };
                await alertService.Create(alert).ConfigureAwait(false);
            }
            else
            {
                var request = await requestService.GetRequest(model.RequestId).ConfigureAwait(false);
                List<Task> tasks = [];

                var razonSocial = request.Applicants.FirstOrDefault(a => a.ApplicantRoleType.Id == (int)ApplicantRoleType.Titular)?.Applicant.Name;
                var naturalezaJuridica = "personajuridica";

                if (!string.IsNullOrEmpty(model.CIFSociedad))
                {
                    var sftpCif = new AltasSftp
                    {
                        RequestId = model.RequestId,
                        CIF = model.DNI,
                        Dni = model.DNI,
                        NaturalezaJuridica = naturalezaJuridica,
                        RazonSocial = razonSocial,
                        CIFSociedad = model.CIFSociedad,
                    };
                    tasks.Add(signUpService.UploadDocumentToDocuware(sftpCif));
                }

                if (model.EscriturasCertificado != null && model.EscriturasCertificado.Count > 0)
                {
                    foreach (var escritura in model.EscriturasCertificado)
                    {
                        var sftpEscritura = new AltasSftp
                        {
                            RequestId = model.RequestId,
                            CIF = model.DNI,
                            Dni = model.DNI,
                            NaturalezaJuridica = naturalezaJuridica,
                            FileName = model.FileName,
                            RazonSocial = razonSocial,
                            EscriturasCertificado = escritura
                        };
                        tasks.Add(signUpService.UploadDocumentToDocuware(sftpEscritura));
                    }
                }

                if (model.PoderesApoderados != null && model.PoderesApoderados.Count > 0)
                {
                    foreach (var poder in model.PoderesApoderados)
                    {
                        var sftpPoder = new AltasSftp
                        {
                            RequestId = model.RequestId,
                            CIF = model.DNI,
                            Dni = model.DNI,
                            NaturalezaJuridica = naturalezaJuridica,
                            FileName = model.FileName,
                            RazonSocial = razonSocial,
                            PoderesApoderados = poder
                        };
                        tasks.Add(signUpService.UploadDocumentToDocuware(sftpPoder));
                    }
                }

                if (!string.IsNullOrEmpty(model.AnversoDni))
                {
                    var sftpAnverso = new AltasSftp
                    {
                        RequestId = model.RequestId,
                        Dni = model.DNI,
                        NaturalezaJuridica = naturalezaJuridica,
                        RazonSocial = "",
                        AnversoDni = model.AnversoDni
                    };
                    tasks.Add(signUpService.UploadDocumentToDocuware(sftpAnverso));
                }

                if (!string.IsNullOrEmpty(model.ReversoDni))
                {
                    var sftpReverso = new AltasSftp
                    {
                        RequestId = model.RequestId,
                        Dni = model.DNI,
                        NaturalezaJuridica = naturalezaJuridica,
                        RazonSocial = "",
                        ReversoDni = model.ReversoDni
                    };
                    tasks.Add(signUpService.UploadDocumentToDocuware(sftpReverso));
                }

                if (model.DNIsPersonasFisicas != null && model.DNIsPersonasFisicas.Count > 0)
                {
                    foreach (var dniPF in model.DNIsPersonasFisicas)
                    {
                        var sftpFisica = new AltasSftp
                        {
                            RequestId = model.RequestId,
                            CIF = model.DNI,
                            Dni = model.DNIPersonaFisicaNumero,
                            NaturalezaJuridica = naturalezaJuridica,
                            RazonSocial = "",
                            ReversoDni = model.IsReversoDni ? dniPF : "",
                            AnversoDni = model.IsReversoDni ? "" : dniPF,
                        };
                        tasks.Add(signUpService.UploadDocumentToDocuware(sftpFisica));
                    }
                }

                await Task.WhenAll(tasks).ConfigureAwait(false);
            }
            return true;
        }

        public async Task<PdfDocumentsApplicantData> RestoreDocumentsSignature(SignatureRestore model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model), "El parametro entrante model es nulo");

            var returnValue = new PdfDocumentsApplicantData();

            SignedStatus signedStatus = new()
            {
                RequestId = model.RequestId
            };
            var result = await signaturesService.GetDocumentSignedStatus(signedStatus, BestInver.WebPrivada.Shared.Models.DocumentSign.Enums.ActionsOnThePetition.SignOperation.ToString());
            if (result == null)
            {
                return returnValue;
            }

            var app = result.Signers.FirstOrDefault(s => s.Dni == model.Dni);
            var index = result.Signers.IndexOf(app);
            var resultApplicant = new SignedRequestStatus
            {
                Request = result.Request,

                Signers = []
            };
            logger.LogDebug("RestoreDocumentsSignature:GetDocumentSignedStatus app {App}", app == null ? "null" : app.Dni);
            logger.LogDebug("RestoreDocumentsSignature:GetDocumentSignedStatus index {Index}", index);
            logger.LogDebug("RestoreDocumentsSignature:GetDocumentSignedStatus Signers {Signers}", string.Join(",", result.Signers.Select(x => x.Dni)));

            if (index == -1)
            {
                logger.LogWarning("RestoreDocumentsSignature:GetDocumentSignedStatus index -1");
            }
            resultApplicant.Signers.Add(result.Signers[index]);

            resultApplicant.Tokens = [];
            resultApplicant.Tokens.Add(result.Tokens[index]);

            resultApplicant.SignersStatus = [];
            resultApplicant.SignersStatus.Add(result.SignersStatus[index]);

            resultApplicant.TokensSigner = new List<string>();
            resultApplicant.TokensSigner.Add(result.TokensSigner != null ? result.TokensSigner[index] : string.Empty);

            resultApplicant.ElectronicSignatureServiceVersions = new List<int>();
            resultApplicant.ElectronicSignatureServiceVersions.Add(result.ElectronicSignatureServiceVersions != null ? result.ElectronicSignatureServiceVersions[index] : 0);

            resultApplicant.AccessToken = new List<string>();
            resultApplicant.AccessToken.Add(result.AccessToken != null ? result.AccessToken[index] : string.Empty);

            IList<IList<DocFile>> docfiles = [result.DocFiles[index]];
            resultApplicant.DocFiles = docfiles;

            IList<IList<DocFile>> docSignedFiles = [result.DocSignedFiles[index]];
            resultApplicant.DocSignedFiles = docSignedFiles;

            resultApplicant.IdData = [];
            resultApplicant.IdData.Add(result.IdData[index]);

            if (false && (resultApplicant.DocFiles == null || resultApplicant.DocSignedFiles == null || resultApplicant.DocFiles.FirstOrDefault()?.Count == resultApplicant.DocSignedFiles.FirstOrDefault()?.Count))
            {
                return returnValue;
            }
            else
            {
                // get full info by requestId
                var reqFullInfo = await requestService.GetRequest(Guid.Parse(model.RequestId)).ConfigureAwait(false);
                returnValue = mapper.Map<PdfDocumentsApplicantData>(resultApplicant);

                if (reqFullInfo.Product.ProductType.Id == (int)ProductTypeMOEnum.Asesoramiento)
                {
                    returnValue.DocumentList = returnValue.DocumentList.Where(d => d.DoSign).ToList();
                }
                var applicant = await applicantservice.GetApplicantByDNI(model.Dni);
                if (applicant != null)
                {
                    returnValue.CompleteName = (applicant.BasicData.Name + " " + applicant.BasicData.FirstSurname + " " + applicant.BasicData.SecondSurname).Trim();
                    returnValue.Birthday = applicant.PersonalData.Birthday.Value;
                }
                else
                {
                    Log.Warning("{MethodFullName}.{MethodName}: No es posible encontrar un partícipe con el dni ({Dni}) indicado", System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.FullName, System.Reflection.MethodBase.GetCurrentMethod().Name, model.Dni);

                }


                var minors = reqFullInfo.Applicants.Where(a => a.Applicant.Birthday.HasValue && a.Applicant.Birthday.IsMinor()).ToList();
                var minorsData = new List<ApplicantData>();

                foreach (var ap in minors)
                {
                    var signature = result.Signers.FirstOrDefault(s => s.Dni == ap.Applicant.DNI);
                    var indexminor = result.Signers.IndexOf(signature);
                    var include = false;

                    if (indexminor >= 0)
                    {
                        if (result.IdData[indexminor] != null)
                        {
                            if (string.IsNullOrEmpty(result.IdData[indexminor].AnversoDni))
                            {
                                include = true;
                            }
                        }
                        else
                        {
                            include = true;
                        }
                    }

                    if (include)
                    {
                        var minor = new ApplicantData
                        {
                            BasicData = new Web.Models.ApplicantBasicData(),
                            PersonalData = new ApplicantPersonalData()
                        };

                        minor.BasicData.DNI = ap.Applicant.DNI;
                        minor.BasicData.Name = ap.Applicant.Name;
                        minor.BasicData.FirstSurname = ap.Applicant.FirstSurname;
                        minor.BasicData.SecondSurname = ap.Applicant.SecondSurname;
                        minor.PersonalData.Birthday = ap.Applicant.Birthday.Value;
                        minor.BasicData.RequestApplicantType = ap.ApplicantRoleType.Id;

                        minorsData.Add(minor);
                    }
                }

                var applByDni = reqFullInfo.Applicants.Where(a => a.Applicant.DNI == model.Dni).ToArray();
                var applicantRole = applByDni[0].ApplicantRoleType.Id;
                returnValue.RequestApplicantType = applicantRole.ToString();
                returnValue.ProductType = reqFullInfo.Product.ProductType.Id;
                returnValue.Product = reqFullInfo.Product.Name;
                returnValue.Birthday = applicant?.PersonalData.Birthday.Value ?? DateTime.MinValue;

                //Si es tutor devolver en una lista los menores de edad para que adjunten los documentos si no lo han hecho todavía.
                if (applicantRole == (int)ApplicantRoleType.Tutor || applicantRole == (int)ApplicantRoleType.CotitularAndTutor || applicantRole == (int)ApplicantRoleType.TitularAndTutor
                    || applicantRole == (int)ApplicantRoleType.HerederoAndTutor || applicantRole == (int)ApplicantRoleType.CoHerederoAndTutor || applicantRole == (int)ApplicantRoleType.UsufructuarioAndTutor)
                {
                    returnValue.Minors = minorsData;
                }
                var productOperation = new ProductOperationModel()
                {
                    IdProduct = reqFullInfo.Product.Id,
                    ProductName = reqFullInfo.Product.Name,
                    Operations = []
                };
                foreach (var reqProdOperation in reqFullInfo.ProductOperations.ToList())
                {
                    var operation = reqProdOperation.Operation;
                    var mapped = mapper.Map<OperationModel>(operation);
                    mapped.OperationDisplayName = operation.OperationType?.Name;
                    mapped.OperationDisplayWayToPay = operation.WayToPay?.Name;
                    mapped.IBAN = reqProdOperation.Product.IBAN;
                    productOperation.Operations.Add(mapped);
                }
                returnValue.ProductOperationModel = productOperation;
                returnValue.ParentRequestId = reqFullInfo.ParentRequestID;

                if (resultApplicant.SignersStatus.FirstOrDefault() == "SIGNED" || resultApplicant.SignersStatus.FirstOrDefault() == "OTP_OK")
                {
                    returnValue.Signed = true;
                }
                else
                {
                    returnValue.Signed = false;
                }

                return returnValue;
            }
        }

        public async Task<PdfDocumentsApplicantData> RestoreDocumentUpdate(SignatureRestore model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model), "El parametro entrante model es nulo");

            var returnValue = new PdfDocumentsApplicantData();
            SignedStatus signedStatus = new()
            {
                RequestId = model.RequestId
            };

            var result = await signaturesService.GetDocumentSignedStatus(signedStatus);

            if (result == null)
            {
                return returnValue;
            }
            else
            {
                var reqFullInfo = await requestService.GetRequest(Guid.Parse(model.RequestId)).ConfigureAwait(false);
                var minors = reqFullInfo.Applicants.Where(a => a.Applicant.Birthday.HasValue && a.Applicant.Birthday.IsMinor()).ToList();
                var minorsData = new List<ApplicantData>();

                foreach (var ap in minors)
                {
                    var signature = result.Signers.FirstOrDefault(s => s.Dni == ap.Applicant.DNI);
                    var indexminor = result.Signers.IndexOf(signature);
                    var include = false;

                    if (indexminor >= 0)
                    {
                        if (result.IdData[indexminor] != null)
                        {
                            if (string.IsNullOrEmpty(result.IdData[indexminor].AnversoDni))
                            {
                                include = true;
                            }
                        }
                        else
                        {
                            include = true;
                        }
                    }

                    if (include)
                    {
                        var minor = new ApplicantData
                        {
                            BasicData = new Web.Models.ApplicantBasicData(),
                            PersonalData = new ApplicantPersonalData()
                        };

                        minor.BasicData.DNI = ap.Applicant.DNI;
                        minor.BasicData.Name = ap.Applicant.Name;
                        minor.BasicData.FirstSurname = ap.Applicant.FirstSurname;
                        minor.BasicData.SecondSurname = ap.Applicant.SecondSurname;
                        minor.PersonalData.Birthday = ap.Applicant.Birthday.Value;
                        minor.BasicData.RequestApplicantType = ap.ApplicantRoleType.Id;

                        minorsData.Add(minor);
                    }
                }

                var applByDni = reqFullInfo.Applicants.Where(a => a.Applicant.DNI == model.Dni).ToArray();
                var applicantRole = applByDni[0].ApplicantRoleType.Id;
                returnValue.RequestApplicantType = applicantRole.ToString();

                //Si es tutor devolver en una lista los menores de edad para que adjunten los documentos si no lo han hecho todavía.
                if (applicantRole == (int)ApplicantRoleType.Tutor || applicantRole == (int)ApplicantRoleType.CotitularAndTutor || applicantRole == (int)ApplicantRoleType.TitularAndTutor
                 || applicantRole == (int)ApplicantRoleType.HerederoAndTutor || applicantRole == (int)ApplicantRoleType.CoHerederoAndTutor || applicantRole == (int)ApplicantRoleType.UsufructuarioAndTutor)
                {
                    returnValue.Minors = minorsData;
                }
                returnValue.ParentRequestId = reqFullInfo.ParentRequestID;

                return returnValue;
            }
        }

        public async Task SetApplicantSignDate(Guid requestId, string dni)
        {
            string[] values = [dni];
            bool result = await requestService.SetApplicantSignDate(values, requestId).ConfigureAwait(false);
            if (result)
            {
                var request = await requestService.GetRequest(requestId).ConfigureAwait(false);
                if (request.Applicants.Where(a => a.HasToSign.HasValue && a.HasToSign.Value).All(a => a.SignDate.HasValue))
                {
                    await ChangeRequestStatus(new ChangeRequestStatusModel
                    {
                        RequestId = requestId,
                        NoRestrictions = false,
                        Responsible = "sistema"
                    }).ConfigureAwait(false);
                }
            }
        }

        public async Task CompleteProccess(Guid requestId)
        {
            var request = await requestService.GetRequest(requestId).ConfigureAwait(false);
            var allApplicantsSigned = !request.Applicants.Any(a => a.HasToSign == true && a.SignDate == null);
            if (allApplicantsSigned)
            {
                var documents = request.Applicants.Where(a => a.ApplicantRoleType.EsTitular()).Select(a => a.Applicant.DNI);
                List<Task> mailsToSend = [];

                documents.ToList().ForEach(a =>
                {
                    mailsToSend.Add(sendMailService.SendNextstepsMail(requestId, a));
                });

                await Task.WhenAll(mailsToSend).ConfigureAwait(false);
            }
        }

        public async Task<ApplicantCheckConvenience> CheckExistingApplicantData(string dni, int productId)
        {
            var convenienceCustomer = new ConvenientResponse();
            var applicantConvenienceStatus = new ApplicantCheckConvenience();

            if (dni != null)
            {
                var applicant = await applicantservice.GetApplicantByDNI(dni).ConfigureAwait(false);
                var convenientResponsedata = new ConvenientResponse();
                if (applicant != null)
                {
                    try
                    {

                        var customer = await customersService.GetCustomerByDNI(dni).ConfigureAwait(false);
                        if (customer != null)
                        {
                            convenienceCustomer = await testService.Convenience(customer.ClientId.ToString(), productId).ConfigureAwait(false);
                        }

                        if (convenienceCustomer != null)
                        {
                            convenientResponsedata = new ConvenientResponse
                            {
                                requireConvenienceTest = convenienceCustomer.requireConvenienceTest,
                                isBlocked = convenienceCustomer.isBlocked,
                                IsConvenientProduct = convenienceCustomer.IsConvenientProduct
                            };
                        }
                        else
                        {
                            convenientResponsedata = new ConvenientResponse
                            {
                                requireConvenienceTest = true,
                                isBlocked = false,
                                IsConvenientProduct = false
                            };
                        }
                    }
                    catch (Exception)
                    {
                        convenientResponsedata = new ConvenientResponse
                        {
                            requireConvenienceTest = true,
                            isBlocked = false,
                            IsConvenientProduct = false
                        };
                    }

                    applicantConvenienceStatus = new ApplicantCheckConvenience
                    {
                        DNI = dni,
                        ConvenientResponse = convenientResponsedata
                    };
                }
                else
                {
                    convenientResponsedata = new ConvenientResponse
                    {
                        requireConvenienceTest = true,
                        isBlocked = false,
                        IsConvenientProduct = false
                    };

                    applicantConvenienceStatus = new ApplicantCheckConvenience
                    {
                        DNI = string.Empty,
                        ConvenientResponse = convenientResponsedata
                    };
                }
            }
            return applicantConvenienceStatus;
        }

        public async Task<LegalContactInfo> GetLegalModalContent()
        {
            try
            {
                return await sharedService.GetLegalModalContent().ConfigureAwait(false);
            }
            catch (Exception)
            {
                return null;
            }
        }

        #endregion Public methods

        #region Private methods

        private async Task<bool> InitRequestStatus(Guid requestId)
        {
            var status = new RequestStatus
            {
                IdRequest = requestId,
                Comments = "Iniciada por Sistema",
                IdStatus = (int)RequestStatusEnum.Prospect,
                StartDate = DateTime.UtcNow,
                Responsible = "sistema"
            };

            var statuslist = new List<RequestStatus>
            {
                status
            };

            return (await requestService.Add(statuslist).ConfigureAwait(false)).Any();
        }

        private async Task<List<IRegisterValidator>> CreateValidators(SignUpApplicant applicantData, Guid requestId)
        {
            Request lastHolderRequest = null;
            int days = appSettings.RDActiveUserDays;
            int expirationDays = appSettings.RequestsConfigExpirationDays;
            var applicantBD = applicantservice.GetApplicantByDNI(applicantData.BasicData.Dni);
            var existRD = customersService.CheckCustomerRD(applicantData.BasicData.Dni, days);
            var alerTypes = alertService.GetAllAlertTypes();
            int[] ownerTypes = [(int)ApplicantRoleType.Titular, (int)ApplicantRoleType.Heredero, (int)ApplicantRoleType.BeneficiarioDonacion, (int)ApplicantRoleType.Minusvalido];

            await Task.WhenAll(applicantBD, existRD, alerTypes).ConfigureAwait(false);

            if (applicantBD.GetAwaiter().GetResult() != null)
            {
                var requestsAsHolder = applicantBD.GetAwaiter().GetResult().ApplicantRole.Where(
                    a => a.RequestApplicantType == (int)ApplicantRoleType.Titular
                    || a.RequestApplicantType == (int)ApplicantRoleType.Cotitular
                    || a.RequestApplicantType == (int)ApplicantRoleType.CotitularAndTutor
                    || a.RequestApplicantType == (int)ApplicantRoleType.Heredero
                    || a.RequestApplicantType == (int)ApplicantRoleType.HerederoAndTutor
                    || a.RequestApplicantType == (int)ApplicantRoleType.CoHeredero
                    || a.RequestApplicantType == (int)ApplicantRoleType.CoHerederoAndTutor
                    //|| a.RequestApplicantType == (int)ApplicantRoleType.UsufructuarioAndTutor
                    || a.RequestApplicantType == (int)ApplicantRoleType.BeneficiarioDonacion
                    || a.RequestApplicantType == (int)ApplicantRoleType.Minusvalido);

                if (requestsAsHolder != null && requestsAsHolder.Any())
                {
                    var requestSearch = new RequestSearch
                    {
                        RequestCollection = requestsAsHolder.Select(r => r.RequestId).ToList()
                    };

                    var result = await requestService.GetRequestCollection(requestSearch);

                    var aux = result
                        .Where(result => result.IdRequestChannel != null && result.IdRequestChannel == (int)RequestChannelEnum.Public && result.Status.Any())
                        .OrderByDescending(r => r.RequestStartDate)
                        .FirstOrDefault();

                    if (aux != null)
                    {
                        lastHolderRequest = await requestService.GetRequest(aux.Id).ConfigureAwait(false);
                    }
                    else
                    {
                        lastHolderRequest = null;
                    }
                }
            }

            return await Task.Run(new Func<List<IRegisterValidator>>(() =>
            {
                List<IRegisterValidator> validators = [];

                if (ownerTypes.Contains(applicantData.BasicData.RequestApplicantType))
                {
                    validators.Add(new RegisterValidateRequestHolder(lastHolderRequest, applicantData, expirationDays));
                    validators.Add(new RegisterValidateExistsInRD(existRD.GetAwaiter().GetResult()));
                }

                validators.Add(new RequestValidateApplicant(applicantBD.GetAwaiter().GetResult(), requestId, lastHolderRequest));

                return validators;
            })).ConfigureAwait(false);
        }

        private async Task<Dictionary<string, IEnumerable<IRegisterValidator>>> GetValidatorsByApplicants(IEnumerable<SignUpApplicant> applicantData, Guid requestId)
        {
            Dictionary<string, IEnumerable<IRegisterValidator>> validatorByApplicant = [];

            foreach (var app in applicantData)
            {
                var validator = await CreateValidators(app, requestId).ConfigureAwait(false);
                validatorByApplicant.Add(app.BasicData.Dni, validator);
            }

            return validatorByApplicant;
        }

        private async Task SetApplicantDocumentSent(DNIData model)
        {
            var applicants = await requestService.GetRequestApplicants(model.RequestId).ConfigureAwait(false);
            var applicant = applicants.FirstOrDefault(a => a.Applicant.DNI.Equals(model.DNI, StringComparison.InvariantCultureIgnoreCase));

            if (applicant != null)
            {
                applicant.SentDni = true;
                await requestService.UpdateApplicantRole(applicant, model.RequestId).ConfigureAwait(false);
            }

            string alertdni = "Alerta validación documentación. El DNI / NIE / PASAPORTE ha sido almacenado correctamente, no obstante, necesita ser validado";
            var alert = new Alert
            {
                AlertType = new AlertType
                {
                    Id = (int)AlertTypes.AlertaDNI
                },
                RequestId = model.RequestId,
                BeginDate = DateTime.UtcNow,
                Details = alertdni
            };
            await alertService.Create(alert).ConfigureAwait(false);

            //Se ha eliminado el if de MoveStatus debido a que se debe hacer las comprobaciones que realizan estas validaciones para ver si realmente aplica el cambio de estado.
            var requestTask = requestService.GetRequest(model.RequestId);
            var requestDocumentsTask = requestService.GetRequestDocuments(model.RequestId, null);
            await Task.WhenAll(requestTask, requestDocumentsTask).ConfigureAwait(false);
            var request = await requestTask;
            var requestDocuments = await requestDocumentsTask;
            var statusList = GetNextStatusList(request, checkParticipeDNIDocumentsSigned: CheckParticipeDNIDocumentsSigned(requestDocuments));
            await requestService.Add(statusList).ConfigureAwait(false);
        }

        private async Task InsertRequestStatus(Guid requestId, int status, string comments = "", string responsible = "sistema")
        {
            var statusList = new List<RequestStatus>
                {
                    new() {
                        IdRequest = requestId,
                        IdStatus = status,
                        StartDate = DateTime.UtcNow,
                        Comments = comments,
                        Responsible = responsible
                    }
                };
            await requestService.Add(statusList).ConfigureAwait(false);
        }

        private async Task<Alert> CheckProductAlert(IEnumerable<SignUpRequestProductOperation> operations, Guid requestId, string username, string dni)
        {
            var alert = new Alert();
            var productsWithAlerts = operations.Where(o =>
               o.ProductId == (int)ProductNames.BESTVALUE ||
               o.ProductId == (int)ProductNames.BESTINVER_HEDGE_VALUE ||
               o.ProductId == (int)ProductNames.BESTINVER_TORDESILLAS ||
               o.ProductId == (int)ProductNames.BESTINVER_INFRA ||
               o.ProductId == (int)ProductNames.BESTINVER_PRIVATE_EQUITY);

            if (productsWithAlerts.Any() && string.IsNullOrEmpty(username))
            {
                var productName = (ProductNames)productsWithAlerts.FirstOrDefault().ProductId;
                alert = new Alert
                {
                    AlertType = new AlertType
                    {
                        Id = (int)RequestAlertTypes.AlertaProducto
                    },
                    RequestId = requestId,
                    BeginDate = DateTime.UtcNow,
                    Details = $"Alerta Operación con producto {productName}. DNI: {dni}"
                };
                await alertService.Create(alert).ConfigureAwait(false);
            }
            return alert;
        }

        private async Task<Alert> CheckBlockingSignature(Guid requestId)
        {
            bool blockrequest = appSettings.BlockSignature;
            var alert = new Alert();
            if (blockrequest)
            {
                alert = new Alert
                {
                    AlertType = new AlertType
                    {
                        Id = (int)RequestAlertTypes.AlertaFirmaBloqueada
                    },
                    RequestId = requestId,
                    BeginDate = DateTime.UtcNow,
                    Details = "Firma bloqueada"
                };
                await alertService.Create(alert).ConfigureAwait(false);
            }
            return alert;
        }

        #endregion Private methods

        #region Cambio de estados versión proceso actual

        private static bool CanMoveToNextStatus(Request request, bool FromManagement = false, bool checkParticipeDNIDocumentsSigned = true)
        {
            var alerts = request.Alerts.Where(a => !a.EndDate.HasValue);
            var currentStatus = request.Status.OrderByDescending(r => r.StartDate).FirstOrDefault();
            var onlinesignature = request.RequestDocumentGroup != null && (request.RequestDocumentGroup.SendingWayId == (int)SendingWayType.FirmaOnline);
            var allClientSigned = !request.Applicants.Any(a => a.HasToSign == true && a.SignDate == null);
            bool result = true;
            bool juridica = request.Applicants.Any(a => a.Applicant.ApplicantType.Id == 2);

            switch (currentStatus.IdStatus)
            {
                case (int)RequestStatusEnum.Prospect:
                    if (alerts.Any(a => a.AlertType.Id == (int)AlertTypes.AlertaTerrorismo))
                        result = false;
                    break;

                case (int)RequestStatusEnum.PendingSignature:
                    if (alerts.Any(a =>
                        a.AlertType.Id == (int)AlertTypes.AlertaPBC ||
                        a.AlertType.Id == (int)AlertTypes.AlertaTerrorismo ||
                        a.AlertType.Id == (int)AlertTypes.AlertaMovilDuplicado ||
                        (a.AlertType.Id == (int)AlertTypes.AlertaDNI && juridica) ||
                        (a.AlertType.Id == (int)AlertTypes.AlertaPendienteValidarJuridico && juridica))
                    )
                    {
                        result = false;
                    }

                    // PRJ0034416-3647 Si es jurídica nos da igual el tipo de onlinesignature, y tenemos que permitir el cambio de estado.
                    if (!juridica && onlinesignature && (!allClientSigned || !checkParticipeDNIDocumentsSigned))
                    {
                        result = false;
                    }

                    break;

                case (int)RequestStatusEnum.PendingDNI:
                    bool allDocumentsUploaded = request.Applicants.Where(a => a.ApplicantRoleType.Id != (int)ApplicantRoleType.Beneficiario).All(a => a.SentDni == true);

                    if (!allDocumentsUploaded && !FromManagement)
                        result = false;

                    if (alerts.Any(a =>
                    a.AlertType.Id == (int)AlertTypes.AlertaPBC ||
                    a.AlertType.Id == (int)AlertTypes.AlertaTerrorismo
                    ))
                        result = false;
                    break;

                case (int)RequestStatusEnum.SentToOperations:
                    /*
                     * Cuando esta en estado SendToOperations no avanza al siguiente estado "Alta" salvo cuando llega el callback de Alter.
                     * Este metodo que se llama cuando se sube el DNI en ALTAS o MO, también cuando se avanza en MO con los botones de estado, no en el callback.                                 
                     * En este jira se ve el comportamiento de esos botones en MO > PRJ0034416-954
                     */
                    result = false;
                    break;

                case (int)RequestStatusEnum.ErrorSendingToOperations:
                    break;

                case (int)RequestStatusEnum.Locked:
                    result = false;
                    break;

                case (int)RequestStatusEnum.Expired:
                    result = false;
                    break;

                case (int)RequestStatusEnum.Abandoned:
                    result = false;
                    break;

                case (int)RequestStatusEnum.Canceled:
                    result = false;
                    break;

                case (int)RequestStatusEnum.Register:
                    result = false;
                    break;

                case (int)RequestStatusEnum.PendingSocialize:
                    if (alerts.Any(a =>
                        a.AlertType.Id == (int)AlertTypes.AlertaPBC ||
                        a.AlertType.Id == (int)AlertTypes.AlertaMovilDuplicado ||
                        a.AlertType.Id == (int)AlertTypes.AlertaTerrorismo)
                    )
                    {
                        result = false;
                    }
                    break;

                default:
                    break;
            }
            return result;
        }

        protected List<RequestStatus> GetNextStatusList(Request request, string comments = "", string responsible = "sistema", bool NoRestriction = false, bool FromManagement = false, bool checkParticipeDNIDocumentsSigned = true)
        {
            List<RequestStatus> statusList = [];
            var status = request.Status.OrderByDescending(r => r.StartDate).FirstOrDefault();
            if (status == null)
            {
                statusList.Add(new RequestStatus
                {
                    IdRequest = request.Id,
                    Responsible = responsible,
                    Comments = comments,
                    IdStatus = (int)RequestStatusEnum.Prospect,
                    StartDate = DateTime.UtcNow
                });
            }

            var isFisica = !request.Applicants.Any(a => a.Applicant.ApplicantType.Id == (int)PersonTypeEnum.Juridica);

            if (RequestRequiereRepresentativeSignature(request, status))
                return AddNextStateForRepresentativeSignature(statusList, status, request, comments, responsible, NoRestriction);
            else
            {
                if (CanMoveToNextStatus(request, FromManagement, checkParticipeDNIDocumentsSigned) || NoRestriction)
                {
                    var allDocumentsUploaded = request.Applicants.Where(a => a.ApplicantRoleType.Id != (int)ApplicantRoleType.Beneficiario)
                        .All(d => d.SentDni == true);

                    var isNewAccount = request.Applicants.Any(a => !a.Applicant.RdCode.HasValue);

                    if (status != null)
                    {
                        switch (status.IdStatus)
                        {
                            case (int)RequestStatusEnum.Prospect:
                                statusList.Add(new RequestStatus
                                {
                                    IdRequest = request.Id,
                                    Responsible = responsible,
                                    Comments = comments,
                                    IdStatus = (int)RequestStatusEnum.PendingSignature,
                                    StartDate = DateTime.UtcNow
                                });
                                break;

                            case (int)RequestStatusEnum.PendingSignature:

                                statusList.Add(new RequestStatus
                                {
                                    IdRequest = request.Id,
                                    Responsible = responsible,
                                    Comments = comments,
                                    IdStatus = (int)RequestStatusEnum.PendingDNI,
                                    StartDate = DateTime.UtcNow
                                });

                                if (isFisica && allDocumentsUploaded)
                                {
                                    statusList.Add(new RequestStatus
                                    {
                                        IdRequest = request.Id,
                                        Responsible = responsible,
                                        Comments = "Enviado a Operaciones",
                                        IdStatus = (int)RequestStatusEnum.SentToOperations,
                                        StartDate = DateTime.UtcNow.AddSeconds(10)
                                    });
                                }

                                break;

                            case (int)RequestStatusEnum.PendingDNI:
                            case (int)RequestStatusEnum.ErrorSendingToOperations:
                                statusList.Add(new RequestStatus
                                {
                                    IdRequest = request.Id,
                                    Responsible = responsible,
                                    Comments = "Enviado a Operaciones",
                                    IdStatus = (int)RequestStatusEnum.SentToOperations,
                                    StartDate = DateTime.UtcNow
                                });
                                break;
                            case (int)RequestStatusEnum.SentToOperations:
                                /*
                                 * Cuando esta en estado SendToOperations no avanza al siguiente estado "Alta" salvo cuando llega el callback de Alter.
                                 * Este metodo que se llama cuando se sube el DNI en ALTAS o MO, también cuando se avanza en MO con los botones de estado, no en el callback.                                 
                                 * En este jira se ve el comportamiento de esos botones en MO > PRJ0034416-954
                                 */
                                break;
                            case (int)RequestStatusEnum.PendingSocialize:

                                if (isNewAccount)
                                {
                                    statusList.Add(new RequestStatus
                                    {
                                        IdRequest = request.Id,
                                        Responsible = responsible,
                                        Comments = comments,
                                        IdStatus = (int)RequestStatusEnum.PendingDNI,
                                        StartDate = DateTime.UtcNow
                                    });

                                    if (allDocumentsUploaded)
                                    {
                                        statusList.Add(new RequestStatus
                                        {
                                            IdRequest = request.Id,
                                            Responsible = responsible,
                                            Comments = "Enviado a Operaciones",
                                            IdStatus = (int)RequestStatusEnum.SentToOperations,
                                            StartDate = DateTime.UtcNow.AddSeconds(10)
                                        });
                                    }
                                }
                                else
                                {
                                    statusList.Add(new RequestStatus
                                    {
                                        IdRequest = request.Id,
                                        Responsible = responsible,
                                        Comments = "Enviado a Operaciones",
                                        IdStatus = (int)RequestStatusEnum.SentToOperations,
                                        StartDate = DateTime.UtcNow
                                    });
                                }
                                break;

                        }
                    }
                }
            }
            return statusList;
        }

        private static List<RequestStatus> AddNextStateForRepresentativeSignature(List<RequestStatus> statusList, RequestStatus status, Request request, string comments, string responsible, bool noRestriction)
        {
            if (status.IdStatus.Value == (int)RequestStatusEnum.Representatives_Sign && !noRestriction)
                return statusList;

            if (status.IdStatus.Value == (int)RequestStatusEnum.PendingDNIVerification)
                statusList.Add(
                new RequestStatus
                {
                    IdRequest = request.Id,
                    Responsible = responsible,
                    Comments = comments,
                    IdStatus = (int)RequestStatusEnum.Representatives_Sign,
                    StartDate = DateTime.UtcNow
                });

            if (status.IdStatus.Value == (int)RequestStatusEnum.Representatives_Sign)
                statusList.Add(
                new RequestStatus
                {
                    IdRequest = request.Id,
                    Responsible = responsible,
                    Comments = "Enviado a Operaciones",
                    IdStatus = (int)RequestStatusEnum.SentToOperations,
                    StartDate = DateTime.UtcNow
                });

            return statusList;
        }

        public RequestStatus UpdateRequestStatus(Request request)
        {
            RequestStatus result;

            var currStatus = request.Status.OrderByDescending(r => r.StartDate).FirstOrDefault();
            bool isjuridic = request.Applicants.Any(a => a.Applicant.ApplicantType.Id == 2);

            result = currStatus;

            if (currStatus.IdStatus == (int)RequestStatusEnum.Locked)
            {
                var prevStatus = GetPreviousStatus(request);
                var lockDate = currStatus.StartDate.Value;
                prevStatus.StartDate = DateTime.UtcNow > lockDate ? DateTime.UtcNow : lockDate.AddMinutes(1);
                var statusList = request.Status.ToList();
                statusList.Add(prevStatus);
                request.Status = statusList;

                if (CanMoveToNextStatus(request))
                {
                    result = prevStatus;
                }
            }
            else
            {
                if (!CanMoveToNextStatus(request))
                {
                    result = new RequestStatus
                    {
                        IdRequest = request.Id,
                        Responsible = "Sistema",
                        Comments = "Bloqueada por Sistema",
                        IdStatus = (int)RequestStatusEnum.Locked,
                        StartDate = DateTime.UtcNow
                    };
                }
            }

            return result;
        }

        private static RequestStatus GetPreviousStatus(Request request)
        {
            var statusList = request.Status.OrderBy(s => s.StartDate).ToList();
            if (statusList.Count == 0)
            {
                return new RequestStatus
                {
                    IdRequest = request.Id,
                    Responsible = "Sistema",
                    Comments = "iniciada por Sistema",
                    IdStatus = (int)RequestStatusEnum.Prospect,
                    StartDate = DateTime.UtcNow
                };
            }
            else if (statusList.Count == 1)
            {
                var status = statusList[0];
                return new RequestStatus
                {
                    Comments = status.Comments,
                    IdRequest = status.IdRequest,
                    IdStatus = status.IdStatus,
                    Responsible = status.Responsible,
                    StartDate = DateTime.UtcNow
                };
            }
            else
            {
                var status = statusList[^2];
                return new RequestStatus
                {
                    Comments = status.Comments,
                    IdRequest = status.IdRequest,
                    IdStatus = status.IdStatus,
                    Responsible = status.Responsible,
                    StartDate = DateTime.UtcNow
                };
            }
        }

        private static bool RequestRequiereRepresentativeSignature(Request request, RequestStatus status)
        {
            if (request == null)
                return false;

            if (status == null)
                return false;

            if (status.IdStatus == null)
                return false;

            if (status.IdStatus.Value != (int)RequestStatusEnum.PendingDNIVerification && status.IdStatus.Value != (int)RequestStatusEnum.Representatives_Sign)
                return false;

            var product = request.Product;

            if (product == null)
                return false;

            if (!product.RepresentativeSign.HasValue)
                return false;

            return product.RepresentativeSign.Value;
        }

        private static bool CheckParticipeDNIDocumentsSigned(IEnumerable<RequestDocuments> requestDocuments)
        {
            var requestDocumentsSigned = requestDocuments.Where(x => x.DoSign);
            var uniqueDnis = requestDocumentsSigned.Select(doc => doc.ParticipeDNI).Distinct();

            foreach (var dni in uniqueDnis)
            {
                var hasSignedDocument = requestDocumentsSigned.Any(doc => doc.ParticipeDNI == dni && doc.DocumentUrlFirmado != null);
                if (!hasSignedDocument)
                {
                    return false;
                }
            }

            return true;
        }

        #endregion Cambio de estados versión proceso actual
    }
}