using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Net.Http.Headers;
using Xunit;

namespace ListingApi.UnitTests
{
    public class FailAuthHostFixture : ICollectionFixture<MockingWebApplicationFactory<Startup>>
    {
        public readonly HttpClient Client;
        public readonly MockingWebApplicationFactory<Startup> Factory;

        public FailAuthHostFixture()
        {
            Factory = new MockingWebApplicationFactory<Startup>(passesAuth:false);
            Client = Factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false,
            });
        }

        public void Clear()
        {
            Factory.MockedListingStoreAccess.Invocations.Clear();
        }
    }
}
