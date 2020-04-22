using ListingApi.Models.Cosmos;
using ListingApi.Models.Domain;
using ListingApi.Models.Dto;
using Moq;
using Newtonsoft.Json;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using ListingApi.UnitTests.Setup;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_updating_listing
{
    [Collection("UnitTests")]
    public class given_synthetic_headers_do_not_match : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        private readonly string activeDescription = "Active Description";
        private readonly string draftDescription = "Draft Description";
        private readonly string updatingDraftDescription = "Second Description";
        private readonly string draftSummary = "Draft Summary";
        private readonly string updatedSummary = "New Draft Summary";

        private Listing requestedListingUpdate;

        public given_synthetic_headers_do_not_match(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            var dto = TestHelper.ValidListingDto
                .WithFirstDescription(updatingDraftDescription)
                .WithSummary(updatedSummary)
                .WithRoom("Bedroom 1", 1)
                .WithRoom("Bedroom 2", 2)
                .WithRoom("Bathroom", 3);

            var response = TestHelper.ValidListingModel;
            var existingAdvert = TestHelper.ValidListingModel
                .WithFirstActiveDescription(activeDescription)
                .WithFirstDraftDescription(draftDescription)
                .WithDraftSummary(draftSummary)
                .WithDraftRoom("Bedroom 1", 1)
                .WithDraftRoom("Bathroom", 2)
                .WithDraftRoom("Bedroom 2", 3)
                .WithSynthetic(false);

            var requestContent = new StringContent(JsonConvert.SerializeObject(dto), Encoding.UTF8, "application/json");
            requestContent.Headers.Add("Synthetic", "True");
            _fixture.Clear();

            _fixture.Factory.MockedListingStoreAccess.Setup(c => c.GetListing(It.IsAny<string>())).ReturnsAsync(existingAdvert);

            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.UpdateListing(It.IsAny<Listing>()))
                .Callback((Listing advert) => { requestedListingUpdate = advert; })
                .ReturnsAsync(response);

            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, TestHelper.ValidAgentPropertyDto);

            _response = await _fixture.Client.PutAsync("/listings", requestContent);
        }

        [Fact]
        public void then_the_response_code_should_indicate_bad_request()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        }

        [Fact]
        public void then_the_UpdateListing_method_should_never_have_been_called()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mocks => mocks.UpdateListing(It.IsAny<Listing>()), Times.Never());
        }
        
        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
