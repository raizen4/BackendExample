using ListingApi.Models;
using ListingApi.Models.AgentProperty;
using ListingApi.Models.Dto;

namespace ListingApi.Helpers
{
    public static class PublicListingResponseMapper
    {
        public static ListingLookupResponse MapToListingLookupResponse(ListingDetails listingDetails, AgentPropertyDto agentProperty)
        {
            return new ListingLookupResponse
            {
                PropertyDetails = agentProperty,
                ListingDetails = listingDetails,
                ListingUri = ConvertListingIdToUri(listingDetails.Id)
            };
        }

        public static string ConvertListingIdToUri(string id)
        {
            return $"/public-listings/{id}";
        }
    }
}
