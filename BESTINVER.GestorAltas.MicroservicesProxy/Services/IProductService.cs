using BestInver.WebPrivada.Shared.Models.Microservices.Portfolios;
using BestInver.WebPrivada.Shared.Models.Microservices.Products;
using BestInver.WebPrivada.Shared.Models.Middleware.MiddleOffice;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetProduct();

        Task<Product> GetProduct(int productId);

        Task<ProductClass> GetProductClass(int productId, int classId);

        Task<IEnumerable<Product>> GetProduct(string productTypeId);

        Task<IEnumerable<ProductConfig>> GetProductConfig();

        Task<IEnumerable<ProductType>> GetProductTypes();

        Task<byte[]> GetProductAssetExcel(int productId, int? classId);

        Task<IEnumerable<ProductAssetValue>> GetProductMonthlyAssetValue(int productId, int years);

        Task<IEnumerable<ProfitabilityPeriod>> GetProductProfitabilityByPeriod(int productId, string period, int? numMonths = 12, int? numYears = 10, bool fromBeginning = true, bool showLikeMOChartOrder = false, bool showCurrentYear = false, int? classId = null);

        Task<IEnumerable<ProductDailyYtdProfitability>> GetProfitabilityDailyYtd();

        Task<IEnumerable<ProductConfigFoundType>> GetProductConfigFoundType();

        Task<string> GetProductOperationClass(int productId, decimal? amount, bool? isEmployee);
    }
}