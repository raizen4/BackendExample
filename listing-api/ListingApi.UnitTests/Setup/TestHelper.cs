using System;
using System.Collections.Generic;
using System.Linq;
using ListingApi.Models;
using ListingApi.Models.AgentProperty;
using ListingApi.Models.Cosmos;
using ListingApi.Models.Dto;
using ListingApi.Models.Integrations.AgentProperty;

namespace ListingApi.UnitTests.Setup
{
    public static class TestHelper
    {
        public static string ValidListingId => "d385e0c1-0303-4afd-b693-a033871bf194";
        public static string ValidListingUri => $"/listings/{ValidListingId}";
        public static string InvalidListingId => "092i3019i23091i2039";
        public static string ValidAgentPropertyUri => "/agent-properties/123";
        public static string ValidUprn => "abcd";
        public static ListingSaveRequest ValidListingDto => new ListingSaveRequest
        {
            ListingUri = ValidListingUri,
            PropertyDetails = ValidUpdateAgentPropertyRequest,
            ListingDetails = new ListingDetails
            {
                Descriptions = new Description
                {
                    Rooms = new List<DescriptionRoom> {
                            new DescriptionRoom{ Description ="Valid Advert Description" }
                        }
                }
            }
        };

        public static ListingIngestRequest ValidIngestListingDto => new ListingIngestRequest
        {
            PropertyDetails = ValidUpdateAgentPropertyRequest,
            CompanyUri = "CompanyUri",
            ListingDetails = new ListingDetails
            {
                Descriptions = new Description
                {
                    Rooms = new List<DescriptionRoom> {
                            new DescriptionRoom{ Description ="Valid Advert Description" }
                        }
                }
            }
        };

        public static ListingIngestRequest IngestListingDtoWithNoPropertyDetails => new ListingIngestRequest
        {
            ListingDetails = new ListingDetails
            {
                Descriptions = new Description
                {
                    Rooms = new List<DescriptionRoom> {
                            new DescriptionRoom{ Description ="Valid Advert Description" }
                        }
                }
            }
        };

        public static ListingSaveRequest WithFirstDescription(this ListingSaveRequest listingRequest, string description)
        {
            AddOrUpdateDescription(listingRequest.ListingDetails, description);
            return listingRequest;
        }

        public static ListingSaveRequest WithVideo(this ListingSaveRequest listingRequest, string video)
        {
            listingRequest.ListingDetails.Video = video;
            return listingRequest;
        }

        public static ListingSaveRequest WithSummary(this ListingSaveRequest listingRequest, string summary)
        {
            listingRequest.ListingDetails.Descriptions.Summary = summary;
            return listingRequest;
        }

        public static ListingSaveRequest WithRoom(this ListingSaveRequest listingRequest, string title, int displayOrder)
        {
            listingRequest.ListingDetails.Descriptions.Rooms.Add(new DescriptionRoom
            {
                Description = title,
                Title = title,
                Id = title,
                DisplayOrder = displayOrder,
                Measurements = new DescriptionMeasurements
                {
                    Width = 10,
                    Length = 10
                }
            });

            return listingRequest;
        }

        public static ListingSaveResponse ValidListingSaveResponse => new ListingSaveResponse
        {
            ListingUri = ValidListingUri,
            Success = true
        };

        public static AgentPropertyDto ValidUpdateAgentPropertyRequest => new AgentPropertyDto
        {
            Uri = ValidAgentPropertyUri,
            BedroomTotal = 4,
            PropertyActivityPeriodUri = "/properties/1234/activity-periods/123123",
            CompanyUri = "/companies/1234",
            MaxPrice = 300000,
            MinPrice = 295000,
            Address = ValidAddressDetails,
            PropertyStyle = "Office",
            PropertyType = "Other",
            CreatedDateTime = DateTime.Now,
            NewBuild = false
        };

        public static ListingLookupResponse ValidLookupResponse => new ListingLookupResponse
        {
            ListingDetails = new ListingDetails(),
            ListingUri = ValidListingUri,
            PropertyDetails = ValidAgentPropertyDto
        };

        public static PropertyAddressDetails ValidAddressDetails => new PropertyAddressDetails
        {
            Uprn = ValidUprn,
            BuildingNumber = "34",
            BuildingName = "Priory Halls of Residence",
            Street = "Oscar Street",
            City = "Rugby",
            PostalCode = "CV21 1AE",
            PropertyType = "3 bed terraced",
            ExternalId = "fdsffdsrewfvddsvfr324134r",
            ExternalSource = "Loqate"
        };

        public static AgentPropertyDto ValidAgentPropertyDto => new AgentPropertyDto
        {
            Uri = ValidAgentPropertyUri,
            Address = ValidAddressDetails
        };

        public static ListingLookupResponse WithDescription(this ListingLookupResponse lookup, string description)
        {
            if (lookup.ListingDetails == null)
            {
                lookup.ListingDetails = new ListingDetails();
            }
            AddOrUpdateDescription(lookup.ListingDetails, description);

            return lookup;
        }

        public static ListingLookupResponse WithEmptyPropertyDetails(this ListingLookupResponse lookupResponse)
        {
            lookupResponse.PropertyDetails = new AgentPropertyDto();
            return lookupResponse;
        }

