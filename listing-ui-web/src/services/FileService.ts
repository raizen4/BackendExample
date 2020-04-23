import { FILE_DOMAIN_URL } from './../configuration/domains';
import axios from 'axios';
import { IFile } from '../types/File';

const contentType = 'application/json';

const BuildHeaders = () => ({
  headers: {
    Accept: contentType,
    'Content-Type': contentType
  }
});

export const PostFile = async (data: unknown, config: object) => {
  try {
    const res = await axios.post<IFile>(`${FILE_DOMAIN_URL}`, data, {
      ...BuildHeaders(),
      ...config
    });

    if (res.status !== 200) {
      return null;
    }

    return res.data;
  } catch (e) {
    throw new Error(`Error uploading image: ${e}`);
  }
};
