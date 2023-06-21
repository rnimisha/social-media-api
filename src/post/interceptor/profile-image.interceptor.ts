import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { fileFilter, storageOption } from 'src/common/helper';

export const ProfileImageInterceptorOptions: MulterOptions = {
  storage: storageOption('./uploads/profile'),
  fileFilter: fileFilter,
};
