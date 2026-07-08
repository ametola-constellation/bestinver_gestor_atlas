using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;


namespace BESTINVER.GestorAltas.Domain.Common
{
    public interface IApiHelperBase
    {
        Task<TResult> GetWebAPI<TResult>(string relativeUrl);

        Task<TResult> PostWebAPI<TResult, TModel>(string relativeUrl, TModel model);

        Task<TModel> PostWebAPI<TModel>(string relativeUrl, TModel model);

        Task<TModel> PutWebAPI<TModel>(string relativeUrl, TModel model);

        Task<TResult> PutWebAPI<TResult, TModel>(string relativeUrl, TModel model);

        Task<TModel> DeleteWebAPI<TModel>(string relativeUrl);

        Task<TResult> DeleteWebAPI<TResult, TModel>(string relativeUrl, TModel model);
        Task<byte[]> PostStreamAPI<TModel>(string relativeUrl, TModel model);
        Task<byte[]> GetStreamAPI(string relativeUrl);
        Task<FileContentResult> GetFileAPI(string relativeUrl);
        Task<TResult> PostWebAPIMultipart<TResult>(string relativeUrl, MultipartFormDataContent model);
    }
}