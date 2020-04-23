import { PostFile } from './FileService';
import {
  PatchImagesForListing,
  RequestRemoveImageFromListing
} from './ListingService';
import { ListingAsset } from '../components/organisms/CreateListingForm/types';
import { IAsset } from '../types/Asset';
import { FILE_DOMAIN_URL } from '../configuration/domains';

export const RemoveImageFromListing = async (
  imagesToDelete: string[],
  listingUri: string
) => {
  const imagesDeleted: string[] = [];

  const apiResponse = await RequestRemoveImageFromListing(
    listingUri,
    imagesToDelete
  );

  imagesToDelete.forEach(imageToDelete => {
    const found = apiResponse.images.find(
      imageDeletedUri => imageDeletedUri.uri === imageToDelete
    );
    if (!found) {
      imagesDeleted.push(imageToDelete);
    }
  });

  return imagesDeleted;
};

export const PostAssets = async (
  assets: ListingAsset[],
  abortController: AbortController,
  listingId: string | null = null
): Promise<ListingAsset[]> => {
  return Promise.all(
    assets.map(async asset => {
      return (await ProcessAsset<ListingAsset>(
        asset,
        listingId,
        abortController
      )) as ListingAsset;
    })
  );
};

export const ProcessAsset = async <T extends ListingAsset>(
  asset: T,
  listingId: string | null = null,
  abortController: AbortController
): Promise<T | null> => {
  if (!asset.file) {
    return null;
  }
  try {
    const formData = new FormData();

    formData.append('details', JSON.stringify({}));
    formData.append('file', asset.file);

    const config = {
      signal: abortController.signal
    };

    const fileUploaded = await PostFile(formData, config);

    if (!fileUploaded) {
      return {
        ...asset,
        isUploaded: false,
        isUploading: false,
        error: true
      } as T;
    }

    if (listingId) {
      //If it has a listingId, we are patching images
      const convertedImage = asset as IAsset;
      convertedImage.uri = fileUploaded.location;

      const updateListingWithImage = await PatchImagesForListing(
        listingId,
        convertedImage
      );

      if (!updateListingWithImage) {
        return {
          ...asset,
          isUploaded: false,
          isUploading: false,
          error: true
        } as T;
      }
    }

    return {
      ...asset,
      isUploaded: true,
      isUploading: false,
      error: false,
      uri: fileUploaded.location
    } as T;
  } catch (err) {
    return {
      ...asset,
      isUploaded: false,
      isUploading: false,
      error: true
    } as T;
  }
};

export const FilterAssets = (
  dataToFilter: ListingAsset[],
  imageResponse: ListingAsset[]
): ListingAsset[] => {
  const imageErrors = imageResponse.filter(
    imageUploaded => imageUploaded?.error
  );

  const filteredAssets = dataToFilter.filter(
    (currentImage: ListingAsset) =>
      !imageErrors.find(errorImage => currentImage.id === errorImage.id)
  );

  filteredAssets.forEach((successfullyAddedAsset: ListingAsset) => {
    const assetToUpdate = imageResponse.filter(
      (asset: ListingAsset) => asset.id === successfullyAddedAsset.id
    );

    if (assetToUpdate && assetToUpdate.length > 0) {
      successfullyAddedAsset.uri = assetToUpdate[0].uri;
      successfullyAddedAsset.isUploaded = true;
      successfullyAddedAsset.isUploading = false;
    }
  });

  return filteredAssets;
};

export const GetExternalImageUrl = (provider: string, id: string): string => {
  return `${FILE_DOMAIN_URL}/external/${provider}/${id}?t=${Date.now()}`;
};
