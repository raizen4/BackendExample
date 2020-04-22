using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ListingApi.Models;
using ListingApi.Models.Cosmos;
using Moq;
using Shouldly;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_adding_new_images_for_listing
{
    [Collection("UnitTests")]
    public class given_the_image_is_missing : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_the_image_is_missing(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        public async Task InitializeAsync()
        {
            var requestContent = new StringContent(JsonSerializer.Serialize<Image>(null), Encoding.UTF8,
                "application/json");

            _fixture.Clear();

            _response = await _fixture.Client.PatchAsync("listings/3123214234312/images/add", requestContent);
        }

        [Fact]
        public void then_the_response_should_be_bad_request()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        }

        [Fact]
        public void then_the_UpdateImagesForListing_should_not_have_been_called()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mocks => mocks.UpdateListing(It.IsAny<Listing>()), Times.Never());
        }
    }
}