namespace BESTINVER.GestorAltas.Web.Management.Controllers
{
    internal static class Resource
    {
        public static string UnlockAlertPBC_Template => @"

<!DOCTYPE html PUBLIC "" -//W3C//DTD XHTML 1.0 Transitional//EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
< html xmlns=""http://www.w3.org/1999/xhtml"">
<head>
    <meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8"" />
    <meta name = ""viewport"" content=""width=device-width, initial-scale=1.0"" />
    <title>Bestinver</title>
    <style type = ""text/css"" >
        @media only screen and(max-width: 600px)
        {
            .bodyn {
                width: 320px !important;
            }

            .ancho {
                width: 100 % !important;
            }

            .ancho_movil {
                width: 30 % !important;
                padding - right: 10px !important;
            }

            .oculto {
                display: none !important;
            }

            .tamano1 {
                font - size: 17px !important;
            }

            .flole2 {
                float: left !important;
                padding - top: 15px !important;
            }

            .pad_arriba {
                padding - top: 25px !important;
            }

            .separa {
                padding: 35px 30px 40px 30px !important;
            }

            .td_separador {
                width: 90px !important;
            }

            .tabla_separador {
                width: 49 % !important;
            }

            .cierre {
                padding: 40px 50px 5px 50px;
                !important;
            }
        }

        .Snippet, .ExternalClass {
            font-size: 13px !important;
        }

    td, tr {
            border-collapse: collapse !important;
        }

        * {
            line-height: 120% !important;
        }

        a {
            cursor: pointer !important;
            border: 0 !important;
        }

        img {
            border: 0 !important;
        }
    </style>
    <!--[if gte mso 9]>
        <style type = ""text/css"" >

         # separacion-best{ width:50px!important;}

        </ style >
        < ![endif]-- >

    < style type=""text/css"">

    </style>
</head>
<body bgcolor = ""#FFFFFF"" >
    < table width=""600"" border=""0"" cellpadding=""0"" cellspacing=""0"" align=""center"" class=""bodyn"">
        <!-- header  -->
        <tr>
            <td height = ""100"" bgcolor=""#ffffff"">
                <table width = ""40%"" border=""0"" cellspacing=""0"" cellpadding=""0"" align=""left"">
                    <tbody>
                        <tr>
                            <td height = ""20"" ></ td >
                        </ tr >
                        < tr >
                            < td style=""padding-left:50px""><img src = ""https://www.bestinver.es/wp-content/uploads/2018/03/logo.png"" alt="""" /></td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <!-- FIN header  -->
        <!-- RAYA  -->
        <tr>
            <td>
                <table width = ""100%"" border=""0"" align=""left"" cellpadding=""0"" cellspacing=""0"">

                    <tr>
                        <td style = ""border-top:1px solid #d1cfcf;"" > &nbsp;</td>
                    </tr>

                </table>
            </td>
        </tr>
        <!-- fin RAYA  -->
        <!-- texto  -->
        <tr>
            <td bgcolor = ""#ffffff"" style=""padding:15px 100px 0px 50px; font-family:verdana; font-size:13px; color:#000000"">Hola, <br /><br />Te informamos que la solicitud de alta de { COMPLETENAME }
con NIF { DNI }, y gestor comercial asignado { COMMERCIAL }, ha sido desbloqueada.</td>
        </tr>

        <tr>
            <td class=""cierre"" bgcolor=""#ffffff"" style=""padding:23px 50px 0px 50px; font-family:verdana; font-size:13px; color:#000000; line-height: 18px;"">
                Gracias, <br /><br />
            </td>
        </tr>
        <tr>
            <td bgcolor = ""#ffffff"" style=""padding:0px 0px 0px 50px; font-family:verdana; font-size:13px; color:#000000;""><strong>BESTINVER</strong></td>
        </tr>
        <tr>
            <td bgcolor = ""#ffffff"" style=""padding:2px 50px 25px 50px;"">
                <table width = ""86"" border=""0"" align=""left"" cellpadding=""0"" cellspacing=""0"">
                    <tbody>
                        <tr>
                            <td style = ""border-top:4px solid red;"" > &nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <!-- texto  -->
        <!--   FOOOOOOOOTER  -->

