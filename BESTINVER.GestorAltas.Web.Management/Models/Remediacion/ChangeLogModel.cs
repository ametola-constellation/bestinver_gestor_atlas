using System;

namespace BESTINVER.GestorAltas.Web.Management.Models.Remediacion
{
    public class ChangeLogModel
    {
        public long Id { get; set; }
        public string PropertyName { get; set; }
        public string EntityName { get; set; }
        public string PrimaryKeyValue { get; set; }
        public Nullable<System.DateTime> DateChange { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public string ChangedBy { get; set; }
        public string Operation { get; set; }
    }
}