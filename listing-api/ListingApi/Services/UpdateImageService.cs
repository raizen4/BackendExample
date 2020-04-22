using System;
using System.Collections.Generic;
using System.Linq;
using ListingApi.Models.Cosmos;
using ListingApi.Models;

namespace ListingApi.Services
{
    public static class UpdateImagesService
    {
        public static Listing PatchImagesAdd(Listing listingToUpdate, Image image)
        {
            if (listingToUpdate == null)
            {
                throw new ArgumentNullException(nameof(listingToUpdate));
            }

            listingToUpdate.Draft.Images.Add(image);


            return listingToUpdate;
        }

        public static Listing RemoveImagesFromListing(Listing listingToUpdate, IList<string> imageUris)
        {
            if (listingToUpdate == null)
            {
                throw new ArgumentNullException(nameof(listingToUpdate));
            }

            listingToUpdate.Draft.Images = listingToUpdate.Draft.Images.Where(currentImage => !imageUris.Contains(currentImage.Uri)).ToList();

            return listingToUpdate;
        }
    }
}
