using ListingApi.Models.AgentProperty;
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

namespace when_retrieving_active_listing
{
    namespace and_the_listing_is_active
    {
        [Collection("UnitTests")]
        public class given_valid_listing_id : IAsyncLifetime
        {
            private readonly TestHostFixture _fixture;
            private HttpResponseMessage _response;

            private ListingLookupResponse _listingLookupResponse;

            public given_valid_listing_id(TestHostFixture fixture)
            {
                _fixture = fixture;
            }

            public async Task InitializeAsync()
            {
                _fixture.Clear();

                _fixture.Factory.MockedListingStoreAccess.Setup(service => service.GetListing(It.IsAny<string>()))
                    .ReturnsAsync(TestHelper.ValidListingModel.WithFirstActiveDescription("Test description"));
                _fixture.Factory.DelegatingTestHandler.SetupResponse(HttpStatusCode.OK, new AgentPropertyDto());

                _response = await _fixture.Client.GetAsync($"/active-listings/{TestHelper.ValidListingId}");

                var json = await _response.Content.ReadAsStringAsync();
                _listingLookupResponse = JsonConvert.DeserializeObject<ListingLookupResponse>(json);
            }

            [Fact]
            public void then_the_response_code_should_indicate_ok()
            {
                _response.StatusCode.ShouldBe(HttpStatusCode.OK);
            }

            [Fact]
            public void then_the_response_is_not_null() => _listingLookupResponse.ShouldNotBeNull();

            [Fact]
            public void then_the_response_contains_the_id() => _listingLookupResponse.ListingUri.ShouldNotBeNull();

            [Fact]
            public void then_the_property_details_are_returned() => _listingLookupResponse.PropertyDetails.ShouldNotBeNull();

            [Fact]
            public void then_the_listing_details_are_returned() => _listingLookupResponse.ListingDetails.ShouldNotBeNull();

            public Task DisposeAsync() => Task.CompletedTask;
        }
    }

    namespace and_the_listing_is_not_active
    {
        [Collection("UnitTests")]
        public class given_valid_listing_id : IAsyncLifetime
        {
            private readonly TestHostFixture _fixture;
            private HttpResponseMessage _response;

            public given_valid_listing_id(TestHostFixture fixture)
            {
                _fixture = fixture;
            }

            public async Task InitializeAsync()
            {
                _fixture.Clear();

                _fixture.Factory.MockedListingStoreAccess.Setup(service => service.GetListing(It.IsAny<string>()))
                    .ReturnsAsync(TestHelper.ValidListingModel.WithNoActiveListing);

                _response = await _fixture.Client.GetAsync($"/active-listings/{TestHelper.ValidListingId}");
            }

            [Fact]
            public void then_the_response_code_should_indicate_not_found() => _response.StatusCode.ShouldBe(HttpStatusCode.NotFound);

            public Task DisposeAsync() => Task.CompletedTask;
        }
    }
}
