using ListingApi.UnitTests;
using ListingApi.Models.Cosmos;
using ListingApi.Models.Dto;
using Moq;
using Newtonsoft.Json;
using Shouldly;
using FluentAssertions;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text;
using ListingApi.UnitTests.Setup;
using Xunit;
using System.Linq;

namespace when_ingesting_listing
{
    [Collection("UnitTests")]
    public class given_a_valid_request : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;
        private Listing _listingSaved;
        private ListingSaveResponse _listingSavedResponse;
        private ListingIngestRequest _listingRequest;

        public given_a_valid_request(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        public async Task InitializeAsync()
        {
            _fixture.Clear();

            _listingRequest = TestHelper.ValidIngestListingDto;
            var response = TestHelper.ValidListingModel;
            var requestContent = new StringContent(JsonConvert.SerializeObject(_listingRequest), Encoding.UTF8, "application/json");

            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.CreateListing(It.IsAny<Listing>())).ReturnsAsync(response).Callback<Listing>(
                Listing => { _listingSaved = Listing; });

            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, TestHelper.ValidAgentPropertyDto);

            _response = await _fixture.Client.PostAsync($"/Ingest-listings", requestContent);
            var responseCont = await _response.Content.ReadAsStringAsync();

            _listingSavedResponse = JsonConvert.DeserializeObject<ListingSaveResponse>(responseCont);
        }

        [Fact]
        public void then_response_indicates_success()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.OK);
        }

        [Fact]
        public void then_listing_is_saved()
        {
            _listingSaved.ShouldNotBeNull();
        }

        [Fact]
        public void then_listing_is_saved_as_active()
        {
            _listingSaved.Active.ShouldNotBeNull();
        }

        [Fact]
        public void then_the_agent_property_is_synced()
        {
            _fixture.Factory.DelegatingTestHandler.Requests.FirstOrDefault().RequestUri.ToString().ShouldBe("https://localhost:3000/agent-properties/123");
        }

        [Fact]
        public void then_the_listing_id_is_returned()
        {
            _listingSavedResponse.ListingUri.ShouldNotBeNull();
        }

        [Fact]
        public void then_agentpropertyuri_is_mapped_correctly()
        {
            _listingSaved.CompanyUri.ShouldBe(_listingRequest.CompanyUri);
        }

        [Fact]
        public void then_companyuri_is_mapped_correctly()
        {
            _listingSaved.CompanyUri.ShouldBe(_listingRequest.CompanyUri);
        }

        [Fact]
        public void then_listing_details_are_mapped_to_the_active_listing()
        {
            _listingSaved.Active.Should().BeEquivalentTo(_listingRequest.ListingDetails);
        }

        [Fact]
        public void then_saved_listing_id_is_not_null()
        {
            _listingSaved.Id.ShouldNotBeNull();
        }

        [Fact]
        public void then_saved_listing_companyUri_is_mapped()
        {
            _listingSaved.CompanyUri.ShouldBe(_listingRequest.CompanyUri);
        }

        [Fact]
        public void then_saved_listing_agent_property_uri_is_mapped()
        {
            _listingSaved.AgentPropertyUri.ShouldBe(_listingRequest.PropertyDetails.Uri);
        }

        [Fact]
        public void then_saved_listing_created_time_is_not_null()
        {
            _listingSaved.CreatedTime.ShouldNotBeNull();
        }

        [Fact]
        public void then_saved_listing_updated_time_is_not_null()
        {
            _listingSaved.UpdatedTime.ShouldNotBeNull();
        }
    }
}
