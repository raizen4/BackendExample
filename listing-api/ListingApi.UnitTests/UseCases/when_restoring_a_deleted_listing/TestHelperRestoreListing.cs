using System.Collections.Generic;
using ListingApi.Models;
using ListingApi.Models.Cosmos;

namespace ListingApi.UnitTests.UseCases.when_restoring_a_deleted_listing
{
    public static class TestHelperRestoreListing
    {
        public static string ValidListingId => "d385e0c1-0303-4afd-b693-a033871bf194";
        public static string ValidListingUri => $"/listings/{ValidListingId}";
        public static Listing ValidReturnedListing => new Listing
        {
            Id = ValidListingId,
            Draft = new ListingDetails
            {
                Descriptions = new Description
                {
                    Rooms = new List<DescriptionRoom> {
                      new DescriptionRoom{ Description ="Valid Advert Description" }
                  }
                },

            },

            Deleted = true
        };

        public static Listing WithUpdatedDeletedStatus(this Listing listing)
        {
            listing.Deleted = true;

            return listing;
        }

    }
}