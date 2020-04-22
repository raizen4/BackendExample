using System;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using System.Collections.Generic;
using System.Linq;
using WebApi.TestUtils;
using Microsoft.Extensions.Hosting;
using ListingApi.Interfaces.DataAccess;

namespace ListingApi.UnitTests
{
    public class MockingWebApplicationFactory<TStartup>
        : WebApplicationFactory<TStartup> where TStartup : class
    {
        public MockingWebApplicationFactory(bool passesAuth)
        {
            PassesAuth = passesAuth;

        }
        public Mock<IListingStore> MockedListingStoreAccess { get; private set; }

        public Mock<IAuditListingStore> MockedAuditListingStoreAccess { get; private set; }


        public readonly RequestTrackingTestHandler DelegatingTestHandler = new RequestTrackingTestHandler();

        public bool PassesAuth { get; set; }


        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                var searchDescriptor = services.Where(d => d.ServiceType == typeof(IListingStore) || d.ServiceType == typeof(IAuditListingStore)).ToList();
                if (searchDescriptor.Any())
                {
                    foreach(var service in searchDescriptor)
                    {
                        services.Remove(service);
                    }
                }
                MockedListingStoreAccess = new Mock<IListingStore>();
                MockedAuditListingStoreAccess = new Mock<IAuditListingStore>();

                services.AddSingleton(MockedListingStoreAccess.Object);
                services.AddSingleton(MockedAuditListingStoreAccess.Object);

                services.AddAuthentication("Pass")
                    .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                        "Pass", options => { })
                    .AddScheme<AuthenticationSchemeOptions, TestFailAuthHandler>("Fail", options => { });


                services.AddAuthorization(configure =>
                {
                    var builder = new AuthorizationPolicyBuilder(new List<string> { PassesAuth ? "Pass" : "Fail" }.ToArray())
                        .AddRequirements(new DenyAnonymousAuthorizationRequirement());
                    configure.DefaultPolicy = builder.Build();
                });

                services
                    .AddHttpClient("AgentPropertyApi", client => client.BaseAddress = new Uri("https://localhost:3000/"))
                    .ConfigurePrimaryHttpMessageHandler(() => DelegatingTestHandler);
            });
        }
    }
}
