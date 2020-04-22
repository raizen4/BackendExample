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
    public class given_valid_id_and_db_throws_exception_on_update : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;
        
        public given_valid_id_and_db_throws_exception_on_update(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            _fixture.Clear();
            
            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.GetListing(It.IsAny<string>()))
                .ReturnsAsync(TestHelperSoftDelete.ValidReturnedListing);
            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.UpdateListing(It.IsAny<Listing>()))
                .Throws(new CosmosUpdateListingException("Exception"));
    
            _response = await _fixture.Client.DeleteAsync(($"listings/{TestHelperSoftDelete.ValidListingId}/delete"));
        }

        [Fact]
        public void then_the_response_status_should_be_InternalServerError()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.InternalServerError);
        }
        
        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}