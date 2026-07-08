using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Public.Models.Register
{
    public class MasterDataModel
    {
        public IEnumerable<Valor> Genders { get; set; }
        public IEnumerable<Valor> Countries { get; set; }
        public IEnumerable<Valor> Nationalities { get; set; }
        public IEnumerable<Valor> SignatureTypes { get; set; }
        public IEnumerable<Valor> ViaTypes { get; set; }
        public IEnumerable<Valor> Provinces { get; set; }
        public IEnumerable<Valor> SendingWays { get; set; }
        public IEnumerable<Valor> ReceivingWays { get; set; }
        public IEnumerable<Valor> DocumentSendingWays { get; set; }
    }

    public class Valor
    {
        public string id { get; set; }
        public string valor { get; set; }
        public string descripcion { get; set; }
        public string tooltip { get; set; }
        public string svgfile { get; set; }
    }
}