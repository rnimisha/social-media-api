import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const allowedFileTypes = ['.png', '.jpeg', '.jpg'];
export const PostImageInterceptorOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/posts',
    filename: (req, file, cb) => {
      const newName = Date.now().toString() + '-' + uuidv4().replace(/-/g, '');
      const extension = extname(file.originalname);

      cb(null, `${newName}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const extension = extname(file.originalname);
    if (!allowedFileTypes.includes(extension.toLowerCase())) {
      cb(new Error('File type is not'), false);
    } else {
      cb(null, true);
    }
  },
};
