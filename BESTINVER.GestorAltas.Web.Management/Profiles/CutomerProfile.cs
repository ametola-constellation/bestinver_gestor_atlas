using AutoMapper;
using BestInver.WebPrivada.Shared.Models.Microservices.Customers;
using BESTINVER.GestorAltas.Web.Models;

namespace BESTINVER.GestorAltas.Web.Management.Profiles
{
    public class CutomerProfile : Profile

    {
        public CutomerProfile() : base(nameof(CutomerProfile))
        {
            CreateMap<Customer, CustomerModel>();
        }
    }
}