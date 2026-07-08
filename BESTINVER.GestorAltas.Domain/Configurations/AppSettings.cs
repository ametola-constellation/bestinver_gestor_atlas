using BestInver.Core.Models.AppSettings;
using BESTINVER.GestorAltas.Domain.Interfaces;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Domain.Configurations
{
    public class AppSettings : IAppSettings
    {
        public string ApiWebPrivadaBaseAddress { get; set; }
        public string AppId { get; set; }
        public string APIKey { get; set; }
        public string BestinverWeb { get; set; }
        public int MaxPdfUploadSize { get; set; }
        public string VersionNumber { get; set; }
        public bool AuditEnabled { get; set; }
        public bool XForwardedToEnabled { get; set; }
        public bool SchedulerEnabled { get; set; }
        public int ReplaySignatureLife { get; set; }
        public bool IsJuridicOnlyInAssistMode { get; set; }
        public string ProductProfitabilityDisclaimer { get; set; }
        public string GoogleMapsApiKey { get; set; }
        public int TimeOut { get; set; }
        public int RDActiveUserDays { get; set; }
        public int MaxLargeFileUploadSize { get; set; }
        public bool ChatenEnabled { get; set; }
        public int RequestsConfigExpirationDays { get; set; }
        public bool RemediacionEnabled { get; set; }
        public string AppName { get; set; }
        public string LogRocketAccount { get; set; }
        public bool LogRocketEnabled { get; set; }
        public string ChatSrc { get; set; }
        public string ChatAppId { get; set; }
        public string ChatOrgId { get; set; }
        public string ChatOrgUrl { get; set; }
        public string ChatEnvironment { get; set; }
        public bool BlockSignature { get; set; }
        public List<int> RestrictedCountriesIds { get; set; }
        public bool EnableJsDebug { get; set; }
        public Dictionary<string, string> MasterProductClasses { get; set; }
        public int WarningMailTeckDaysRemaining { get; set; }
        public int MaxClientsToGenerate { get; set; }
        public string UrlSharedFolder { get; set; }
        public string WebPrivadaBaseAddress { get; set; }
        public Cache Cache { get; set; }
        public AzureMonitor AzureMonitor { get; set; }
        public Retry Retry { get; set; }
        public string UrlRubricaeSignComponent { get; set; }
        public int LastAdviceValidDays { get; set; }
        public string SignatureIssuerApi { get; set; }
        public string CdnBestinverWebComponents { get; set; }
        public string Aes256Key { get; set; }
        public EyeAbleSettings EyeAble { get; set; }
        public AutoMapperSetting AutoMapper { get; set; }
        public DashboardSettings Dashboard { get; set; }
    }
}