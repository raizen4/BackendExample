namespace ListingApi.Models.Integrations.AgentProperty
{
    public class EpcRating
    {
        //[Range(1, 100, ErrorMessage = "{0} must be between {1} and {2}")]
        public int Current { get; set; }

        //[Range(1, 100, ErrorMessage = "{0} must be between {1} and {2}")]
        public int Potential { get; set; }
    }
}
