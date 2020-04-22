using Shouldly;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.UnitTests;
using Xunit;

namespace when_retrieving_active_listing
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
            _response = await _fixture.Client.GetAsync($"/active-listings/");
        }

        [Fact]
        public void then_the_response_code_should_indicate_failure() => _response.StatusCode.ShouldBe(HttpStatusCode.NotFound);

        public Task DisposeAsync() => Task.CompletedTask;
    }
}
