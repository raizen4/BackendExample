using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.Interfaces.DataAccess;
using ListingApi.Models.Cosmos;
using Moq;
using Newtonsoft.Json;
using Shouldly;
using Xunit;

namespace ListingApi.UnitTests.UseCases.when_getting_the_last_event_for_a_listing
{
    [Collection("UnitTests")]
    public class given_valid_request : IAsyncLifetime
    {
        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_valid_request(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task InitializeAsync()
        {
            _fixture.Clear();
            _fixture.Factory.MockedAuditListingStoreAccess.Setup(service => 
                service.GetLastEventForListing(It.IsAny<string>(), It.IsAny<AuditEventType>())).ReturnsAsync(TestHelper.eventRetrieved);
            
            _response = await _fixture.Client.GetAsync(TestHelper.ValidListingUri);
        }

        [Fact]
        public void then_the_response_code_should_success() => _response.StatusCode.ShouldBe(HttpStatusCode.OK);

        public Task DisposeAsync() => Task.CompletedTask;
        
        [Fact]
        public async void then_the_response_should_contain_the_Event()
        {
            var body = await _response.Content.ReadAsStringAsync();
            var returnedAuditEvent = JsonConvert.DeserializeObject<AuditEvent>(body);
            returnedAuditEvent.Id.ShouldNotBeNull();
        }
    }
}