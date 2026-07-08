using BestInver.WebPrivada.Shared.Models.Microservices.Operations.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;

using BESTINVER.GestorAltas.Web.Management.Models.Dashboard;
using System;
using System.Linq;
using System.Text;

namespace BestInver.WebPrivada.Shared.Models.Microservices.Requests
{
    public static class RequestDashboardExtensions
    {
        public static AlertTypeModel GetOtherAlerts(this RequestDashboard m)
        {
            return m.Alerts.Any(a => (a.AlertType.Id != (int)AlertTypes.AlertaPersonaPublica
                                && a.AlertType.Id != (int)AlertTypes.AlertaTerrorismo
                                && a.AlertType.Id != (int)AlertTypes.AlertaPBC)
                                && !a.EndDate.HasValue)
                ? AlertModel.O
                : AlertModel.None;
        }

        public static AlertTypeModel GetTerroristAlerts(this RequestDashboard m)
        {
            return m.Alerts.Any(a => a.AlertType.Id == (int)AlertTypes.AlertaTerrorismo && !a.EndDate.HasValue)
                ? AlertModel.T
                : AlertModel.None;
        }

        public static AlertTypeModel GetSignAlerts(this RequestDashboard m)
        {
            return m.Alerts.Any(a => a.AlertType.Id == (int)AlertTypes.AlertaEnvioDocumentacion && !a.EndDate.HasValue)
                   ? AlertModel.F
                : AlertModel.None;
        }

        public static AlertTypeModel GetPBCAlerts(this RequestDashboard m)
        {
            return m.Alerts.Any(a => (a.AlertType.Id == (int)AlertTypes.AlertaPersonaPublica || a.AlertType.Id == (int)AlertTypes.AlertaPBC)
                && !a.EndDate.HasValue)
                ? AlertModel.PBC
                : AlertModel.None;
        }

        public static string GetStatus(this RequestDashboard m)
        {
            return m.Status.OrderByDescending(s => s.StartDate).Select(s => s.StatusType?.Name).FirstOrDefault()?.ToString();
        }

        public static string GetIdStatus(this RequestDashboard m)
        {
            return m.Status.OrderByDescending(s => s.StartDate).Select(s => s.StatusType?.Id).FirstOrDefault()?.ToString();
        }

        public static string GetStatusComments(this RequestDashboard m)
        {
            return m.Status.OrderByDescending(s => s.StartDate).FirstOrDefault()?.Comments;
        }

        public static string GetSingleProduct(this RequestDashboard m)
        {
            return m.Operations.FirstOrDefault()?.Product.Name;
        }

        public static int? GetSingleProductTypeId(this RequestDashboard m)
        {
            return m.Operations.FirstOrDefault()?.Product.ProductType.Id;
        }

        public static string GetSingleAmount(this RequestDashboard m)
        {
            var op = m.Operations.FirstOrDefault()?.Operation;
            return GetSingleAmount(op);
        }

        public static string GetOperationType(this RequestDashboard m)
        {
            return m.Operations.FirstOrDefault()?.Operation?.OperationType?.Name;
        }

        public static int? GetOperationTypeId(this RequestDashboard m)
        {
            return m.Operations.FirstOrDefault()?.Operation?.OperationType.Id;
        }

        public static string GetExternalCode(this RequestDashboard m)
        {
            return m.Operations.FirstOrDefault()?.Operation?.ExternalCode;
        }

        public static DateTime? GetInitialPeriodicDate(this RequestDashboard m)
        {
            var oper = m.Operations.FirstOrDefault()?.Operation;
            if (oper != null && oper.InitialMonth.HasValue && oper.InitialMonth.Value > 0 && oper.InitialYear.HasValue && oper.InitialYear.Value > 0 && oper.InitialDay.HasValue && oper.InitialDay.Value > 0)
            {
                return new DateTime(oper.InitialYear.Value, oper.InitialMonth.Value, oper.InitialDay.Value);
            }
            return null;
        }

        public static string GetSingleAmount(this RequestOperation op)
        {
            try
            {
                string amount = "";
                decimal amountValue = 0;

                if (op != null)
                {
                    if (op.Amount == null)
                    {
                        if (op.MonthlyAmount != null)
                        {
                            amountValue = op.MonthlyAmount.Value;
                        }
                        else
                        {
                            amount = "";
                        }
                    }
                    else
                    {
                        amountValue = op.Amount.Value;
                    }

                    if (op.OperationType.Id == (int)OperationTypeMOEnum.Contribution
                        || op.OperationType.Id == (int)OperationTypeMOEnum.Suscription
                        || op.OperationType.Id == (int)OperationTypeMOEnum.Receipt
                        || op.OperationType.Id == (int)OperationTypeMOEnum.PeriodicSuscription)
                    {
                        amount = amountValue.ToString("#,##.##");
                        amount += "€";
                    }
                    else if (op.OperationType.Id == (int)OperationTypeMOEnum.ExternalTransfer
                        || op.OperationType.Id == (int)OperationTypeMOEnum.InternalTransfer)
                    {
                        if (op.Transfer?.TransferType.Id == (int)Tests.Enums.TransferType.Participaciones)
                        {
                            amount = amountValue.ToString("#,##.######");
                            amount += " participaciones";
                        }
                        else if (op.Transfer?.TransferType.Id == (int)Tests.Enums.TransferType.ParcialImporte)
                        {
                            amount = amountValue.ToString("#,##.##");
                            amount += "€";
                        }
                        else if (op.Transfer?.TransferType.Id == (int)Tests.Enums.TransferType.Total)
                        {
                            amount = "Traspaso total";
                        }
                        else if (op.Transfer?.TransferType.Id == (int)Tests.Enums.TransferType.Porcentaje)
                        {
                            amount = amountValue.ToString("#,##.##");
                            amount += "%";
                        }
                        else
                        {
                            amount = "";
                        }
                    }
                    else if (op.OperationType.Id == (int)OperationTypeMOEnum.Refund)
                    {
                        if (op.Refund.RefundType.Id == (int)RefundType.Total)
                        {
                            amount = "Total";
                        }
                        else if (op.Refund.RefundType.Id == (int)RefundType.NetAmount)
                        {
                            amount = amountValue.ToString("#,##.##");
                            amount += "€ netos";
                        }
                        else if (op.Refund.RefundType.Id == (int)RefundType.GrossAmount)
                        {
                            amount = amountValue.ToString("#,##.##");
                            amount += "€ brutos";
                        }
                        else if (op.Refund.RefundType.Id == (int)RefundType.SharesNumber)
                        {
                            amount = amountValue.ToString("#,##.######");
                            amount += " participaciones";
                        }
                    }
                }
                return amount;
            }
            catch
            {
                return "";
            }
        }

        public static int? GetFirstOperationId(this RequestDashboard request)
        {
            return request.Operations.FirstOrDefault()?.Operation?.Id;
        }

        public static int? GetSingleProductId(this RequestDashboard m)
        {
            return m.Operations.FirstOrDefault()?.Product.Id;
        }

        public static bool IsForeignAccount(this RequestDashboard m)
        {
            var iban = m.Operations.FirstOrDefault()?.Operation.Refund?.IBAN;
            if (!string.IsNullOrEmpty(iban))
            {
                return m.Operations.FirstOrDefault()?.Operation.Refund?.IBAN.Substring(0, 2) != "ES";
            }
            return false;
        }

        public static bool IsForeignAccount(this RequestOperation m)
        {
            if (!string.IsNullOrEmpty(m.Refund?.IBAN))
            {
                return m.Refund?.IBAN.Substring(0, 2) != "ES";
            }
            return false;
        }
    }
}