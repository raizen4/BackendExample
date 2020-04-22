using ListingApi.Models.Domain;
using Moq;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ListingApi.UnitTests.Setup;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_updating_listing
{
    [Collection("UnitTests")]
    public class given_cosmos_db_failure : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_cosmos_db_failure(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            var dto = TestHelper.ValidListingDto;
            var requestContent = new StringContent(JsonSerializer.Serialize(dto), Encoding.UTF8, "application/json");

            var existingListing = TestHelper.ValidListingModel;

            _fixture.Clear();

            _fixture.Factory.MockedListingStoreAccess.WithErrorResponseOnAnyListingRequest();
            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, TestHelper.ValidAgentPropertyDto);
            _fixture.Factory.MockedListingStoreAccess.Setup(c => c.GetListing(It.IsAny<string>())).ReturnsAsync(existingListing);

            _response = await _fixture.Client.PutAsync("/listings", requestContent);
        }

        [Fact]
        public void then_the_response_code_should_indicate_bad_gateway()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.BadGateway);
        }

        [Fact]
        public void then_the_GetListing_method_should_have_been_called_once()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mocks => mocks.GetListing(It.IsAny<string>()), Times.Once());
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
