using ListingApi.Models.Cosmos;
using ListingApi.Models.Dto;
using ListingApi.UnitTests;
using ListingApi.UnitTests.Setup;
using Moq;
using Newtonsoft.Json;
using Shouldly;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace when_ingesting_listing
{
    [Collection("UnitTests")]
    public class given_a_valid_synthetic_request : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;
        private Listing _listingSaved;
        private ListingSaveResponse _listingSavedResponse;

        public given_a_valid_synthetic_request(TestHostFixture fixture)
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

            var dto = TestHelper.ValidIngestListingDto;
            var response = TestHelper.ValidListingModel;
            var requestContent = new StringContent(JsonConvert.SerializeObject(dto), Encoding.UTF8, "application/json");


            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.CreateListing(It.IsAny<Listing>())).ReturnsAsync(response).Callback<Listing>(
                Listing => { _listingSaved = Listing; });

            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, TestHelper.ValidAgentPropertyDto);

            requestContent.Headers.Add("Synthetic", "true");
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
        public void then_the_agent_property_is_synced_as_synthetic()
        {
            _fixture.Factory.DelegatingTestHandler.Requests.FirstOrDefault().Headers.ShouldContain(h => h.Key == "Synthetic" && h.Value.Single() == "true");
        }

        [Fact]
        public void then_the_listing_id_is_returned()
        {
            _listingSavedResponse.ListingUri.ShouldNotBeNull();
        }
        [Fact]
        public void then_the_cosmos_model_is_synthetic()
        {
            _listingSaved.Synthetic.ShouldBeTrue();
        }
    }
}
