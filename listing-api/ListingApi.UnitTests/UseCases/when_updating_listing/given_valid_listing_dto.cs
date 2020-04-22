using System.Linq;
using ListingApi.Models.Cosmos;
using ListingApi.Models.Dto;
using Moq;
using Newtonsoft.Json;
using Shouldly;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using ListingApi.Models.Domain;
using ListingApi.UnitTests.Setup;

namespace ListingApi.UnitTests.UseCases.when_updating_listing
{
    [Collection("UnitTests")]
    public class given_valid_listing_dto : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        private string activeDescription = "Active Description";
        private string draftDescription = "Draft Description";
        private string updatingDraftDescription = "Second Description";
        private string draftSummary = "Draft Summary";
        private string updatedSummary = "New Draft Summary";
        private string floorplanPath = "https://images.com/img/123456";
        private string floorplanCode = "123456";
        private string originalVideo = "http://audiotours.com/original";
        private string updatedVideo = "http://audiotours.com/newvideo";

        private Listing requestedListingUpdate;

        public given_valid_listing_dto(TestHostFixture fixture)
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
                .WithRoom("Bathroom", 3)
                .WithVideo(updatedVideo);
            
            var response = TestHelper.ValidListingModel;
            var existingAdvert = TestHelper.ValidListingModel
                .WithFirstActiveDescription(activeDescription)
                .WithFirstDraftDescription(draftDescription)
                .WithDraftSummary(draftSummary)
                .WithDraftRoom("Bedroom 1", 1)
                .WithDraftRoom("Bathroom", 2)
                .WithDraftRoom("Bedroom 2", 3)
                .WithFloorplan(floorplanCode, floorplanPath)
                .WithVideo(originalVideo);
            
            var requestContent = new StringContent(JsonConvert.SerializeObject(dto), Encoding.UTF8, "application/json");

            _fixture.Clear();

            _fixture.Factory.MockedListingStoreAccess.Setup(c => c.GetListing(It.IsAny<string>())).ReturnsAsync(existingAdvert);

            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.UpdateListing(It.IsAny<Listing>()))
                .Callback((Listing advert)=> { requestedListingUpdate = advert; })
                .ReturnsAsync(response);

            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, TestHelper.ValidAgentPropertyDto);

            _response = await _fixture.Client.PutAsync("/listings", requestContent);
        }

        [Fact]
        public void then_the_response_code_should_indicate_ok()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.OK);
        }

        [Fact]
        public void then_the_CreateListing_method_should_have_been_called_once()
        {
            requestedListingUpdate.ShouldNotBeNull();
            requestedListingUpdate.ShouldBeOfType(typeof(Listing));
        }

        [Fact]
        public async Task then_the_response_returns_advertAsync()
        {
            var json = await _response.Content.ReadAsStringAsync();
            var listing = JsonConvert.DeserializeObject<ListingSaveResponse>(json);
            listing.ListingUri.ShouldBe(TestHelper.ValidListingUri);
        }

        [Fact]
        public void then_the_update_should_include_existing_active_details()
        {
            requestedListingUpdate.ShouldNotBeNull();
            requestedListingUpdate?.Active?.Descriptions?.Rooms?[0]?.Description?.ShouldNotBeNull();
            requestedListingUpdate.Active.Descriptions.Rooms[0].Description.ShouldBe(activeDescription);
        }

        [Fact]
        public void then_the_update_should_include_new_draft_description()
        {
            requestedListingUpdate.ShouldNotBeNull();
            requestedListingUpdate?.Draft?.Descriptions?.Rooms?[0]?.Description?.ShouldNotBeNull();
            requestedListingUpdate.Draft.Descriptions.Rooms[0].Description.ShouldBe(updatingDraftDescription);
        }

        [Fact]
        public void then_the_update_should_include_new_draft_summary()
        {
            requestedListingUpdate.ShouldNotBeNull();
            requestedListingUpdate?.Draft?.Descriptions?.Summary?.ShouldNotBeNullOrWhiteSpace();
            requestedListingUpdate.Draft.Descriptions.Summary.ShouldBe(updatedSummary);
        }

        [Fact]
        public void then_the_update_should_include_new_room_display_order()
        {
            requestedListingUpdate.Draft.Descriptions.Rooms.Single(r => r.Title == "Bedroom 1").DisplayOrder.ShouldBe(1);
            requestedListingUpdate.Draft.Descriptions.Rooms.Single(r => r.Title == "Bedroom 2").DisplayOrder.ShouldBe(2);
            requestedListingUpdate.Draft.Descriptions.Rooms.Single(r => r.Title == "Bathroom").DisplayOrder.ShouldBe(3);
        }

        [Fact]
        public void then_the_update_should_include_new_floorplan()
        {
            requestedListingUpdate.ShouldNotBeNull();
            requestedListingUpdate?.Draft?.FloorPlan?.Code?.ShouldNotBeNullOrWhiteSpace();
            requestedListingUpdate?.Draft?.FloorPlan?.Images?.ShouldNotBeNull();
            requestedListingUpdate?.Draft?.FloorPlan?.Images.FirstOrDefault().Uri?.ShouldNotBeNullOrWhiteSpace();
            requestedListingUpdate?.Draft?.FloorPlan?.Code?.ShouldBe(floorplanCode);
            requestedListingUpdate?.Draft?.FloorPlan?.Images.FirstOrDefault().Uri?.ShouldBe(floorplanPath);
        }

        [Fact]
        public void then_the_update_should_include_the_new_video()
        {
            requestedListingUpdate.ShouldNotBeNull();
            requestedListingUpdate?.Draft?.Video.ShouldBe(updatedVideo);
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
