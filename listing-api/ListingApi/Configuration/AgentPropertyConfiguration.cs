using System;
using Microsoft.Extensions.Configuration;

namespace ListingApi.Configuration
{
    public class AgentPropertyConfiguration
    {
        private readonly IConfiguration _configuration;

        public AgentPropertyConfiguration(IConfiguration config)
        {
            _configuration = config;
        }

        public Uri BaseUrl => new Uri(_configuration["Shared:AgentProperty:BaseUrl"]);
    }
}
