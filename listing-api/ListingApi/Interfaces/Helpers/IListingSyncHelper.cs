using ListingApi.Models.Cosmos;
using System.Threading.Tasks;

namespace ListingApi.Interfaces.Helpers
{
    public interface IListingSyncHelper
    {
        public Task<Listing> MergeModel(Listing newListing);
    }
}
