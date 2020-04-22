using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ListingApi.CustomExceptions;
using ListingApi.Interfaces.Clients;
using ListingApi.Models.AgentProperty;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace ListingApi.Clients
{
    public class AgentPropertyClient : IAgentPropertyClient
    {
        private readonly ILogger<AgentPropertyClient> _logger;
        private readonly HttpClient _agentPropertyClient;

        public AgentPropertyClient(IHttpClientFactory clientFactory, ILogger<AgentPropertyClient> logger)
        {
            if (clientFactory == null)
            {
                throw new ArgumentNullException(nameof(clientFactory));
            }
            _agentPropertyClient = clientFactory.CreateClient("AgentPropertyApi");
            _logger = logger;
        }

        public async Task<AgentPropertyDto> GetProperty(string agentPropertyUri)
        {
            var uri = BuildUri(agentPropertyUri, _agentPropertyClient);
            var response = await _agentPropertyClient.GetAsync(uri);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                _logger.LogDebug($"{nameof(AgentPropertyClient)}: existing AgentProperty found");
                var json = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<AgentPropertyDto>(json);
            }
            else
            {
                throw new AgentPropertyRequestException(response);
            }
        }

        public async Task<AgentPropertyDto> UpdateProperty(AgentPropertyDto agentPropertyDto, bool synthetic)
        {
            var uri = BuildUri(agentPropertyDto.Uri, _agentPropertyClient);
            var content = new StringContent(JsonConvert.SerializeObject(agentPropertyDto));
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var request = new HttpRequestMessage(HttpMethod.Put, uri)
            {
                Content = content
            };

            if (synthetic)
            {
                request.Headers.Add("Synthetic", "true");
            }

            var response = await _agentPropertyClient.SendAsync(request);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                _logger.LogDebug($"{nameof(AgentPropertyClient)}: AgentProperty updated");
                var json = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<AgentPropertyDto>(json);
            }
            else
            {
                _logger.LogDebug($"{nameof(AgentPropertyClient)}: Error updating AgentProperty");
                throw new AgentPropertyRequestException(response);
            }
        }

        public Uri BuildUri(string agentPropertyUri, HttpClient client)
        {
            if (client == null)
            {
                throw new ArgumentNullException(nameof(client));
            }
            var uriBuilder = new UriBuilder(client.BaseAddress)
            {
                Path = agentPropertyUri
            };
            return uriBuilder.Uri;
        }
    }
}
