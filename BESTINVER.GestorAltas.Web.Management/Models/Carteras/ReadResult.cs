using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    public class ReadRow
    {
        public int Row { get; set; }
        public List<string> Error { get; set; } = new List<string>();
        public List<string> State { get; set; } = new List<string>();
    }

    public class ReadRow<T> : ReadRow
        where T : class, new()
    {
        public T Data { get; set; } = new T();
    }
}