using System.Collections.Generic;
using ListingApi.Models.Integrations.AgentProperty;

namespace ListingApi.Models.AgentProperty
{
    public class EpcDetails
    {
        public string Status { get; set; }

        public string Rrn { get; set; }

        public bool IsValid { get; set; }

        public EpcRating Eer { get; set; }

        public EpcRating Eir { get; set; }

        public IList<Asset> Files { get; set; }
    }
}
