using System.ComponentModel;

namespace BESTINVER.GestorAltas.Web.Management.Models.Dashboard
{
    public enum AlertModel
    {
        None,

        [Description("Prevención Blanqueo de Capitales")]
        PBC,

        [Description("Otras Alertas")]
        O,

        [Description("Alerta Terrorista")]
        T,

        [Description("Alerta Firma")]
        F
    }

    public sealed class AlertTypeModel
    {
        private readonly AlertModel value;

        public AlertTypeModel()
        {
            value = AlertModel.None;
        }

        public AlertTypeModel(AlertModel value)
        {
            this.value = value;
        }

        public override string ToString()
        {
            if (value == AlertModel.None)
            {
                return string.Empty;
            }
            return value.ToString();
        }

        public string Description
        {
            get
            {
                var fi = value.GetType().GetField(value.ToString());

                if (fi != null)
                {
                    var attrs = fi.GetCustomAttributes(typeof(DescriptionAttribute), true);
                    if (attrs?.Length > 0)
                    {
                        return ((DescriptionAttribute)attrs[0]).Description;
                    }
                }

                return string.Empty;
            }
        }

        public static implicit operator AlertTypeModel(AlertModel alert)
        => new AlertTypeModel(alert);
    }
}