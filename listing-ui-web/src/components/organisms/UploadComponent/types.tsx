export interface FileWithPath extends File {
  path?: string;
}

export interface IUploadComponentProps {
  isImageUpload: boolean;
  multipleFiles: boolean;
  name?: string;
  fileTypes: string[];
  fieldName: string;
  showPreview: boolean;
}
