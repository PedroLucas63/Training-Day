import {
  IsDate,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsAgeGreaterThan } from 'src/decorators/is-age-greater-than.decorator';

export class UpdateUserDto {
  @IsString()
  @Length(3, 45)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsDateString()
  @IsAgeGreaterThan(13, { message: 'User must be at least 13 years old' })
  dateOfBirth?: Date;
}
