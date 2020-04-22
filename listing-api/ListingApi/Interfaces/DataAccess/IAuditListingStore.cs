using System.Threading.Tasks;
using ListingApi.Models.Cosmos;

namespace ListingApi.Interfaces.DataAccess
{
    public interface IAuditListingStore
    {
        public Task AddEvent(AuditEvent newEvent);

        public Task<AuditEvent> GetLastEventForListing(string listingId, AuditEventType eventType);
    }

    public enum AuditEventType
    {
        Deleted = 1,
        Restored = 2
    }
}
