using ListingApi.Models;
using ListingApi.Models.AgentProperty;
using ListingApi.Models.Cosmos;
using ListingApi.Models.Dto;
using ListingApi.UnitTests;
using Moq;
using Newtonsoft.Json;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.UnitTests.Setup;
using Xunit;

namespace when_retrieving_advert
{
    [Collection("UnitTests")]
    public class given_valid_listing_id : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        private readonly string draftDescription = "This is a draft";
        private readonly string activeDescription = "This is an active";
        public given_valid_listing_id(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            var response = TestHelper.ValidListingModel.WithFirstDraftDescription(draftDescription).WithFirstActiveDescription(activeDescription);

            _fixture.Clear();
            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.GetListing(It.IsAny<string>()))
                .ReturnsAsync(response);
            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, new AgentPropertyDto());

            _response = await _fixture.Client.GetAsync($"/listings/{TestHelper.ValidListingId}");
        }

        [Fact]
        public void then_the_response_code_should_indicate_ok()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.OK);
        }

        [Fact]
        public void then_the_GetAdvert_method_should_have_been_called_once()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mocks => mocks.GetListing(It.IsAny<string>()), Times.Once());
        }

        [Fact]
        public async Task then_the_response_returns_correct_model()
        {
            var json = await _response.Content.ReadAsStringAsync();
            var listing = JsonConvert.DeserializeObject<ListingLookupResponse>(json);
            listing.ShouldBeOfType(typeof(ListingLookupResponse));
            listing.PropertyDetails.ShouldNotBeNull();
            listing.ListingDetails.ShouldNotBeNull();
            listing.ListingUri.ShouldNotBeNull();
        }

        [Fact]
        public async Task then_the_response_returns_draft_description()
        {
            var json = await _response.Content.ReadAsStringAsync();
            var listing = JsonConvert.DeserializeObject<ListingLookupResponse>(json);
            listing.ListingDetails.Descriptions.Rooms[0].Description.ShouldBe(draftDescription);
        }

        [Fact]
        public async Task then_the_response_returns_default_room_display_order_as_zero()
        {
            var json = await _response.Content.ReadAsStringAsync();
            var listing = JsonConvert.DeserializeObject<ListingLookupResponse>(json);
            listing.ListingDetails.Descriptions.Rooms[0].DisplayOrder.ShouldBe(0);
        }

        [Fact]
        public async Task then_the_response_does_not_have_active_description()
        {
            var json = await _response.Content.ReadAsStringAsync();
            var listing = JsonConvert.DeserializeObject<ListingLookupResponse>(json);
            listing.ListingDetails.Descriptions.Rooms[0].Description.ShouldNotBe(activeDescription);
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
