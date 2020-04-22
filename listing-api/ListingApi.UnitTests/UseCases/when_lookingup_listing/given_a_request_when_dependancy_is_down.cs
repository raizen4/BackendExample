using ListingApi.UnitTests;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.UnitTests.Setup;
using Xunit;

namespace when_lookingup_listing
{
    [Collection("UnitTests")]
    public class given_a_request_when_dependancy_is_down : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_a_request_when_dependancy_is_down(TestHostFixture fixture)
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
            
            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.RequestTimeout);
            _response = await _fixture.Client.GetAsync($"/listings/lookup?agentPropertyUri={TestHelper.ValidUprn}");
        }

        [Fact]
        public void then_the_response_code_should_indicate_a_bad_gateway()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.BadGateway);
        }
    }
}
