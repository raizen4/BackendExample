export interface IAsset {
  id: string;
  uri: string;
  name: string;
  fileSize: number;
  fileType: string;
  isPrimary: boolean | null;
  caption: string | null;
}
