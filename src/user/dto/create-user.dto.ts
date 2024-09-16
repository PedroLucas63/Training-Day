import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class CreateUserDto {
  @IsString()
  @Length(3, 45)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @Match('password', { message: "Passwords don't match" })
  confirmPassword: string;
}
