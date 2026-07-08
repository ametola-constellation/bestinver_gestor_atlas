using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class SignedRequestStatusModel
    {
        public DNIDataModel DNI { get; set; }
        public IEnumerable<SignedRequestStatusDocumentModel> Documents { get; set; }
        public string SignedStatus { get; set; }
        public string Signer { get; set; }
        public string SignerDNI { get; set; }
        public string SignerBirthday { get; set; }
        public bool AllowRecoverySignature { get; set; }
        public bool AllowSendDniData { get; set; }
        public bool AllowSendLibroFamilia { get; set; }
        public bool AllowSendPoderes { get; set; }
        public bool AllowSendEscrituras { get; set; }
        public object[] OtherDocuments { get; set; }
    }
}