using System.Collections.Generic;
using ListingApi.Models;
using ListingApi.Models.AgentProperty;
using ListingApi.Models.Cosmos;
using ListingApi.Models.Dto;

namespace ListingApi.UnitTests.UseCases.when_soft_deleting_listing {
    public static class TestHelperSoftDelete
    {
        public static string ValidListingId => "d385e0c1-0303-4afd-b693-a033871bf194";
        public static string ValidListingUri => $"/listings/{ValidListingId}";
        public static Listing ValidReturnedListing => new Listing
        {
          Id=ValidListingId,
          Draft =  new ListingDetails
          {
              Descriptions = new Description
              {
                  Rooms = new List<DescriptionRoom> {
                      new DescriptionRoom{ Description ="Valid Advert Description" }
                  }
              },
              
          },
          
          Deleted = false
        };

        public static Listing WithUpdatedSoftValue(this Listing listing)
        {
            listing.Deleted = true;

            return listing;
        }
    }
}