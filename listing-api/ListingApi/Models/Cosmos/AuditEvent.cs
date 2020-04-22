using System;
using ListingApi.Interfaces.DataAccess;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ListingApi.Models.Cosmos
{
    public class AuditEvent
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        public string ListingId { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public AuditEventType EventType { get; set; }

        [JsonProperty("partitionKey")]
        public string PartitionKey => ListingId;

        public DateTime DateAdded { get; set; }

        public string UserId { get; set; }

        public string Username { get; set; }

    }
}
