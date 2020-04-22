using System;
using System.Linq;
using System.Threading.Tasks;
using ListingApi.Interfaces.DataAccess;
using ListingApi.Models.Cosmos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

namespace ListingApi.Services
{
    public  class ListingHelperService: IListingHelperService
    {
        private readonly IListingStore _cosmosListingStore;
        private readonly IAuditListingStore _cosmosAuditListingStore;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHostingEnvironment _env;

        public ListingHelperService(IHostingEnvironment env,IAuditListingStore cosmosAuditListingStore, IListingStore cosmosListingStore, IHttpContextAccessor httpContextAccessor )
        {
            _cosmosListingStore = cosmosListingStore;
            _env = env;
            _cosmosAuditListingStore = cosmosAuditListingStore;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task RestoreOrDeleteListing(AuditEventType eventType, Listing listing)
        {
            listing.Deleted = eventType == AuditEventType.Deleted;

            await _cosmosListingStore.UpdateListing(listing);
            var newEvent = new AuditEvent();

            newEvent.Id = Guid.NewGuid().ToString();
            newEvent.EventType = eventType;
            newEvent.ListingId = listing.Id;
            newEvent.DateAdded = DateTime.Now;

            if (!_env.IsDevelopment())
            {
                newEvent.Username = _httpContextAccessor.HttpContext.User.Claims.First(claim => claim.Type.Equals("name")).Value;
                newEvent.UserId = _httpContextAccessor.HttpContext.User.Claims.First(claim => claim.Type.Contains("nameidentifier")).Value;

            }

            await _cosmosAuditListingStore.AddEvent(newEvent);
        }
    }
}
