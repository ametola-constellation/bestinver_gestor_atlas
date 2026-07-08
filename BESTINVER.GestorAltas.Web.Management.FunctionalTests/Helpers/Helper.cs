using System;

namespace BESTINVER.GestorAltas.Web.Management.FunctionalTests.Helpers;

public static class Helper
{
    public static string RandomDni()
    {
        Random rnd = new Random(DateTime.Now.Millisecond);
        int dni = rnd.Next(1000, 100000000);
        return dni.ToString("00000000") + LetraDNI(dni);
    }

    private static string LetraDNI(int dni)
    {
        int indice = dni % 23;
        return "TRWAGMYFPDXBNJZSQVHLCKET"[indice].ToString();
    }
}