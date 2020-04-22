using System.Collections.Generic;

namespace ListingApi.Models
{
    public class Description
    {
        public string Summary { get; set; }

        public string MeasurementUnit { get; set; }

        public IList<DescriptionRoom> Rooms { get; set; }
    }
}
