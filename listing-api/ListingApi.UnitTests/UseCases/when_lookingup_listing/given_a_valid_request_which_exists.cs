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

namespace when_lookingup_listing
{
    [Collection("UnitTests")]
    public class given_a_valid_request_which_exists : IAsyncLifetime
    {

        private readonly TestHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_a_valid_request_which_exists(TestHostFixture fixture)
        {
            _fixture = fixture;
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        public async Task InitializeAsync()
        {
            _fixture.Clear();
            _fixture.Factory.MockedListingStoreAccess.Setup(service => service.CreateListing(It.IsAny<Listing>()))
                .ReturnsAsync(TestHelper.ValidListingModel);
            
            _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, TestHelper.ValidAgentPropertyDto);

            _response = await _fixture.Client.GetAsync($"/listings/lookup?agentPropertyUri={TestHelper.ValidAgentPropertyUri}");
        }

        [Fact]
        public void then_the_response_code_should_indicate_success()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.OK);
        }

        [Fact]
        public async Task then_the_response_body_should_look_like_listing_response()
        {
            var json = await _response.Content.ReadAsStringAsync();
            var advert = JsonConvert.DeserializeObject<ListingLookupResponse>(json);
            advert.ShouldBeOfType(typeof(ListingLookupResponse));
        }

        [Fact]
        public async Task then_the_body_should_contain_filled_property_details()
        {
            var json = await _response.Content.ReadAsStringAsync();
            var advert = JsonConvert.DeserializeObject<ListingLookupResponse>(json);
            advert.PropertyDetails.Address.ShouldNotBeNull();
            advert.PropertyDetails.Address.Uprn.ShouldNotBeNullOrWhiteSpace();
        }
        
        [Fact]
        public async Task then_the_body_should_contain_empty_advert_details()
        {
            var json = await _response.Content.ReadAsStringAsync();
            var responseObject = JsonConvert.DeserializeObject<ListingLookupResponse>(json);
            responseObject.ListingDetails.IsEmpty().ShouldBeTrue();
        }
    }
}