        <tr>
            <td bgcolor = ""#1d1c1b"" >
                < table width=""20%"" border=""0"" align=""left"" cellpadding=""0"" cellspacing=""0"" style=""padding:20px 0px 9px 50px;"">
                    <tbody>
                        <tr>
                            <td><img src = ""https://www.bestinver.es/wp-content/uploads/2018/03/logo_2.png"" alt="""" border=""0"" /></td>
                        </tr>
                    </tbody>
                </table>
                <table width = ""30%"" border=""0"" align=""right"" cellpadding=""0"" cellspacing=""0"">
                    <tbody>
                        <tr>
                            <td style = ""padding:20px 0px 0px 0px;"" >< a href=""https://www.linkedin.com/company/bestinver/"" target=""_blank""><img src = ""https://www.bestinver.es/wp-content/uploads/2018/03/redes_1.jpg"" alt="""" border=""0"" /></a></td>
                            <td style = ""padding:20px 0px 0px 0px;"" >< a href=""https://www.youtube.com/user/BestinverAM/"" target=""_blank""><img src = ""https://www.bestinver.es/wp-content/uploads/2018/03/redes_3.jpg""  alt="""" border=""0"" /></a></td>
                            <td style = ""padding:20px 0px 0px 0px;"" >< a href=""https://twitter.com/bestinver"" target=""_blank""><img src = ""https://www.bestinver.es/wp-content/uploads/2018/03/redes_4.jpg""  alt="""" border=""0"" /></a></td>
                            <td style = ""padding:20px 0px 0px 0px;"" >< a href=""https://www.facebook.com/Bestinver/"" target=""_blank""><img src = ""https://www.bestinver.es/wp-content/uploads/2018/03/redes_2.jpg""  alt="""" border=""0"" /></a></td>
                            <td style = ""padding:20px 40px 0px 0px;"" >< a href=""https://www.slideshare.net/Bestinver"" target=""_blank""><img src = ""https://www.bestinver.es/wp-content/uploads/2018/03/redes_5.jpg""  alt="""" border=""0"" style=""text-decoration: none;"" /></a></td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor = ""#1d1c1b"" style=""padding:0px 50px 0px 50px;"">
                <table width = ""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"">
                    <tbody>
                        <tr>
                            <td style = ""border-top:1px solid #ffffff;"" > &nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor = ""#1d1c1b"" style=""padding:0px 50px 20px 50px;"">
                <table width = ""50%"" border=""0"" cellspacing=""0"" cellpadding=""0"" class=""ancho"">
                    <tbody>
                        <tr>
                            <td style = ""font-family:verdana; font-size:13px; color:#ffffff;"" >
                                Teléfono: <strong><a style = ""color:#ffffff; text-decoration:none"" href=""tel:900878280"" target=""_blank"">900 878 280</a></strong><br />
                                Email: <strong><a href = ""mailto:bestinver@bestinver.es"" style=""color:#ffffff; text-decoration:none"" target=""_blank"">bestinver @bestinver.es</a></strong><br />

                                  Web: <strong><a href = ""http://www.bestinver.es"" style= ""color:#ffffff; text-decoration:none"" target= ""_blank"" > www.bestinver.es </ a ></ strong >< br />
                                  Fax: <strong><a style = ""color:#ffffff; text-decoration:none"" href= ""tel:915959120"" target= ""_blank"" > 91 595 91 20</a></strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor = ""#1d1c1b"" style= ""padding:0px 50px 0px 50px;"" >

                  < table width= ""100%"" border= ""0"" cellspacing= ""0"" cellpadding= ""0"" >

                      < tbody >

                          < tr >

