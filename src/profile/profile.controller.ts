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
import { confirmUserMatch } from '../common/decorator/confirm-user-match';
import { UpdateUserDto } from './dto';
import { ProfileType, UpdateProfileType } from './types';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProfileImageInterceptorOptions } from '../post/interceptor';
import { extractProfileImg } from '../common/helper';
import { ApiNotFoundResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('profile/:user')
@ApiTags('Profile')
@ApiSecurity('JWT-access')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiNotFoundResponse({ description: 'User not found' })
  getUserProfile(@Param('user') user: string): Promise<ProfileType> {
    return this.profileService.getUserProfile(user);
  }

  @Put()
  @ApiNotFoundResponse({ description: 'User not found' })
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
    const images = files ? extractProfileImg(files) : {};
    return this.profileService.updateUserProfile(username, data, images);
  }

  @Delete()
  @ApiNotFoundResponse({ description: 'User not found' })
  deleteUserProfile(
    @confirmUserMatch() username: string,
  ): Promise<{ msg: string }> {
    return this.profileService.deleteUserProfile(username);
  }
}
