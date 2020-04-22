using System.Threading.Tasks;
using ListingApi.Models.Cosmos;

namespace ListingApi.Interfaces.DataAccess
{

    public interface IListingStore
    {
        public Task<Listing> GetListing(string id);
        public Task<Listing> CreateListing(Listing listing);
        public Task<Listing> UpdateListing(Listing listing);
    }
}
