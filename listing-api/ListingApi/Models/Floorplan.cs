using System.Collections.Generic;

namespace ListingApi.Models
{
    public class Floorplan
    {
        public string Code { get; set; }
        public IList<Asset> Images { get; set; }
    }
}
