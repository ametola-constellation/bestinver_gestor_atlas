using BESTINVER.GestorAltas.MicroservicesProxy.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using BestInver.WebPrivada.Shared.Models.DocumentSign.SignatureIssuer;
using BESTINVER.GestorAltas.Utilities.Extensions;

namespace BESTINVER.GestorAltas.Web.Public.Controllers
{
    [Consumes("application/json")]
    [Produces("application/json")]
    [Route("[controller]")]
    public class SignatureIssuerController : Controller
    {
        private readonly ISignatureIssuerService signatureIssuerService;

        public SignatureIssuerController(ISignatureIssuerService signatureIssuerService)

        {
            this.signatureIssuerService = signatureIssuerService;
        }


        /// <summary>
        /// Gets the signature's status
        /// </summary>
        /// <param name="idSignature">The signature's id</param> 
        /// <returns>The signature's status</returns>
        [HttpGet("{idSignature}/status")]
        public async Task<IActionResult> GetSignatureStatus([FromRoute] Guid idSignature)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string status = await signatureIssuerService.GetSignatureStatus(idSignature);
            if (!string.IsNullOrEmpty(status))
            {
                return Ok(status);
            }
            else
            {
                return NotFound();
            }
        }

        /// <summary>
        /// Validates the OTP 
        /// </summary>
        /// <param name="otpCodeValidationRequestBase">The otp code validation request base</param>
        /// <returns>Correct, Incorrect or MaxFailedAttemps</returns>
        [HttpPost("validateOTP")]
        public async Task<IActionResult> ValidateOTP([FromBody] OtpCodeValidationRequestBase otpCodeValidationRequestBase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            OtpCodeValidationRequest otpCodeValidationRequest = new()
            {
                IdSignature = otpCodeValidationRequestBase.IdSignature,
                Otp = otpCodeValidationRequestBase.Otp,
                TelemetryInformation = new()
                {
                    IP = HttpContext.Request.GetClientIP(),
                    UserAgent = HttpContext.Request.Headers["User-Agent"].ToString(),
                    // TODO: What name to put
                    AppName = "Altas"
                }
            };

            return Ok(await signatureIssuerService.ValidateOTP(otpCodeValidationRequest));
        }

        /// <summary>
        /// Resends the OTP
        /// </summary>
        /// <param name="idSignature">The signature's id</param> 
        /// <returns>The OTP if the SandboxPhone option is enabled and the signer's phone is SandboxPhone, null otherwise</returns>
        [HttpPost("{idSignature}/resendOTP")]
        public async Task<IActionResult> ResendOTP([FromRoute] Guid idSignature)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(await signatureIssuerService.ResendOTP(idSignature));
        }

    }
}
