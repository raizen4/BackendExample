using Moq;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.UnitTests.Setup;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_retrieving_listing
{
    [Collection("UnitTests")]
    public class given_invalid_listing_id : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_invalid_listing_id(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            _fixture.Clear();

            _fixture.Factory.MockedListingStoreAccess.WithErrorResponseOnAnyListingRequest();

            _response = await _fixture.Client.GetAsync($"/listings/{TestHelper.InvalidListingId}");
        }

        [Fact]
        public void then_the_response_code_should_indicate_bad_gateway()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.BadGateway);
        }

        [Fact]
        public void then_the_GetAdvert_method_should_have_been_called_once()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mocks => mocks.GetListing(It.IsAny<string>()), Times.Once());
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
