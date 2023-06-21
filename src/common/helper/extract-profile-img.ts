import { ImageFileType } from '../types';

export const extractProfileImg = (files: ImageFileType) => {
  const images = Object.keys(files).reduce((acc, current) => {
    const data = files[current][0].filename;
    return { ...acc, [current]: data };
  }, {});

  return images;
};