                              < td style= ""border-top:1px solid #ffffff;"" > &nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor = ""#1d1c1b"" style=""padding:0px 0px 0px 50px; font-family:verdana; font-size:24px; color:#ffffff;"">
                Nuestras oficinas
            </td>
        </tr>
        <tr>
            <td bgcolor = ""#1d1c1b"" style= ""padding:2px 50px 0px 50px;"" >
                < table class=""tabla_separador"" width=""85"" border=""0"" align=""left"" cellpadding=""0"" cellspacing=""0"">
                    <tbody>
                        <tr><td height = ""25"" ></ td ></ tr >
                        < tr >
                            < td class=""td_separador"" style=""border-top:4px solid red;"">&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor = ""#1d1c1b"" style=""padding:15px 50px 15px 50px;"">
                <table width = ""40%"" border=""0"" align=""left"" cellpadding=""0"" cellspacing=""0"" class=""ancho"">
                    <tbody>
                        <tr>
                            <td align = ""left"" valign=""top"" style=""font-family:verdana; font-size:13px; color:#ffffff;"">
                                <strong>MADRID</strong><br />
                                C.Juan de Mena 8, planta 1<br />
                                28014 Madrid
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table width = ""50%"" border=""0"" align=""center"" cellpadding=""0"" cellspacing=""0"" class=""ancho"">
                    <tbody>
                        <tr>
                            <td align = ""left"" valign=""top"" style=""font-family:verdana; font-size:13px; color:#ffffff;"" class=""pad_arriba"">
                                <strong>BARCELONA</strong><br />
                                C.Diputació 246, planta 3<br />
                                08007 Barcelona
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor = ""#1d1c1b"" style=""padding:15px 50px 25px 50px;"">
                <table width = ""40%"" border=""0"" align=""left"" cellpadding=""0"" cellspacing=""0"" class=""ancho"">
                    <tbody>
                        <tr>
                            <td align = ""left"" valign=""top"" style=""font-family:verdana; font-size:13px; color:#ffffff;"">
                                <strong>VALENCIA</strong><br />
                                C.Moratín 17, planta 2<br />
                                46002 Valencia
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table width = ""50%"" border=""0"" align=""center"" cellpadding=""0"" cellspacing=""0"" class=""ancho"">
                    <tbody>
                        <tr>
                            <td align = ""left"" valign=""top"" style=""font-family:verdana; font-size:13px; color:#ffffff;"" class=""pad_arriba"">
                                <strong>BILBAO</strong><br />
                                C.Gran Vía 58, planta 4<br />
                                48009 Bilbao
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor = ""#1d1c1b"" style=""padding:15px 50px 25px 50px;"">
                <table width = ""40%"" border=""0"" align=""left"" cellpadding=""0"" cellspacing=""0"" class=""ancho"">
                    <tbody>
                        <tr>
                            <td align = ""left"" valign=""top"" style=""font-family:verdana; font-size:13px; color:#ffffff;"">
                                <strong>PAMPLONA</strong><br />
                                Avda.Carlos III El Noble 13-15, planta 2<br />
                                31002 Pamplona
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table width = ""50%"" border=""0"" align=""center"" cellpadding=""0"" cellspacing=""0"" class=""ancho"">
                    <tbody>
                        <tr>
                            <td align = ""left"" valign=""top"" style=""font-family:verdana; font-size:13px; color:#ffffff;"" class=""pad_arriba"">
                                <strong>LEÓN</strong><br />
                                Avda.Padre Isla 2, planta 1<br />
                                24002 León
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table width = ""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"">
                    <tr>
                        <td width = ""100%"" valign=""top"" style=""padding:25px 50px 25px 50px;"">
                            <span style = ""font-family:arial, sans-serif; color:#000000; font-size:10px; text-align:left;"" >
                                Este documento ha sido elaborado por Bestinver Gestión, S.A.SGIIC con fines meramente informativos, no pudiendo considerarse bajo ninguna circunstancia como una oferta de inversión en sus fondos de inversión.La información ha sido recopilada por Bestinver Gestión, S.A.SGIIC de fuentes consideradas como fiables. No obstante, aunque se han tomado las medidas razonables para asegurarse de que la información sea correcta, Bestinver Gestión, S.A.SGIIC no garantiza que sea exacta, completa o actualizada.<br />
                                <br />

                               Todas las opiniones y estimaciones incluidas en este documento constituyen el juicio de Bestinver Gestión, S.A.SGIIC en la fecha a la que están referidas y pueden variar sin previo aviso.Todas las opiniones contendidas han sido emitidas con carácter general, sin tener en cuenta los objetivos específicos de inversión, la situación financiera o las necesidades particulares de cada persona.<br />
                                <br />

                               En ningún caso, Bestinver Gestión, S.A.SGIIC, sus administradores, empleados y personal autorizado serán responsables de cualquier tipo de perjuicio que pueda proceder, directa o indirectamente, del uso de la información contenida en este documento.El anuncio de rentabilidades pasadas no constituye en ningún caso promesa o garantía de rentabilidades futuras.<br />
                                <br />

                               Todas las rentabilidades de Bestinver están expresadas en € y en términos netos, descontados gastos y comisiones.<br />
                                <br />

                               Fuente rentabilidad de Bestinver: BESTINVER<br />
                                <br />

                               Fuente PER de los fondos: BESTINVER
                           </span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!--   FIIIIN FOOOOOOOOTER  -->

    </table>
</body>
</html>
";
    }
}