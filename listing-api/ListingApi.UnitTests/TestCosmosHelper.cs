using ListingApi.CustomExceptions;
using ListingApi.Interfaces.DataAccess;
using ListingApi.Models.Cosmos;
using Moq;

namespace ListingApi.UnitTests
{
    public static class TestCosmosHelper
    {

        public static Mock<IListingStore> WithErrorResponseOnAnyListingRequest(this Mock<IListingStore> mock)
        {
            mock.Setup(s => s.UpdateListing(It.IsAny<Listing>())).ThrowsAsync(new CosmosUpdateListingException("Cosmos error when updateing a listing"));
            mock.Setup(service => service.CreateListing(It.IsAny<Listing>()))
              .ThrowsAsync(new CosmosUpdateListingException("Cosmos error when creating a listing"));
            mock.Setup(service => service.GetListing(It.IsAny<string>()))
              .ThrowsAsync(new CosmosRetrieveListingException("Cosmos error when getting a listing"));
            return mock;
        }
    }
}
