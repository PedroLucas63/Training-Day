import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    minLength: 3,
    maxLength: 45,
    example: 'John Doe',
  })
  @IsString()
  @Length(3, 45)
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@doe.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    minLength: 8,
    maxLength: 24,
    example: 'John123$',
  })
  @IsStrongPassword()
  @Length(8, 24)
  password: string;

  @ApiProperty({
    description: 'Confirm user password',
    example: 'John123$',
  })
  @Match('password', { message: "Passwords don't match" })
  confirmPassword: string;
}
