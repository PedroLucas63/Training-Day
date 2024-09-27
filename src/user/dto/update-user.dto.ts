import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional({
    description: 'User date of birth',
    example: new Date().toISOString(),
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  @IsAgeGreaterThan(13, { message: 'User must be at least 13 years old' })
  dateOfBirth?: Date;
}
