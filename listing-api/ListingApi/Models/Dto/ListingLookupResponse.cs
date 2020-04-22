namespace ListingApi.Models.Dto
{
    public class ListingLookupResponse
    {
        public AgentProperty.AgentPropertyDto PropertyDetails { get; set; }

        public string ListingUri { get; set; } = "";

        public bool Deleted { get; set; }

        public ListingDetails ListingDetails { get; set; }
    }
}
