import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const allowedFileTypes = ['.png', '.jpeg', '.jpg'];

export const storageOption = (destination: string) => {
  return diskStorage({
    destination: destination,
    filename: (req, file, cb) => {
      const newName = Date.now().toString() + '-' + uuidv4().replace(/-/g, '');
      const extension = extname(file.originalname);
      cb(null, `${newName}${extension}`);
    },
  });
};

export const fileFilter = (
  req,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  const extension = extname(file.originalname);
  if (!allowedFileTypes.includes(extension.toLowerCase())) {
    cb(new Error('Invalid file type'), false);
  } else {
    cb(null, true);
  }
};
