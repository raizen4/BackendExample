using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace ListingApi.Models.Cosmos
{
    public class Listing
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "_etag")]
        public string ETag { internal get; set; }   // for CosmosDB so we can get the ETag but doesn't get serialized to CosmosDB

        public string CompanyUri { get; set; }
        public string AgentPropertyUri { get; set; }
        public bool Synthetic { get; set; }

        public bool Deleted { get; set; }

        [JsonProperty("partitionKey")]
        public string PartitionKey => AgentPropertyUri;
        public DateTime CreatedTime { get; set; }
        public DateTime UpdatedTime { get; set; }
        public ListingDetails Active { get; set; }
        public ListingDetails Draft { get; set; }
        public IList<ListingChangeHistoryItem> ChangeList { get; set; }

        [JsonProperty(PropertyName = "ttl", NullValueHandling = NullValueHandling.Ignore)]
        public int? TimeToLive { get; set; }
    }
}
