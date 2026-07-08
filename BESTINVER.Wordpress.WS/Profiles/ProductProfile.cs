using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Products;
using BESTINVER.Wordpress.WS.Models;
using System;
using System.Globalization;

namespace BESTINVER.Wordpress.WS.Profiles
{
    /// <summary>
    ///
    /// </summary>
    public class ProductProfile : Profile
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public ProductProfile() : base(nameof(ProductProfile))
        {
            CultureInfo myCultInfo = new CultureInfo("es-ES");

            CreateMap<ProductDailyYtdProfitability, AllLiquidityProfitabilityDateLastYearResponse>()
            .ForMember(x => x.Code, o => o.MapFrom(s => s.ProductId))
            .ForMember(x => x.Name, o => o.MapFrom(s => s.ProductShortDesc))
            .ForMember(x => x.Date, o => o.MapFrom(s => s.ValuationLastDayPY.HasValue ? s.ValuationLastDayPY.Value.ToString("yyyyMMddTHH:mm:ss", myCultInfo) : new DateTime(System.DateTime.UtcNow.Year - 1, 12, 31).ToString("yyyyMMddTHH:mm:ss", myCultInfo)))
            .ForMember(x => x.VL, o => o.MapFrom(s => s.NETvalueLastDayPY.HasValue ? s.NETvalueLastDayPY.Value.ToString(myCultInfo) : "0"))
            .ForMember(x => x.Profitability, o => o.MapFrom(s => s.LastDayPYProfitability.HasValue ? Decimal.Round(s.LastDayPYProfitability.Value * 100, 2).ToString(myCultInfo) : "0"));

            CreateMap<ProductDailyYtdProfitability, LiquidityValuesByDateResponse>()
            .ForMember(x => x.Code, o => o.MapFrom(s => s.NETValueYTD)) // iProduct.MoProductId
            .ForMember(x => x.RDCode, o => o.MapFrom(s => s.ProductId))
            .ForMember(x => x.Name, o => o.MapFrom(s => s.ProductShortDesc)) // iProduct.Name
            .ForMember(x => x.VL, o => o.MapFrom(s => Decimal.Round(s.NETValue, 2).ToString(myCultInfo)))
            .ForMember(x => x.VD, o => o.MapFrom(s => Decimal.Round(s.DailyProfitability * 100, 2).ToString(myCultInfo)))
            .ForMember(x => x.VA, o => o.MapFrom(s =>  s.LastDayPYProfitability.HasValue ? Decimal.Round(s.LastDayPYProfitability.Value * 100, 2).ToString(myCultInfo) : "0"))
            .ForMember(x => x.Date, o => o.MapFrom(s => s.ValuationDate.ToString("d", myCultInfo)))
            .ForMember(x => x.Patrimonio, o => o.MapFrom(s => string.Format(myCultInfo, "{0:N}", s.Assets)))
            .ForMember(x => x.FamiliaType, o => o.MapFrom(s => s.ProductType)) // iProduct.ProductType.Id
            .ForMember(x => x.FamiliaNombre, o => o.MapFrom(s => s.ProductDesc)) // iProduct.ProductType.Name
            .ForMember(x => x.FamiliaOrden, o => o.MapFrom(s => s.PreviousNETValue)) // iProduct.ProductType.OrderToShow
            .ForMember(x => x.ProductOrder, o => o.MapFrom(s => s.ProductTypeCode)); // iProduct.OrderToShow
        }
    }


    /// <summary>
    /// Decimal to string Extensions
    /// </summary>
    public static class StringExtensions
    {
        /// <summary>
        /// Profitability pertentage
        /// </summary>
        /// <param name="profitability"></param>
        /// <returns></returns>
        public static string MultiplyProfitability(this decimal profitability)
        {
            CultureInfo myCultInfo = new CultureInfo("es-ES");
            return (profitability * 100).ToString("0.##", myCultInfo);
        }
    }
}