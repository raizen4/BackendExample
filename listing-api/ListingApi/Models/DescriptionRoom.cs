namespace ListingApi.Models
{
    public class DescriptionRoom
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public int DisplayOrder { get; set; }

        public DescriptionMeasurements Measurements { get; set; }

        public string Description { get; set; }
    }
}
