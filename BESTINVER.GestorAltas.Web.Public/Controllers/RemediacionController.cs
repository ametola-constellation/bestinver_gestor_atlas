using AutoMapper;
using BestInver.Core.Otel.Metrics;
using BestInver.WebPrivada.Shared.Models.Microservices.Remediation;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Documents;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Middleware.Remediacion.Enums;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Response;
using BESTINVER.GestorAltas.Domain.Configurations;
using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using BESTINVER.GestorAltas.Utilities.Security;
using BESTINVER.GestorAltas.Web.Models.Remediacion;
using BESTINVER.GestorAltas.Web.Models.Tests;
using BESTINVER.GestorAltas.Web.Public.Extensions;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using BESTINVER.GestorAltas.Web.Public.Models.Remediacion;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Controllers
{
    public class RemediacionController : Controller
    {
        protected readonly IRemediationService remediacionService;
        protected readonly IApplicantService applicantService;
        protected readonly ISignUpService signUpService;
        protected readonly IMapper mapper;
        protected readonly ISignaturesService signaturesService;
        protected readonly ITestService testService;
        protected readonly ISendMailService sendMailService;
        protected readonly IOptions<AppSettings> appSettings;
        protected ILogger<RemediacionController> logger;

        public RemediacionController(
            IRemediationService remediacionService,
            IApplicantService applicantService,
            ISignUpService signUpService,
            IMapper mapper,
            ISignaturesService signaturesService,
            ITestService testService,
            ISendMailService sendMailService,
            IOptions<AppSettings> appSettings,
            ILogger<RemediacionController> logger)
        {
            this.signaturesService = signaturesService;
            this.remediacionService = remediacionService;
            this.applicantService = applicantService;
            this.signUpService = signUpService;
            this.mapper = mapper;
            this.testService = testService;
            this.sendMailService = sendMailService;
            this.appSettings = appSettings;
            this.logger = logger;
        }

        public async Task<IActionResult> Index(string t)
        {
            try
            {
                string queryString = UrlTokenizer.Decrypt(t);
                var queryDictionary = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(queryString);
                var rDTitular = queryDictionary.FirstOrDefault(q => q.Key == "rt").Value;
                var requestId = queryDictionary.FirstOrDefault(q => q.Key == "ir").Value;

                var remediacionRequest = await remediacionService.GetRequestByRequestId(requestId).ConfigureAwait(false);

                if (remediacionRequest.Applicant.RDTitular != rDTitular) { throw new InvalidOperationException($"El código de cliente de la url: {rDTitular} no coincide con el que devuelve el servicio: {remediacionRequest.Applicant.RDTitular}"); }

                var model = await buildModel(remediacionRequest).ConfigureAwait(false);

                return View("RemediacionView", model);
            }
            catch (AccountException)
            {
                var remediacionErrorModel = new RemediacionErrorModel() { ErrorMessage = "La petición ya ha sido procesada o está bloqueada" };
                return View("RemediacionErrorView", remediacionErrorModel);
            }
            catch (InvalidOperationException ex)
            {
                logger.LogError(ex, "Error Remediación: {Message}", ex.Message);
                var remediacionErrorModel = new RemediacionErrorModel() { ErrorMessage = "Ha ocurrido un error al procesar su solicitud." };
                return View("RemediacionErrorView", remediacionErrorModel);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error Remediación: {Message}", ex.Message);
                var remediacionErrorModel = new RemediacionErrorModel() { ErrorMessage = "Ha ocurrido un error al procesar su solicitud." };
                return View("RemediacionErrorView", remediacionErrorModel);
            }
        }

        [HttpPost]
        public async Task<IActionResult> PersonalData(RemediacionPersonalDataModel model)
        {
            try
            {
                model.IsForeignDni = true;
                var remediacionRequest = await remediacionService.GetRequestByRequestId(model.RemediacionId.ToString()).ConfigureAwait(false);
                var applicant = remediacionRequest.Applicant;
                applicant.Birthday = model.Birthday;
                applicant.BornPlace = model.BornPlace;
                applicant.DNI = model.Dni;

                Impersonate(remediacionRequest.UserName, remediacionRequest.RemediationChannelType);

                await remediacionService.DeleteApplicantiddocument(model.RDTitular).ConfigureAwait(false);

                await remediacionService.UpdateCreateApplicant(applicant).ConfigureAwait(false);

                await remediacionService.DeleteApplicantCountries(model.RDTitular).ConfigureAwait(false);

                await remediacionService.UpdateApplicantCountry(new RemediacionApplicantCountry
                {
                    IdApplicant = applicant.RDTitular,
                    IdCountry = model.Nacionality,
                    IdCountryType = (int)CountryTypeEnum.Nacionalidad
                }).ConfigureAwait(false);

                await remediacionService.UpdateApplicantCountry(new RemediacionApplicantCountry
                {
                    IdApplicant = applicant.RDTitular,
                    IdCountry = model.Country,
                    IdCountryType = (int)CountryTypeEnum.Nacimiento
                }).ConfigureAwait(false);

                var status = new RemediacionRequestStatus
                {
                    IdRemediacionRequest = remediacionRequest.Id,
                    IdStatus = Convert.ToInt32(RequestStatusEnum.DatosContactoActualizados),
                    Created = DateTime.UtcNow
                };
                await MoveStatus(status).ConfigureAwait(false);

                return Ok(applicant);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error Remediación: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Dni(RemediacionModel model)
        {
            try
            {
                var remediacionRequest = await remediacionService.GetRequestByRequestId(model.RemediacionId).ConfigureAwait(false);
                Impersonate(remediacionRequest.UserName, remediacionRequest.RemediationChannelType);

                if (model.Dni.IsPermanent)
                {
                    remediacionRequest.Applicant.IDDocumentIsPermanent = true;
                    remediacionRequest.Applicant.IDDocumentExpirationDate = null;
                }
                else
                {
                    remediacionRequest.Applicant.IDDocumentIsPermanent = false;
                    remediacionRequest.Applicant.IDDocumentExpirationDate = new DateTime(model.Dni.ExpirationYear, model.Dni.ExpirationMonth, model.Dni.ExpirationDay, 0, 0, 0, DateTimeKind.Utc);
                }

                await remediacionService.AddUpdateRequest(remediacionRequest).ConfigureAwait(false);
                await remediacionService.UpdateCreateApplicant(remediacionRequest.Applicant).ConfigureAwait(false);

                var dniDocuware = new AltasSftp
                {
                    RequestId = new Guid(model.RemediacionId),
                    AnversoDni = model.Dni.AnversoDni,
                    ReversoDni = model.Dni.ReversoDni
                };
                await remediacionService.AdditionalDocuments(dniDocuware).ConfigureAwait(false);

                var status = new RemediacionRequestStatus
                {
                    IdRemediacionRequest = remediacionRequest.Id,
                    IdStatus = Convert.ToInt32(RequestStatusEnum.DocumentoActualizado),
                    Created = DateTime.UtcNow
                };
                await MoveStatus(status).ConfigureAwait(false);
                BestInverBusinessMetrics.IncreaseDNIStorage($"{HttpContext.Request.PathBase}{HttpContext.Request.Path}");
                return Ok(model);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error Remediación: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> KnowledgeTest(RemediacionQuestionData model)
        {
            try
            {
                var requestId = new Guid(model.RemediacionId);
                int[] excludedQuestions = new int[] { 3, 4, 5, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 58, 59 };
                var test = model.Answers.Where(t => t.IdAnswer.HasValue).Select(answer =>
                {
                    var testItem = new RemediacionTest();
                    testItem.AnswerId = answer.IdAnswer.Value;
                    testItem.QuestionId = answer.IdQuestion;
                    testItem.ApplicantId = model.ClientId;
                    testItem.RequestId = requestId;
                    testItem.OtherAnswer = answer.OtherAnswer;
                    testItem.QuestionAnswer = new RemediacionQuestionAnswer
                    {
                        Answer = new RemediacionAnswer
                        {
                            Id = answer.IdAnswer.Value
                        },
                        Question = new RemediacionQuestion
                        {
                            Id = answer.IdQuestion
                        }
                    };
                    return testItem;
                }).ToList();
                List<Task> tasks = new List<Task>();

                var remediacionRequest = await remediacionService.GetRequestByRequestId(model.RemediacionId).ConfigureAwait(false);
                Impersonate(remediacionRequest.UserName, remediacionRequest.RemediationChannelType);

                if (model.PersonalData.Role != (int)TestTypeEnum.PersonaJurídica)
                {
                    tasks.Add(CreateCountriesFromQuestionsTest(test));
                    tasks.Add(CreateDocumentsFromQuestionsTest(test));
                }
                else
                {
                    tasks.Add(CreateAdditionalQuestionsFromJuridicTest(test));
                    var applicantRoles = await remediacionService.GetApplicantRoles(new Guid(model.RemediacionId));

                    foreach (var applicantRole in applicantRoles)
                    {
                        applicantRole.Percentage = applicantRole.Percentage is null ? 0 : applicantRole.Percentage;
                        if (model.JuridicApplicants.FirstOrDefault(a => a.RdCode == applicantRole.IdApplicant &&
                            a.RequestApplicantTypeId == applicantRole.RequestApplicantType).Percentage != applicantRole.Percentage)
                        {
                            applicantRole.Percentage = model.JuridicApplicants.FirstOrDefault(a => a.RdCode == applicantRole.IdApplicant &&
                                a.RequestApplicantTypeId == applicantRole.RequestApplicantType).Percentage;
                            await remediacionService.UpdateApplicantRole(applicantRole);
                        }
                    }
                }

                tasks.Add(remediacionService.UpdateApplicantTest(test.Where(a => !excludedQuestions.Contains(a.QuestionId)).ToList()));

                if (!string.IsNullOrEmpty(model.KnowledgeFile))
                {
                    var testType = "TESTPF";
                    if (model.PersonalData.Role != (int)TestTypeEnum.PersonaFísica)
                    {
                        testType = model.PersonalData.Role == (int)TestTypeEnum.PersonaJurídica ? "TESTPJ" : "TESTRP";
                    }

                    var testDocuware = new AltasSftp
                    {
                        RequestId = requestId,
                        TestData = model.KnowledgeFile,
                        TestType = testType
                    };
                    tasks.Add(remediacionService.AdditionalDocuments(testDocuware));
                }

                var status = new RemediacionRequestStatus
                {
                    IdRemediacionRequest = requestId,
                    IdStatus = model.IsExpiredKnowledgeTest ? Convert.ToInt32(RequestStatusEnum.TestActualizadoRiesgo) : Convert.ToInt32(RequestStatusEnum.TestConocimientoActualizado),
                    Created = DateTime.UtcNow
                };
                tasks.Add(MoveStatus(status));

                if (model.UpdateDocument && model.PersonalData.SendType == 2)
                {
                    var statusPending = new RemediacionRequestStatus
                    {
                        IdRemediacionRequest = requestId,
                        IdStatus = Convert.ToInt32(RequestStatusEnum.SolicitudFinalizadaParcialmente),
                        Created = DateTime.UtcNow
                    };
                    await MoveStatus(statusPending).ConfigureAwait(false);
                }

                await Task.WhenAll(tasks).ConfigureAwait(false);

                if (model.RemediacionChannel == (int)RemediacionChannelType.Telefonico)
                {
                    await signaturesService.GetSignRemediationRequest(new SignRemediationRequest
                    {
                        RequestId = requestId,
                        ProcesoRemediacionTel = true,
                        Asynchronous = false,
                        Sandbox = false,
                        CustomerId = Convert.ToInt32(model.ClientId)
                    }).ConfigureAwait(false);
                }
                BestInverBusinessMetrics.IncreaseKnowledgeTestStorage($"{HttpContext.Request.PathBase}{HttpContext.Request.Path}");
                return Ok(model);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error Remediación: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SignatureData(RemediacionModel model)
        {
            try
            {
                var req = await remediacionService.GetRequestByRequestId(model.RemediacionId).ConfigureAwait(false);
                Impersonate(req.UserName, req.RemediationChannelType);

                if (model.Signature != null &&
                    !string.IsNullOrEmpty(model.Signature.Email) &&
                    !string.IsNullOrEmpty(model.Signature.PhoneNumber))
                {
                    var applicant = req.Applicant;
                    applicant.MobilePhoneNumber = model.Signature.PhoneNumber;
                    applicant.Email = model.Signature.Email;

                    await remediacionService.UpdateCreateApplicant(applicant).ConfigureAwait(false);
                }

                var signRequest = new SignRemediationRequest
                {
                    RequestId = new Guid(model.RemediacionId),
                    Asynchronous = false,
                    Sandbox = false,
                    CustomerId = Convert.ToInt32(model.ClientId)
                };

                var documents = await signaturesService.GetSignRemediationRequest(signRequest).ConfigureAwait(false);
                var result = documents.GetEcerticDocumentList(Url.Action("openfile", "shared"), appSettings.Value.Aes256Key);

                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error Remediación: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> JuridicSignatureData(JuridicRemediacionModel juridicModel)
        {
            try
            {
                var documents = new SignedDocumentData();
                documents.DNI = new List<string>();
                documents.Email = new List<string>();
                documents.Telefono = new List<string>();
                documents.Nombre = new List<string>();
                documents.SignerData = new List<Signer>();
                documents.DocFiles = new List<List<DocFile>>();
                documents.OtpsTokens = new List<string>();
                documents.OtpsTokensSigner = new List<string>();
                documents.ElectronicSignatureServiceVersion = new List<int>();
                documents.AccessToken = new List<string>();
                documents.OtpsIds = new List<string>();
                documents.OtpsPins = new List<string>();

                foreach (var model in juridicModel.RemediacionModelList)
                {
                    if (model.Signature != null &&
                    !string.IsNullOrEmpty(model.Signature.Email) &&
                    !string.IsNullOrEmpty(model.Signature.PhoneNumber))
                    {
                        var req = await remediacionService.GetRequestByRequestId(model.RemediacionId).ConfigureAwait(false);
                        Impersonate(req.UserName, req.RemediationChannelType);

                        var applicant = await remediacionService.GetApplicant(model.ClientId);
                        if (applicant != null)
                        {
                            applicant.MobilePhoneNumber = model.Signature.PhoneNumber.Trim();
                            applicant.Email = model.Signature.Email;
                            await remediacionService.UpdateCreateApplicant(applicant).ConfigureAwait(false);
                        }

                        var applicantMO = await applicantService.GetApplicantByDNI(model.Dni.Dni);
                        if (applicantMO != null && applicant != null)
                        {
                            applicantMO.BasicData.Email = applicant.Email;
                            applicantMO.BasicData.MobilePhoneNumber = applicant.MobilePhoneNumber;
                            await applicantService.Update(applicantMO).ConfigureAwait(false);
                        }
                    }

                    var signRequest = new SignRemediationRequest
                    {
                        RequestId = new Guid(model.RemediacionId),
                        Asynchronous = false,
                        Sandbox = false,
                        CustomerId = Convert.ToInt32(model.ClientId)
                    };
                    var signedDocumentData = await signaturesService.GetSignRemediationRequest(signRequest).ConfigureAwait(false);

                    documents.Customid = signedDocumentData.Customid;
                    documents.DNI.AddRange(signedDocumentData.DNI);
                    documents.Email.AddRange(signedDocumentData.Email);
                    documents.Telefono.AddRange(signedDocumentData.Telefono);
                    documents.Nombre.AddRange(signedDocumentData.Nombre);
                    documents.SignerData.AddRange(signedDocumentData.SignerData);
                    documents.DocFiles.AddRange(signedDocumentData.DocFiles);
                    documents.OtpsTokens.AddRange(signedDocumentData.OtpsTokens);
                    documents.OtpsTokensSigner.AddRange(signedDocumentData.OtpsTokensSigner);
                    documents.ElectronicSignatureServiceVersion.AddRange(signedDocumentData.ElectronicSignatureServiceVersion);
                    documents.OtpsIds.AddRange(signedDocumentData.OtpsIds);
                    documents.OtpsPins.AddRange(signedDocumentData.OtpsPins);
                    if (signedDocumentData.AccessToken != null)
                    {
                        documents.AccessToken.AddRange(signedDocumentData.AccessToken);
                    }
                }

                var result = documents.GetEcerticDocumentList(Url.Action("openfile", "shared"), appSettings.Value.Aes256Key);

                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error Remediación: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SetRemediationSigned(Guid requestId, bool setpartialStatus = false)
        {
            try
            {
                var statusSignature = new RemediacionRequestStatus
                {
                    IdRemediacionRequest = requestId,
                    IdStatus = Convert.ToInt32(RequestStatusEnum.SolicitudFirmada),
                    Created = DateTime.UtcNow
                };
                await MoveStatus(statusSignature).ConfigureAwait(false);

                if (setpartialStatus)
                {
                    var statusPending = new RemediacionRequestStatus
                    {
                        IdRemediacionRequest = requestId,
                        IdStatus = Convert.ToInt32(RequestStatusEnum.SolicitudFinalizadaParcialmente),
                        Created = DateTime.UtcNow
                    };
                    await MoveStatus(statusPending).ConfigureAwait(false);
                }

                return Ok(true);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error Remediación: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SetJuridicRemediationSigned(Guid requestId, int applicantId, bool setpartialStatus = false)
        {
            try
            {
                var applicantRoles = await remediacionService.GetApplicantRoles(requestId);
                var applicantRole = applicantRoles.FirstOrDefault(a => a.IdApplicant == applicantId);
                var req = await remediacionService.GetRequestByRequestId(requestId.ToString()).ConfigureAwait(false);

                Impersonate(req.UserName, req.RemediationChannelType);

                if (applicantRole != null)
                {
                    applicantRole.SignDate = DateTime.UtcNow;
                    applicantRoles.FirstOrDefault(a => a.IdApplicant == applicantId).SignDate = applicantRole.SignDate;

                    await remediacionService.UpdateApplicantRole(applicantRole);
                }

                if (applicantRoles.Where(a => RoleToSign(a.RequestApplicantType)).All(a => a.HasToSign == null) &&
                    !applicantRoles.Where(a => RoleToSign(a.RequestApplicantType)).Any(a => a.SignDate.HasValue && a.IdApplicant != applicantRole.IdApplicant)
                    ||
                    (applicantRoles.Where(a => RoleToSign(a.RequestApplicantType)).All(a => a.HasToSign == true) &&
                    applicantRoles.Where(a => RoleToSign(a.RequestApplicantType)).All(a => a.SignDate.HasValue)))
                {
                    var statusSignature = new RemediacionRequestStatus
                    {
                        IdRemediacionRequest = requestId,
                        IdStatus = Convert.ToInt32(RequestStatusEnum.SolicitudFirmada),
                        Created = DateTime.UtcNow
                    };
                    await MoveStatus(statusSignature).ConfigureAwait(false);

                    if (setpartialStatus || applicantRoles.Where(a => RoleToSign(a.RequestApplicantType)).All(a => a.HasToSign == null))
                    {
                        var statusPending = new RemediacionRequestStatus
                        {
                            IdRemediacionRequest = requestId,
                            IdStatus = Convert.ToInt32(RequestStatusEnum.SolicitudFinalizadaParcialmente),
                            Created = DateTime.UtcNow
                        };
                        await MoveStatus(statusPending).ConfigureAwait(false);
                    }
                }

                return Ok(true);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error Remediación: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CompleteProcess(RemediacionModel model)
        {
            try
            {
                int idstatus = model.UpdateDocument ? Convert.ToInt32(RequestStatusEnum.SolicitudPendienteVerificar) : Convert.ToInt32(RequestStatusEnum.SolicitudFinalizadaParcialmente);
                var statusPending = new RemediacionRequestStatus
                {
                    IdRemediacionRequest = new Guid(model.RemediacionId),
                    IdStatus = idstatus,
                    Created = DateTime.UtcNow
                };
                await MoveStatus(statusPending).ConfigureAwait(false);

                var remediacionRequest = await remediacionService.GetRequestByRequestId(model.RemediacionId).ConfigureAwait(false);
                remediacionRequest.RemediationChannelType = null;
                await remediacionService.AddUpdateRequest(remediacionRequest).ConfigureAwait(false);

                return Ok(model);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error Remediación: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SendHelpMail([FromBody] string phone)
        {
            try
            {
                var result = await sendMailService.SendCallMeBackMail(phone, new RequestChannel
                {
                    Id = (int)RequestChannelType.Publica
                }).ConfigureAwait(false);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        public async Task<IActionResult> LegalModalContent()
        {
            try
            {
                var result = await remediacionService.GetLegalModalContent().ConfigureAwait(false);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AskForRequiredRealOwner([FromBody] RequestRequiredRealOwner model)
        {
            try
            {
                var result = await testService.AskForRequiredRealOwner(model).ConfigureAwait(false);
                return Ok(result);
            }
            catch
            {
                return Ok(false);
            }
        }

        #region Private methods

        private void Impersonate(string user, int? remediacionChannelType)
        {
            if (remediacionChannelType == (int?)RemediacionChannelType.Telefonico)
            {
                string loggedUser = HttpContext.User?.Identity?.Name;
                if (!string.IsNullOrEmpty(user) && loggedUser == null)
                {
                    var claims = new List<System.Security.Claims.Claim>
                {
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, user)
                };
                    var identity = new System.Security.Claims.ClaimsIdentity(claims);
                    var principal = new System.Security.Claims.ClaimsPrincipal(identity);
                    HttpContext.User = principal;
                }
            }
        }
        private async Task CreateCountriesFromQuestionsTest(IEnumerable<RemediacionTest> questions)
        {
            string idApplicant = questions.FirstOrDefault()?.ApplicantId;
            List<Task> tasks = new List<Task>();

            var fiscalCountry = questions.FirstOrDefault(q => q.QuestionId == (int)KnowledgeQuestionType.FiscalResidenceCountry);
            var country = new RemediacionApplicantCountry
            {
                IdApplicant = idApplicant,
                IdCountry = fiscalCountry.AnswerId,
                IdCountryType = (int)CountryTypeEnum.ResidenciaPrincipal
            };
            tasks.Add(remediacionService.UpdateApplicantCountry(country));

            var secondResidenceCountry = questions.FirstOrDefault(q => q.QuestionId == (int)KnowledgeQuestionType.SecondResidenceCountry);
            if (secondResidenceCountry != null)
            {
                var secondCountry = new RemediacionApplicantCountry
                {
                    IdApplicant = idApplicant,
                    IdCountry = secondResidenceCountry.AnswerId,
                    IdCountryType = (int)CountryTypeEnum.ResidenciaSecundaria
                };
                tasks.Add(remediacionService.UpdateApplicantCountry(secondCountry));
            }

            await Task.WhenAll(tasks).ConfigureAwait(false);
        }

        private async Task CreateDocumentsFromQuestionsTest(IEnumerable<RemediacionTest> questions)
        {
            string idApplicant = questions.FirstOrDefault()?.ApplicantId;
            List<Task> tasks = new List<Task>();

            var documentTypeFiscalQuestion = questions.FirstOrDefault(a => a.QuestionId == (int)KnowledgeQuestionType.FiscalResidenceDocumentType);
            var documentNumberFiscalQuestion = questions.FirstOrDefault(a => a.QuestionId == (int)KnowledgeQuestionType.FiscalResidenceDocumentNumber);
            var expirationDateFiscalQuestion = questions.FirstOrDefault(a => a.QuestionId == (int)KnowledgeQuestionType.FiscalResidenceDocumentExpirationDate);

            if (documentTypeFiscalQuestion != null && documentNumberFiscalQuestion != null && expirationDateFiscalQuestion != null)
            {
                KnowledgeAnswerApplicantDocumentType value = (KnowledgeAnswerApplicantDocumentType)documentTypeFiscalQuestion.AnswerId;
                DateTime expirationDate;
                DateTime.TryParse(expirationDateFiscalQuestion.OtherAnswer, out expirationDate);

                var documento = new RemediacionApplicantIDDocument
                {
                    Id = value.ToString(),
                    IdApplicant = idApplicant,
                    ExpirationDate = expirationDate,
                    Number = documentNumberFiscalQuestion.OtherAnswer
                };
                tasks.Add(remediacionService.UpdateApplicantDocument(documento));
            }

            var fiscalIdentificationFiscalQuestion = questions.FirstOrDefault(a => a.QuestionId == (int)KnowledgeQuestionType.FiscalResidenceNIF);
            if (fiscalIdentificationFiscalQuestion != null)
            {
                var documento = new RemediacionApplicantIDDocument
                {
                    Id = BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.IDDocumentType.NI1,
                    IdApplicant = idApplicant,
                    Number = fiscalIdentificationFiscalQuestion.OtherAnswer
                };
                tasks.Add(remediacionService.UpdateApplicantDocument(documento));
            }

            var documentTypeSecondCountryQuestion = questions.FirstOrDefault(a => a.QuestionId == (int)KnowledgeQuestionType.SecondResidenceDocumentType);
            var documentNumberSecondCountryQuestion = questions.FirstOrDefault(a => a.QuestionId == (int)KnowledgeQuestionType.SecondResidenceNumber);
            var expirationDateSecondCountryQuestion = questions.FirstOrDefault(a => a.QuestionId == (int)KnowledgeQuestionType.SecondResidenceExpirationDate);
            if (documentTypeSecondCountryQuestion != null && documentNumberSecondCountryQuestion != null && expirationDateSecondCountryQuestion != null)
            {
                KnowledgeAnswerApplicantDocumentType value = (KnowledgeAnswerApplicantDocumentType)documentTypeSecondCountryQuestion.AnswerId;
                DateTime expirationDate;
                DateTime.TryParse(expirationDateSecondCountryQuestion.OtherAnswer, out expirationDate);

                var documento = new RemediacionApplicantIDDocument
                {
                    Id = value.ToString(),
                    IdApplicant = idApplicant,
                    Number = documentNumberSecondCountryQuestion.OtherAnswer,
                    ExpirationDate = expirationDate
                };
                tasks.Add(remediacionService.UpdateApplicantDocument(documento));
            }

            var fiscalIdentificationSecondCountryQuestion = questions.FirstOrDefault(a => a.QuestionId == (int)KnowledgeQuestionType.SecondResidenceNIF);
            if (fiscalIdentificationSecondCountryQuestion != null)
            {
                var documento = new RemediacionApplicantIDDocument
                {
                    Id = BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.IDDocumentType.TIN,
                    IdApplicant = idApplicant,
                    Number = fiscalIdentificationSecondCountryQuestion.OtherAnswer
                };
                tasks.Add(remediacionService.UpdateApplicantDocument(documento));
            }

            var ssnQuestion = questions.FirstOrDefault(a => a.QuestionId == (int)KnowledgeQuestionType.PhysicalUsaSSN);
            if (ssnQuestion != null)
            {
                var documento = new RemediacionApplicantIDDocument
                {
                    Id = BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.IDDocumentType.SSN,
                    IdApplicant = idApplicant,
                    Number = ssnQuestion.OtherAnswer
                };
                tasks.Add(remediacionService.UpdateApplicantDocument(documento));

            }

            await Task.WhenAll(tasks).ConfigureAwait(false);
        }

        private async Task CreateAdditionalQuestionsFromJuridicTest(IEnumerable<RemediacionTest> questions)
        {
            List<Task> tasks = new List<Task>();

            var juridicBenefitCountry = questions.FirstOrDefault(q => q.QuestionId == (int)KnowledgeQuestionType.BenefitsCountry);
            string idApplicant = questions.FirstOrDefault()?.ApplicantId;
            if (juridicBenefitCountry != null)
            {
                var benefitsCountry = new RemediacionApplicantCountry
                {
                    IdApplicant = idApplicant,
                    IdCountry = juridicBenefitCountry.AnswerId,
                    IdCountryType = (int)CountryTypeEnum.MayorPorcentageBeneficios
                };
                tasks.Add(remediacionService.UpdateApplicantCountry(benefitsCountry));
            }

            var ssnQuestion = questions.FirstOrDefault(a => a.QuestionId == (int)KnowledgeQuestionType.JuridicUsaSSN);
            if (ssnQuestion != null)
            {
                var documento = new RemediacionApplicantIDDocument
                {
                    Id = BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.IDDocumentType.EIN,
                    IdApplicant = idApplicant,
                    Number = ssnQuestion.OtherAnswer
                };
                tasks.Add(remediacionService.UpdateApplicantDocument(documento));
            }

            await Task.WhenAll(tasks).ConfigureAwait(false);
        }

        private async Task MoveStatus(RemediacionRequestStatus status)
        {
            var remediacionRequest = await remediacionService.GetRequestByRequestId(status.IdRemediacionRequest.ToString("D")).ConfigureAwait(false);
            Impersonate(remediacionRequest.UserName, remediacionRequest.RemediationChannelType);

            var lastStatus = remediacionRequest.RemediacionRequestStatus.OrderByDescending(s => s.Created).FirstOrDefault();

            if (lastStatus.IdStatus != status.IdStatus)
            {
                await remediacionService.AddStatus(status).ConfigureAwait(false);
            }
        }

        private async Task checkStatus(List<RemediacionRequestStatus> statusList, RemediacionModel model)
        {
            var lastStatus = statusList.OrderByDescending(s => s.Created).FirstOrDefault();
            if ((lastStatus?.IdStatus ?? 0) > (int)RequestStatusEnum.SolicitudPendienteVerificar &&
                (lastStatus?.IdStatus ?? 0) != (int)RequestStatusEnum.TestActualizadoRiesgo)
            {
                throw new AccountException();
            }
            else if (lastStatus?.IdStatus == 1)
            {
                var firstStatus = new RemediacionRequestStatus
                {
                    IdRemediacionRequest = lastStatus.IdRemediacionRequest,
                    IdStatus = Convert.ToInt32(RequestStatusEnum.Iniciado),
                    Created = DateTime.UtcNow
                };
                await MoveStatus(firstStatus).ConfigureAwait(false);
            }

            if ((lastStatus?.IdStatus ?? 0) == (int)RequestStatusEnum.SolicitudFirmada ||
                (lastStatus?.IdStatus ?? 0) == (int)RequestStatusEnum.SolicitudFinalizadaParcialmente)
            {
                model.IsCompletedProcess = true;
            }
        }

        private async Task<RemediacionModel> buildModel(RemediacionRequest remediacionRequest)
        {
            var model = mapper.Map<RemediacionModel>(remediacionRequest);
            model.IsCompletedProcess = false;

            if (remediacionRequest.IsExpiredKnowledgeTest.HasValue && remediacionRequest.IsExpiredKnowledgeTest.Value)
            {
                var answers = await remediacionService.GetRDKnowledgeTest(model.ClientId).ConfigureAwait(false);
                model.Test = mapper.Map<IEnumerable<RemediacionTestModel>>(answers);
            }

            var master = await signUpService.GetMasterdata().ConfigureAwait(false);
            model.MasterData = mapper.Map<MasterDataModel>(master);

            var requestApplicantType = 1;
            model.JuridicApplicants = new List<JuridicApplicantRem>();
            if (remediacionRequest.TestType == (int)TestTypeEnum.PersonaJurídica)
            {
                requestApplicantType = 2;
                await MapJuridicApplicantsAndSignatureType(model, remediacionRequest.Id);
                AddExcludedQuestions(remediacionRequest.Applicant);
                model.Test = mapper.Map<IEnumerable<RemediacionTestModel>>(remediacionRequest.Applicant.Tests);
            }

            var questions = await testService.GetQuestions(1, requestApplicantType).ConfigureAwait(false);
            model.Questions = mapper.Map<IEnumerable<QuestionModel>>(questions);

            await checkStatus(remediacionRequest.RemediacionRequestStatus, model).ConfigureAwait(false);
            if (model.PendingSignature)
            {
                var remStatus = await signaturesService.GetDocumentSignedStatus(new SignedStatus
                {
                    RequestId = remediacionRequest.Id.ToString()
                }).ConfigureAwait(false);

                if (remStatus != null && remStatus.SignersStatus != null)
                {
                    model.PendingSignature = !remStatus.SignersStatus.Contains("SIGNED")
                    && !remStatus.SignersStatus.Contains("OTP_OK")
                    && !remStatus.SignersStatus.Contains("READYTOSIGN");
                }
                else
                {
                    logger.LogWarning("Signature status not available for remediation request {RequestId}", remediacionRequest.Id);
                }
            }

            if (model.IsCompletedProcess)
            {
                model.JuridicApplicants.ToList().ForEach(a => a.HasToSign = false);
            }

            return model;
        }

        private async Task MapJuridicApplicantsAndSignatureType(RemediacionModel model, Guid requestId)
        {
            var juridicApplicants = await remediacionService.GetJuridicInterveners(requestId);
            var applicantRoles = await remediacionService.GetApplicantRoles(requestId);

            var result = new List<JuridicApplicantRem>();

            foreach (var applicantRole in applicantRoles.OrderBy(a => a.RequestApplicantType))
            {
                var applicant = juridicApplicants.FirstOrDefault(a => a.RdCode == applicantRole.IdApplicant);

                var hasToSign =
                    RoleToSign(applicantRole.RequestApplicantType)
                    && !applicantRole.SignDate.HasValue;

                if (result.Any(a => a.RdCode == applicantRole.IdApplicant && a.HasToSign is true))
                {
                    hasToSign = false;
                }

                var juridicApplicant = new JuridicApplicantRem()
                {
                    RdCode = applicant.RdCode.Value,
                    DocumentNumber = applicant.DNI,
                    Name = applicant.Name,
                    FirstSurname = applicant.FirstSurname,
                    SecondSurname = applicant.SecondSurname,
                    Birthday = applicant.Birthday,
                    MobilePhoneNumber = applicant.MobilePhoneNumber,
                    Email = applicant.Email,
                    BornPlace = applicant.BornPlace,
                    ApplicantTypeId = applicant.ApplicantType.Id,
                    RequestApplicantTypeId = applicantRole.RequestApplicantType,
                    Percentage = applicantRole.Percentage,
                    HasToSign = hasToSign
                };

                result.Add(juridicApplicant);
            }

            model.IsJointSignature = applicantRoles.Where(a => RoleToSign(a.RequestApplicantType)).Any(a => a.HasToSign == true);

            model.JuridicApplicants = result;
        }

        private static bool RoleToSign(int requestApplicantType)
        {
            if (requestApplicantType == (int)BestInver.WebPrivada.Shared.Models.Backend.Customers.Enums.ApplicantRoleType.Apoderado ||
                requestApplicantType == (int)BestInver.WebPrivada.Shared.Models.Backend.Customers.Enums.ApplicantRoleType.Administrador ||
                requestApplicantType == (int)BestInver.WebPrivada.Shared.Models.Backend.Customers.Enums.ApplicantRoleType.ApoderadoAndAdministrador ||
                requestApplicantType == (int)BestInver.WebPrivada.Shared.Models.Backend.Customers.Enums.ApplicantRoleType.ApoderadoAndOrganoRep ||
                requestApplicantType == (int)BestInver.WebPrivada.Shared.Models.Backend.Customers.Enums.ApplicantRoleType.ApoderadoAndPatrono ||
                requestApplicantType == (int)BestInver.WebPrivada.Shared.Models.Backend.Customers.Enums.ApplicantRoleType.TitularRealAndApoderado)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private static void AddExcludedQuestions(RemediacionApplicant applicant)
        {
            var test = new List<RemediacionTest>(applicant.Tests);
            var juridicBenefitCountry = applicant.ApplicantCountries?.FirstOrDefault(c => c.IdCountryType == (int)CountryTypeEnum.MayorPorcentageBeneficios);

            if (juridicBenefitCountry != null)
            {
                test.Add(new RemediacionTest()
                {
                    ApplicantId = applicant.RDTitular,
                    QuestionId = (int)KnowledgeQuestionType.BenefitsCountry,
                    AnswerId = juridicBenefitCountry.IdCountry
                });
            }

            var einQuestion = applicant.ApplicantIDDocuments?.FirstOrDefault(a => a.Id == BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.IDDocumentType.EIN);
            if (einQuestion != null)
            {
                test.Add(new RemediacionTest()
                {
                    ApplicantId = applicant.RDTitular,
                    QuestionId = (int)KnowledgeQuestionType.JuridicUsaSSN,
                    OtherAnswer = einQuestion.Number
                });
            }

            applicant.Tests = test;
        }

        #endregion

    }
}