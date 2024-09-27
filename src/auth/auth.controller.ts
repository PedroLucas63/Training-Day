import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from 'src/decorators/public.decorator';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'User successfully signed in',
    type: SignInDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Not confirmed user',
  })
  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
