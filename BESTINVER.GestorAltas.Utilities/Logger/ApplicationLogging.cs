using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Logging;

namespace BESTINVER.GestorAltas.Utilities.Logger
{
    public static class ApplicationLogging
    {
        public static ILoggerFactory LoggerFactory { get; set; }

        public static ILogger CreateLogger<T>() => LoggerFactory?.CreateLogger<T>();

        public static ILogger CreateLogger(string name) => LoggerFactory?.CreateLogger(name);
    }
}
