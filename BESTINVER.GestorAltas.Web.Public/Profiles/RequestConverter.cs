using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Shared.Enums;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Models.Applicants;
using BESTINVER.GestorAltas.Web.Models.Tests;
using BESTINVER.GestorAltas.Web.Public.Models.Register;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    public class RequestConverter : ITypeConverter<RegisterData, RequestFullData>
    {
        public RequestFullData Convert(RegisterData source, RequestFullData destination, ResolutionContext context)
        {
            {
                destination = new RequestFullData();
            }

            MapToModel(source, destination);
            return destination;
        }

        private void MapToModel(RegisterData source, RequestFullData destination)
        {
            destination.Applicants = MapApplicants(source);
            destination.OperationData = MapProductOperations(source.OperationData);
            destination.SignatureType = source.SignatureType;
            destination.RequestId = source.requestID;
            destination.Username = source.UserName;
            destination.IsEmployee = source.OperationData.Any(o => o.Operations.Any(op => op.IsEmployee.HasValue && op.IsEmployee.Value));
            destination.AccountNumber = source.RefundAccountNumber;
            destination.AccountNumberAcceptanceDate = source.AccountNumberAcceptanceDate;
        }

        private IEnumerable<SignUpApplicant> MapApplicants(RegisterData source)
        {
            List<SignUpApplicant> destination = new List<SignUpApplicant>();
            foreach (var app in source.Applicants)
            {
                var applicant = new SignUpApplicant
                {
                    BasicData = new BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.ApplicantBasicData
                    {
                        Dni = app.BasicData.DNI,
                        ApplicantType = app.BasicData.ApplicantType,
                        Email = app.BasicData.Email,
                        FirstSurname = app.BasicData.FirstSurname,
                        IDDocumentType = app.BasicData.IDDocumentType,
                        MobilePhoneNumber = app.BasicData.MobilePhoneNumber,
                        Name = app.BasicData.Name,
                        RequestApplicantType = app.BasicData.RequestApplicantType,
                        SecondSurname = app.BasicData.SecondSurname,
                        InformationRight = app.BasicData.InformationRight,
                        Legal = app.BasicData.Legal,
                        LifeCicleOk = app.BasicData.LifeCicleOk,
                        Fax = app.BasicData.Fax,
                        PhoneNumber = app.BasicData.PhoneNumber
                    },
                    PersonalData = new SignUpRequestApplicantPersonalData
                    {
                        Birthday = app.PersonalData.Birthday,
                        BornPlace = app.PersonalData.BornPlace,
                        Gender = app.PersonalData.Gender,
                        IDDocumentExpirationDate = app.PersonalData.IDDocumentIsPermanent ? null : app.PersonalData.IDDocumentExpirationDate,
                        Fax = app.PersonalData.Fax,
                        IDDocumentIsPermanent = app.PersonalData.IDDocumentIsPermanent,
                        IsResident = app.PersonalData.IsResident,
                        PhoneNumber = app.PersonalData.PhoneNumber
                    },
                    ApplicantRole = new List<SignUpApplicantRole>
                            {
                                new SignUpApplicantRole
                                {
                                    IdApplicant = app.BasicData.DNI,
                                    RequestApplicantType = app.BasicData.RequestApplicantType,
                                    RequestId = app.BasicData.RequestId,
                                    Percentage = app.PersonalData.CompanyPercentage
                                }
                            },
                    ContactData = MapAddress(app.ContactData),
                    QuestionAnswers = MapTest(app.Answers),
                    Countries = MapCountries(app),
                    ApplicantIDDocuments = MapIDDocuments(app),
                    IdApplicantChannel = 1
                };

                if (app.PersonalData.Country.HasValue)
                {
                    app.PersonalData.Country = app.PersonalData.Country.Value;
                }

                if (app.PersonalData.Nacionality.HasValue)
                {
                    app.PersonalData.Nacionality = app.PersonalData.Nacionality.Value;
                }

                destination.Add(applicant);
            }

            return destination;
        }

        private IList<SignUpAddressData> MapAddress(IEnumerable<AddressData> source)
        {
            List<SignUpAddressData> destination = [];
            foreach (var dir in source)
            {
                destination.Add(
                    new SignUpAddressData
                    {
                        AddressExtension = dir.AddressExtension,
                        AddressType = dir.AddressType,
                        City = dir.City,
                        CountryType = dir.CountryType,
                        Door = dir.Door,
                        Floor = dir.Floor,
                        IdCountry = dir.IdCountry,
                        Name = dir.Name,
                        Number = dir.Number,
                        PostalCode = dir.PostalCode,
                        Province = dir.Province,
                        Stairs = dir.Stairs,
                        ViaType = dir.ViaType
                    }
                );
            }
            return destination;
        }

        private static List<RequestQuestionAnswer> MapTest(IEnumerable<QuestionAnswerModel> source)
        {
            List<RequestQuestionAnswer> destination = [];

            if (source == null)
                return destination;

            foreach (var question in source)
            {
                destination.Add(
                    new RequestQuestionAnswer
                    {
                        IdAnswer =  question.IdAnswer.GetValueOrDefault(), //question.IdAnswer.HasValue ? question.IdAnswer.Value : 0,
                        IdQuestion = question.IdQuestion,
                        OtherAnswer = question.OtherAnswer
                    }
                );
            }
            return destination;
        }

        private static List<SignUpApplicantCountry> MapCountries(ApplicantData source)
        {
            List<SignUpApplicantCountry> destination = [];

            var fiscalResidenceCountry = source.Answers != null ? source.Answers.FirstOrDefault(q => q.IdQuestion == (int)KnowledgeQuestionType.FiscalResidenceCountry) : null;
            var secondResidenceCountry = source.Answers != null ? source.Answers.FirstOrDefault(q => q.IdQuestion == (int)KnowledgeQuestionType.SecondResidenceCountry) : null;
            var juridicBenefitCountryQuestion = source.Answers != null ? source.Answers.FirstOrDefault(q => q.IdQuestion == (int)KnowledgeQuestionType.BenefitsCountry) : null;
            var fiscalAddress = source.ContactData?.FirstOrDefault(a => a.AddressType == "FiscalAddress");

            if (secondResidenceCountry != null)
            {
                destination.Add(
                    new SignUpApplicantCountry
                    {
                        CountryId = secondResidenceCountry.IdAnswer.Value,
                        CountryTypeId = (int)CountryType.SecondaryResidence
                    }
                );
            }

            if (source.PersonalData.Country != null && source.PersonalData.Country != 0)
            {
                destination.Add(new SignUpApplicantCountry
                {
                    CountryId = source.PersonalData.Country.Value,
                    CountryTypeId = (int)CountryType.Birth
                });
            }

            if (source.PersonalData.Nacionality != null && source.PersonalData.Nacionality != 0)
            {
                destination.Add(new SignUpApplicantCountry
                {
                    CountryId = source.PersonalData.Nacionality.Value,
                    CountryTypeId = (int)CountryType.Nationality
                });
            }

            if ((fiscalResidenceCountry != null && fiscalResidenceCountry.IdAnswer != 0) || fiscalAddress != null)
            {
                var idCountry = fiscalResidenceCountry != null ? fiscalResidenceCountry.IdAnswer : fiscalAddress.IdCountry;
                destination.Add(new SignUpApplicantCountry
                {
                    CountryId = idCountry.Value,
                    CountryTypeId = (int)CountryType.MainResidence
                });
            }

            if (juridicBenefitCountryQuestion != null)
            {
                destination.Add(
                    new SignUpApplicantCountry
                    {
                        CountryId = juridicBenefitCountryQuestion.IdAnswer.Value,
                        CountryTypeId = (int)CountryType.MostProfitableCountry
                    }
                );
            }

            return destination;
        }

        private IEnumerable<SignUpApplicantIDDocument> MapIDDocuments(ApplicantData source)
        {
            List<SignUpApplicantIDDocument> destination = new List<SignUpApplicantIDDocument>();
            
            var documentTypeFiscalQuestion = source.Answers?.FirstOrDefault(a => a.IdQuestion == (int)KnowledgeQuestionType.FiscalResidenceDocumentType);
            var documentNumberFiscalQuestion = source.Answers?.FirstOrDefault(a => a.IdQuestion == (int)KnowledgeQuestionType.FiscalResidenceDocumentNumber);
            var expirationDateFiscalQuestion = source.Answers?.FirstOrDefault(a => a.IdQuestion == (int)KnowledgeQuestionType.FiscalResidenceDocumentExpirationDate);

            if (documentTypeFiscalQuestion != null && documentNumberFiscalQuestion != null && expirationDateFiscalQuestion != null)
            {
                KnowledgeAnswerApplicantDocumentType value = (KnowledgeAnswerApplicantDocumentType)documentTypeFiscalQuestion.IdAnswer;
                DateTime expirationDate;
                DateTime.TryParse(expirationDateFiscalQuestion.OtherAnswer, out expirationDate);
                destination.Add(
                   new SignUpApplicantIDDocument
                   {
                       DocumentID = value.ToString(),
                       DocumentNumber = documentNumberFiscalQuestion.OtherAnswer,
                       ExpirationDate = expirationDate
                   }
               );
            }

            var fiscalIdentificationFiscalQuestion = source.Answers?.FirstOrDefault(a => a.IdQuestion == (int)KnowledgeQuestionType.FiscalResidenceNIF);
            if (fiscalIdentificationFiscalQuestion != null)
            {
                destination.Add(
                  new SignUpApplicantIDDocument
                  {
                      DocumentID = IDApplicantDocumentType.NI1,
                      DocumentNumber = fiscalIdentificationFiscalQuestion.OtherAnswer
                  }
              );
            }
            
            var documentTypeSecondCountryQuestion = source.Answers?.FirstOrDefault(a => a.IdQuestion == (int)KnowledgeQuestionType.SecondResidenceDocumentType);
            var documentNumberSecondCountryQuestion = source.Answers?.FirstOrDefault(a => a.IdQuestion == (int)KnowledgeQuestionType.SecondResidenceNumber);
            var expirationDateSecondCountryQuestion = source.Answers?.FirstOrDefault(a => a.IdQuestion == (int)KnowledgeQuestionType.SecondResidenceExpirationDate);
            if (documentTypeSecondCountryQuestion != null && documentNumberSecondCountryQuestion != null && expirationDateSecondCountryQuestion != null)
            {
                KnowledgeAnswerApplicantDocumentType value = (KnowledgeAnswerApplicantDocumentType)documentTypeSecondCountryQuestion.IdAnswer;
                DateTime expirationDate;
                DateTime.TryParse(expirationDateSecondCountryQuestion.OtherAnswer, out expirationDate);
                destination.Add(
                   new SignUpApplicantIDDocument
                   {
                       DocumentID = value.ToString(),
                       DocumentNumber = documentNumberSecondCountryQuestion.OtherAnswer,
                       ExpirationDate = expirationDate
                   }
               );
            }

            var fiscalIdentificationSecondCountryQuestion = source.Answers?.FirstOrDefault(a => a.IdQuestion == (int)KnowledgeQuestionType.SecondResidenceNIF);
            if (fiscalIdentificationSecondCountryQuestion != null /*|| !string.IsNullOrEmpty(source.PersonalData.FiscalNumber)*/)
            {
                destination.Add(
                  new SignUpApplicantIDDocument
                  {
                      DocumentID = IDApplicantDocumentType.TIN.ToString(),
                      DocumentNumber = /*!string.IsNullOrEmpty(source.PersonalData.FiscalNumber) ? source.PersonalData.FiscalNumber :*/ fiscalIdentificationSecondCountryQuestion.OtherAnswer
                  }
                );
            }


            var ssnQuestion = source.Answers?.FirstOrDefault(a => a.IdQuestion == (int)KnowledgeQuestionType.PhysicalUsaSSN);
            if (ssnQuestion != null || !string.IsNullOrEmpty(source.PersonalData.UsaFiscalNumber))
            {
                destination.Add(
                  new SignUpApplicantIDDocument
                  {
                      DocumentID = IDApplicantDocumentType.SSN.ToString(),
                      DocumentNumber = !string.IsNullOrEmpty(source.PersonalData.UsaFiscalNumber) ? source.PersonalData.UsaFiscalNumber : ssnQuestion.OtherAnswer
                  }
                );
            }

            var juridicSsnQuestion = source.Answers?.FirstOrDefault(a => a.IdQuestion == (int)KnowledgeQuestionType.JuridicUsaSSN);
            if(juridicSsnQuestion != null)
            {
                destination.Add(
                 new SignUpApplicantIDDocument
                 {
                     DocumentID = IDApplicantDocumentType.EIN.ToString(),
                     DocumentNumber = juridicSsnQuestion.OtherAnswer
                 }
               );
            }

            return destination;
        }

        private static List<SignUpRequestProductOperation> MapProductOperations(IEnumerable<ProductOperationModel> source)
        {
            List<SignUpRequestProductOperation> destination = [];

            foreach (var op in source)
            {
                destination.Add(
                    new SignUpRequestProductOperation
                    {
                        ProductId = op.IdProduct,
                        Operation = MapProductOperations(op.Operations)
                    }
                );
            }

            return destination;
        }

        private static List<SignUpRequestOperation> MapProductOperations(IEnumerable<OperationModel> source)
        {
            List<SignUpRequestOperation> destination = [];
            int[] receivedAutoSet = new int[] { (int)OperationType.Traspaso, (int)OperationType.Recibo };

            foreach (var op in source)
            {
                var obj = new SignUpRequestOperation();
                obj.After2007 = op.After2007;
                obj.Amount = op.Amount;
                obj.Before2007 = op.Before2007;
                obj.FondoCode = op.FondoCode;
                obj.FondoISIN = op.FondoISIN;
                obj.FondoName = op.FondoName;
                obj.FondoType = op.FondoType;
                obj.FundReceived = receivedAutoSet.Contains(op.IdOperationType) ? true : false;
                obj.FundReceivedDate = op.FundReceivedDate;
                obj.IBAN = op.IBAN;
                obj.IdOperationType = op.IdOperationType;
                obj.IdTransferType = op.IdTransferType.HasValue ? (BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.TransferType)op.IdTransferType : (BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request.TransferType)1;
                obj.IdWayToPay = op.IdWayToPay;
                obj.ManagerCode = op.ManagerCode;
                obj.ManagerName = op.ManagerName;
                obj.MonthlyAmount = op.MonthlyAmount;
                obj.OperationDisplayName = op.OperationDisplayName;
                obj.OperationDisplayWayToPay = op.OperationDisplayWayToPay;
                obj.ParOpe = op.ParOpe;
                obj.ParticipantAccount = op.ParticipantAccount;
                obj.PayerName = op.PayerName;
                obj.PlanCode = op.PlanCode;
                obj.PlanName = op.PlanName;

                destination.Add(obj);
            }
            return destination;
        }
    }
}