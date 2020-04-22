using Xunit;

namespace ListingApi.UnitTests
{
    [CollectionDefinition("FailAuthTest")]

    public class FailAuthTestCollection : ICollectionFixture<FailAuthHostFixture>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}
