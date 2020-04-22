using System.ComponentModel.DataAnnotations;
using ListingApi.Models.AgentProperty;

namespace ListingApi.Models.Dto
{
    public class ListingSaveRequest
    {
        [Required]
        public string ListingUri { get; set; }

        public string CompanyUri { get; set; }

        public ListingDetails ListingDetails { get; set; }

        [Required]
        public AgentPropertyDto PropertyDetails { get; set; }
    }
}
