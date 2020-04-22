using System.Threading.Tasks;
using ListingApi.Models.AgentProperty;

namespace ListingApi.Interfaces.Clients
{
    public interface IAgentPropertyClient
    {
        public Task<AgentPropertyDto> GetProperty(string agentPropertyUri);
        public Task<AgentPropertyDto> UpdateProperty(AgentPropertyDto agentPropertyDto, bool synthetic);
    }
}
