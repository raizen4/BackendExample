using System;
using System.Collections.Generic;
using ListingApi.Configuration;
using ListingApi.Models;
using ListingApi.Models.AgentProperty;
using ListingApi.Models.Cosmos;
using ListingApi.Models.Domain;
using ListingApi.Models.Dto;

namespace ListingApi.Helpers
{
    public class Mapper
    {
        const int uriDepth = 2;
        private readonly ListingApiConfiguration _config;

        public Mapper(ListingApiConfiguration config)
        {
            _config = config;
        }

        public Listing MapToListingDbModel(ListingRequest data, AgentPropertyDto property)
        {
            if (property == null)
            {
                throw new ArgumentNullException(nameof(property));
            }

            if (data == null)
            {
                throw new ArgumentNullException(nameof(data));
            }

            return new Listing
            {
                Id = ConvertListingUriToId(data.ListingUri) ?? Guid.NewGuid().ToString(),
                CompanyUri = data.CompanyUri,
                AgentPropertyUri = data.PropertyDetails.Uri,
                Draft = data.ListingDetails,
                Synthetic = data.Synthetic,
                TimeToLive = data.Synthetic ? _config.SythenticTimeToLive : _config.DefaultTimeToLive,
                CreatedTime = DateTime.UtcNow,
                UpdatedTime = DateTime.UtcNow,
                ChangeList = new List<ListingChangeHistoryItem>()
            };
        }

        public Listing MapToListingActiveDbModel(ListingRequest data, AgentPropertyDto property)
        {
            return new Listing
            {
                Id = Guid.NewGuid().ToString(),
                CompanyUri = data.CompanyUri,
                AgentPropertyUri = data.PropertyDetails.Uri,
                Active = data.ListingDetails,
                Synthetic = data.Synthetic,
                TimeToLive = data.Synthetic ? _config.SythenticTimeToLive : null,
                CreatedTime = DateTime.UtcNow,
                UpdatedTime = DateTime.UtcNow,
                ChangeList = new List<ListingChangeHistoryItem>()
            };
        }

        public Listing MapLookupToListingDbModel(AgentPropertyDto property, bool synthetic)
        {
            if (property == null)
            {
                throw new ArgumentNullException(nameof(property));
            }

            return new Listing
            {
                Id = Guid.NewGuid().ToString(),
                CompanyUri = property.CompanyUri,
                AgentPropertyUri = property.Uri,
                Draft = new ListingDetails
                {
                    Images = new List<Image>(),
                    Descriptions = new Description
                    {
                        Rooms = new List<DescriptionRoom>()
                    },
                    ViewingRules = new ViewingRules { },
                    Compliance = new ComplianceChecks { },
                    KeyFeatures = new List<KeyFeature>()
                },
                Synthetic = synthetic,
                TimeToLive = synthetic ? _config.SythenticTimeToLive : _config.DefaultTimeToLive,
                CreatedTime = DateTime.UtcNow,
                ChangeList = new List<ListingChangeHistoryItem>()

            };
        }

        public ListingSaveResponse MapToListingSaveResponse(Listing listing)
        {
            if (listing == null)
            {
                throw new ArgumentException(nameof(listing));
            }

            return new ListingSaveResponse
            {
                Success = true,
                ListingUri = ConvertListingIdToUri(listing.Id)
            };
        }

        public static string ConvertListingUriToId(string uri)
        {
            if (uri == null)
            {
                throw new ArgumentException(nameof(uri));
            }

            var uriParts = uri.Split('/');

            return uriParts.Length < uriDepth + 1 ? throw new InvalidOperationException($"not valid ListingUri: {uri}") : uriParts[uriDepth];
        }

        public static string ConvertListingIdToUri(string id)
        {
            return $"/listings/{id}";
        }

        public ListingLookupResponse MapToListingLookupResponse(AgentPropertyDto agentProperty, Listing model)
        {
            if (model == null)
            {
                throw new ArgumentNullException(nameof(model));
            }

            return new ListingLookupResponse
            {
                Deleted = model.Deleted,
                PropertyDetails = agentProperty,
                ListingDetails = model.Draft,
                ListingUri = ConvertListingIdToUri(model.Id)
            };
        }

        public UpdateImageResponse MapToUpdateImageResponse(IList<Image> updatedImages)
        {
            return new UpdateImageResponse
            {
                Images = updatedImages
            };
        }
    }
}
