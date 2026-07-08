using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BESTINVER.GestorAltas.Web.Public.Models.Remediacion
{
    public class RemediacionPersonalDataModel
    {
        public RequestTypeEnum RequestType { get; set; }
        public Guid RemediacionId { get; set; }

        [Display(Name = "Identificador del usuario")]
        [Required(ErrorMessage = "El RDTitular es obligatorio")]
        [MaxLength(10, ErrorMessage = "La longitud máxima permitida del RDTitular es de 10 caracteres")]
        public string RDTitular { get; set; }

        [Display(Name = "Nombre")]
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [MaxLength(50, ErrorMessage = "La longitud máxima permitida del nombre es de 50 caracteres")]
        public string Name { get; set; }

        [Display(Name = "Primer apellido")]
        [MaxLength(50, ErrorMessage = "La longitud máxima permitida del primer apellido es de 50 caracteres")]
        public string FirstSurname { get; set; }

        [Display(Name = "Segundo apellido")]
        [MaxLength(50, ErrorMessage = "La longitud máxima permitida del segundo apellido es de 50 caracteres")]
        public string SecondSurname { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        [Display(Name = "Fecha de Nacimiento")]
        [Required(ErrorMessage = "La fecha de nacimiento es obligatoria")]
        [DisplayFormat(DataFormatString = "{0:dd mm yyyy}")]
        public DateTime? Birthday { get; set; }

        [Display(Name = "Nacionalidad")]
        [Required(ErrorMessage = "La nacionalidad es obligatoria")]
        public int Nacionality { get; set; }

        [Display(Name = "País de nacimiento")]
        [Required(ErrorMessage = "El país de nacimiento es obligatorio")]
        public int Country { get; set; }

        [Display(Name = "Lugar de nacimiento")]
        public string BornPlace { get; set; }

        [Display(Name = "Role del usuario")]
        public int Role { get; set; }

        [Display(Name = "Número del documento nacional de identidad")]
        [MaxLength(20, ErrorMessage = "La longitud máxima permitida del dni es de 20 caracteres")]
        public string Dni { get; set; }

        public int SendType { get; set; }
        public bool IsForeignDni { get; set; }

        public int? FiscalCountry { get; set; }
    }
}
