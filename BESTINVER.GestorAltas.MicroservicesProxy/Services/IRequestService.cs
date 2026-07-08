using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.MicroservicesProxy.Services
{
    using BestInver.WebPrivada.Shared.Models.Microservices.Alerts;
    using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
    using BESTINVER.GestorAltas.MicroservicesProxy.Models;

    public interface IRequestService
    {
        Task<Request> GetRequest(Guid id);

        Task<IEnumerable<RequestApplicant>> GetRequestApplicants(Guid id);

        Task<IEnumerable<RequestStatus>> GetStatuses(Guid id);

        Task<bool> Lock(Guid id, string lockedUserName);

        Task<bool> Unlock(Guid id, UnlockModel unlockModel);

        Task<IEnumerable<RequestStatus>> Add(IEnumerable<RequestStatus> requestStatuses);

        Task<Request> ChangeRequestStatus(Alert alert);

        Task<bool> CreateOrUpdateStatus(RequestStatus requestStatus);

        Task<bool> SolveOperationAlert(Guid id, bool accepted);

        Task<IEnumerable<Request>> GetRequestCollection(RequestSearch search);

        Task<RequestProductOperation> GetRequestOperation(int id);

        Task<IEnumerable<RequestOperationType>> GetRequestOperationTypes();

        Task<Request> ChangeRequestStatus(ChangeRequestStatusModel model, string responsible = "Sistema");

        Task<string> InsertApplicantRole(RequestApplicant applicant, Guid requestID);

        Task<string> UpdateApplicantRole(RequestApplicant applicant, Guid requestID);

        Task<Request> UpdateRequest(Request request);

        Task<RequestProductOperation> InsertRequestOperation(RequestProductOperation operation, Guid requestID);

        Task<IEnumerable<RequestStatusType>> GetRequestStatusTypes();

        Task<RequestOperation> UpdateOperation(RequestOperation operation, Guid requestId);

        Task<string> CloneRequest(Guid requestId);

        Task<IEnumerable<RequestApplicant>> GetRequestApplicantsPendingSignature(Guid id);

        Task<IEnumerable<RequestDocuments>> GetRequestDocuments(Guid requestId, string dni);

        Task<RequestDocuments> UpdateRequestDocument(RequestDocuments requestDocuments);

        Task<IEnumerable<RequestDocuments>> InsertRequestDocument(IEnumerable<RequestDocuments> requestDocuments);

        Task<bool> SetApplicantSignDate(string[] dni, Guid requestId);

        Task<bool> ValidateUniqueMobile(Guid requestId);

        Task<bool> ValidateSameMobile(Guid requestId);
    }
}