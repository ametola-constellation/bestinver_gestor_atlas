using BestInver.WebPrivada.Shared.Models.Microservices.Requests;
using BestInver.WebPrivada.Shared.Models.Microservices.Requests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Customers.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BESTINVER.GestorAltas.Web.Management.Models;
using BESTINVER.GestorAltas.Web.Models;
using Bestinver.Auth.Ldap.Identity.Models;
using BestInver.WebPrivada.Shared.Models.Microservices.Operations.Enums;
using BestInver.WebPrivada.Shared.Models.Microservices.Products.Enums;
namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public class PermissionResult
    {
        public bool HasSolicitudModificacion { get; internal set; }
        public bool HasAvanzarEstadosAdministrador { get; internal set; }
        public bool HasGenerarFirmaDesdeMiddle { get; internal set; }
        public bool HasEstadosModificacion { get; internal set; }
        public bool HasGestionAlertasModificacion { get; internal set; }
        public bool HasEstadosModificacionSinBloqueo { get; internal set; }
        public bool HasSolicitudBaja { get; internal set; }
    }

    public class PermissionResultBuilder
    {
        private readonly HttpContext context;
        private readonly IAuthorizationService authorizationService;

        private PermissionResultBuilder()
        {
        }

        public PermissionResultBuilder(HttpContext context, IAuthorizationService authorizationService)
        {
            this.context = context;
            this.authorizationService = authorizationService;
        }

        public async Task<PermissionResult> Build()
        {
            return new PermissionResult
            {
                HasSolicitudModificacion = (await authorizationService.AuthorizeAsync(context.User, MiddleOfficeClaimNames.SolicitudModificacion).ConfigureAwait(false)).Succeeded,
                HasAvanzarEstadosAdministrador = (await authorizationService.AuthorizeAsync(context.User, MiddleOfficeClaimNames.AvanzarEstadosAdministrador).ConfigureAwait(false)).Succeeded,
                HasGenerarFirmaDesdeMiddle = (await authorizationService.AuthorizeAsync(context.User, MiddleOfficeClaimNames.GenerarFirmaDesdeMiddle).ConfigureAwait(false)).Succeeded,
                HasEstadosModificacion = (await authorizationService.AuthorizeAsync(context.User, MiddleOfficeClaimNames.EstadosModificacion).ConfigureAwait(false)).Succeeded,
                HasGestionAlertasModificacion = (await authorizationService.AuthorizeAsync(context.User, MiddleOfficeClaimNames.GestionAlertasModificacion).ConfigureAwait(false)).Succeeded,
                HasEstadosModificacionSinBloqueo = (await authorizationService.AuthorizeAsync(context.User, MiddleOfficeClaimNames.EstadosModificacionSinBloqueo).ConfigureAwait(false)).Succeeded,
                HasSolicitudBaja = (await authorizationService.AuthorizeAsync(context.User, MiddleOfficeClaimNames.SolicitudBaja).ConfigureAwait(false)).Succeeded
            };
        }
    }

    public class SolicitudActionModelBuilder
    {
        private IEnumerable<RequestStatusModel> status = Enumerable.Empty<RequestStatusModel>();
        private IEnumerable<ProductOperationModel> productOperations = Enumerable.Empty<ProductOperationModel>();
        private PermissionResult permisionResult;
        private LockedItemModel lockedItem;
        private readonly HttpContext context;
        private IEnumerable<RequestAlertModel> alerts = Enumerable.Empty<RequestAlertModel>();
        private int ApplicantType;
        private int? SignatureType;
        private int? SendingWay;
        private int? RequestChannel;
        private int? SalesChannel;
        private bool ShowUploadSubscriptionDealButton;
        private bool ShowRepresentativeSignButton;
        private bool ShowRetryRepresentativeSignButton;
        private string IdAccount;
        private bool hasSuitableTest;

        private Guid requestId;

        private SolicitudActionModelBuilder()
        {
        }

        public SolicitudActionModelBuilder(HttpContext context)
        {
            this.context = context;
        }

        public SolicitudActionModelBuilder WithRequestId(Guid requestId)
        {
            this.requestId = requestId;
            return this;
        }

        public SolicitudActionModelBuilder WithStatus(IEnumerable<RequestStatusModel> status)
        {
            this.status = status;
            return this;
        }
        public SolicitudActionModelBuilder WithIdAccount(string idAccount)
        {
            this.IdAccount = idAccount;
            return this;
        }

        public SolicitudActionModelBuilder WithSuitableTest(bool hasSuitableTest)
        {
            this.hasSuitableTest = hasSuitableTest;
            return this;
        }

        public SolicitudActionModelBuilder WithLockedItem(LockedItemModel lockedItem)
        {
            this.lockedItem = lockedItem;
            return this;
        }

        public SolicitudActionModelBuilder WithProductOperations(IEnumerable<ProductOperationModel> productOperations)
        {
            this.productOperations = productOperations;
            return this;
        }

        public SolicitudActionModelBuilder WithPermissions(IAuthorizationService authorizationService)
        {
            permisionResult = new PermissionResultBuilder(context, authorizationService).Build().GetAwaiter().GetResult();
            return this;
        }

        public SolicitudActionModelBuilder WithAlerts(IEnumerable<RequestAlertModel> alerts)
        {
            this.alerts = alerts;
            return this;
        }

        public SolicitudActionModelBuilder WithApplicantTypeItem(int ApplicantTypeItem)
        {
            this.ApplicantType = ApplicantTypeItem;
            return this;
        }

        public SolicitudActionModelBuilder WithSignatureTypeItem(int? SignatureTypeItem)
        {
            this.SignatureType = SignatureTypeItem;
            return this;
        }

        public SolicitudActionModelBuilder WithSendingWayItem(int? SendingWayItem)
        {
            this.SendingWay = SendingWayItem;
            return this;
        }

        public SolicitudActionModelBuilder WithRequestChannelItem(int? idRequestChannelItem)
        {
            this.RequestChannel = idRequestChannelItem;
            return this;
        }
        
        public SolicitudActionModelBuilder WithSalesChannelItem(int? idSalesChannelItem)
        {
            this.SalesChannel = idSalesChannelItem;
            return this;
        }
        public SolicitudActionModelBuilder WithProductRequireSignature(bool ShowUploadSubscriptionDealButton, bool ShowRepresentativeSignButton, bool ShowRetryRepresentativeSignButton)
        {
            this.ShowUploadSubscriptionDealButton = ShowUploadSubscriptionDealButton;
            this.ShowRepresentativeSignButton = ShowRepresentativeSignButton;
            this.ShowRetryRepresentativeSignButton = ShowRetryRepresentativeSignButton;
            return this;
        }
        public SolicitudActionModel Build()
        {
            var hasProductOperations = productOperations.Any();
            var requestStatus = status?.LastOrDefault()?.IDStatus;
            var model = new SolicitudActionModel();

            model.IsAdviceProduct = productOperations.Any(po => po.ProductType.Id == (int)ProductTypeMOEnum.Asesoramiento);

            SetLocks(model);
            // Si es una periodica Oculto el panel de botones y muestro el panel de botones de periodica
            if (productOperations.Any(po => po.Operations.Any(o => o.IdOperationType == (int)OperationTypeMOEnum.PeriodicSuscription ||
                o.IdOperationType == (int)OperationTypeMOEnum.PeriodicSuscriptionPsd2)))
            {
                SetShowPeriodicPanel(model);
            }
            else if (SalesChannel == (int)SalesChannelType.MiddleOffice && this.RequestChannel == (int)RequestChannelType.MiddleOffice)
            {
                SetShowOperationFcrPanel(model);
            }
            else if (this.RequestChannel != (int)RequestChannelType.Publica)
            {
                SetShowOperationPanel(model);
            }

            SetStatusChange(model);
            SetApprove(hasProductOperations, requestStatus, model);
            SetCancel(requestStatus, model);
            SetCaducar(requestStatus, model);
            SetDesistir(requestStatus, model);
            SetPartialRDAndRD(hasProductOperations, requestStatus, model);
            SetAlerta(hasProductOperations, requestStatus, model);
            SetSinBloquear(model);
            SetPartialRD(requestStatus, model);
            SetRegenerate(requestStatus, model);
            SetShowdChangeStatusNoRestrictions(requestStatus, model);
            SetShowChangeStatusAdendas(requestStatus, model);
            SetShowGenerateDoc(model);
            SetShowRegenerateDoc(model);
            SetShowUploadDocumentSFTP(model);
            SetSendRDFCRButton(requestStatus, model);

            SetHideAdendas(requestStatus, model);
            SetShowSendPeriodicOperation(requestStatus, model);
            SetShowCancelPeriodicOperation(requestStatus, model);
            SetShowManualStart(requestStatus, model);
            SetSignatureButtons(model);
            SetShowAttachmentDocumentsAdviceProductButton(model, requestStatus, IdAccount, hasSuitableTest);
            model.RequestId = requestId;

            model.SalesChannelId = SalesChannel != null ? (int)SalesChannel : 0 ;
            return model;
        }

        private void SetSignatureButtons(SolicitudActionModel model)
        {
            model.ShowUploadSubscriptionDealButton = this.ShowUploadSubscriptionDealButton;
            model.ShowRepresentativeSignButton = this.ShowRepresentativeSignButton;
            model.ShowRetryRepresentativeSignButton = this.ShowRetryRepresentativeSignButton;

        }

        private void SetLocks(SolicitudActionModel model)
        {
            if (lockedItem.LockedIsLocked && lockedItem.LockedUserName == context.User.Identity.Name)
            {
                model.Disabled = ActionEnabler.Enable;
            }
        }

        private void SetShowdChangeStatusNoRestrictions(int? requestStatus, SolicitudActionModel model)
        {
            if (requestStatus == (int)RequestStatusEnum.Register
                || requestStatus == (int)RequestStatusEnum.SentToOperations
                || requestStatus == (int)RequestStatusEnum.ErrorSendingToOperations
                || requestStatus == (int)RequestStatusEnum.Prospect)
            {
                model.DisabledChangeStatusNoRestrictions = ActionEnabler.Disable;
            }
            model.ShowdChangeStatusNoRestrictions = true;
        }

        private void SetShowChangeStatusAdendas(int? requestStatus, SolicitudActionModel model)
        {
            if (model.IsAdviceProduct &&
                (requestStatus == (int)RequestStatusEnum.Register || 
                requestStatus == (int)RequestStatusEnum.SentToOperations))
            {
                model.ShowChangeStatusAdendas = true;
            }
        }

        private void SetHideAdendas(int? requestStatus, SolicitudActionModel model)
        {
            if (requestStatus == (int)RequestStatusEnum.Adendas && model.IsAdviceProduct)
            {
                model.ShowdChangeStatusNoRestrictions = false;
                model.ShowRegenerateDoc = false;
                model.DisabledApprove = ActionEnabler.Disable;
                model.DisabledCaducar = ActionEnabler.Disable;
                model.DisabledDesistir = ActionEnabler.Disable;
                model.DisabledCancel = ActionEnabler.Disable;
                model.DisabledAlerta = ActionEnabler.Disable;
            }
        }

        private void SetShowSendPeriodicOperation(int? requestStatus, SolicitudActionModel model)
        {
            if (requestStatus != (int)RequestStatusEnum.Periodic_NotStarted)
            {
                model.DisabledSendPeriodicOperation = ActionEnabler.Disable;
            }
            else if (!permisionResult.HasGenerarFirmaDesdeMiddle)
            {
                model.DisabledSendPeriodicOperation = ActionEnabler.Disable;
            }
            else
            {
                model.DisabledSendPeriodicOperation = ActionEnabler.Enable;
            }
        }

        private void SetShowManualStart(int? requestStatus, SolicitudActionModel model)
        {
            if (requestStatus != (int)RequestStatusEnum.Periodic_NotStarted)
            {
                model.DisabledManualStart = ActionEnabler.Disable;
            }
            else if (!permisionResult.HasGenerarFirmaDesdeMiddle)
            {
                model.DisabledManualStart = ActionEnabler.Disable;
            }
            else
            {
                model.DisabledManualStart = ActionEnabler.Enable;
            }
        }

        private void SetShowCancelPeriodicOperation(int? requestStatus, SolicitudActionModel model)
        {
            if (requestStatus == (int)RequestStatusEnum.Periodic_Cancelled)
            {
                model.DisabledCancelPeriodicOperation = ActionEnabler.Disable;
            }
            else if (!permisionResult.HasGenerarFirmaDesdeMiddle)
            {
                model.DisabledCancelPeriodicOperation = ActionEnabler.Disable;
            }
            else
            {
                model.DisabledCancelPeriodicOperation = ActionEnabler.Enable;
            }
        }

        private void SetShowPeriodicPanel(SolicitudActionModel model)
        {
            model.ShowPeriodicOperationPanel = true;
        }

        private static void SetShowOperationPanel(SolicitudActionModel model)
        {
            model.ShowOperationPanel = true;
        }
        
        private static void SetShowOperationFcrPanel(SolicitudActionModel model)
        {
            model.ShowOperationFcrPanel = true;
        }

        private void SetShowGenerateDoc(SolicitudActionModel model)
        {
            bool pendingdoc = alerts.Any(a => a.AlertTypeId == (int)AlertTypes.AlertaPendienteGenerarDocumentacion && !a.EndDate.HasValue);
            model.ShowGenerateDoc = ApplicantType == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Juridica && pendingdoc;
        }

        private void SetShowRegenerateDoc(SolicitudActionModel model)
        {
            bool pendingvalidate = alerts.Any(a => a.AlertTypeId == (int)AlertTypes.AlertaPendienteValidarJuridico && !a.EndDate.HasValue);
            bool pendingdoc = alerts.Any(a => a.AlertTypeId == (int)AlertTypes.AlertaPendienteGenerarDocumentacion && !a.EndDate.HasValue);
            bool duplicateMobile = alerts.Any(a => a.AlertTypeId == (int)AlertTypes.AlertaMovilDuplicado && !a.EndDate.HasValue);
            if (duplicateMobile)
            {
                model.ShowRegenerateDoc = false;
            }
            else
            {
                model.ShowRegenerateDoc =
                    (ApplicantType == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Fisica)
                    || (ApplicantType == (int)BestInver.WebPrivada.Shared.Models.Microservices.Tests.Enums.ApplicantType.Juridica && !pendingvalidate && !pendingdoc);
            }
        }

        private void SetShowAttachmentDocumentsAdviceProductButton(SolicitudActionModel model, int? requestStatus, string idAccount, bool hasSuitableTest)
        {
            var isPending = requestStatus == (int)RequestStatusEnum.PendingSignature || requestStatus == (int)RequestStatusEnum.PendingSocialize;
            var hasIdAccount = idAccount is not null;

            model.ShowAttachmentDocumentsAdviceProductButton = isPending && !hasIdAccount && !hasSuitableTest && model.IsAdviceProduct;
        }

        private void SetShowUploadDocumentSFTP(SolicitudActionModel model)
        {
            model.ShowUploadDocumentSFTP = SignatureType == (int)DocumentSignatureType.Manuscrita && SendingWay == (int)SendingWayType.EnviarCorreoPostal;
        }

        private void SetRegenerate(int? requestStatus, SolicitudActionModel model)
        {
            if ((requestStatus == (int)RequestStatusEnum.PendingSignature || requestStatus == (int)RequestStatusEnum.PendingSocialize)
                            && permisionResult.HasGenerarFirmaDesdeMiddle)
            {
                model.DisabledRegenerate = ActionEnabler.Enable;
            }
        }

        private void SetPartialRD(int? requestStatus, SolicitudActionModel model)
        {
            if (requestStatus == (int)RequestStatusEnum.Register
                           && permisionResult.HasSolicitudModificacion
                           && permisionResult.HasEstadosModificacion)
            {
                model.DisabledPartialRD = GetActionEnablerPartialRDButton(model);
            }
        }

        private void SetSinBloquear(SolicitudActionModel model)
        {
            if (!permisionResult.HasEstadosModificacionSinBloqueo
                            && model.Disabled != ActionEnabler.Enable)
            {
                model.DisabledSinBloquear = ActionEnabler.Disable;
            }
        }

        private void SetAlerta(bool hasProductOperations, int? requestStatus, SolicitudActionModel model)
        {
            if (requestStatus == (int)RequestStatusEnum.Canceled
                            || (!permisionResult.HasGestionAlertasModificacion
                            && !permisionResult.HasEstadosModificacion)
                            || !hasProductOperations
                            || System.Web.HttpContext.Current.User.IsInRole(DefaultRoles.Gestor)
                            || requestStatus == (int)RequestStatusEnum.SentToOperations
                            || requestStatus == (int)RequestStatusEnum.ErrorSendingToOperations)
            {
                model.DisabledAlerta = ActionEnabler.Disable;
            }
        }

        private void SetPartialRDAndRD(bool hasProductOperations, int? requestStatus, SolicitudActionModel model)
        {
            if (requestStatus != (int)RequestStatusEnum.PendingSendRd
                            || (!permisionResult.HasSolicitudModificacion
                            && !permisionResult.HasEstadosModificacion)
                            || !hasProductOperations)
            {
                model.DisabledRD = ActionEnabler.Disable;
                model.DisabledPartialRD = ActionEnabler.Disable;
                if(requestStatus == (int)RequestStatusEnum.ErrorSendingToOperations)
                {
                    model.DisabledRD = ActionEnabler.Enable;
                }
            }

            if (requestStatus == (int)RequestStatusEnum.Register
                            && permisionResult.HasSolicitudModificacion
                            && permisionResult.HasEstadosModificacion)
            {
                model.DisabledPartialRD = GetActionEnablerPartialRDButton(model);
            }
        }

        private void SetDesistir(int? requestStatus, SolicitudActionModel model)
        {
            if ((requestStatus == (int)RequestStatusEnum.Register
                            || requestStatus == (int)RequestStatusEnum.Canceled
                            || requestStatus == (int)RequestStatusEnum.Abandoned
                            || requestStatus == (int)RequestStatusEnum.Expired
                            || (!permisionResult.HasSolicitudBaja
                            && !permisionResult.HasEstadosModificacion))
                            && !permisionResult.HasEstadosModificacionSinBloqueo)
            {
                model.DisabledDesistir = ActionEnabler.Disable;
            }
        }

        private void SetCaducar(int? requestStatus, SolicitudActionModel model)
        {
            if (requestStatus == (int)RequestStatusEnum.Register
                            || requestStatus == (int)RequestStatusEnum.Canceled
                            || requestStatus == (int)RequestStatusEnum.Abandoned
                            || requestStatus == (int)RequestStatusEnum.Expired
                            || (!permisionResult.HasSolicitudBaja
                            && !permisionResult.HasEstadosModificacion))
            {
                model.DisabledCaducar = ActionEnabler.Disable;
            }
        }

        private void SetCancel(int? requestStatus, SolicitudActionModel model)
        {
            if ((requestStatus == (int)RequestStatusEnum.Register
                            || requestStatus == (int)RequestStatusEnum.Canceled
                            || (!permisionResult.HasSolicitudBaja
                            && !permisionResult.HasEstadosModificacion))
                            || (requestStatus == (int)RequestStatusEnum.SentToOperations && !context.User.IsInRole(DefaultRoles.Admin))
                            || (requestStatus == (int)RequestStatusEnum.SentToOperations && model.ShowOperationFcrPanel && !model.IsAdviceProduct)                            
                            || (requestStatus == (int)RequestStatusEnum.ErrorSendingToOperations && !context.User.IsInRole(DefaultRoles.Admin)))
            {
                model.DisabledCancel = ActionEnabler.Disable;
            }
        }

        private void SetApprove(bool hasProductOperations, int? requestStatus, SolicitudActionModel model)
        {
            if (requestStatus == (int)RequestStatusEnum.Locked
                            || requestStatus == (int)RequestStatusEnum.Register
                            || requestStatus == (int)RequestStatusEnum.Canceled
                            || requestStatus == (int)RequestStatusEnum.Abandoned
                            || requestStatus == (int)RequestStatusEnum.Expired
                            || requestStatus == (int)RequestStatusEnum.PendingSendRd
                            || (!permisionResult.HasSolicitudModificacion
                            && !permisionResult.HasEstadosModificacion)
                            || !hasProductOperations
                            || requestStatus == (int)RequestStatusEnum.SentToOperations
                            || requestStatus == (int)RequestStatusEnum.ErrorSendingToOperations)
            {
                model.DisabledApprove = ActionEnabler.Disable;
            }
        }

        private void SetStatusChange(SolicitudActionModel model)
        {
            if (permisionResult.HasEstadosModificacion)
            {
                model.DisabledStatusChange = ActionEnabler.Enable;
            }
        }

        
        private static void SetSendRDFCRButton(int? requestStatus ,SolicitudActionModel model)
        {            
            if (requestStatus == (int)RequestStatusEnum.PendingMoney)
            {
                model.DisabledSendRDFCRButton = ActionEnabler.Enable;
            }
        }
        private string GetActionEnablerPartialRDButton(SolicitudActionModel model)
        {
            if (model.IsAdviceProduct)
            {
                return model.DisabledRD;
            }

            if (!productOperations.Any(p => p.Operations.Any(o => string.IsNullOrEmpty(o.ParOpe))))
            {
                return ActionEnabler.Disable;
            }
            else
            {
                return ActionEnabler.Enable;
            }
        }
    }
}