        public static ListingSaveRequest InvalidListingDto => ValidListingDto.WithNullId();
        public static Listing ValidListingModel => GenerateEmptyAdvert().WithSetId(ValidListingId);
        public static Listing GenerateEmptyAdvert()
        {
            return new Listing
            {
                Id = Guid.NewGuid().ToString(),
                Draft = new ListingDetails() { Descriptions = new Description { Rooms = new List<DescriptionRoom>() }, Compliance = new ComplianceChecks(), FloorPlan = new Floorplan(),Images=new List<Image>() },
                Active = new ListingDetails() { Descriptions = new Description { Rooms = new List<DescriptionRoom>() }, Compliance = new ComplianceChecks(), FloorPlan = new Floorplan(),Images=new List<Image>() },
                ChangeList = new List<ListingChangeHistoryItem>(),
                CreatedTime = DateTime.UtcNow
            };
        }

        public static Listing WithNoActiveListing(this Listing listing)
        {
            listing.Active = null;
            return listing;
        }

        public static Listing WithSetId(this Listing advert, string id)
        {
            advert.Id = id;
            return advert;
        }

        public static Listing WithVideo(this Listing advert, string video)
        {
            advert.Draft.Video = video;
            return advert;
        }

        public static Listing WithDraftRoom(this Listing advert, string title, int displayOrder)
        {
            advert.Draft.Descriptions.Rooms.Add(new DescriptionRoom
            {
                Id = title,
                Title = title,
                Description = title,
                DisplayOrder = displayOrder,
                Measurements = new DescriptionMeasurements
                {
                    Width = 10,
                    Length = 10
                }
            });

            return advert;
        }

        public static Listing WithFloorplan(this Listing listing, string code, string imageUrl)
        {
            listing.Draft.FloorPlan.Code = code;
            listing.Draft.FloorPlan.Images = new List<Asset> { 
                new Asset
                {
                    Name = "floorplan1.jpeg",
                    FileSize = 1024,
                    FileType = "image/jpeg",
                    Uri = imageUrl
                } 
            };

            return listing;
        }

        public static Listing WithDraftSummary(this Listing advert, string summary)
        {
            advert.Draft.Descriptions.Summary = summary;
            return advert;
        }

        public static Listing WithSynthetic(this Listing advert, bool synthetic)
        {
            advert.Synthetic = synthetic;
            return advert;
        }

        public static Listing WithFirstDraftDescription(this Listing advert, string description)
        {
            if (advert.Draft == null)
            {
                advert.Draft = new ListingDetails();
            }
            AddOrUpdateDescription(advert.Draft, description);
            return advert;
        }

        public static Listing WithFirstActiveDescription(this Listing advert, string description)
        {
            if (advert.Active == null)
            {
                advert.Active = new ListingDetails();
            }
            AddOrUpdateDescription(advert.Active, description);

            return advert;
        }

        public static Listing WithNullsInTheDraftStringFields(this Listing advert)
        {
            advert.Draft.Compliance.LandRegistryDocsUri = null;
            advert.Draft.Tour = null;
            advert.Draft.Video = null;
            advert.Draft.FloorPlan.Code = null;
            advert.Draft.FloorPlan.Images = new List<Asset> {
                new Asset
                {
                    FileSize = 0,
                    FileType = "",
                    Uri = null,
                    Name = null
                } 
            };
            advert.Draft.AgencyKeysRef = null;
            advert.Draft.Descriptions.MeasurementUnit = null;
            advert.Draft.Descriptions.Summary = null;

            return advert;
        }

        public static void AddOrUpdateDescription(ListingDetails details, string description)
        {
            if (details.Descriptions == null)
            {
                details.Descriptions = new Description();
            }
            if (details.Descriptions.Rooms == null)
            {
                details.Descriptions.Rooms = new List<DescriptionRoom>();
            }
            if (details.Descriptions.Rooms.Count == 0)
            {
                details.Descriptions.Rooms.Add(new DescriptionRoom());
            }
            details.Descriptions.Rooms[0].Description = description;
        }

        public static ListingSaveRequest WithNullId(this ListingSaveRequest advertRequest)
        {
            advertRequest.ListingUri = null;
            return advertRequest;
        }

        public static ListingSaveRequest WithEmptyId(this ListingSaveRequest advertRequest)
        {
            advertRequest.ListingUri = "";
            return advertRequest;
        }
        public static ListingSaveRequest WithInvalidId(this ListingSaveRequest advertRequest)
        {
            advertRequest.ListingUri = InvalidListingId;
            return advertRequest;
        }

        public static ListingSaveRequest WithNullAgentPropertyId(this ListingSaveRequest advertRequest)
        {
            advertRequest.PropertyDetails.Uri = null;
            return advertRequest;
        }
        public static ListingSaveRequest WithEmptAgentPropertyId(this ListingSaveRequest advertRequest)
        {
            advertRequest.PropertyDetails.Uri = "";
            return advertRequest;
        }

        public static bool IsEmpty(this object obj)
        {
            if (obj == null)
            {
                return false;
            }
            return obj.GetType().GetProperties()
            .All(p =>
            {

                var val = p.GetValue(obj);

                if (val == null)
                {
                    return true;
                }
                if (val == GetDefault(val))
                {
                    return true;
                }
                if (val.GetType() == typeof(Int32))
                {
                    return (Int32)val == 0;
                }
                if (val.GetType() == typeof(string))
                {
                    return string.IsNullOrEmpty((string)val);
                }
                if (val.GetType() == typeof(DateTime))
                {
                    if ((DateTime)val == default(DateTime))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                if (val.GetType().GetProperties().Any(p => p.Name == "Count"))
                {
                    var prop = val.GetType().GetProperties().First(p => p.Name == "Count");
                    if ((int)prop.GetValue(val) == 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return val.IsEmpty();
                }
            });
        }

        public static T GetDefault<T>(T val)
        {
            return default(T);
        }
    }
}
