using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using ListingApi.CustomExceptions;
using ListingApi.Interfaces.DataAccess;
using ListingApi.Models.Cosmos;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Microsoft.Extensions.Logging;
using Prometheus;

namespace ListingApi.DataAccess
{
    public class ListingStoreAccess : IListingStore
    {
        private static readonly Summary _requestSizeSummary = Metrics.CreateSummary("cosmosdb_request_charge", "CosmosDB request charge");
        private readonly Container _container;
        private readonly ILogger _logger;

        public ListingStoreAccess(IEnumerable<Container> containers, ILogger<ListingStoreAccess> logger)
        {

            _container = containers.FirstOrDefault(x => x.Id == DataAccessConfig.ListingContainerName);
            _logger = logger;
        }

        public async Task<Listing> CreateListing(Listing listing)
        {
            try
            {
                var response = await _container.CreateItemAsync(listing);
                _logger.LogInformation($"Created Listing. Operation consumed {response.RequestCharge} RUs");
                _requestSizeSummary.Observe(response.RequestCharge);

                return response.Resource;
            }
            catch (Exception ex)
            {
                throw new CosmosCreateListingException($"CosmosDB error when trying to create Listing: {ex}");
            }
        }

        public async Task<Listing> GetListing(string id)
        {
            try
            {
                var iterator = _container
                    .GetItemLinqQueryable<Listing>(true)
                    .Where(p => p.Id == id)
                    .ToFeedIterator();

                var matchedListings = await iterator.ReadNextAsync();
                _logger.LogInformation($"Retrieved Listing. Operation consumed {matchedListings.RequestCharge} RUs");
                _requestSizeSummary.Observe(matchedListings.RequestCharge);

                return matchedListings.SingleOrDefault();
            }
            catch (Exception ex)
            {
                throw new CosmosRetrieveListingException($"CosmosDB error when trying to get Listing: {ex}");
            }
        }

        public async Task<Listing> UpdateListing(Listing listing)
        {
            try
            {
                var response = await _container.ReplaceItemAsync<Listing>(listing, listing.Id, new PartitionKey(listing.PartitionKey),
                  new ItemRequestOptions { IfMatchEtag = listing.ETag });

                _logger.LogInformation($"Updated Listing. Operation consumed {response.RequestCharge} RUs");
                _requestSizeSummary.Observe(response.RequestCharge);

                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new CosmosUpdateListingException($"CosmosDB error when trying to update Listing: {ex}");
            }
        }
    }
}
