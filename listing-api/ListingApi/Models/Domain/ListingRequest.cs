using ListingApi.Models.AgentProperty;

namespace ListingApi.Models.Domain
{
    public class ListingRequest
    {
        public string ListingUri { get; set; }

        public string CompanyUri { get; set; }

        public ListingDetails ListingDetails { get; set; }

        public AgentPropertyDto PropertyDetails { get; set; }

        public bool Synthetic { get; set; }
    }
}
