using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using ListingApi.CustomExceptions;
using ListingApi.Helpers;
using ListingApi.Interfaces.Clients;
using ListingApi.Interfaces.Helpers;
using ListingApi.Models;
using ListingApi.Models.Domain;
using ListingApi.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Polly;
using ListingApi.Services;
using ListingApi.Interfaces.DataAccess;

namespace ListingApi.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ListingsController : ControllerBase
    {
        private readonly IListingStore _cosmosListingStore;
        private readonly IAuditListingStore _cosmosAuditListingStore;
        private readonly ILogger<ListingsController> _logger;
        private readonly IAgentPropertyClient _agentPropertyClient;
        private readonly Mapper _mapper;
        private readonly IAgentPropertyHelper _agentPropertyHelper;
        private readonly IListingSyncHelper _listingSyncHelper;
        private readonly IListingHelperService _listingHelperService;

        public ListingsController(
            IListingStore cosmosListingStore,
            IAuditListingStore cosmosAuditListingStore,
            IListingHelperService listingHelperService,
            ILogger<ListingsController> logger,
            IAgentPropertyClient agentPropertyClient,
            Mapper mapper,
            IAgentPropertyHelper agentPropertyHelper,
            IListingSyncHelper listingSyncHelper)
        {
            _listingHelperService = listingHelperService;
            _cosmosAuditListingStore = cosmosAuditListingStore;
            _cosmosListingStore = cosmosListingStore;
            _logger = logger;
            _agentPropertyClient = agentPropertyClient;
            _mapper = mapper;
            _agentPropertyHelper = agentPropertyHelper;
            _listingSyncHelper = listingSyncHelper;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ListingLookupResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status502BadGateway)]
        public async Task<ActionResult<ListingLookupResponse>> Get([FromRoute] string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest();
                }

                _logger.LogDebug($"Get Listing request received for {id}");
                var listing = await _cosmosListingStore.GetListing(id);

                if (listing == null)
                {
                    return NotFound($"Listing does not exist for id: {id}");
                }

                var property = await _agentPropertyClient.GetProperty(listing.AgentPropertyUri);
                var response = _mapper.MapToListingLookupResponse(property, listing);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unable to get Listing");

                return StatusCode(StatusCodes.Status502BadGateway, "Internal error in the GET ListingsController");
            }
        }

        [HttpGet("{id}/audits/{eventType}")]
        [ProducesResponseType(typeof(ListingLookupResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status502BadGateway)]
        public async Task<ActionResult<ListingLookupResponse>> GetLastAuditEventForListing([FromRoute, Required] string id, [FromRoute, Required] AuditEventType eventType)
        {
            try
            {
                _logger.LogDebug($"Get Listing request received for {id}");
                var eventForListing = await _cosmosAuditListingStore.GetLastEventForListing(id, eventType);

                if (eventForListing == null)
                {
                    return NotFound($"Listing does not exist for id: {id}");
                }

                return Ok(eventForListing);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unable to get last listing event");

                return StatusCode(StatusCodes.Status502BadGateway, "Internal error in the GetLastAuditEventForListing");
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ListingSaveResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status502BadGateway)]
        public async Task<ActionResult<ListingSaveResponse>> Post([FromBody] ListingSaveRequest dto, [FromHeader(Name = "Synthetic")] bool synthetic)
        {
            try
            {
                var request = new ListingRequest
                {
                    CompanyUri = dto.CompanyUri,
                    ListingDetails = dto.ListingDetails,
                    ListingUri = dto.ListingUri,
                    PropertyDetails = dto.PropertyDetails,
                    Synthetic = synthetic
                };

                var propertyDetails = await _agentPropertyHelper.SyncAgentProperty(request);
                var listing = await _cosmosListingStore.CreateListing(_mapper.MapToListingDbModel(request, propertyDetails));

                return Ok(_mapper.MapToListingSaveResponse(listing));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unable to create Listing");

                return StatusCode(StatusCodes.Status502BadGateway, "Internal error in the POST ListingsController");
            }
        }

        [HttpPut]
        [ProducesResponseType(typeof(ListingSaveResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status502BadGateway)]
        public async Task<ActionResult<ListingSaveResponse>> Put([FromBody] ListingSaveRequest dto, [FromHeader(Name = "Synthetic")] bool synthetic)
        {
            try
            {
                var request = new ListingRequest
                {
                    CompanyUri = dto.CompanyUri,
                    ListingDetails = dto.ListingDetails,
                    ListingUri = dto.ListingUri,
                    PropertyDetails = dto.PropertyDetails,
                    Synthetic = synthetic
                };

                var propertyDetails = await _agentPropertyHelper.SyncAgentProperty(request);
                var mergedListing = await _listingSyncHelper.MergeModel(_mapper.MapToListingDbModel(request, propertyDetails));
                var listing = await _cosmosListingStore.UpdateListing(mergedListing);

                return Ok(_mapper.MapToListingSaveResponse(listing));
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                _logger.LogError(ex, "Unable to find Listing");

                return NotFound();
            }
            catch (InvalidSyntheticException ex)
            {
                _logger.LogError(ex, "Invalid synthetic data when updating record");

                return BadRequest();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unable to update Listing");

                return StatusCode(StatusCodes.Status502BadGateway, "Internal error in the PUT ListingsController");
            }
        }

        [HttpPatch]
        [Route("{id}/images/add")]
        [ProducesResponseType(typeof(UpdateImageResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status502BadGateway)]
        public async Task<ActionResult<UpdateImageResponse>> PatchImagesAdd([FromRoute] string id, [FromBody, Required]  Image image,
            [FromHeader(Name = "Synthetic")] bool synthetic)
        {
            try
            {
                return await Policy
                    .Handle<CosmosUpdateListingException>()
                    .Or<CosmosException>()
                    .RetryAsync(Constants.NumberOfRetries)
                    .ExecuteAsync(async () =>
                    {
                        var foundListing = await _cosmosListingStore.GetListing(id);

                        var updatedModel = UpdateImagesService.PatchImagesAdd(foundListing, image);

                        var submittedResponse = await _cosmosListingStore.UpdateListing(updatedModel);

                        return Ok(_mapper.MapToUpdateImageResponse(submittedResponse.Draft.Images));
                    });
            }
            catch (InvalidSyntheticException ex)
            {
                _logger.LogError(ex, "Invalid synthetic data when updating record");

                return BadRequest();
            }
            catch (CosmosUpdateListingException ex)
            {
                _logger.LogError(ex, "Unable to update images for listing: " + id);

                return StatusCode(StatusCodes.Status502BadGateway, "Internal server error ");
            }
            catch (CosmosException ex)
            {
                _logger.LogError(ex, "Unable to update images for listing: " + id);

                return NotFound();
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "Listing not found " + id);
                return NotFound();
            }
        }

        [HttpPatch]
        [Route("{id}/restore")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status502BadGateway)]
        public async Task<ActionResult<UpdateImageResponse>> RestoreListing([FromRoute, Required] string id,[FromHeader(Name = "Synthetic")] bool synthetic)
        {
            return await ListingOperations(AuditEventType.Restored, id);

        }

        [HttpDelete]
        [Route("{id}/delete")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status502BadGateway)]
        public async Task<ActionResult<UpdateImageResponse>> DeleteListing([FromRoute, Required] string id,[FromHeader(Name = "Synthetic")] bool synthetic)
        {
            return await ListingOperations(AuditEventType.Deleted, id);
        }

        private async Task<ActionResult> ListingOperations(AuditEventType eventType, string listingId)
        {
            try
            {
                var foundListing = await _cosmosListingStore.GetListing(listingId);

                var policyResult = await Policy
                    .Handle<CosmosException>()
                    .Or<CosmosCreateAuditEventException>()
                    .Or<CosmosUpdateListingException>()
                    .RetryAsync(Constants.NumberOfRetries, (exception, count) =>
                    {
                        _logger.LogError(exception, "Exception occured in DeleteListing endpoint");
                    })
                    .ExecuteAndCaptureAsync(async () => await _listingHelperService.RestoreOrDeleteListing(eventType, foundListing));


                if (policyResult.FinalException != null)
                {
                    foundListing.Deleted = eventType != AuditEventType.Deleted;
                    await _cosmosListingStore.UpdateListing(foundListing);

                    return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error ");

                }
                return Ok();
            }
            catch (InvalidSyntheticException ex)
            {
                _logger.LogError(ex, "Invalid synthetic data on DeleteListingEndpoint");

                return BadRequest();
            }
            catch (CosmosRetrieveListingException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error ");
            }
            catch (CosmosUpdateListingException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error ");
            }
        }
        [HttpPatch]
        [Route("{id}/images/remove")]
        [ProducesResponseType(typeof(UpdateImageResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status502BadGateway)]
        public async Task<ActionResult<UpdateImageResponse>> PatchImagesRemove([FromRoute] string id, [FromBody, Required]  IList<string> imageIds,
            [FromHeader(Name = "Synthetic")] bool synthetic)
        {
            try
            {
                return await Policy
                    .Handle<CosmosUpdateListingException>()
                    .Or<CosmosException>()
                    .RetryAsync(Constants.NumberOfRetries)
                    .ExecuteAsync(async () =>
                    {
                        var foundListing = await _cosmosListingStore.GetListing(id);

                        var updatedModel = UpdateImagesService.RemoveImagesFromListing(foundListing, imageIds);

                        var submittedResponse = await _cosmosListingStore.UpdateListing(updatedModel);

                        return Ok(_mapper.MapToUpdateImageResponse(submittedResponse.Draft.Images));
                    });
            }
            catch (InvalidSyntheticException ex)
            {
                _logger.LogError(ex, "Invalid synthetic data when updating record");

                return BadRequest();
            }
            catch (CosmosUpdateListingException ex)
            {
                _logger.LogError(ex, "Unable to update images for listing: " + id);

                return StatusCode(StatusCodes.Status502BadGateway, "Internal server error ");
            }
            catch (CosmosException ex)
            {
                _logger.LogError(ex, "Unable to update images for listing: " + id);

                return NotFound();
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "Listing not found " + id);
                return NotFound();
            }
        }

        /// <summary>
        /// Lookups an details by agent property URI, creates an Listing in the cosmos and returns the listing and property details to the frontend
        /// </summary>
        /// <param name="agentPropertyUri">URI of an AgentProperty which has previously been created</param>
        [HttpGet]
        [Route("lookup")]
        [ProducesResponseType(typeof(ListingLookupResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status502BadGateway)]
        public async Task<ActionResult<ListingLookupResponse>> Lookup([FromQuery] string agentPropertyUri, [FromHeader(Name = "Synthetic")] bool synthetic)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity != null)
            {
                try
                {
                    var property = await _agentPropertyClient.GetProperty(agentPropertyUri);
                    var listing = await _cosmosListingStore.CreateListing(_mapper.MapLookupToListingDbModel(property, synthetic));
                    var response = _mapper.MapToListingLookupResponse(property, listing);

                    return Ok(response);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Unable to lookup Listing");

                    return StatusCode(StatusCodes.Status502BadGateway, $"Internal Error on ListingApi");
                }
            }
            return Unauthorized();
        }
    }
}
