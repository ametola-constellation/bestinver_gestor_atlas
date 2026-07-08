using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Documents;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Forms;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using BESTINVER.GestorAltas.MicroservicesProxy.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    public interface ISignUpService
    {
        Task<DataList> GetMasterdata();

        Task<Request> InsertRequest(RequestData request);

        Task<RequestData> CheckConveniencia(Guid requestID);

        Task<ConfirmaResponse> CheckConfirma(SignUpApplicant request);

        Task<IEnumerable<DataItem>> GetOperationTypes(int productType, int applicantType);

        Task<ResultSendParticipeToRDModel> SendToRD(Guid requestID, Dictionary<int, DateTime> operationDate);

        Task UploadDocumentToDocuware(AltasSftp model);

        Task<ResultSendParticipeToRDModel> SendApplicantsToRD(Guid requestID);

        Task<ResultSendParticipeToRDModel> SendOperationsToRD(Guid requestID, string accountID, Dictionary<int, DateTime> operationDate);
		Task<ResultSendParticipeToRDModel> SendToRDWithCompromise(Guid requestID, CompromiseParameter compromise);
        Task<ResultSendParticipeToRDModel> SendToRDSubscriptionWithCompromise(Guid requestID, CompromiseParameter compromise);
    }
}