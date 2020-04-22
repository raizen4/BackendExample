using ListingApi.UnitTests.Setup;
using Xunit;

namespace ListingApi.UnitTests.UseCases
{
    public class HelperTests
    {
        public class TestClass
        {
            public bool something { get; set; }
            public string somethingelse { get; set; }
            public int someint { get; set; }

        }
        public class ComplexTestClass
        {
            public TestClass Inner { get; set; }
        }

        [Fact]
        public void returns_empty_on_null_model()
        {
            var a = new ListingApi.Models.ListingDetails();

            Assert.True(a.IsEmpty());
        }

        [Fact]
        public void retuns_empty_on_blank_strings()
        {

            var a = new TestClass();

            Assert.True(a.IsEmpty());
        }

        [Fact]
        public void returns_empty_on_complex_empty()
        {
            var a = new ComplexTestClass();

            Assert.True(a.IsEmpty());
        }

        [Fact]
        public void returns_empty_complex_with_default_inner()
        {
            var a = new ComplexTestClass() { Inner = new TestClass() };
            Assert.True(a.IsEmpty());
        }

        [Fact]
        public void returns_not_empty_on_any_val()
        {
            var a = new Models.ListingDetails() { Id = "abcd" };

            Assert.False(a.IsEmpty());
        }

        [Fact]
        public void returns_not_empty_on_InnerVal()
        {
            var a = new ComplexTestClass() { Inner = new TestClass() { somethingelse = "abcd" } };

            Assert.False(a.IsEmpty());
        }
    }
}
