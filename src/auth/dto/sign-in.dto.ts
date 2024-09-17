import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @IsEmail()
  username: string;
  
  @IsStrongPassword()
  password: string;
}
