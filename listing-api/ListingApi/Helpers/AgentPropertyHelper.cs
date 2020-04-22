using System;
using System.Threading.Tasks;
using ListingApi.Interfaces.Clients;
using ListingApi.Interfaces.Helpers;
using ListingApi.Models.AgentProperty;
using ListingApi.Models.Domain;

namespace ListingApi.Helpers
{
    public class AgentPropertyHelper : IAgentPropertyHelper
    {
        private readonly IAgentPropertyClient _agentPropertyClient;

        public AgentPropertyHelper(IAgentPropertyClient agentPropertyClient)
        {
            _agentPropertyClient = agentPropertyClient;
        }

        public async Task<AgentPropertyDto> SyncAgentProperty(ListingRequest listing)
        {
            if (listing == null)
            {
                throw new ArgumentNullException(nameof(listing));
            }

            var property = listing.PropertyDetails;

            return await _agentPropertyClient.UpdateProperty(property, listing.Synthetic);
        }
    }
}
