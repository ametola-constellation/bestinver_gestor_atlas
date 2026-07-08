using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Carteras;
using BESTINVER.Wordpress.WS.Models;
using System;
using System.Globalization;

namespace BESTINVER.Wordpress.WS.Profiles
{
    /// <summary>
    /// Profile for Carteras
    /// </summary>
    public class CarterasPositionProfile : Profile
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public CarterasPositionProfile() : base(nameof(CarterasPositionProfile))
        {
            CultureInfo myCultInfo = new CultureInfo("es-ES");

            CreateMap<InstrumentPosition, InstrumentPositionModel>()
                .ForMember(x => x.Item1, o => o.MapFrom(s => s.NombreInstrumento))
                .ForMember(x => x.Item2, o => o.MapFrom(s => Decimal.Round(Convert.ToDecimal(s.Diversificacion, myCultInfo), 2).ToString()));

            CreateMap<CarteraPositionBySector, CarteraPositionBySectorModel>()
                .ForMember(x => x.SectorName, o => o.MapFrom(s => s.CarteraName))
                .ForMember(x => x.InstrumentPositionList, o => o.MapFrom(s => s.InstrumentPositions));


        }
    }
}