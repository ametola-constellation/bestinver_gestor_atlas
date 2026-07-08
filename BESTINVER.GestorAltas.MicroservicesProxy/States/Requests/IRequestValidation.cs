using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.MicroservicesProxy.States.Requests
{
    public interface IRequestValidation
    {
        IEnumerable<RequestStatus> Status { get; set; }

        bool HasActivePBCOrTerrorAlert();

        bool HasAllDocumentsUploaded();

        bool HasMadeTheMoneyTransfer();

        bool HasOnlineSignature();

        bool IsAbandoned();

        bool IsCanceled();

        bool IsExpired();

        bool IsPhysical();
    }
}