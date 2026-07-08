using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Backend.MoreProducts.Request;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests;
using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    public class ConvenienceTestProfile : Profile
    {
        public ConvenienceTestProfile() : base(nameof(ConvenienceTestProfile))
        {
            CreateMap<CheckConvenienceData, ConvenienceRequest>().ConvertUsing<ConvenienceTestConverter>();
        }
    }

    public class ConvenienceTestConverter : ITypeConverter<CheckConvenienceData, ConvenienceRequest>
    {
        public ConvenienceRequest Convert(CheckConvenienceData source, ConvenienceRequest destination, ResolutionContext context)
        {
            destination = new ConvenienceRequest
            {
                ProductId = source.ProductId
            };

            List<NewOrderTestAnswer> answers = new List<NewOrderTestAnswer>();
            foreach(var answer in source.Answers)
            {
                answers.Add(new NewOrderTestAnswer
                {
                    Id = answer.IdQuestion,
                    TestType = 2,
                    QuestionAnswers = new List<NewOrderQuestionAnswer>
                    {
                        new NewOrderQuestionAnswer
                        {
                            Id = answer.IdAnswer
                        }
                    }
                });
            }

            destination.ConvenienceTestAnswers = answers;

            return destination;
        }
    }
}
