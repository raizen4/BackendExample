using ListingApi.Models.AgentProperty;
using ListingApi.Models.Dto;
using ListingApi.UnitTests;
using Moq;
using Newtonsoft.Json;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.UnitTests.Setup;
using Xunit;
using System.Linq;

namespace when_retrieving_advert
{
    [Collection("UnitTests")]
    public class given_listing_with_null_fields : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;
        private ListingLookupResponse _advert;
        private string _json;

        public given_listing_with_null_fields(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            var listing = TestHelper.ValidListingModel.WithNullsInTheDraftStringFields();
            _fixture.Clear();
            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.GetListing(It.IsAny<string>()))
                .ReturnsAsync(listing);
            
            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, new AgentPropertyDto());

            _response = await _fixture.Client.GetAsync($"/listings/{listing.Id}");
            _json = await _response.Content.ReadAsStringAsync();
            _advert = JsonConvert.DeserializeObject<ListingLookupResponse>(_json);
        }

        [Fact]
        public void then_the_json_properties_should_be_camelcase()
        {
            _json.ShouldContain("propertyDetails", Case.Sensitive);
        }

        [Fact]
        public void then_the_response_code_should_indicate_ok()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.OK);
        }

        [Fact]
        public void then_the_land_registry_doc_uri_should_be_an_empty_string()
        {
            _advert.ListingDetails.Compliance.LandRegistryDocsUri.ShouldBe("");
        }

        [Fact]
        public void then_the_tour_should_be_an_empty_string()
        {
            _advert.ListingDetails.Tour.ShouldBe("");
        }

        [Fact]
        public void then_the_video_should_be_an_empty_string()
        {
            _advert.ListingDetails.Video.ShouldBe("");
        }

        [Fact]
        public void then_the_floor_plan_should_be_an_empty_string()
        {
            _advert.ListingDetails.FloorPlan.Code.ShouldBe("");
            _advert.ListingDetails.FloorPlan.Images.FirstOrDefault().Uri.ShouldBe("");
        }

        [Fact]
        public void then_the_price_qualifier_should_be_null()
        {
            _advert.ListingDetails.PriceQualifier.ShouldBeNull();
        }

        [Fact]
        public void then_the_agency_keys_ref_should_be_an_empty_string()
        {
            _advert.ListingDetails.AgencyKeysRef.ShouldBe("");
        }

        [Fact]
        public void then_the_description_measurements_should_be_an_empty_string()
        {
            _advert.ListingDetails.Descriptions.MeasurementUnit.ShouldBe("");
        }

        [Fact]
        public void then_the_description_summary_should_be_an_empty_string()
        {
            _advert.ListingDetails.Descriptions.Summary.ShouldBe("");
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
