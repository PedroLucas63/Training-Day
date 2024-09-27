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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    description: 'User created successfully',
  })
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    description: 'Users found successfully',
    isArray: true,
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    description: 'User found successfully',
  })
  @Get('/me')
  findMe(@CurrentUser() currentUser: any) {
    return this.userService.findOne(currentUser['sub']);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get created trainings' })
  @ApiResponse({
    description: 'User created trainings successfully',
    isArray: true,
  })
  @Get('created-trainings')
  findCreatedTrainings(@CurrentUser() currentUser: any) {
    console.log('Current User:', currentUser);
    return this.userService.findCreatedTrainings(currentUser['sub']);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user trainings' })
  @ApiResponse({
    description: 'User trainings successfully',
    isArray: true,
  })
  @Get('trainings')
  findAllTrainings(@CurrentUser() currentUser: any) {
    return this.userService.findAllTrainings(currentUser['sub']);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
  })
  @ApiResponse({
    description: 'User found successfully',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
  })
  @ApiResponse({
    description: 'User updated successfully',
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove user' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
  })
  @ApiResponse({
    description: 'User deleted successfully',
  })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    if (currentUser['sub'] !== id) {
      throw new ForbiddenException(
        'You do not have permission to remove this user',
      );
    }

    return this.userService.remove(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user password' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
  })
  @ApiResponse({
    description: 'User updated password successfully',
  })
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user avatar',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
  })
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        avatar: {
          title: 'Avatar',
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    description: 'User updated avatar successfully',
  })
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
  ): Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
    accountConfirmed: boolean;
    dateOfBirth: Date | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
  }> {
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

  @ApiOperation({ summary: 'Send email confirmation' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
  })
  @ApiResponse({
    description: 'Email sent successfully',
  })
  @Public()
  @Get('/send-email-confirmation/:id')
  sendEmailConfirmation(@Param('id') id: string) {
    return this.userService.sendEmailConfirmation(id);
  }

  @ApiOperation({ summary: 'Confirm user' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
  })
  @ApiResponse({
    description: 'User confirmed successfully',
  })
  @Public()
  @Get('/confirmation/:id')
  confirmUser(@Param('id') id: string) {
    return this.userService.confirmUser(id);
  }
}
