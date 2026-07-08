using BESTINVER.GestorAltas.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BESTINVER.GestorAltas.Web.Management.Models
{
    public class CotitularDataModel : TitularDataModel
    {
        public CotitularDataModel()
        {
            FiscalAddress = new AddressData();
            PostalAddress = new AddressData();
        }

        [DisplayName(ResourceKeys.CompanyPercentage)]
        public decimal CompanyPercentage { get; set; }

        [DisplayName(ResourceKeys.PhoneNumber)]
        public string PhoneNumber { get; set; }

        [DisplayName(ResourceKeys.MobilePhoneNumber)]
        [UniqueMobilePhone(2)]
        public string MobilePhoneNumber { get; set; }

        [DisplayName(ResourceKeys.Email)]
        public string Email { get; set; }

        public AddressData FiscalAddress { get; set; }

        public AddressData PostalAddress { get; set; }

        public List<SelectItemModel> ViaTypes { get; set; }

        [DisplayName("Mi dirección postal es diferente a la fiscal")]
        public bool DifferentPostalAddress { get; set; }

        [Required]
        public override string FirstSurname { get => base.FirstSurname; set => base.FirstSurname = value; }

        public string InvalidPhones { get; set; }


    }
}
