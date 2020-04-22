using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ListingApi.CustomExceptions;
using ListingApi.Interfaces.DataAccess;
using ListingApi.Models.Cosmos;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using Prometheus;

namespace ListingApi.DataAccess
{
    public class AuditListingStoreAccess :IAuditListingStore
    {
        private static readonly Summary _requestSizeSummary = Metrics.CreateSummary("cosmosdb_request_charge", "CosmosDB request charge");
        private readonly Container _container;
        private readonly ILogger _logger;

        public AuditListingStoreAccess(IEnumerable<Container> containers, ILogger<ListingStoreAccess> logger)
        {
            _container = containers.FirstOrDefault(x => x.Id == DataAccessConfig.ListingAuditContainerName);
            _logger = logger;
        }

        public async Task AddEvent(AuditEvent newEvent)
        {
            try
            {
                var response = await _container.CreateItemAsync(newEvent);
                _logger.LogInformation($"Created Listing. Operation consumed {response.RequestCharge} RUs");
                _requestSizeSummary.Observe(response.RequestCharge);
            }
            catch (CosmosException ex)
            {
                _logger.LogError(ex,"Could not add the event for listing id " + newEvent.ListingId);
                throw new CosmosCreateAuditEventException("Couldn't update the event for listing" + newEvent.ListingId + " with error" + typeof(CosmosException));
            }
        }

        public async Task<AuditEvent> GetLastEventForListing(string listingId, AuditEventType eventType)
        {
            try
            {
                var iterator = _container
                    .GetItemLinqQueryable<AuditEvent>(true)
                    .Where(listingEvent => listingEvent.ListingId == listingId && listingEvent.EventType == eventType)
                    .ToFeedIterator();

                var lastEventRetrieved = await iterator.ReadNextAsync();
                var sortedArray = lastEventRetrieved.Resource.ToList().OrderByDescending(audit => audit.DateAdded);

                _logger.LogInformation($"Event retrieved. Operation consumed {lastEventRetrieved.RequestCharge} RUs");
                _requestSizeSummary.Observe(lastEventRetrieved.RequestCharge);

                return sortedArray.FirstOrDefault();
            }
            catch (CosmosException ex)
            {
                _logger.LogError(ex,"Could retrieve event for listing " + listingId);
                throw new CosmosRetrieveAuditEventException("Couldn't retrieve the event for listing" + listingId + " with error" + typeof(CosmosException));
            }
        }
    }
}
