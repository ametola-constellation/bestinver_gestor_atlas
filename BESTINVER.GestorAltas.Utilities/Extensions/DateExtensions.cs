namespace System
{
    public static class DateExtensions
    {
        public static bool IsMinor(this DateTime? birthdate)
        {
            if (!birthdate.HasValue)
            {
                return true;
            }
            // Save today's date.
            var today = DateTime.Today;
            // Calculate the age.
            var age = today.Year - birthdate.Value.Year;
            // Go back to the year the person was born in case of a leap year
            if (birthdate > today.AddYears(-age))
            {
                age--;
            }

            return age < 18;
        }

        public static bool IsMinor(this DateTime birthdate)
        {
            // Save today's date.
            var today = DateTime.Today;
            // Calculate the age.
            var age = today.Year - birthdate.Year;
            // Go back to the year the person was born in case of a leap year
            if (birthdate > today.AddYears(-age))
            {
                age--;
            }

            return age < 18;
        }
    }
}