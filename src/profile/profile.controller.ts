import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { getCurrentUser } from 'src/common/decorator';
import { confirmUserMatch } from 'src/common/decorator/confirm-user-match';

@Controller('profile/:user')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getUserProfile(@Param('user') user: string) {
    return this.profileService.getUserProfile(user);
  }

  @Put()
  updateUserProfile(@confirmUserMatch() username: string) {
    return this.profileService.updateUserProfile(username);
  }

  @Delete()
  deleteUserProfile(@confirmUserMatch() username: string) {
    return this.profileService.deleteUserProfile(username);
  }
}
