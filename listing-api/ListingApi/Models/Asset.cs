using ListingApi.Interfaces;

namespace ListingApi.Models
{
    public class Asset : IAsset
    {
        public string Uri { get; set; }
        public string Name { get; set; }
        public int FileSize { get; set; }
        public string FileType { get; set; }
    }
}
