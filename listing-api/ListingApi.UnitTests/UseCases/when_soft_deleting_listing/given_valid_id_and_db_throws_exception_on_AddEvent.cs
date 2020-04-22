using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.CustomExceptions;
using ListingApi.Models.Cosmos;
using Moq;
using Shouldly;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_soft_deleting_listing
{
    [Collection("UnitTests")]
    public class given_valid_id_and_db_throws_exception_on_AddEvent : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;
        private bool deletedStatus;
        
        public given_valid_id_and_db_throws_exception_on_AddEvent(TestHostFixture fixture)
        {
            _fixture = fixture;
           
        }

        public async Task InitializeAsync()
        {
            _fixture.Clear();
            
            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.GetListing(It.IsAny<string>()))
                .ReturnsAsync(TestHelperSoftDelete.ValidReturnedListing);
            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.UpdateListing(It.IsAny<Listing>()))
                .Callback((Listing advert) => { deletedStatus = advert.Deleted; })                
                .ReturnsAsync(TestHelperSoftDelete.ValidReturnedListing.WithUpdatedSoftValue());
            _fixture.Factory.MockedAuditListingStoreAccess.Setup(service => service.AddEvent(It.IsAny<AuditEvent>()))
                .ThrowsAsync(new CosmosCreateAuditEventException("Audit exception"));
            _response = await _fixture.Client.DeleteAsync(($"listings/{TestHelperSoftDelete.ValidListingId}/delete"));
        }

        [Fact]
        public void then_the_response_status_should_be_InternalServerError()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.InternalServerError);
        }
        
        [Fact]
        public void then_the_updated_listing_should_revert_Delete_field_to_false()
        {
            deletedStatus.ShouldBeFalse();
        }

        [Fact]
        public void then_the_updated_listing_should_have_been_called_5_times()
        {
            _fixture.Factory.MockedListingStoreAccess.Verify(mock => mock.UpdateListing(It.IsAny<Listing>()), Times.Exactly(5));
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}