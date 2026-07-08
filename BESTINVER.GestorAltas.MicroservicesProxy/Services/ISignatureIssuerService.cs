using BestInver.WebPrivada.Shared.Models.DocumentSign.SignatureIssuer;
using System.Threading.Tasks;
using System;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface ISignatureIssuerService
    {
        Task<string> GetSignatureStatus(Guid idSignature);
        Task<string> ValidateOTP(OtpCodeValidationRequest otpCodeValidationRequest);
        Task<int?> ResendOTP(Guid idSignature);
    }
}
