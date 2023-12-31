import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { fileFilter, storageOption } from '../../common/helper';

export const ProfileImageInterceptorOptions: MulterOptions = {
  storage: storageOption('./uploads/profile'),
  fileFilter: fileFilter,
};
