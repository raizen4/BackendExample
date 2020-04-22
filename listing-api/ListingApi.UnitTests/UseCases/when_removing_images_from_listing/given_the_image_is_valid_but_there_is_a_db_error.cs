using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Moq;
using System.Text.Json;
using Xunit;
using ListingApi.Models.Cosmos;
using Shouldly;
using System;
using System.Collections.Generic;
using ListingApi.CustomExceptions;
using ListingApi.UnitTests;
using ListingApi.UnitTests.Setup;

namespace ListingApi.UnitTests.UseCases.when_removing_images_from_listing
{
    [Collection("UnitTests")]
    public class given_the_image_is_valid_but_there_is_a_db_error: IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_the_image_is_valid_but_there_is_a_db_error(TestHostFixture fixture)
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
            var validImageIds = new List<string> {"http://somePath/t423432/Bedroom2.png"};
            var requestContent =
                new StringContent(JsonSerializer.Serialize(validImageIds), Encoding.UTF8,
                    "application/json");

            _fixture.Clear();

            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.GetListing(It.IsAny<string>()))
                .ReturnsAsync(initialListing);

            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.UpdateListing(It.IsAny<Listing>()))
                .ThrowsAsync(new CosmosUpdateListingException("Failed"));
            _response = await _fixture.Client.PatchAsync("listings/3123214234312/images/remove", requestContent);
        }

        [Fact]
        public void then_the_response_should_be_Bad_Gateway()
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