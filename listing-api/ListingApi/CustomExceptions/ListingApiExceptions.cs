using System;
using System.Net.Http;

namespace ListingApi.CustomExceptions
{

    [Serializable]
    public class CosmosUpdateImagesException : Exception
    {
        public CosmosUpdateImagesException(string message) : base(message) { }
    }

    [Serializable]
    public class CosmosCreateAuditEventException : Exception
    {
        public CosmosCreateAuditEventException(string message) : base(message) { }
    }

    [Serializable]
    public class CosmosRetrieveAuditEventException : Exception
    {
        public CosmosRetrieveAuditEventException(string message) : base(message) { }
    }

    [Serializable]
    public class CosmosCreateListingException : Exception
    {
        public CosmosCreateListingException(string message) : base(message) { }
    }

    [Serializable]
    public class CosmosRetrieveListingException : Exception
    {
        public CosmosRetrieveListingException(string message) : base(message) { }
    }

    [Serializable]
    public class CosmosUpdateListingException : Exception
    {
        public CosmosUpdateListingException(string message) : base(message) { }
    }

    [Serializable]
    public class CompanyIdNotFoundException : Exception
    {
        public CompanyIdNotFoundException(string message) : base(message) { }
    }

    [Serializable]
    public class InvalidSyntheticException : Exception
    {
        public InvalidSyntheticException(string message) : base(message) { }
    }

    [Serializable]
    public class AgentPropertyRequestException : Exception
    {
        public AgentPropertyRequestException(string message) : base(message) { }

        public AgentPropertyRequestException(HttpResponseMessage response) : base($"Status Code: {response?.StatusCode}") { }
    }
}
