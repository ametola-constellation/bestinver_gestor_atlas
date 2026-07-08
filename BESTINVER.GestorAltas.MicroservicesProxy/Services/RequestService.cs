using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
    using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
    using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
    using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
    using BESTINVER.GestorAltas.MicroservicesProxy.Models;
    using BESTINVER.GestorAltas.MicroservicesProxy.States.Requests;
    using System.Linq;

    public class RequestService : IRequestService
    {
        private const string requestBaseAddress = "/api/requests";
        private readonly IApiWebPrivadaHelper api;
        private readonly IRequestStateFactory requestStateFactory;

        public RequestService(IApiWebPrivadaHelper apiWebPrivadaHelper,
            IRequestStateFactory requestStateFactory
            )
        {
            api = apiWebPrivadaHelper;
            this.requestStateFactory = requestStateFactory;
        }

        public Task<IEnumerable<RequestStatus>> GetStatuses(Guid id)
            => api.GetWebAPI<IEnumerable<RequestStatus>>($"{requestBaseAddress}/{id}/statuses");

        public Task<Request> GetRequest(Guid id)
            => api.GetWebAPI<Request>($"{requestBaseAddress}/{id}");

        public Task<IEnumerable<RequestApplicant>> GetRequestApplicants(Guid id)
            => api.GetWebAPI<IEnumerable<RequestApplicant>>($"{requestBaseAddress}/{id}/applicants");

        public Task<bool> Lock(Guid id, string lockedUserName)
            => api.PostWebAPI<bool, object>($"{requestBaseAddress}/{id}/lock", lockedUserName);

        public Task<bool> Unlock(Guid id, UnlockModel unlockModel)
           => api.PostWebAPI<bool, UnlockModel>($"{requestBaseAddress}/{id}/unlock", unlockModel);

        public Task<Request> ChangeRequestStatus(Alert alert)
        {
            var model = new ChangeRequestStatusModel
            {
                RequestId = alert.RequestId ?? Guid.Empty,
                Responsible = string.Empty,
                Comments = alert.Comments
            };
            return ChangeRequestStatus(model, alert.Responsible);
        }

        public async Task<Request> ChangeRequestStatus(ChangeRequestStatusModel model, string responsible = "Sistema")
        {
            if (model.RequestId != Guid.Empty)
            {
                var request = GetRequest(model.RequestId).GetAwaiter().GetResult();
                var requestState = requestStateFactory.Create(request);
                var insertRequestStatuses = new List<RequestStatus>();
                if (!requestState.Data.Status.Any())
                {
                    insertRequestStatuses.Add(new RequestStatus
                    {
                        IdStatus = (int)RequestStatusEnum.Prospect,
                        IdRequest = model.RequestId,
                        Responsible = "Iniciada por Sistema",
                        Comments = responsible,
                        StartDate = DateTime.UtcNow
                    });
                }

                if (requestState.DesiredState is RequestRegisterState && request.Alerts.Any(x => (int?)x.Status.Value == (int)AlertStatus.Denied))
                {
                    insertRequestStatuses.Add(new RequestStatus
                    {
                        IdStatus = (int)RequestStatusEnum.Canceled,
                        IdRequest = model.RequestId,
                        Responsible = responsible,
                        Comments = model.Comments,
                        StartDate = DateTime.UtcNow
                    });
                }
                else if (requestState.DesiredState is RequestLockedState)
                {
                    requestState.DesiredState = requestState.Undo();
                    if (requestState.Next())
                    {
                        insertRequestStatuses.Add(new RequestStatus
                        {
                            IdStatus = requestState.DesiredState,
                            IdRequest = model.RequestId,
                            Responsible = "Desbloqueada por Sistema",
                            Comments = responsible,
                            StartDate = DateTime.UtcNow
                        });
                    }
                    else
                    {
                        requestState.DesiredState = requestState.Redo();
                    }
                }
                else if (requestState.Next())
                {
                    insertRequestStatuses.Add(new RequestStatus
                    {
                        IdStatus = requestState.DesiredState,
                        IdRequest = model.RequestId,
                        Responsible = responsible,
                        Comments = model.Comments,
                        StartDate = DateTime.UtcNow
                    });
                }

                await requestState.SaveChanges(this, insertRequestStatuses).ConfigureAwait(false);
                return requestState.Data;
            }
            return null;
        }

        public Task<RequestStatus> GetNextStatus(Guid requestId)
           => api.GetWebAPI<RequestStatus>($"{requestBaseAddress}/{requestId}/statuses/next");

        public async Task<IEnumerable<RequestStatus>> Add(IEnumerable<RequestStatus> requestStatuses)
        {
            if(requestStatuses.Any())
            {
                return await api.PostWebAPI($"{requestBaseAddress}/add/statuses", requestStatuses);
            }
            return await Task.FromResult(requestStatuses);
        }
            

        public async Task<bool> CreateOrUpdateStatus(RequestStatus requestStatus)
        {
            var request = await GetRequest(requestStatus.IdRequest.Value).ConfigureAwait(false);

            if (request.Status.OrderByDescending(r => r.StartDate).FirstOrDefault()?.StatusType.Id == requestStatus.IdStatus)
            {
                return await UpdateRequestStatus(requestStatus).ConfigureAwait(false) != null;
            }
            requestStatus.Id = null;
            requestStatus.StartDate = DateTime.UtcNow;

            var statuslist = new List<RequestStatus>
                {
                    requestStatus
                };
            return (await Add(statuslist).ConfigureAwait(false)).Any();
        }

        public Task<RequestStatus> UpdateRequestStatus(RequestStatus requestStatus)
        {
            return api.PutWebAPI($"{requestBaseAddress}/put/status", requestStatus);
        }

        public async Task<bool> SolveOperationAlert(Guid id, bool accepted)
        {
            var status = new RequestStatus
            {
                IdRequest = id,
                Comments = "Desbloqueada alerta blanqueo de capitales",
                IdStatus = accepted ? (int)RequestStatusEnum.Pending : (int)RequestStatusEnum.Rejected,
                StartDate = DateTime.UtcNow,
                Responsible = "sistema"
            };

            var statuslist = new List<RequestStatus>
            {
                status
            };

            return (await Add(statuslist).ConfigureAwait(false)).Any();
        }

        public Task<IEnumerable<Request>> GetRequestCollection(RequestSearch search)
            => api.PostWebAPI<IEnumerable<Request>, RequestSearch>($"{requestBaseAddress}/collection", search);

        public Task<RequestProductOperation> GetRequestOperation(int id)
        {
            return api.GetWebAPI<RequestProductOperation>($"{requestBaseAddress}/operation/{id}");
        }

        public Task<IEnumerable<RequestOperationType>> GetRequestOperationTypes()
        {
            return api.GetWebAPI<IEnumerable<RequestOperationType>>($"{requestBaseAddress}/operation/types");
        }

        public Task<string> InsertApplicantRole(RequestApplicant applicant, Guid requestID)
            => api.PostWebAPI<string, RequestApplicant>($"{requestBaseAddress}/{requestID}/applicantRole", applicant);

        public Task<string> UpdateApplicantRole(RequestApplicant applicant, Guid requestID)
            => api.PutWebAPI<string, RequestApplicant>($"{requestBaseAddress}/{requestID}/applicantRole", applicant);

        public Task<Request> UpdateRequest(Request request)
            => api.PutWebAPI(requestBaseAddress, request);

        public Task<RequestProductOperation> InsertRequestOperation(RequestProductOperation operation, Guid requestID)
            => api.PostWebAPI($"{requestBaseAddress}/{requestID}/productOperation", operation);

        public Task<IEnumerable<RequestStatusType>> GetRequestStatusTypes()
            => api.GetWebAPI<IEnumerable<RequestStatusType>>($"{requestBaseAddress}/requestStatus/types");

        public Task<RequestOperation> UpdateOperation(RequestOperation operation, Guid requestId)
            => api.PutWebAPI<RequestOperation>($"{requestBaseAddress}/{requestId}/operation", operation);

        public Task<string> CloneRequest(Guid requestId)
            => api.PostWebAPI<string>($"{requestBaseAddress}/{requestId}/clone", "");

        public Task<IEnumerable<RequestApplicant>> GetRequestApplicantsPendingSignature(Guid id)
             => api.GetWebAPI<IEnumerable<RequestApplicant>>($"{requestBaseAddress}/{id}/applicantshastosign");

        public Task<IEnumerable<RequestDocuments>> GetRequestDocuments(Guid requestId, string dni)
            => api.GetWebAPI<IEnumerable<RequestDocuments>>($"{requestBaseAddress}/{requestId}/requestDocuments/applicant/{dni}");

        public Task<RequestDocuments> UpdateRequestDocument(RequestDocuments requestDocuments)
            => api.PutWebAPI<RequestDocuments>($"{requestBaseAddress}/requestDocuments", requestDocuments);

        public Task<IEnumerable<RequestDocuments>> InsertRequestDocument(IEnumerable<RequestDocuments> requestDocuments)
            => api.PostWebAPI<IEnumerable<RequestDocuments>>($"{requestBaseAddress}/requestDocuments", requestDocuments);

        public async Task<bool> SetApplicantSignDate(string[] dni, Guid requestId)
        {
            bool result = true;
            try
            {
                await api.PutWebAPI<bool, string[]>($"{requestBaseAddress}/{requestId}/applicantSignDates", dni);
            }
            catch   
            {
                result = false;
            }
            return result;
        }

        public Task<bool> ValidateUniqueMobile(Guid requestId)
             => api.PostWebAPI<bool>($"{requestBaseAddress}/validateUniqueMobile/{requestId}", true);

        public Task<bool> ValidateSameMobile(Guid requestId)
             => api.PostWebAPI<bool>($"{requestBaseAddress}/validateSameMobile/{requestId}", true);
    }
}