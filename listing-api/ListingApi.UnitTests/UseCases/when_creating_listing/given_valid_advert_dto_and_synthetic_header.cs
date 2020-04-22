using System.Linq;
using ListingApi.Models.Cosmos;
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
    public class given_valid_advert_dto_and_synthetic_header : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_valid_advert_dto_and_synthetic_header(TestHostFixture fixture)
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

            requestContent.Headers.Add("Synthetic", "true");
            _response = await _fixture.Client.PostAsync("/listings", requestContent);
        }

        [Fact]
        public void then_the_synthetic_header_should_be_passed_to_the_agent_property_api()
        {
            var headers = _fixture.Factory.DelegatingTestHandler.Requests.Single().Headers;
            headers.ShouldContain(h => h.Key == "Synthetic" && h.Value.Single() == "true");
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
