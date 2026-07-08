using BestInver.Core.Models.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy
{
    public abstract class ApiHelperBase : Domain.Common.IApiHelperBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _baseAddress;

        public ApiHelperBase(
            IHttpClientFactory httpClientFactory,
            IHttpContextAccessor httpContextAccessor,
            string baseAddress)
        {
            _httpClientFactory = httpClientFactory;
            _httpContextAccessor = httpContextAccessor;
            _baseAddress = baseAddress;
        }

        protected string apiPrefix;

        private HttpClient _client;

        private HttpClient client
        {
            get
            {
                if (_client == null)
                {
                    _client = _httpClientFactory.CreateClient(HttpClientsNames.HttpClientMicroservice);
                    _client.BaseAddress = new Uri(_baseAddress);
                    if (!string.IsNullOrEmpty(_httpContextAccessor.HttpContext?.User?.Identity?.Name))
                    {
                        var username = _httpContextAccessor.HttpContext.User.Identity.Name;
                        if (!client.DefaultRequestHeaders.Any(a => a.Key == "x-user-name"))
                        {
                            client.DefaultRequestHeaders.Add("x-user-name", username);
                        }
                    }
                }
                return _client;
            }
        }

        public virtual async Task<TResult> PostWebAPI<TResult, TModel>(string relativeUrl, TModel model)
        {
            var json = GetJsonString(model);
            var httpContent = GetJsonContent(json);
            var resultContent = (await client.PostAsync(relativeUrl, httpContent).ConfigureAwait(false));

            return await DeserializeContent<TResult>(resultContent, relativeUrl).ConfigureAwait(false);
        }

        public Task<TModel> PostWebAPI<TModel>(string relativeUrl, TModel model)
            => PostWebAPI<TModel, TModel>(relativeUrl, model);

        public async Task<TResult> PostWebAPIMultipart<TResult>(string relativeUrl, MultipartFormDataContent model)
        {
            var resultContent = await client.PostAsync(relativeUrl, model).ConfigureAwait(false);

            return await DeserializeContent<TResult>(resultContent, relativeUrl).ConfigureAwait(false);
        }

        private static StringContent GetJsonContent(string json)
        {
            return new StringContent(json, Encoding.UTF8, "application/json");
        }

        public virtual async Task<TResult> GetWebAPI<TResult>(string relativeUrl)
        {
            var resultContent = (await client.GetAsync(relativeUrl).ConfigureAwait(false));

            return await DeserializeContent<TResult>(resultContent, relativeUrl).ConfigureAwait(false);
        }

        private async Task<TResult> DeserializeContent<TResult>(HttpResponseMessage resultContent, string relativeUrl)
        {
            if (resultContent.StatusCode == System.Net.HttpStatusCode.OK || resultContent.StatusCode == System.Net.HttpStatusCode.Created || resultContent.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                using (Stream s = await resultContent.Content.ReadAsStreamAsync().ConfigureAwait(false))
                using (StreamReader sr = new StreamReader(s, bufferSize: 65536))
                using (JsonReader reader = new JsonTextReader(sr))
                {
                    JsonSerializer serializer = new JsonSerializer();

                    // read the json from a stream
                    // json size doesn't matter because only a small piece is read at a time from the HTTP request
                    return serializer.Deserialize<TResult>(reader);
                }
            }
            Uri.TryCreate(client.BaseAddress, relativeUrl, out Uri requestUrl);
            throw new ApiException($"Se ha producido un error al procesar la solicitud. StatusCode: {resultContent.StatusCode} Request URL: {requestUrl}");
        }

        public Task<TModel> PutWebAPI<TModel>(string relativeUrl, TModel model)
         => PutWebAPI<TModel, TModel>(relativeUrl, model);

        public virtual async Task<TResult> PutWebAPI<TResult, TModel>(string relativeUrl, TModel model)
        {
            var json = GetJsonString(model);
            var httpContent = GetJsonContent(json);
            var resultContent = (await client.PutAsync(relativeUrl, httpContent).ConfigureAwait(false));

            return await DeserializeContent<TResult>(resultContent, relativeUrl).ConfigureAwait(false);
        }

        public async Task<byte[]> GetStreamAPI(string relativeUrl)
        {
            var resultContent = (await client.GetAsync(relativeUrl).ConfigureAwait(false));

            if (resultContent.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var content = await resultContent.Content.ReadAsByteArrayAsync().ConfigureAwait(false);
                return content;
            }
            Uri.TryCreate(client.BaseAddress, relativeUrl, out Uri requestUrl);
            throw new ApiException($"Se ha producido un error al procesar la solicitud. StatusCode: {resultContent.StatusCode} Request URL: {requestUrl}");
        }

        public async Task<FileContentResult> GetFileAPI(string relativeUrl)
        {
            var resultContent = (await client.GetAsync(relativeUrl).ConfigureAwait(false));

            if (resultContent.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return GetFileContentResultFormContent(resultContent.Content);
            }

            if (resultContent.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }

            Uri.TryCreate(client.BaseAddress, relativeUrl, out Uri requestUrl);
            throw new ApiException($"Se ha producido un error al procesar la solicitud. StatusCode: {resultContent.StatusCode} Request URL: {requestUrl}");
        }

        private static FileContentResult GetFileContentResultFormContent(HttpContent content)
        {
            var fileBytes = content.ReadAsByteArrayAsync().Result;

            var fileName = "download.pdf";
            if (content.Headers.ContentDisposition != null &&
                !string.IsNullOrWhiteSpace(content.Headers.ContentDisposition.FileName))
            {
                fileName = content.Headers.ContentDisposition.FileName;
            }

            var contentType = MediaTypeNames.Application.Pdf;
            if (content.Headers.ContentType != null &&
                !string.IsNullOrWhiteSpace(content.Headers.ContentType.MediaType))
            {
                contentType = content.Headers.ContentType.MediaType;
            }

            var response = new FileContentResult(fileBytes, contentType)
            {
                FileDownloadName = fileName
            };

            return response;
        }

        private static string GetJsonString<TModel>(TModel model)
        {
            return JsonConvert.SerializeObject(model,
                           new JsonSerializerSettings
                           {
                               ContractResolver = new NonPublicPropertiesResolver(),
                               DateTimeZoneHandling = DateTimeZoneHandling.Utc
                           });
        }

        public async Task<TModel> DeleteWebAPI<TModel>(string relativeUrl)
        {
            var resultContent = (await client.DeleteAsync(relativeUrl).ConfigureAwait(false));

            return await DeserializeContent<TModel>(resultContent, relativeUrl).ConfigureAwait(false);
        }

        public virtual async Task<TResult> DeleteWebAPI<TResult, TModel>(string relativeUrl, TModel model)
        {
            var json = GetJsonString(model);
            var httpContent = GetJsonContent(json);
            var url = client.BaseAddress.AbsoluteUri + relativeUrl;

            HttpRequestMessage request = new HttpRequestMessage
            {
                Content = httpContent,
                Method = HttpMethod.Delete,
                RequestUri = new Uri(url)
            };

            var result = await client.SendAsync(request).ConfigureAwait(false);

            return await DeserializeContent<TResult>(result, relativeUrl).ConfigureAwait(false);
        }


        public async Task<byte[]> PostStreamAPI<TModel>(string relativeUrl, TModel model)
        {
            var json = GetJsonString(model);
            var httpContent = GetJsonContent(json);
            var resultContent = (await client.PostAsync(relativeUrl, httpContent).ConfigureAwait(false));

            if (resultContent.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var content = await resultContent.Content.ReadAsByteArrayAsync().ConfigureAwait(false);
                return content;
            }
            Uri.TryCreate(client.BaseAddress, relativeUrl, out Uri requestUrl);
            throw new ApiException($"Se ha producido un error al procesar la solicitud. StatusCode: {resultContent.StatusCode} Request URL: {requestUrl}");
        }
    }
}

