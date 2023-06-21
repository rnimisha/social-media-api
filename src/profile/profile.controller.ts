import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile/:user')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getUserProfile(@Param('user') user: string) {
    return this.profileService.getUserProfile(user);
  }

  @Put()
  updateUserProfile() {
    return this.profileService.updateUserProfile();
  }

  @Delete()
  deleteUserProfile() {
    return this.profileService.deleteUserProfile();
  }
}
