using BESTINVER.GestorAltas.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Domain.Configurations
{
    public class RemediacionUser : IRemediacionUser
    {
        private string user { get; set; }

        public string GetUser()
        {
            return user;
        }

        public void SetUser(string user)
        {
            this.user = user;
        }
    }
}
