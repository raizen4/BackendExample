import create, { SetState } from 'zustand';
import IMetropixStore from './types';

const initialValues: Pick<
  IMetropixStore,
  'imageLoaded' | 'imageUrl' | 'imageFailed'
> = {
  imageLoaded: false,
  imageUrl: '',
  imageFailed: false
};

const store = create<IMetropixStore>((set: SetState<IMetropixStore>) => ({
  ...initialValues,
  setImageFailed: (imageFailed: boolean) => {
    set({ imageFailed });
  },
  setImageLoaded: (imageLoaded: boolean) => {
    set({ imageLoaded });
  },
  setImageUrl: (imageUrl: string) => {
    set({ imageUrl });
  }
}));

export const resetMetropixStore = () => {
  const [, api] = store;
  api.setState({ ...initialValues });
};

export default store;
