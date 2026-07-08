using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Common.Models
{
    public class LoginRequest:LoginViewModel
    {
        public string Name { get; set; }
        public string Password { get; set; }
    }
}
