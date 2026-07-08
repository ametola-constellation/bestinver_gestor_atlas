using BestInver.WebPrivada.Shared.Models.Middleware.MiddleOffice;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface ICrudService<TModel>
    {
        Task<TModel> Create(TModel cartera);

        Task<IEnumerable<TModel>> Create(IEnumerable<TModel> cartera);

        Task<IEnumerable<TModel>> Read();

        Task<TModel> Update(TModel cartera);

        Task<TModel> Delete(int id);
    }
}