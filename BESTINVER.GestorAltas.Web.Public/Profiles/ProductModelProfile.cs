using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Products;
using BESTINVER.GestorAltas.Web.Models.Requests;
using BESTINVER.GestorAltas.Web.Public.Models.Register;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace BESTINVER.GestorAltas.Web.Public.Profiles
{
    public class ProductModelProfile : Profile
    {
        public ProductModelProfile() : base(nameof(ProductModelProfile))
        {
            CreateMap<Product, ProductModel>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.MoProductId))
                .ForMember(x => x.AdultMax, o => o.MapFrom(s => s.AdultMax))
                .ForMember(x => x.AdultMin, o => o.MapFrom(s => s.AdultMin))
                .ForMember(x => x.Description, o => o.MapFrom(s => s.Description))
                .ForMember(x => x.DisabledMax, o => o.MapFrom(s => s.DisabledMax))
                .ForMember(x => x.DisabledMin, o => o.MapFrom(s => s.DisabledMin))
                .ForMember(x => x.Name, o => o.MapFrom(s => s.Name))
                .ForMember(x => x.ProductTypeId, o => o.MapFrom(s => (s.MoProductId != (int)(ProductNames.BESTINVER_INFRA) ? s.ProductType.Id : "2")))
                .ForMember(x => x.FromAge, o => o.MapFrom(s => s.FromAge))
                .ForMember(x => x.IBAN, o => o.MapFrom(s => s.BankAccount.IBAN))
                .ForMember(x => x.MinorMax, o => o.MapFrom(s => s.MinorMax))
                .ForMember(x => x.MinorMin, o => o.MapFrom(s => s.MinorMin))
                .ForMember(x => x.OrderToShow, o => o.MapFrom(s => s.OrderToShow))
                .ForMember(x => x.Profitability, o => o.MapFrom(s => s.Profitability))
                .ForMember(x => x.ProfitabilityDateText, o => o.MapFrom(s => s.ProfitabilityDateText))
                .ForMember(x => x.ToAge, o => o.MapFrom(s => s.ToAge))
                .ForMember(x => x.ComplexProduct, o => o.MapFrom(s => s.FamilyProduct.Complex))
                .ForMember(x => x.RDCode, o => o.MapFrom(s => s.RDCode))
                .ForMember(x => x.Family, o => o.MapFrom(s => s.FamilyProduct.DegreeComplexity))
                .ForMember(x => x.EmployeeMax, o => o.MapFrom(s => s.EmployeeMax))
                .ForMember(x => x.EmployeeMin, o => o.MapFrom(s => s.EmployeeMin))
                .ForMember(x => x.SubFamilyProductId, o => o.MapFrom(s => s.SubFamilyProduct.Id));
        }
    }

    public static class ProductComplexityExtension
    {
        public static bool IsComplex (this Product product)
        {
            return product.GetFamily() == 10 || product.GetFamily() == 11 || product.GetFamily() == 12;
        }

        public static int GetFamily(this Product product)
        {
            int family;
            switch (product.MoProductId)
            {
                case 7:
                case 16:
                case 19:
                    {
                        family = 1;
                        break;
                    }

                case 5:
                case 6:
                    {
                        family = 2;
                        break;
                    }

                case 1:
                case 2:
                case 3:
                case 4:
                case 8:
                case 18:
                    {
                        family = 3;
                        break;
                    }

                case 20:
                    {
                        family = 4;
                        break;
                    }

                case 23:
                    {
                        family = 5;
                        break;
                    }

                case 9:
                case 21:
                case 24:
                    {
                        family = 11;
                        break;
                    }
                default:
                    {
                        family = 0;
                        break;
                    } 
            }

            return family;
        }
    }
}