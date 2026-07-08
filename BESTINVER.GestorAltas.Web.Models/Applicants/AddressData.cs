using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BESTINVER.GestorAltas.Web.Models
{
    public class AddressData
    {
        [Required]
        public int Id { get; set; }

        [DisplayName(ResourceKeys.ViaType)]
        [Required]
        public int ViaType { get; set; }

        [DisplayName(ResourceKeys.ViaName)]
        [MaxLength(40)]
        [Required]
        public string Name { get; set; }

        [DisplayName(ResourceKeys.Number)]
        [Required]
        [MaxLength(10)]
        public string Number { get; set; }

        [DisplayName(ResourceKeys.Stairs)]
        [MaxLength(10)]
        public string Stairs { get; set; }

        [DisplayName(ResourceKeys.Floor)]
        [MaxLength(10)]
        public string Floor { get; set; }

        [DisplayName(ResourceKeys.Door)]
        [MaxLength(10)]
        public string Door { get; set; }

        [DisplayName(ResourceKeys.AddressExtension)]
        [MaxLength(40)]
        public string AddressExtension { get; set; }

        [DisplayName(ResourceKeys.PostalCode)]
        [Required]
        public string PostalCode { get; set; }

        [DisplayName(ResourceKeys.City)]
        [Required]
        public string City { get; set; }

        [DisplayName(ResourceKeys.Province)]
        public string Province { get; set; }

        [DisplayName(ResourceKeys.Country)]
        [Required]
        public int IdCountry { get; set; }

        [DisplayName(ResourceKeys.CountryType)]
        [Required]
        public int CountryType { get; set; }

        [DisplayName(ResourceKeys.AddressType)]
        [Required]
        public string AddressType { get; set; }
    }
}