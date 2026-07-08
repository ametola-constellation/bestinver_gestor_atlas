using System;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class RequestDocumentsSignedModel
    {
        public RequestDocumentsSignedModel()
        {
            Documents = new List<RequestDocumentModel>();
        }

        public string SignedStatus { get; set; }
        public string Signer { get; set; }
        public string SignerDNI { get; set; }
        public string SignerBirthday { get; set; }
        public bool SignerIsMinor { get; set; }
        public DNIDataModel DNI { get; set; }
        public List<RequestDocumentModel> Documents { get; set; }
        public bool AllowRecoverySignature { get; set; }
        public bool AllowSendDniData { get; set; }
        public bool AllowSendLibroFamilia { get; set; }
        public List<object> OtherDocuments { get; set; }
        public bool AllowSendPoderes { get; set; }
        public bool AllowSendEscrituras { get; set; }
        public int SignerRole { get; set; }
    }
}