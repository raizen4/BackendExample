using System.Linq;
using ListingApi.Models.Cosmos;
using ListingApi.Models.Domain;
using ListingApi.Models.Dto;
using Moq;
using Newtonsoft.Json;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using ListingApi.UnitTests.Setup;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_creating_listing
{
    [Collection("UnitTests")]
    public class given_valid_listing_dto : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_valid_listing_dto(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            var dto = TestHelper.ValidListingDto;
            var response = TestHelper.ValidListingModel;
            var requestContent = new StringContent(JsonConvert.SerializeObject(dto), Encoding.UTF8, "application/json");

            _fixture.Clear();

            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.CreateListing(It.IsAny<Listing>()))
                .ReturnsAsync(response);
            
            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, TestHelper.ValidAgentPropertyDto);

            _response = await _fixture.Client.PostAsync("/listings", requestContent);
        }

        [Fact]
        public void then_the_response_code_should_indicate_ok()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.OK);
        }

        [Fact]
        public void then_the_CreateAdvert_method_should_have_been_called_once()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mocks => mocks.CreateListing(It.IsAny<Listing>()), Times.Once());
        }

        [Fact]
        public async Task then_the_response_returns_listing()
        {
            var json = await _response.Content.ReadAsStringAsync();
            var advert = JsonConvert.DeserializeObject<ListingSaveResponse>(json);
            advert.ListingUri.ShouldBe(TestHelper.ValidListingUri);
        }

        [Fact]
        public void then_the_synthetic_header_should_not_be_passed_to_the_agent_property_api()
        {
            var headers = _fixture.Factory.DelegatingTestHandler.Requests.Single().Headers;
            headers.ShouldNotContain(h => h.Key == "Synthetic");
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
