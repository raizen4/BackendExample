using System.Threading.Tasks;
using ListingApi.Helpers;
using ListingApi.Interfaces.DataAccess;
using ListingApi.Interfaces.Helpers;
using ListingApi.Models.Domain;
using ListingApi.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ListingApi.Controllers
{
    [Authorize]
    [Route("ingest-listings")]
    [ApiController]
    public class IngestListingsController : ControllerBase
    {
        private readonly IListingStore _cosmosListingStore;
        private readonly IAgentPropertyHelper _agentPropertyHelper;
        private readonly Mapper _mapper;

        public IngestListingsController(
            IListingStore cosmosListingStore,
            Mapper mapper,
            IAgentPropertyHelper agentPropertyHelper)
        {
            _cosmosListingStore = cosmosListingStore;
            _mapper = mapper;
            _agentPropertyHelper = agentPropertyHelper;
        }

        [HttpPost]
        public async Task<ActionResult> Post(ListingIngestRequest dto, [FromHeader(Name = "Synthetic")] bool synthetic)
        {
            var request = new ListingRequest
            {
                CompanyUri = dto.CompanyUri,
                ListingDetails = dto.ListingDetails,
                PropertyDetails = dto.PropertyDetails,
                Synthetic = synthetic
            };

            var propertyDetails = await _agentPropertyHelper.SyncAgentProperty(request);
            var listing = await _cosmosListingStore.CreateListing(_mapper.MapToListingActiveDbModel(request, propertyDetails));
            return Ok(new ListingSaveResponse { ListingUri = listing.Id, Success = true });
        }
    }
}
