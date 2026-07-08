using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Public.Models.Register
{
    public class GDPRApplicantAcceptationModel
    {
        public string DNI { get; set; }
        public bool GDPR1 { get; set; }
        public bool GDPR2 { get; set; }
        public bool GDPR3 { get; set; }
    }
}
