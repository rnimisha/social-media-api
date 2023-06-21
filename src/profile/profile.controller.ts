import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { confirmUserMatch } from 'src/common/decorator/confirm-user-match';
import { UpdateUserDto } from './dto';
import { ProfileType, UpdateProfileType } from './types';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProfileImageInterceptorOptions } from 'src/post/interceptor';

@Controller('profile/:user')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getUserProfile(@Param('user') user: string): Promise<ProfileType> {
    return this.profileService.getUserProfile(user);
  }

  @Put()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePic', maxCount: 1 },
        { name: 'coverPic', maxCount: 1 },
      ],
      ProfileImageInterceptorOptions,
    ),
  )
  updateUserProfile(
    @confirmUserMatch() username: string,
    @UploadedFiles()
    files: {
      profilePic?: Express.Multer.File[];
      coverPic?: Express.Multer.File[];
    },
    @Body() data: UpdateUserDto,
  ): Promise<UpdateProfileType> {
    console.log(files);
    return this.profileService.updateUserProfile(username, data);
  }

  @Delete()
  deleteUserProfile(
    @confirmUserMatch() username: string,
  ): Promise<{ msg: string }> {
    return this.profileService.deleteUserProfile(username);
  }
}
