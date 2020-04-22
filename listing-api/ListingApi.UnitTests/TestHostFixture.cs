using System;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using Xunit;

namespace ListingApi.UnitTests
{
    public class TestHostFixture : ICollectionFixture<MockingWebApplicationFactory<Startup>>
    {
        public readonly HttpClient Client;
        public readonly MockingWebApplicationFactory<Startup> Factory;

        public TestHostFixture()
        {
            Factory = new MockingWebApplicationFactory<Startup>(passesAuth: true);

            Client = Factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false,
            });

        }

        public void Clear()
        {
            Factory.MockedListingStoreAccess.Invocations.Clear();
            Factory.MockedAuditListingStoreAccess.Invocations.Clear();
            Factory.DelegatingTestHandler.Reset();
        }
    }
}
