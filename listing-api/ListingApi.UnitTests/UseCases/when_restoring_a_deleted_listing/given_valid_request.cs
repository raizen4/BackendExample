using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.Models.Cosmos;
using ListingApi.UnitTests.UseCases.when_soft_deleting_listing;
using Moq;
using Shouldly;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_restoring_a_deleted_listing {
    
    [Collection("UnitTests")]
    public class given_valid_request : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;
        private Listing requestedListingUpdate;
        
        public given_valid_request(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            _fixture.Clear();
            
            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.GetListing(It.IsAny<string>()))
                .ReturnsAsync(TestHelperRestoreListing.ValidReturnedListing);
            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.UpdateListing(It.IsAny<Listing>()))
                .Callback((Listing advert) => { requestedListingUpdate = advert; })
                .ReturnsAsync(TestHelperRestoreListing.ValidReturnedListing.WithUpdatedSoftValue);
            _fixture.Factory.MockedAuditListingStoreAccess.Setup(service => service.AddEvent(It.IsAny<AuditEvent>()))
                .Verifiable();
            
            _response = await _fixture.Client.PatchAsync(($"listings/{TestHelperSoftDelete.ValidListingId}/restore"), null);
        }

        [Fact]
        public void then_the_response_status_should_be_OK()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.OK);
        }
        
        [Fact]
        public void then_the_Deleted_value_on_listing_should_be_true()
        {
            requestedListingUpdate.Deleted.ShouldBeFalse();
        }
        
        [Fact]
        public void then_the_UpdateListing_should_have_been_called_just_once()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(service => service.UpdateListing(It.IsAny<Listing>()),Times.Once());
        }
        
          
        [Fact]
        public void then_the_CreateAuditEvent_should_have_been_called_just_once()
        {
            _fixture.Factory.MockedAuditListingStoreAccess.Verify(service => service.AddEvent(It.IsAny<AuditEvent>()),Times.Once());
        }

        
        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}