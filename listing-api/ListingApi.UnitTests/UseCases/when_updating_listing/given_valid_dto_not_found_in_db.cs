using ListingApi.Models.Cosmos;
using ListingApi.Models.Domain;
using Microsoft.Azure.Cosmos;
using Moq;
using Newtonsoft.Json;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using ListingApi.UnitTests.Setup;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_updating_listing
{
    [Collection("UnitTests")]
    public class given_valid_dto_not_found_in_db : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_valid_dto_not_found_in_db(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            var dto = TestHelper.ValidListingDto;
            var requestContent = new StringContent(JsonConvert.SerializeObject(dto), Encoding.UTF8, "application/json");

            _fixture.Clear();
            
            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, TestHelper.ValidAgentPropertyDto);
            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.UpdateListing(It.IsAny<Listing>()))
              .ThrowsAsync(new CosmosException(It.IsAny<string>(), HttpStatusCode.NotFound, It.IsAny<int>(), It.IsAny<string>(), It.IsAny<double>()));

            _response = await _fixture.Client.PutAsync("/listings", requestContent);
        }

        [Fact]
        public void then_the_response_code_should_indicate_not_found()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
        }

        [Fact]
        public void then_the_UpdateListing_method_should_have_been_called_once()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mocks => mocks.UpdateListing(It.IsAny<Listing>()), Times.Once());
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
