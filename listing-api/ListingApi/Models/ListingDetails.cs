using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using PropertyLibrary;

namespace ListingApi.Models
{
    public class ListingDetails
    {
        public string Id { get; set; }

        public int MarketPrice { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public PriceQualifier? PriceQualifier { get; set; }

        public IList<Image> Images { get; set; }

        public Floorplan FloorPlan { get; set; }

        public string Video { get; set; }

        public string Tour { get; set; }

        public Description Descriptions { get; set; }

        public ViewingRules ViewingRules { get; set; }

        public ComplianceChecks Compliance { get; set; }

        public bool AgencyHasKeys { get; set; }

        public string AgencyKeysRef { get; set; }

        public bool SentAdvancedMarketingPack { get; set; }

        public IList<KeyFeature> KeyFeatures { get; set; }
    }
}
