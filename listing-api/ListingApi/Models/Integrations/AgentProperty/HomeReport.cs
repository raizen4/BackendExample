using System.Collections.Generic;

namespace ListingApi.Models.Integrations.AgentProperty
{
    public class HomeReport
    {
        public string Status { get; set; }

        public string ExemptionReason { get; set; }

        public EpcRating Eer { get; set; }

        public EpcRating Eir { get; set; }

        public IList<Asset> Files { get; set; }
    }
}
