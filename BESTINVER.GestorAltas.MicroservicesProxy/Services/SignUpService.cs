using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Documents;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Forms;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BestInver.WebPrivada.Shared.Models.Services.Signatures.Request;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public class SignUpService : ISignUpService
    {
        private readonly IApiWebPrivadaHelper api;
        private const string baseAddress = "/api/signup";

        public SignUpService(IApiWebPrivadaHelper apiWebPrivadaHelper)
        {
            api = apiWebPrivadaHelper;
        }

        public Task<DataList> GetMasterdata()
            => api.GetWebAPI<DataList>($"{baseAddress}/masterdata");

        public Task<Request> InsertRequest(RequestData request)
             => api.PostWebAPI<Request, RequestData>($"{baseAddress}/request", request);

        public Task<RequestData> CheckConveniencia(Guid requestID)
            => api.PostWebAPI<RequestData>($"{baseAddress}/{requestID.ToString()}/convenience", null);

        public async Task<ConfirmaResponse> CheckConfirma(SignUpApplicant request)
        {
            try
            {
                if (request.BasicData.ApplicantType == (int)PersonTypeEnum.Juridica)
                {
                    return new ConfirmaResponse();
                }
                return await api.PostWebAPI<ConfirmaResponse, SignUpApplicant>($"{baseAddress}/confirma", request);
            }
            catch
            {
                return new ConfirmaResponse
                {
                    ConnectionError = true
                };
            }
        }


        public Task<IEnumerable<DataItem>> GetOperationTypes(int productType, int applicantType)
            => api.GetWebAPI<IEnumerable<DataItem>>($"{baseAddress}/operationtype/{productType}/{applicantType}");

        public Task<ResultSendParticipeToRDModel> SendToRD(Guid requestID, Dictionary<int, DateTime> operationDate)
            => api.PostWebAPI<ResultSendParticipeToRDModel, Dictionary<string, DateTime>>($"{baseAddress}/sendtord/{requestID}", operationDate.ToDictionary(x => x.Key.ToString(), x => x.Value));
        public Task<ResultSendParticipeToRDModel> SendToRDWithCompromise(Guid requestID, CompromiseParameter compromise)
           => api.PostWebAPI<ResultSendParticipeToRDModel, CompromiseParameter>($"{baseAddress}/sendtordwithcompromise/{requestID}", compromise);
        
        public Task<ResultSendParticipeToRDModel> SendToRDSubscriptionWithCompromise(Guid requestID, CompromiseParameter compromise)
           => api.PostWebAPI<ResultSendParticipeToRDModel, CompromiseParameter>($"{baseAddress}/sendtordsubscriptionwithcompromise/{requestID}", compromise);

        public Task UploadDocumentToDocuware(AltasSftp model)
            => api.PostWebAPI<AltasSftp>($"{baseAddress}/request/{model.RequestId}/additionaldocuments", model);

        public Task<ResultSendParticipeToRDModel> SendApplicantsToRD(Guid requestID)
            => api.PostWebAPI<ResultSendParticipeToRDModel>($"{baseAddress}/sendtord/applicants/{requestID}", null);

        public Task<ResultSendParticipeToRDModel> SendOperationsToRD(Guid requestID, string accountID, Dictionary<int, DateTime> operationDate)
             => api.PostWebAPI<ResultSendParticipeToRDModel, Dictionary<string, DateTime>>($"{baseAddress}/sendtord/operations/{requestID}/{accountID}", operationDate.ToDictionary(x => x.Key.ToString(), x => x.Value));
    }
}