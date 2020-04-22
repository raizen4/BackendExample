using Microsoft.Extensions.Configuration;

namespace ListingApi.Configuration
{
    public class ListingApiConfiguration
    {
        private readonly IConfiguration _configuration;

        public ListingApiConfiguration(IConfiguration config)
        {
            _configuration = config;
        }

        public int? SythenticTimeToLive => _configuration.GetValue<int?>("Shared:SyntheticData:TimeToLive");
        public int? DefaultTimeToLive => _configuration.GetValue<int?>("DefaultTimeToLive");
    }
}
