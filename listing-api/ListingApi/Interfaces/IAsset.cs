namespace ListingApi.Interfaces
{
    public interface IAsset
    {
        public string Uri { get; set; }
        public string Name { get; set; }
        public int FileSize { get; set; }
        public string FileType { get; set; }
    }
}
