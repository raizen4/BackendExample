using ListingApi.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace ListingApi.Models
{
    public class Image : IAsset
    {
        [Required]
        public string Uri { get; set; }

        public string Caption { get; set; }

        [Required]
        public bool IsPrimary { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int FileSize { get; set; }

        public string FileType { get; set; }
    }
}
