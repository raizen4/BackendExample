using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using ListingApi.Models;
using ListingApi.Models.Cosmos;
using ListingApi.Models.Dto;
using ListingApi.UnitTests.Setup;
using Moq;
using Newtonsoft.Json;
using Shouldly;
using Xunit;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace ListingApi.UnitTests.UseCases.when_adding_new_images_for_listing
{
    [Collection("UnitTests")]
    public class given_the_image_is_valid : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        private List<Image> expectedImages;

        public given_the_image_is_valid(TestHostFixture fixture)
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
            
            expectedImages = new List<Image>(){validImage};

            var requestContent =
                new StringContent(
                    JsonSerializer.Serialize(validImage), Encoding.UTF8,
                    "application/json");

            _fixture.Clear();

            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.GetListing(It.IsAny<string>()))
                .ReturnsAsync(initialListing);

            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.UpdateListing(It.IsAny<Listing>()))
                .ReturnsAsync((Listing l) => l);

            _response = await _fixture.Client.PatchAsync("listings/3123214234312/images/add", requestContent);
        }

        [Fact]
        public void then_the_response_should_be_successful()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.OK);
        }

        [Fact]
        public void then_the_UpdateImagesForListing_should_have_been_called_once()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mocks => mocks.UpdateListing(It.IsAny<Listing>()), Times.Once());
        }

        [Fact]
        public async Task then_the_expected_images_should_be_returned()
        {
            var body = await _response.Content.ReadAsStringAsync();
            var returnedImages = JsonConvert.DeserializeObject<UpdateImageResponse>(body);
            
            returnedImages.Images.Count.ShouldBe(expectedImages.Count);
            
            foreach(var returnedImage in returnedImages.Images)
            {
                returnedImages.Images.FirstOrDefault(image=>image.Uri == returnedImage.Uri).ShouldNotBeNull();
            }
        }
    }
}