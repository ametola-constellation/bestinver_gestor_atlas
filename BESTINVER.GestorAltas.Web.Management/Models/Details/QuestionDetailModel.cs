using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class QuestionDetailModel
    {
        public QuestionDetailModel()
        {
            AllowEdit = true;
            Answers = new List<QuestionAnswerModel>();
            PosibleAnswers = new List<SelectItemModel>();
        }

        public int IdQuestion { get; set; }
        public string Question { get; set; }
        public int TestType { get; set; }
        public int? QuestionOrder { get; set; }
        public bool AllowEdit { get; set; }
        public string IdApplicant { get; set; }
        public int RequestApplicantType { get; set; }
        public Guid RequestId { get; set; }
        public bool IsRequired { get; set; }
        public QuestionType QuestionType { get; set; }
        public bool IsExtended { get; set; }
        public int ComboAnswer { get; set; }
        public string ComboExtendedAnswer { get; set; }
        public string TextAnswer { get; set; }
        public int[] PosibleExtendedAnswers { get; set; }
        public IList<QuestionAnswerModel> Answers { get; set; }
        public List<SelectItemModel> PosibleAnswers { get; set; }
        public bool AllowMultiple { get; set; }

    }

    public class QuestionAnswerModel
    {
        public QuestionAnswerModel()
        {
            SubAnswers = new List<QuestionAnswerModel>();
            DependedAnswers = [];
        }

        public int IdAnswer { get; set; }
        public string Answer { get; set; }
        public string OtherAnswer { get; set; }
        public bool Checked { get; set; }
        public bool ExtendedAnswer { get; set; }

        public List<QuestionAnswerModel> SubAnswers { get; set; }
        public int[] DependedAnswers { get; set; }
    }

    public enum QuestionType
    {
        Combo = 1,
        Text = 2,
        Check = 3
    }

    public class QuestionPublicModel : QuestionDetailModel
    {
        public string Entidad { get; set; }
        public string Cargo { get; set; }
        public string Departamento { get; set; }
        public bool AskForPrpAnswers { get; set; }
        public QuestionDetailModel PrpQuestion { get; set; }
    }

    public class QuestionAdminModel : QuestionDetailModel
    {
        public string Entidad { get; set; }
        public string Cargo { get; set; }
    }

    public class QuestionSecondFiscalCountry : QuestionDetailModel
    {
        public QuestionSecondFiscalCountry() : base()
        {
            this.DocumentTypes = new List<SelectItemModel>
            {
                new SelectItemModel
                {
                    Id = "DNI",
                    Description = "DNI/Equivalente"
                },
                new SelectItemModel
                {
                    Id = "PAS",
                    Description = "Pasaporte"
                },
                new SelectItemModel
                {
                    Id = "TUE",
                    Description = "Tarjeta de identificación expedida por autoridades del país de la UE o EEE."
                }
            };
        }
        public int? Country { get; set; }
        public string DocumentType { get; set; }
        public string DocumentNumber { get; set; }
        public DateTime DocumentExpirationDate { get; set; }
        public string DocumentIdentification { get; set; }
        public List<SelectItemModel> DocumentTypes { get; set; }
        public List<SelectItemModel> Countries { get; set; }
        public int FiscalCountry { get; set; }
    }
}