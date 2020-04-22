using System.Threading.Tasks;
using ListingApi.Models.AgentProperty;
using ListingApi.Models.Domain;

namespace ListingApi.Interfaces.Helpers
{
    public interface IAgentPropertyHelper
    {
        public Task<AgentPropertyDto> SyncAgentProperty(ListingRequest listing);
    }
}
