using System;

namespace BESTINVER.GestorAltas.Web.Management.ViewModels
{
    public struct ActionEnabler
    {
        public const string Enable = "";
        public const string Disable = "disabled";
    }

    public class SolicitudActionModel
    {
        public Guid RequestId { get; set; }
        public int SalesChannelId { get; set; }
        public string Disabled { get; set; } = ActionEnabler.Disable;
        public string DisabledStatusChange { get; set; } = ActionEnabler.Disable;
        public string DisabledApprove { get; set; } = ActionEnabler.Enable;
        public string DisabledCancel { get; set; } = ActionEnabler.Enable;
        public string DisabledCaducar { get; set; } = ActionEnabler.Enable;
        public string DisabledDesistir { get; set; } = ActionEnabler.Enable;
        public string DisabledRD { get; set; } = ActionEnabler.Enable;
        public string DisabledAlerta { get; set; } = ActionEnabler.Enable;
        public string DisabledPartialRD { get; set; } = ActionEnabler.Enable;
        public string DisabledRegenerate { get; set; } = ActionEnabler.Disable;
        public string DisabledGenerateOperationFcr { get; set; } = ActionEnabler.Enable;
        public string DisabledSendRDFCRButton { get; set; } = ActionEnabler.Enable;
        public bool ShowdChangeStatusNoRestrictions { get; set; }
        public string DisabledSinBloquear { get; set; } = ActionEnabler.Enable;
        public bool ShowGenerateDoc { get; set; }
        public bool ShowUploadDocumentSFTP { get; set; }
        public bool ShowRegenerateDoc { get; set; }
        public string DisabledSendPeriodicOperation { get; set; } = ActionEnabler.Enable;
        public string DisabledCancelPeriodicOperation { get; set; } = ActionEnabler.Enable;
        public bool ShowPeriodicOperationPanel { get; set; }
        public string DisabledManualStart { get; set; } = ActionEnabler.Enable;
        public string DisabledChangeStatusNoRestrictions { get; set; } = ActionEnabler.Enable;
        public bool ShowOperationPanel { get; set; }
        public bool ShowUploadSubscriptionDealButton { get; set; }
        public bool ShowRepresentativeSignButton { get; set; }
        public bool ShowRetryRepresentativeSignButton { get; set; }
        public bool ShowAttachmentDocumentsAdviceProductButton { get; set; }
        public bool ShowOperationFcrPanel { get; set; }
        public bool IsAdviceProduct { get; set; }
        public bool ShowChangeStatusAdendas { get; set; }
    }
}