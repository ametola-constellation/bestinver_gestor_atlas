using BESTINVER.GestorAltas.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Domain.Configurations
{
    public class LogOutRedirectSettings 
    {
        public List<LogOutRedirectUri> LogOutRedirectUri { get; set; }
        //public string Client { get; set; }
    }

    public class LogOutRedirectUri
    {
        public string Client { get; set; }
        public string Url { get; set; }
    }
}
