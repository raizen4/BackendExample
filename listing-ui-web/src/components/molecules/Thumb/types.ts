import { ForwardRefExoticComponent } from 'react';
import { ListingAsset } from '../../organisms/CreateListingForm/types';

export interface IWrappedThumb
  extends ForwardRefExoticComponent<
    IWrappedThumbProps & React.RefAttributes<HTMLImageElement>
  > {
  muiName: string;
}

export interface IThumbProps extends IWrappedThumbProps {
  style?: React.CSSProperties;
  cols: number;
}

export interface IWrappedThumbProps {
  image: ListingAsset;
  onCurrentAssetClick: () => void;
  isGroupSelected: boolean;
  isSelected: boolean;
  handleToggleFromGroupSelect: () => void;
  i: number;
}
