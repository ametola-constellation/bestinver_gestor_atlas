using System;
using System.Collections.Generic;
using System.Text;

namespace BESTINVER.GestorAltas.Utilities.Security
{
    public class UrlTokenizer
    {
        public static string Encrypt(string value)
        {
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(value));
        }

        public static string Decrypt(string value)
        {
            return Encoding.UTF8.GetString(Convert.FromBase64String(value));
        }
    }
}
