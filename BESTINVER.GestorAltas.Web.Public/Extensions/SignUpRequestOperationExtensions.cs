using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.SignUp.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Extensions
{
    public static class SignUpRequestOperationExtensions
    {
        public static RequestOperationType GetOperationType(this SignUpRequestOperation operation)
        {
            return new RequestOperationType
            {
                Id = operation.IdOperationType
            };
        }

        public static RequestTransfer GetTransfer(this SignUpRequestOperation operation)
        {
            return new RequestTransfer
            {
                After2007 = operation.After2007,
                FondoCode = operation.FondoCode,
                Before2007 = operation.Before2007,
                FondoISIN = operation.FondoISIN,
                FondoName = operation.FondoName,
                FondoType = operation.FondoType,
                ManagerCode = operation.ManagerCode,
                ManagerName = operation.ManagerName,
                ParticipantAccount = operation.ParticipantAccount,
                PlanCode = operation.PlanCode,
                PlanName = operation.PlanName,
                TransferType = new RequestTransferType
                {
                    Id = (int)operation.IdTransferType
                }
            };
        }

        public static WayToPay GetWayToPay(this SignUpRequestOperation operation)
        {
            return new WayToPay
            {
                Id = operation.IdWayToPay.Value
            };
        }
    }

    public static class SignUpRequestProductOperationExtensions
    {
        public static RequestProduct GetProduct(this SignUpRequestProductOperation operation)
        {
            return new RequestProduct
            {
                Id = operation.ProductId
            };
        }
    }
}