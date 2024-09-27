import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'User email',
    example: 'john@doe.com',
  })
  @IsEmail()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'John123$',
  })
  @IsStrongPassword()
  password: string;
}
