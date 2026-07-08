using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class ExcelLoadModel
    {
        [DisplayName(ResourceKeys.PortfoliosFile)]
        [DataType(DataType.Upload)]
        [Required]
        [FileExtensions(Extensions = ".xlsx")]
        public IFormFile File { get; set; }

        [Required]
        [DisplayName(ResourceKeys.PortfoliosFile)]
        [FileExtensions(Extensions = ".xlsx")]
        public string FileName => File?.FileName;

        [DisplayName(ResourceKeys.TotalProccessedRows)]
        public int TotalProccessedRows { get; set; }

        [DisplayName(ResourceKeys.TotalFailureRows)]
        public int TotalFailureRows { get; set; }

        [DisplayName(ResourceKeys.TotalSuccessfulRows)]
        public int TotalSuccessfulRows { get; set; }

        [DisplayName(ResourceKeys.Errors)]
        public List<string> Failures { get; set; }

        public string CarteraDate { get; set; }

        public ExcelLoadModel()
        {
            Failures = new List<string>();
        }
    }
}