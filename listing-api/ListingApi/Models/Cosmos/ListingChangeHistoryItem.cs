using System;

namespace ListingApi.Models.Cosmos
{
    public class ListingChangeHistoryItem
    {
        public DateTime Updated { get; set; }

        public ListingDetails ListingDetails { get; set; }
    }
}
