using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ListingApi.CustomExceptions;
using ListingApi.Models;
using ListingApi.Models.Cosmos;
using ListingApi.UnitTests.Setup;
using Moq;
using Shouldly;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_adding_new_images_for_listing
{
    [Collection("UnitTests")]
    public class given_the_image_is_valid_but_there_is_a_db_error_or_a_race_condition : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_the_image_is_valid_but_there_is_a_db_error_or_a_race_condition(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        public async Task InitializeAsync()
        {
            var initialListing = TestHelper.ValidListingModel;

            var validImage = ImageTestHelper.ValidImage;

            var requestContent =
                new StringContent(
                    JsonSerializer.Serialize(validImage), Encoding.UTF8,
                    "application/json");

            _fixture.Clear();

            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.GetListing(It.IsAny<string>()))
                .ReturnsAsync(initialListing);

            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.UpdateListing(It.IsAny<Listing>()))
                .ThrowsAsync(new CosmosUpdateListingException("Failed"));
            _response = await _fixture.Client.PatchAsync("listings/3123214234312/images/add", requestContent);
        }

        [Fact]
        public void then_the_response_should_be_bad_gateway()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.BadGateway);
        }

        [Fact]
        public void then_the_UpdateImagesForListing_should_have_been_called_once()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mocks => mocks.UpdateListing(It.IsAny<Listing>()),
                Times.Exactly(4));
        }
    }
}