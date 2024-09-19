import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('created-trainings')
  findCreatedTrainings(@CurrentUser() currentUser: any) {
    console.log('Current User:', currentUser);
    return this.userService.findCreatedTrainings(currentUser['sub']);
  }

  @Get('trainings')
  findAllTrainings(@CurrentUser() currentUser: any) {
    return this.userService.findAllTrainings(currentUser['sub']);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ) {
    if (currentUser['sub'] !== id) {
      throw new ForbiddenException(
        'You do not have permission to update this user',
      );
    }

    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    if (currentUser['sub'] !== id) {
      throw new ForbiddenException(
        'You do not have permission to remove this user',
      );
    }

    return this.userService.remove(id);
  }

  @Patch(':id/password')
  updatePassword(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @CurrentUser() currentUser: any,
  ) {
    if (currentUser['sub'] !== id) {
      throw new ForbiddenException(
        'You do not have permission to update this user',
      );
    }

    return this.userService.updatePassword(id, updateUserPasswordDto);
  }

  @Patch(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './public/imgs/avatars',
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const fileName = `${req.params.id}${fileExtName}`;
          callback(null, fileName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  updateAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: any,
  ) {
    if (currentUser['sub'] !== id) {
      throw new ForbiddenException(
        'You do not have permission to update this user',
      );
    }

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const avatarPath = `imgs/avatars/${file.filename}`;

    return this.userService.updateAvatar(id, avatarPath);
  }

  @Public()
  @Get('/send-email-confirmation/:id')
  sendEmailConfirmation(@Param('id') id: string) {
    return this.userService.sendEmailConfirmation(id);
  }

  @Public()
  @Get('/confirmation/:id')
  confirmUser(@Param('id') id: string) {
    return this.userService.confirmUser(id);
  }
}
