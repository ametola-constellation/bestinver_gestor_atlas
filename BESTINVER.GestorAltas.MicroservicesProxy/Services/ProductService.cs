using BestInver.WebPrivada.Shared.Models.Microservices.Portfolios;
using BestInver.WebPrivada.Shared.Models.Microservices.Products;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Middleware.MiddleOffice;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using BESTINVER.GestorAltas.Web.Models.Requests;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class ProductService : IProductService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string productsBaseAddress = "/api/products";

        public ProductService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task<IEnumerable<ProductType>> GetProductTypes()
            => api.GetWebAPI<IEnumerable<ProductType>>($"{productsBaseAddress}/type");

        public async Task<Product> GetProduct(int productId)
        {
            var products = await api.GetWebAPI<IEnumerable<Product>>($"{productsBaseAddress}/mo");
            return products.FirstOrDefault(p => p.MoProductId == productId);
        }

        public Task<IEnumerable<Product>> GetProduct()
            => api.GetWebAPI<IEnumerable<Product>>($"{productsBaseAddress}/mo");

        public async Task<ProductClass> GetProductClass(int productId, int classId)
        {
            var products = await api.GetWebAPI<IEnumerable<ProductClass>>($"{productsBaseAddress}/productclasses/{productId}");
            return products.FirstOrDefault(p => p.ClassId == classId);
        }

        public Task<IEnumerable<ProductConfig>> GetProductConfig()
            => api.GetWebAPI<IEnumerable<ProductConfig>>($"{productsBaseAddress}/config");

        public Task<IEnumerable<Product>> GetProduct(string productTypeId)
            => api.GetWebAPI<IEnumerable<Product>>($"{productsBaseAddress}/type/{productTypeId}");

        public Task<byte[]> GetProductAssetExcel(int productId, int? classId)
            => api.GetStreamAPI($"{productsBaseAddress}/{productId}/assetValueFile/{classId}");

        public Task<IEnumerable<ProductAssetValue>> GetProductMonthlyAssetValue(int productId, int years)
            => api.GetWebAPI<IEnumerable<ProductAssetValue>>($"{productsBaseAddress}/monthlyAssetValue/{productId}");

        public Task<IEnumerable<ProfitabilityPeriod>> GetProductProfitabilityByPeriod(int productId, string period, int? numMonths = 12, int? numYears = 10, bool fromBeginning = false, bool showLikeMOChartOrder = false, bool showCurrentYear = false, int? classId = null)
            => api.GetWebAPI<IEnumerable<ProfitabilityPeriod>>($"{productsBaseAddress}/profitability/{productId}/{period}?numMonths={numMonths}&numYears={numYears}&fromBeginning={fromBeginning}&showLikeMOChartOrder={showLikeMOChartOrder}&showCurrentYear={showCurrentYear}&classId={classId}");

        public Task<IEnumerable<ProductDailyYtdProfitability>> GetProfitabilityDailyYtd()
            => api.GetWebAPI<IEnumerable<ProductDailyYtdProfitability>>($"{productsBaseAddress}/profitabilityDailyYtd");

        public Task<IEnumerable<ProductConfigFoundType>> GetProductConfigFoundType()
            => api.GetWebAPI<IEnumerable<ProductConfigFoundType>>($"{productsBaseAddress}/configFoundType");

        public async Task<string> GetProductOperationClass(int productId, decimal? amount, bool? isEmployee)
        {
            var operationClass = string.Empty;
            if (amount.HasValue && (productId == (int)ProductNames.BESTINVER_INFRA || productId == (int)ProductNames.BESTINVER_PRIVATE_EQUITY 
                || productId == (int)ProductNames.BESTINVER_INFRA_II ))
            {              
                var classes = await GetProductConfigFoundType().ConfigureAwait(false);

                switch (productId)
                {
                    case (int)ProductNames.BESTINVER_INFRA:
                        operationClass = classes.Where(cl => cl.ClassName != "A2" && cl.ProductId == (int)ProductNames.BESTINVER_INFRA).FirstOrDefault(c => amount >= c.MinInvestment && amount < c.MaxInvestment)?.ClassName;
                        if (isEmployee.HasValue && isEmployee.Value && amount < 5000000)
                        {
                            operationClass = "A2";
                        }
                        else if (amount >= 30000000 && string.IsNullOrEmpty(operationClass))
                        {
                            operationClass = "B";
                        }
                        break;
                    case (int)ProductNames.BESTINVER_PRIVATE_EQUITY:
                        operationClass = classes.Where(cl => cl.ProductId == (int)ProductNames.BESTINVER_PRIVATE_EQUITY).FirstOrDefault(c => amount >= c.MinInvestment && amount < c.MaxInvestment)?.ClassName;
                        if (amount >= 20000000 && string.IsNullOrEmpty(operationClass))
                        {
                            operationClass = "D";
                        }
                        break;
                    case (int)ProductNames.BESTINVER_INFRA_II:
                        operationClass = classes.Where(cl => cl.ProductId == (int)ProductNames.BESTINVER_INFRA_II).FirstOrDefault(c => amount >= c.MinInvestment && amount < c.MaxInvestment)?.ClassName;
                        if (amount >= 30000000 && string.IsNullOrEmpty(operationClass))
                        {
                            operationClass = "B";
                        }
                        break;
                    default:
                        operationClass = null;
                        break;
                }
            }
            else
            {
                operationClass = null;
            }

            return operationClass;
        }
    }
}