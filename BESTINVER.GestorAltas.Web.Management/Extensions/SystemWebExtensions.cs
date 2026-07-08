using Microsoft.AspNetCore.Http;

namespace System.Web
{
    public static class HttpContext
    {
        static HttpContext()
        { }

        private static Microsoft.AspNetCore.Http.IHttpContextAccessor m_httpContextAccessor;

        public static void Configure(Microsoft.AspNetCore.Http.IHttpContextAccessor httpContextAccessor)
        {
            m_httpContextAccessor = httpContextAccessor;
        }

        public static Microsoft.AspNetCore.Http.HttpContext Current
        {
            get
            {
                return m_httpContextAccessor.HttpContext;
            }
        }

        /// <summary>
        /// Retrieves the IP of client
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public static string GetClientIP(this HttpRequest request)
        {
            try
            {
                const string X_Forwarded_For = "X-Forwarded-For";
                const string X_Original_For = "X-Original-For";

                if (!string.IsNullOrWhiteSpace(request.Headers[X_Forwarded_For]))
                {
                    return request.Headers[X_Forwarded_For].ToString().Split(',')[0];
                }
                if (!string.IsNullOrWhiteSpace(request.Headers[X_Original_For]))
                {
                    return request.Headers[X_Original_For].ToString().Split(',')[0];
                }
                return request.HttpContext?.Connection?.RemoteIpAddress?.ToString();
            }
            catch
            {
                return string.Empty;
            }
        }
    } // End Class HttpContext
}