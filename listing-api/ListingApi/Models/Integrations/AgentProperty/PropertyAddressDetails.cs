using System.ComponentModel.DataAnnotations;

namespace ListingApi.Models.Integrations.AgentProperty
{
    public class PropertyAddressDetails
    {
        [Required]
        public string Uprn { get; set; }

        public string Company { get; set; }

        public string BuildingNumber { get; set; }

        public string BuildingName { get; set; }

        public string Street { get; set; }

        public string Line2 { get; set; }

        public string Line3 { get; set; }

        public string City { get; set; }

        public string PostalCode { get; set; }

        public string CountryIso { get; set; }

        public string PropertyType { get; set; }

        public string ExternalId { get; set; }

        public string ExternalSource { get; set; }
    }
}
