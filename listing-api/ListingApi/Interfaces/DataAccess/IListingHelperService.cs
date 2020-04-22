using System.Threading.Tasks;
using ListingApi.Models.Cosmos;
using Microsoft.AspNetCore.Mvc;

namespace ListingApi.Interfaces.DataAccess
{
    public interface IListingHelperService
    {
        public Task RestoreOrDeleteListing(AuditEventType eventType, Listing listing);
    }
}
