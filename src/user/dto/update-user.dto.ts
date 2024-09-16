import {
  IsDate,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(3, 45)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;
}
