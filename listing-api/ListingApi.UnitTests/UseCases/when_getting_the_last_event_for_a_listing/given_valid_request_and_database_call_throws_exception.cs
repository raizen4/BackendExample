using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.CustomExceptions;
using ListingApi.Interfaces.DataAccess;
using Moq;
using Shouldly;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_getting_the_last_event_for_a_listing
{
    [Collection("UnitTests")]
    public class given_valid_request_and_database_throws_exception : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_valid_request_and_database_throws_exception(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            _fixture.Clear();

            _fixture.Factory.MockedAuditListingStoreAccess.Setup(service =>
                service.GetLastEventForListing(It.IsAny<string>(), It.IsAny<AuditEventType>())).ThrowsAsync(new CosmosRetrieveAuditEventException("Couldn't retreive event"));

            _response = await _fixture.Client.GetAsync(TestHelper.ValidListingUri);
        }

        [Fact]
        public void then_the_response_code_should_be_502_InternalServerError() => _response.StatusCode.ShouldBe(HttpStatusCode.BadGateway);

        public Task DisposeAsync() => Task.CompletedTask;
    }
}