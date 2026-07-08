using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using System.Collections.Generic;
using System.Linq;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    public class QuestionProfile : Profile
    {
        public QuestionProfile() : base(nameof(QuestionProfile))
        {
            CreateMap<Question, QuestionModel>()
                .ForMember(x => x.AllowMultipleAnswers, o => o.MapFrom(s => s.AllowMultiAnswer))
                .ForMember(x => x.AllowNoAnswer, o => o.MapFrom(s => s.AllowNoAnswer))
                .ForMember(x => x.IdQuestion, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.Question, o => o.MapFrom(s => s.Text))
                .ForMember(x => x.QuestionGroup, o => o.MapFrom(s => s.QuestionGroup))
                .ForMember(x => x.QuestionLabel, o => o.MapFrom(s => s.Label))
                .ForMember(x => x.QuestionOrder, o => o.MapFrom(s => s.QuestionOrder))
                .ForMember(x => x.TestType, o => o.MapFrom(s => s.GetTestType()))
                .ForPath(x => x.Answers, o => o.MapFrom(s => s.QuestionAnswers))
                .ForMember(x => x.ToolTip, o => o.MapFrom(s => s.Tooltip))
                .ForMember(x => x.ErrorMessage, o => o.MapFrom(s => s.Error))
                .ForMember(x => x.Type, o => o.MapFrom(s => s.Type))
                .ForMember(x => x.FamilyProductId, o => o.MapFrom(s => s.FamilyProductId))
                .ForMember(x => x.SubFamilyProductId, o => o.MapFrom(s => s.SubFamilyProductId));

            CreateMap<QuestionAnswer, AnswerModel>()
                .ForMember(x => x.Answer, o => o.MapFrom(s => s.Text))
                .ForMember(x => x.ExtendedAnswer, o => o.MapFrom(s => s.ExtendedAnswer))
                .ForMember(x => x.IdAnswer, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.NotMultiAnswer, o => o.MapFrom(s => s.NotMultiAnswer))
                .ForMember(x => x.DependentQuestion, o => o.MapFrom(s => s.DependentQuestion))
                .ForMember(x => x.AnswerOrder, o => o.MapFrom(s => s.AnswerOrder))
                .ForMember(x => x.Type, o => o.MapFrom(s => s.Type))
                .ForMember(x => x.NoAnswer, o => o.MapFrom(s => s.NoAnswer));

            CreateMap<RequestQuestionAnswer, TestQuestion>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.IdQuestion));

            CreateMap<RequestQuestionAnswer, TestAnswer>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.IdAnswer))
                .ForMember(x => x.OtherAnswer, o => o.MapFrom(s => s.OtherAnswer));
        }
    }

    public static class TestTypeExtension
    {
        public static int GetTestType(this Question question)
        {
            int testtype;
            switch (question.TestType)
            {
                case 1:
                case 4:
                    {
                        testtype = 1;
                        break;
                    }
                //case 2:
                //case 6:
                //    {
                //        testtype = 2;
                //        break;
                //    }
                default:
                    {
                        testtype = question.TestType;
                        break;
                    }
            }

            return testtype;
        }
    }
}