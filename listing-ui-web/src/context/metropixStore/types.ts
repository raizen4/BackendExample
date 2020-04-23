export default interface IMetropixStore {
  imageFailed: boolean;
  imageUrl: string;
  imageLoaded: boolean;
  setImageUrl: (imageUrl: string) => void;
  setImageLoaded: (imageLoaded: boolean) => void;
  setImageFailed: (imageFailed: boolean) => void;
}
