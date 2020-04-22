using System.ComponentModel.DataAnnotations;
using ListingApi.Models.AgentProperty;

namespace ListingApi.Models.Dto
{
    public class ListingIngestRequest
    {
        public string CompanyUri { get; set; }

        public ListingDetails ListingDetails { get; set; }

        [Required]
        public AgentPropertyDto PropertyDetails { get; set; }
    }
}
