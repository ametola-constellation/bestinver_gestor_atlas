using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Models.Requests
{
    public enum ProductNames
    {
        [Description("Bestinfond")]
        BESTINFOND = 1,

        [Description("Bestinver bolsa")]
        BESTINVER_BOLSA = 2,

        [Description("Bestinver grandes compañías")]
        BESTINVER_GRANDES_COMPAÑÍAS = 3,

        [Description("Bestinver internacional")]
        BESTINVER_INTERNACIONAL = 4,

        [Description("Bestinver mixto internacional")]
        BESTINVER_MIXTO_INTERNACIONAL = 5,

        [Description("Bestinver mixto")]
        BESTINVER_MIXTO = 6,

        [Description("Bestinver renta")]
        BESTINVER_RENTA = 7,

        [Description("Bestvalue")]
        BESTVALUE = 8,

        [Description("Bestinver hedge value")]
        BESTINVER_HEDGE_VALUE = 9,

        [Description("Bestinver ahorro")]
        BESTINVER_AHORRO = 10,

        [Description("Bestinver global")]
        BESTINVER_GLOBAL = 11,

        [Description("Bestinver previsión")]
        BESTINVER_PREVISION = 12,

        [Description("Bestinver consolidación EPSV")]
        BESTINVER_CONSOLIDACIÓN_EPSV = 13,

        [Description("Bestinver futuro EPSV")]
        BESTINVER_FUTURO_EPSV = 14,

        [Description("Bestinver crecimiento EPSV")]
        BESTINVER_CRECIMIENTO_EPSV = 15,

        [Description("Bestinver corto plazo FI")]
        BESTINVER_CORTO_PLAZO_FI = 16,

        [Description("Bestinver patrimonio")]
        BESTINVER_PATRIMONIO_FP = 17,

        [Description("Bestinver latam")]
        BESTINVER_LATAM = 18,

        [Description("Bestinver megatendencias")]
        BESTINVER_MEGATENDENCIAS = 20,

        [Description("Bestinver tordesillas")]
        BESTINVER_TORDESILLAS = 21,

        [Description("Latin America SICAV")]
        LATIN_AMERICA_SICAV = 22,

        [Description("Bestinver deuda corporativa")]
        BESTINVER_DEUDA_CORPORATIVA = 23,

        [Description("Oda capital")]
        ODA_CAPITAL = 24,

        [Description("Bestinver infra")]
        BESTINVER_INFRA = 25,

        [Description("Bestinver private equity")]
        BESTINVER_PRIVATE_EQUITY = 30,

        [Description("Bestinver infra II")]
        BESTINVER_INFRA_II = 32,

        [Description("PRODUCTO DE ASESORAMIENTO")]
        ADVICE_PRODUCT = 36
    }
}
