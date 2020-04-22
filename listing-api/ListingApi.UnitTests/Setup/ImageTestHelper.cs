using System;
using System.Collections.Generic;
using System.Linq;
using ListingApi.Models;
using ListingApi.Models.Cosmos;
using ListingApi.Models.Dto;

namespace ListingApi.UnitTests.Setup
{
    public static class ImageTestHelper
    {
        public static Image ValidImage => new Image()
        {
            Uri = "http://somePath/r23424f/Bedroom3.png",
            IsPrimary = false,
            FileSize = 211231,
            Name = "Bedroom3.png",
            Caption = "A beautiful bedroom"
        };
        public static List<Image> ValidImages => new List<Image>()
        {
            ValidImage,
            new Image()
            {
                Uri = "http://somePath/t423432/Bedroom2.png",
                IsPrimary = false,
                FileSize = 143244,
                Name = "Bedroom2.png",
                Caption = "Some caption 2"
            },
            new Image()
            {
                Uri = "http://somePath/t423432/Bedroom4.png",
                IsPrimary = false,
                FileSize = 234234,
                Name = "Bedroom4.png",
                Caption = "Some caption 4"
            },
        };

        public static Listing WithImages(this Listing listing, List<Image> images)
        {
            listing.Draft.Images = images;
            return listing;
        }

        public static List<Image> WithoutImageUris(this List<Image> images, List<string> imageUris)
        {
            foreach (var imageUri in imageUris)
            {
                var toRemove = images.FirstOrDefault(image => image.Uri == imageUri);
                if (toRemove != null)
                {
                    images.Remove(toRemove);
                }
            }

            return images;
        }
    }
}