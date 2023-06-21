import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { fileFilter, storageOption } from 'src/common/helper';

export const PostImageInterceptorOptions: MulterOptions = {
  storage: storageOption('./uploads/posts'),
  fileFilter: fileFilter,
};
