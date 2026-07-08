using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Domain.Interfaces
{
    public interface IAppSettings
    {
        string APIKey { get; set; }
        string ApiWebPrivadaBaseAddress { get; set; }
        string AppId { get; set; }
        bool AuditEnabled { get; set; }
        string BestinverWeb { get; set; }
        int MaxPdfUploadSize { get; set; }
        int ReplaySignatureLife { get; set; }
        bool SchedulerEnabled { get; set; }
        string VersionNumber { get; set; }
        bool XForwardedToEnabled { get; set; }
        bool IsJuridicOnlyInAssistMode { get; set; }
        string ProductProfitabilityDisclaimer { get; set; }
        string GoogleMapsApiKey { get; set; }
        int TimeOut { get; set; }
        int RDActiveUserDays { get; set; }
        int MaxLargeFileUploadSize { get; set; }     
        bool ChatenEnabled { get; set; }
        int RequestsConfigExpirationDays { get; set; }
        bool RemediacionEnabled { get; set; }
        string AppName { get; set; }
        string LogRocketAccount { get; set; }
        bool LogRocketEnabled { get; set; }
        string ChatSrc { get; set; }
        string ChatAppId { get; set; }
        string ChatOrgId { get; set; }
        string ChatOrgUrl { get; set; }
        string ChatEnvironment { get; set; }
        bool BlockSignature { get; set; }
        string WebPrivadaBaseAddress { get; set; }
        List<int> RestrictedCountriesIds { get; set; }
        Dictionary<string, string> MasterProductClasses { get; set; }
    }
}