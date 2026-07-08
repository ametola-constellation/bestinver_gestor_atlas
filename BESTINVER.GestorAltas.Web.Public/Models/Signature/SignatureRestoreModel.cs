using BESTINVER.GestorAltas.Web.Models;
using BESTINVER.GestorAltas.Web.Public.Models.Register;

namespace BESTINVER.GestorAltas.Web.Public.Models
{
    public class SignatureRestoreDataViewModel: SignatureRestore
    {
        public int SessionTimeout { get; set; }
        public bool IsMobile { get; set; }
        public string LogRocketAccount { get; set; }
        public bool LogRocketEnabled { get; set; }
        public MasterDataModel MasterData { get; set; }
        public bool IsAsesoramiento { get; set; }
        public bool IsRecoveringDocuments { get; set; }
    }
}
