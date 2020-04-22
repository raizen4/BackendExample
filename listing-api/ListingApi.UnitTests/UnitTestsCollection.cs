﻿using Xunit;

namespace ListingApi.UnitTests
{
    [CollectionDefinition("UnitTests")]

    public class UnitTestsCollection : ICollectionFixture<TestHostFixture>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}
