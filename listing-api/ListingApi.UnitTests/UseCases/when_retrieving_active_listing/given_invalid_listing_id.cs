using Moq;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.UnitTests;
using ListingApi.UnitTests.Setup;
using Xunit;

namespace when_retrieving_active_listing
{
    [Collection("UnitTests")]
    public class given_invalid_listing_id : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;
        private bool _databaseCalled;

        public given_invalid_listing_id(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            _fixture.Clear();

            _fixture.Factory.MockedListingStoreAccess.Setup(x => x.GetListing(It.IsAny<string>()))
                .Callback<string>(dbIdRequest => { _databaseCalled = !string.IsNullOrWhiteSpace(dbIdRequest); });

            _response = await _fixture.Client.GetAsync($"/active-listings/{TestHelper.InvalidListingId}");
        }

        [Fact]
        public void then_the_response_code_should_indicate_no_listing_exists() => _response.StatusCode.ShouldBe(HttpStatusCode.NotFound);

        [Fact]
        public void then_the_listing_is_retrieved() => _databaseCalled.ShouldBeTrue();

        public Task DisposeAsync() => Task.CompletedTask;
    }
}
