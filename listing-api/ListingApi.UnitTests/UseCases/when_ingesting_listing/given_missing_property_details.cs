using ListingApi.Models.Cosmos;
using ListingApi.Models.Dto;
using ListingApi.UnitTests;
using ListingApi.UnitTests.Setup;
using Moq;
using Newtonsoft.Json;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace when_ingesting_listing
{
    [Collection("UnitTests")]
    public class given_missing_property_details : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;
        private Listing _listingSaved;
        private ListingSaveResponse _listingSavedResponse;

        public given_missing_property_details(TestHostFixture fixture)
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

            var dto = TestHelper.IngestListingDtoWithNoPropertyDetails;
            var response = TestHelper.ValidListingModel;
            var requestContent = new StringContent(JsonConvert.SerializeObject(dto), Encoding.UTF8, "application/json");

            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.CreateListing(It.IsAny<Listing>())).ReturnsAsync(response).Callback<Listing>(
                Listing => { _listingSaved = Listing; });

            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, TestHelper.ValidAgentPropertyDto);

            _response = await _fixture.Client.PostAsync($"/Ingest-listings", requestContent);
            var responseCont = await _response.Content.ReadAsStringAsync();

            _listingSavedResponse = JsonConvert.DeserializeObject<ListingSaveResponse>(responseCont);
        }

        [Fact]
        public void then_response_indicates_failure()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        }

        [Fact]
        public void then_listing_is_not_saved()
        {
            _listingSaved.ShouldBeNull();
        }

        [Fact]
        public void then_the_agent_property_is_not_synced()
        {
            _fixture.Factory.DelegatingTestHandler.Requests.ShouldBeEmpty();
        }
    }
}
