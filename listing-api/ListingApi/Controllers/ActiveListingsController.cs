using System;
using System.Threading.Tasks;
using ListingApi.Helpers;
using ListingApi.Interfaces.Clients;
using ListingApi.Interfaces.DataAccess;
using ListingApi.Models.AgentProperty;
using ListingApi.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ListingApi.Controllers
{
    [Route("active-listings")]
    [ApiController]
    public class ActiveListingsController : ControllerBase
    {
        private readonly IListingStore _listingStore;
        private readonly IAgentPropertyClient _agentPropertyStore;
        private readonly ILogger<ActiveListingsController> _logger;

        public ActiveListingsController(IListingStore listingStore, IAgentPropertyClient agentPropertyStore, ILogger<ActiveListingsController> logger)
        {
            _listingStore = listingStore;
            _agentPropertyStore = agentPropertyStore;
            _logger = logger;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ListingLookupResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status502BadGateway)]
        public async Task<ActionResult<ListingLookupResponse>> Get([FromRoute] string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            var listing = await _listingStore.GetListing(id);

            if (listing?.Active == null)
            {
                return NotFound();
            }

            AgentPropertyDto property;

            try
            {
                property = await _agentPropertyStore.GetProperty(listing.AgentPropertyUri);
            }
            catch (Exception ex)
            {
                var message = $"Error getting agent property for listingId: {id}";
                _logger.LogError(ex, message);
                return StatusCode(StatusCodes.Status502BadGateway, message);
            }
            
            return Ok(PublicListingResponseMapper.MapToListingLookupResponse(listing.Active, property));
        }
    }
}
