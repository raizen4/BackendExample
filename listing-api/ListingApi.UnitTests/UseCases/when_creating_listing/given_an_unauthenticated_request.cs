
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
    [Collection("FailAuthTest")]
    public class given_an_unauthenticated_request : IAsyncLifetime
    {
        private readonly FailAuthHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_an_unauthenticated_request(FailAuthHostFixture fixture)
        {
            _fixture = fixture;

        }

        public async Task InitializeAsync()
        {

            var advertDto = TestHelper.ValidListingDto;
            var requestContent = new StringContent(JsonConvert.SerializeObject(advertDto), Encoding.UTF8, "application/json");

            _response = await _fixture.Client.PostAsync("/listings", requestContent);
        }


        [Fact]
        public void then_the_response_code_should_indicate_unauthenticated()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
