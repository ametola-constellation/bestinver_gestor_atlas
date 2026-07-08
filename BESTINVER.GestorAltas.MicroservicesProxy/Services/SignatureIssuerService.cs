using BestInver.WebPrivada.Shared.Models.DocumentSign.SignatureIssuer;
using System.Threading.Tasks;
using System;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class SignatureIssuerService : ISignatureIssuerService
    {
        private readonly IApiWebPrivadaHelper api;
#pragma warning disable S1075 // URIs should not be hardcoded
        private const string baseAddress = "/api/signatureIssuer";
#pragma warning restore S1075 // URIs should not be hardcoded
        public SignatureIssuerService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }
        public async Task<string> GetSignatureStatus(Guid idSignature)
        {
            return await api.GetWebAPI<string>($"{baseAddress}/{idSignature}/status").ConfigureAwait(false);
        }
        public async Task<string> ValidateOTP(OtpCodeValidationRequest otpCodeValidationRequest)
        {
            return await api.PostWebAPI<string, OtpCodeValidationRequest>($"{baseAddress}/validateOTP", otpCodeValidationRequest).ConfigureAwait(false);
        }
        public async Task<int?> ResendOTP(Guid idSignature)
        {
            return await api.PostWebAPI<int?>($"{baseAddress}/{idSignature}/resendOTP", null).ConfigureAwait(false);
        }
    }
}
