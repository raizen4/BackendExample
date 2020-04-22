using ListingApi.Models.Cosmos;
using Moq;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ListingApi.UnitTests.Setup;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_creating_listing
{
    [Collection("UnitTests")]

    public class given_advert_dto_missing_required_fields : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_advert_dto_missing_required_fields(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            var dto = TestHelper.InvalidListingDto;
            var requestContent = new StringContent(JsonSerializer.Serialize(dto), Encoding.UTF8, "application/json");

            _fixture.Clear();
            _response = await _fixture.Client.PostAsync("/listings", requestContent);
        }

        [Fact]
        public void then_the_response_code_should_indicate_bad_request()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        }

        [Fact]
        public void then_the_CreateListing_method_should_not_have_been_called_once()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mocks => mocks.CreateListing(It.IsAny<Listing>()), Times.Never());
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
