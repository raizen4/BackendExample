import { DropEvent } from 'react-dropzone';

export interface IClasses {
  root?: string | undefined;
}

export interface ICustomDropzoneProps {
  handleOnDrop<T extends File>(
    acceptedFiles: T[],
    rejectedFiles: T[],
    event: DropEvent
  ): void;
  classes?: IClasses | undefined;
  multipleFiles: boolean;
  name?: string;
  fileTypes: string[];
}
