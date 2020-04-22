using ListingApi.CustomExceptions;
using ListingApi.Interfaces.DataAccess;
using ListingApi.Interfaces.Helpers;
using ListingApi.Models.Cosmos;
using System;
using System.Threading.Tasks;

namespace ListingApi.Helpers
{
    public class ListingSyncHelper : IListingSyncHelper
    {
        private readonly IListingStore _cosmosAccess;

        public ListingSyncHelper(IListingStore dataAccess)
        {
            _cosmosAccess = dataAccess;
        }

        public async Task<Listing> MergeModel(Listing newListing)
        {
            if (newListing == null)
            {
                throw new ArgumentNullException(nameof(newListing));
            }

            var existingListing = await _cosmosAccess.GetListing(newListing.Id);

            if (existingListing != null && newListing.Synthetic ^ existingListing.Synthetic)
            {
                throw new InvalidSyntheticException("Cannot update as synthetic headers do not match.");
            }

            return existingListing == null
                ? newListing
                : new Listing
                {
                    Id = existingListing.Id,
                    CompanyUri = existingListing.CompanyUri,
                    AgentPropertyUri = existingListing.AgentPropertyUri,
                    Synthetic = existingListing.Synthetic,
                    CreatedTime = existingListing.CreatedTime,
                    Active = existingListing.Active,
                    ChangeList = existingListing.ChangeList,

                    Draft = newListing.Draft,
                    TimeToLive = newListing.TimeToLive,
                    UpdatedTime = DateTime.UtcNow,
                };
        }
    }
}
