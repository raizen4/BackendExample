import { ListingAsset } from '../CreateListingForm/types';

export const getFirstFiveAssetsToUpload = (
  allAssets: ListingAsset[]
): ListingAsset[] => {
  const assets: ListingAsset[] = [];

  let count = 0;

  if (allAssets) {
    for (let i = 0; i < allAssets.length; i++) {
      const asset = allAssets[i];

      if (count > 4) {
        break;
      }
      if (
        asset &&
        asset.file &&
        asset.uri === '' &&
        asset.isUploading &&
        !asset.error
      ) {
        assets.push(asset);
        count++;
      }
    }
  }

  return assets;
};
