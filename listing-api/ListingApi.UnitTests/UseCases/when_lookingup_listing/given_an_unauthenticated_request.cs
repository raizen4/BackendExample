
using ListingApi.UnitTests;
using Newtonsoft.Json;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ListingApi.UnitTests.Setup;
using Xunit;

namespace when_lookingup_listing
{
    [Collection("FailAuthTest")]
    public class given_an_unauthenticated_request : IAsyncLifetime
    {
        private readonly FailAuthHostFixture _fixture;
        private HttpResponseMessage _response;

        public given_an_unauthenticated_request(FailAuthHostFixture fixture)
        {
            _fixture = fixture;

        }

        public async Task InitializeAsync()
        {
            _response = await _fixture.Client.GetAsync($"/listings/lookup?agentPropertyUri={TestHelper.ValidUprn}");
        }

        [Fact]
        public void then_the_response_code_should_indicate_unauthenticated()
        {
            _response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
