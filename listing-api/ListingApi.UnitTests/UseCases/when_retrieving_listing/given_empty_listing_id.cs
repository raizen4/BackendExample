using Moq;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_retrieving_listing
{
    [Collection("UnitTests")]
    public class given_empty_listing_id : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_empty_listing_id(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            _fixture.Clear();
            _response = await _fixture.Client.GetAsync($"/listings/");
        }

        [Fact]
        public void then_the_response_code_should_indicate_bad_request()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.MethodNotAllowed);
        }

        [Fact]
        public void then_the_GetListing_method_should_not_have_been_called_once()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mocks => mocks.GetListing(It.IsAny<string>()), Times.Never);
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
